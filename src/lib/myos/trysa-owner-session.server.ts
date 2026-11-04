/**
 * TRYSA-hosted OAuth → owner-only YomiOnalaru MY OS session.
 *
 * TRYSA, not this website, handles email/PIN, lockouts and the user's
 * authentication. This site validates TRYSA's confidential OAuth token and
 * authorizes a single pinned TRYSA subject — never a supplied email address.
 * Encrypted, HttpOnly cookies contain the short-lived authorization; nothing
 * secret reaches React/localStorage. No automatic CRM writes or sharing.
 */
import {
  createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual,
} from "node:crypto";

export const TRYSA_OAUTH_CLIENT_ID = "yomionalaru_myos";
const TRYSA_BASE = "https://trysa.app";
const SESSION_COOKIE = "__Host-my_os_owner";
const TRANSACTION_COOKIE = "__Host-my_os_oauth";
const MAX_TRANSACTION_AGE = 600;
const MAX_SESSION_AGE = 900;
const PUBLIC_ORIGIN = "https://yomionalaru.com";
const CALLBACK_PATH = "/api/auth/trysa/callback";
const SCOPE = "workspaces.read clients.read bookings.read";

type Transaction = { state: string; verifier: string; exp: number };
type Session = { sub: string; workspace: string; access: string; scopes: string[]; exp: number };
type Identity = { subject: string; workspace_id: string; client_id: string; scopes: string[] };

function config() {
  const key = process.env.MYOS_TRYSA_COOKIE_KEY_B64 ?? "";
  const owner = process.env.MYOS_TRYSA_OWNER_SUB ?? "";
  const clientSecret = process.env.MYOS_TRYSA_CLIENT_SECRET ?? "";
  const keyBytes = Buffer.from(key, "base64url");
  const origin = process.env.MYOS_PUBLIC_ORIGIN || PUBLIC_ORIGIN;
  if (keyBytes.length !== 32 || !/^[0-9a-f-]{36}$/i.test(owner) ||
      !clientSecret || !origin.startsWith("https://") ||
      (origin !== PUBLIC_ORIGIN && !origin.endsWith(".workers.dev"))) return null;
  return { key: keyBytes, owner, clientSecret, origin, redirect: origin + CALLBACK_PATH };
}
function seal(value: object, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}
function open<T>(token: string | undefined, key: Buffer): T | null {
  if (!token || token.length > 3500) return null;
  try {
    const bytes = Buffer.from(token, "base64url");
    if (bytes.length < 30) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, bytes.subarray(0,12));
    decipher.setAuthTag(bytes.subarray(12,28));
    return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString("utf8")) as T;
  } catch { return null; }
}
function cookie(request: Request, name: string): string | undefined {
  const value = (request.headers.get("cookie") || "").split(";").map(x => x.trim())
    .find(x => x.startsWith(name + "="));
  return value?.slice(name.length + 1);
}
function setCookie(name: string, value: string, age: number): string {
  return `${name}=${value}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}`;
}
export const clearOwnerCookie = () => setCookie(SESSION_COOKIE, "", 0);
const clearTransactionCookie = () => setCookie(TRANSACTION_COOKIE, "", 0);

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
function validOrigin(request: Request, origin: string) {
  return new URL(request.url).origin === origin;
}
function notConfigured() {
  return new Response("TRYSA owner sign-in is not configured yet.", {
    status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
export function startTrysaOwnerOAuth(request: Request): Response {
  const cfg = config();
  if (!cfg) return notConfigured();
  if (!validOrigin(request, cfg.origin)) return new Response("Invalid origin", {status: 400});
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const txn: Transaction = { state, verifier, exp: Date.now() + MAX_TRANSACTION_AGE*1000 };
  const authorize = new URL("/api/public/onaru/oauth/authorize", TRYSA_BASE);
  authorize.searchParams.set("response_type","code");
  authorize.searchParams.set("client_id",TRYSA_OAUTH_CLIENT_ID);
  authorize.searchParams.set("redirect_uri",cfg.redirect);
  authorize.searchParams.set("code_challenge_method","S256");
  authorize.searchParams.set("code_challenge",challenge);
  authorize.searchParams.set("scope",SCOPE);
  authorize.searchParams.set("state",state);
  return new Response(null,{status:302,headers:{
    Location: authorize.toString(), "Cache-Control":"no-store",
    "Set-Cookie":setCookie(TRANSACTION_COOKIE,seal(txn,cfg.key),MAX_TRANSACTION_AGE),
  }});
}
async function identity(accessToken: string): Promise<Identity | null> {
  if (!/^onaru_at_[A-Za-z0-9_-]+$/.test(accessToken)) return null;
  try {
    const response = await fetch(TRYSA_BASE + "/api/public/onaru/oauth/me",{
      headers:{Authorization:`Bearer ${accessToken}`},
      redirect:"error", signal:AbortSignal.timeout(9000),
    });
    if (!response.ok) return null;
    const value = await response.json() as Identity;
    if (value.client_id !== TRYSA_OAUTH_CLIENT_ID || !value.subject ||
      !value.workspace_id || !Array.isArray(value.scopes) ||
      !["workspaces.read","clients.read","bookings.read"].every(s => value.scopes.includes(s))) return null;
    return value;
  } catch {return null;}
}
export async function finishTrysaOwnerOAuth(request: Request): Promise<Response> {
  const cfg = config();
  if (!cfg) return notConfigured();
  if (!validOrigin(request,cfg.origin)) return new Response("Invalid origin",{status:400});
  const url = new URL(request.url);
  const txn = open<Transaction>(cookie(request,TRANSACTION_COOKIE),cfg.key);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const headers = new Headers({"Cache-Control":"no-store","Set-Cookie":clearTransactionCookie()});
  if (!txn || txn.exp < Date.now() || !safeEqual(txn.state,state) ||
      !/^onaru_ac_[A-Za-z0-9_-]{30,}$/.test(code)) {
    return new Response("TRYSA sign-in could not be verified. Please restart sign-in.",{status:401,headers});
  }
  try {
    const payload = new URLSearchParams({
      grant_type:"authorization_code", client_id:TRYSA_OAUTH_CLIENT_ID,
      client_secret:cfg.clientSecret, code,redirect_uri:cfg.redirect, code_verifier:txn.verifier,
    });
    const tokenResponse = await fetch(TRYSA_BASE + "/api/public/onaru/oauth/token",{
      method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:payload.toString(),redirect:"error",signal:AbortSignal.timeout(9000),
    });
    if (!tokenResponse.ok) throw new Error("exchange_failed");
    const token = await tokenResponse.json() as {access_token?:string;expires_in?:number;workspace_id?:string};
    const who = await identity(token.access_token || "");
    // Owner-only: match the immutable TRYSA subject, never an email or name.
    if (!who || !safeEqual(who.subject,cfg.owner) || who.workspace_id!==token.workspace_id) {
      return new Response("This TRYSA account is not authorized to open MY OS.",{status:403,headers});
    }
    const duration = Math.max(0,Math.min(MAX_SESSION_AGE,Math.floor(Number(token.expires_in||0))-30));
    if (duration < 60) throw new Error("short_token");
    const session:Session = {
      sub:who.subject,workspace:who.workspace_id,access:token.access_token!,
      scopes:who.scopes,exp:Date.now()+duration*1000,
    };
    headers.append("Set-Cookie",setCookie(SESSION_COOKIE,seal(session,cfg.key),duration));
    headers.set("Location",cfg.origin+"/admin/my-os");
    return new Response(null,{status:303,headers});
  } catch {
    return new Response("TRYSA sign-in could not be completed. Please retry.",{status:502,headers});
  }
}
export async function verifiedOwnerSession(request: Request): Promise<{workspaceId:string;accessToken:string}|null> {
  const cfg=config();
  if (!cfg) return null;
  const session=open<Session>(cookie(request,SESSION_COOKIE),cfg.key);
  if (!session || typeof session.exp!=="number" || session.exp < Date.now() ||
      !safeEqual(String(session.sub||""),cfg.owner) || typeof session.access!=="string") return null;
  // Verify the bearer still corresponds to this person and workspace on TRYSA;
  // revocation, scope reduction and expired grants therefore fail closed.
  const who=await identity(session.access);
  if (!who || !safeEqual(who.subject,cfg.owner)||who.workspace_id!==session.workspace ||
      !["workspaces.read","clients.read","bookings.read"].every(s=>who.scopes.includes(s))) return null;
  return {workspaceId:who.workspace_id,accessToken:session.access};
}
export const myosAuthIsConfigured=()=>Boolean(config());

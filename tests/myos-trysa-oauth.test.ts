import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  startTrysaOwnerOAuth,
  finishTrysaOwnerOAuth,
  verifiedOwnerSession,
} from "../src/lib/myos/trysa-owner-session.server";

const ORIGIN = "https://yomionalaru.com";
const OWNER = "c55d346b-066d-46f0-99e0-617cc6053978";
const OTHER = "e3ca3411-ae80-4201-8145-26a3f22293cb";
const WORKSPACE = "b3e1407d-718a-4ca8-bbe3-e0ad1d092dfc";
const CLIENT = "yomionalaru_myos";
const TOKEN = "onaru_at_0123456789abcdef_test_fixture_token";
const CODE = "onaru_ac_abcdefghijklmnopqrstuvwxyzABCDEF1234567890";
const envKeys = [
  "MYOS_TRYSA_COOKIE_KEY_B64",
  "MYOS_TRYSA_OWNER_SUB",
  "MYOS_TRYSA_CLIENT_SECRET",
  "MYOS_PUBLIC_ORIGIN",
] as const;

const prior = Object.fromEntries(envKeys.map(k => [k, process.env[k]]));
const originalFetch = globalThis.fetch;

function setup() {
  process.env.MYOS_TRYSA_COOKIE_KEY_B64 = Buffer.alloc(32, 7).toString("base64url");
  process.env.MYOS_TRYSA_OWNER_SUB = OWNER;
  process.env.MYOS_TRYSA_CLIENT_SECRET = "synthetic-only-not-a-real-client-secret";
  process.env.MYOS_PUBLIC_ORIGIN = ORIGIN;
}
function cookieFrom(response: Response): string {
  const header = response.headers.get("set-cookie");
  if (!header) throw new Error("Missing Set-Cookie");
  return header.split(";")[0];
}
function getStart() {
  return startTrysaOwnerOAuth(new Request(ORIGIN + "/api/auth/trysa/start"));
}
function callback(state: string, cookie: string) {
  const url = new URL(ORIGIN + "/api/auth/trysa/callback");
  url.searchParams.set("code", CODE);
  url.searchParams.set("state", state);
  return new Request(url, { headers: { cookie } });
}
function mockProvider(subject = OWNER, scopes = ["workspaces.read", "clients.read", "bookings.read"]) {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith("/api/public/onaru/oauth/token")) {
      return Response.json({ access_token: TOKEN, workspace_id: WORKSPACE, expires_in: 900 });
    }
    if (url.endsWith("/api/public/onaru/oauth/me")) {
      return Response.json({ subject, workspace_id: WORKSPACE, client_id: CLIENT, scopes });
    }
    throw new Error("Unexpected upstream request " + url);
  }) as typeof fetch;
}
beforeEach(() => {
  setup();
  globalThis.fetch = originalFetch;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of envKeys) {
    if (prior[key] === undefined) delete process.env[key];
    else process.env[key] = prior[key];
  }
});

describe("TRYSA MY OS owner OAuth handoff", () => {
  it("fails closed if owner-side credentials have not been provisioned", () => {
    delete process.env.MYOS_TRYSA_CLIENT_SECRET;
    const response = getStart();
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
  it("creates a PKCE S256 TRYSA redirect with an encrypted short-lived transaction cookie", () => {
    const result = getStart();
    expect(result.status).toBe(302);
    const target = new URL(result.headers.get("location")!);
    expect(target.origin).toBe("https://trysa.app");
    expect(target.searchParams.get("client_id")).toBe(CLIENT);
    expect(target.searchParams.get("code_challenge_method")).toBe("S256");
    expect(target.searchParams.get("code_challenge")!.length).toBeGreaterThan(32);
    expect(target.searchParams.get("redirect_uri")).toBe(ORIGIN + "/api/auth/trysa/callback");
    const sessionCookie = result.headers.get("set-cookie")!;
    expect(sessionCookie).toContain("HttpOnly");
    expect(sessionCookie).toContain("Secure");
    expect(sessionCookie).toContain("SameSite=Lax");
    expect(sessionCookie).not.toContain("synthetic-only");
  });
  it("rejects mismatched state without exchanging an authorization code", async () => {
    const start = getStart();
    let upstreamCalls = 0;
    globalThis.fetch = (async () => { upstreamCalls++; return Response.json({}); }) as typeof fetch;
    const result = await finishTrysaOwnerOAuth(callback("wrong-state", cookieFrom(start)));
    expect(result.status).toBe(401);
    expect(upstreamCalls).toBe(0);
  });
  it("rejects missing login transaction cookies", async () => {
    const result = await finishTrysaOwnerOAuth(callback("irrelevant", ""));
    expect(result.status).toBe(401);
  });
  it("creates a short-lived owner session only after TRYSA verifies the exact subject", async () => {
    const start = getStart();
    const state = new URL(start.headers.get("location")!).searchParams.get("state")!;
    mockProvider();
    const callbackResult = await finishTrysaOwnerOAuth(callback(state, cookieFrom(start)));
    expect(callbackResult.status).toBe(303);
    expect(callbackResult.headers.get("location")).toBe(ORIGIN + "/admin/my-os");
    expect(callbackResult.headers.get("set-cookie")).toContain("__Host-my_os_owner=");
    const cookies = callbackResult.headers.getSetCookie();
    const ownerCookie = cookies.find(c => c.startsWith("__Host-my_os_owner="));
    expect(ownerCookie).toBeDefined();
    const verified = await verifiedOwnerSession(new Request(ORIGIN + "/api/admin/myos-owner-session", {
      headers: { cookie: ownerCookie!.split(";")[0] },
    }));
    expect(verified?.workspaceId).toBe(WORKSPACE);
    expect(verified?.accessToken).toBe(TOKEN);
  });
  it("rejects an authenticated TRYSA account that is not the approved owner", async () => {
    const start = getStart();
    const state = new URL(start.headers.get("location")!).searchParams.get("state")!;
    mockProvider(OTHER);
    const result = await finishTrysaOwnerOAuth(callback(state, cookieFrom(start)));
    expect(result.status).toBe(403);
    expect(result.headers.getSetCookie().some(c => c.startsWith("__Host-my_os_owner="))).toBe(false);
  });
  it("rejects missing approved workspace scopes", async () => {
    const start = getStart();
    const state = new URL(start.headers.get("location")!).searchParams.get("state")!;
    mockProvider(OWNER, ["workspaces.read"]);
    const result = await finishTrysaOwnerOAuth(callback(state, cookieFrom(start)));
    expect(result.status).toBe(403);
  });
  it("invalidates owner session when TRYSA identity no longer matches", async () => {
    const start = getStart();
    const state = new URL(start.headers.get("location")!).searchParams.get("state")!;
    mockProvider();
    const result = await finishTrysaOwnerOAuth(callback(state, cookieFrom(start)));
    const ownerCookie = result.headers.getSetCookie().find(c => c.startsWith("__Host-my_os_owner="))!.split(";")[0];
    mockProvider(OTHER);
    const verified = await verifiedOwnerSession(new Request(ORIGIN + "/api/admin/myos-owner-session", {
      headers: {cookie:ownerCookie},
    }));
    expect(verified).toBeNull();
  });
});

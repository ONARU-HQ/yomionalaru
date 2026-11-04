/**
 * MY OS side of the signed TRYSA handshake.
 * Server only. Never import into a React component or browser bundle.
 *
 * This module is inert unless both parties' validated attestations, a
 * workspace-scoped TRYSA OAuth access token, and MY OS's own Ed25519 signing
 * key are configured privately on the Cloudflare Worker.
 */
import {
  createHash, createPrivateKey, createPublicKey, randomBytes, sign, verify,
} from "node:crypto";

const CONTRACT_ID = "myos-trysa-crm-v1";
const TRYSA_STATUS_URL = "https://trysa.app/api/public/integrations/myos/v1/status";
const hex64 = /^[0-9a-f]{64}$/;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Party = "myos" | "trysa";
type Key = { keyId: string; publicKeyPem: string; status: "active" | "revoked" };
type Attestation = { keyId: string; signature: string };
type Registry = Record<Party, Key>;
type Attestations = Record<Party, Attestation>;

function attestationBytes(party: Party, digest: string) {
  return Buffer.from(`MYOS-TRYSA-CONTRACT-ATTESTATION-V1\n${party}\n${digest}`, "utf8");
}
function verifiedAttestations(digest: string, registry: Registry, signatures: Attestations) {
  if (!hex64.test(digest) || !registry?.myos || !registry?.trysa) return false;
  if (registry.myos.status !== "active" || registry.trysa.status !== "active") return false;
  if (!registry.myos.keyId || !registry.trysa.keyId || registry.myos.keyId === registry.trysa.keyId) return false;
  try {
    const myos = createPublicKey(registry.myos.publicKeyPem);
    const trysa = createPublicKey(registry.trysa.publicKeyPem);
    if (myos.asymmetricKeyType !== "ed25519" || trysa.asymmetricKeyType !== "ed25519") return false;
    if (Buffer.from(myos.export({ format: "der", type: "spki" })).equals(
      Buffer.from(trysa.export({ format: "der", type: "spki" }))
    )) return false;
    for (const party of ["myos", "trysa"] as const) {
      const value = signatures?.[party];
      if (!value || value.keyId !== registry[party].keyId ||
          !/^[A-Za-z0-9_-]{64,128}$/.test(value.signature)) return false;
      const publicKey = party === "myos" ? myos : trysa;
      if (!verify(null, attestationBytes(party, digest), publicKey,
        Buffer.from(value.signature, "base64url"))) return false;
    }
    return true;
  } catch { return false; }
}

type Configuration = {
  digest: string; registry: Registry; keyId: string; workspaceId: string;
  privateKeyPem: string; accessToken: string;
};

function loadConfig(): Configuration | null {
  const digest = process.env.MYOS_TRYSA_CONTRACT_DIGEST ?? "";
  const keys = process.env.MYOS_TRYSA_TRUSTED_PUBLIC_KEYS_JSON;
  const signatures = process.env.MYOS_TRYSA_ATTESTATIONS_JSON;
  const keyId = process.env.MYOS_TRYSA_KEY_ID ?? "";
  const workspaceId = process.env.MYOS_TRYSA_WORKSPACE_ID ?? "";
  const privateKeyPem = process.env.MYOS_TRYSA_PRIVATE_KEY_PEM ?? "";
  const accessToken = process.env.MYOS_TRYSA_OAUTH_ACCESS_TOKEN ?? "";
  if (!keys || !signatures || !keyId || !uuid.test(workspaceId) ||
      !privateKeyPem || !accessToken || !hex64.test(digest)) return null;
  try {
    const registry = JSON.parse(keys) as Registry;
    if (registry.myos?.keyId !== keyId ||
        !verifiedAttestations(digest, registry, JSON.parse(signatures) as Attestations)) return null;
    const privateKey = createPrivateKey(privateKeyPem.replace(/\\n/g, "\n"));
    if (privateKey.asymmetricKeyType !== "ed25519") return null;
    const challenge = Buffer.from("myos-local-key-verification");
    if (!verify(null, challenge, createPublicKey(registry.myos.publicKeyPem),
      sign(null, challenge, privateKey))) return null;
    return { digest, registry, keyId, workspaceId, privateKeyPem, accessToken };
  } catch { return null; }
}

function sha256(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

/** Identical wire format to TRYSA v1, length-prefixed UTF-8 components. */
function signedBytes(request: Request, env: {
  contractId: string; contractDigest: string; sender: Party; recipient: Party;
  keyId: string; workspaceId: string; timestamp: string; nonce: string; bodySha256: string;
}) {
  const url = new URL(request.url);
  const values = [
    "MYOS-TRYSA-SIGNED-REQUEST-V1", request.method.toUpperCase(), url.origin,
    url.pathname + url.search, request.headers.get("content-type") ?? "",
    sha256(request.headers.get("authorization") ?? ""),
    env.contractId, env.contractDigest, env.sender, env.recipient,
    env.keyId, env.workspaceId, env.timestamp, env.nonce, env.bodySha256,
  ];
  return Buffer.from(values.map(v => `${Buffer.byteLength(v, "utf8")}:${v}`).join("\n"), "utf8");
}

export type ContractConnectionResult = {
  connected: boolean;
  state: "not_configured" | "verified" | "rejected" | "unavailable";
  message: string;
  syncActive: boolean;
};

/**
 * Read-only signed handshake. Only reports verification; it never requests
 * customer data, modifies CRM records, or signs the bilateral contract itself.
 */
export async function testTrysaContract(): Promise<ContractConnectionResult> {
  const config = loadConfig();
  if (!config) return {
    connected: false, state: "not_configured", syncActive: false,
    message: "Both independent service attestations, signing identity and scoped OAuth configuration are required.",
  };

  const request = new Request(TRYSA_STATUS_URL, {
    method: "GET",
    headers: { authorization: `Bearer ${config.accessToken}` },
  });
  const envelope = {
    contractId: CONTRACT_ID,
    contractDigest: config.digest,
    sender: "myos" as const,
    recipient: "trysa" as const,
    keyId: config.keyId,
    workspaceId: config.workspaceId,
    timestamp: new Date().toISOString(),
    nonce: randomBytes(24).toString("base64url"),
    bodySha256: sha256(Buffer.alloc(0)),
  };
  const key = createPrivateKey(config.privateKeyPem.replace(/\\n/g, "\n"));
  const signature = sign(null, signedBytes(request, envelope), key).toString("base64url");
  const headers = new Headers(request.headers);
  headers.set("x-myos-signed-envelope", Buffer.from(JSON.stringify({
    ...envelope, signature,
  })).toString("base64url"));
  try {
    const response = await fetch(new Request(request, { headers }), {
      redirect: "error", signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return {
      connected: false, state: "rejected", syncActive: false,
      message: `TRYSA refused the verification handshake (HTTP ${response.status}).`,
    };
    const data = await response.json() as Record<string, unknown>;
    if (data.code !== "verified" || data.contract_id !== CONTRACT_ID ||
        data.workspace_authorized !== true || data.crm_sync_active !== false) {
      return { connected: false, state: "rejected", syncActive: false,
        message: "TRYSA did not return the required verified contract response." };
    }
    return { connected: true, state: "verified", syncActive: false,
      message: "Both services verified the handshake. CRM data synchronization is not enabled." };
  } catch {
    return { connected: false, state: "unavailable", syncActive: false,
      message: "TRYSA could not be reached or the handshake timed out." };
  }
}

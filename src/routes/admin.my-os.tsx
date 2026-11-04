import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, LockKeyhole, ShieldCheck, ShieldAlert, RefreshCw, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/my-os")({
  component: MyOsContract,
  head: () => ({ meta: [
    { title: "MY OS ↔ TRYSA Security — Yomi Onalaru Admin" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
});

type Status = {
  connected: boolean;
  state: "not_configured" | "verified" | "rejected" | "unavailable";
  syncActive: boolean;
  message: string;
};

function MyOsContract() {
  const { session } = useAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!session?.access_token) {
      setError("Sign in again to check the connection.");
      return;
    }
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const res = await fetch("/api/admin/myos-trysa-status", {
        method: "GET",
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: "no-store",
      });
      if (!res.ok) {
        setError(res.status === 403 ? "Super Admin permission required." :
          res.status === 401 ? "Session expired. Sign in again." :
          "The secure handshake service is unavailable.");
        return;
      }
      setStatus(await res.json() as Status);
    } catch {
      setError("The connection check failed. No CRM data was accessed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireRank min={4}>
      <AdminHeader
        title="MY OS ↔ TRYSA"
        description="Independent service identities, bilateral signing and controlled CRM access."
        action={<Link to="/admin" className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.18em] hover:text-gold">Admin home</Link>}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-gold/10 p-3 text-gold"><LockKeyhole className="h-5 w-5" /></span>
            <div><h2 className="font-display text-2xl">Bilateral contract</h2><p className="text-xs text-muted-foreground">myos-trysa-crm-v1</p></div>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            MY OS and TRYSA must each sign the exact same contract with independent Ed25519 keys.
            A verified handshake also requires a workspace-approved TRYSA OAuth grant.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <Row title="MY OS signing identity" value="Server-side only" />
            <Row title="TRYSA verifying identity" value="Independent key" />
            <Row title="Scope" value="Read-only handshake" />
            <Row title="CRM client writes" value="Disabled" />
            <Row title="Database migration" value="Not required" />
          </div>
          <a href="https://github.com/ONARU-HQ/trysahq/pull/7"
            target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-gold hover:underline">
            Review technical contract <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="rounded-3xl border border-border/70 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-2xl bg-gold/10 p-3 text-gold"><KeyRound className="h-5 w-5" /></span>
            <div><h2 className="font-display text-2xl">Connection test</h2><p className="text-xs text-muted-foreground">Only a Super Admin can run this check.</p></div>
          </div>
          <div aria-live="polite" className="rounded-2xl border border-border/60 bg-black/20 p-5">
            {status?.connected ? <ShieldCheck className="mb-3 h-6 w-6 text-green-400" /> :
              <ShieldAlert className="mb-3 h-6 w-6 text-amber-400" />}
            <h3 className="text-lg font-medium">
              {status?.connected ? "Handshake verified" :
                status ? "Connection not active" : "Not checked"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {status?.message ??
                "A manual check verifies the installed signing configuration, TRYSA consent and signed request response. It does not synchronize CRM records."}
            </p>
            {status && <p className="mt-3 text-xs text-muted-foreground">
              CRM synchronization: {status.syncActive ? "Active" : "Inactive"}
            </p>}
            {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
          </div>
          <button type="button" onClick={() => void check()} disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Verifying…" : "Run secure handshake"}
          </button>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            No signing keys, OAuth tokens, client details or financial records are returned to this page.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-gold/30 p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Activation is intentionally manual.</strong>
        <p className="mt-2 leading-6">
          Complete independent key provisioning, contract signature verification, exact workspace consent
          and negative security testing on both backends before enabling CRM relationship reads.
          This administration screen does not publish, import or modify customer records.
        </p>
      </div>
    </RequireRank>
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-3">
    <span className="text-muted-foreground">{title}</span><span className="text-right text-xs font-medium">{value}</span>
  </div>;
}

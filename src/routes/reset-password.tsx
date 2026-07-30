import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({
    meta: [
      { title: "Set a new password — Yomi Onalaru Studio" },
      { name: "description", content: "Choose a new password for your studio account." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Set a new password" },
      { property: "og:description", content: "Choose a new password for your studio account." },
    ],
  }),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    void supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    void navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-4xl gold-text">New password</h1>
        {!ready && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Open this page from the reset link in your email.
          </p>
        )}
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="New password" required minLength={8} autoComplete="new-password"
            className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-gold/60"
          />
          <button
            type="submit" disabled={busy || !ready}
            className="w-full rounded-full bg-gold py-3 text-xs font-medium uppercase tracking-[0.24em] text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

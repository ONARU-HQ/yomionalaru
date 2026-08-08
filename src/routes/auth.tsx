import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Yomi Onalaru Studio" },
      { name: "description", content: "Private sign-in for the Yomi Onalaru content studio." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Sign in — Yomi Onalaru Studio" },
      { property: "og:description", content: "Private sign-in for the Yomi Onalaru content studio." },
    ],
  }),
});

function safePath(p?: string) {
  if (!p || !p.startsWith("/") || p.startsWith("//")) return "/admin";
  return p;
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"pin" | "signin" | "signup" | "reset">("pin");
  const [pin, setPin] = useState("");
  const pinSignIn = useServerFn(signInWithPin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) void navigate({ to: safePath(redirect), replace: true });
  }, [loading, user, navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("Password reset link sent. Check your inbox.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) setSent("Account created. Check your email to confirm, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (res.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="grid min-h-screen place-items-center px-6 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/10 blur-[150px]" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center justify-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 font-display text-xl text-gold">Y</span>
        </Link>

        <h1 className="text-center font-display text-4xl gold-text">
          {mode === "signup" ? "Create account" : mode === "reset" ? "Reset password" : "Studio sign in"}
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Private access to the Yomi Onalaru content studio.
        </p>

        {sent && (
          <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-center text-sm text-gold">{sent}</div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <input
              value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
              className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-gold/60"
            />
          )}
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required autoComplete="email"
            className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-gold/60"
          />
          {mode !== "reset" && (
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-gold/60"
            />
          )}
          <button
            type="submit" disabled={busy}
            className="w-full rounded-full bg-gold py-3 text-xs font-medium uppercase tracking-[0.24em] text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}
          </button>
        </form>

        {mode !== "reset" && (
          <>
            <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
            <button
              onClick={google}
              className="w-full rounded-full border border-border py-3 text-xs uppercase tracking-[0.24em] hover:border-gold/50 hover:text-gold"
            >
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-8 flex flex-col items-center gap-2 text-xs text-muted-foreground">
          {mode !== "signin" && <button onClick={() => { setMode("signin"); setSent(null); }} className="hover:text-gold">Back to sign in</button>}
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("signup"); setSent(null); }} className="hover:text-gold">Need an account? Create one</button>
              <button onClick={() => { setMode("reset"); setSent(null); }} className="hover:text-gold">Forgot your password?</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

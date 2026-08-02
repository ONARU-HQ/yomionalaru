import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  source = "site",
  compact = false,
  className,
}: { source?: string; compact?: boolean; className?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email address.");
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.trim().toLowerCase(),
      name: name.trim() || null,
      source,
    });
    setBusy(false);
    if (error) {
      toast.error("Something went wrong. Try again in a moment.");
      return;
    }
    setDone(true);
    setEmail("");
    setName("");
    toast.success("You're on the list.");
  };

  if (done) {
    return (
      <p className={cn("text-sm text-gold", className)}>
        Thank you — the next letter lands in your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={cn("flex w-full flex-col gap-3 sm:flex-row", className)}>
      {!compact && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          aria-label="First name"
          className="w-full rounded-full border border-border bg-transparent px-5 py-3 text-sm outline-none focus:border-gold/60 sm:max-w-[180px]"
        />
      )}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="w-full flex-1 rounded-full border border-border bg-transparent px-5 py-3 text-sm outline-none focus:border-gold/60"
      />
      <button
        type="submit"
        disabled={busy}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-gold-soft disabled:opacity-50"
      >
        {busy ? "Joining…" : "Subscribe"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

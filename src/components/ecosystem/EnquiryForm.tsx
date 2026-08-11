import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ENQUIRY_TYPES, enquirySchema, useSubmitEnquiry } from "@/lib/enquiries";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-xl border border-border/70 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/60";

type Props = {
  /** Lock the form to one enquiry type (used by the speaking page). */
  fixedType?: string;
  heading?: string;
  className?: string;
};

export function EnquiryForm({ fixedType, heading, className }: Props) {
  const submit = useSubmitEnquiry();
  const [type, setType] = useState(fixedType ?? "photography");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const isSpeaking = type === "speaking";
  const isProject = ["photography", "studio", "trysa", "partnership"].includes(type);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    const payload = { ...values, enquiry_type: type };
    setErrors({});
    try {
      const parsed = enquirySchema.parse(payload);
      await submit.mutateAsync(parsed);
      setDone(true);
      toast.success("Thank you — your message is with Yomi.");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const map: Record<string, string> = {};
        for (const issue of err.issues) map[String(issue.path[0])] = issue.message;
        setErrors(map);
        toast.error("Please check the highlighted fields.");
        return;
      }
      toast.error(err instanceof Error ? err.message : "Could not send your message.");
    }
  }

  if (done) {
    return (
      <div className={cn("rounded-3xl border border-gold/30 bg-white/[0.02] p-10", className)}>
        <h3 className="font-display text-3xl">Received.</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Thank you for reaching out. Every enquiry is read personally — you will hear back at the
          email address you provided.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("rounded-3xl border border-border/60 bg-white/[0.015] p-8 md:p-10", className)}
    >
      {heading && <h3 className="mb-8 font-display text-3xl">{heading}</h3>}

      {!fixedType && (
        <div className="mb-8">
          <span className="eyebrow mb-4 block">What is this about?</span>
          <div className="flex flex-wrap gap-2">
            {ENQUIRY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition-colors",
                  type === t.value
                    ? "border-gold/60 text-gold"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors["name"]}>
          <input name="name" className={input} placeholder="Your name" maxLength={120} required />
        </Field>
        <Field label="Email" error={errors["email"]}>
          <input
            name="email"
            type="email"
            className={input}
            placeholder="you@company.com"
            maxLength={255}
            required
          />
        </Field>
        <Field label="Company or brand" error={errors["company"]}>
          <input name="company" className={input} placeholder="Optional" maxLength={160} />
        </Field>
        <Field label="Phone" error={errors["phone"]}>
          <input name="phone" className={input} placeholder="Optional" maxLength={40} />
        </Field>

        {isSpeaking && (
          <>
            <Field label="Event name" error={errors["event_name"]}>
              <input name="event_name" className={input} maxLength={200} />
            </Field>
            <Field label="Event date" error={errors["event_date"]}>
              <input name="event_date" className={input} placeholder="e.g. March 2026" maxLength={120} />
            </Field>
            <Field label="Location" error={errors["event_location"]}>
              <input name="event_location" className={input} maxLength={200} />
            </Field>
            <Field label="Audience size" error={errors["audience_size"]}>
              <input name="audience_size" className={input} maxLength={60} />
            </Field>
          </>
        )}

        {isProject && (
          <>
            <Field label="Budget range" error={errors["budget"]}>
              <input name="budget" className={input} placeholder="Optional" maxLength={120} />
            </Field>
            <Field label="Timeline" error={errors["timeline"]}>
              <input name="timeline" className={input} placeholder="Optional" maxLength={120} />
            </Field>
          </>
        )}

        <Field label="Message" error={errors["message"]} full>
          <textarea
            name="message"
            rows={6}
            className={cn(input, "resize-y")}
            placeholder="Tell me about the work, the timing and what success looks like."
            maxLength={4000}
            required
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submit.isPending}
        className="mt-8 rounded-full bg-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.22em] text-primary-foreground transition hover:bg-gold-soft disabled:opacity-60"
      >
        {submit.isPending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-2 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section, Reveal } from "@/components/ui-primitives";
import { CONTACT, SOCIALS } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Yomi Onalaru" },
      { name: "description", content: "Get in touch with Yomi Onalaru — collaborations, speaking, press and investment." },
      { property: "og:title", content: "Contact — Yomi Onalaru" },
      { property: "og:description", content: "Let's build something worth remembering." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Contact</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Let's build <span className="gold-shine">something.</span>
          </h1>
        </Reveal>
      </section>

      <Section>
        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="rounded-3xl glass p-8 md:p-10"
            >
              <div className="grid gap-6">
                <Field label="Name" name="name" placeholder="Your name" required />
                <Field label="Email" name="email" type="email" placeholder="you@domain.com" required />
                <Field label="Company" name="company" placeholder="Optional" />
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Message</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tell me about your project…"
                    className="mt-2 w-full resize-none rounded-xl border border-border bg-black/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sent}
                  className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_var(--gold)] transition hover:bg-gold-soft disabled:opacity-60"
                >
                  {sent ? "Message received — I'll be in touch." : "Send message"}
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-8">
              <InfoRow k="Email" v={CONTACT.email} href={`mailto:${CONTACT.email}`} />
              <InfoRow k="Book a call" v="Calendly" href={CONTACT.calendly} />
              <InfoRow k="Based in" v={CONTACT.location} />
              <div className="pt-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Elsewhere</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SOCIALS.personal.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-border bg-black/30 px-4 py-2 text-xs text-foreground/80 hover:border-gold/50 hover:text-gold"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] uppercase tracking-[0.3em] text-gold/80">{label}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder} required={required}
        className="mt-2 w-full rounded-xl border border-border bg-black/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold/50 focus:outline-none"
      />
    </div>
  );
}

function InfoRow({ k, v, href }: { k: string; v: string; href?: string }) {
  const val = href ? (
    <a href={href} target="_blank" rel="noreferrer" className="text-foreground hover:text-gold">{v}</a>
  ) : (
    <span className="text-foreground/90">{v}</span>
  );
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{k}</div>
      <div className="mt-2 font-display text-2xl">{val}</div>
    </div>
  );
}

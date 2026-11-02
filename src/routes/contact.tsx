import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { Section, Reveal } from "@/components/ui-primitives";
import { CONTACT, CONTACT_CATEGORIES, SOCIALS } from "@/lib/site-data";
import { EnquiryForm } from "@/components/ecosystem/EnquiryForm";

const CategorySchema = z.object({ category: z.string().optional() }).partial();

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => CategorySchema.parse(s),
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Yomi Onalaru" },
      { name: "description", content: "Reach out for speaking, consulting, creative direction, partnerships, media, technology or photography." },
      { property: "og:title", content: "Contact — Yomi Onalaru" },
      { property: "og:description", content: "Open inbox for meaningful conversations." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const search = Route.useSearch();
  const initial = useMemo(() => {
    const c = CONTACT_CATEGORIES.find((x) => x.key === search.category);
    return c ?? CONTACT_CATEGORIES[0];
  }, [search.category]);

  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Contact</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Let's start a <span className="gold-shine">conversation.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            For speaking, consulting, creative direction, partnerships, press, technology and photography — the inbox is open.
          </p>
        </Reveal>
      </section>

      <Section>
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <EnquiryForm initialType={initial.key === "creative" ? "photography" : initial.key === "speaking" ? "speaking" : initial.key === "partnerships" ? "partnership" : "other"} heading="Send an enquiry" />
          </Reveal>

          <div className="space-y-6">
            <Reveal>
              <div className="rounded-3xl glass p-8">
                <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Direct</div>
                <a href={`mailto:${CONTACT.email}`} className="mt-4 block font-display text-2xl hover:text-gold">
                  {CONTACT.email}
                </a>
                <p className="mt-3 text-sm text-muted-foreground">
                  Everything comes directly to me.
                </p>
                <div className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {CONTACT.location}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-3xl glass p-8">
                <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Elsewhere</div>
                <div className="mt-4 flex flex-col gap-2">
                  {SOCIALS.personal.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="text-sm text-foreground/80 hover:text-gold">
                      {s.label} — {s.handle}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({ name, type = "text", placeholder, required }: { name: string; type?: string; placeholder: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{placeholder}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-2xl border border-border bg-black/30 px-4 py-3 text-sm outline-none focus:border-gold/50"
        placeholder={placeholder}
      />
    </label>
  );
}

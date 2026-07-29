import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Section, Reveal } from "@/components/ui-primitives";
import { MENTORSHIP, MENTORSHIP_FAQ, TESTIMONIALS, SITE_URL, CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/mentorship/")({
  component: MentorshipIndex,
  head: () => ({
    meta: [
      { title: "Mentorship — Founder & Creative Business Coaching | Yomi Onalaru" },
      { name: "description", content: "Founder mentorship, systems thinking, business architecture, AI implementation and leadership — one-to-one with Yomi Onalaru." },
      { property: "og:title", content: "Mentorship with Yomi Onalaru" },
      { property: "og:description", content: "Build a company that runs on systems, not on you." },
      { property: "og:url", content: `${SITE_URL}/mentorship` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mentorship` }],
  }),
});

function MentorshipIndex() {
  return (
    <>
      <Section
        eyebrow="Mentorship"
        title={<>Build a company that <span className="gold-text">runs on systems.</span></>}
        intro="Nine focused tracks, run one-to-one. Practical, systems-first, and grounded in operating experience — not theory."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MENTORSHIP.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.04}>
              <Link to="/mentorship/$slug" params={{ slug: m.slug }} className="group block h-full">
                <div className="flex h-full flex-col rounded-3xl glass p-8 transition hover:-translate-y-1">
                  <h2 className="font-display text-2xl group-hover:text-gold">{m.title}</h2>
                  <p className="mt-4 flex-1 text-sm text-muted-foreground">{m.summary}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm text-gold">
                    Details <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Testimonials" title={<>What people <span className="gold-text">say.</span></>}>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.who} delay={i * 0.05}>
              <blockquote className="h-full rounded-3xl glass p-8">
                <p className="font-display text-xl leading-snug">“{t.quote}”</p>
                <footer className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">{t.who}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title={<>Before you <span className="gold-text">apply.</span></>}>
        <div className="grid gap-4 md:grid-cols-2">
          {MENTORSHIP_FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl glass p-6">
              <h3 className="font-display text-lg">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <a href={`mailto:${CONTACT.email}`} className="inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
            Apply — {CONTACT.email}
          </a>
        </div>
      </Section>
    </>
  );
}

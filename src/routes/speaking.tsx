import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Quote } from "lucide-react";
import { SPEAKING_TOPICS, SPEAKING_EVENTS, TESTIMONIALS, CONTACT } from "@/lib/site-data";
import { Section, Reveal } from "@/components/ui-primitives";

export const Route = createFileRoute("/speaking")({
  component: Speaking,
  head: () => ({
    meta: [
      { title: "Speaking — Yomi Onalaru" },
      { name: "description", content: "Talks on creative entrepreneurship, brand strategy, AI, and building creative infrastructure." },
      { property: "og:title", content: "Speaking — Yomi Onalaru" },
      { property: "og:description", content: "Keynotes, panels and the flagship talk — Creative Mindset Shift." },
      { property: "og:url", content: "/speaking" },
    ],
    links: [{ rel: "canonical", href: "/speaking" }],
  }),
});

function Speaking() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Speaking</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Stages, <span className="gold-shine">shifted.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Keynotes and conversations on creative entrepreneurship, brand strategy, AI, and the future of creative infrastructure.
          </p>
        </Reveal>
      </section>

      {/* Flagship talk */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] glass p-10 md:p-16">
            <div className="pointer-events-none absolute -inset-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Flagship talk</div>
                <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                  Creative Mindset Shift.
                </h2>
                <p className="mt-6 max-w-lg text-muted-foreground">
                  A 45-minute keynote on why the future of the creative economy belongs to founders who think in systems — and what it takes to rewire the way you run your business.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/contact" search={{ category: "speaking" }} className="rounded-full bg-gold px-6 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-gold-soft">
                  Book this talk
                </Link>
                <a href={`mailto:${CONTACT.email}?subject=Media%20kit%20request`} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:border-gold/50 hover:text-gold">
                  <Download className="h-4 w-4" /> Media kit
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Topics */}
      <Section eyebrow="Topics" title={<>What I <span className="gold-text">speak on.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SPEAKING_TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.05}>
              <div className="rounded-3xl glass p-8 h-full">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Topic 0{i + 1}</div>
                <div className="mt-4 font-display text-2xl">{t.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Past events */}
      <Section eyebrow="Past events" title={<>On the <span className="gold-text">circuit.</span></>}>
        <div className="grid gap-3">
          {SPEAKING_EVENTS.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.04}>
              <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-2xl glass px-6 py-5">
                <div>
                  <div className="font-display text-2xl">{e.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{e.note}</div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-gold/80">
                  {e.venue} · {e.year}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section eyebrow="Testimonials" title={<>What people <span className="gold-text">say.</span></>}>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="rounded-3xl glass p-8 h-full">
                <Quote className="h-6 w-6 text-gold/70" />
                <p className="mt-4 font-display text-xl leading-snug">"{t.quote}"</p>
                <div className="mt-6 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  — {t.who}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <Reveal>
          <Link to="/contact" search={{ category: "speaking" }}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
            Invite me to speak →
          </Link>
        </Reveal>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Reveal } from "@/components/ui-primitives";
import { SPEAKING_TOPICS, CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/speaking")({
  component: Speaking,
  head: () => ({
    meta: [
      { title: "Speaking — Yomi Onalaru" },
      { name: "description", content: "Yomi Onalaru speaks on creative entrepreneurship, brand strategy, AI, business systems and product." },
      { property: "og:title", content: "Speaking — Yomi Onalaru" },
      { property: "og:description", content: "Book Yomi Onalaru to speak on creative entrepreneurship, AI and building the future of business." },
      { property: "og:url", content: "/speaking" },
    ],
    links: [{ rel: "canonical", href: "/speaking" }],
  }),
});

function Speaking() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Speaking</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Ideas worth <span className="gold-shine">standing up for.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Keynotes, panels and workshops on creativity, entrepreneurship, AI and the systems behind modern creative businesses.
          </p>
        </Reveal>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SPEAKING_TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.05}>
              <div className="rounded-3xl glass p-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Topic 0{i + 1}</div>
                <div className="mt-3 font-display text-2xl">{t.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-6xl px-6 pb-32">
        <Reveal>
          <div className="rounded-[2rem] glass p-12 md:p-20">
            <h3 className="font-display text-3xl md:text-5xl">Book Yomi to speak.</h3>
            <p className="mt-4 max-w-xl text-muted-foreground">For keynotes, panels, workshops and private sessions.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={CONTACT.calendly} target="_blank" rel="noreferrer" className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
                Check availability
              </a>
              <Link to="/contact" className="rounded-full border border-border px-7 py-3.5 text-sm hover:border-gold/50 hover:text-gold">
                Send a brief
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

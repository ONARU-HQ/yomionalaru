import { createFileRoute } from "@tanstack/react-router";
import { Section, Reveal } from "@/components/ui-primitives";
import { JOURNAL_POSTS } from "@/lib/site-data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/journal")({
  component: Journal,
  head: () => ({
    meta: [
      { title: "Journal — Yomi Onalaru" },
      { name: "description", content: "Essays, notes and stories from Yomi Onalaru on building creative businesses in the age of AI." },
      { property: "og:title", content: "Journal — Yomi Onalaru" },
      { property: "og:description", content: "Essays and notes on creativity, product, brand and building." },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
});

function Journal() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Journal</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Notes on <span className="gold-shine">building.</span>
          </h1>
        </Reveal>
      </section>

      <Section>
        <div className="divide-y divide-border/60">
          {JOURNAL_POSTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <a href="#" className="group grid gap-6 py-10 transition md:grid-cols-[160px_1fr_auto] md:items-baseline">
                <div className="text-xs uppercase tracking-[0.3em] text-gold/70">{p.date} · {p.category}</div>
                <div>
                  <div className="font-display text-2xl md:text-4xl group-hover:text-gold-soft">{p.title}</div>
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
                <ArrowUpRight className="hidden h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold md:block" />
              </a>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

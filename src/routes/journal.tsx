import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { JOURNAL_POSTS } from "@/lib/site-data";
import { Section, Reveal } from "@/components/ui-primitives";

export const Route = createFileRoute("/journal")({
  component: Journal,
  head: () => ({
    meta: [
      { title: "Journal — Yomi Onalaru" },
      { name: "description", content: "Essays, product notes and stories on building the future of creative business." },
      { property: "og:title", content: "Journal — Yomi Onalaru" },
      { property: "og:description", content: "Long-form writing on brand, product, and creative business." },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
});

function Journal() {
  const [featured, ...rest] = JOURNAL_POSTS;
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Journal</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Notes from the <span className="gold-shine">workshop.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Essays, product notes and letters on brand, business, and building for creatives.
          </p>
        </Reveal>
      </section>

      {/* Featured — editorial */}
      <Section>
        <Reveal>
          <Link to="/journal" className="group block">
            <div className="relative overflow-hidden rounded-[2rem] glass p-10 md:p-16">
              <div className="pointer-events-none absolute -inset-40 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-gold/80">
                  <span>{featured.category}</span>
                  <span className="text-muted-foreground">{featured.date}</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {featured.readMins} min</span>
                </div>
                <h2 className="mt-6 font-display text-5xl leading-tight md:text-7xl">{featured.title}</h2>
                <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-sm text-gold">
                  Read essay <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      </Section>

      <Section eyebrow="Archive" title={<>More <span className="gold-text">writing.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <div className="group flex h-full flex-col rounded-3xl glass p-8 transition hover:-translate-y-1">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em]">
                  <span className="text-gold/80">{p.category}</span>
                  <span className="text-muted-foreground">{p.date}</span>
                </div>
                <div className="mt-6 font-display text-3xl leading-tight">{p.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-auto pt-8 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {p.readMins} min read
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gold">
                    Read <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

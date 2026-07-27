import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Section, Reveal, StatusPill } from "@/components/ui-primitives";
import { COMPANIES, FUTURE_VENTURES } from "@/lib/site-data";

export const Route = createFileRoute("/companies")({
  component: Companies,
  head: () => ({
    meta: [
      { title: "Companies — Yomi Onalaru" },
      { name: "description", content: "TRYSA, Yomi Visuals, YOFA, Folak, Shop1401 and the future ventures of Yomi Onalaru." },
      { property: "og:title", content: "Companies — Yomi Onalaru" },
      { property: "og:description", content: "An ecosystem of companies shaping the future of creative business." },
      { property: "og:url", content: "/companies" },
    ],
    links: [{ rel: "canonical", href: "/companies" }],
  }),
});

function Companies() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Companies</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            An <span className="gold-shine">ecosystem</span> of companies.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Every venture below shares a single mission — build the infrastructure that lets creative businesses scale.
          </p>
        </Reveal>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {COMPANIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link to="/companies/$slug" params={{ slug: c.slug }} className="block">
                <div className="group relative h-full overflow-hidden rounded-3xl glass p-10 transition-all duration-500 hover:-translate-y-1.5">
                  <div className={`pointer-events-none absolute -inset-40 rounded-full bg-gradient-to-br ${c.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-display text-4xl">{c.name}</div>
                        <div className="mt-2 text-sm text-gold/80">{c.tagline}</div>
                      </div>
                      <StatusPill status={c.status} />
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">{c.industry}</div>
                    <p className="mt-6 text-sm text-muted-foreground">{c.description}</p>
                    <div className="mt-10 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Est. {c.launchYear}</span>
                      <span className="inline-flex items-center gap-1 text-foreground group-hover:text-gold">
                        Explore <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Future ventures"
        title={<>What's <span className="gold-text">coming.</span></>}
        intro="A glimpse at the next chapters — intelligence, capital, hospitality, education and beyond."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FUTURE_VENTURES.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.04}>
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-black/30 p-8 transition hover:border-gold/40">
                <div className="pointer-events-none absolute -inset-20 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-gold/70">Coming Soon</div>
                  <div className="mt-3 font-display text-2xl">{v.name}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{v.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

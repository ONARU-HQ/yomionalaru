import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { COMPANIES, FUTURE_VENTURES } from "@/lib/site-data";
import { Section, Reveal, StatusPill } from "@/components/ui-primitives";
import { EcosystemOrbit } from "@/components/founder/EcosystemOrbit";
import { TiltCard } from "@/components/founder/TiltCard";

export const Route = createFileRoute("/companies/")({
  component: CompaniesIndex,
  head: () => ({
    meta: [
      { title: "Companies — Yomi Onalaru" },
      { name: "description", content: "TRYSA, TRYSA Home, Yomi Visuals, YV Experience, Playbaaq, YOFA and Folak — the ecosystem Yomi Onalaru is building." },
      { property: "og:title", content: "Companies — Yomi Onalaru" },
      { property: "og:description", content: "The ecosystem of companies Yomi Onalaru is building." },
      { property: "og:url", content: "/companies" },
    ],
    links: [{ rel: "canonical", href: "/companies" }],
  }),
});

function CompaniesIndex() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Companies</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            An ecosystem of <span className="gold-shine">ventures</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Each company is its own universe. Together they form the infrastructure of a new kind of creative business.
          </p>
        </Reveal>
      </section>

      <Section eyebrow="The Orbit" title={<>Everything, in <span className="gold-text">motion.</span></>}>
        <EcosystemOrbit />
      </Section>

      <Section eyebrow="All Companies" title={<>Enter <span className="gold-text">any door.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMPANIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <div style={{ perspective: 1200 }}>
                <TiltCard>
                  <Link to="/companies/$slug" params={{ slug: c.slug }} className="block">
                    <div className="group relative h-full overflow-hidden rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-1.5">
                      <div className={`pointer-events-none absolute -inset-40 rounded-full bg-gradient-to-br ${c.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`} />
                      <div className="relative flex h-full flex-col">
                        <div className="flex items-start justify-between">
                          <StatusPill status={c.status} />
                          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{c.launchYear}</span>
                        </div>
                        <div className="mt-10 font-display text-4xl leading-none">{c.name}</div>
                        <div className="mt-3 text-sm text-foreground/70">{c.tagline}</div>
                        <div className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">{c.industry}</div>
                        <div className="mt-8 hairline" />
                        <div className="mt-4 flex items-center gap-2 text-sm text-gold">
                          Enter <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="On the horizon" title={<>Future <span className="gold-text">ventures.</span></>}
        intro="A glimpse at what's next — sub-brands and companies in the pipeline.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FUTURE_VENTURES.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.03}>
              <div className="rounded-2xl glass p-6">
                <div className="font-display text-2xl">{v.name}</div>
                <div className="mt-2 text-sm text-muted-foreground">{v.note}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { COMPANIES } from "@/lib/site-data";
import { Reveal, Section, StatusPill } from "@/components/ui-primitives";
import { MagneticButton } from "@/components/founder/MagneticButton";

export const Route = createFileRoute("/companies/$slug")({
  loader: ({ params }) => {
    const company = COMPANIES.find((c) => c.slug === params.slug);
    if (!company) throw notFound();
    return { slug: company.slug };
  },
  component: CompanyDetail,
  head: ({ loaderData }) => {
    const c = loaderData ? COMPANIES.find((x) => x.slug === loaderData.slug) : undefined;
    return {
      meta: [
        { title: c ? `${c.name} — ${c.tagline}` : "Company — Yomi Onalaru" },
        { name: "description", content: c?.description ?? "" },
        { property: "og:title", content: c ? `${c.name} — ${c.tagline}` : "Company — Yomi Onalaru" },
        { property: "og:description", content: c?.description ?? "" },
        { property: "og:url", content: `/companies/${loaderData?.slug ?? ""}` },
      ],
      links: [{ rel: "canonical", href: `/companies/${loaderData?.slug ?? ""}` }],
    };
  },
});

function CompanyDetail() {
  const { slug } = Route.useLoaderData();
  const c = COMPANIES.find((x) => x.slug === slug)!;
  const related = COMPANIES.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      {/* Cinematic hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-40 md:pt-48">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className={`absolute -top-40 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br ${c.accent} blur-[140px]`} />
        </div>
        <Link to="/companies" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> All companies
        </Link>
        <Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <StatusPill status={c.status} />
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{c.industry}</span>
          </div>
          <h1 className="mt-8 font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.9]">
            <span className="gold-shine">{c.name}</span>
          </h1>
          <p className="mt-6 max-w-3xl font-display text-2xl text-foreground/85 md:text-4xl">{c.tagline}</p>
          {c.website && (
            <div className="mt-10">
              <MagneticButton as="a" href={c.website}>
                <span className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_var(--gold)] hover:bg-gold-soft">
                  Visit {c.name}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </MagneticButton>
            </div>
          )}
        </Reveal>
      </section>

      {/* Mission / Vision / Progress */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {c.mission && (
            <Reveal>
              <div className="rounded-3xl glass p-8 h-full">
                <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Mission</div>
                <p className="mt-4 font-display text-2xl leading-snug">{c.mission}</p>
              </div>
            </Reveal>
          )}
          {c.vision && (
            <Reveal delay={0.06}>
              <div className="rounded-3xl glass p-8 h-full">
                <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Vision</div>
                <p className="mt-4 font-display text-2xl leading-snug">{c.vision}</p>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.12}>
            <div className="rounded-3xl glass p-8 h-full">
              <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Status</div>
              <div className="mt-4 font-display text-2xl">{c.status}</div>
              {typeof c.progress === "number" && (
                <>
                  <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    <span>Progress</span><span>{c.progress}%</span>
                  </div>
                  <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft shadow-[0_0_20px_var(--gold)]"
                      style={{ width: `${c.progress}%` }} />
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* About */}
      <Section eyebrow="About" title={<>What <span className="gold-text">{c.name}</span> is.</>}>
        <p className="max-w-3xl text-lg leading-relaxed text-foreground/85 md:text-xl">{c.description}</p>
      </Section>

      {/* Product frames — visual placeholders */}
      <Section eyebrow="Preview" title={<>A glimpse <span className="gold-text">inside.</span></>}>
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1].map((k) => (
            <Reveal key={k} delay={k * 0.06}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-gold/20 glass">
                <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
                <div className="absolute inset-0 [background:radial-gradient(600px_300px_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="absolute inset-6 rounded-2xl border border-white/5" />
                <div className="absolute left-8 top-8 text-[10px] uppercase tracking-[0.3em] text-gold/70">
                  {c.name} · Frame 0{k + 1}
                </div>
                <div className="absolute bottom-8 left-8 font-display text-3xl md:text-5xl">
                  {k === 0 ? c.tagline : c.vision ?? c.tagline}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      {c.roadmap && c.roadmap.length > 0 && (
        <Section eyebrow="Roadmap" title={<>The <span className="gold-text">path</span> forward.</>}>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-border/60" />
            <div className="space-y-10 pl-14">
              {c.roadmap.map((r, i) => (
                <Reveal key={r.phase} delay={i * 0.05}>
                  <div className="relative">
                    <div className={`absolute -left-[3.35rem] top-2 grid h-6 w-6 place-items-center rounded-full border ${r.done ? "border-gold bg-gold/20" : "border-border bg-background"}`}>
                      {r.done && <Check className="h-3 w-3 text-gold" />}
                    </div>
                    <div className="text-xs uppercase tracking-[0.3em] text-gold">{r.phase}</div>
                    <div className="mt-2 font-display text-2xl">{r.body}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Related companies */}
      <Section eyebrow="Ecosystem" title={<>Explore <span className="gold-text">more</span>.</>}>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to="/companies/$slug" params={{ slug: r.slug }}
              className="group block rounded-3xl glass p-6 transition hover:-translate-y-1">
              <div className="text-[10px] uppercase tracking-[0.28em] text-gold/70">{r.status}</div>
              <div className="mt-4 font-display text-2xl">{r.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{r.tagline}</div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
                Enter <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

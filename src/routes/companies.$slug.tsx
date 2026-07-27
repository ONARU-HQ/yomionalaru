import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { COMPANIES } from "@/lib/site-data";
import { Reveal, StatusPill } from "@/components/ui-primitives";

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
        { title: c ? `${c.name} — Yomi Onalaru` : "Company — Yomi Onalaru" },
        { name: "description", content: c?.description ?? "" },
        { property: "og:title", content: c ? `${c.name} — Yomi Onalaru` : "Company — Yomi Onalaru" },
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
  return (
    <>
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-40 md:pt-48">
        <Link to="/companies" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> All companies
        </Link>
        <Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <StatusPill status={c.status} />
            <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{c.industry}</span>
          </div>
          <h1 className="mt-8 font-display text-6xl leading-[1] md:text-9xl">
            <span className="gold-shine">{c.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl font-display text-2xl text-foreground/85 md:text-3xl">{c.tagline}</p>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className={`relative overflow-hidden rounded-[2rem] glass p-12 md:p-20`}>
          <div className={`pointer-events-none absolute -inset-40 rounded-full bg-gradient-to-br ${c.accent} blur-3xl`} />
          <div className="relative grid gap-12 md:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="text-xs uppercase tracking-[0.3em] text-gold/80">About</div>
              <p className="mt-4 text-lg leading-relaxed text-foreground/85 md:text-xl">{c.description}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5">
                <Row k="Status" v={c.status} />
                <Row k="Industry" v={c.industry} />
                <Row k="Launched" v={String(c.launchYear)} />
                {c.website && <Row k="Website" v={c.website.replace(/^https?:\/\//, "")} href={c.website} />}
                {c.instagram && <Row k="Instagram" v={c.instagram.split("/").pop() ?? ""} href={c.instagram} />}
                {c.tiktok && <Row k="TikTok" v={c.tiktok.split("/").pop() ?? ""} href={c.tiktok} />}
                {c.x && <Row k="X" v={c.x.split("/").pop() ?? ""} href={c.x} />}
              </div>
            </Reveal>
          </div>

          {c.website && (
            <div className="relative mt-14">
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_var(--gold)] hover:bg-gold-soft"
              >
                Visit {c.name}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="hairline" />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Explore more companies</div>
          <Link to="/companies" className="text-sm text-gold hover:text-gold-soft">All companies →</Link>
        </div>
      </section>
    </>
  );
}

function Row({ k, v, href }: { k: string; v: string; href?: string }) {
  const content = href ? (
    <a href={href} target="_blank" rel="noreferrer" className="text-foreground hover:text-gold">{v}</a>
  ) : (
    <span className="text-foreground/90">{v}</span>
  );
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border/50 pb-4">
      <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{k}</span>
      {content}
    </div>
  );
}

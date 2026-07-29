import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Reveal } from "@/components/ui-primitives";
import { MENTORSHIP, MENTORSHIP_FAQ, TESTIMONIALS, SITE_URL, CONTACT } from "@/lib/site-data";

export const Route = createFileRoute("/mentorship/$slug")({
  loader: ({ params }) => {
    const m = MENTORSHIP.find((x) => x.slug === params.slug);
    if (!m) throw notFound();
    return { slug: m.slug };
  },
  component: MentorshipDetail,
  head: ({ loaderData }) => {
    const m = loaderData ? MENTORSHIP.find((x) => x.slug === loaderData.slug) : undefined;
    if (!m) return { meta: [{ title: "Mentorship — Yomi Onalaru" }, { name: "robots", content: "noindex" }] };
    const url = `${SITE_URL}/mentorship/${m.slug}`;
    return {
      meta: [
        { title: `${m.title} — Mentorship | Yomi Onalaru` },
        { name: "description", content: m.summary },
        { property: "og:title", content: `${m.title} — Mentorship` },
        { property: "og:description", content: m.summary },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: m.title,
            description: m.summary,
            serviceType: "Business mentorship",
            provider: { "@type": "Person", name: "Yomi Onalaru", url: SITE_URL },
            areaServed: "Worldwide",
          }),
        },
      ],
    };
  },
});

function MentorshipDetail() {
  const { slug } = Route.useLoaderData();
  const m = MENTORSHIP.find((x) => x.slug === slug)!;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-36 md:pt-44">
      <Link to="/mentorship" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-3.5 w-3.5" /> All tracks
      </Link>
      <h1 className="mt-10 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[1]">{m.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{m.summary}</p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Reveal>
          <Block title="Who it's for" items={[...m.forWho]} />
        </Reveal>
        <Reveal delay={0.05}>
          <Block title="What we cover" items={[...m.covered]} />
        </Reveal>
        <Reveal delay={0.1}>
          <Block title="Expected outcomes" items={[...m.outcomes]} />
        </Reveal>
        <Reveal delay={0.15}>
          <div className="h-full rounded-3xl glass p-8">
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Application process</div>
            <ol className="mt-5 space-y-3 text-sm text-foreground/80">
              <li>1. Send a short note about your business and where you're stuck.</li>
              <li>2. A 30-minute fit call.</li>
              <li>3. A written proposal with scope and cadence.</li>
              <li>4. Kick-off within two weeks.</li>
            </ol>
          </div>
        </Reveal>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {MENTORSHIP_FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl glass p-6">
              <h3 className="font-display text-lg">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <blockquote key={t.who} className="rounded-2xl glass p-6">
            <p className="text-sm leading-relaxed">“{t.quote}”</p>
            <footer className="mt-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{t.who}</footer>
          </blockquote>
        ))}
      </section>

      <section className="mt-16 rounded-3xl glass p-8">
        <h2 className="font-display text-3xl">Apply for {m.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">Everything comes directly to me.</p>
        <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`[Mentorship] ${m.title}`)}`} className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
          {CONTACT.email}
        </a>
      </section>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="h-full rounded-3xl glass p-8">
      <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">{title}</div>
      <ul className="mt-5 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, Section, StatusPill } from "@/components/ui-primitives";
import portrait from "@/assets/yomi-portrait.png.asset.json";
import { ScrollTimeline } from "@/components/founder/ScrollTimeline";
import { StatCounters } from "@/components/founder/StatCounters";
import { Manifesto } from "@/components/founder/Manifesto";
import { WorldMap } from "@/components/founder/WorldMap";
import { NewsletterForm } from "@/components/newsletter-form";
import { ONARU, POSITIONING, PRINCIPLES, FAILURES, LESSONS, SITE_URL, CONTACT } from "@/lib/site-data";
import { usePublicBooks, usePublicCompanies } from "@/lib/public-content";
import { useSetting } from "@/lib/cms";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "Founder — Yomi Onalaru | Founder of ONARU" },
      { name: "description", content: "The story, philosophy, principles, failures and lessons of Yomi Onalaru — founder of ONARU, building companies that solve meaningful problems." },
      { property: "og:title", content: "Founder — Yomi Onalaru" },
      { property: "og:description", content: "Story, philosophy, principles, failures, lessons, faith and leadership." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: portrait.url },
      { name: "twitter:image", content: portrait.url },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: "Yomi Onalaru",
            url: `${SITE_URL}/about`,
            image: portrait.url,
            jobTitle: "Founder & Creative Director",
            email: CONTACT.email,
            knowsAbout: POSITIONING,
            worksFor: { "@type": "Organization", name: ONARU.name, url: SITE_URL },
          },
        }),
      },
    ],
  }),
});

function About() {
  const bio = useSetting<{ short?: string; long?: string }>("biography");
  const { companies } = usePublicCompanies();
  const books = usePublicBooks();

  return (
    <>
      {/* Opening */}
      <section className="relative mx-auto max-w-7xl px-6 pb-12 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">The Founder</div>
          <h1 className="mt-8 max-w-5xl font-display text-5xl leading-[1.02] md:text-8xl">
            I build companies that solve <span className="gold-shine">real problems.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            {bio.short ||
              "Yomi Onalaru — founder of ONARU. Creative director, systems thinker and product builder working at the intersection of business, creativity and technology."}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {POSITIONING.map((p) => (
              <span key={p} className="rounded-full border border-border px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* My story */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-[1fr_1.3fr] md:gap-24">
        <Reveal>
          <div className="sticky top-32 overflow-hidden rounded-3xl border border-gold/20">
            <img src={portrait.url} alt="Yomi Onalaru portrait" className="w-full object-cover" />
          </div>
        </Reveal>
        <div className="space-y-8 text-lg leading-relaxed text-foreground/85">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.32em] text-gold/80">My story</div>
          </Reveal>
          {bio.long ? (
            bio.long.split("\n").filter(Boolean).map((p, i) => (
              <Reveal key={i} delay={i * 0.04}><p>{p}</p></Reveal>
            ))
          ) : (
            <>
              <Reveal>
                <p>
                  It started with a camera. Photography taught me how to see — how to compose light,
                  patience and story into something a stranger could feel. That instinct grew into
                  film, into brand direction, into building teams and studios.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p>
                  Somewhere along the way I stopped being a creator who ran a business and became an
                  entrepreneur who creates. <span className="text-gold">Yomi Visuals</span> gave me
                  standards. Running it gave me the harder education: a business that depends on one
                  person isn't a business, it's a job with better lighting.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  So I rebuilt the way I work — documenting before delegating, designing operations
                  instead of heroics. That work became <span className="text-gold">TRYSA</span>, an
                  operating system for creative businesses, and then a habit: every problem I lived
                  through became a company built to remove it for someone else.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  Today those companies sit under <span className="text-gold">{ONARU.name}</span> —
                  {" "}{ONARU.summary.toLowerCase()}
                </p>
              </Reveal>
            </>
          )}
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Philosophy</div>
          <p className="mt-8 font-display text-4xl leading-tight md:text-6xl">
            "{ONARU.identity}"
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-muted-foreground">{ONARU.mission}</p>
        </Reveal>
      </section>

      {/* Core principles */}
      <Section eyebrow="Core principles" title={<>How I make <span className="gold-text">decisions.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl glass p-8">
                <div className="font-display text-2xl">{p.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Timeline + stats */}
      <ScrollTimeline />
      <StatCounters />

      {/* Current companies — CMS driven */}
      <Section eyebrow="Current companies" title={<>What I'm building <span className="gold-text">right now.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link to="/companies/$slug" params={{ slug: c.slug }} className="group block h-full">
                <div className="flex h-full flex-col rounded-3xl glass p-8 transition hover:-translate-y-1.5">
                  <div className="flex items-start justify-between">
                    <StatusPill status={c.status} />
                    <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{c.launchYear}</span>
                  </div>
                  <div className="mt-8 font-display text-3xl group-hover:text-gold">{c.name}</div>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.tagline}</p>
                  <div className="mt-6 h-1 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gold/70" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Failures */}
      <Section
        eyebrow="Failures"
        title={<>What went <span className="gold-text">wrong first.</span></>}
        intro="Every system I teach exists because I got it badly wrong before I got it right."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {FAILURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-border/60 p-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Lesson {i + 1}</div>
                <div className="mt-4 font-display text-2xl">{f.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Lessons */}
      <Section eyebrow="Lessons" title={<>Things I now <span className="gold-text">know for certain.</span></>}>
        <div className="grid gap-4 md:grid-cols-2">
          {LESSONS.map((l, i) => (
            <Reveal key={l} delay={i * 0.04}>
              <div className="flex items-start gap-4 rounded-2xl border border-border/60 px-6 py-5">
                <span className="font-display text-xl text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-foreground/85">{l}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Manifesto */}
      <Manifesto />

      {/* Books — CMS driven */}
      <Section eyebrow="Books" title={<>What shaped <span className="gold-text">the thinking.</span></>}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {books.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.03}>
              <div className="h-full rounded-2xl glass p-6">
                <div className="font-display text-xl leading-tight">{b.title}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{b.author}</div>
                {b.note && <p className="mt-3 text-sm text-muted-foreground">{b.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Faith & leadership */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl glass p-10">
              <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Faith</div>
              <h2 className="mt-5 font-display text-3xl leading-tight md:text-4xl">
                Stewardship, not ownership.
              </h2>
              <p className="mt-5 text-muted-foreground">
                I'm a Christian, and it shapes how I run things more than how I talk. What I hold —
                people, money, time, influence — isn't mine to waste. That belief makes me slower to
                promise, quicker to pay, and far more patient about compounding than about applause.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="h-full rounded-3xl glass p-10">
              <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Leadership</div>
              <h2 className="mt-5 font-display text-3xl leading-tight md:text-4xl">
                Clarity is kindness.
              </h2>
              <p className="mt-5 text-muted-foreground">
                I lead by writing things down: the standard, the scorecard, the decision and the
                reason behind it. People don't need a hero at the front of the room — they need a
                system they can trust and a leader who says the hard thing early.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <WorldMap />

      {/* Close */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-[2rem] glass p-10 md:p-16">
          <div className="pointer-events-none absolute -inset-40 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Follow the build, <span className="gold-shine">honestly documented.</span>
            </h2>
            <NewsletterForm source="founder-page" className="mt-8 max-w-2xl" />
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/companies" className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
                See the ecosystem →
              </Link>
              <Link to="/mentorship" className="rounded-full border border-border px-6 py-3 text-sm hover:border-gold/50 hover:text-gold">
                Work with me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

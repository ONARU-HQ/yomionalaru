import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import portrait from "@/assets/yomi-portrait.png.asset.json";
import { COMPANIES, MEDIA_ITEMS, SOCIALS, CONTACT, FUTURE_VENTURES, MENTORSHIP } from "@/lib/site-data";
import { Section, Reveal, StatusPill } from "@/components/ui-primitives";
import { BuildingCards } from "@/components/founder/BuildingCards";
import { EcosystemOrbit } from "@/components/founder/EcosystemOrbit";
import { StatCounters } from "@/components/founder/StatCounters";
import { Manifesto } from "@/components/founder/Manifesto";
import { WorldMap } from "@/components/founder/WorldMap";
import { ScrollTimeline } from "@/components/founder/ScrollTimeline";
import { CinematicIntro } from "@/components/founder/CinematicIntro";
import { CursorSpotlight } from "@/components/founder/CursorSpotlight";
import { MagneticButton } from "@/components/founder/MagneticButton";
import { TiltCard } from "@/components/founder/TiltCard";
import { NewsletterForm } from "@/components/newsletter-form";
import { usePublicArticles, usePublicProjects, usePublicTestimonials } from "@/lib/public-content";
import { Photo, CdnImage } from "@/components/photo";
import { HallOfFame } from "@/components/gallery-grid";
import { PHOTOS } from "@/lib/gallery";

const HOME_PHOTOS = PHOTOS.slice(0, 6);


export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Yomi Onalaru — Creative Director. Entrepreneur. Product Builder." },
      { name: "description", content: "The digital headquarters of Yomi Onalaru — founder of ONARU. Building the future of business for creatives." },
      { property: "og:title", content: "Yomi Onalaru — Building the Future of Creative Business" },
      { property: "og:description", content: "Founder of an ecosystem of companies shaping the future of creative business." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: portrait.url },
      { name: "twitter:image", content: portrait.url },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  return (
    <>
      <CinematicIntro />
      <CursorSpotlight />
      {/* 1 — Hero */}
      <Hero />
      <MarqueeStrip />
      {/* 2 — Ecosystem */}
      <EcosystemSection />
      <CompaniesPreview />
      {/* 3 — Latest articles */}
      <LatestArticles />
      {/* 4 — Featured work */}
      <FeaturedWork />
      <SelectedPhotography />

      {/* 5 — Ventures & products */}
      <VenturesSection />
      {/* 6 — Testimonials */}
      <TestimonialsSection />
      {/* 7 — Mentorship & speaking */}
      <MentorshipSection />
      {/* 8 — Newsletter */}
      <NewsletterSection />
      <StatCounters />
      <Manifesto />
      <ScrollTimeline />
      <WorldMap />
      <MediaPreview />
      <QuoteSection />
      <SocialGrid />
      <ContactCTA />
    </>
  );
}

function SelectedPhotography() {
  return (
    <Section
      eyebrow="Selected photography"
      title={<>Frames from <span className="gold-text">the archive.</span></>}
      intro="Portraits, fashion, culture and commercial work shot through Yomi Visuals."
    >
      <HallOfFame />
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">
        {HOME_PHOTOS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <figure className="group overflow-hidden rounded-2xl border border-border/50">
              <Photo
                photo={p}
                ratio="4 / 5"
                sizes="(max-width: 768px) 46vw, 31vw"
                imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
              />
            </figure>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.24em] text-gold transition hover:bg-gold hover:text-primary-foreground">
          Enter the gallery →
        </Link>
      </div>
    </Section>
  );
}


function LatestArticles() {
  const { articles } = usePublicArticles(3);
  if (articles.length === 0) return null;
  return (
    <Section
      eyebrow="Latest articles"
      title={<>Thinking, <span className="gold-text">written down.</span></>}
      intro="Essays on systems, leadership, faith and the honest work of building companies."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.06}>
            <Link to="/blog/$slug" params={{ slug: a.slug }} className="group block h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-3xl glass transition hover:-translate-y-1.5">
                {a.image && <img src={a.image} alt={a.title} loading="lazy" className="h-40 w-full object-cover" />}
                <div className="flex flex-1 flex-col p-7">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">{a.category}</div>
                  <h3 className="mt-4 font-display text-2xl leading-tight group-hover:text-gold">{a.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.readMins} min · {a.date}
                  </div>
                </div>
              </article>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.24em] text-gold transition hover:bg-gold hover:text-primary-foreground">
          Read the blog →
        </Link>
      </div>
    </Section>
  );
}

function FeaturedWork() {
  const projects = usePublicProjects().slice(0, 6);
  if (projects.length === 0) return null;
  return (
    <Section eyebrow="Featured work" title={<>Projects that made <span className="gold-text">the point.</span></>}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <div className="group h-full overflow-hidden rounded-3xl glass transition hover:-translate-y-1.5">
              {p.image && <img src={p.image} alt={p.title} loading="lazy" className="h-44 w-full object-cover" />}
              <div className="p-7">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  <span className="text-gold/80">{p.tag}</span>
                  <span>{p.year}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.24em] text-foreground/80 transition hover:border-gold/50 hover:text-gold">
          See all work →
        </Link>
      </div>
    </Section>
  );
}

function VenturesSection() {
  return (
    <Section
      eyebrow="Ventures & products"
      title={<>What's shipping, and <span className="gold-text">what's next.</span></>}
      intro="Live products, plus the ventures ONARU is preparing to build."
    >
      <BuildingCards />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FUTURE_VENTURES.map((v, i) => (
          <Reveal key={v.name} delay={i * 0.04}>
            <div className="h-full rounded-2xl border border-border/60 p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">In development</div>
              <div className="mt-3 font-display text-2xl">{v.name}</div>
              <p className="mt-2 text-sm text-muted-foreground">{v.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TestimonialsSection() {
  const testimonials = usePublicTestimonials().slice(0, 6);
  if (testimonials.length === 0) return null;
  return (
    <Section eyebrow="Testimonials" title={<>What people <span className="gold-text">say after.</span></>}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.quote} delay={i * 0.05}>
            <figure className="flex h-full flex-col rounded-3xl glass p-8">
              <blockquote className="flex-1 font-display text-xl leading-snug text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.avatar && <img src={t.avatar} alt={t.who} className="h-9 w-9 rounded-full object-cover" />}
                <div>
                  <div className="text-sm text-foreground/90">{t.who}</div>
                  {t.role && <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{t.role}</div>}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function MentorshipSection() {
  return (
    <Section
      eyebrow="Mentorship & speaking"
      title={<>Work with me, or <span className="gold-text">bring me in.</span></>}
      intro="One-to-one founder work, business architecture, and stages where the room needs an honest operator."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MENTORSHIP.slice(0, 6).map((m, i) => (
          <Reveal key={m.slug} delay={i * 0.05}>
            <Link to="/mentorship/$slug" params={{ slug: m.slug }} className="group block h-full">
              <div className="flex h-full flex-col rounded-3xl glass p-8 transition hover:-translate-y-1.5">
                <h3 className="font-display text-2xl group-hover:text-gold">{m.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{m.summary}</p>
                <div className="mt-6 flex items-center gap-2 text-sm text-gold">
                  Explore <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link to="/mentorship" className="rounded-full bg-gold px-6 py-3 text-xs uppercase tracking-[0.24em] font-medium text-primary-foreground hover:bg-gold-soft">
          All mentorship tracks
        </Link>
        <Link to="/speaking" className="rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.24em] hover:border-gold/50 hover:text-gold">
          Speaking
        </Link>
      </div>
    </Section>
  );
}

function NewsletterSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <div className="relative overflow-hidden rounded-[2rem] glass p-10 md:p-16">
        <div className="pointer-events-none absolute -inset-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Newsletter</div>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Systems, leadership and <span className="gold-shine">lessons</span> — weekly.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            The frameworks I use to build companies, written plainly. No noise, no selling.
          </p>
          <NewsletterForm source="homepage" className="mt-8 max-w-2xl" />
        </div>
      </div>
    </section>
  );
}


function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px] float-slow" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_60%)]" />
      </div>

      <motion.div style={{ y, opacity }} className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-black/30 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-gold/90"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]" />
            Currently building TRYSA
          </motion.div>

          <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.95]">
            <RevealLine delay={0.05}>My name is</RevealLine>
            <RevealLine delay={0.15}><span className="gold-shine">Yomi Onalaru.</span></RevealLine>
          </h1>

          <div className="mt-10 max-w-xl">
            <p className="font-display text-2xl leading-snug text-foreground/85 md:text-3xl">
              <RevealLine delay={0.35}>Creative Director.</RevealLine>
              <RevealLine delay={0.42}>Entrepreneur.</RevealLine>
              <RevealLine delay={0.49}>Product Builder.</RevealLine>
            </p>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9 }}
              className="mt-8 max-w-lg text-base text-muted-foreground md:text-lg"
            >
              Founder of an ecosystem of companies building products, experiences and businesses
              across creativity, technology and commerce — building the future of business for creatives.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_var(--gold)] transition hover:bg-gold-soft"
              >
                Explore my world
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/companies"
                className="group inline-flex items-center gap-3 rounded-full border border-border px-7 py-3.5 text-sm text-foreground/90 transition hover:border-gold/50 hover:text-gold"
              >
                View companies
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
          style={{ perspective: 1200 }}
        >
          <TiltCard>
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-gold/40 via-transparent to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
              <img
                src={portrait.url}
                alt="Portrait of Yomi Onalaru"
                className="aspect-[3/4] h-auto w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Founder</div>
                  <div className="font-display text-2xl">Yomi Onalaru</div>
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Est. 2018
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">Scroll</div>
      </div>
    </section>
  );
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function MarqueeStrip() {
  const items = ["ONARU", "TRYSA", "Yomi Visuals", "YV Studios", "TRYSA Academy", "Yomi Unscripted", "ONARU Ventures"];
  return (
    <div className="relative overflow-hidden border-y border-border/60 py-8">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-16 whitespace-nowrap">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="font-display text-4xl text-foreground/40 md:text-5xl">
            {it} <span className="text-gold/60">·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-33.3333%);} }`}</style>
    </div>
  );
}

function EcosystemSection() {
  return (
    <Section
      eyebrow="Ecosystem"
      title={<>An <span className="gold-text">orbit</span> of ventures.</>}
      intro="Every company shares one obsession — helping creative businesses scale without losing what makes them worth building."
    >
      <EcosystemOrbit />
      <div className="mt-12 text-center">
        <Link to="/companies" className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.24em] text-gold hover:bg-gold hover:text-primary-foreground transition">
          Explore each company →
        </Link>
      </div>
    </Section>
  );
}

function CompaniesPreview() {
  return (
    <Section
      eyebrow="Companies"
      title={<>An ecosystem, not <span className="gold-text">a portfolio.</span></>}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COMPANIES.slice(0, 6).map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
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
                  <div className="mt-4 flex items-center gap-2 text-sm text-gold group-hover:translate-x-1 transition-transform">
                    Enter <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function MediaPreview() {
  return (
    <Section eyebrow="Press & Media" title={<>Heard on the <span className="gold-text">record.</span></>}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MEDIA_ITEMS.slice(0, 6).map((m, i) => (
          <Reveal key={m.title} delay={i * 0.05}>
            <div className="rounded-3xl glass p-6 h-full">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">{m.type}</div>
              <div className="mt-4 font-display text-2xl">{m.title}</div>
              <p className="mt-3 text-sm text-muted-foreground">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function QuoteSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-32 text-center">
      <Reveal>
        <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Ethos</div>
        <p className="mt-8 font-display text-4xl leading-tight md:text-6xl">
          "I don't just build businesses.<br />
          <span className="gold-shine">I build infrastructure</span> that helps creative businesses scale."
        </p>
      </Reveal>
    </section>
  );
}

function SocialGrid() {
  return (
    <Section eyebrow="Elsewhere" title={<>Follow the <span className="gold-text">work.</span></>}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...SOCIALS.personal, ...SOCIALS.brands].map((s, i) => (
          <Reveal key={s.href} delay={i * 0.03}>
            <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl glass px-5 py-4 hover:border-gold/40">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground group-hover:text-gold">{s.label}</div>
                <div className="mt-1 text-sm text-foreground/90">{s.handle}</div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ContactCTA() {
  return (
    <section className="relative mx-auto my-32 max-w-6xl px-6">
      <div className="relative overflow-hidden rounded-[2rem] glass p-12 md:p-20">
        <div className="pointer-events-none absolute -inset-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Let's build something</div>
            <h2 className="mt-4 font-display text-5xl leading-tight md:text-7xl">
              A single conversation can <span className="gold-shine">start a company.</span>
            </h2>
            <p className="mt-6 max-w-lg text-muted-foreground">
              For speaking, consulting, creative direction, partnerships or press — my inbox is open.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a href={`mailto:${CONTACT.email}`} className="rounded-full bg-gold px-6 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-gold-soft">
              {CONTACT.email}
            </a>
            <Link to="/contact" className="rounded-full border border-border px-6 py-3 text-center text-sm hover:border-gold/50 hover:text-gold">
              Contact form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import portrait from "@/assets/yomi-portrait.png.asset.json";
import {
  COMPANIES, CURRENT_FOCUS, TIMELINE, PROJECTS, MEDIA_ITEMS,
  SOCIALS, TECH_STACK, CONTACT,
} from "@/lib/site-data";
import { Section, Reveal, GlassCard, StatusPill } from "@/components/ui-primitives";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Yomi Onalaru — Creative Director. Entrepreneur. Product Builder." },
      { name: "description", content: "The digital headquarters of Yomi Onalaru — founder of TRYSA, Yomi Visuals, YOFA & Folak. Building the future of business for creatives." },
      { property: "og:title", content: "Yomi Onalaru — Creative Director. Entrepreneur. Product Builder." },
      { property: "og:description", content: "Building the future of business for creatives." },
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
      <Hero />
      <MarqueeStrip />
      <CurrentFocus />
      <CompaniesPreview />
      <TimelinePreview />
      <ProjectsPreview />
      <MediaPreview />
      <TechStackSection />
      <QuoteSection />
      <SocialGrid />
      <ContactCTA />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden pt-32">
      {/* atmospheric background */}
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
              Founder of multiple brands building products, experiences and businesses
              across creativity, technology and commerce — building the future of business for creatives.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_var(--gold)] transition hover:bg-gold-soft"
            >
              Explore my world
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/companies"
              className="group inline-flex items-center gap-3 rounded-full border border-border px-7 py-3.5 text-sm text-foreground/90 transition hover:border-gold/50 hover:text-gold"
            >
              View companies
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
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
  const items = ["TRYSA", "Yomi Visuals", "YOFA", "Folak", "Shop1401", "TRYSA Intelligence", "YV Studios", "YV Academy"];
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

function CurrentFocus() {
  return (
    <Section
      eyebrow="Now"
      title={<>What I'm building <span className="gold-text">right now.</span></>}
      intro="A snapshot of where my attention lives — the ideas, businesses and craft I'm shaping this season."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CURRENT_FOCUS.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <GlassCard glow="bg-gold/10">
              <div className="font-display text-2xl">{f.title}</div>
              <p className="mt-3 text-sm text-muted-foreground">{f.body}</p>
              <div className="mt-8 hairline" />
              <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gold/70">
                Focus 0{i + 1}
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CompaniesPreview() {
  return (
    <Section
      eyebrow="Companies"
      title={<>An ecosystem, not <span className="gold-text">a portfolio.</span></>}
      intro="Every venture I build shares a single obsession — helping creative businesses scale without losing what makes them worth building in the first place."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COMPANIES.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
            <Link to="/companies/$slug" params={{ slug: c.slug }} className="block">
              <div className="group relative h-full overflow-hidden rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-1.5">
                <div className={`pointer-events-none absolute -inset-40 rounded-full bg-gradient-to-br ${c.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="font-display text-3xl">{c.name}</div>
                    <StatusPill status={c.status} />
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.28em] text-gold/70">{c.industry}</div>
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
      <div className="mt-12 text-center">
        <Link to="/companies" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-gold hover:text-gold-soft">
          View all companies <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}

function TimelinePreview() {
  return (
    <Section
      eyebrow="Timeline"
      title={<>A decade of <span className="gold-text">building.</span></>}
      intro="From picking up a camera to shipping an operating system — the arc of a career built on craft, curiosity and compounding."
    >
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:left-1/2" />
        <div className="space-y-14">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.05}>
              <div className={`relative grid gap-6 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                <div className="md:[direction:ltr]">
                  <div className="relative rounded-2xl glass p-6">
                    <div className="text-xs uppercase tracking-[0.3em] text-gold">{t.year}</div>
                    <div className="mt-2 font-display text-2xl">{t.title}</div>
                    <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
                  </div>
                </div>
                <div className="hidden md:block" />
                <div className="absolute left-4 top-6 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-gold shadow-[0_0_16px_var(--gold)] md:left-1/2" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProjectsPreview() {
  return (
    <Section
      eyebrow="Projects"
      title={<>Selected <span className="gold-text">work.</span></>}
      intro="Photography, film, brand and product — a curated look at things I've made recently."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.slice(0, 4).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <div className="group relative overflow-hidden rounded-3xl glass p-10">
              <div className="text-xs uppercase tracking-[0.28em] text-gold/80">{p.tag} · {p.year}</div>
              <div className="mt-4 font-display text-3xl md:text-4xl">{p.title}</div>
              <p className="mt-4 text-sm text-muted-foreground">{p.body}</p>
              <div className="mt-8 hairline" />
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.28em] text-muted-foreground">Case study</span>
                <ArrowUpRight className="h-4 w-4 text-foreground/70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-gold hover:text-gold-soft">
          View all projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}

function MediaPreview() {
  return (
    <Section
      eyebrow="Media"
      title={<>In the <span className="gold-text">press.</span></>}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MEDIA_ITEMS.slice(0, 6).map((m, i) => (
          <Reveal key={m.title} delay={i * 0.05}>
            <div className="rounded-2xl glass p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">{m.type}</div>
              <div className="mt-2 font-display text-xl">{m.title}</div>
              <p className="mt-3 text-sm text-muted-foreground">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TechStackSection() {
  return (
    <Section eyebrow="Stack" title={<>Tools of the <span className="gold-text">trade.</span></>}>
      <div className="flex flex-wrap gap-3">
        {TECH_STACK.map((t, i) => (
          <Reveal key={t} delay={i * 0.02}>
            <span className="rounded-full border border-border bg-black/20 px-5 py-2.5 text-sm text-foreground/80 transition hover:border-gold/50 hover:text-gold">
              {t}
            </span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function QuoteSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32 md:py-48">
      <Reveal>
        <p className="font-display text-3xl leading-tight md:text-6xl">
          "I don't just build businesses.{" "}
          <span className="gold-shine">I build infrastructure</span> that helps creative businesses scale."
        </p>
        <div className="mt-10 flex items-center gap-4">
          <div className="hairline w-24" />
          <div className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Yomi Onalaru</div>
        </div>
      </Reveal>
    </section>
  );
}

function SocialGrid() {
  const all = [...SOCIALS.personal, ...SOCIALS.brands];
  return (
    <Section eyebrow="Elsewhere" title={<>Follow the <span className="gold-text">world.</span></>}>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {all.map((s, i) => (
          <Reveal key={s.label + s.href} delay={i * 0.03}>
            <a
              href={s.href} target="_blank" rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl glass p-5 transition hover:-translate-y-0.5"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{s.label}</div>
                <div className="mt-1 text-sm text-foreground/90">{s.handle}</div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-foreground/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ContactCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] glass p-12 md:p-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Contact</div>
            <h3 className="mt-6 font-display text-4xl md:text-6xl">
              Let's build something <span className="gold-shine">worth remembering.</span>
            </h3>
            <p className="mt-6 max-w-xl text-muted-foreground">
              For collaborations, speaking, press or investment — I'd love to hear from you.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/contact" className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_var(--gold)] hover:bg-gold-soft">
                Start a conversation
              </Link>
              <a href={`mailto:${CONTACT.email}`} className="text-sm text-foreground/80 hover:text-gold">
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

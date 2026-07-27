import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Reveal } from "@/components/ui-primitives";
import { TIMELINE } from "@/lib/site-data";
import portrait from "@/assets/yomi-portrait.png.asset.json";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Yomi Onalaru" },
      { name: "description", content: "The story of Yomi Onalaru — photographer, filmmaker, creative director, entrepreneur and product builder." },
      { property: "og:title", content: "About — Yomi Onalaru" },
      { property: "og:description", content: "From a camera to an ecosystem — the story of Yomi Onalaru." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: portrait.url },
      { name: "twitter:image", content: portrait.url },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">About</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            A creative director building an <span className="gold-shine">ecosystem</span> for creatives.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-[1fr_1.3fr] md:gap-24">
        <Reveal>
          <div className="sticky top-32 overflow-hidden rounded-3xl border border-gold/20">
            <img src={portrait.url} alt="Yomi Onalaru portrait" className="w-full object-cover" />
          </div>
        </Reveal>
        <div className="space-y-8 text-lg leading-relaxed text-foreground/85">
          <Reveal>
            <p>
              My name is <span className="text-gold">Yomi Onalaru.</span> I'm a creative director,
              entrepreneur and product builder — and everything I do orbits a single obsession:
              the future of business for creatives.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              It started with a camera. Photography taught me how to see — how to compose
              light, patience, and story into something a stranger could feel. That instinct
              grew into film, into brand direction, into building teams and studios.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Somewhere along the way, I stopped being a creator who ran a business and started
              being an entrepreneur who created. I built <span className="text-gold">Yomi Visuals</span>,
              a luxury creative agency. Then <span className="text-gold">Folak</span> and{" "}
              <span className="text-gold">YOFA</span> — modern brands in hospitality and food.
              And then I noticed the same problem across every creative business I met: the operating
              system was broken.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p>
              That became <span className="text-gold">TRYSA</span> — an AI-powered Business
              Operating System that finally treats creative work like the enterprise it is.
              Bookings, CRM, finance, contracts, galleries, automation, team management — one
              intelligent workspace, built by someone who has lived every part of the workflow.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              Today I split my time between shipping product, directing creative work, and
              building the ventures that will define the next chapter — capital, education,
              intelligence, hospitality, and everything in between.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="font-display text-3xl leading-snug">
              "I don't just build businesses. <span className="gold-shine">I build infrastructure</span> that helps creative businesses scale."
            </p>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Timeline" title={<>The <span className="gold-text">arc</span> so far.</>}>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:left-6" />
          <div className="space-y-10 pl-14">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <div className="relative">
                  <div className="absolute -left-[3.35rem] top-3 h-3 w-3 rounded-full bg-gold shadow-[0_0_16px_var(--gold)]" />
                  <div className="text-xs uppercase tracking-[0.3em] text-gold">{t.year}</div>
                  <div className="mt-1 font-display text-3xl">{t.title}</div>
                  <p className="mt-3 max-w-2xl text-muted-foreground">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <section className="mx-auto max-w-6xl px-6 py-32 text-center">
        <Reveal>
          <Link to="/companies" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
            See the companies I've built →
          </Link>
        </Reveal>
      </section>
    </>
  );
}

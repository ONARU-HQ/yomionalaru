import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { BUILDING } from "@/lib/site-data";
import { Section, Reveal } from "@/components/ui-primitives";

export function BuildingCards() {
  return (
    <Section
      eyebrow="Now Building"
      title={<>What I'm building <span className="gold-text">right now.</span></>}
      intro="Live status from the workshop — the ventures shipping this season, and where each of them is on the path."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BUILDING.map((b, i) => (
          <Reveal key={b.slug} delay={i * 0.05}>
            <Link to="/companies/$slug" params={{ slug: b.slug }} className="block">
              <div className="group relative h-full overflow-hidden rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-1.5">
                <motion.div
                  className="pointer-events-none absolute -inset-32 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-gold/90">
                      <PulseDot />
                      {b.label}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {b.progress}%
                    </div>
                  </div>
                  <div className="mt-8 font-display text-3xl">{b.name}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{b.note}</p>
                  <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.progress}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft shadow-[0_0_20px_var(--gold)]"
                    />
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

function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]" />
    </span>
  );
}

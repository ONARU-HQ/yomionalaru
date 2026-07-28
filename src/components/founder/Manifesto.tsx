import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 1, 1, 0.2]);

  const lines = [
    "I believe creative people deserve better businesses.",
    "Better systems.",
    "Better infrastructure.",
    <span key="last">I'm <span className="gold-shine">building it.</span></span>,
  ];

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[160px]" />
      </div>
      <motion.div style={{ y, opacity }} className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-xs uppercase tracking-[0.4em] text-gold/80">Manifesto</div>
        <div className="space-y-6 font-display text-[clamp(2rem,6vw,5.5rem)] leading-[1.05]">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TIMELINE } from "@/lib/site-data";
import { Section } from "@/components/ui-primitives";

export function ScrollTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section
      eyebrow="Documentary"
      title={<>The arc, <span className="gold-text">scrolled.</span></>}
      intro="Every year that shaped what's being built now — from the first camera to the operating system for creative business."
    >
      <div ref={ref} className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-border/60 md:left-6" />
        <motion.div
          style={{ scaleY: lineScale, transformOrigin: "top" }}
          className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold-soft via-gold to-gold-deep md:left-6"
        />
        <div className="space-y-24 pl-14 md:pl-20">
          {TIMELINE.map((t, i) => (
            <TimelineItem key={t.year} year={t.year} title={t.title} body={t.body} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function TimelineItem({ year, title, body, index }: { year: string; title: string; body: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute -left-[3.35rem] top-3 h-4 w-4 rounded-full border border-gold/60 bg-background md:-left-[4.6rem]"
      >
        <div className="absolute inset-0.5 rounded-full bg-gold shadow-[0_0_20px_var(--gold)]" />
      </motion.div>
      <div className="text-xs uppercase tracking-[0.32em] text-gold">{year}</div>
      <div className="mt-2 font-display text-4xl leading-tight md:text-5xl">{title}</div>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{body}</p>
    </motion.div>
  );
}

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative mx-auto max-w-7xl px-6 py-28 md:py-40", className)}>
      {(eyebrow || title || intro) && (
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="mb-6 text-xs uppercase tracking-[0.32em] text-gold/80">{eyebrow}</div>
          )}
          {title && (
            <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">{title}</h2>
          )}
          {intro && <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p>}
        </div>
      )}
      <div className={cn(eyebrow || title || intro ? "mt-16" : "")}>{children}</div>
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <div className={cn("group relative overflow-hidden rounded-3xl glass p-8 transition-all duration-500 hover:-translate-y-1", className)}>
      {glow && (
        <div className={cn("pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100", glow)} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const live = status === "Live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.28em]",
        live ? "border-gold/40 text-gold" : "border-border text-muted-foreground",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-gold shadow-[0_0_10px_var(--gold)]" : "bg-muted-foreground/50")} />
      {status}
    </span>
  );
}

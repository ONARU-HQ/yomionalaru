import { motion, type MotionProps } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Editorial section wrapper — generous whitespace, strong grid. */
export function Editorial({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  wide = false,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto px-6 py-24 sm:px-8 md:py-36",
        wide ? "max-w-[110rem]" : "max-w-7xl",
        className,
      )}
    >
      {(eyebrow || title || intro) && (
        <header className="max-w-4xl">
          {eyebrow && <div className="eyebrow mb-8">{eyebrow}</div>}
          {title && (
            <h2 className="font-display text-[clamp(2.25rem,7vw,4.75rem)] leading-[0.98]">{title}</h2>
          )}
          {intro && (
            <p className="mt-7 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground md:text-base">
              {intro}
            </p>
          )}
        </header>
      )}
      {children && <div className={cn(eyebrow || title || intro ? "mt-16 md:mt-24" : "")}>{children}</div>}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Masked line that rises into view — used for oversized display type. */
export function RiseLine({
  children,
  delay = 0,
  className,
  inView = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  const animate = { y: "0%" };
  return (
    <span className={cn("block overflow-hidden", className)}>
      <motion.span
        initial={{ y: "110%" }}
        {...(inView
          ? { whileInView: animate, viewport: { once: true, margin: "-40px" } }
          : { animate })}
        transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Thin uppercase label used for metadata rows. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

/** Number that counts up when it enters the viewport. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Text that types itself out once it scrolls into view. */
export function Typewriter({
  text,
  className,
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      setDone(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        let i = 0;
        const id = setInterval(() => {
          i += 1;
          setN(i);
          if (i >= text.length) {
            clearInterval(id);
            setDone(true);
          }
        }, speed);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, speed]);

  return (
    <p ref={ref} className={className}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {!done && <span className="caret text-gold" aria-hidden="true">|</span>}
      <span className="sr-only">{text}</span>
    </p>
  );
}

/** A thin animated bar used for live progress readouts. */
export function ProgressLine({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-baseline justify-between">
          <Label>{label}</Label>
          <span className="font-display text-sm text-gold">
            <Counter to={value} suffix="%" />
          </span>
        </div>
      )}
      <div className="h-px w-full bg-foreground/12">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: value / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-px origin-left bg-gold"
        />
      </div>
    </div>
  );
}

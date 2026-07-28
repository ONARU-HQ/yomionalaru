import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS } from "@/lib/site-data";
import { Section } from "@/components/ui-primitives";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export function StatCounters() {
  return (
    <Section
      eyebrow="By the numbers"
      title={<>A decade of <span className="gold-text">building.</span></>}
      intro="The receipts of a career built one project at a time."
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="border-t border-border/60 pt-6">
            <div className="font-display text-4xl md:text-6xl gold-text">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

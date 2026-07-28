import { useEffect, useRef, useState } from "react";

// Soft gold spotlight following the cursor. Desktop only, respects reduced-motion.
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduced) return;
    setEnabled(true);
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (ref.current) {
            ref.current.style.setProperty("--sx", `${x}px`);
            ref.current.style.setProperty("--sy", `${y}px`);
          }
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
      style={{
        background:
          "radial-gradient(360px 360px at var(--sx,50%) var(--sy,50%), oklch(0.82 0.13 82 / 0.10), transparent 60%)",
        transition: "opacity 0.3s",
      }}
    />
  );
}

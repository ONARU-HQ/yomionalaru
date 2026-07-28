import { motion } from "framer-motion";
import { WORLD_MARKERS } from "@/lib/site-data";
import { Section } from "@/components/ui-primitives";

// Stylised dotted-world map. Not geographically pixel-perfect — a mood piece.
const COLS = 60;
const ROWS = 26;

function inLand(c: number, r: number): boolean {
  // hand-tuned continent mask — good enough to feel like earth
  const shapes = [
    // N America
    (c: number, r: number) => c >= 10 && c <= 24 && r >= 6 && r <= 14 && !(c < 14 && r > 11),
    // S America
    (c: number, r: number) => c >= 20 && c <= 27 && r >= 14 && r <= 21,
    // Europe
    (c: number, r: number) => c >= 30 && c <= 36 && r >= 6 && r <= 11,
    // Africa
    (c: number, r: number) => c >= 30 && c <= 38 && r >= 11 && r <= 20,
    // Asia
    (c: number, r: number) => c >= 36 && c <= 50 && r >= 6 && r <= 15,
    // SE Asia + Aus
    (c: number, r: number) => c >= 46 && c <= 55 && r >= 16 && r <= 21,
  ];
  return shapes.some((s) => s(c, r));
}

export function WorldMap() {
  return (
    <Section
      eyebrow="Reach"
      title={<>Working from Africa. <span className="gold-text">Building for the world.</span></>}
      intro="Lagos and Accra are home. The rest of the map is the road ahead."
    >
      <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
        </div>
        <div className="relative aspect-[60/26] w-full">
          <svg viewBox={`0 0 ${COLS * 10} ${ROWS * 10}`} className="h-full w-full">
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                if (!inLand(c, r)) return null;
                return (
                  <circle
                    key={`${c}-${r}`}
                    cx={c * 10 + 5}
                    cy={r * 10 + 5}
                    r={1.4}
                    fill="oklch(0.82 0.13 82 / 0.35)"
                  />
                );
              }),
            )}
            {WORLD_MARKERS.map((m, i) => {
              const cx = (m.x / 100) * COLS * 10;
              const cy = (m.y / 100) * ROWS * 10;
              return (
                <g key={m.name}>
                  {m.live && (
                    <motion.circle
                      cx={cx} cy={cy} r={4}
                      fill="none" stroke="oklch(0.82 0.13 82)" strokeWidth="1"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 4, opacity: 0 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.4 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  )}
                  <circle
                    cx={cx} cy={cy} r={m.live ? 4 : 3}
                    fill={m.live ? "oklch(0.88 0.09 85)" : "oklch(0.62 0.14 70)"}
                    style={{ filter: m.live ? "drop-shadow(0 0 8px oklch(0.82 0.13 82))" : undefined }}
                  />
                  <text x={cx + 8} y={cy + 3}
                    className={m.live ? "fill-gold" : "fill-[color:var(--muted-foreground)]"}
                    style={{ font: "500 10px Inter, sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {m.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </Section>
  );
}

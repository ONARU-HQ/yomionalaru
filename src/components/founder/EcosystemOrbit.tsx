// ecosystem orbit
import { motion } from "framer-motion";
import { ECOSYSTEM } from "@/lib/site-data";

// Radial ecosystem: Yomi in the center, companies orbiting with connecting lines.
export function EcosystemOrbit({ compact = false }: { compact?: boolean }) {
  const size = compact ? 520 : 760;
  const center = size / 2;
  const parentR = compact ? 190 : 260;
  const childR = compact ? 78 : 108;
  const nodes = ECOSYSTEM.length;

  return (
    <div className="relative mx-auto" style={{ maxWidth: size }}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[100px]" />
      </div>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        <defs>
          <radialGradient id="orbGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.88 0.09 85)" stopOpacity="1" />
            <stop offset="60%" stopColor="oklch(0.82 0.13 82)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.62 0.14 70)" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.82 0.13 82)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.82 0.13 82)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* orbit rings */}
        <motion.circle
          cx={center} cy={center} r={parentR}
          fill="none" stroke="url(#lineGrad)" strokeWidth="1"
          strokeDasharray="2 6" opacity="0.5"
          initial={{ rotate: 0 }} animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />
        <circle cx={center} cy={center} r={parentR * 0.55}
          fill="none" stroke="oklch(0.82 0.13 82 / 0.1)" strokeWidth="1" />

        {/* connecting lines: center → parent */}
        {ECOSYSTEM.map((p, i) => {
          const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2;
          const px = center + Math.cos(angle) * parentR;
          const py = center + Math.sin(angle) * parentR;
          return (
            <g key={`line-${p.name}`}>
              <motion.line
                x1={center} y1={center} x2={px} y2={py}
                stroke="url(#lineGrad)" strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.08 }}
              />
              {/* parent → children */}
              {p.children?.map((c, ci) => {
                const spread = 0.35;
                const cAngle = angle + (ci - (p.children!.length - 1) / 2) * spread;
                const cx = px + Math.cos(cAngle) * childR;
                const cy = py + Math.sin(cAngle) * childR;
                return (
                  <motion.line
                    key={`cline-${c.name}`}
                    x1={px} y1={py} x2={cx} y2={cy}
                    stroke="oklch(0.82 0.13 82 / 0.35)" strokeWidth="1" strokeDasharray="2 3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.08 + ci * 0.05 }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* center — Yomi */}
        <g>
          <circle cx={center} cy={center} r={compact ? 46 : 62} fill="url(#orbGold)" opacity="0.9" />
          <circle cx={center} cy={center} r={compact ? 46 : 62} fill="none" stroke="oklch(0.82 0.13 82)" strokeWidth="1" />
          <text x={center} y={center - 4} textAnchor="middle"
            className="fill-[color:var(--primary-foreground)]"
            style={{ font: `500 ${compact ? 12 : 14}px Inter, sans-serif`, letterSpacing: "0.28em", textTransform: "uppercase" }}>
            Yomi
          </text>
          <text x={center} y={center + 14} textAnchor="middle"
            className="fill-[color:var(--primary-foreground)]"
            style={{ font: `500 ${compact ? 12 : 14}px Inter, sans-serif`, letterSpacing: "0.28em", textTransform: "uppercase" }}>
            Onalaru
          </text>
        </g>

        {/* parent nodes + children */}
        {ECOSYSTEM.map((p, i) => {
          const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2;
          const px = center + Math.cos(angle) * parentR;
          const py = center + Math.sin(angle) * parentR;
          return (
            <g key={p.name}>
              <NodeChip x={px} y={py} label={p.name} slug={p.slug} big />
              {p.children?.map((c, ci) => {
                const spread = 0.35;
                const cAngle = angle + (ci - (p.children!.length - 1) / 2) * spread;
                const cx = px + Math.cos(cAngle) * childR;
                const cy = py + Math.sin(cAngle) * childR;
                return <NodeChip key={c.name} x={cx} y={cy} label={c.name} slug={c.slug} />;
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function NodeChip({ x, y, label, slug, big }: { x: number; y: number; label: string; slug?: string; big?: boolean }) {
  const w = Math.max(label.length * (big ? 8.5 : 7), big ? 110 : 84);
  const h = big ? 40 : 30;
  const inner = (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`} className="group">
      <motion.rect
        width={w} height={h} rx={h / 2}
        fill="oklch(0.08 0.005 60 / 0.85)"
        stroke="oklch(0.82 0.13 82 / 0.5)" strokeWidth="1"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="transition-all duration-300 group-hover:fill-[oklch(0.14_0.02_70)]"
        style={{ filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.5))" }}
      />
      <text x={w / 2} y={h / 2 + (big ? 4.5 : 3.5)} textAnchor="middle"
        className="pointer-events-none fill-[color:var(--gold)] transition-colors group-hover:fill-[color:var(--gold-soft)]"
        style={{ font: `500 ${big ? 12 : 10.5}px Inter, sans-serif`, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {label}
      </text>
    </g>
  );
  if (slug) {
    return (
      <a href={`/companies/${slug}`} className="cursor-pointer">
        {inner}
      </a>
    );
  }
  return inner;

}

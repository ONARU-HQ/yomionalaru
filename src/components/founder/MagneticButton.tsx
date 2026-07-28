import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  onClick,
  as = "button",
  href,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "button" | "a";
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * 0.25);
    y.set(dy * 0.25);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  const inner = (
    <motion.div ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={cn("inline-flex", className)}>
      {children}
    </motion.div>
  );

  if (as === "a") return <a href={href} className="inline-block">{inner}</a>;
  return <button type="button" onClick={onClick} className="inline-block">{inner}</button>;
}

import { motion, useScroll } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
    />
  );
}

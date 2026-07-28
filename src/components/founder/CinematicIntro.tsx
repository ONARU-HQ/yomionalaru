import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SEEN_KEY = "yo-intro-seen";

export function CinematicIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        sessionStorage.setItem(SEEN_KEY, "1");
        return;
      }
      setShow(true);
      document.documentElement.style.overflow = "hidden";
      const t = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(SEEN_KEY, "1");
        document.documentElement.style.overflow = "";
      }, 2600);
      return () => {
        clearTimeout(t);
        document.documentElement.style.overflow = "";
      };
    } catch {
      /* noop */
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setShow(false)}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[140px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="grid h-40 w-40 place-items-center rounded-full border border-gold/40 bg-black/40 shadow-[0_0_80px_-10px_var(--gold)]">
              <span className="font-display text-6xl gold-shine">YO</span>
            </div>
            <motion.div
              className="mt-6 text-center text-[10px] uppercase tracking-[0.4em] text-gold/70"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Yomi Onalaru
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

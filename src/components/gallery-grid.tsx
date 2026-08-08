import { useState } from "react";
import { motion } from "framer-motion";
import { PHOTOS, PHOTO_CATEGORIES, photosByCategory, type PhotoCategory } from "@/lib/gallery";
import { Photo } from "@/components/photo";
import { cn } from "@/lib/utils";

/** Filterable masonry-ish gallery of the full photography archive. */
export function GalleryGrid() {
  const [active, setActive] = useState<PhotoCategory | "All">("All");
  const photos = photosByCategory(active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {(["All", ...PHOTO_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-5 py-2 text-[10px] uppercase tracking-[0.28em] transition",
              active === c
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {photos.map((p, i) => (
          <motion.figure
            key={p.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: (i % 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="group break-inside-avoid overflow-hidden rounded-2xl border border-border/50"
          >
            <Photo
              photo={p}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
              imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            <figcaption className="flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              <span className="text-foreground/80">{p.title}</span>
              <span className="text-gold/70">{p.category}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

/** Continuously scrolling strip of frames — the "hall of fame". */
export function HallOfFame() {
  const strip = [...PHOTOS.slice(0, 14), ...PHOTOS.slice(0, 14)];
  return (
    <div className="relative overflow-hidden py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-5 hover:[animation-play-state:paused]">
        {strip.map((p, i) => (
          <div key={`${p.slug}-${i}`} className="w-[240px] shrink-0 overflow-hidden rounded-xl border border-border/50">
            <Photo photo={p} ratio="4 / 5" sizes="240px" />
          </div>
        ))}
      </div>
    </div>
  );
}

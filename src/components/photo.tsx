import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Photo as PhotoType } from "@/lib/gallery";

/**
 * Reusable image primitive.
 * - blur-up placeholder (no layout shift, dimensions always declared)
 * - lazy by default, eager + high priority for hero images
 * - swap a photograph by changing the pointer in src/assets/gallery/
 */
export function Photo({
  photo,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes = "100vw",
  ratio,
}: {
  photo: PhotoType;
  alt?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** css aspect-ratio override, e.g. "4 / 5". Defaults to the file's own ratio. */
  ratio?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", className)}
      style={{ aspectRatio: ratio ?? `${photo.width} / ${photo.height}` }}
    >
      <img
        src={photo.blur}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full scale-105 object-cover blur-xl transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100",
        )}
      />
      <img
        ref={ref}
        src={photo.src}
        alt={alt ?? photo.title}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-out",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}

/**
 * Photographs that respond to phone movement (device orientation) and to
 * pointer position on desktop. Falls back to a static frame when the device
 * exposes nothing or the visitor prefers reduced motion.
 */
export function ResponsivePhoto({
  photo,
  alt,
  className,
  priority,
  ratio,
  intensity = 14,
  sizes,
}: {
  photo: PhotoType;
  alt?: string;
  className?: string;
  priority?: boolean;
  ratio?: string;
  intensity?: number;
  sizes?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setT({ x, y }));
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      const gamma = Math.max(-25, Math.min(25, e.gamma ?? 0));
      const beta = Math.max(-25, Math.min(25, (e.beta ?? 0) - 45));
      set(gamma / 25, beta / 25);
    };
    const onPointer = (e: PointerEvent) => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      set(
        ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 0.6,
        ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 0.6,
      );
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) window.addEventListener("deviceorientation", onOrient);
    else window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={wrap} className={cn("relative", className)} style={{ perspective: 1400 }}>
      <div
        className="h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `rotateY(${t.x * (intensity / 6)}deg) rotateX(${-t.y * (intensity / 8)}deg) translate3d(${t.x * intensity}px, ${t.y * (intensity / 2)}px, 0)`,
        }}
      >
        <Photo photo={photo} alt={alt} priority={priority} ratio={ratio} sizes={sizes} className="h-full w-full" />
      </div>
    </div>
  );
}

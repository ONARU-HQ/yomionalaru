// Responsive source sets for CDN-hosted photography.
// Derivatives (WebP + AVIF at 640/1080) are generated at build-prep time and
// recorded in src/assets/gallery/derivatives.json.
import derivatives from "@/assets/gallery/derivatives.json";

type Pointer = { url: string };
const MAP = derivatives as unknown as Record<string, Pointer>;

const WIDTHS = [640, 1080] as const;

/** "/__l5e/assets-v1/<id>/a-king.jpg" -> "a-king" */
export function baseName(src: string): string {
  const file = src.split("/").pop() ?? "";
  return file.replace(/\.[a-z0-9]+$/i, "");
}

function srcSet(base: string, ext: "webp" | "avif"): string | undefined {
  const parts = WIDTHS.map((w) => {
    const entry = MAP[`${base}-${w}.${ext}`];
    return entry ? `${entry.url} ${w}w` : null;
  }).filter(Boolean) as string[];
  return parts.length ? parts.join(", ") : undefined;
}

export type ImageSources = { avif?: string; webp?: string };

/** Returns AVIF/WebP srcsets for a CDN image, or empty when none exist yet. */
export function sourcesFor(src: string): ImageSources {
  const base = baseName(src);
  return { avif: srcSet(base, "avif"), webp: srcSet(base, "webp") };
}

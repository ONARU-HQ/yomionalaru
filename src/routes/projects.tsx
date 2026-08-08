import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Section, Reveal } from "@/components/ui-primitives";
import { PROJECTS } from "@/lib/site-data";
import { GalleryGrid, HallOfFame } from "@/components/gallery-grid";
import { PHOTOS } from "@/lib/gallery";

const COVER = PHOTOS[0];

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Selected Work & Gallery — Yomi Onalaru" },
      { name: "description", content: "The photography archive of Yomi Onalaru — portraits, fashion, culture and commercial frames shot through Yomi Visuals." },
      { property: "og:title", content: "Selected Work & Gallery — Yomi Onalaru" },
      { property: "og:description", content: "Portraits, fashion, culture and commercial photography from Yomi Visuals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

function Projects() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Selected work</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            The <span className="gold-shine">archive.</span>
          </h1>
          <p className="mt-8 max-w-xl text-muted-foreground">
            {PHOTOS.length} frames — portraits, fashion, culture and commercial work.
          </p>
        </Reveal>
      </section>

      <section className="pb-8">
        <HallOfFame />
      </section>

      <Section eyebrow="Gallery" title={<>Every <span className="gold-text">frame.</span></>}>
        <GalleryGrid />
      </Section>

      <Section eyebrow="Case studies" title={<>Projects that made <span className="gold-text">the point.</span></>}>

        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl glass p-10 transition hover:-translate-y-1">
                <div className="pointer-events-none absolute -inset-40 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.28em] text-gold/80">{p.tag} · {p.year}</div>
                  <div className="mt-4 font-display text-3xl md:text-4xl">{p.title}</div>
                  <p className="mt-4 text-sm text-muted-foreground">{p.body}</p>
                  <div className="mt-10 hairline" />
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="uppercase tracking-[0.28em] text-muted-foreground">Case study</span>
                    <ArrowUpRight className="h-4 w-4 text-foreground/70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

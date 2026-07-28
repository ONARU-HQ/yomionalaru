import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { BREAKING_BOUNDARIES, MEDIA_ITEMS } from "@/lib/site-data";
import { Section, Reveal } from "@/components/ui-primitives";

export const Route = createFileRoute("/media")({
  component: Media,
  head: () => ({
    meta: [
      { title: "Media — Yomi Onalaru" },
      { name: "description", content: "Breaking Boundaries — the video series. Plus podcasts, features and interviews." },
      { property: "og:title", content: "Media — Yomi Onalaru" },
      { property: "og:description", content: "Watch, listen, read." },
      { property: "og:url", content: "/media" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
});

function Media() {
  const f = BREAKING_BOUNDARIES.featured;
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Media</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Watch. Listen. <span className="gold-shine">Read.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Breaking Boundaries is the flagship video series. Everything else — the podcasts, features and interviews — lives here too.
          </p>
        </Reveal>
      </section>

      {/* Breaking Boundaries — Featured */}
      <Section eyebrow="Breaking Boundaries" title={<>The <span className="gold-text">series.</span></>}
        intro="A cinematic conversation series on creativity, business, and building the future of both.">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 glass">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${f.youtubeId}?rel=0&modestbranding=1`}
                title={f.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6 p-8 md:p-10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Featured episode</div>
                <div className="mt-3 font-display text-3xl md:text-4xl">{f.title}</div>
                <p className="mt-3 max-w-2xl text-muted-foreground">{f.summary}</p>
              </div>
              <a
                href={`https://youtube.com/watch?v=${f.youtubeId}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-gold-soft"
              >
                <Play className="h-4 w-4" /> Watch on YouTube
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Episode grid */}
      <Section eyebrow="Episodes" title={<>More <span className="gold-text">chapters.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BREAKING_BOUNDARIES.episodes.map((e, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <a href={`https://youtube.com/watch?v=${e.youtubeId}`} target="_blank" rel="noreferrer"
                className="group block overflow-hidden rounded-3xl glass transition hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={`https://i.ytimg.com/vi/${e.youtubeId}/hqdefault.jpg`}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-black/50 backdrop-blur transition group-hover:scale-110">
                      <Play className="h-5 w-5 text-gold" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-display text-2xl">{e.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{e.summary}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Press */}
      <Section eyebrow="Press" title={<>On the <span className="gold-text">record.</span></>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MEDIA_ITEMS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.04}>
              <div className="rounded-3xl glass p-6 h-full">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">{m.type}</div>
                <div className="mt-4 font-display text-2xl">{m.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

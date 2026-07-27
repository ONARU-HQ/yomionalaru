import { createFileRoute } from "@tanstack/react-router";
import { Section, Reveal } from "@/components/ui-primitives";
import { MEDIA_ITEMS } from "@/lib/site-data";

export const Route = createFileRoute("/media")({
  component: Media,
  head: () => ({
    meta: [
      { title: "Media — Yomi Onalaru" },
      { name: "description", content: "Interviews, podcasts, articles and features on Yomi Onalaru." },
      { property: "og:title", content: "Media — Yomi Onalaru" },
      { property: "og:description", content: "Interviews, podcasts, articles and features." },
      { property: "og:url", content: "/media" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
});

function Media() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-48">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.32em] text-gold/80">Media</div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] md:text-8xl">
            Interviews, features & <span className="gold-shine">conversations.</span>
          </h1>
        </Reveal>
      </section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MEDIA_ITEMS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.04}>
              <div className="group rounded-3xl glass p-8 transition hover:-translate-y-1">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">{m.type}</div>
                <div className="mt-3 font-display text-2xl group-hover:text-gold-soft">{m.title}</div>
                <p className="mt-3 text-sm text-muted-foreground">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

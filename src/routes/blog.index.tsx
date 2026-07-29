import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Section, Reveal } from "@/components/ui-primitives";
import { ARTICLES } from "@/content/articles";
import { SITE_URL } from "@/lib/site-data";

export const Route = createFileRoute("/blog/")({
  component: Blog,
  head: () => ({
    meta: [
      { title: "Blog — Business, Systems & Leadership | Yomi Onalaru" },
      { name: "description", content: "Essays on business, systems, leadership, faith, creativity and AI by Yomi Onalaru, founder of ONARU." },
      { property: "og:title", content: "Blog — Yomi Onalaru" },
      { property: "og:description", content: "Essays on building companies that solve meaningful problems." },
      { property: "og:url", content: `${SITE_URL}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
});

function Blog() {
  return (
    <Section
      eyebrow="Blog"
      title={<>Thinking, <span className="gold-text">written down.</span></>}
      intro="Systems, leadership, faith and the honest work of building companies."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {ARTICLES.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.05}>
            <Link to="/blog/$slug" params={{ slug: a.slug }} className="group block h-full">
              <article className="flex h-full flex-col rounded-3xl glass p-8 transition hover:-translate-y-1">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-gold/80">
                  <span>{a.category}</span>
                  <span className="text-muted-foreground">{a.date}</span>
                </div>
                <h2 className="mt-6 font-display text-3xl leading-tight group-hover:text-gold">{a.title}</h2>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {a.readMins} min read
                </div>
              </article>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

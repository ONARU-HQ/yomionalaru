import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Section, Reveal } from "@/components/ui-primitives";
import { SITE_URL } from "@/lib/site-data";
import { usePublicArticles } from "@/lib/public-content";

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
  const { articles, isLoading } = usePublicArticles();

  return (
    <Section
      eyebrow="Blog"
      title={<>Thinking, <span className="gold-text">written down.</span></>}
      intro="Systems, leadership, faith and the honest work of building companies."
    >
      {isLoading && articles.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl border border-border/50 bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.05}>
              <Link to="/blog/$slug" params={{ slug: a.slug }} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-3xl glass transition hover:-translate-y-1">
                  {a.image && (
                    <img src={a.image} alt={a.title} loading="lazy" className="h-48 w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-gold/80">
                      <span>{a.category}</span>
                      <span className="text-muted-foreground">{a.date}</span>
                    </div>
                    <h2 className="mt-6 font-display text-3xl leading-tight group-hover:text-gold">{a.title}</h2>
                    <p className="mt-4 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                    <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {a.readMins} min read
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
          {articles.length === 0 && (
            <p className="text-sm text-muted-foreground">No articles published yet.</p>
          )}
        </div>
      )}
    </Section>
  );
}

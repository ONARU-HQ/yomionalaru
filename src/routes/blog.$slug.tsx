import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/ui-primitives";
import { ARTICLES, getArticle } from "@/content/articles";
import { SITE_URL } from "@/lib/site-data";
import { ReadingProgress } from "@/components/founder/ReadingProgress";
import { usePublicArticle, usePublicArticles } from "@/lib/public-content";
import { Markdown } from "@/components/markdown";
import { useArticleView } from "@/lib/analytics";

export const Route = createFileRoute("/blog/$slug")({
  component: ArticlePage,
  head: ({ params }) => {
    const a = getArticle(params.slug);
    const url = `${SITE_URL}/blog/${params.slug}`;
    if (!a) {
      return {
        meta: [
          { title: "Article — Yomi Onalaru" },
          { property: "og:type", content: "article" },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    return {
      meta: [
        { title: `${a.title} | Yomi Onalaru` },
        { name: "description", content: a.description },
        { name: "keywords", content: a.keywords.join(", ") },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.description,
            datePublished: a.iso,
            author: { "@type": "Person", name: "Yomi Onalaru", url: SITE_URL },
            publisher: { "@type": "Organization", name: "ONARU", url: SITE_URL },
            mainEntityOfPage: url,
            keywords: a.keywords.join(", "),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: a.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: a.title, item: url },
            ],
          }),
        },
      ],
    };
  },
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { article, isLoading } = usePublicArticle(slug);
  const { articles } = usePublicArticles();
  useArticleView(article?.id ?? null);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-44 text-center">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading article…</p>
        ) : (
          <>
            <h1 className="font-display text-4xl">This article isn't here.</h1>
            <Link to="/blog" className="mt-8 inline-block text-sm uppercase tracking-[0.3em] text-gold">
              Back to the blog →
            </Link>
          </>
        )}
      </div>
    );
  }

  const stat = article.fromCms ? undefined : getArticle(slug);
  const related = stat
    ? stat.related.map((r) => ARTICLES.find((x) => x.slug === r)).filter(Boolean).map((r) => ({ slug: r!.slug, title: r!.title, category: r!.category }))
    : articles.filter((a) => a.slug !== slug).slice(0, 2).map((a) => ({ slug: a.slug, title: a.title, category: a.category }));

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-36 md:pt-44">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>
        <div className="mt-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-gold/80">
          <span>{article.category}</span>
          <span className="text-muted-foreground">{article.date}</span>
          <span className="text-muted-foreground">{article.readMins} min read</span>
        </div>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02]">{article.title}</h1>

        {article.image && (
          <img src={article.image} alt={article.title} className="mt-10 w-full rounded-3xl border border-gold/20 object-cover" />
        )}

        {stat ? (
          <>
            <div className="mt-10 space-y-5">
              {stat.lede.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-foreground/85">{p}</p>
              ))}
            </div>

            <div className="mt-16 space-y-16">
              {stat.sections.map((s) => (
                <Reveal key={s.h2}>
                  <section>
                    <h2 className="font-display text-3xl leading-tight md:text-4xl">{s.h2}</h2>
                    <div className="mt-6 space-y-5">
                      {s.body.map((p, i) => (
                        <p key={i} className="leading-relaxed text-muted-foreground">{p}</p>
                      ))}
                    </div>
                    {s.list && (
                      <ul className="mt-6 space-y-3 border-l border-gold/30 pl-6">
                        {s.list.map((li) => (
                          <li key={li} className="text-sm text-foreground/80">{li}</li>
                        ))}
                      </ul>
                    )}
                    {s.h3?.map((h) => (
                      <div key={h.title} className="mt-8 rounded-2xl glass p-6">
                        <h3 className="font-display text-xl">{h.title}</h3>
                        {h.body.map((p, i) => (
                          <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{p}</p>
                        ))}
                      </div>
                    ))}
                  </section>
                </Reveal>
              ))}
            </div>

            <section className="mt-20">
              <h2 className="font-display text-3xl">Frequently asked</h2>
              <div className="mt-6 space-y-4">
                {stat.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl glass p-6">
                    <h3 className="font-display text-lg">{f.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 rounded-3xl glass p-8">
              <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Next step</div>
              <h2 className="mt-4 font-display text-3xl">{stat.cta.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{stat.cta.body}</p>
              <Link to={stat.cta.to} className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-gold-soft">
                {stat.cta.label}
              </Link>
            </section>
          </>
        ) : (
          <>
            {article.excerpt && (
              <p className="mt-10 text-lg leading-relaxed text-foreground/85">{article.excerpt}</p>
            )}
            <div className="mt-8">
              <Markdown source={article.body ?? ""} />
            </div>
          </>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Keep reading</div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="rounded-2xl glass p-6 transition hover:-translate-y-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{r.category}</div>
                  <div className="mt-3 font-display text-xl">{r.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

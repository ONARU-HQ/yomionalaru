import { usePublicRows, usePublishedArticles, type Article, type CmsCompany, type PortfolioItem, type Testimonial } from "@/lib/cms";
import { COMPANIES, PROJECTS, TESTIMONIALS, MEDIA_ITEMS, SPEAKING_EVENTS, BOOKS } from "@/lib/site-data";
import { ARTICLES } from "@/content/articles";
import { usePreview } from "@/lib/preview";

/**
 * Public reads. Every hook prefers CMS rows and falls back to the
 * built-in content while the database is still empty, so the site is
 * never blank and stays fully editable from /admin.
 */

export type PublicCompany = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  status: string;
  launchYear: string;
  progress: number;
  logo?: string | null;
  cover?: string | null;
  fromCms: boolean;
};

export function usePublicCompanies() {
  const preview = usePreview();
  const { data = [], isLoading } = usePublicRows<CmsCompany>("companies", "sort_order", preview);
  const rows: PublicCompany[] = data.length
    ? data
        .filter((c) => preview || c.visible !== false)
        .map((c) => ({
          slug: c.slug,
          name: c.name,
          category: c.category ?? "",
          tagline: c.tagline ?? "",
          description: c.description ?? "",
          status: c.status,
          launchYear: c.launch_year ?? "",
          progress: c.progress ?? 0,
          logo: c.logo_url,
          cover: c.cover_image,
          fromCms: true,
        }))
    : COMPANIES.map((c) => ({
        slug: c.slug,
        name: c.name,
        category: c.category,
        tagline: c.tagline,
        description: c.description,
        status: c.status,
        launchYear: String(c.launchYear),
        progress: c.progress ?? 50,
        logo: null,
        cover: null,
        fromCms: false,
      }));
  return { companies: rows, isLoading };
}

export type PublicArticle = {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  iso: string;
  readMins: number;
  image?: string | null;
  body?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags?: string[];
  fromCms: boolean;
};

const fmt = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function mapCmsArticle(a: Article): PublicArticle {
  const iso = (a.published_at ?? a.created_at).slice(0, 10);
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? "",
    category: a.tags?.[0] ?? "Essay",
    date: fmt(iso),
    iso,
    readMins: a.reading_time,
    image: a.featured_image,
    body: a.body,
    seoTitle: a.seo_title,
    seoDescription: a.seo_description,
    tags: a.tags ?? [],
    fromCms: true,
  };
}

function mapStaticArticle(a: (typeof ARTICLES)[number]): PublicArticle {
  return {
    id: null,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    date: a.date,
    iso: a.iso,
    readMins: a.readMins,
    image: null,
    fromCms: false,
  };
}

export function usePublicArticles(limit?: number) {
  const preview = usePreview();
  const { data = [], isLoading } = usePublishedArticles(limit, preview);
  const rows: PublicArticle[] = data.length
    ? (data as Article[]).map(mapCmsArticle)
    : ARTICLES.slice(0, limit ?? ARTICLES.length).map(mapStaticArticle);
  return { articles: rows, isLoading };
}

/** Resolves an article by slug from the CMS first, then the built-in content. */
export function usePublicArticle(slug: string) {
  const preview = usePreview();
  const { data = [], isLoading } = usePublishedArticles(undefined, preview);
  const cms = (data as Article[]).find((a) => a.slug === slug);
  if (cms) return { article: mapCmsArticle(cms), isLoading: false };
  const stat = ARTICLES.find((a) => a.slug === slug);
  return { article: stat ? mapStaticArticle(stat) : null, isLoading };
}


export type PublicProject = {
  slug: string;
  title: string;
  tag: string;
  year: string;
  body: string;
  image?: string | null;
};

export function usePublicProjects() {
  const preview = usePreview();
  const { data = [] } = usePublicRows<PortfolioItem>("portfolio", "sort_order", preview);
  const rows: PublicProject[] = data.length
    ? data
        .filter((p) => preview || p.visible !== false)
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          tag: p.category ?? "",
          year: p.year ?? "",
          body: p.description ?? "",
          image: p.cover_image,
        }))
    : PROJECTS.map((p) => ({ ...p, image: null }));
  return rows;
}

export type PublicTestimonial = { quote: string; who: string; role?: string | null; avatar?: string | null };

export function usePublicTestimonials() {
  const preview = usePreview();
  const { data = [] } = usePublicRows<Testimonial>("testimonials", "sort_order", preview);
  const rows: PublicTestimonial[] = data.length
    ? data
        .filter((t) => preview || t.visible !== false)
        .map((t) => ({
          quote: t.quote,
          who: t.name,
          role: [t.role, t.company].filter(Boolean).join(", ") || null,
          avatar: t.avatar_url,
        }))
    : TESTIMONIALS.map((t) => ({ quote: t.quote, who: t.who, role: null, avatar: null }));
  return rows;
}

export type PublicResource = { title: string; type: string; body: string; url?: string | null };

export function usePublicResources() {
  const preview = usePreview();
  const { data = [] } = usePublicRows<{
    title: string; description: string | null; type: string | null; url: string | null; visible: boolean;
  }>("resources", "sort_order", preview);
  const rows: PublicResource[] = data.length
    ? data
        .filter((r) => preview || r.visible !== false)
        .map((r) => ({ title: r.title, type: r.type ?? "Resource", body: r.description ?? "", url: r.url }))
    : MEDIA_ITEMS.map((m) => ({ title: m.title, type: m.type, body: m.body, url: null }));
  return rows;
}

export function usePublicSpeaking() {
  const preview = usePreview();
  const { data = [] } = usePublicRows<{
    title: string; event: string | null; location: string | null; date: string | null;
    description: string | null; link: string | null; visible: boolean;
  }>("speaking", "sort_order", preview);
  return data.length
    ? data.filter((s) => preview || s.visible !== false).map((s) => ({
        name: s.title,
        venue: s.location ?? "",
        year: s.date ?? "",
        note: s.description ?? "",
        link: s.link,
      }))
    : SPEAKING_EVENTS.map((s) => ({ ...s, link: null }));
}

export function usePublicBooks() {
  const preview = usePreview();
  const { data = [] } = usePublicRows<{
    title: string; author: string | null; note: string | null; link: string | null; visible: boolean;
  }>("books", "sort_order", preview);
  return data.length
    ? data.filter((b) => preview || b.visible !== false).map((b) => ({
        title: b.title,
        author: b.author ?? "",
        note: b.note,
        link: b.link,
      }))
    : BOOKS.map((b) => ({ ...b, note: null, link: null }));
}

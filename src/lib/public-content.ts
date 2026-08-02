import { usePublicRows, usePublishedArticles, type Article, type CmsCompany, type PortfolioItem, type Testimonial } from "@/lib/cms";
import { COMPANIES, PROJECTS, TESTIMONIALS, MEDIA_ITEMS, SPEAKING_EVENTS, BOOKS } from "@/lib/site-data";
import { ARTICLES } from "@/content/articles";

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
  const { data = [], isLoading } = usePublicRows<CmsCompany>("companies");
  const rows: PublicCompany[] = data.length
    ? data
        .filter((c) => c.visible !== false)
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
  slug: string;
  title: string;
  excerpt: string;
  iso: string;
  readMins: number;
  image?: string | null;
};

export function usePublicArticles(limit?: number) {
  const { data = [], isLoading } = usePublishedArticles(limit);
  const rows: PublicArticle[] = data.length
    ? (data as Article[]).map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt ?? "",
        iso: (a.published_at ?? a.created_at).slice(0, 10),
        readMins: a.reading_time,
        image: a.featured_image,
      }))
    : ARTICLES.slice(0, limit ?? ARTICLES.length).map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        iso: a.iso,
        readMins: a.readMins,
        image: null,
      }));
  return { articles: rows, isLoading };
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
  const { data = [] } = usePublicRows<PortfolioItem>("portfolio");
  const rows: PublicProject[] = data.length
    ? data
        .filter((p) => p.visible !== false)
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
  const { data = [] } = usePublicRows<Testimonial>("testimonials");
  const rows: PublicTestimonial[] = data.length
    ? data
        .filter((t) => t.visible !== false)
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
  const { data = [] } = usePublicRows<{
    title: string; description: string | null; type: string | null; url: string | null; visible: boolean;
  }>("resources");
  const rows: PublicResource[] = data.length
    ? data
        .filter((r) => r.visible !== false)
        .map((r) => ({ title: r.title, type: r.type ?? "Resource", body: r.description ?? "", url: r.url }))
    : MEDIA_ITEMS.map((m) => ({ title: m.title, type: m.type, body: m.body, url: null }));
  return rows;
}

export function usePublicSpeaking() {
  const { data = [] } = usePublicRows<{
    title: string; event: string | null; location: string | null; date: string | null;
    description: string | null; link: string | null; visible: boolean;
  }>("speaking");
  return data.length
    ? data.filter((s) => s.visible !== false).map((s) => ({
        name: s.title,
        venue: s.location ?? "",
        year: s.date ?? "",
        note: s.description ?? "",
        link: s.link,
      }))
    : SPEAKING_EVENTS.map((s) => ({ ...s, link: null }));
}

export function usePublicBooks() {
  const { data = [] } = usePublicRows<{
    title: string; author: string | null; note: string | null; link: string | null; visible: boolean;
  }>("books");
  return data.length
    ? data.filter((b) => b.visible !== false).map((b) => ({
        title: b.title,
        author: b.author ?? "",
        note: b.note,
        link: b.link,
      }))
    : BOOKS.map((b) => ({ ...b, note: null, link: null }));
}

import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { COMPANIES, MENTORSHIP, SITE_URL } from "@/lib/site-data";
import { ARTICLES } from "@/content/articles";
import { sitemapVersion } from "@/lib/sitemap-cache";

const BASE_URL = SITE_URL;

type Entry = { path: string; lastmod?: string };

let cache: { version: number; xml: string; etag: string } | null = null;

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function buildEntries(): Promise<Entry[]> {
  const staticPaths: Entry[] = [
    "/", "/about", "/companies", "/mentorship", "/blog", "/projects", "/speaking", "/media", "/contact",
  ].map((path) => ({ path }));

  const entries: Entry[] = [...staticPaths];

  let cmsArticles: Entry[] = [];
  let cmsCompanies: Entry[] = [];

  try {
    const supabase = publicClient();
    const [{ data: articles }, { data: companies }] = await Promise.all([
      supabase.from("articles").select("slug, updated_at, published_at, status").eq("status", "published"),
      supabase.from("companies").select("slug, updated_at, visible"),
    ]);

    cmsArticles = (articles ?? []).map((a: { slug: string; updated_at: string | null; published_at: string | null }) => ({
      path: `/blog/${a.slug}`,
      lastmod: (a.updated_at ?? a.published_at ?? undefined)?.slice(0, 10),
    }));

    cmsCompanies = (companies ?? [])
      .filter((c: { visible: boolean | null }) => c.visible !== false)
      .map((c: { slug: string; updated_at: string | null }) => ({
        path: `/companies/${c.slug}`,
        lastmod: c.updated_at?.slice(0, 10),
      }));
  } catch {
    /* fall back to built-in content below */
  }

  entries.push(
    ...(cmsCompanies.length ? cmsCompanies : COMPANIES.map((c) => ({ path: `/companies/${c.slug}` }))),
    ...MENTORSHIP.map((m) => ({ path: `/mentorship/${m.slug}` })),
    ...(cmsArticles.length ? cmsArticles : ARTICLES.map((a) => ({ path: `/blog/${a.slug}` }))),
  );

  // de-dupe by path, first wins
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)));
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const version = sitemapVersion();
        if (!cache || cache.version !== version) {
          const entries = await buildEntries();
          const urls = entries
            .map(
              (e) =>
                `  <url>\n    <loc>${BASE_URL}${e.path}</loc>${
                  e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""
                }\n    <changefreq>weekly</changefreq>\n  </url>`,
            )
            .join("\n");
          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
          cache = { version, xml, etag: `W/"sitemap-${version}-${xml.length}"` };
        }

        if (request.headers.get("if-none-match") === cache.etag) {
          return new Response(null, { status: 304, headers: { ETag: cache.etag } });
        }

        return new Response(cache.xml, {
          headers: {
            "Content-Type": "application/xml",
            ETag: cache.etag,
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600, must-revalidate",
          },
        });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { COMPANIES, JOURNAL_POSTS } from "@/lib/site-data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/", "/about", "/companies", "/projects", "/speaking", "/journal", "/media", "/contact",
          ...COMPANIES.map((c) => `/companies/${c.slug}`),
          ...JOURNAL_POSTS.map((p) => `/journal/${p.slug}`),
        ];
        const urls = paths.map((p) =>
          `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});

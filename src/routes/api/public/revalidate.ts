import { createFileRoute } from "@tanstack/react-router";
import { bumpSitemapVersion } from "@/lib/sitemap-cache";

/**
 * Cache revalidation hook for CMS changes.
 * Invalidates the cached sitemap so new/renamed slugs are served immediately.
 * Safe to call publicly: it performs no reads or writes on user data.
 */
export const Route = createFileRoute("/api/public/revalidate")({
  server: {
    handlers: {
      POST: async () => {
        const version = bumpSitemapVersion();
        return Response.json(
          { ok: true, version, revalidated: ["/sitemap.xml"] },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
      GET: async () =>
        Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } }),
    },
  },
});

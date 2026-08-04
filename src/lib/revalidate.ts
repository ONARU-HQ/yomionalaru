/**
 * Tells the server that CMS content changed so the cached sitemap is rebuilt
 * and search engines pick up new/renamed slugs on their next crawl.
 * Fire-and-forget: never blocks or fails a CMS save.
 */
export async function revalidateContent(reason?: string) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/public/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason ?? "cms-change" }),
    });
  } catch {
    /* non-critical */
  }
}

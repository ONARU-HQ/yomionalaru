import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled integration sync.
 * Called by the database scheduler (pg_cron) with the project apikey header.
 */
export const Route = createFileRoute("/api/public/sync-integrations")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected =
          process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "";
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";
        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { runIntegrationSync } = await import("@/lib/integrations.server");
        const results = await runIntegrationSync();
        return Response.json({ ok: true, results });
      },
    },
  },
});

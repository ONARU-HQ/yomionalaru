import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Integration service layer.
 *
 * Product data (YouTube, TRYSA, YV Studios) is fetched on the server, validated,
 * then cached in `integration_cache`. Public surfaces always read the cache, so a
 * slow or unreachable product never slows the site down — and a failed sync
 * falls back to the last good payload rather than showing invented data.
 * No product credentials ever reach the browser.
 */

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  thumbnail: string | null;
  publishedAt: string | null;
};

export type IntegrationPayload = {
  key: string;
  connection: "live" | "synced" | "curated" | "not_connected";
  fetchedAt: string | null;
  ok: boolean;
  error: string | null;
  data: unknown;
};

const KEYS = ["youtube_yomi_unscripted", "trysa_status", "yv_studios_availability"] as const;

/** Public read of the cached integration payloads. Safe fields only. */
export const getIntegrationData = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({ keys: z.array(z.string().max(60)).max(10).optional() })
      .parse(data ?? {}),
  )
  .handler(async ({ data }): Promise<IntegrationPayload[]> => {
    const wanted = data.keys?.length ? data.keys : [...KEYS];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [sources, cache] = await Promise.all([
      supabaseAdmin.from("integration_sources").select("key, connection, enabled, last_sync_at, last_error"),
      supabaseAdmin.from("integration_cache").select("source_key, payload, fetched_at, ok, error"),
    ]);

    const cacheByKey = new Map(
      (cache.data ?? []).map((r) => [r.source_key as string, r] as const),
    );

    return wanted.map((key) => {
      const source = (sources.data ?? []).find((s) => s.key === key);
      const cached = cacheByKey.get(key);
      const connected = Boolean(source?.enabled) && Boolean(cached?.ok);
      return {
        key,
        connection: connected
          ? ((source?.connection as IntegrationPayload["connection"]) ?? "synced")
          : "not_connected",
        fetchedAt: (cached?.fetched_at as string | null) ?? null,
        ok: Boolean(cached?.ok),
        error: (cached?.error as string | null) ?? null,
        data: cached?.payload ?? null,
      };
    });
  });

/** Trigger a sync of every enabled integration. Admin-only via the caller check. */
export const syncIntegrations = createServerFn({ method: "POST" }).handler(async () => {
  const { runIntegrationSync } = await import("@/lib/integrations.server");
  return runIntegrationSync();
});

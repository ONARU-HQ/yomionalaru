/**
 * Server-only integration sync.
 *
 * Each source is fetched, validated and written to `integration_cache`.
 * A failure never destroys the previous good payload — it only records the
 * error, so public surfaces keep serving the last known-good data.
 */

export type SyncResult = { key: string; ok: boolean; error: string | null };

type Source = {
  key: string;
  provider: string;
  endpoint_url: string | null;
  enabled: boolean;
  config: Record<string, unknown>;
};

async function writeCache(key: string, payload: unknown, ok: boolean, error: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  if (ok) {
    await supabaseAdmin.from("integration_cache").upsert(
      {
        source_key: key,
        payload: payload as never,
        fetched_at: new Date().toISOString(),
        ok: true,
        error: null,
      } as never,
      { onConflict: "source_key" },
    );
  } else {
    const { data: existing } = await supabaseAdmin
      .from("integration_cache")
      .select("payload")
      .eq("source_key", key)
      .maybeSingle();
    await supabaseAdmin.from("integration_cache").upsert(
      {
        source_key: key,
        payload: (existing?.payload ?? {}) as never,
        ok: false,
        error,
      } as never,
      { onConflict: "source_key" },
    );
  }
  await supabaseAdmin
    .from("integration_sources")
    .update({ last_sync_at: new Date().toISOString(), last_error: error } as never)
    .eq("key", key);
}

/** YouTube: latest uploads for the Yomi Unscripted channel. */
async function syncYouTube(source: Source): Promise<SyncResult> {
  const apiKey = process.env["YOUTUBE_API_KEY"];
  if (!apiKey) {
    await writeCache(source.key, null, false, "YOUTUBE_API_KEY is not configured");
    return { key: source.key, ok: false, error: "YOUTUBE_API_KEY is not configured" };
  }

  const handle = (source.config["handle"] as string | undefined) ?? "YVStudiosHQ";
  const explicitChannelId = source.config["channel_id"] as string | undefined;

  try {
    let channelId = explicitChannelId;
    if (!channelId) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`,
      );
      const json = (await res.json()) as {
        items?: { id: string; contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
      };
      channelId = json.items?.[0]?.id;
      const uploads = json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploads) throw new Error("Channel not found for handle @" + handle);
      const vidRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=8&playlistId=${uploads}&key=${apiKey}`,
      );
      const vids = (await vidRes.json()) as {
        items?: {
          snippet: {
            title: string;
            publishedAt: string;
            resourceId: { videoId: string };
            thumbnails?: Record<string, { url: string }>;
          };
        }[];
      };
      const videos = (vids.items ?? []).map((i) => ({
        id: i.snippet.resourceId.videoId,
        title: i.snippet.title,
        url: `https://www.youtube.com/watch?v=${i.snippet.resourceId.videoId}`,
        thumbnail:
          i.snippet.thumbnails?.["maxres"]?.url ??
          i.snippet.thumbnails?.["high"]?.url ??
          i.snippet.thumbnails?.["medium"]?.url ??
          null,
        publishedAt: i.snippet.publishedAt,
      }));
      await writeCache(source.key, { channelId, handle, videos }, true, null);
      return { key: source.key, ok: true, error: null };
    }
    throw new Error("channel_id configured without uploads playlist lookup");
  } catch (e) {
    const message = e instanceof Error ? e.message : "YouTube sync failed";
    await writeCache(source.key, null, false, message);
    return { key: source.key, ok: false, error: message };
  }
}

/** Generic JSON endpoint (TRYSA, YV Studios and any future product). */
async function syncJsonEndpoint(source: Source): Promise<SyncResult> {
  if (!source.endpoint_url) {
    const error = "No endpoint configured";
    await writeCache(source.key, null, false, error);
    return { key: source.key, ok: false, error };
  }
  try {
    const token = process.env[`INTEGRATION_TOKEN_${source.key.toUpperCase()}`];
    const res = await fetch(source.endpoint_url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
    const json = (await res.json()) as unknown;
    if (typeof json !== "object" || json === null) throw new Error("Unexpected response shape");
    await writeCache(source.key, json, true, null);
    return { key: source.key, ok: true, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    await writeCache(source.key, null, false, message);
    return { key: source.key, ok: false, error: message };
  }
}

export async function runIntegrationSync(): Promise<SyncResult[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("integration_sources")
    .select("key, provider, endpoint_url, enabled, config")
    .eq("enabled", true);

  const sources = (data ?? []) as unknown as Source[];
  const results: SyncResult[] = [];
  for (const source of sources) {
    results.push(
      source.provider === "youtube"
        ? await syncYouTube(source)
        : await syncJsonEndpoint(source),
    );
  }
  return results;
}

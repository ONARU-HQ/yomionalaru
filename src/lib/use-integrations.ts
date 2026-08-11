import { useQuery } from "@tanstack/react-query";
import { getIntegrationData, type IntegrationPayload } from "@/lib/integrations.functions";

/** Cached product data (YouTube, TRYSA, YV Studios) served through the server layer. */
export function useIntegrations(keys?: string[]) {
  return useQuery({
    queryKey: ["integrations", keys?.join(",") ?? "all"],
    staleTime: 60_000,
    queryFn: () => getIntegrationData({ data: keys ? { keys } : {} }),
  });
}

export function useIntegration(key: string) {
  const { data = [], isLoading } = useIntegrations([key]);
  return { integration: (data as IntegrationPayload[])[0] ?? null, isLoading };
}

export type ChannelVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string | null;
  publishedAt: string | null;
};

/** Latest Yomi Unscripted episodes, or an empty list when not yet connected. */
export function useChannelVideos() {
  const { integration, isLoading } = useIntegration("youtube_yomi_unscripted");
  const payload = integration?.data as { videos?: ChannelVideo[] } | null;
  return {
    videos: Array.isArray(payload?.videos) ? payload.videos : [],
    connection: integration?.connection ?? "not_connected",
    isLoading,
  };
}

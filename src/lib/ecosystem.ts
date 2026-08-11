import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePreview } from "@/lib/preview";

/**
 * Ecosystem reads.
 *
 * Everything the public HQ renders — ventures, the Building Now feed,
 * case studies, the journey, the archive, press and speaking topics —
 * comes from the database and is editable from the Command Center.
 * Nothing here invents data: if a table is empty the surface says so.
 */

export type VentureStatus =
  | "idea"
  | "building"
  | "beta"
  | "live"
  | "operating"
  | "paused"
  | "archived";

export type ConnectionState = "live" | "synced" | "curated" | "not_connected";

export const STATUS_LABEL: Record<VentureStatus, string> = {
  idea: "Idea",
  building: "Building",
  beta: "Beta",
  live: "Live",
  operating: "Operating",
  paused: "Paused",
  archived: "Archived",
};

export const CONNECTION_LABEL: Record<ConnectionState, string> = {
  live: "Live data",
  synced: "Synced",
  curated: "Curated",
  not_connected: "Not connected",
};

export type Venture = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  status: VentureStatus;
  connection: ConnectionState;
  category: string | null;
  logo_url: string | null;
  cover_image: string | null;
  accent_color: string | null;
  website_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  features: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
};

export type EcosystemUpdate = {
  id: string;
  venture_id: string | null;
  venture_label: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  category: string | null;
  source: ConnectionState;
  published: boolean;
  featured: boolean;
  published_at: string;
  sort_order: number;
};

export type WorkProject = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  year: string | null;
  category: string | null;
  role: string | null;
  summary: string | null;
  overview: string | null;
  challenge: string | null;
  approach: string | null;
  execution: string | null;
  result: string | null;
  cover_image: string | null;
  gallery: string[];
  video_url: string | null;
  external_url: string | null;
  venture_id: string | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
};

export type JourneyMilestone = {
  id: string;
  year: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  venture_id: string | null;
  project_id: string | null;
  published: boolean;
  sort_order: number;
};

export type ArchiveEntry = {
  id: string;
  title: string;
  slug: string;
  category: "work" | "build" | "thoughts" | "places" | "people" | "media";
  description: string | null;
  body: string | null;
  image_url: string | null;
  url: string | null;
  entry_date: string | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
};

export type PressMention = {
  id: string;
  publication: string;
  headline: string;
  url: string | null;
  image_url: string | null;
  mention_date: string | null;
  published: boolean;
  sort_order: number;
};

export type SpeakingTopic = {
  id: string;
  title: string;
  description: string | null;
  audience: string | null;
  format: string | null;
  available: boolean;
  published: boolean;
  sort_order: number;
};

/* ------------------------------------------------------------------ */

function useEcosystemTable<T>(
  table:
    | "ventures"
    | "ecosystem_updates"
    | "work_projects"
    | "journey_milestones"
    | "archive_entries"
    | "press_mentions"
    | "speaking_topics",
  order: string,
  ascending = true,
) {
  const preview = usePreview();
  return useQuery({
    queryKey: ["public", table, preview, order],
    staleTime: preview ? 0 : 30_000,
    queryFn: async () => {
      let q = supabase.from(table).select("*");
      if (!preview) q = q.eq("published", true);
      const { data, error } = await q.order(order, { ascending });
      if (error) throw error;
      return (data ?? []) as unknown as T[];
    },
  });
}

export function useVentures() {
  return useEcosystemTable<Venture>("ventures", "sort_order");
}

export function useVenture(slug: string) {
  const { data = [], isLoading, error } = useVentures();
  return { venture: data.find((v) => v.slug === slug) ?? null, isLoading, error };
}

export function useEcosystemUpdates(limit?: number) {
  const query = useEcosystemTable<EcosystemUpdate>("ecosystem_updates", "published_at", false);
  const rows = limit ? query.data?.slice(0, limit) : query.data;
  return { ...query, data: rows ?? [] };
}

export function useWorkProjects() {
  return useEcosystemTable<WorkProject>("work_projects", "sort_order");
}

export function useWorkProject(slug: string) {
  const { data = [], isLoading, error } = useWorkProjects();
  return { project: data.find((p) => p.slug === slug) ?? null, isLoading, error };
}

export function useJourney() {
  return useEcosystemTable<JourneyMilestone>("journey_milestones", "sort_order");
}

export function useArchive() {
  return useEcosystemTable<ArchiveEntry>("archive_entries", "sort_order");
}

export function usePress() {
  return useEcosystemTable<PressMention>("press_mentions", "sort_order");
}

export function useSpeakingTopics() {
  return useEcosystemTable<SpeakingTopic>("speaking_topics", "sort_order");
}

/** Ventures still in motion — the "Currently building" board. */
export function useCurrentlyBuilding() {
  const { data = [], isLoading, error } = useVentures();
  const active = data.filter((v) =>
    (["idea", "building", "beta", "live", "operating"] as VentureStatus[]).includes(v.status),
  );
  return { ventures: active, isLoading, error };
}

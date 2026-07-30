import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- types ---------------- */

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  featured_image: string | null;
  category_id: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  reading_time: number;
  status: ContentStatus;
  published_at: string | null;
  featured: boolean;
  author_id: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type CmsCompany = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  tagline: string | null;
  description: string | null;
  mission: string | null;
  vision: string | null;
  problem: string | null;
  logo_url: string | null;
  cover_image: string | null;
  website: string | null;
  status: string;
  progress: number;
  launch_year: string | null;
  services: string[];
  products: string[];
  roadmap: { phase: string; body: string; done?: boolean }[];
  featured: boolean;
  visible: boolean;
  sort_order: number;
};

export type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  category: string | null;
  year: string | null;
  description: string | null;
  cover_image: string | null;
  images: string[];
  video_url: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
};

/* ---------------- settings ---------------- */

export type SettingsMap = Record<string, Record<string, unknown>>;

export const SETTINGS_DEFAULTS: SettingsMap = {
  hero: {
    eyebrow: "Founder of ONARU",
    statement:
      "Building companies that solve meaningful problems through creativity, systems and technology.",
    intro:
      "I am Yomi Onalaru — founder, creative director and systems thinker. ONARU is the holding company behind the ventures I build, acquire and scale.",
  },
  biography: { short: "", long: "" },
  social: { instagram: "", x: "", linkedin: "", youtube: "" },
  seo: { title: "", description: "", ogImage: "" },
  footer: { note: "", newsletterHeading: "", newsletterBody: "" },
  navigation: { links: [] },
  theme: { gold: "#c9a227", background: "#0a0906" },
  contact: { email: "yomionalaru@gmail.com", location: "Lagos, Nigeria" },
};

export async function fetchSettings(): Promise<SettingsMap> {
  const { data } = await supabase.from("settings").select("key, value");
  const map: SettingsMap = { ...SETTINGS_DEFAULTS };
  for (const row of (data ?? []) as { key: string; value: Record<string, unknown> }[]) {
    map[row.key] = { ...(map[row.key] ?? {}), ...(row.value ?? {}) };
  }
  return map;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 60_000,
    initialData: SETTINGS_DEFAULTS,
  });
}

export function useSetting<T = Record<string, unknown>>(key: string): T {
  const { data } = useSettings();
  return ((data?.[key] ?? SETTINGS_DEFAULTS[key] ?? {}) as T);
}

export function useSaveSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

/* ---------------- generic table helpers ---------------- */

export type TableName =
  | "articles"
  | "companies"
  | "portfolio"
  | "testimonials"
  | "speaking"
  | "books"
  | "resources"
  | "categories"
  | "tags"
  | "newsletter_subscribers"
  | "contacts"
  | "media_library"
  | "profiles"
  | "user_roles"
  | "invitations"
  | "audit_logs"
  | "page_views";

export function useRows<T = Record<string, unknown>>(
  table: TableName,
  opts?: { order?: string; ascending?: boolean; filter?: (q: any) => any; enabled?: boolean },
) {
  return useQuery({
    queryKey: ["rows", table, opts?.order ?? "", opts?.ascending ?? true],
    enabled: opts?.enabled ?? true,
    queryFn: async () => {
      let q: any = supabase.from(table).select("*");
      if (opts?.filter) q = opts.filter(q);
      if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useUpsertRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const { data, error } = await (supabase.from(table) as any)
        .upsert(row)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rows", table] });
      qc.invalidateQueries({ queryKey: ["public"] });
    },
  });
}

export function useDeleteRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rows", table] });
      qc.invalidateQueries({ queryKey: ["public"] });
    },
  });
}

/* ---------------- public reads ---------------- */

export function usePublishedArticles(limit?: number) {
  return useQuery({
    queryKey: ["public", "articles", limit ?? 0],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data } = await q;
      return (data ?? []) as Article[];
    },
  });
}

export function usePublicRows<T = Record<string, unknown>>(
  table: TableName,
  order = "sort_order",
) {
  return useQuery({
    queryKey: ["public", table],
    queryFn: async () => {
      const { data } = await supabase.from(table).select("*").order(order, { ascending: true });
      return (data ?? []) as T[];
    },
  });
}

/* ---------------- utilities ---------------- */

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingTime(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function logAudit(action: string, entity?: string, entityId?: string, meta?: unknown) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("audit_logs").insert({
    user_id: data.user.id,
    user_email: data.user.email,
    action,
    entity,
    entity_id: entityId,
    meta: (meta ?? null) as never,
  });
}

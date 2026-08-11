import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

/**
 * Enquiries — the "Work with Yomi" and speaking pipeline.
 * Public submits, admins manage. Validated on both sides; RLS keeps the
 * lead list admin-only.
 */

export type EnquiryStatus = "new" | "reviewing" | "contacted" | "meeting" | "closed";

export const ENQUIRY_STATUSES: EnquiryStatus[] = [
  "new",
  "reviewing",
  "contacted",
  "meeting",
  "closed",
];

export const ENQUIRY_TYPES = [
  { value: "photography", label: "Photography / creative direction" },
  { value: "studio", label: "Studio booking (YV Studios)" },
  { value: "trysa", label: "TRYSA / product" },
  { value: "speaking", label: "Speaking invitation" },
  { value: "partnership", label: "Partnership or investment" },
  { value: "press", label: "Press or media" },
  { value: "other", label: "Something else" },
] as const;

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  enquiry_type: string;
  subject: string | null;
  message: string;
  budget: string | null;
  timeline: string | null;
  event_name: string | null;
  event_date: string | null;
  event_location: string | null;
  audience_size: string | null;
  details: Record<string, unknown>;
  status: EnquiryStatus;
  last_activity_at: string;
  created_at: string;
};

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  enquiry_type: z.string().trim().min(1, "Choose what this is about").max(60),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell me a little more").max(4000),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  event_name: z.string().trim().max(200).optional().or(z.literal("")),
  event_date: z.string().trim().max(120).optional().or(z.literal("")),
  event_location: z.string().trim().max(200).optional().or(z.literal("")),
  audience_size: z.string().trim().max(60).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: async (input: EnquiryInput) => {
      const parsed = enquirySchema.parse(input);
      const row = Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [k, v === "" ? null : v]),
      ) as unknown as EnquiryInput;
      const { error } = await supabase.from("enquiries").insert(row as never);
      if (error) throw error;
    },
  });
}

/* ---------------- admin CRM ---------------- */

export function useEnquiries() {
  return useQuery({
    queryKey: ["rows", "enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Enquiry[];
    },
  });
}

export function useUpdateEnquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EnquiryStatus }) => {
      const { error } = await supabase
        .from("enquiries")
        .update({ status, last_activity_at: new Date().toISOString() } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rows", "enquiries"] }),
  });
}

export function useDeleteEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rows", "enquiries"] }),
  });
}

export type EnquiryNote = {
  id: string;
  enquiry_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export function useEnquiryNotes(enquiryId: string | null) {
  return useQuery({
    queryKey: ["enquiry_notes", enquiryId],
    enabled: Boolean(enquiryId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiry_notes")
        .select("*")
        .eq("enquiry_id", enquiryId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as EnquiryNote[];
    },
  });
}

export function useAddEnquiryNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ enquiryId, body }: { enquiryId: string; body: string }) => {
      const trimmed = body.trim();
      if (!trimmed) throw new Error("Note is empty");
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("enquiry_notes").insert({
        enquiry_id: enquiryId,
        body: trimmed.slice(0, 4000),
        author_id: auth.user?.id ?? null,
      } as never);
      if (error) throw error;
      await supabase
        .from("enquiries")
        .update({ last_activity_at: new Date().toISOString() } as never)
        .eq("id", enquiryId);
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["enquiry_notes", vars.enquiryId] });
      qc.invalidateQueries({ queryKey: ["rows", "enquiries"] });
    },
  });
}

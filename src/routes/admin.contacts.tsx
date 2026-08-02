import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, MailOpen, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { useRows, useUpsertRow, useDeleteRow } from "@/lib/cms";
import { cn } from "@/lib/utils";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  category: string | null;
  is_read: boolean;
  replied: boolean;
  archived: boolean;
  created_at: string;
};

export const Route = createFileRoute("/admin/contacts")({ component: Page });

const TABS = ["Unread", "All", "Archived"] as const;

function Page() {
  const { data: rows = [], isLoading } = useRows<Contact>("contacts", {
    order: "created_at",
    ascending: false,
  });
  const upsert = useUpsertRow("contacts");
  const remove = useDeleteRow("contacts");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Unread");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (tab === "Unread") return rows.filter((r) => !r.is_read && !r.archived);
    if (tab === "Archived") return rows.filter((r) => r.archived);
    return rows.filter((r) => !r.archived);
  }, [rows, tab]);

  const open = (r: Contact) => {
    setOpenId(openId === r.id ? null : r.id);
    if (!r.is_read) void upsert.mutateAsync({ ...r, is_read: true });
  };

  return (
    <RequireRank min={3}>
      <AdminHeader title="Inbox" description="Enquiries submitted through the contact form." />

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-5 py-2 text-[10px] uppercase tracking-[0.2em]",
              tab === t ? "border-gold/50 bg-gold/10 text-gold" : "border-border text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          Nothing here.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/60 bg-white/[0.02]">
              <button onClick={() => open(r)} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", r.is_read ? "bg-white/15" : "bg-gold")} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">
                    {r.subject || r.category || "Enquiry"} — <span className="text-muted-foreground">{r.name}</span>
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{r.email}</div>
                </div>
                <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </button>

              {openId === r.id && (
                <div className="border-t border-border/60 px-5 py-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{r.message}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${r.email}?subject=${encodeURIComponent(`Re: ${r.subject ?? "Your message"}`)}`}
                      onClick={() => void upsert.mutateAsync({ ...r, replied: true })}
                      className="flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground"
                    >
                      <MailOpen className="h-3 w-3" /> Reply
                    </a>
                    <button
                      onClick={() => void upsert.mutateAsync({ ...r, archived: !r.archived })}
                      className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-[10px] uppercase tracking-[0.2em]"
                    >
                      <Archive className="h-3 w-3" /> {r.archived ? "Unarchive" : "Archive"}
                    </button>
                    <button
                      onClick={async () => { if (confirm("Delete message?")) await remove.mutateAsync(r.id); }}
                      className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-[10px] uppercase tracking-[0.2em] hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </RequireRank>
  );
}

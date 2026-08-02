import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { useRows, useDeleteRow } from "@/lib/cms";

type Sub = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/newsletter")({ component: Page });

function Page() {
  const { data: rows = [], isLoading } = useRows<Sub>("newsletter_subscribers", {
    order: "created_at",
    ascending: false,
  });
  const remove = useDeleteRow("newsletter_subscribers");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => rows.filter((r) => !q || r.email.toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );

  const exportCsv = () => {
    const csv = ["email,name,source,status,subscribed_at"]
      .concat(rows.map((r) => [r.email, r.name ?? "", r.source ?? "", r.status, r.created_at].join(",")))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  return (
    <RequireRank min={3}>
      <AdminHeader
        title="Newsletter"
        description={`${rows.length} subscriber${rows.length === 1 ? "" : "s"}.`}
        action={
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        }
      />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search email"
        className="mb-6 w-full max-w-sm rounded-full border border-border bg-transparent px-5 py-2.5 text-sm"
      />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          No subscribers yet.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white/[0.02] px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{r.email}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.name ? `${r.name} · ` : ""}{r.source ?? "site"} · {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className="hidden rounded-full bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold sm:block">
                {r.status}
              </span>
              <button
                onClick={async () => { if (confirm("Remove subscriber?")) await remove.mutateAsync(r.id); }}
                className="rounded-full border border-border p-2 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </RequireRank>
  );
}

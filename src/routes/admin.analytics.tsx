import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { useRows } from "@/lib/cms";
import { cn } from "@/lib/utils";

type View = { id: string; path: string; referrer: string | null; session_id: string | null; created_at: string };
type Article = { id: string; title: string; view_count: number; status: string };

export const Route = createFileRoute("/admin/analytics")({ component: Page });

const RANGES = [7, 30, 90] as const;

function Page() {
  const { data: views = [], isLoading } = useRows<View>("page_views", { order: "created_at", ascending: false });
  const { data: articles = [] } = useRows<Article>("articles", { order: "view_count", ascending: false });
  const [days, setDays] = useState<number>(30);

  const scoped = useMemo(() => {
    const cutoff = Date.now() - days * 86_400_000;
    return views.filter((v) => new Date(v.created_at).getTime() >= cutoff);
  }, [views, days]);

  const sessions = new Set(scoped.map((v) => v.session_id ?? v.id)).size;

  const topPaths = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of scoped) m.set(v.path, (m.get(v.path) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [scoped]);

  const topRefs = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of scoped) {
      const r = v.referrer ? (() => { try { return new URL(v.referrer!).hostname; } catch { return v.referrer!; } })() : "Direct";
      m.set(r, (m.get(r) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [scoped]);

  const daily = useMemo(() => {
    const buckets: { label: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      const key = d.toISOString().slice(0, 10);
      buckets.push({
        label: key,
        count: scoped.filter((v) => v.created_at.slice(0, 10) === key).length,
      });
    }
    return buckets;
  }, [scoped, days]);

  const peak = Math.max(1, ...daily.map((d) => d.count));

  return (
    <RequireRank min={3}>
      <AdminHeader
        title="Analytics"
        description="Traffic captured on the public site."
        action={
          <div className="flex gap-2">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em]",
                  days === r ? "border-gold/50 bg-gold/10 text-gold" : "border-border text-muted-foreground",
                )}
              >
                {r}d
              </button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Page views", value: scoped.length },
              { label: "Sessions", value: sessions },
              { label: "Article reads", value: articles.reduce((s, a) => s + (a.view_count ?? 0), 0) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-white/[0.02] p-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</div>
                <div className="mt-2 font-display text-4xl gold-text">{s.value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border/60 p-6">
            <div className="mb-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Daily views</div>
            <div className="flex h-40 items-end gap-[3px]">
              {daily.map((d) => (
                <div
                  key={d.label}
                  title={`${d.label}: ${d.count}`}
                  style={{ height: `${Math.max(2, (d.count / peak) * 100)}%` }}
                  className="flex-1 rounded-t bg-gold/50"
                />
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Panel title="Top pages" rows={topPaths} />
            <Panel title="Referrers" rows={topRefs} />
          </div>

          <div className="mt-8 rounded-2xl border border-border/60 p-6">
            <div className="mb-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Most read articles</div>
            <div className="space-y-3">
              {articles.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center gap-4 text-sm">
                  <span className="min-w-0 flex-1 truncate">{a.title}</span>
                  <span className="text-muted-foreground">{a.view_count ?? 0}</span>
                </div>
              ))}
              {articles.length === 0 && <p className="text-sm text-muted-foreground">No articles yet.</p>}
            </div>
          </div>
        </>
      )}
    </RequireRank>
  );
}

function Panel({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="rounded-2xl border border-border/60 p-6">
      <div className="mb-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{title}</div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(([k, v]) => (
            <div key={k}>
              <div className="flex items-center justify-between text-xs">
                <span className="min-w-0 truncate">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gold/60" style={{ width: `${(v / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

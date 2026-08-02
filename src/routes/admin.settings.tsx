import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ImageField } from "@/components/admin/ImageField";
import { SETTINGS_DEFAULTS, useSettings, useSaveSetting, logAudit, type SettingsMap } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({ component: Page });

const GROUPS: { key: string; label: string; blurb: string }[] = [
  { key: "hero", label: "Homepage hero", blurb: "The first words visitors read." },
  { key: "biography", label: "Biography", blurb: "Short and long bio used across the site." },
  { key: "seo", label: "SEO", blurb: "Default title, description and share image." },
  { key: "social", label: "Social", blurb: "Profile links shown in the nav and footer." },
  { key: "contact", label: "Contact", blurb: "Email and location." },
  { key: "footer", label: "Footer", blurb: "Footer note and newsletter copy." },
  { key: "navigation", label: "Navigation", blurb: "Primary menu links (JSON)." },
  { key: "theme", label: "Theme", blurb: "Accent and background colours." },
];

const LONG = ["statement", "intro", "short", "long", "description", "note", "newsletterBody", "body"];

function Page() {
  const { data } = useSettings();
  const save = useSaveSetting();
  const [draft, setDraft] = useState<SettingsMap>(SETTINGS_DEFAULTS);
  const [active, setActive] = useState(GROUPS[0]!.key);

  useEffect(() => { if (data) setDraft(data); }, [data]);

  const group = GROUPS.find((g) => g.key === active)!;
  const value = (draft[active] ?? {}) as Record<string, unknown>;
  const set = (k: string, v: unknown) =>
    setDraft((d) => ({ ...d, [active]: { ...(d[active] ?? {}), [k]: v } }));

  const commit = async () => {
    try {
      await save.mutateAsync({ key: active, value });
      void logAudit("update", "settings", active);
      toast.success(`${group.label} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const inputCls = "w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold/60";

  return (
    <RequireRank min={3}>
      <AdminHeader title="Settings" description="Global content and configuration for the public site." />

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setActive(g.key)}
              className={cn(
                "rounded-xl px-4 py-2.5 text-left text-sm transition",
                active === g.key ? "bg-gold/10 text-gold" : "text-foreground/65 hover:bg-white/5",
              )}
            >
              {g.label}
            </button>
          ))}
        </nav>

        <div>
          <p className="mb-6 text-sm text-muted-foreground">{group.blurb}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(value).map(([k, v]) => {
              const isObj = typeof v === "object" && v !== null;
              const isLong = LONG.includes(k);
              const label = (
                <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</div>
              );
              if (k.toLowerCase().includes("image")) {
                return (
                  <div key={k} className="sm:col-span-2">
                    <ImageField label={k} value={typeof v === "string" ? v : ""} onChange={(url) => set(k, url ?? "")} folder="settings" />
                  </div>
                );
              }
              if (isObj) {
                return (
                  <div key={k} className="sm:col-span-2">
                    {label}
                    <textarea
                      rows={8}
                      defaultValue={JSON.stringify(v, null, 2)}
                      onBlur={(e) => {
                        try { set(k, JSON.parse(e.target.value || "null")); }
                        catch { toast.error(`${k}: invalid JSON`); }
                      }}
                      className={cn(inputCls, "font-mono text-xs")}
                    />
                  </div>
                );
              }
              return (
                <div key={k} className={isLong ? "sm:col-span-2" : ""}>
                  {label}
                  {isLong ? (
                    <textarea rows={4} value={String(v ?? "")} onChange={(e) => set(k, e.target.value)} className={inputCls} />
                  ) : (
                    <input value={String(v ?? "")} onChange={(e) => set(k, e.target.value)} className={inputCls} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={() => void commit()}
              disabled={save.isPending}
              className="rounded-full bg-gold px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
            >
              {save.isPending ? "Saving…" : `Save ${group.label}`}
            </button>
            <button
              onClick={() => setDraft((d) => ({ ...d, [active]: SETTINGS_DEFAULTS[active] ?? {} }))}
              className="rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-[0.2em]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </RequireRank>
  );
}

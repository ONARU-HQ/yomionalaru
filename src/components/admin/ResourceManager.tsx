import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, Search } from "lucide-react";
import { useRows, useUpsertRow, useDeleteRow, logAudit, slugify, type TableName } from "@/lib/cms";
import { ImageField } from "./ImageField";
import { cn } from "@/lib/utils";

export type FieldType =
  | "text" | "textarea" | "richtext" | "number" | "boolean"
  | "image" | "select" | "list" | "date" | "slug" | "json";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  optionLabels?: Record<string, string>;
  placeholder?: string;
  help?: string;
  from?: string; // for slug auto-generation
  full?: boolean;
};

export type ResourceConfig = {
  table: TableName;
  singular: string;
  plural: string;
  order?: string;
  ascending?: boolean;
  fields: Field[];
  primaryField?: string;
  secondaryField?: string;
  imageField?: string;
  defaults?: Record<string, unknown>;
  canEdit?: boolean;
};

type Row = Record<string, any>;

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const { data: rows = [], isLoading } = useRows<Row>(config.table, {
    order: config.order ?? "sort_order",
    ascending: config.ascending ?? true,
  });
  const upsert = useUpsertRow(config.table);
  const remove = useDeleteRow(config.table);
  const [editing, setEditing] = useState<Row | null>(null);
  const [q, setQ] = useState("");

  const primary = config.primaryField ?? config.fields[0]?.name ?? "id";
  const filtered = useMemo(() => {
    if (!q) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => typeof v === "string" && v.toLowerCase().includes(needle)),
    );
  }, [rows, q]);

  const blank = () => {
    const base: Row = { ...(config.defaults ?? {}) };
    for (const f of config.fields) {
      if (base[f.name] !== undefined) continue;
      base[f.name] =
        f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "list" || f.type === "json" ? [] : "";
    }
    return base;
  };

  const save = async (row: Row) => {
    const payload: Row = { ...row };
    for (const f of config.fields) {
      if (f.type === "slug" && !payload[f.name] && f.from) payload[f.name] = slugify(payload[f.from] ?? "");
      if (payload[f.name] === "") payload[f.name] = f.type === "text" || f.type === "slug" ? payload[f.name] : null;
    }
    try {
      await upsert.mutateAsync(payload);
      void logAudit(row.id ? "update" : "create", config.table, row.id);
      toast.success(`${config.singular} saved`);
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${config.plural.toLowerCase()}`}
            className="w-full rounded-full border border-border bg-transparent py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <button
          onClick={() => setEditing(blank())}
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New {config.singular}
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          No {config.plural.toLowerCase()} yet.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white/[0.02] p-4"
            >
              <GripVertical className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              {config.imageField && (
                row[config.imageField] ? (
                  <img src={row[config.imageField]} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-white/5" />
                )
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{row[primary] || "Untitled"}</div>
                {config.secondaryField && (
                  <div className="truncate text-xs text-muted-foreground">{row[config.secondaryField]}</div>
                )}
              </div>
              {"visible" in row && (
                <span className={cn("hidden rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] sm:block",
                  row.visible ? "bg-gold/10 text-gold" : "bg-white/5 text-muted-foreground")}>
                  {row.visible ? "Visible" : "Hidden"}
                </span>
              )}
              <button onClick={() => setEditing(row)} className="rounded-full border border-border p-2 hover:text-gold" aria-label="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={async () => {
                  if (!confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
                  await remove.mutateAsync(row.id);
                  void logAudit("delete", config.table, row.id);
                  toast.success("Deleted");
                }}
                className="rounded-full border border-border p-2 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditorDrawer
          title={`${editing.id ? "Edit" : "New"} ${config.singular}`}
          fields={config.fields}
          value={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => void save(editing)}
          saving={upsert.isPending}
        />
      )}
    </div>
  );
}

export function EditorDrawer({
  title, fields, value, onChange, onClose, onSave, saving, extra,
}: {
  title: string;
  fields: Field[];
  value: Row;
  onChange: (v: Row) => void;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  extra?: React.ReactNode;
}) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-border/60 bg-background p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-3xl gold-text">{title}</h2>
          <button onClick={onClose} className="rounded-full border border-border px-4 py-1.5 text-[10px] uppercase tracking-[0.2em]">
            Close
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={f.full || f.type === "textarea" || f.type === "richtext" || f.type === "image" || f.type === "json" ? "sm:col-span-2" : ""}>
              <FieldInput field={f} value={value[f.name]} row={value} onChange={(v) => set(f.name, v)} />
            </div>
          ))}
        </div>

        {extra}

        <div className="mt-10 flex gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-full bg-gold px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={onClose} className="rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-[0.2em]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold/60";

export function FieldInput({
  field, value, row, onChange,
}: { field: Field; value: any; row?: Row; onChange: (v: any) => void }) {
  const label = (
    <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{field.label}</div>
  );

  switch (field.type) {
    case "image":
      return <ImageField label={field.label} value={value} onChange={onChange} />;
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--gold)]" />
          <span className="text-sm">{field.label}</span>
        </label>
      );
    case "number":
      return (
        <div>{label}
          <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} />
        </div>
      );
    case "select":
      return (
        <div>{label}
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, "bg-background")}>
            <option value="">—</option>
            {field.options?.map((o) => <option key={o} value={o}>{field.optionLabels?.[o] ?? o}</option>)}
          </select>
        </div>
      );
    case "json":
      return (
        <div>{label}
          <textarea
            rows={10}
            defaultValue={JSON.stringify(value ?? [], null, 2)}
            onBlur={(e) => {
              try { onChange(JSON.parse(e.target.value || "[]")); }
              catch { toast.error(`${field.label}: invalid JSON`); }
            }}
            className={cn(inputCls, "font-mono text-xs leading-relaxed")}
          />
          {field.help && <p className="mt-2 text-[10px] text-muted-foreground">{field.help}</p>}
        </div>
      );
    case "list":
      return (
        <div>{label}
          <input
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="Comma separated"
            className={inputCls}
          />
        </div>
      );

    case "date":
      return (
        <div>{label}
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
            className={inputCls}
          />
        </div>
      );
    case "textarea":
      return (
        <div>{label}
          <textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputCls} />
        </div>
      );
    case "richtext":
      return (
        <div>{label}
          <textarea
            rows={18}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write in Markdown — ## headings, **bold**, - lists, > quotes"
            className={cn(inputCls, "font-mono text-xs leading-relaxed")}
          />
          <p className="mt-2 text-[10px] text-muted-foreground">Markdown supported: ## heading, ### sub-heading, **bold**, *italic*, - list, &gt; quote, [link](url)</p>
        </div>
      );
    case "slug":
      return (
        <div>{label}
          <div className="flex gap-2">
            <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />
            {field.from && (
              <button
                type="button"
                onClick={() => onChange(slugify(row?.[field.from!] ?? ""))}
                className="shrink-0 rounded-xl border border-border px-4 text-[10px] uppercase tracking-[0.2em]"
              >
                Auto
              </button>
            )}
          </div>
        </div>
      );
    default:
      return (
        <div>{label}
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputCls} />
        </div>
      );
  }
}

import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2, Upload } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { uploadToMedia } from "@/components/admin/ImageField";
import { useRows, useDeleteRow, logAudit } from "@/lib/cms";
import { useQueryClient } from "@tanstack/react-query";

type MediaRow = {
  id: string;
  name: string;
  url: string;
  folder: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export const Route = createFileRoute("/admin/media")({ component: Page });

function bytes(n: number | null) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function Page() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useRows<MediaRow>("media_library", {
    order: "created_at",
    ascending: false,
  });
  const remove = useDeleteRow("media_library");
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [folder, setFolder] = useState("general");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) await uploadToMedia(file, folder);
      await qc.invalidateQueries({ queryKey: ["rows", "media_library"] });
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <RequireRank min={1}>
      <AdminHeader title="Media Library" description="Every image and file used across the site." />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void upload(e.dataTransfer.files); }}
        className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-border/70 p-6"
      >
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/5">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm">Drop files here or choose them manually.</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Stored privately with long-lived signed links.</p>
        </div>
        <input
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="w-36 rounded-xl border border-border bg-transparent px-3 py-2 text-sm"
          aria-label="Folder"
        />
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => void upload(e.target.files)} />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full bg-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          Nothing uploaded yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-border/60 bg-white/[0.02]">
              {m.mime_type?.startsWith("image/") ? (
                <img src={m.url} alt={m.name} loading="lazy" className="aspect-square w-full object-cover" />
              ) : (
                <div className="grid aspect-square w-full place-items-center text-xs text-muted-foreground">
                  {m.mime_type ?? "file"}
                </div>
              )}
              <div className="p-3">
                <div className="truncate text-xs">{m.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {m.folder} · {bytes(m.size_bytes)}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { void navigator.clipboard.writeText(m.url); toast.success("URL copied"); }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-gold"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Remove from library?")) return;
                      await remove.mutateAsync(m.id);
                      void logAudit("delete", "media_library", m.id);
                    }}
                    className="rounded-full border border-border p-1.5 hover:text-red-400"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </RequireRank>
  );
}

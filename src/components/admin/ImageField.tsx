import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadToMedia(file: File, folder = "general") {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data: signed, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS);
  if (signErr) throw signErr;
  const url = signed.signedUrl;
  const { data: user } = await supabase.auth.getUser();
  await supabase.from("media_library").insert({
    name: file.name,
    path,
    url,
    mime_type: file.type,
    size_bytes: file.size,
    folder,
    uploaded_by: user.user?.id ?? null,
  });
  return { path, url };
}

export function ImageField({
  label, value, onChange, folder = "general",
}: { label: string; value: string | null | undefined; onChange: (url: string | null) => void; folder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadToMedia(file, folder);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void handle(e.dataTransfer.files?.[0]); }}
        className="flex items-center gap-4 rounded-2xl border border-dashed border-border/70 p-4"
      >
        {value ? (
          <img src={value} alt="" loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-xl bg-white/5 text-muted-foreground">
            <Upload className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => void handle(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-full border border-border px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-gold disabled:opacity-50"
            >
              {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-gold"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="…or paste an image URL"
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

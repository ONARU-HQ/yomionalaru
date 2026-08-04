import { useEffect, useSyncExternalStore } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Eye, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Admin preview mode.
 * Staff can browse the public site with unpublished / hidden CMS content
 * rendered in place, without publishing anything.
 * Enable with ?preview=1 (or the toggle in the banner); scoped to the tab.
 */

const KEY = "yo:preview";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(KEY) === "1";
}

export function setPreviewEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.sessionStorage.setItem(KEY, "1");
  else window.sessionStorage.removeItem(KEY);
  emit();
}

/** True only for signed-in staff who turned preview on in this tab. */
export function usePreview() {
  const { isStaff } = useAuth();
  const on = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return isStaff && on;
}

export function PreviewBanner() {
  const { isStaff } = useAuth();
  const preview = usePreview();
  const qc = useQueryClient();
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isStaff) return;
    const params = new URLSearchParams(search);
    if (params.get("preview") === "1") setPreviewEnabled(true);
    if (params.get("preview") === "0") setPreviewEnabled(false);
  }, [isStaff, search]);

  // Always show the freshest CMS rows while previewing.
  useEffect(() => {
    if (preview) void qc.invalidateQueries({ queryKey: ["public"] });
  }, [preview, pathname, qc]);

  if (!preview || pathname.startsWith("/admin")) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-4 bg-gold px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-primary-foreground">
      <span className="flex items-center gap-2">
        <Eye className="h-3.5 w-3.5" /> Preview mode — drafts &amp; hidden content visible
      </span>
      <button
        onClick={() => {
          setPreviewEnabled(false);
          void qc.invalidateQueries({ queryKey: ["public"] });
        }}
        className="flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 hover:bg-black/30"
      >
        <X className="h-3 w-3" /> Exit
      </button>
    </div>
  );
}

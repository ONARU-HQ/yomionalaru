import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const KEY = "yo_session_id";

function sessionId() {
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

const IGNORED = ["/admin", "/auth", "/reset-password", "/api"];

/**
 * Records one page_views row per client-side navigation on public pages.
 * Fire-and-forget: tracking never blocks or breaks rendering.
 */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (IGNORED.some((p) => pathname.startsWith(p))) return;
    if (last.current === pathname) return;
    last.current = pathname;

    const referrer = document.referrer && !document.referrer.includes(window.location.host)
      ? document.referrer
      : null;

    void supabase
      .from("page_views")
      .insert({ path: pathname, referrer, session_id: sessionId() })
      .then(() => undefined, () => undefined);
  }, [pathname]);

  return null;
}

/** Increments an article's view_count once per session. */
export function useArticleView(articleId: string | null | undefined) {
  const done = useRef<string | null>(null);
  useEffect(() => {
    if (!articleId || done.current === articleId) return;
    done.current = articleId;
    void (async () => {
      const { data } = await supabase.from("articles").select("view_count").eq("id", articleId).maybeSingle();
      if (!data) return;
      await supabase.from("articles").update({ view_count: (data.view_count ?? 0) + 1 }).eq("id", articleId);
    })();
  }, [articleId]);
}

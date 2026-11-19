import { useEffect } from "react";

/**
 * Loads the isolated ONARU chat widget only on the public personal site.
 * The Supabase receiver enforces an independent allowed-origin check.
 * Widget currently operates in test mode; live executive alerts are disabled.
 */
export function OnaruChatLoader() {
  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    if (host !== "yomionalaru.com" && host !== "www.yomionalaru.com") {
      return;
    }

    const id = "onaru-chat-widget-yomi-visuals";
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://ccaxvjrgjpaixvyrgizn.supabase.co/functions/v1/onaru-chat-widget-v1?site=yomi-visuals";
    script.setAttribute("data-onaru-chat", "v1");
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.getElementById(id)?.remove();
    };
  }, []);

  return null;
}

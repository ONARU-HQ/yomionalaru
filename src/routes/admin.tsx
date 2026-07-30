import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminShell,
  head: () => ({
    meta: [
      { title: "Studio — Yomi Onalaru" },
      { name: "description", content: "Content studio for yomionalaru.com." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Studio — Yomi Onalaru" },
      { property: "og:description", content: "Content studio for yomionalaru.com." },
    ],
  }),
});

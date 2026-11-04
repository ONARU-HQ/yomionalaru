import { createFileRoute } from "@tanstack/react-router";
export const Route=createFileRoute("/admin/my-os")({
  component:()=>null,
  head:()=>({meta:[{title:"MY OS — Open ONARU OS"},{name:"robots",content:"noindex,nofollow"}]}),
});
// AdminShell provides a frontend-only link to the separately authenticated
// ONARU OS owner portal. Do not move OAuth sessions or CRM data back here.

import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";

const fields: Field[] = [
  { name: "title", label: "Talk title", type: "text" },
  { name: "event", label: "Event", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "date", label: "Date (display text)", type: "text" },
  { name: "link", label: "Link", type: "text" },
  { name: "image_url", label: "Image", type: "image" },
  { name: "description", label: "Description", type: "textarea", full: true },
  { name: "visible", label: "Visible", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/speaking")({ component: Page });

function Page() {
  return (
    <RequireRank min={2}>
      <AdminHeader title="Speaking" description="Stages, panels, keynotes and workshops." />
      <ResourceManager
        config={{
          table: "speaking",
          singular: "Engagement",
          plural: "Engagements",
          primaryField: "title",
          secondaryField: "event",
          imageField: "image_url",
          fields,
          defaults: { visible: true, sort_order: 0 },
        }}
      />
    </RequireRank>
  );
}

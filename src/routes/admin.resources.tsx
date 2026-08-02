import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "type", label: "Type", type: "select", options: ["Template", "Guide", "Toolkit", "Newsletter", "Course", "Download"] },
  { name: "url", label: "URL", type: "text" },
  { name: "image_url", label: "Image", type: "image" },
  { name: "description", label: "Description", type: "textarea", full: true },
  { name: "visible", label: "Visible", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/resources")({ component: Page });

function Page() {
  return (
    <RequireRank min={2}>
      <AdminHeader title="Resources" description="Templates, toolkits and downloads for founders." />
      <ResourceManager
        config={{
          table: "resources",
          singular: "Resource",
          plural: "Resources",
          primaryField: "title",
          secondaryField: "description",
          imageField: "image_url",
          fields,
          defaults: { visible: true, sort_order: 0 },
        }}
      />
    </RequireRank>
  );
}

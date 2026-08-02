import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "avatar_url", label: "Avatar", type: "image" },
  { name: "quote", label: "Quote", type: "textarea", full: true },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "visible", label: "Visible", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/testimonials")({ component: Page });

function Page() {
  return (
    <RequireRank min={2}>
      <AdminHeader title="Testimonials" description="Words from founders, clients and collaborators." />
      <ResourceManager
        config={{
          table: "testimonials",
          singular: "Testimonial",
          plural: "Testimonials",
          primaryField: "name",
          secondaryField: "quote",
          imageField: "avatar_url",
          fields,
          defaults: { visible: true, featured: false, sort_order: 0 },
        }}
      />
    </RequireRank>
  );
}

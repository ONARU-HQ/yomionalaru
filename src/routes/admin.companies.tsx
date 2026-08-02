import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "slug", label: "Slug", type: "slug", from: "name" },
  { name: "category", label: "Category", type: "text" },
  { name: "tagline", label: "Tagline", type: "text", full: true },
  { name: "status", label: "Status", type: "select", options: ["Building", "Live", "Scaling", "Incubating", "Planned"] },
  { name: "progress", label: "Progress (%)", type: "number" },
  { name: "launch_year", label: "Launch year", type: "text" },
  { name: "website", label: "Website", type: "text" },
  { name: "logo_url", label: "Logo", type: "image" },
  { name: "cover_image", label: "Cover image", type: "image" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "problem", label: "Problem it solves", type: "textarea" },
  { name: "mission", label: "Mission", type: "textarea" },
  { name: "vision", label: "Vision", type: "textarea" },
  { name: "services", label: "Services", type: "list" },
  { name: "products", label: "Products", type: "list" },
  { name: "roadmap", label: "Roadmap", type: "json", help: '[{ "phase": "Q1 2026", "body": "…", "done": false }]' },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "visible", label: "Visible", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/companies")({ component: Page });

function Page() {
  return (
    <RequireRank min={2}>
      <AdminHeader title="Companies" description="The ONARU ecosystem — every venture shown on the public site." />
      <ResourceManager
        config={{
          table: "companies",
          singular: "Company",
          plural: "Companies",
          primaryField: "name",
          secondaryField: "tagline",
          imageField: "logo_url",
          fields,
          defaults: { visible: true, featured: false, status: "Building", progress: 0, services: [], products: [], roadmap: [], sort_order: 0 },
        }}
      />
    </RequireRank>
  );
}

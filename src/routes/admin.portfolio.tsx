import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "slug", from: "title" },
  { name: "client", label: "Client", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "year", label: "Year", type: "text" },
  { name: "video_url", label: "Video URL", type: "text" },
  { name: "cover_image", label: "Cover image", type: "image" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "images", label: "Gallery image URLs", type: "list", full: true },
  { name: "featured", label: "Featured", type: "boolean" },
  { name: "visible", label: "Visible", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/portfolio")({ component: Page });

function Page() {
  return (
    <RequireRank min={2}>
      <AdminHeader title="Portfolio" description="Featured work and case studies." />
      <ResourceManager
        config={{
          table: "portfolio",
          singular: "Project",
          plural: "Projects",
          primaryField: "title",
          secondaryField: "client",
          imageField: "cover_image",
          fields,
          defaults: { visible: true, featured: false, images: [], sort_order: 0 },
        }}
      />
    </RequireRank>
  );
}

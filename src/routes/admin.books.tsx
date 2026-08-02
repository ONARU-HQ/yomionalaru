import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "author", label: "Author", type: "text" },
  { name: "link", label: "Link", type: "text" },
  { name: "cover_url", label: "Cover", type: "image" },
  { name: "note", label: "Why it matters", type: "textarea", full: true },
  { name: "visible", label: "Visible", type: "boolean" },
  { name: "sort_order", label: "Sort order", type: "number" },
];

export const Route = createFileRoute("/admin/books")({ component: Page });

function Page() {
  return (
    <RequireRank min={2}>
      <AdminHeader title="Books" description="The reading list that shaped how I build." />
      <ResourceManager
        config={{
          table: "books",
          singular: "Book",
          plural: "Books",
          primaryField: "title",
          secondaryField: "author",
          imageField: "cover_url",
          fields,
          defaults: { visible: true, sort_order: 0 },
        }}
      />
    </RequireRank>
  );
}

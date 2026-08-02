import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminShell";
import { RequireRank } from "@/components/admin/Guard";
import { ResourceManager, type Field } from "@/components/admin/ResourceManager";
import { useRows } from "@/lib/cms";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/articles")({ component: Page });

function Page() {
  const { user, isEditor } = useAuth();
  const { data: cats = [] } = useRows<{ id: string; name: string }>("categories", { order: "sort_order" });

  const fields: Field[] = [
    { name: "title", label: "Title", type: "text", full: true },
    { name: "slug", label: "Slug", type: "slug", from: "title" },
    { name: "status", label: "Status", type: "select", options: ["draft", "scheduled", "published", "archived"] },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "featured_image", label: "Cover image", type: "image" },
    { name: "category_id", label: "Category", type: "select", options: cats.map((c) => c.name) },
    { name: "tags", label: "Tags", type: "list" },
    { name: "reading_time", label: "Reading time (mins)", type: "number" },
    { name: "published_at", label: "Publish date", type: "date" },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "seo_title", label: "SEO title", type: "text" },
    { name: "seo_description", label: "SEO description", type: "textarea" },
    { name: "body", label: "Body", type: "richtext", full: true },
  ];

  // map category name <-> id through select options
  const withCategory = fields.map((f) =>
    f.name === "category_id" ? { ...f, type: "select" as const, options: cats.map((c) => c.id) } : f,
  );

  return (
    <RequireRank min={1}>
      <AdminHeader
        title="Articles"
        description={isEditor ? "Every published article on the journal." : "You can create and edit your own articles."}
      />
      <ResourceManager
        config={{
          table: "articles",
          singular: "Article",
          plural: "Articles",
          order: "created_at",
          ascending: false,
          primaryField: "title",
          secondaryField: "excerpt",
          imageField: "featured_image",
          fields: withCategory,
          defaults: { status: "draft", tags: [], reading_time: 6, featured: false, body: "", author_id: user?.id ?? null },
        }}
      />
    </RequireRank>
  );
}

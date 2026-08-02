import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Building2, Images, Mail, Inbox, Eye } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { useRows } from "@/lib/cms";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { importStaticContent } from "@/lib/seed";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { profile, isAdmin, isSuperAdmin } = useAuth();
  const qc = useQueryClient();
  const [importing, setImporting] = useState<string | null>(null);

  const runImport = async () => {
    if (!confirm("Import the built-in site content into the CMS? Existing rows are updated, not duplicated.")) return;
    try {
      const summary = await importStaticContent((step) => setImporting(step));
      await qc.invalidateQueries();
      toast.success(`Imported: ${Object.entries(summary).map(([k, v]) => `${v} ${k}`).join(", ")}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(null);
    }
  };
  const articles = useRows<{ id: string; status: string; title: string; updated_at: string }>("articles", { order: "updated_at", ascending: false });
  const companies = useRows("companies");
  const portfolio = useRows("portfolio");
  const subs = useRows("newsletter_subscribers", { order: "created_at", ascending: false, enabled: isAdmin });
  const contacts = useRows<{ id: string; is_read: boolean }>("contacts", { order: "created_at", ascending: false, enabled: isAdmin });

  const published = (articles.data ?? []).filter((a) => a.status === "published").length;
  const drafts = (articles.data ?? []).filter((a) => a.status === "draft").length;
  const unread = (contacts.data ?? []).filter((c) => !c.is_read).length;

  const cards = [
    { label: "Published articles", value: published, to: "/admin/articles", icon: FileText },
    { label: "Drafts", value: drafts, to: "/admin/articles", icon: FileText },
    { label: "Companies", value: companies.data?.length ?? 0, to: "/admin/companies", icon: Building2 },
    { label: "Portfolio items", value: portfolio.data?.length ?? 0, to: "/admin/portfolio", icon: Images },
    ...(isAdmin
      ? [
          { label: "Subscribers", value: subs.data?.length ?? 0, to: "/admin/newsletter", icon: Mail },
          { label: "Unread messages", value: unread, to: "/admin/contacts", icon: Inbox },
        ]
      : []),
  ];

  return (
    <div>
      <AdminHeader
        title={`Welcome${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.`}
        description="Everything on the public site is edited from here."
        action={
          <Link to="/" className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:text-gold">
            <Eye className="h-4 w-4" /> View site
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group rounded-2xl border border-border/60 bg-white/[0.02] p-6 transition hover:border-gold/40">
            <c.icon className="h-5 w-5 text-gold/70" />
            <div className="mt-6 font-display text-5xl gold-text">{c.value}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{c.label}</div>
          </Link>
        ))}
      </div>

      {isSuperAdmin && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-gold/30 p-6">
          <div>
            <div className="text-sm">Import built-in content</div>
            <p className="mt-1 max-w-lg text-xs text-muted-foreground">
              Copies the site's original articles, companies, work, testimonials, speaking, books,
              resources and settings into the database so everything becomes editable here.
            </p>
          </div>
          <button
            onClick={() => void runImport()}
            disabled={!!importing}
            className="rounded-full bg-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
          >
            {importing ? `Importing ${importing}…` : "Run import"}
          </button>
        </div>
      )}

      <div className="mt-12">
        <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-gold/80">Recently edited</h2>
        <div className="space-y-2">
          {(articles.data ?? []).slice(0, 6).map((a) => (
            <Link key={a.id} to="/admin/articles" className="flex items-center justify-between rounded-2xl border border-border/60 p-4 text-sm hover:border-gold/40">
              <span className="truncate">{a.title}</span>
              <span className="ml-4 shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.status}</span>
            </Link>
          ))}
          {(articles.data ?? []).length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
              No articles yet — <Link to="/admin/articles" className="text-gold">write the first one</Link>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

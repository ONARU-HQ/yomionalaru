import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FileText, Building2, Images, Quote, Mic, BookOpen,
  LinkIcon, Mail, Inbox, Settings as SettingsIcon, Users, BarChart3,
  FolderOpen, LogOut, Menu, X, ExternalLink, Eye,
} from "lucide-react";
import { useAuth, ROLE_LABEL } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { setPreviewEnabled } from "@/lib/preview";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; min: number };

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, min: 1 },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, min: 3 },
  { to: "/admin/articles", label: "Articles", icon: FileText, min: 1 },
  { to: "/admin/companies", label: "Companies", icon: Building2, min: 2 },
  { to: "/admin/portfolio", label: "Portfolio", icon: Images, min: 2 },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote, min: 2 },
  { to: "/admin/speaking", label: "Speaking", icon: Mic, min: 2 },
  { to: "/admin/books", label: "Books", icon: BookOpen, min: 2 },
  { to: "/admin/resources", label: "Resources", icon: LinkIcon, min: 2 },
  { to: "/admin/media", label: "Media Library", icon: FolderOpen, min: 1 },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail, min: 3 },
  { to: "/admin/contacts", label: "Inbox", icon: Inbox, min: 3 },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon, min: 3 },
  { to: "/admin/users", label: "Users", icon: Users, min: 4 },
];

export function AdminShell() {
  const { loading, user, rank, profile, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({ to: "/auth", search: { redirect: pathname }, replace: true });
    }
  }, [loading, user, navigate, pathname]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) return null;

  if (rank < 1) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl gold-text">No access</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This account ({user.email}) does not have permission to use the admin area.
            Ask a Super Admin for an invitation.
          </p>
          <button
            onClick={async () => { await signOut(); void navigate({ to: "/", replace: true }); }}
            className="mt-8 rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.24em]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const items = NAV.filter((n) => rank >= n.min);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[260px] shrink-0 border-r border-border/60 bg-black/60 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-6">
              <Link to="/admin" className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold">Y</span>
                <span className="text-xs uppercase tracking-[0.28em] text-foreground/80">Studio</span>
              </Link>
              <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
              {items.map((n) => {
                const active = n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      active ? "bg-gold/10 text-gold" : "text-foreground/65 hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border/60 p-4">
              <div className="truncate text-sm">{profile?.full_name || user.email}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gold/80">
                {roles.length ? roles.map((r) => ROLE_LABEL[r]).join(" · ") : "No role"}
              </div>
              <button
                onClick={() => { setPreviewEnabled(true); void navigate({ to: "/" }); }}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-gold/90 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold"
              >
                <Eye className="h-3 w-3" /> Preview site
              </button>
              <div className="mt-2 flex items-center gap-2">
                <Link to="/" className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-[10px] uppercase tracking-[0.2em] hover:text-gold">
                  <ExternalLink className="h-3 w-3" /> Site
                </Link>
                <button
                  onClick={async () => { await signOut(); void navigate({ to: "/", replace: true }); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-[10px] uppercase tracking-[0.2em] hover:text-gold"
                >
                  <LogOut className="h-3 w-3" /> Out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur-xl lg:hidden">
            <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <span className="text-xs uppercase tracking-[0.28em]">Studio</span>
          </div>
          <main className="mx-auto max-w-6xl px-5 py-10 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function AdminHeader({
  title, description, action,
}: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl gold-text">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

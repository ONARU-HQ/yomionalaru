import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-black/40 font-display text-lg text-gold shadow-[0_0_30px_-8px_var(--gold)] transition group-hover:shadow-[0_0_40px_-4px_var(--gold)]">
            Y
          </span>
          <span className="hidden text-sm uppercase tracking-[0.28em] text-foreground/80 sm:block">
            Yomi Onalaru
          </span>
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 transition md:flex",
            scrolled && "glass",
          )}
        >
          {NAV_LINKS.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.22em] transition-colors",
                  active ? "text-gold" : "text-foreground/60 hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/contact"
            className="rounded-full bg-gold px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-soft"
          >
            Work with me
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="mx-6 mt-3 glass rounded-3xl p-6">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-xl px-4 py-3 text-sm uppercase tracking-[0.24em] text-foreground/80 transition hover:bg-white/5 hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-3 rounded-full bg-gold px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.24em] text-primary-foreground"
              >
                Work with me
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

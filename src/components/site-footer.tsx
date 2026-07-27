import { Link } from "@tanstack/react-router";
import { NAV_LINKS, COMPANIES, SOCIALS, CONTACT } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-4xl gold-text">Yomi Onalaru</div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Creative Director. Entrepreneur. Product Builder. Building the future of business for creatives.
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-6 inline-block text-sm text-foreground/80 hover:text-gold"
            >
              {CONTACT.email}
            </a>
          </div>

          <FooterCol title="Navigate">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-gold">{l.label}</Link>
            ))}
          </FooterCol>

          <FooterCol title="Companies">
            {COMPANIES.map((c) => (
              <Link key={c.slug} to="/companies/$slug" params={{ slug: c.slug }} className="hover:text-gold">
                {c.name}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Elsewhere">
            {SOCIALS.personal.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-gold">
                {s.label}
              </a>
            ))}
          </FooterCol>
        </div>

        <div className="mt-16 hairline" />
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs uppercase tracking-[0.28em] text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Yomi Onalaru — All rights reserved.</span>
          <span>Designed & built with intention.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.28em] text-gold/80">{title}</div>
      <div className="mt-5 flex flex-col gap-3 text-sm text-foreground/70">{children}</div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { NAV_LINKS, SOCIALS, CONTACT, ONARU } from "@/lib/site-data";
import { NewsletterForm } from "@/components/newsletter-form";
import { usePublicCompanies } from "@/lib/public-content";
import { useSetting } from "@/lib/cms";

export function SiteFooter() {
  const { companies } = usePublicCompanies();
  const footer = useSetting<{ note?: string; newsletterHeading?: string; newsletterBody?: string }>("footer");
  const contact = useSetting<{ email?: string; location?: string }>("contact");
  const email = contact.email || CONTACT.email;

  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* newsletter */}
        <div className="mb-20 grid gap-8 rounded-[2rem] border border-border/60 bg-white/[0.02] p-10 md:grid-cols-[1fr_1.1fr] md:items-center md:p-14">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">Newsletter</div>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              {footer.newsletterHeading || "Systems, leadership and lessons"}
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {footer.newsletterBody || "A weekly note on building companies that can live without you."}
            </p>
          </div>
          <NewsletterForm source="footer" />
        </div>

        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-4xl gold-text">Yomi Onalaru</div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {footer.note || ONARU.summary}
            </p>
            <a href={`mailto:${email}`} className="mt-6 inline-block text-sm text-foreground/80 hover:text-gold">
              {email}
            </a>
            <div className="mt-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {contact.location || CONTACT.location}
            </div>
          </div>

          <FooterCol title="Navigate">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-gold">{l.label}</Link>
            ))}
          </FooterCol>

          <FooterCol title="Ecosystem">
            {companies.map((c) => (
              <Link key={c.slug} to="/companies/$slug" params={{ slug: c.slug }} className="hover:text-gold">
                {c.name}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Resources">
            <Link to="/blog" className="hover:text-gold">Blog</Link>
            <Link to="/mentorship" className="hover:text-gold">Mentorship</Link>
            <Link to="/speaking" className="hover:text-gold">Speaking</Link>
            <Link to="/projects" className="hover:text-gold">Work</Link>
            <Link to="/media" className="hover:text-gold">Media</Link>
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
          <span>© {new Date().getFullYear()} {ONARU.name} — All rights reserved.</span>
          <div className="flex flex-wrap gap-6">
            <Link to="/contact" className="hover:text-gold">Contact</Link>
            <a href={`mailto:${email}`} className="hover:text-gold">Press</a>
            <span>Designed &amp; built with intention.</span>
          </div>
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

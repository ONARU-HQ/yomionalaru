import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl gold-text">404</h1>
        <p className="mt-4 text-muted-foreground">This page drifted out of orbit.</p>
        <a href="/" className="mt-8 inline-block text-sm uppercase tracking-[0.3em] text-gold hover:text-gold-soft">
          Return home →
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something went sideways.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

const ORG_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Yomi Onalaru",
      description:
        "The digital headquarters of Yomi Onalaru — founder of ONARU, building companies that solve meaningful problems.",
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: ONARU.name,
      alternateName: "ONARU Holdings",
      url: SITE_URL,
      slogan: ONARU.tagline,
      description: ONARU.summary,
      founder: { "@id": `${SITE_URL}/#person` },
      foundingLocation: { "@type": "Place", name: "Lagos, Nigeria" },
      areaServed: "Worldwide",
      email: CONTACT.email,
      sameAs: [...SOCIALS.personal, ...SOCIALS.brands].map((s) => s.href),
      subOrganization: COMPANIES.map((c) => ({
        "@type": "Organization",
        name: c.name,
        description: c.tagline,
        url: `${SITE_URL}/companies/${c.slug}`,
      })),
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Yomi Onalaru",
      url: SITE_URL,
      image: portrait.url,
      email: CONTACT.email,
      jobTitle: "Founder & Creative Director",
      description:
        "Founder of ONARU. Building companies that solve real-world problems through creativity, technology, systems and media.",
      knowsAbout: [...POSITIONING, ...INTERSECTIONS],
      worksFor: { "@id": `${SITE_URL}/#organization` },
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
      sameAs: SOCIALS.personal.map((s) => s.href),
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Yomi Onalaru — Creative Director. Entrepreneur. Product Builder." },
      { name: "description", content: "The digital headquarters of Yomi Onalaru — founder of ONARU. Building the future of business for creatives." },
      { name: "author", content: "Yomi Onalaru" },
      { name: "theme-color", content: "#0a0906" },
      { property: "og:site_name", content: "Yomi Onalaru" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@yomionalaru" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(ORG_LD) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/reset-password");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="relative min-h-screen bg-background text-foreground grain">
          {!bare && <SiteNav />}
          <main className="relative">
            <Outlet />
          </main>
          {!bare && <SiteFooter />}
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

# Yomi Onalaru — Personal Identity Web App PRD, v2 (frontend)
**Status:** implementation branch, no production deployment authorized.

## Product intent
Transform an already functioning personal website into a premium, mobile-first,
narrative identity experience. Not a new CRM and not a replacement for the
existing website CMS. The primary public journey answers:
**Who is Yomi? → Where did the work start? → What exists? →
What is being built? → What does Yomi think? → How can we connect?**

The starting product requirements are documented in the repository README
("Yomi's Universe"). Current code uses TanStack Start/Vite on Cloudflare Workers,
not the README's proposed Next.js stack. Reuse the actual infrastructure rather
than rebuilding for a hypothetical framework.

## Visual source interpretation
The supplied references show several design families. They cannot all be
literally the same layout; unify their useful patterns:
- black atmospheric editorial hero / typography + subtle gold
- lime chart-card and off-white surfaces for energetic contrast
- glass layered dashboard cards and futuristic depth
- vertically stacked large-format mobile editorial screens
- minimal app-style profile cards, image-first work tiles and crisp CTAs
- animation has purpose: three-dimensional depth and progressive reveals,
  not indefinite motion or flashing distractions.
Do not reuse reference image subjects, names, UI branding, invented metrics or
copyrighted interface artwork. Use authentic pre-existing local photography.

## Public screen order / exact intended actions

| Screen | Content source | Primary action | Mobile behavior |
| --- | --- | --- | --- |
| 01 Identity universe | Founder identity + authentic gallery portrait | Explore my journey → #the-journey | Stacked portrait card, readable large type, WebGL optional |
| 02 Documentary journey | Existing TIMELINE + archive photography | View my work → /projects | Vertical time cards alongside image |
| 03 Connected world | Approved brand destinations, clearly labeled status | Open company or existing public project route | 1-column cards, 2-column tablet, 3-column desktop |
| 04 Selected work | Existing published CMS projects, static fallback | View all projects → /projects | Responsive image cards |
| 05 Thinking in public | Published CMS articles + existing public principles | Explore my thinking → /thinking | Editorial quote and essay cards |
| 06 Media | Existing media frontend component | Existing media CTAs | Retain current behavior |
| 07 Newsletter | Existing newsletter form | Subscribe | Retain current confirmation workflow |
| 08 Contact | Existing contact CTA | Contact | Retain existing contact routing |
| Thinking archive | Existing public principles, notes and published articles | Read essay / contact | Accessible cards and native links |

## Links
- TRYSA: https://trysa.app
- YV Studios: https://yvstudios.ng
- Shop 1401: https://trysa.app/shop1401
- ONARU OS public overview: https://onaru.app
- PlayBaaq links to existing /projects until public domain is verified.
- Gallery, companies, media, speaking and blog routes stay alive.
- All external links open in a safe new tab with rel=noopener noreferrer.

## Three.js and motion
The decorative Three.js scene is lazy-loaded only when in view, after client
hydration. It uses deterministic orbit rings and wire geometry rather than a
large photorealistic asset. The camera is reconfigured on ResizeObserver.
Rendering stops when off-screen or document is hidden. Dispose geometries,
materials, canvas and WebGL context resources on unmount. A CSS static
atmosphere always renders as fallback. Respect reduced-motion and data saver.
Limit device pixel ratio. All navigation, text and accessibility work even if
WebGL does not load. Test low-memory devices and Safari iOS.

Use existing Framer Motion for reveal transitions, but no animations that
block content and no infinitely running scroll listeners.

## Editorial authenticity
Do not invent real-world audience growth, earnings, awards, milestones or
product launches. Time-sensitive company statuses require editorial review.
Personal public quotations are curated from existing publicly designated
site data; editors may publish full essays through the existing articles CMS.
Private notes are not auto-synced to the public website.

## Private boundary
YomiOnalaru.com remains a public portfolio and personal identity frontend.
ONARU OS handles private MY OS identity and server integrations.
TRYSA remains the CRM and booking system of record. Do not render personal
workspace data, OAuth tokens, secrets, CRM records, customer data or staff
information in the public application. The public Thinking screen has no
read permissions to MY OS.
No new backend, database tables, signing keys, tokens or anonymous access
has been created by this redesign.

## Accessibility / quality gates
- 360px, 390px, 768px and 1440px layout checks.
- Minimum 44px effective tap target for primary CTAs.
- Heading order h1 → h2 → h3; actual links for navigation.
- Contrast, visible keyboard focus, alt text, no horizontal overflow.
- Reduced-motion and no-WebGL fallback.
- Existing public routes, CMS, newsletter and contact flows remain.
- Route metadata canonical: https://yomionalaru.com, not legacy Lovable.
- Build + smoke test before staging; deploy production only after review.
- Prefer actual original photos already in repo, with srcSet where available.

## Remaining work beyond this PR
- Editorial review of milestone dates, brand statuses, live domains.
- Real device screenshot QA of the running staging build.
- Dedicated public quotes publishing tool, if needed, using authenticated
  existing content infrastructure rather than exposing personal OS.
- Image and 3D scene tuning based on mobile frame performance.

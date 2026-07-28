# Version 2.0 — Founder Experience

Elevating the existing site into an immersive founder HQ. Keeping the matte-black + gold identity, TanStack Start stack (Next.js was requested but the project is locked to TanStack Start — I'll deliver the same experience on this stack).

## Scope

### 1. Cinematic intro
- One-time (session-scoped) YO monogram reveal with gold glow, then dissolves into home. Skippable, respects `prefers-reduced-motion`.

### 2. Living homepage
- Replace static "current focus" with **"What I'm Building"** status cards: TRYSA, TRYSA Home, YOFA, Playbaaq, YV Experience — each with animated progress bar, pulsing status dot, subtle float.
- Add **Ecosystem orbit** section (see #3).
- Add **Animated stats** counters (see #5).
- Add **Manifesto** full-screen section (see #6).
- Add **World map** highlight (see #7).

### 3. Company ecosystem (new visual identity)
- SVG-based orbit: "Yomi Onalaru" node in center, companies orbiting with animated connecting lines. Parent→child relationships (TRYSA→TRYSA Home, Yomi Visuals→YV Studios/YV Experience). Hover glows, click navigates to company page.
- Replaces the plain grid on `/companies` and appears in condensed form on home.

### 4. Interactive founder timeline
- Scroll-driven storytelling on `/about` and home: sticky year, entries fade/slide in with Framer Motion `useScroll`. Years: 2023, 2025, 2026, Current, Future.

### 5. Dynamic statistics
- Counter component using `useInView` + rAF tween. Metrics: Companies Built, Products Shipping, Creative Projects, Businesses Powered, Cities, Years, Photos Delivered.

### 6. Founder manifesto
- Full-viewport section, huge Instrument Serif type, gold gradient underline, quiet.

### 7. Interactive world
- Lightweight SVG world map (no heavy 3D dep) with pulsing gold markers on Lagos, Accra, plus "future" muted markers. Hover shows city label.

### 8. Product-style company pages
- Rework `/companies/$slug`: massive hero, mission/vision blocks, screenshots placeholder frames, roadmap timeline, "visit" CTA. Keep data-driven from `site-data.ts` (extend with mission/vision/roadmap).

### 9. Editorial journal
- Rework `/journal` list into editorial cards; add reading-progress bar + estimated read time on article view (add `/journal/$slug` route with sample content, quote blocks, large imagery slots).

### 10. Media — Breaking Boundaries series
- Featured episode hero (YouTube embed via lite thumbnail), episode grid, "Watch on YouTube" CTAs.

### 11. Speaking
- Add testimonials carousel, past events list, "Creative Mindset Shift" flagship talk block, media kit download link (placeholder PDF link).

### 12. Contact
- Category chips (Speaking, Consulting, Creative Direction, Partnerships, Media, Technology, Photography) that prefill the message textarea via query param + state.

### 13. Micro-interactions
- Magnetic buttons, cursor spotlight (desktop only, disabled on touch/reduced-motion), card tilt on company cards, animated section dividers, scroll reveals already in place. Ambient floating gradients on hero backgrounds.

### 14. Founder dashboard
- `/hq` route gated behind Lovable Cloud auth + `admin` role (user_roles table). Shows current projects, upcoming launches, ideas, quick notes (local state for now, DB-backed CRUD for notes/ideas).
- **Requires enabling Lovable Cloud.** If you'd rather skip auth for now, I can ship it as a hidden route with a shared-password gate instead.

## Technical notes
- Stack stays TanStack Start / React 19 / Tailwind v4 / Framer Motion (already installed). No GSAP — Framer Motion covers every animation here at lower bundle cost. No three.js globe — SVG map keeps Lighthouse ≥95.
- New data added to `src/lib/site-data.ts` (mission/vision/roadmap per company, stats, testimonials, episodes, ecosystem tree).
- New components: `CinematicIntro`, `BuildingCards`, `EcosystemOrbit`, `ScrollTimeline`, `StatCounters`, `Manifesto`, `WorldMap`, `MagneticButton`, `CursorSpotlight`, `TiltCard`, `ReadingProgress`.
- SEO head() per route preserved and updated where content changes.

## One decision I need from you
**Founder dashboard `/hq`:** enable Lovable Cloud + email auth (proper, revocable), or ship as a hidden route with a single shared password? Pick one and I'll build everything above in that turn.

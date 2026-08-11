# Yomi Ecosystem HQ — Evolution Plan

Upgrading the existing site into a live ecosystem headquarters. Nothing is rebuilt: current design system, typography, photography pipeline, journal, reflections, existing routes and the CMS all stay. Everything below is additive or a swap of hard-coded values for admin-controlled data.

## Phase 1 — Ecosystem data layer

New tables (extensible, RLS-protected, public sees only published rows):

- `ventures` — TRYSA, Yomi Visuals, YV Studios, Yomi Unscripted, Academy, ONARU Ventures. Status enum: idea, building, beta, live, operating, paused, archived. Plus connection state: live, synced, curated, not_connected.
- `venture_updates` — the "Building Now" feed: venture, title, blurb, date, image, CTA.
- `work_projects` + `work_media` — case studies: client, year, role, overview, challenge, approach, execution, result, gallery, video, external URL.
- `journey_milestones` — year, title, description, media, related venture/project.
- `archive_entries` — category (work, build, thoughts, places, people, media), searchable.
- `press_mentions`, `speaking_topics`, `enquiries` (with status new → reviewing → contacted → meeting → closed), `enquiry_notes`, `integration_sources` (per-product connection config + last sync + cached payload).

Existing `companies`, `portfolio`, `testimonials`, `articles`, `newsletter_subscribers`, `contacts`, `settings`, `media_library`, `page_views` are kept and reused rather than duplicated.

## Phase 2 — Integration service layer

- Server functions only; no product credentials in the browser.
- `integration_sources` row per product holds endpoint + connection status; secrets live in backend secrets, never in code.
- A generic sync service: fetch → validate → cache into `integration_cache` → serve from cache. If a fetch fails, the site serves the last good cache, then curated ecosystem data. Never a fake "LIVE" badge.
- YouTube (YVStudiosHQ) sync via a scheduled public API route + cached results, so new episodes appear without editing the site. Needs a YouTube Data API key.
- TRYSA/YV Studios: architecture, data model, service interface and connection status shipped now; marked CURATED until real endpoints exist.

## Phase 3 — Public surfaces

- Homepage resequenced in place (same components/visual language): Hero → Selected Work → Currently Building → Ecosystem → Latest Updates → Journey → Yomi Unscripted → Work With Yomi → Newsletter. Hard-coded progress percentages replaced with real status labels.
- `/ecosystem` — each venture with its own identity and CTA.
- `/work/$slug` — editorial case study pages; `/work` index reuses the existing gallery/filter system.
- `/press` media kit, `/archive` searchable archive, `/speaking` with Invite Yomi form, `/work-with-yomi` branching enquiry flow.
- Existing routes (`/companies`, `/projects`, `/blog`, `/mentorship`, `/media`, `/contact`) stay and redirect or link into the new surfaces where they overlap — no dead links.

## Phase 4 — Command Center (/admin)

Adds to the existing admin shell: Ventures, Updates, Work projects, Journey, Archive, Press, Speaking, Enquiries CRM (lead list, status, notes, activity), Integrations (connection status, manual sync), and Website (featured sections, SEO, nav/footer/socials). Analytics gains ecosystem metrics with "Not connected" instead of zeros.

## Phase 5 — Quality pass

Route/link/button audit, mobile checks at 320/375/390/430/tablet/desktop, loading + error + retry states, RLS review, per-route SEO metadata and schema (Person, Organization, CreativeWork, Article), sitemap refresh.

## What I need from you

1. **YouTube Data API key** for the live Yomi Unscripted feed. Without it I ship the section reading from cached/curated entries and mark it NOT CONNECTED.
2. **TRYSA endpoint** — if TRYSA already exposes a public API or webhook, the URL. Otherwise it ships as CURATED with the integration interface ready.

## Notes

- No invented statistics, dates, testimonials or achievements anywhere.
- Photography stays on the existing CDN/derivative pipeline.
- Phases ship in order; the site stays working after each one.

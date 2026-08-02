import { supabase } from "@/integrations/supabase/client";
import { ARTICLES, CATEGORIES } from "@/content/articles";
import {
  COMPANIES, PROJECTS, TESTIMONIALS, SPEAKING_EVENTS, BOOKS, MEDIA_ITEMS,
  ONARU, CONTACT, SOCIALS, SITE_URL,
} from "@/lib/site-data";
import { slugify } from "@/lib/cms";

/** Turns a structured static article into the markdown body stored in the CMS. */
export function articleToMarkdown(a: (typeof ARTICLES)[number]) {
  const out: string[] = [];
  for (const p of a.lede) out.push(p);
  for (const s of a.sections) {
    out.push(`## ${s.h2}`);
    for (const p of s.body) out.push(p);
    if (s.list?.length) out.push(s.list.map((l) => `- ${l}`).join("\n"));
    for (const h of s.h3 ?? []) {
      out.push(`### ${h.title}`);
      for (const p of h.body) out.push(p);
    }
  }
  if (a.faqs.length) {
    out.push("## Frequently asked questions");
    for (const f of a.faqs) {
      out.push(`### ${f.q}`);
      out.push(f.a);
    }
  }
  return out.join("\n\n");
}

type Progress = (message: string) => void;

/**
 * One-time migration of the hard-coded site content into the CMS tables.
 * Safe to re-run: rows are matched on slug / natural key and updated.
 */
export async function importStaticContent(onProgress: Progress = () => {}) {
  const summary: Record<string, number> = {};

  /* categories */
  onProgress("Categories");
  const catRows = CATEGORIES.map((name, i) => ({ name, slug: slugify(name), sort_order: i }));
  const { data: existingCats } = await supabase.from("categories").select("id, slug");
  const catMap = new Map((existingCats ?? []).map((c) => [c.slug, c.id]));
  for (const c of catRows) {
    if (catMap.has(c.slug)) continue;
    const { data } = await supabase.from("categories").insert(c).select("id, slug").maybeSingle();
    if (data) catMap.set(data.slug, data.id);
  }
  summary["categories"] = catMap.size;

  /* articles */
  onProgress("Articles");
  const { data: existingArticles } = await supabase.from("articles").select("id, slug");
  const articleMap = new Map((existingArticles ?? []).map((a) => [a.slug, a.id]));
  const { data: me } = await supabase.auth.getUser();
  for (const a of ARTICLES) {
    const row = {
      ...(articleMap.has(a.slug) ? { id: articleMap.get(a.slug)! } : {}),
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      body: articleToMarkdown(a),
      category_id: catMap.get(slugify(a.category)) ?? null,
      tags: a.keywords,
      seo_title: a.title,
      seo_description: a.description,
      reading_time: a.readMins,
      status: "published" as const,
      published_at: new Date(a.iso).toISOString(),
      featured: a.slug === ARTICLES[0]!.slug,
      author_id: me.user?.id ?? null,
    };
    await supabase.from("articles").upsert(row).select("id");
  }
  summary["articles"] = ARTICLES.length;

  /* companies */
  onProgress("Companies");
  const { data: existingCompanies } = await supabase.from("companies").select("id, slug");
  const companyMap = new Map((existingCompanies ?? []).map((c) => [c.slug, c.id]));
  for (const [i, c] of COMPANIES.entries()) {
    await supabase.from("companies").upsert({
      ...(companyMap.has(c.slug) ? { id: companyMap.get(c.slug)! } : {}),
      name: c.name,
      slug: c.slug,
      category: c.category,
      tagline: c.tagline,
      description: c.description,
      mission: c.mission,
      vision: c.vision,
      problem: c.problem,
      website: c.website ?? null,
      status: c.status,
      progress: c.progress ?? 50,
      launch_year: String(c.launchYear),
      services: c.services ?? [],
      products: c.products ?? [],
      roadmap: (c.roadmap ?? []) as never,
      featured: i < 3,
      visible: true,
      sort_order: i,
    });
  }
  summary["companies"] = COMPANIES.length;

  /* portfolio */
  onProgress("Portfolio");
  const { data: existingPortfolio } = await supabase.from("portfolio").select("id, slug");
  const portMap = new Map((existingPortfolio ?? []).map((p) => [p.slug, p.id]));
  for (const [i, p] of PROJECTS.entries()) {
    await supabase.from("portfolio").upsert({
      ...(portMap.has(p.slug) ? { id: portMap.get(p.slug)! } : {}),
      title: p.title,
      slug: p.slug,
      category: p.tag,
      year: p.year,
      description: p.body,
      featured: i < 3,
      visible: true,
      sort_order: i,
    });
  }
  summary["portfolio"] = PROJECTS.length;

  /* testimonials */
  onProgress("Testimonials");
  const { data: existingT } = await supabase.from("testimonials").select("id, quote");
  const tSet = new Set((existingT ?? []).map((t) => t.quote));
  const newT = TESTIMONIALS.filter((t) => !tSet.has(t.quote)).map((t, i) => ({
    name: t.who,
    quote: t.quote,
    featured: i < 3,
    visible: true,
    sort_order: i,
  }));
  if (newT.length) await supabase.from("testimonials").insert(newT);
  summary["testimonials"] = TESTIMONIALS.length;

  /* speaking */
  onProgress("Speaking");
  const { data: existingS } = await supabase.from("speaking").select("id, title");
  const sSet = new Set((existingS ?? []).map((s) => s.title));
  const newS = SPEAKING_EVENTS.filter((s) => !sSet.has(s.name)).map((s, i) => ({
    title: s.name,
    event: s.name,
    location: s.venue,
    date: s.year,
    description: s.note,
    visible: true,
    sort_order: i,
  }));
  if (newS.length) await supabase.from("speaking").insert(newS);
  summary["speaking"] = SPEAKING_EVENTS.length;

  /* books */
  onProgress("Books");
  const { data: existingB } = await supabase.from("books").select("id, title");
  const bSet = new Set((existingB ?? []).map((b) => b.title));
  const newB = BOOKS.filter((b) => !bSet.has(b.title)).map((b, i) => ({
    title: b.title,
    author: b.author,
    visible: true,
    sort_order: i,
  }));
  if (newB.length) await supabase.from("books").insert(newB);
  summary["books"] = BOOKS.length;

  /* resources (media items) */
  onProgress("Resources");
  const { data: existingR } = await supabase.from("resources").select("id, title");
  const rSet = new Set((existingR ?? []).map((r) => r.title));
  const newR = MEDIA_ITEMS.filter((m) => !rSet.has(m.title)).map((m, i) => ({
    title: m.title,
    description: m.body,
    type: m.type,
    visible: true,
    sort_order: i,
  }));
  if (newR.length) await supabase.from("resources").insert(newR);
  summary["resources"] = MEDIA_ITEMS.length;

  /* settings */
  onProgress("Settings");
  const settings: { key: string; value: Record<string, unknown> }[] = [
    {
      key: "hero",
      value: {
        eyebrow: `Founder of ${ONARU.name}`,
        statement:
          "Building companies that solve meaningful problems through creativity, systems and technology.",
        intro: ONARU.summary,
      },
    },
    {
      key: "biography",
      value: {
        short: "Yomi Onalaru is the founder of ONARU — a company builder creating businesses at the intersection of creativity, technology and systems.",
        long: `${ONARU.summary} ${ONARU.mission} ${ONARU.vision}`,
      },
    },
    { key: "social", value: { ...SOCIALS } },
    {
      key: "seo",
      value: {
        title: "Yomi Onalaru — Founder of ONARU",
        description:
          "Yomi Onalaru is the founder of ONARU, building companies that solve meaningful problems through creativity, systems and technology.",
        ogImage: "",
        siteUrl: SITE_URL,
      },
    },
    {
      key: "footer",
      value: {
        note: "ONARU — building, acquiring and scaling companies that solve meaningful problems.",
        newsletterHeading: "Systems, leadership and lessons",
        newsletterBody: "A weekly note on building companies that can live without you.",
      },
    },
    { key: "contact", value: { ...CONTACT } },
  ];
  for (const s of settings) {
    await supabase.from("settings").upsert({ key: s.key, value: s.value as never }, { onConflict: "key" });
  }
  summary["settings"] = settings.length;

  onProgress("Done");
  return summary;
}

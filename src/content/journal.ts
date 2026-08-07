import type { JournalArticle, JournalCategory } from "./journal-types";
import { PART_ONE } from "./journal-part-1";

export type { JournalArticle, JournalCategory, Block } from "./journal-types";
export { JOURNAL_CATEGORIES } from "./journal-types";

export const JOURNAL: JournalArticle[] = [...PART_ONE].sort((a, b) =>
  a.iso < b.iso ? 1 : -1,
);

export const getArticle = (slug: string) => JOURNAL.find((a) => a.slug === slug);

export const getRelated = (slug: string, limit = 3) => {
  const article = getArticle(slug);
  if (!article) return [];
  const explicit = article.related
    .map(getArticle)
    .filter((a): a is JournalArticle => Boolean(a) && a!.slug !== slug);
  const fallback = JOURNAL.filter(
    (a) => a.slug !== slug && a.category === article.category && !explicit.includes(a),
  );
  return [...explicit, ...fallback].slice(0, limit);
};

export const articlesByCategory = (category: JournalCategory | "All") =>
  category === "All" ? JOURNAL : JOURNAL.filter((a) => a.category === category);

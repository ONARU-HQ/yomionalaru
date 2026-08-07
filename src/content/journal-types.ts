export type Block =
  | { t: "p"; x: string }
  | { t: "h2"; x: string }
  | { t: "pull"; x: string }
  | { t: "verse"; x: string; ref: string };

export type JournalCategory =
  | "Faith"
  | "Purpose"
  | "Creativity"
  | "Stewardship"
  | "Building"
  | "Leadership"
  | "Life";

export type JournalArticle = {
  slug: string;
  title: string;
  subtitle: string;
  category: JournalCategory;
  iso: string;
  readMins: number;
  excerpt: string;
  seoDescription: string;
  cover: string;
  keyScripture: { text: string; ref: string };
  supporting: string[];
  body: Block[];
  related: string[];
};

export const JOURNAL_CATEGORIES: (JournalCategory | "All")[] = [
  "All",
  "Faith",
  "Purpose",
  "Creativity",
  "Stewardship",
  "Building",
  "Leadership",
  "Life",
];

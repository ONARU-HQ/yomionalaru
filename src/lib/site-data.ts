export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/companies", label: "Companies" },
  { to: "/projects", label: "Projects" },
  { to: "/speaking", label: "Speaking" },
  { to: "/journal", label: "Journal" },
  { to: "/media", label: "Media" },
  { to: "/contact", label: "Contact" },
] as const;

export type Company = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  status: "Live" | "Coming Soon" | "In Development";
  launchYear: number | string;
  accent: string;
};

export const COMPANIES: Company[] = [
  {
    slug: "trysa",
    name: "TRYSA",
    tagline: "The Business OS for creatives.",
    description:
      "An AI-powered Business Operating System helping creative businesses run everything — bookings, CRM, finance, contracts, galleries, automation, client portals, and team management — from one intelligent workspace.",
    industry: "SaaS · AI · Creative Infrastructure",
    website: "https://www.trysa.app",
    instagram: "https://instagram.com/trysa.app",
    tiktok: "https://tiktok.com/@trysa.app",
    x: "https://x.com/trysa_app",
    status: "Live",
    launchYear: 2024,
    accent: "from-amber-200/30 via-yellow-500/10 to-transparent",
  },
  {
    slug: "yomi-visuals",
    name: "Yomi Visuals",
    tagline: "Luxury photography & film.",
    description:
      "A creative agency crafting photography, film, brand campaigns and luxury wedding experiences for discerning clients across the world.",
    industry: "Creative Agency · Photography · Film",
    website: "https://www.yomivisuals.com",
    instagram: "https://instagram.com/yomi.visuals",
    tiktok: "https://tiktok.com/@yomi.visuals",
    status: "Live",
    launchYear: 2018,
    accent: "from-rose-300/25 via-amber-200/10 to-transparent",
  },
  {
    slug: "yofa",
    name: "YOFA",
    tagline: "Modern luxury desserts.",
    description:
      "A premium bakery reimagining desserts with modern branding, elevated craft, and unforgettable taste.",
    industry: "Food & Beverage · Bakery",
    website: "https://www.yofa.ng",
    instagram: "https://instagram.com/yofa.ng",
    status: "Live",
    launchYear: 2022,
    accent: "from-orange-300/25 via-amber-200/10 to-transparent",
  },
  {
    slug: "folak",
    name: "Folak",
    tagline: "Luxury food & catering.",
    description:
      "Premium culinary experiences delivered with taste, elegance and precision — for weddings, private events and brands.",
    industry: "Hospitality · Catering",
    website: "https://www.folak.ng",
    status: "Live",
    launchYear: 2021,
    accent: "from-emerald-200/20 via-amber-200/10 to-transparent",
  },
  {
    slug: "shop1401",
    name: "Shop1401",
    tagline: "Premium fashion marketplace.",
    description:
      "A curated marketplace for premium fashion — a new home for designers, editors and collectors. Launching soon.",
    industry: "Commerce · Fashion",
    status: "Coming Soon",
    launchYear: "TBA",
    accent: "from-fuchsia-300/20 via-amber-200/10 to-transparent",
  },
];

export const FUTURE_VENTURES = [
  { name: "TRYSA Intelligence", note: "Applied AI for creative operations." },
  { name: "TRYSA Capital", note: "Funding the next creative economy." },
  { name: "TRYSA Foundation", note: "Investing in creative talent." },
  { name: "TRYSA Ventures", note: "Building & backing category-defining startups." },
  { name: "YV Entertainment", note: "Films, music and cultural storytelling." },
  { name: "YV Studios", note: "A world-class production studio." },
  { name: "YV Properties", note: "Design-first real estate." },
  { name: "YV Shortlets", note: "Luxury short-let hospitality." },
  { name: "YV Academy", note: "Training the next generation of creatives." },
];

export const TIMELINE = [
  { year: "2015", title: "Picked up a camera", body: "Fell in love with photography — the beginning of everything." },
  { year: "2018", title: "Founded Yomi Visuals", body: "Turned a passion into a luxury creative agency." },
  { year: "2020", title: "Built the studio", body: "A physical home for creation, collaboration and craft." },
  { year: "2021", title: "Folak & multiple ventures", body: "Expanding into hospitality, food and commerce." },
  { year: "2022", title: "YOFA launched", body: "Modern luxury baking with a premium brand." },
  { year: "2024", title: "TRYSA", body: "The AI-powered Business OS for creatives." },
  { year: "Next", title: "An ecosystem", body: "Capital, intelligence, education and infrastructure." },
];

export const CURRENT_FOCUS = [
  { title: "TRYSA", body: "Shipping the Business OS for creative businesses worldwide." },
  { title: "Creative Infrastructure", body: "Systems that let creatives scale without losing the craft." },
  { title: "Photography & Film", body: "Continuing to create visual work I'm proud of." },
  { title: "Education", body: "Sharing frameworks with a new generation of creative founders." },
  { title: "AI & Automation", body: "Making intelligent workflows the default." },
  { title: "Storytelling", body: "Writing, speaking, building the narrative." },
];

export const TECH_STACK = [
  "Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS",
  "OpenAI", "Vercel", "Cloudflare", "Stripe", "Lovable", "Automation", "AI",
];

export const SPEAKING_TOPICS = [
  { title: "Creative Entrepreneurship", body: "Building a business as a creator without losing your soul." },
  { title: "Brand Strategy", body: "Positioning premium brands in a saturated world." },
  { title: "AI for Creatives", body: "How AI is reshaping the creative economy — practically." },
  { title: "Business Systems", body: "Operationalising your creative business for scale." },
  { title: "Photography as a Business", body: "From artist to enterprise." },
  { title: "Building Product", body: "Lessons from shipping TRYSA." },
];

export const JOURNAL_POSTS = [
  { slug: "building-trysa", title: "Building TRYSA in Public", category: "Product", date: "Jul 2026", excerpt: "Why creative businesses need their own operating system — and what we're learning shipping it." },
  { slug: "creative-infrastructure", title: "The Age of Creative Infrastructure", category: "Essay", date: "Jun 2026", excerpt: "The next decade belongs to the people who build the rails beneath the creator economy." },
  { slug: "photography-to-product", title: "From Photography to Product", category: "Story", date: "May 2026", excerpt: "How a camera in my hand became a company in the cloud." },
  { slug: "on-brand-luxury", title: "On Brand & Luxury", category: "Essay", date: "Apr 2026", excerpt: "What luxury actually means when everything is a subscription." },
];

export const MEDIA_ITEMS = [
  { title: "The Creative Founder Podcast", type: "Podcast", body: "On building creative businesses that scale." },
  { title: "TechCabal Feature", type: "Article", body: "Yomi Onalaru is building an OS for African creatives." },
  { title: "YouTube — Behind YOFA", type: "Video", body: "The story of building a modern luxury bakery brand." },
  { title: "GQ Style Interview", type: "Interview", body: "On creativity, ambition and quiet luxury." },
  { title: "Design Africa Talk", type: "Keynote", body: "The future of design-led entrepreneurship." },
  { title: "The Flip Podcast", type: "Podcast", body: "AI, product and the creative economy." },
];

export const PROJECTS = [
  { slug: "trysa-launch", title: "TRYSA — Launch Campaign", tag: "Product · Brand", year: "2024", body: "Positioning, brand system and launch story for the Business OS for creatives." },
  { slug: "yofa-identity", title: "YOFA — Brand Identity", tag: "Brand · Direction", year: "2022", body: "A modern luxury identity for a bakery that refuses to be ordinary." },
  { slug: "atelier-editorial", title: "Atelier — Editorial Film", tag: "Film · Direction", year: "2023", body: "A short film exploring craft, patience and the making of things." },
  { slug: "lagos-nocturne", title: "Lagos Nocturne", tag: "Photography", year: "2023", body: "A photo essay on the quiet luxury of the city after dark." },
  { slug: "folak-campaign", title: "Folak — Signature Campaign", tag: "Campaign · Photography", year: "2022", body: "A campaign celebrating heritage, taste and modern hospitality." },
  { slug: "trysa-intelligence", title: "TRYSA Intelligence", tag: "Product · AI", year: "2026", body: "AI copilots for creative operations — from booking to delivery." },
];

export const SOCIALS = {
  personal: [
    { label: "Instagram", handle: "@yomionalaru", href: "https://instagram.com/yomionalaru" },
    { label: "TikTok", handle: "@yomionalaru", href: "https://tiktok.com/@yomionalaru" },
    { label: "LinkedIn", handle: "Yomi Onalaru", href: "https://linkedin.com/in/yomi-onalaru" },
    { label: "Facebook", handle: "Yomi Onalaru", href: "https://facebook.com/YomiOnalaru" },
  ],
  brands: [
    { label: "Yomi Visuals — Instagram", handle: "@yomi.visuals", href: "https://instagram.com/yomi.visuals" },
    { label: "Yomi Visuals — TikTok", handle: "@yomi.visuals", href: "https://tiktok.com/@yomi.visuals" },
    { label: "Pinterest", handle: "yomivisuals", href: "https://pinterest.com/yomivisuals" },
    { label: "TRYSA — Instagram", handle: "@trysa.app", href: "https://instagram.com/trysa.app" },
    { label: "TRYSA — TikTok", handle: "@trysa.app", href: "https://tiktok.com/@trysa.app" },
    { label: "TRYSA — X", handle: "@trysa_app", href: "https://x.com/trysa_app" },
    { label: "YOFA — Instagram", handle: "@yofa.ng", href: "https://instagram.com/yofa.ng" },
  ],
};

export const CONTACT = {
  email: "hello@yomionalaru.com",
  calendly: "https://calendly.com/yomionalaru",
  location: "Lagos · London · Worldwide",
};

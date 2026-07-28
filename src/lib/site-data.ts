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

export type CompanyStatus = "Live" | "Coming Soon" | "In Development" | "Building" | "R&D" | "Launching";

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
  status: CompanyStatus;
  launchYear: number | string;
  accent: string;
  mission?: string;
  vision?: string;
  progress?: number; // 0-100
  roadmap?: { phase: string; body: string; done?: boolean }[];
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
    status: "Building",
    launchYear: 2026,
    accent: "from-amber-200/30 via-yellow-500/10 to-transparent",
    mission: "Give every creative business the operating system it deserves.",
    vision: "The default infrastructure powering the global creative economy.",
    progress: 72,
    roadmap: [
      { phase: "Private Alpha", body: "Studios in Lagos, London and NY running live workflows.", done: true },
      { phase: "Public Beta", body: "Open access with billing, CRM, bookings and galleries.", done: true },
      { phase: "TRYSA Intelligence", body: "AI copilots for every part of the studio workflow." },
      { phase: "Global Launch", body: "The Business OS for creatives, everywhere." },
    ],
  },
  {
    slug: "trysa-home",
    name: "TRYSA Home",
    tagline: "Where the OS meets the world.",
    description:
      "The consumer-facing home for TRYSA — the front door to creative businesses running on the OS. A discovery layer, a booking layer, and a marketplace for the creative economy.",
    industry: "Consumer · Marketplace · Creative",
    status: "R&D",
    launchYear: "2027",
    accent: "from-yellow-300/25 via-orange-400/10 to-transparent",
    mission: "Make the world's best creatives discoverable, bookable, and unforgettable.",
    vision: "The home page of the creative economy.",
    progress: 22,
    roadmap: [
      { phase: "Research", body: "Deep discovery with studios and clients across three continents.", done: true },
      { phase: "Prototype", body: "First interactive prototype in the lab." },
      { phase: "Closed Beta", body: "Invite-only launch with hand-picked studios." },
      { phase: "Public Launch", body: "The front door to creative business, worldwide." },
    ],
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
    mission: "Turn moments into heirlooms.",
    vision: "The most respected creative studio out of Africa — for the world.",
    progress: 100,
    roadmap: [
      { phase: "Studio 01 · Lagos", body: "Home base for photography, film and direction.", done: true },
      { phase: "Studio 02", body: "A second physical studio built for scale.", done: true },
      { phase: "YV Studios", body: "A world-class production arm.", done: true },
      { phase: "YV Experience", body: "Immersive brand experiences and events." },
    ],
  },
  {
    slug: "yv-experience",
    name: "YV Experience",
    tagline: "Immersive brand experiences.",
    description:
      "The experience arm of Yomi Visuals — designing immersive events, activations and cinematic brand moments the audience feels in their bones.",
    industry: "Experiential · Events · Direction",
    status: "Launching",
    launchYear: 2026,
    accent: "from-pink-300/20 via-amber-200/10 to-transparent",
    mission: "Design moments that outlive the memory of them.",
    vision: "The gold standard for cinematic brand experience.",
    progress: 58,
    roadmap: [
      { phase: "Concept", body: "Format, pillars and first partner brands defined.", done: true },
      { phase: "Pilot", body: "Two invite-only experiences hosted in Lagos.", done: true },
      { phase: "Public Launch", body: "Signature series with global partners." },
    ],
  },
  {
    slug: "playbaaq",
    name: "Playbaaq",
    tagline: "Play. Loud.",
    description:
      "A new sound-first entertainment brand — a place for music, culture and the artists reshaping the sound of a generation.",
    industry: "Entertainment · Music · Culture",
    status: "Building",
    launchYear: 2026,
    accent: "from-violet-400/25 via-fuchsia-400/10 to-transparent",
    mission: "Amplify the artists rewriting culture.",
    vision: "The label and platform for the next generation of sound.",
    progress: 44,
    roadmap: [
      { phase: "Brand", body: "Identity, sound, and creative direction locked.", done: true },
      { phase: "Signature Drops", body: "First artist releases and cultural moments." },
      { phase: "Platform", body: "The full Playbaaq universe goes live." },
    ],
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
    status: "In Development",
    launchYear: 2026,
    accent: "from-orange-300/25 via-amber-200/10 to-transparent",
    mission: "Make the everyday indulgent.",
    vision: "A modern luxury dessert brand for the world.",
    progress: 36,
    roadmap: [
      { phase: "Product", body: "Signature recipes finalised.", done: true },
      { phase: "Brand", body: "Identity system built for scale.", done: true },
      { phase: "Retail", body: "First flagship location." },
      { phase: "Expansion", body: "Multi-city rollout." },
    ],
  },
  {
    slug: "folak",
    name: "Folak",
    tagline: "Luxury food & catering.",
    description:
      "Premium culinary experiences delivered with taste, elegance and precision — for weddings, private events and brands. Yomi serves as Technical Director.",
    industry: "Hospitality · Catering",
    website: "https://www.folak.ng",
    status: "Live",
    launchYear: 2021,
    accent: "from-emerald-200/20 via-amber-200/10 to-transparent",
    mission: "Elevate the table for every moment worth celebrating.",
    vision: "A modern hospitality house built on craft, care, and detail.",
    progress: 100,
    roadmap: [
      { phase: "Kitchen", body: "Signature menus and creative direction.", done: true },
      { phase: "Events", body: "Flagship weddings and brand activations.", done: true },
      { phase: "Systems", body: "Operational infrastructure for scale." },
    ],
  },
];

// What I'm Building — the living homepage cards
export const BUILDING = [
  { slug: "trysa", name: "TRYSA", label: "Building", progress: 72, note: "The Business OS for creatives — public beta live." },
  { slug: "trysa-home", name: "TRYSA Home", label: "R&D", progress: 22, note: "The consumer-facing front door of TRYSA." },
  { slug: "yofa", name: "YOFA", label: "In Development", progress: 36, note: "Modern luxury desserts. Flagship in build." },
  { slug: "playbaaq", name: "Playbaaq", label: "Building", progress: 44, note: "A sound-first entertainment brand." },
  { slug: "yv-experience", name: "YV Experience", label: "Launching", progress: 58, note: "Immersive brand experiences by Yomi Visuals." },
];

// Ecosystem tree — for the orbit visual
export const ECOSYSTEM: { name: string; slug?: string; children?: { name: string; slug?: string }[] }[] = [
  { name: "TRYSA", slug: "trysa", children: [{ name: "TRYSA Home", slug: "trysa-home" }] },
  { name: "Yomi Visuals", slug: "yomi-visuals", children: [{ name: "YV Studios" }, { name: "YV Experience", slug: "yv-experience" }] },
  { name: "Playbaaq", slug: "playbaaq" },
  { name: "YOFA", slug: "yofa" },
  { name: "Folak", slug: "folak" },
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

// Scroll-driven interactive timeline
export const TIMELINE = [
  { year: "2015", title: "Picked up a camera", body: "Fell in love with photography — the beginning of everything." },
  { year: "2018", title: "Founded Yomi Visuals", body: "Turned a passion into a luxury creative agency." },
  { year: "2023", title: "Founded YV Studios", body: "A production-first arm built for scale and cinema." },
  { year: "2025", title: "Opened Second Studio", body: "A physical home for creation, collaboration and craft." },
  { year: "2026", title: "TRYSA · Playbaaq · YV Experience launch", body: "Three ventures ship in one year. YOFA enters development." },
  { year: "Current", title: "Building TRYSA Home", body: "Designing the consumer front door for creative business." },
  { year: "Future", title: "The Creative Operating System for the World", body: "Capital, intelligence, education, and infrastructure." },
];

export const STATS = [
  { label: "Companies Built", value: 7, suffix: "" },
  { label: "Products Shipping", value: 5, suffix: "" },
  { label: "Creative Projects", value: 480, suffix: "+" },
  { label: "Businesses Powered", value: 120, suffix: "+" },
  { label: "Cities Worked In", value: 14, suffix: "" },
  { label: "Years Creating", value: 11, suffix: "" },
  { label: "Photos Delivered", value: 250000, suffix: "+" },
];

export const WORLD_MARKERS = [
  { name: "Lagos", x: 51.5, y: 58, live: true },
  { name: "Accra", x: 49.2, y: 57, live: true },
  { name: "London", x: 48.8, y: 34, live: false },
  { name: "New York", x: 27.5, y: 40, live: false },
  { name: "Dubai", x: 62, y: 48, live: false },
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

export const SPEAKING_EVENTS = [
  { name: "Creative Mindset Shift", venue: "Lagos", year: "2025", note: "Flagship talk on rethinking the creative business." },
  { name: "Design Africa Summit", venue: "Accra", year: "2024", note: "Keynote on design-led entrepreneurship." },
  { name: "The Flip Live", venue: "Lagos", year: "2024", note: "Panel on AI and the creative economy." },
  { name: "GITEX Creative Stage", venue: "Dubai", year: "2025", note: "On building African creative infrastructure." },
];

export const TESTIMONIALS = [
  { quote: "Yomi speaks like a founder who has actually built the thing. Rare, and refreshing.", who: "Programme Director, Design Africa" },
  { quote: "He shifted the way our team thinks about creative business. Weeks later, we're still quoting him.", who: "Head of Studio, Lagos" },
  { quote: "One of the most compelling voices on the future of the creative economy.", who: "Editor, TechCabal" },
];

export const JOURNAL_POSTS = [
  { slug: "building-trysa", title: "Building TRYSA in Public", category: "Product", date: "Jul 2026", readMins: 7, excerpt: "Why creative businesses need their own operating system — and what we're learning shipping it." },
  { slug: "creative-infrastructure", title: "The Age of Creative Infrastructure", category: "Essay", date: "Jun 2026", readMins: 9, excerpt: "The next decade belongs to the people who build the rails beneath the creator economy." },
  { slug: "photography-to-product", title: "From Photography to Product", category: "Story", date: "May 2026", readMins: 6, excerpt: "How a camera in my hand became a company in the cloud." },
  { slug: "on-brand-luxury", title: "On Brand & Luxury", category: "Essay", date: "Apr 2026", readMins: 5, excerpt: "What luxury actually means when everything is a subscription." },
];

export const MEDIA_ITEMS = [
  { title: "The Creative Founder Podcast", type: "Podcast", body: "On building creative businesses that scale." },
  { title: "TechCabal Feature", type: "Article", body: "Yomi Onalaru is building an OS for African creatives." },
  { title: "YouTube — Behind YOFA", type: "Video", body: "The story of building a modern luxury bakery brand." },
  { title: "GQ Style Interview", type: "Interview", body: "On creativity, ambition and quiet luxury." },
  { title: "Design Africa Talk", type: "Keynote", body: "The future of design-led entrepreneurship." },
  { title: "The Flip Podcast", type: "Podcast", body: "AI, product and the creative economy." },
];

// Breaking Boundaries series — YouTube IDs are placeholders you can swap for real episode IDs.
export const BREAKING_BOUNDARIES = {
  featured: {
    youtubeId: "dQw4w9WgXcQ",
    title: "Episode 01 — The Creative Founder",
    summary: "The opening chapter of Breaking Boundaries. A conversation on building an ecosystem out of a camera.",
  },
  episodes: [
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 02 — On Luxury", summary: "What luxury really means for the modern creative brand." },
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 03 — Systems Over Hustle", summary: "The operating system every studio wishes it had." },
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 04 — Lagos to the World", summary: "Building global-grade creative infrastructure from Africa." },
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 05 — Direction", summary: "How a director actually leads a modern creative company." },
  ],
};

export const PROJECTS = [
  { slug: "trysa-launch", title: "TRYSA — Launch Campaign", tag: "Product · Brand", year: "2024", body: "Positioning, brand system and launch story for the Business OS for creatives." },
  { slug: "yofa-identity", title: "YOFA — Brand Identity", tag: "Brand · Direction", year: "2022", body: "A modern luxury identity for a bakery that refuses to be ordinary." },
  { slug: "atelier-editorial", title: "Atelier — Editorial Film", tag: "Film · Direction", year: "2023", body: "A short film exploring craft, patience and the making of things." },
  { slug: "lagos-nocturne", title: "Lagos Nocturne", tag: "Photography", year: "2023", body: "A photo essay on the quiet luxury of the city after dark." },
  { slug: "folak-campaign", title: "Folak — Signature Campaign", tag: "Campaign · Photography", year: "2022", body: "A campaign celebrating heritage, taste and modern hospitality." },
  { slug: "trysa-intelligence", title: "TRYSA Intelligence", tag: "Product · AI", year: "2026", body: "AI copilots for creative operations — from booking to delivery." },
];

export const CONTACT_CATEGORIES = [
  { key: "speaking", label: "Speaking", prefill: "Hi Yomi — I'd love to invite you to speak at " },
  { key: "consulting", label: "Consulting", prefill: "Hi Yomi — I'm looking for consulting support around " },
  { key: "creative-direction", label: "Creative Direction", prefill: "Hi Yomi — we'd love your creative direction on " },
  { key: "partnerships", label: "Partnerships", prefill: "Hi Yomi — I have a partnership idea I'd love to explore: " },
  { key: "media", label: "Media", prefill: "Hi Yomi — I'm reaching out from [publication] and would love to feature you on " },
  { key: "technology", label: "Technology", prefill: "Hi Yomi — I'd love to talk about TRYSA / technology around " },
  { key: "photography", label: "Photography", prefill: "Hi Yomi — I'd love to book Yomi Visuals for " },
] as const;

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

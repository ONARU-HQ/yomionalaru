export const SITE_URL = "https://yomionalaru.lovable.app";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Founder" },
  { to: "/companies", label: "Ecosystem" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/blog", label: "Blog" },
  { to: "/media", label: "Media" },
  { to: "/contact", label: "Contact" },
] as const;

export const ONARU = {
  name: "ONARU",
  tagline: "A company builder.",
  summary:
    "ONARU exists to build, acquire and scale companies that solve meaningful problems.",
  mission:
    "Build enduring companies that improve how people create, work, learn and live.",
  vision: "To become one of Africa's most respected company builders.",
  identity: "We build systems that outlive us.",
  voice: ["Confident", "Clear", "Thoughtful", "Purpose-driven", "Premium"],
  tone: ["Simple", "Honest", "Visionary", "Human"],
};

export const POSITIONING = [
  "Founder",
  "Creative Director",
  "Systems Thinker",
  "Entrepreneur",
  "Builder",
  "Christian",
  "Problem Solver",
  "Business Architect",
];

export const INTERSECTIONS = [
  "Business",
  "Creativity",
  "Technology",
  "Education",
  "Community",
  "Storytelling",
];

export type CompanyStatus =
  | "Live"
  | "Coming Soon"
  | "In Development"
  | "Building"
  | "R&D"
  | "Launching";

export type Company = {
  slug: string;
  name: string;
  category: string;
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
  mission: string;
  vision: string;
  identity: string;
  voice: string[];
  tone: string[];
  problem: string;
  services?: string[];
  products?: string[];
  future?: string[];
  progress?: number;
  cta: string;
  roadmap?: { phase: string; body: string; done?: boolean }[];
};

export const COMPANIES: Company[] = [
  {
    slug: "trysa",
    name: "TRYSA",
    category: "Business Operating System",
    tagline: "Build once. Operate forever.",
    description:
      "An AI-powered business operating system that unifies CRM, invoicing, contracts, bookings, finance, galleries and automation into one workspace for creators and businesses.",
    industry: "Software · AI · Business Infrastructure",
    website: "https://www.trysa.app",
    instagram: "https://instagram.com/trysa.app",
    tiktok: "https://tiktok.com/@trysa.app",
    x: "https://x.com/trysa_app",
    status: "Building",
    launchYear: 2026,
    accent: "from-amber-200/30 via-yellow-500/10 to-transparent",
    mission:
      "Help creators and businesses spend less time managing work and more time building meaningful companies.",
    vision: "Become Africa's operating system for creative businesses.",
    identity: "Build once. Operate forever.",
    voice: ["Intelligent", "Professional", "Helpful"],
    tone: ["Clean", "Modern", "Reliable"],
    problem:
      "Creative businesses waste time and money stitching together disconnected tools. TRYSA unifies operations into one platform.",
    products: [
      "TRYSA OS",
      "CRM",
      "Invoices",
      "Quotes",
      "Contracts",
      "Finance",
      "Bookings",
      "Calendar",
      "Gallery",
      "AI Workspace",
      "Reports",
      "Automation",
    ],
    future: [
      "Payroll",
      "Inventory",
      "Asset Management",
      "AI Assistant",
      "Client Portal",
      "API",
    ],
    progress: 72,
    cta: "Join the waitlist",
    roadmap: [
      { phase: "Private Alpha", body: "Studios running live workflows on the OS.", done: true },
      { phase: "Public Beta", body: "Open access with billing, CRM, bookings and galleries.", done: true },
      { phase: "TRYSA Intelligence", body: "AI copilots across the operating system." },
      { phase: "Platform", body: "Client portal, API and an ecosystem of integrations." },
    ],
  },
  {
    slug: "yomi-visuals",
    name: "Yomi Visuals",
    category: "Creative Studio",
    tagline: "Stories worth remembering.",
    description:
      "A creative studio producing photography, commercial campaigns and creative direction that help brands earn trust.",
    industry: "Photography · Film · Creative Direction",
    website: "https://www.yomivisuals.com",
    instagram: "https://instagram.com/yomi.visuals",
    tiktok: "https://tiktok.com/@yomi.visuals",
    status: "Live",
    launchYear: 2018,
    accent: "from-rose-300/25 via-amber-200/10 to-transparent",
    mission: "Create imagery that helps brands earn trust.",
    vision: "Become one of Africa's leading visual storytelling studios.",
    identity: "Stories worth remembering.",
    voice: ["Creative", "Elegant", "Professional"],
    tone: ["Premium", "Minimal"],
    problem:
      "Brands lose trust with forgettable imagery. Yomi Visuals builds visual language that makes a brand credible before a word is read.",
    services: [
      "Photography",
      "Commercial Campaigns",
      "Corporate",
      "Portraits",
      "Fashion",
      "Events",
      "Creative Direction",
    ],
    products: ["Prints", "Presets", "Educational Resources"],
    progress: 100,
    cta: "Start a project",
    roadmap: [
      { phase: "Studio", body: "Photography and direction from Lagos.", done: true },
      { phase: "Commercial", body: "Campaign work for brands across sectors.", done: true },
      { phase: "Products", body: "Prints, presets and educational resources." },
    ],
  },
  {
    slug: "yv-studios",
    name: "YV Studios",
    category: "Creative Spaces",
    tagline: "Where creativity comes alive.",
    description:
      "World-class creative spaces — studios, podcast rooms, meeting rooms and production space where creators can produce exceptional work.",
    industry: "Spaces · Production · Hospitality",
    status: "Building",
    launchYear: 2026,
    accent: "from-emerald-200/20 via-amber-200/10 to-transparent",
    mission:
      "Provide world-class creative spaces where creators can produce exceptional work.",
    vision: "Become the most trusted network of creative studios in Africa.",
    identity: "Where creativity comes alive.",
    voice: ["Warm", "Creative"],
    tone: ["Modern"],
    problem:
      "Great work needs great rooms. Most creators are stuck with spaces that cost too much and deliver too little.",
    services: [
      "Studio Rental",
      "Podcast Space",
      "Meeting Rooms",
      "Production Space",
      "Content House",
    ],
    products: ["Memberships", "Subscriptions", "Equipment Rental"],
    progress: 55,
    cta: "Book a space",
    roadmap: [
      { phase: "Studio 01", body: "First creative space live in Lagos.", done: true },
      { phase: "Memberships", body: "Subscription access for resident creators." },
      { phase: "Network", body: "Multi-city network of trusted studios." },
    ],
  },
  {
    slug: "trysa-academy",
    name: "TRYSA Academy",
    category: "Education",
    tagline: "Knowledge into systems.",
    description:
      "Education for creators who want to build sustainable businesses — courses, workshops, mentorship, templates and playbooks.",
    industry: "Education · Training · Community",
    status: "In Development",
    launchYear: 2026,
    accent: "from-sky-300/20 via-amber-200/10 to-transparent",
    mission: "Teach creators how to build sustainable businesses.",
    vision: "Raise the next generation of African founders.",
    identity: "Knowledge into systems.",
    voice: ["Educational"],
    tone: ["Encouraging"],
    problem:
      "Creators are taught craft, never business. The Academy turns hard-won knowledge into systems people can actually run.",
    products: [
      "Courses",
      "Workshops",
      "Mentorship",
      "Templates",
      "Business Playbooks",
      "AI Training",
    ],
    progress: 40,
    cta: "Join the first cohort",
    roadmap: [
      { phase: "Curriculum", body: "Frameworks written from live operating experience.", done: true },
      { phase: "Cohort 01", body: "First guided cohort of founders." },
      { phase: "Platform", body: "Always-on courses, templates and AI training." },
    ],
  },
  {
    slug: "yomi-unscripted",
    name: "Yomi Unscripted",
    category: "Media",
    tagline: "Build in public.",
    description:
      "An entrepreneurial media platform documenting the honest work of building businesses — YouTube, podcast, newsletter, documentaries and founder stories.",
    industry: "Media · Publishing · Storytelling",
    status: "Launching",
    launchYear: 2026,
    accent: "from-violet-400/25 via-fuchsia-400/10 to-transparent",
    mission: "Document the journey of building businesses honestly.",
    vision:
      "Become one of Africa's most authentic entrepreneurial media platforms.",
    identity: "Build in public.",
    voice: ["Thoughtful", "Honest", "Curious"],
    tone: ["Human", "Reflective"],
    problem:
      "Most founder media sells a highlight reel. Unscripted documents the real numbers, decisions and failures.",
    products: [
      "YouTube",
      "Podcast",
      "Newsletter",
      "Documentaries",
      "Founder Stories",
    ],
    progress: 48,
    cta: "Subscribe",
    roadmap: [
      { phase: "Format", body: "Editorial direction and first episodes.", done: true },
      { phase: "Season 01", body: "Weekly episodes and founder interviews." },
      { phase: "Documentary", body: "Long-form films on building from Africa." },
    ],
  },
  {
    slug: "onaru-ventures",
    name: "ONARU Ventures",
    category: "Company Builder",
    tagline: "Ideas become institutions.",
    description:
      "The company-building arm of ONARU — launching, investing in and scaling businesses that solve meaningful problems.",
    industry: "Venture Building · Investment",
    status: "Building",
    launchYear: 2026,
    accent: "from-yellow-300/25 via-orange-400/10 to-transparent",
    mission:
      "Launch, invest in and scale businesses that solve meaningful problems.",
    vision: "A portfolio of companies creating global impact from Africa.",
    identity: "Ideas become institutions.",
    voice: ["Bold", "Calm", "Strategic"],
    tone: ["Considered", "Direct"],
    problem:
      "Good ideas die without operating support. Ventures supplies capital, systems and operators.",
    products: [
      "Company Building",
      "Investments",
      "Incubation",
      "Partnerships",
      "Acquisitions",
    ],
    progress: 30,
    cta: "Pitch us",
    roadmap: [
      { phase: "Thesis", body: "Focus areas and operating model defined.", done: true },
      { phase: "First Builds", body: "Companies launched inside the studio." },
      { phase: "Portfolio", body: "Investments, partnerships and acquisitions." },
    ],
  },
];

// What I'm Building — living homepage cards
export const BUILDING = COMPANIES.map((c) => ({
  slug: c.slug,
  name: c.name,
  label: c.status,
  progress: c.progress ?? 50,
  note: c.identity,
})).slice(0, 6);

// Ecosystem tree — for the orbit visual
export const ECOSYSTEM: {
  name: string;
  slug?: string;
  children?: { name: string; slug?: string }[];
}[] = [
  { name: "TRYSA", slug: "trysa", children: [{ name: "TRYSA Academy", slug: "trysa-academy" }] },
  { name: "Yomi Visuals", slug: "yomi-visuals", children: [{ name: "YV Studios", slug: "yv-studios" }] },
  { name: "Yomi Unscripted", slug: "yomi-unscripted" },
  { name: "ONARU Ventures", slug: "onaru-ventures" },
];

export const FUTURE_VENTURES = [
  { name: "TRYSA Intelligence", note: "Applied AI for business operations." },
  { name: "TRYSA Capital", note: "Funding the next creative economy." },
  { name: "ONARU Foundation", note: "Investing in overlooked talent." },
  { name: "YV Properties", note: "Design-first real estate." },
  { name: "YV Shortlets", note: "Luxury short-let hospitality." },
];

export const TIMELINE = [
  { year: "2015", title: "Picked up a camera", body: "The craft came first — and taught me how to see." },
  { year: "2018", title: "Founded Yomi Visuals", body: "Turned a skill into a studio with standards." },
  { year: "2023", title: "Built the systems", body: "Stopped selling hours. Started documenting how the work gets done." },
  { year: "2025", title: "Opened creative spaces", body: "YV Studios — rooms built for people who make things." },
  { year: "2026", title: "TRYSA · Academy · Unscripted", body: "Software, education and media ship in one year." },
  { year: "Current", title: "ONARU", body: "A holding company to build, acquire and scale what comes next." },
  { year: "Future", title: "Institutions", body: "Companies that can run — and grow — without me." },
];

export const PRINCIPLES = [
  { title: "Systems over heroics", body: "If it only works when I'm in the room, it isn't a business yet." },
  { title: "Solve real problems", body: "Ideas are cheap. Problems people pay to remove are not." },
  { title: "Build in public", body: "Honest documentation compounds faster than marketing." },
  { title: "Excellence is a habit", body: "Standards are set in the small, unwitnessed decisions." },
  { title: "Stewardship", body: "What I run is not mine to waste — people, money, or time." },
  { title: "Long-term greedy", body: "Choose the option that still looks smart in ten years." },
];

export const FAILURES = [
  { title: "I was the bottleneck", body: "For years every decision routed through me. Growth stopped exactly where my calendar ended." },
  { title: "I hired for relief, not for role", body: "Hiring in panic produced people with no clear scorecard — and I blamed them for my lack of clarity." },
  { title: "I priced from fear", body: "I undercharged for work that was already premium, then resented the clients I had trained to expect it." },
  { title: "I confused motion with progress", body: "Busy quarters that moved no meaningful number. Now I pick one number per quarter." },
];

export const LESSONS = [
  "Document before you delegate.",
  "A process nobody can read is a rumour.",
  "Cash flow is a strategy, not an accident.",
  "Culture is what you tolerate on a bad week.",
  "Say no early; it's kinder than a late yes.",
  "The best operators are boringly consistent.",
];

export const BOOKS = [
  { title: "Good to Great", author: "Jim Collins" },
  { title: "The E-Myth Revisited", author: "Michael E. Gerber" },
  { title: "Built to Last", author: "Collins & Porras" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson" },
  { title: "Zero to One", author: "Peter Thiel" },
  { title: "Traction", author: "Gino Wickman" },
  { title: "Shoe Dog", author: "Phil Knight" },
  { title: "The Bible", author: "—" },
];

export const STATS = [
  { label: "Companies Building", value: 6, suffix: "" },
  { label: "Products Shipping", value: 4, suffix: "" },
  { label: "Creative Projects", value: 480, suffix: "+" },
  { label: "Businesses Supported", value: 120, suffix: "+" },
  { label: "Cities Worked In", value: 14, suffix: "" },
  { label: "Years Building", value: 11, suffix: "" },
];

export const WORLD_MARKERS = [
  { name: "Lagos", x: 51.5, y: 58, live: true },
  { name: "Accra", x: 49.2, y: 57, live: true },
  { name: "London", x: 48.8, y: 34, live: false },
  { name: "New York", x: 27.5, y: 40, live: false },
  { name: "Dubai", x: 62, y: 48, live: false },
];

export const CURRENT_FOCUS = [
  { title: "TRYSA", body: "Shipping the operating system for creative businesses." },
  { title: "Business Architecture", body: "Designing companies that run on systems, not people." },
  { title: "Education", body: "Turning frameworks into training founders can apply." },
  { title: "Media", body: "Documenting the build honestly through Yomi Unscripted." },
  { title: "AI & Automation", body: "Making intelligent workflows the default." },
  { title: "Company Building", body: "ONARU Ventures — launching what's next." },
];

export const TECH_STACK = [
  "React", "TypeScript", "Supabase", "Tailwind CSS",
  "OpenAI", "Cloudflare", "Stripe", "Automation", "AI",
];

export const MENTORSHIP = [
  {
    slug: "founder-mentorship",
    title: "Founder Mentorship",
    summary: "One-to-one work on the company you're actually building — strategy, structure and the next hard decision.",
    forWho: [
      "Founders past the first revenue but stuck under their own weight",
      "Creative owners moving from freelancer to company",
      "Operators inheriting a business that needs redesigning",
    ],
    covered: [
      "Business model and positioning",
      "Operating cadence and scorecards",
      "Org design and first key hires",
      "Pricing, margin and cash flow",
      "Personal leadership and decision quality",
    ],
    outcomes: [
      "A written operating model for your company",
      "A 90-day plan with one number that matters",
      "Clear delegation map and hiring priority",
    ],
  },
  {
    slug: "creative-business-strategy",
    title: "Creative Business Strategy",
    summary: "Positioning, pricing and packaging for studios and creative brands that want premium clients.",
    forWho: ["Studios", "Agencies", "Photographers and directors", "Creative service businesses"],
    covered: ["Positioning and niche", "Offer architecture", "Premium pricing", "Client experience design", "Pipeline and referrals"],
    outcomes: ["A defensible position", "A pricing model you can defend", "A repeatable client journey"],
  },
  {
    slug: "systems-thinking",
    title: "Systems Thinking",
    summary: "Learn to see your business as a set of connected systems — and fix causes instead of symptoms.",
    forWho: ["Founders", "Operators", "Team leads"],
    covered: ["Mapping the business", "Constraint analysis", "Feedback loops", "Documentation standards", "Automation candidates"],
    outcomes: ["A full system map", "A ranked list of constraints", "A documentation habit that sticks"],
  },
  {
    slug: "business-architecture",
    title: "Business Architecture",
    summary: "Design the structure — entities, teams, functions and workflows — before you scale the chaos.",
    forWho: ["Multi-brand founders", "Groups and holdings", "Founders preparing to scale"],
    covered: ["Entity and brand structure", "Function design", "Workflow architecture", "Data and reporting", "Governance"],
    outcomes: ["An architecture document", "Clear ownership per function", "A reporting rhythm"],
  },
  {
    slug: "scaling-creative-businesses",
    title: "Scaling Creative Businesses",
    summary: "Move from founder-led delivery to a team that can deliver at your standard, repeatedly.",
    forWho: ["Studios at capacity", "Founder-dependent businesses", "Teams of 2–20"],
    covered: ["Capacity modelling", "Standards and QA", "Training systems", "Delegation ladders", "Growth channels"],
    outcomes: ["Delivery without you", "Documented standards", "A hiring and training path"],
  },
  {
    slug: "ai-implementation",
    title: "AI Implementation",
    summary: "Practical AI inside a real business — where it saves hours and where it quietly costs you trust.",
    forWho: ["Operators", "Creative teams", "Founders exploring automation"],
    covered: ["Workflow audit", "Tool selection", "Prompt and process design", "Quality control", "Risk and data hygiene"],
    outcomes: ["3–5 automated workflows", "A team AI standard", "Measured hours saved"],
  },
  {
    slug: "operations",
    title: "Operations",
    summary: "The unglamorous engine: cadence, checklists, handoffs and the reporting that keeps a company honest.",
    forWho: ["Ops leads", "Founders without an ops function", "Growing teams"],
    covered: ["Operating cadence", "SOP writing", "Handoff design", "Tooling stack", "Metrics and dashboards"],
    outcomes: ["A weekly operating rhythm", "A living SOP library", "One dashboard everyone reads"],
  },
  {
    slug: "decision-making",
    title: "Decision Making",
    summary: "Better decisions, made faster, with less regret — frameworks for the choices that actually compound.",
    forWho: ["Founders", "Executives", "Anyone stuck between two good options"],
    covered: ["Reversible vs irreversible", "Second-order effects", "Decision journals", "Bias checks", "Speed vs certainty"],
    outcomes: ["A personal decision framework", "A decision journal habit", "Fewer re-litigated choices"],
  },
  {
    slug: "leadership",
    title: "Leadership",
    summary: "Leading people with clarity, integrity and standards — the kind of leadership people stay for.",
    forWho: ["First-time leaders", "Founders becoming managers", "Senior operators"],
    covered: ["Clarity and expectations", "Feedback", "Culture design", "Accountability", "Stewardship and faith at work"],
    outcomes: ["A leadership operating manual", "A feedback cadence", "A culture you can name"],
  },
] as const;

export const MENTORSHIP_FAQ = [
  { q: "How are sessions run?", a: "Video calls, scheduled in advance, with written notes and actions after each session. Most engagements run six to twelve weeks." },
  { q: "Who is this not for?", a: "People looking for a done-for-you service, or for a shortcut that skips the work of documenting and delegating." },
  { q: "What does it cost?", a: "Pricing depends on scope and length of engagement. Apply and you'll get a clear proposal, not a sales sequence." },
  { q: "How do I apply?", a: "Send a short note about your business, where you're stuck and what you want to be true in 90 days." },
];

export const TESTIMONIALS = [
  { quote: "Yomi speaks like a founder who has actually built the thing. Rare, and refreshing.", who: "Programme Director" },
  { quote: "He shifted the way our team thinks about creative business. Weeks later, we're still quoting him.", who: "Head of Studio, Lagos" },
  { quote: "One of the most compelling voices on the future of the creative economy.", who: "Editor" },
];

export const SPEAKING_TOPICS = [
  { title: "Company Building", body: "How to build a business that can live without you." },
  { title: "Systems Thinking", body: "Designing operations that scale quietly." },
  { title: "AI for Business", body: "Practical AI inside real operating companies." },
  { title: "Creative Entrepreneurship", body: "Turning craft into a company." },
  { title: "Leadership & Faith", body: "Integrity, stewardship and the long game." },
  { title: "Building Product", body: "Lessons from shipping TRYSA." },
];

export const SPEAKING_EVENTS = [
  { name: "Creative Mindset Shift", venue: "Lagos", year: "2025", note: "Flagship talk on rethinking the creative business." },
  { name: "Design Africa Summit", venue: "Accra", year: "2024", note: "Keynote on design-led entrepreneurship." },
  { name: "The Flip Live", venue: "Lagos", year: "2024", note: "Panel on AI and the creative economy." },
  { name: "GITEX Creative Stage", venue: "Dubai", year: "2025", note: "On building African business infrastructure." },
];

export const MEDIA_ITEMS = [
  { title: "Yomi Unscripted", type: "YouTube", body: "Documenting the honest work of building companies." },
  { title: "The Unscripted Podcast", type: "Podcast", body: "Founders, operators and the decisions behind the numbers." },
  { title: "The Newsletter", type: "Newsletter", body: "Systems, leadership and lessons, written weekly." },
  { title: "Founder Stories", type: "Series", body: "Short documentaries on people building from Africa." },
  { title: "Design Africa Talk", type: "Keynote", body: "The future of design-led entrepreneurship." },
  { title: "TechCabal Feature", type: "Article", body: "Building an operating system for African creatives." },
];

export const BREAKING_BOUNDARIES = {
  featured: {
    youtubeId: "dQw4w9WgXcQ",
    title: "Episode 01 — Why I Stopped Thinking Like A Photographer",
    summary: "The opening chapter of Yomi Unscripted. On identity, systems and building companies instead of jobs.",
  },
  episodes: [
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 02 — The Bottleneck Is You", summary: "Founder dependence and how to design your way out." },
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 03 — Systems Over Hustle", summary: "The operating system every business wishes it had." },
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 04 — Lagos to the World", summary: "Building global-grade infrastructure from Africa." },
    { youtubeId: "dQw4w9WgXcQ", title: "Ep. 05 — Faith and Business", summary: "Stewardship, integrity and the long game." },
  ],
};

export const PROJECTS = [
  { slug: "trysa-launch", title: "TRYSA — Launch Campaign", tag: "Product · Brand", year: "2024", body: "Positioning, brand system and launch story for the business OS." },
  { slug: "yv-studios", title: "YV Studios — Space Design", tag: "Spaces · Direction", year: "2025", body: "Designing rooms built for people who make things." },
  { slug: "atelier-editorial", title: "Atelier — Editorial Film", tag: "Film · Direction", year: "2023", body: "A short film exploring craft, patience and the making of things." },
  { slug: "lagos-nocturne", title: "Lagos Nocturne", tag: "Photography", year: "2023", body: "A photo essay on the quiet luxury of the city after dark." },
  { slug: "unscripted-series", title: "Yomi Unscripted — Series One", tag: "Media · Story", year: "2026", body: "An honest documentary series on building companies." },
  { slug: "trysa-intelligence", title: "TRYSA Intelligence", tag: "Product · AI", year: "2026", body: "AI copilots for business operations — from booking to delivery." },
];

export const CONTACT_CATEGORIES = [
  { key: "mentorship", label: "Mentorship", prefill: "Hi Yomi — I'd like to apply for mentorship around " },
  { key: "speaking", label: "Speaking", prefill: "Hi Yomi — I'd love to invite you to speak at " },
  { key: "consulting", label: "Consulting", prefill: "Hi Yomi — I'm looking for consulting support around " },
  { key: "partnerships", label: "Partnerships", prefill: "Hi Yomi — I have a partnership idea I'd love to explore: " },
  { key: "ventures", label: "Ventures", prefill: "Hi Yomi — I'd love to share a company/idea with ONARU Ventures: " },
  { key: "media", label: "Media", prefill: "Hi Yomi — I'm reaching out from [publication] and would love to feature you on " },
  { key: "creative", label: "Creative Work", prefill: "Hi Yomi — I'd love to book Yomi Visuals for " },
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
    { label: "TRYSA — Instagram", handle: "@trysa.app", href: "https://instagram.com/trysa.app" },
    { label: "TRYSA — TikTok", handle: "@trysa.app", href: "https://tiktok.com/@trysa.app" },
    { label: "TRYSA — X", handle: "@trysa_app", href: "https://x.com/trysa_app" },
  ],
};

export const CONTACT = {
  email: "yomionalaru@gmail.com",
  location: "Lagos · Worldwide",
};

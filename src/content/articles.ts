export type ArticleSection = {
  h2: string;
  body: string[];
  list?: string[];
  h3?: { title: string; body: string[] }[];
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  iso: string;
  readMins: number;
  excerpt: string;
  description: string;
  keywords: string[];
  lede: string[];
  sections: ArticleSection[];
  faqs: { q: string; a: string }[];
  related: string[];
  cta: { title: string; body: string; label: string; to: string };
};

export const CATEGORIES = [
  "Business",
  "Systems",
  "Leadership",
  "Faith",
  "Creativity",
  "AI",
  "Startups",
  "Operations",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "why-most-creative-businesses-never-scale",
    title: "Why Most Creative Businesses Never Scale",
    category: "Systems",
    date: "July 2026",
    iso: "2026-07-08",
    readMins: 12,
    excerpt:
      "Founder dependence, missing systems, no documentation, no delegation. The four bottlenecks that keep talented creative businesses small — and the framework that removes them.",
    description:
      "Why creative businesses stay small: founder dependence, missing systems, no documentation and no delegation — plus a practical framework to fix all four.",
    keywords: [
      "scaling creative business",
      "founder dependence",
      "business systems",
      "delegation",
      "documentation",
    ],
    lede: [
      "I have sat in rooms with photographers billing more per day than most consultants, designers with waiting lists, studios with the kind of client list agencies pitch for. Almost none of them were scaling. Revenue moved a little each year, but the business underneath it did not change shape.",
      "It was never talent. Talent was the one thing every single one of them had. What they were missing was structure — and structure is learnable.",
      "This is the diagnosis I now run on every creative business I look at, including my own.",
    ],
    sections: [
      {
        h2: "The four bottlenecks",
        body: [
          "Nearly every stuck creative business is stuck for the same four reasons, and they arrive in this order: founder dependence, no systems, no documentation, no delegation. They compound. Each one makes the next harder to fix.",
          "You cannot skip to the end. You cannot hire your way out of a business you have never described in writing. You cannot delegate a process that only exists in your head on a good day.",
        ],
        list: [
          "Founder dependence — the business stops when you stop",
          "No systems — every project is improvised from scratch",
          "No documentation — the knowledge lives in one head",
          "No delegation — nobody else is allowed to be responsible",
        ],
      },
      {
        h2: "Bottleneck one: founder dependence",
        body: [
          "The clearest test I know: take fourteen consecutive days off, tell nobody in advance, and see what happens. Not a holiday where you answer messages by the pool. A real absence. Most creative businesses fail this test in about seventy-two hours.",
          "Founder dependence is seductive because it feels like excellence. You are the best shooter, the best editor, the best on client calls, the fastest at quoting. Being the best at everything is exactly what caps the business at the size of your calendar.",
          "The maths is unforgiving. If every unit of revenue requires a unit of your attention, your revenue ceiling is your attention ceiling. You can raise prices — and you should — but eventually you are selling the same finite thing at a higher rate. That is a very good job. It is not a company.",
          "The shift is not from doing to managing. It is from doing to designing. Your job becomes designing the thing that produces the work, and then improving that thing.",
        ],
        h3: [
          {
            title: "How to test your dependence honestly",
            body: [
              "List every decision you made in the last week. Beside each, write who else could have made it with the information available. If more than half say 'only me', you do not have a team problem. You have a clarity problem.",
            ],
          },
          {
            title: "The first thing to hand over",
            body: [
              "Not creative direction. Start with the recurring, low-judgement, high-frequency work: scheduling, invoicing, file delivery, first-draft responses. These are the tasks that eat the hours you would otherwise spend designing the business.",
            ],
          },
        ],
      },
      {
        h2: "Bottleneck two: no systems",
        body: [
          "A system is simply a repeatable way of producing a specific result. Not software. Not a Notion board. A defined sequence with an owner, inputs, outputs, and a standard.",
          "Most creative businesses have between five and nine core systems, and they are usually the same ones: how leads arrive, how they are qualified, how work is quoted, how it is contracted, how it is produced, how it is reviewed, how it is delivered, how it is invoiced, how it is followed up.",
          "Write those nine down. For each one, answer three questions: what triggers it, what has to be true for it to be finished, and who owns it. Most people cannot answer question three for more than half the list. That is the whole problem, visible on one page.",
          "Systems do not remove creativity. They protect it. The purpose of systematising the boring ninety percent is to buy back the attention that the creative ten percent actually deserves.",
        ],
      },
      {
        h2: "Bottleneck three: no documentation",
        body: [
          "Documentation is where most founders quietly give up, because it feels slow and unglamorous and produces nothing you can post. It is also the single highest-leverage hour in the week.",
          "The rule I use: document before you delegate. If you hand over a task without a written standard, you have not delegated — you have gambled. And when the output comes back wrong, you will blame the person instead of the missing instruction.",
          "Documentation does not need to be beautiful. A one-page checklist that a competent person can follow beats a forty-page handbook nobody opens. Record yourself doing the task once, transcribe it, cut it to steps. Twenty minutes.",
          "The compounding effect is real. Every documented process is a permanent reduction in future explaining. It is the closest thing a small business has to an asset that appreciates.",
        ],
        list: [
          "One page per process, maximum",
          "Written as steps, not prose",
          "Include the standard: what 'done well' looks like",
          "Include the common failure and how to catch it",
          "Owned and dated — a document with no owner rots",
        ],
      },
      {
        h2: "Bottleneck four: no delegation",
        body: [
          "Delegation fails for a predictable reason: founders delegate tasks but keep the outcome. The person is asked to do the thing but never allowed to own whether the thing worked. So they check with you. Constantly. And you conclude that delegation does not work.",
          "Real delegation transfers three things at once: the task, the standard, and the decision rights inside a boundary. 'You own client scheduling. The standard is every client hears back within four hours. Anything that changes the shoot date by more than a week comes to me.' Now there is a job, not a chore.",
          "Expect the first eight weeks to be worse than doing it yourself. That is not evidence of failure, it is the cost of the transfer. Founders who bail in week three pay the cost and never collect the return.",
        ],
      },
      {
        h2: "The actionable framework",
        body: [
          "Here is the sequence I run, and the one I teach in mentorship. It takes about ninety days if you are honest and do not skip steps.",
        ],
        list: [
          "Week 1 — Map. Write down the nine core systems and who owns each. No fixing yet, just truth.",
          "Week 2 — Find the constraint. Which single system, if it ran without you, would free the most hours? That one first.",
          "Weeks 3–4 — Document that system to one page, with standards and failure modes.",
          "Weeks 5–8 — Hand it over. Owner named, boundary set, weekly review. Resist taking it back.",
          "Weeks 9–10 — Instrument it. One number that tells you it is healthy without asking anyone.",
          "Weeks 11–12 — Repeat on the next constraint. Then keep repeating, forever.",
        ],
      },
      {
        h2: "What changes when it works",
        body: [
          "The first sign is not more revenue. It is quieter days. Fewer messages that only you can answer. A week where the work shipped and you were not the reason.",
          "Then the second-order effects arrive: you can take on a project without checking whether you personally have capacity, you can price on value instead of availability, you can build a second thing — a product, a space, a company — because the first one no longer consumes every hour you have.",
          "That is the whole game. Not working less because you care less. Working on the business because the business finally lets you.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I scale a creative business without losing quality?",
        a: "Write the standard down before anyone else touches the work. Quality drops when standards are implicit; documented standards plus a review step keep output consistent while removing you from production.",
      },
      {
        q: "When should a creative business make its first hire?",
        a: "When you have documented at least one full system and can hand over both the task and the decisions inside it. Hiring before documentation almost always produces an expensive assistant and a frustrated founder.",
      },
      {
        q: "What is founder dependence?",
        a: "A business state where revenue, decisions and delivery all require the founder's personal involvement, capping growth at the founder's available time and energy.",
      },
    ],
    related: ["build-companies-that-can-live-without-you", "why-every-creator-needs-an-operating-system"],
    cta: {
      title: "Work through this with me",
      body: "Founder mentorship is exactly this framework, applied to your business, with someone holding you to it.",
      label: "Explore mentorship",
      to: "/mentorship",
    },
  },
  {
    slug: "the-business-changed-when-i-stopped-thinking-like-a-photographer",
    title: "The Business Changed When I Stopped Thinking Like A Photographer",
    category: "Business",
    date: "June 2026",
    iso: "2026-06-17",
    readMins: 11,
    excerpt:
      "An identity shift is a business strategy. What happened when I stopped selling my skill and started building companies, systems and assets.",
    description:
      "How an identity shift — from photographer to company builder — changed the business: systems, assets and long-term thinking over selling a skill.",
    keywords: ["founder identity", "company building", "creative entrepreneur", "business assets", "long-term thinking"],
    lede: [
      "For years, if you asked what I did, I said: I am a photographer. It was true, and it was also the ceiling.",
      "Every decision flowed from that sentence. What I charged, what I built, who I hired, what I said yes to. The identity was running the business long before any strategy was.",
      "The day the sentence changed, everything downstream of it changed too.",
    ],
    sections: [
      {
        h2: "Identity is upstream of strategy",
        body: [
          "A photographer optimises for the next shoot. A company builder optimises for the next system. Both are legitimate. They produce entirely different businesses.",
          "When I thought of myself as a photographer, growth meant better gear, better clients, higher day rates. All real improvements. None of them structural. I was climbing a ladder that ended somewhere I could see.",
          "The shift was uncomfortable because it felt like betraying the craft. It was not. The craft got better once it stopped being the only thing carrying the business.",
        ],
      },
      {
        h2: "What a skill business actually is",
        body: [
          "A skill business converts your time into money at the best rate you can negotiate. It has beautiful properties: low startup cost, fast feedback, direct relationship between excellence and income.",
          "It also has one fatal property. It does not accumulate. Stop working, and it stops paying. Nothing you built last year works for you this year, except reputation — and reputation without structure is just a heavier workload.",
          "I did not want to abandon the skill business. I wanted to put it inside something that accumulates.",
        ],
      },
      {
        h2: "The move to systems",
        body: [
          "The first real change was writing down how we worked. Not to impress anyone — to stop re-deciding the same things every week.",
          "Once the process was on paper, two things happened almost immediately. Delivery got more consistent, because consistency is what a written standard produces. And I discovered how much of my week was spent on work that required judgement I had already made a hundred times before.",
          "Systems turned invisible expertise into visible instructions. That is the moment a business becomes transferable.",
        ],
        h3: [
          {
            title: "The three-list exercise",
            body: [
              "List everything you did last month. Split it into three: only-me work, could-be-taught work, should-never-have-been-me work. The third list is your first hire. The second list is your documentation backlog. The first list is your actual job — and it should be small.",
            ],
          },
        ],
      },
      {
        h2: "Building assets instead of hours",
        body: [
          "An asset is anything that produces value when you are not touching it. A documented process is an asset. A trained team member is an asset. A product is an asset. A studio space that earns while you sleep is an asset. An audience that trusts you is an asset.",
          "Once I started scoring decisions by 'does this create an asset', the portfolio changed shape fast. Yomi Visuals stayed, and became stronger. YV Studios exists because a room can earn without me in it. TRYSA exists because software serves a thousand businesses at once. TRYSA Academy exists because a lesson taught once can be learned forever.",
          "None of that was possible while I thought of myself as the product.",
        ],
        list: [
          "Hours: paid once, gone forever",
          "Processes: written once, used weekly",
          "People: trained once, productive for years",
          "Products: built once, sold repeatedly",
          "Companies: designed once, compounding indefinitely",
        ],
      },
      {
        h2: "Long-term thinking, practically",
        body: [
          "Long-term thinking is not a personality trait. It is a filter you apply to specific decisions. Mine is simple: will this still look like a good idea in ten years?",
          "It kills a surprising number of tempting things. Quick campaigns that require me personally. Clients who pay well and cost more. Tools chosen for this quarter that will need replacing next year.",
          "It also protects slow things that look unproductive in the moment. Documentation. Training. Writing. Building a holding company — ONARU — that produces nothing on day one and everything on year ten.",
        ],
      },
      {
        h2: "What I would tell my earlier self",
        body: [
          "You are not abandoning photography by becoming a builder. You are giving it somewhere to live that does not depend on your energy levels.",
          "Write things down sooner. Hire before it hurts. Charge what the outcome is worth. Choose the boring option that compounds.",
          "And change the sentence. What you say you are determines what you will build.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I move from freelancer to founder?",
        a: "Start by documenting how you work, then transfer one full system to someone else. Founder status begins the moment the business can produce value without your hands on every piece.",
      },
      {
        q: "Should creatives stop doing creative work to scale?",
        a: "No. You should stop being the only person who can do it. Keep the work that requires your specific judgement and design systems for everything else.",
      },
    ],
    related: ["why-most-creative-businesses-never-scale", "build-companies-that-can-live-without-you"],
    cta: {
      title: "See what the shift built",
      body: "TRYSA, Yomi Visuals, YV Studios, TRYSA Academy, Yomi Unscripted and ONARU Ventures.",
      label: "Explore the ecosystem",
      to: "/companies",
    },
  },
  {
    slug: "why-every-creator-needs-an-operating-system",
    title: "Why Every Creator Needs An Operating System",
    category: "Operations",
    date: "May 2026",
    iso: "2026-05-21",
    readMins: 12,
    excerpt:
      "Chaos is not a personality. It is a missing operating system. On CRM, finance, automation, client experience — and what changes when the tools stop fighting each other.",
    description:
      "Why creators need a business operating system: ending tool chaos with CRM, finance, automation and a client experience that scales.",
    keywords: ["business operating system", "CRM for creatives", "automation", "client experience", "TRYSA"],
    lede: [
      "Ask a creative business owner where their client information lives and watch the pause. Some in email. Some in a spreadsheet. Some in a chat thread from eight months ago. Some in their head.",
      "That pause is expensive. It is the sound of an operating system that does not exist.",
      "An operating system is not software you buy. It is the layer that decides how work moves through your business — and software either supports it or fragments it further.",
    ],
    sections: [
      {
        h2: "The real cost of chaos",
        body: [
          "Chaos rarely announces itself as a crisis. It shows up as friction: the quote that took three days because you were rebuilding it from scratch, the client who asked twice for the same file, the invoice discovered unpaid two months late, the shoot double-booked because two calendars disagreed.",
          "Individually, small. Collectively, they are the difference between a business that grows and one that survives.",
          "The hidden cost is worse than the visible one. Every hour spent hunting information is an hour not spent on the work that actually earns. And every friction point a client feels is a small withdrawal from their trust.",
        ],
      },
      {
        h2: "What an operating system actually contains",
        body: [
          "Strip away the branding and every functioning business runs the same core loop: attract, qualify, quote, contract, schedule, deliver, invoice, follow up. An operating system is where that loop lives, end to end, with one source of truth.",
        ],
        list: [
          "CRM — every contact, conversation and stage in one place",
          "Quotes and contracts — templated, signed, tracked",
          "Bookings and calendar — one calendar, no double-bookings",
          "Finance — invoices, payments, expenses, and a real view of cash",
          "Delivery — galleries, files, handover, approvals",
          "Automation — the follow-ups and reminders nobody should be typing",
          "Reporting — the few numbers that tell you the truth weekly",
        ],
      },
      {
        h2: "Why disconnected tools fail",
        body: [
          "The typical creative stack is six to twelve tools, none of which speak to each other. Each one is fine. The stack is the problem.",
          "Disconnection creates re-entry: the same client typed into the CRM, the invoice tool, the contract tool, and the gallery. Re-entry creates drift — four slightly different versions of the truth. Drift creates the moment where nobody is quite sure whether the client paid, and the founder has to go and check.",
          "It also makes automation almost impossible. You cannot automate across systems that do not share data. So the follow-ups stay manual, which means they stay inconsistent, which means revenue leaks quietly.",
        ],
      },
      {
        h2: "Client experience is an operations problem",
        body: [
          "Clients do not experience your talent first. They experience your process. How fast you replied. Whether the quote was clear. Whether the contract felt professional. Whether the files arrived where you said they would.",
          "Premium pricing is defended by operational calm far more often than by creative brilliance. Two studios with identical portfolios will not win the same work if one responds in four hours with a clean proposal and the other in four days with an apology.",
          "When the operating system is in place, that experience stops depending on how your week is going.",
        ],
        h3: [
          {
            title: "The four-touch standard",
            body: [
              "Acknowledge within four hours. Proposal within two working days. A written confirmation of every scheduling change. A delivery message that tells them exactly what they have and what happens next. Four touches, all automatable, and most businesses miss at least two.",
            ],
          },
        ],
      },
      {
        h2: "Automation, used properly",
        body: [
          "Automation is not about removing humans. It is about removing the tasks that make humans unreliable — the repetitive, easily-forgotten, low-judgement work that fails at exactly the wrong moment.",
          "Start with anything that has a fixed trigger and a fixed response: booking confirmed, send prep guide. Invoice overdue by seven days, send reminder. Project marked delivered, send feedback request. These are not clever. They are simply never forgotten again.",
          "Layer AI on top only after the process is stable. AI on a broken process produces faster chaos.",
        ],
      },
      {
        h2: "This is why we built TRYSA",
        body: [
          "Everything above is the reason TRYSA exists. I did not set out to build software. I set out to stop losing hours in my own studio, and eventually the workaround became the product.",
          "TRYSA is a business operating system for creators and businesses — CRM, quotes, contracts, invoices, bookings, finance, galleries, reporting and automation in one workspace, with an AI layer that works because it sits on top of connected data rather than scattered files.",
          "You do not need TRYSA to fix your operations. You do need an operating system. Build it in whatever you like — just build it, and stop paying the chaos tax.",
        ],
      },
      {
        h2: "Where to start this week",
        body: [
          "Pick the loop stage that hurts most. For most creative businesses it is quoting or invoicing, because those two touch money directly.",
          "Write the current process as it truly is, not as you wish it were. Delete the steps that exist only from habit. Put the remaining steps in one place with one owner. Automate the two most repetitive touches. Measure one number for four weeks.",
          "Then move to the next stage. Six stages later you have an operating system, and it did not require a rebuild.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a business operating system?",
        a: "A single connected layer where your client, project, finance and delivery workflows live — so information is entered once, work moves predictably, and reporting is accurate without manual assembly.",
      },
      {
        q: "Do small creative businesses need a CRM?",
        a: "Yes, from the first handful of clients. A CRM is not about scale — it is about never losing a conversation, a follow-up or an invoice because it lived in one person's inbox.",
      },
      {
        q: "How does TRYSA differ from using several separate tools?",
        a: "TRYSA connects CRM, quotes, contracts, bookings, finance, galleries and automation on shared data, which removes re-entry, keeps reporting accurate and makes automation and AI genuinely useful.",
      },
    ],
    related: ["why-most-creative-businesses-never-scale", "build-companies-that-can-live-without-you"],
    cta: {
      title: "See the operating system",
      body: "TRYSA unifies operations into one workspace so you can spend the week building, not chasing.",
      label: "Explore TRYSA",
      to: "/companies",
    },
  },
  {
    slug: "faith-built-better-businesses-than-hustle-ever-could",
    title: "Faith Built Better Businesses Than Hustle Ever Could",
    category: "Faith",
    date: "April 2026",
    iso: "2026-04-12",
    readMins: 10,
    excerpt:
      "On purpose, integrity, stewardship and consistency — and why the quiet virtues outperform the loud ones over a decade.",
    description:
      "How faith shapes better business: purpose over ambition, integrity as strategy, stewardship of people and money, and consistency that compounds.",
    keywords: ["faith and business", "integrity", "stewardship", "purpose-driven leadership", "consistency"],
    lede: [
      "Hustle culture sold a story: that outcomes are proportional to intensity. Work harder than everyone and the results follow.",
      "I believed it, and it worked for a while, in the way that sprinting works for a while. Then the bill arrived — in health, in relationships, in decisions I made tired.",
      "What actually built durable businesses for me were four quiet things, and all of them came from faith rather than ambition.",
    ],
    sections: [
      {
        h2: "Purpose gives you something to say no to",
        body: [
          "Ambition tells you to take the opportunity. Purpose asks whether the opportunity belongs to you.",
          "That distinction has saved me more money than any growth tactic. Purpose is a filter, and a filter is what turns a busy career into a coherent body of work.",
          "For me the purpose is specific: build things that help people create, work, learn and live better. It is written down. When something does not fit, the decision takes seconds instead of weeks.",
        ],
      },
      {
        h2: "Integrity is a business strategy",
        body: [
          "People frame honesty as a cost — the deal you lost by telling the truth. In practice it is the cheapest customer acquisition strategy that exists.",
          "The clients who send the best referrals are almost never the ones who got the lowest price. They are the ones who found out, at some difficult moment, that we would absorb a cost rather than hide a mistake.",
          "Integrity also makes a company easier to run. When nobody is managing a story, meetings get shorter and decisions get faster. There is nothing to keep track of.",
        ],
        h3: [
          {
            title: "The uncomfortable email test",
            body: [
              "If you would be embarrassed for the client to read the internal message about them, something in the relationship is already broken. Fix the substance, not the wording.",
            ],
          },
        ],
      },
      {
        h2: "Stewardship changes how you treat money and people",
        body: [
          "Ownership says: this is mine, I can do what I want with it. Stewardship says: this was entrusted to me, and I will be asked how I handled it.",
          "That single reframe altered how I run payroll, how I price, how I speak to a junior on a bad day, and how much cash I keep in reserve. You do not gamble with what has been entrusted to you.",
          "Stewardship of people is the part most founders underrate. Someone's career is passing through your company. What they learn, how they are treated, and who they become in the process is a real output of your business, whether you measure it or not.",
        ],
        list: [
          "Pay people on time, every time, before anything discretionary",
          "Keep reserves — anxiety makes bad leaders",
          "Tell the truth about performance early and kindly",
          "Leave people better than you found them",
        ],
      },
      {
        h2: "Consistency beats intensity",
        body: [
          "Hustle produces spikes. Faith produces rhythm. Over ten years, rhythm wins by an embarrassing margin.",
          "The businesses in the ONARU ecosystem were not built in bursts. They were built by showing up in the same weekly cadence for years — writing, shooting, shipping, reviewing, adjusting.",
          "Consistency also protects quality. Work made in a panic is almost always worse than work made in a rhythm, and clients can feel the difference even when they cannot name it.",
        ],
      },
      {
        h2: "Leadership as service",
        body: [
          "The most useful leadership idea I have ever encountered is that authority exists to serve, not to be enjoyed.",
          "Practically, that means removing obstacles rather than issuing instructions. It means the leader takes the blame publicly and gives the credit publicly. It means the hardest conversation happens quickly, because delaying it protects your comfort at someone else's expense.",
          "Teams can tell within weeks whether leadership is about the leader. Everything about retention follows from what they conclude.",
        ],
      },
      {
        h2: "What this does not mean",
        body: [
          "It does not mean working less hard. I work hard. It means the work sits inside limits — rest, family, worship, health — and those limits improve the output rather than taxing it.",
          "It does not mean avoiding ambition. Building companies is ambitious. It means ambition serves the purpose rather than replacing it.",
          "And it does not mean every outcome goes your way. It means you can lose a deal, a year, or a venture without losing the thing that makes you worth working with.",
        ],
      },
    ],
    faqs: [
      {
        q: "How does faith practically affect business decisions?",
        a: "It provides a written purpose to filter opportunities, a standard of integrity that shortens decisions, and a stewardship mindset that governs how money and people are handled.",
      },
      {
        q: "Is hustle culture bad for founders?",
        a: "Intensity without rhythm produces spikes and burnout. Consistent, bounded work over years outperforms it in both quality and durability.",
      },
    ],
    related: ["build-companies-that-can-live-without-you", "the-business-changed-when-i-stopped-thinking-like-a-photographer"],
    cta: {
      title: "The founder story",
      body: "Philosophy, principles, failures and lessons — the full manifesto.",
      label: "Read the founder page",
      to: "/about",
    },
  },
  {
    slug: "build-companies-that-can-live-without-you",
    title: "Build Companies That Can Live Without You",
    category: "Leadership",
    date: "March 2026",
    iso: "2026-03-09",
    readMins: 12,
    excerpt:
      "Delegation, documentation, processes, hiring, culture and leadership — the six components of a company that keeps running when the founder steps back.",
    description:
      "A practical guide to founder independence: delegation ladders, documentation, process design, hiring, culture and the leadership shift that makes freedom possible.",
    keywords: ["delegation", "documentation", "hiring", "company culture", "founder freedom", "leadership"],
    lede: [
      "The point of building a company is not to create a job you cannot leave.",
      "Yet that is what most founders build, including me for a long time. A business perfectly designed to require its founder, dressed up as commitment.",
      "A company that can live without you is not a company you love less. It is the only version that can outlive you — and the only version worth handing to anyone.",
    ],
    sections: [
      {
        h2: "Start with the exit test",
        body: [
          "Not selling — just absence. If you disappeared for a quarter, what breaks first? Write the list. Most founders can name the first three failures instantly, which means they already know their weakest systems.",
          "That list is your roadmap. Work top down. Every item you remove from it makes the company more valuable, more sellable, and considerably more pleasant to run.",
        ],
      },
      {
        h2: "Delegation is a ladder, not a switch",
        body: [
          "Handing over responsibility in one move fails almost every time. Delegation works as a ladder with four rungs, and you climb it with each person, on each area.",
        ],
        list: [
          "Rung 1 — Do it exactly as documented, report back",
          "Rung 2 — Do it, flag exceptions, propose the answer",
          "Rung 3 — Decide within a boundary, report weekly",
          "Rung 4 — Own the outcome, report the number",
        ],
        h3: [
          {
            title: "Why founders fall off the ladder",
            body: [
              "They jump from rung one to rung four because they are tired, then take the whole thing back when it goes wrong. The person concludes that ownership is a trap. Climb one rung at a time and it holds.",
            ],
          },
        ],
      },
      {
        h2: "Documentation is the transfer mechanism",
        body: [
          "You cannot transfer what you have not described. Documentation is not bureaucracy — it is the medium through which a company learns.",
          "Keep the standard low enough to actually happen: one page, steps, the definition of done, the common failure, an owner and a date. Anything longer will not be maintained, and an out-of-date document is worse than none.",
          "The best time to write it is while doing the task, not after. The second best is while teaching it to someone — have them write it, then you correct it. That halves your work and doubles their understanding.",
        ],
      },
      {
        h2: "Processes should be boring",
        body: [
          "Good process design removes decisions rather than adding steps. Every step should exist because its absence causes a specific, observed failure.",
          "Once a quarter, audit for steps that exist because of a problem you no longer have. Companies accumulate scar tissue, and unexamined process is how small businesses start to feel like slow ones.",
          "The test of a good process: a competent new person can run it in week two, and the output is indistinguishable from yours.",
        ],
      },
      {
        h2: "Hiring for a company, not for relief",
        body: [
          "Hiring in panic produces vague roles. Vague roles produce underperformance. Underperformance confirms the founder's belief that nobody can do it properly — and the cycle locks.",
          "Write the scorecard before the job post: the outcomes this role owns, the numbers it moves, the standard it must hold. If you cannot write it, you are not ready to hire; you are ready to document.",
          "Hire slightly ahead of comfort, never far ahead of clarity. And in the first ninety days, measure whether they can run the documented system unsupervised — that, not personality, is the signal.",
        ],
      },
      {
        h2: "Culture is the operating system for behaviour",
        body: [
          "Culture is not values on a wall. It is what happens when something goes wrong and you are not watching.",
          "It is set by three things: what you reward, what you tolerate, and what you do under pressure. The third is loudest. A founder who preaches calm and panics visibly has taught the team that panic is the real standard.",
          "Name three behaviours you actually want, describe them in observable terms, and reference them in every review. Three that are lived beat ten that are laminated.",
        ],
      },
      {
        h2: "The leadership shift",
        body: [
          "At some point the job changes from producing the work to producing the people and systems that produce the work. Many founders never make this shift, because the old job is the one they are good at and get praised for.",
          "The new job is quieter. It looks like writing documents, sitting in reviews, asking better questions, removing obstacles, and resisting the enormous temptation to grab the keyboard.",
          "It is also the only job that creates freedom — and freedom is not idleness. Freedom is the capacity to start the next thing. Every hour the company runs without me is an hour available for what ONARU builds next.",
        ],
      },
      {
        h2: "A ninety-day plan",
        body: [
          "Month one: write the absence list and document the top-ranked system. Month two: assign an owner and climb the delegation ladder with weekly reviews. Month three: instrument the system with one number, and hold yourself to not intervening unless that number moves the wrong way.",
          "Repeat four times and you have a genuinely different company within a year. Not because you worked harder — because you finally worked on the machine instead of inside it.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I make my business less dependent on me?",
        a: "List what breaks in your absence, document the top item into a one-page process, assign a named owner, climb a four-rung delegation ladder, then instrument it with a single health metric.",
      },
      {
        q: "How do I delegate without losing quality?",
        a: "Transfer the standard along with the task, and move through the delegation ladder gradually rather than handing over full ownership at once.",
      },
      {
        q: "What should a founder's job become?",
        a: "Designing and improving the systems and people that produce the work, rather than producing the work personally.",
      },
    ],
    related: ["why-most-creative-businesses-never-scale", "why-every-creator-needs-an-operating-system"],
    cta: {
      title: "Build it with support",
      body: "Founder mentorship, systems thinking and business architecture — applied to your company.",
      label: "Explore mentorship",
      to: "/mentorship",
    },
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export type Reflection = {
  slug: string;
  topic: string;
  reflection: string;
  scripture: { text: string; ref: string };
};

const s = (text: string, ref: string) => ({ text, ref });

export const REFLECTION_TOPICS = [
  "All",
  "Faith",
  "Stewardship",
  "Creativity",
  "Building",
  "Purpose",
  "Leadership",
] as const;

export type ReflectionTopic = (typeof REFLECTION_TOPICS)[number];

export const REFLECTIONS: Reflection[] = [
  {
    slug: "ambition-becomes-dangerous",
    topic: "Purpose",
    reflection:
      "Ambition becomes dangerous when what you are building becomes more important than Who you are becoming.",
    scripture: s("For what does it profit a man to gain the whole world and forfeit his soul?", "Mark 8:36"),
  },
  {
    slug: "the-gift-may-carry-your-name",
    topic: "Stewardship",
    reflection: "The gift may carry your name, but that doesn't mean it belongs to you.",
    scripture: s("Every good gift and every perfect gift is from above.", "James 1:17"),
  },
  {
    slug: "impressive-and-unfaithful",
    topic: "Stewardship",
    reflection:
      "I don't want to build something impressive and discover that I was unfaithful in the process.",
    scripture: s("Moreover, it is required of stewards that they be found faithful.", "1 Corinthians 4:2"),
  },
  {
    slug: "excellence-is-not-proving",
    topic: "Creativity",
    reflection:
      "Excellence isn't about proving that I am better than everyone else. It is about refusing to be careless with what God placed in my hands.",
    scripture: s("Whatever you do, work heartily, as for the Lord and not for men.", "Colossians 3:23"),
  },
  {
    slug: "plans-held-loosely",
    topic: "Faith",
    reflection:
      "I am learning to hold my plans tightly enough to work for them and loosely enough for God to change them.",
    scripture: s("The heart of man plans his way, but the LORD establishes his steps.", "Proverbs 16:9"),
  },
  {
    slug: "useful-without-me",
    topic: "Building",
    reflection:
      "The goal isn't simply to build companies that become bigger than me. It is to build things that remain useful without needing me at the centre.",
    scripture: s(
      "Let the favor of the Lord our God be upon us, and establish the work of our hands.",
      "Psalm 90:17",
    ),
  },
  {
    slug: "creativity-submitted",
    topic: "Creativity",
    reflection: "Creativity is powerful, but creativity submitted to purpose becomes responsibility.",
    scripture: s("As each has received a gift, use it to serve one another.", "1 Peter 4:10"),
  },
  {
    slug: "recognition-poor-substitute",
    topic: "Purpose",
    reflection: "Recognition is a poor substitute for purpose.",
    scripture: s("Seek first the kingdom of God and his righteousness.", "Matthew 6:33"),
  },
  {
    slug: "visibility-or-assignment",
    topic: "Leadership",
    reflection:
      "Some opportunities increase your visibility. Others increase your assignment. Wisdom is knowing the difference.",
    scripture: s("Look carefully then how you walk, not as unwise but as wise.", "Ephesians 5:15"),
  },
  {
    slug: "private-obedience",
    topic: "Faith",
    reflection: "I want my private obedience to matter more to me than my public reputation.",
    scripture: s("Your Father who sees in secret will reward you.", "Matthew 6:6"),
  },
  {
    slug: "stewardship-determines",
    topic: "Stewardship",
    reflection:
      "Your gift may open the door, but stewardship determines what you do once you're inside.",
    scripture: s("Moreover, it is required of stewards that they be found faithful.", "1 Corinthians 4:2"),
  },
  {
    slug: "scale-is-not-a-virtue",
    topic: "Building",
    reflection:
      "Scale is not a virtue. It only magnifies whatever character was already there before the growth arrived.",
    scripture: s(
      "One who is faithful in a very little is also faithful in much.",
      "Luke 16:10",
    ),
  },
  {
    slug: "the-camera-taught-me",
    topic: "Creativity",
    reflection:
      "The camera taught me that attention is the beginning of honour. You cannot photograph a person well while you are bored by them.",
    scripture: s("The eye is the lamp of the body.", "Matthew 6:22"),
  },
  {
    slug: "hurry-is-not-obedience",
    topic: "Faith",
    reflection:
      "Hurry has never once made me more obedient. It has only made me more impressive to people who were not watching closely.",
    scripture: s("Whoever believes will not be in haste.", "Isaiah 28:16"),
  },
  {
    slug: "no-is-a-full-sentence",
    topic: "Leadership",
    reflection:
      "A profitable no is still a no. Not every open door is a door I was asked to walk through.",
    scripture: s("To obey is better than sacrifice.", "1 Samuel 15:22"),
  },
  {
    slug: "hidden-years",
    topic: "Purpose",
    reflection:
      "The hidden years are not a delay in the work. Very often they are the work.",
    scripture: s(
      "Suffering produces endurance, and endurance produces character, and character produces hope.",
      "Romans 5:3–4",
    ),
  },
  {
    slug: "money-is-a-test",
    topic: "Stewardship",
    reflection:
      "Money has never revealed anything new about me. It has only made public what I already believed in private.",
    scripture: s("No one can serve two masters.", "Matthew 6:24"),
  },
  {
    slug: "team-before-traction",
    topic: "Leadership",
    reflection:
      "How I treat the people who cannot advance my career is the truest audit of my leadership.",
    scripture: s(
      "Count others more significant than yourselves.",
      "Philippians 2:3",
    ),
  },
  {
    slug: "craft-is-worship",
    topic: "Creativity",
    reflection:
      "Careless work is not humility. It is just careless work wearing humility as a costume.",
    scripture: s(
      "Do you see a man skilful in his work? He will stand before kings.",
      "Proverbs 22:29",
    ),
  },
  {
    slug: "identity-before-industry",
    topic: "Purpose",
    reflection:
      "Photographer, founder, director — those are assignments. None of them are my name.",
    scripture: s("Your life is hidden with Christ in God.", "Colossians 3:3"),
  },
  {
    slug: "influence-is-borrowed",
    topic: "Leadership",
    reflection:
      "Influence is borrowed attention. One day I will have to explain what I spent it on.",
    scripture: s("To whom much was given, of him much will be required.", "Luke 12:48"),
  },
  {
    slug: "systems-are-love",
    topic: "Building",
    reflection:
      "A good system is a quiet form of love. It protects people from my worst days.",
    scripture: s("Let all things be done decently and in order.", "1 Corinthians 14:40"),
  },
  {
    slug: "the-audience-is-not-the-judge",
    topic: "Faith",
    reflection:
      "The audience is not the judge. Applause and criticism are both just weather.",
    scripture: s(
      "It is the Lord who judges me.",
      "1 Corinthians 4:4",
    ),
  },
  {
    slug: "inheritance-over-highlight",
    topic: "Building",
    reflection:
      "I would rather leave an inheritance than a highlight reel. One of them still works after I stop.",
    scripture: s("A good man leaves an inheritance to his children's children.", "Proverbs 13:22"),
  },
  {
    slug: "surrender-is-not-passivity",
    topic: "Faith",
    reflection:
      "Surrender did not make me less ambitious. It changed who the ambition reports to.",
    scripture: s(
      "Present your bodies as a living sacrifice, holy and acceptable to God.",
      "Romans 12:1",
    ),
  },
];

/**
 * Copy and data for the AI-training offering.
 * Staffing content stays in site.ts.
 */

export type TrainingRegionSlug = "usa" | "canada" | "latam" | "europe" | "asia";

export type TrainingFormRegionSlug = TrainingRegionSlug | "other";

export type WorkTypeSlug = "code" | "rlhf" | "specialist";

export type ExperienceBand = "under-2" | "2-4" | "5-9" | "10-plus";

export type EnglishLevel = "professional" | "advanced" | "native";

export type Availability = "part-time" | "full-time";

export type PlatformRelationship = "directory" | "direct";

export type TrainingLink = {
  label: string;
  href: string;
};

export type TrainingRegion = {
  slug: TrainingRegionSlug;
  name: string;
  summary: string;
};

export type WorkType = {
  slug: WorkTypeSlug;
  title: string;
  copy: string;
};

export type Platform = {
  slug: string;
  name: string;
  summary: string;
  work: string;
  relationship: PlatformRelationship;
};

export type TrainingRole = {
  slug: string;
  title: string;
  workType: WorkTypeSlug;
  region: TrainingRegionSlug;
  payMin: number;
  payMax: number;
  summary: string;
  /** Example listings stay badged and out of search until a real opening replaces them. */
  sample: true;
};

export type Portrait = {
  id: string;
  name: string;
  place: string;
  region: TrainingRegionSlug;
  focus: string;
};

export type TrainingStep = {
  title: string;
  copy: string;
};

export type TrainingFaq = {
  question: string;
  answer: string;
};

export type TrainingStat = {
  value: string;
  label: string;
};

export const trainingNav: readonly TrainingLink[] = [
  { label: "For candidates", href: "/ai-training/for-candidates" },
  { label: "For partners", href: "/ai-training/for-partners" },
  { label: "Jobs", href: "/ai-training/jobs" },
  { label: "Platforms", href: "/ai-training/platforms" },
  { label: "How it works", href: "/ai-training/how-it-works" },
  { label: "FAQ", href: "/ai-training/faq" },
];

export const trainingHero = {
  eyebrow: "AI training",
  headline: "Get paid to train the world’s best AI",
  subcopy:
    "Frontier models depend on people who write, review, and grade their work. BridgeWide matches you to the platforms that pay for that work, across software, data, writing, STEM, and other specialist tracks. You apply once. The platform pays you.",
} as const;

export const trainingMission =
  "Frontier AI is built on expert human judgement, but people across the United States and the rest of the world never hear about the platforms that pay for it. BridgeWide exists to close that gap.";

export const trainingRegions: readonly TrainingRegion[] = [
  {
    slug: "usa",
    name: "United States",
    summary:
      "Remote AI-training work for people based in the United States, matched by the kind of work, seniority, and time zone.",
  },
  {
    slug: "canada",
    name: "Canada",
    summary:
      "Remote AI-training work for people based in Canada, from coding and data tasks to writing and other specialist tracks.",
  },
  {
    slug: "latam",
    name: "Latin America",
    summary:
      "Remote AI-training work for people based in Latin America, with assessments briefed before an introduction.",
  },
  {
    slug: "europe",
    name: "Europe",
    summary:
      "Remote AI-training work for people based in Europe, matched to platforms by stack, domain, and time zone.",
  },
  {
    slug: "asia",
    name: "Asia",
    summary:
      "Remote AI-training work for people based in Asia, including multilingual, writing, and technical tracks.",
  },
];

export const formRegions: readonly { slug: TrainingFormRegionSlug; name: string }[] = [
  ...trainingRegions.map((region) => ({ slug: region.slug, name: region.name })),
  { slug: "other", name: "Other" },
];

export const workTypes: readonly WorkType[] = [
  {
    slug: "code",
    title: "Code evaluation and agentic tasks",
    copy: "Compare model-written solutions, find the bugs, and write why one answer is better. Design realistic multi-file tasks and grade how a coding agent works through them.",
  },
  {
    slug: "rlhf",
    title: "RLHF, rating, and writing",
    copy: "Score responses on correctness, helpfulness, and safety, then rewrite the weak ones. This includes general writing and rating, not only code.",
  },
  {
    slug: "specialist",
    title: "Specialist tracks",
    copy: "Data, STEM, multilingual work, and the other expert tracks these platforms post. The match follows the domain, the seniority, and the language.",
  },
];

export const platforms: readonly Platform[] = [
  {
    slug: "outlier",
    name: "Outlier",
    summary: "Contributor work across coding, math, writing, STEM, and generalist tasks.",
    work: "Coding, math, writing, STEM, generalist",
    relationship: "directory",
  },
  {
    slug: "surge-ai",
    name: "Surge AI",
    summary: "RLHF, code review, and domain-expert rating for model training.",
    work: "RLHF, code review, domain experts",
    relationship: "directory",
  },
  {
    slug: "mercor",
    name: "Mercor",
    summary: "Expert projects across software and other professions.",
    work: "Software, professional experts",
    relationship: "directory",
  },
  {
    slug: "turing",
    name: "Turing",
    summary: "Software and AI-training projects for engineers.",
    work: "Software engineering, AI training",
    relationship: "directory",
  },
  {
    slug: "micro1",
    name: "Micro1",
    summary: "Specialist contractors for AI labs and training programs.",
    work: "Software, data, domain specialists",
    relationship: "directory",
  },
  {
    slug: "dataannotation",
    name: "DataAnnotation",
    summary: "Coding, writing, and evaluation tasks for model training.",
    work: "Coding, writing, evaluation",
    relationship: "directory",
  },
  {
    slug: "alignerr",
    name: "Alignerr",
    summary: "Expert contributor work across technical and professional fields.",
    work: "Technical and professional experts",
    relationship: "directory",
  },
  {
    slug: "handshake-ai",
    name: "Handshake AI",
    summary: "Short expert projects used to train AI systems.",
    work: "Expert projects",
    relationship: "directory",
  },
  {
    slug: "invisible",
    name: "Invisible",
    summary: "Expert operations and training work for AI teams.",
    work: "Expert operations, training",
    relationship: "directory",
  },
  {
    slug: "appen",
    name: "Appen",
    summary: "Language, speech, and data tasks used in AI programs.",
    work: "Language, speech, data",
    relationship: "directory",
  },
  {
    slug: "telus-digital",
    name: "TELUS Digital",
    summary: "Language, localization, and AI data programs, including the former Lionbridge AI work.",
    work: "Language, localization, AI data",
    relationship: "directory",
  },
  {
    slug: "mindrift",
    name: "Mindrift",
    summary: "Domain-specialist tasks published through Toloka’s expert platform.",
    work: "Domain specialists",
    relationship: "directory",
  },
  {
    slug: "pareto",
    name: "Pareto",
    summary: "High-skill projects for people training and evaluating models.",
    work: "High-skill evaluation",
    relationship: "directory",
  },
  {
    slug: "snorkel",
    name: "Snorkel AI",
    summary: "Expert data development for model training.",
    work: "Expert data development",
    relationship: "directory",
  },
  {
    slug: "welocalize",
    name: "Welocalize",
    summary: "Language and multilingual data programs for AI.",
    work: "Language, multilingual data",
    relationship: "directory",
  },
  {
    slug: "rws",
    name: "RWS",
    summary: "TrainAI language and domain programs.",
    work: "Language, domain programs",
    relationship: "directory",
  },
  {
    slug: "imerit",
    name: "iMerit",
    summary: "Annotation and specialist data work for AI systems.",
    work: "Annotation, specialist data",
    relationship: "directory",
  },
  {
    slug: "defined-ai",
    name: "Defined.ai",
    summary: "Speech, language, and domain data used to train models.",
    work: "Speech, language, domain data",
    relationship: "directory",
  },
];

export const trainingRoles: readonly TrainingRole[] = [
  {
    slug: "python-code-evaluation",
    title: "Python code evaluation",
    workType: "code",
    region: "latam",
    payMin: 30,
    payMax: 60,
    summary:
      "Compare model-written Python, find the bugs, and write a rationale for the stronger answer.",
    sample: true,
  },
  {
    slug: "senior-fullstack-agentic",
    title: "Senior full-stack agentic tasks",
    workType: "code",
    region: "usa",
    payMin: 50,
    payMax: 90,
    summary:
      "Design realistic multi-file engineering tasks and grade how a coding agent works through them.",
    sample: true,
  },
  {
    slug: "java-backend-rlhf",
    title: "Java and backend RLHF",
    workType: "rlhf",
    region: "europe",
    payMin: 40,
    payMax: 70,
    summary:
      "Score backend answers on correctness and usefulness, then rewrite the ones that miss.",
    sample: true,
  },
  {
    slug: "ml-benchmark",
    title: "ML benchmark work",
    workType: "specialist",
    region: "canada",
    payMin: 60,
    payMax: 120,
    summary:
      "Build and grade hard machine-learning tasks that show where a model still fails.",
    sample: true,
  },
  {
    slug: "multilingual-writing",
    title: "Multilingual writing and rating",
    workType: "specialist",
    region: "asia",
    payMin: 25,
    payMax: 45,
    summary:
      "Rate answers for accuracy and tone in more than one language, and rewrite the weak ones.",
    sample: true,
  },
];

export const portraits: readonly Portrait[] = [
  {
    id: "mateo",
    name: "Mateo",
    place: "Bogotá",
    region: "latam",
    focus: "Code evaluation",
  },
  {
    id: "hanae",
    name: "Hanae",
    place: "Manila",
    region: "asia",
    focus: "Multilingual rating",
  },
  {
    id: "elise",
    name: "Elise",
    place: "Kraków",
    region: "europe",
    focus: "RLHF and writing",
  },
  {
    id: "amara",
    name: "Amara",
    place: "Chicago",
    region: "usa",
    focus: "Data and benchmarks",
  },
];

/** Real, consented quotes only. The section stays off the page while this is empty. */
export const testimonials: readonly { quote: string; name: string; detail: string }[] = [];

export const trainingSteps: readonly TrainingStep[] = [
  {
    title: "Apply once",
    copy: "Send your experience, the kind of work you do, your region, your English level, and a CV. It takes about three minutes.",
  },
  {
    title: "Get screened and matched",
    copy: "We read the profile and match it to platforms by discipline, seniority, language, and time zone.",
  },
  {
    title: "Get briefed and introduced",
    copy: "You get a briefing on the assessment. Where BridgeWide has a direct line, we make the introduction. Your profile is shared only after you agree.",
  },
  {
    title: "Start on the platform’s terms",
    copy: "The platform pays you, in USD, on its own terms. Part-time is about ten hours a week, and full-time is available. BridgeWide does not take a cut.",
  },
];

export const trainingBenefits: readonly TrainingStep[] = [
  {
    title: "One application",
    copy: "You apply to BridgeWide once instead of starting from scratch on a dozen platforms.",
  },
  {
    title: "Free for candidates",
    copy: "Platforms and companies pay the agency. You do not pay to be screened or introduced.",
  },
  {
    title: "Paid by the platform",
    copy: "Earnings come from the platform, in USD. BridgeWide does not take a percentage.",
  },
  {
    title: "Your say on sharing",
    copy: "A profile goes to a platform only after you agree to that introduction.",
  },
];

export const trainingFaq: readonly TrainingFaq[] = [
  {
    question: "Who is this for?",
    answer:
      "People who can do the work AI-training platforms post: software, data, AI, writing, STEM, multilingual tasks, and other specialist tracks. Strong written English matters. Many projects look for two or more years of professional experience. The work is remote.",
  },
  {
    question: "Which countries can apply?",
    answer:
      "Anywhere. The site has regional pages for the United States, Canada, Latin America, Europe, and Asia. If you are somewhere else, choose Other on the application.",
  },
  {
    question: "Who pays me?",
    answer:
      "The platform pays you, in USD, on its own terms. BridgeWide does not take a cut of earnings. Candidates do not pay a fee.",
  },
  {
    question: "When is my profile shared?",
    answer:
      "Only after you agree to a specific introduction. Applying does not send your name to every platform in the directory.",
  },
  {
    question: "How fast do you review an application?",
    answer: "The desk aims to review applications within three business days.",
  },
  {
    question: "Are the jobs on this site live openings?",
    answer:
      "The roles marked Example role show the kind of work and the kind of pay range. They are examples. A real opening replaces an example when the desk has one.",
  },
  {
    question: "Do you have a partnership with every platform listed?",
    answer:
      "The directory names public platforms. BridgeWide introduces you where it has a direct line, and briefs you on the assessment either way.",
  },
];

export const experienceBands: readonly { value: ExperienceBand; label: string }[] = [
  { value: "under-2", label: "Under 2 years" },
  { value: "2-4", label: "2–4 years" },
  { value: "5-9", label: "5–9 years" },
  { value: "10-plus", label: "10 years or more" },
];

export const englishLevels: readonly { value: EnglishLevel; label: string }[] = [
  { value: "professional", label: "Professional working English" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native or bilingual" },
];

export const availabilities: readonly { value: Availability; label: string }[] = [
  { value: "part-time", label: "Part-time, about 10 hours a week" },
  { value: "full-time", label: "Full-time" },
];

export const trainingStats: readonly TrainingStat[] = [
  { value: String(platforms.length), label: "Platforms in the directory" },
  { value: "Worldwide", label: "Remote, including the United States" },
  { value: "$0", label: "Cost to candidates" },
  { value: "1", label: "Application" },
];

export function trainingRegion(slug: string): TrainingRegion | undefined {
  return trainingRegions.find((region) => region.slug === slug);
}

export function trainingRole(slug: string): TrainingRole | undefined {
  return trainingRoles.find((role) => role.slug === slug);
}

export function trainingPlatform(slug: string): Platform | undefined {
  return platforms.find((platform) => platform.slug === slug);
}

export function workTypeLabel(slug: WorkTypeSlug): string {
  return workTypes.find((type) => type.slug === slug)?.title ?? slug;
}

export function formatHourly(min: number, max: number): string {
  return `USD ${min}–${max}/hour`;
}

export function formRegionName(slug: TrainingFormRegionSlug): string {
  return formRegions.find((region) => region.slug === slug)?.name ?? slug;
}

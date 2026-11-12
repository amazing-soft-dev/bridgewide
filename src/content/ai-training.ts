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
  /** Photo for the AI-training regions mosaic. Not used by the home region cards. */
  image: string;
};

export type WorkType = {
  slug: WorkTypeSlug;
  title: string;
  copy: string;
};

export type Platform = {
  slug: string;
  name: string;
  /** Square brand mark, used only on the platform tape. */
  logo: string;
  summary: string;
  work: string;
  relationship: PlatformRelationship;
};

import { trainingRoles, type TrainingRole } from "@/content/training-openings";

export type { TrainingRole };
export { trainingRoles };

export type Portrait = {
  id: string;
  name: string;
  place: string;
  region: TrainingRegionSlug;
  focus: string;
  image: string;
};

export type TrainingStep = {
  title: string;
  copy: string;
};

/** One promise on the candidates slides. */
export type TrainingBenefit = TrainingStep & {
  /** Large figure on the slide card. */
  figure: string;
  /** Line under the figure. */
  unit: string;
  /** One-line fact under the card. */
  note: string;
  /** Full-bleed photo behind the slide. */
  image: string;
  alt: string;
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
    image: "/images/training-region-usa.webp",
    name: "United States",
    summary:
      "Remote AI-training work for people based in the United States, matched by the kind of work, seniority, and time zone.",
  },
  {
    slug: "canada",
    image: "/images/training-region-canada.webp",
    name: "Canada",
    summary:
      "Remote AI-training work for people based in Canada, from coding and data tasks to writing and other specialist tracks.",
  },
  {
    slug: "latam",
    image: "/images/training-region-latam.webp",
    name: "Latin America",
    summary:
      "Remote AI-training work for people based in Latin America, with assessments briefed before an introduction.",
  },
  {
    slug: "europe",
    image: "/images/training-region-europe.webp",
    name: "Europe",
    summary:
      "Remote AI-training work for people based in Europe, matched to platforms by stack, domain, and time zone.",
  },
  {
    slug: "asia",
    image: "/images/training-region-asia.webp",
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
    logo: "/images/platforms/outlier.svg",
    name: "Outlier",
    summary: "Contributor work across coding, math, writing, STEM, and generalist tasks.",
    work: "Coding, math, writing, STEM, generalist",
    relationship: "directory",
  },
  {
    slug: "surge-ai",
    logo: "/images/platforms/surge-ai.png",
    name: "Surge AI",
    summary: "RLHF, code review, and domain-expert rating for model training.",
    work: "RLHF, code review, domain experts",
    relationship: "directory",
  },
  {
    slug: "mercor",
    logo: "/images/platforms/mercor.png",
    name: "Mercor",
    summary: "Expert projects across software and other professions.",
    work: "Software, professional experts",
    relationship: "directory",
  },
  {
    slug: "turing",
    logo: "/images/platforms/turing.png",
    name: "Turing",
    summary: "Software and AI-training projects for engineers.",
    work: "Software engineering, AI training",
    relationship: "directory",
  },
  {
    slug: "micro1",
    logo: "/images/platforms/micro1.png",
    name: "Micro1",
    summary: "Specialist contractors for AI labs and training programs.",
    work: "Software, data, domain specialists",
    relationship: "directory",
  },
  {
    slug: "dataannotation",
    logo: "/images/platforms/dataannotation.png",
    name: "DataAnnotation",
    summary: "Coding, writing, and evaluation tasks for model training.",
    work: "Coding, writing, evaluation",
    relationship: "directory",
  },
  {
    slug: "alignerr",
    logo: "/images/platforms/alignerr.png",
    name: "Alignerr",
    summary: "Expert contributor work across technical and professional fields.",
    work: "Technical and professional experts",
    relationship: "directory",
  },
  {
    slug: "handshake-ai",
    logo: "/images/platforms/handshake-ai.svg",
    name: "Handshake AI",
    summary: "Short expert projects used to train AI systems.",
    work: "Expert projects",
    relationship: "directory",
  },
  {
    slug: "invisible",
    logo: "/images/platforms/invisible.png",
    name: "Invisible",
    summary: "Expert operations and training work for AI teams.",
    work: "Expert operations, training",
    relationship: "directory",
  },
  {
    slug: "appen",
    logo: "/images/platforms/appen.png",
    name: "Appen",
    summary: "Language, speech, and data tasks used in AI programs.",
    work: "Language, speech, data",
    relationship: "directory",
  },
  {
    slug: "telus-digital",
    logo: "/images/platforms/telus-digital.png",
    name: "TELUS Digital",
    summary: "Language, localization, and AI data programs, including the former Lionbridge AI work.",
    work: "Language, localization, AI data",
    relationship: "directory",
  },
  {
    slug: "mindrift",
    logo: "/images/platforms/mindrift.svg",
    name: "Mindrift",
    summary: "Domain-specialist tasks published through Toloka’s expert platform.",
    work: "Domain specialists",
    relationship: "directory",
  },
  {
    slug: "pareto",
    logo: "/images/platforms/pareto.svg",
    name: "Pareto",
    summary: "High-skill projects for people training and evaluating models.",
    work: "High-skill evaluation",
    relationship: "directory",
  },
  {
    slug: "snorkel",
    logo: "/images/platforms/snorkel.png",
    name: "Snorkel AI",
    summary: "Expert data development for model training.",
    work: "Expert data development",
    relationship: "directory",
  },
  {
    slug: "welocalize",
    logo: "/images/platforms/welocalize.png",
    name: "Welocalize",
    summary: "Language and multilingual data programs for AI.",
    work: "Language, multilingual data",
    relationship: "directory",
  },
  {
    slug: "rws",
    logo: "/images/platforms/rws.png",
    name: "RWS",
    summary: "TrainAI language and domain programs.",
    work: "Language, domain programs",
    relationship: "directory",
  },
  {
    slug: "imerit",
    logo: "/images/platforms/imerit.png",
    name: "iMerit",
    summary: "Annotation and specialist data work for AI systems.",
    work: "Annotation, specialist data",
    relationship: "directory",
  },
  {
    slug: "defined-ai",
    logo: "/images/platforms/defined-ai.png",
    name: "Defined.ai",
    summary: "Speech, language, and domain data used to train models.",
    work: "Speech, language, domain data",
    relationship: "directory",
  },
];


export const portraits: readonly Portrait[] = [
  {
    id: "mateo",
    name: "Mateo",
    place: "Bogotá, Colombia (LATAM)",
    region: "latam",
    focus: "Code evaluation",
    image: "/images/portraits/mateo.webp",
  },
  {
    id: "hanae",
    name: "Hanae",
    place: "Manila, Philippines (Asia)",
    region: "asia",
    focus: "Multilingual rating",
    image: "/images/portraits/hanae.webp",
  },
  {
    id: "elise",
    name: "Elise",
    place: "Kraków, Poland (Europe)",
    region: "europe",
    focus: "RLHF and writing",
    image: "/images/portraits/elise.webp",
  },
  {
    id: "amara",
    name: "Amara",
    place: "Chicago, United States (USA)",
    region: "usa",
    focus: "Data and benchmarks",
    image: "/images/portraits/amara.webp",
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

export const trainingBenefits: readonly TrainingBenefit[] = [
  {
    title: "One application",
    copy: "A single form and CV cover every platform in the directory. Tell the desk your discipline, region, English level, and hours, and it matches from there.",
    figure: "3 min",
    unit: "to fill in, CV attached",
    note: "The desk aims to review it within three business days.",
    image: "/images/training-benefit-1.webp",
    alt: "A woman filling in a form on her laptop",
  },
  {
    title: "Free for candidates",
    copy: "No fee to apply, to be screened, or to be introduced, and no paid tier. Platforms and companies pay BridgeWide for the placement.",
    figure: "$0",
    unit: "charged to you, at any step",
    note: "If anyone asks you for money to reach a platform, it is not us.",
    image: "/images/training-benefit-2.webp",
    alt: "A man working on his laptop over coffee",
  },
  {
    title: "Paid by the platform",
    copy: "The platform pays you directly, on its own schedule, hourly or per task. The rate is the platform's, and the desk briefs you on it before you accept.",
    figure: "$1,500",
    unit: "Agency fees absorbed by platforms",
    note: "Part-time starts at about ten hours a week; full-time is available.",
    image: "/images/training-benefit-3.webp",
    alt: "A woman at her home desk with a laptop",
  },
  {
    title: "Your say on sharing",
    copy: "Applying puts you on the desk's list, not on every platform's. Each introduction is proposed to you first, with the platform named.",
    figure: "100%",
    unit: "Transparent partner controls",
    note: "Email michael.allen@bridgewide.org to pause or delete a profile. There is no account.",
    image: "/images/training-benefit-4.webp",
    alt: "A woman taking a call at her desk",
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
      "Yes. Each card names the platform that was advertising that work, the published range, and the date of the source. The platform pays you. BridgeWide introduces you and does not take a cut. A ceiling such as “up to $35” is a ceiling. The platform shows the rate before the work starts.",
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
  { value: "3", label: "Business days to review" },
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

const shortLabels: Record<WorkTypeSlug, string> = { code: "Code", rlhf: "RLHF", specialist: "Specialist" };

/** One-word label for a kind of work: Code, RLHF, Specialist. */
export function workTypeShort(slug: WorkTypeSlug): string {
  return shortLabels[slug];
}

export function formatHourly(min: number | null, max: number): string {
  if (min == null) return `up to USD ${max}/hour`;
  if (min === max) return `USD ${min}/hour`;
  return `USD ${min}–${max}/hour`;
}

/** Hourly pay for tight ticket columns: "$30–60/hr". */
export function formatCompactHourly(min: number | null, max: number): string {
  if (min == null) return `up to $${max}/hr`;
  if (min === max) return `$${min}/hr`;
  return `$${min}–${max}/hr`;
}

export function formRegionName(slug: TrainingFormRegionSlug): string {
  return formRegions.find((region) => region.slug === slug)?.name ?? slug;
}

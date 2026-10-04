/**
 * Sample marketing content for BridgeWide.
 * Figures, names, and salary bands are illustrative. UI surfaces `sampleFiguresNote`
 * on the record, the salary guide, and role salaries.
 */

export const sampleFiguresNote = "Sample figures";

export type RegionSlug = "usa" | "canada" | "latam" | "europe";

export type RegionCode = "USA" | "CAN" | "LATAM" | "EUR";

export type WorkMode = "Hybrid" | "Remote";

export type Engagement = "Permanent" | "Contract";

export type Discipline =
  | "Backend"
  | "Frontend"
  | "Data"
  | "Cloud"
  | "Mobile"
  | "Leadership";

export type RoleTag = "New" | "Hot";

export type FaqAudience = "Employers" | "Engineers";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type SalaryDisciplineSlug =
  | "backend"
  | "frontend"
  | "data"
  | "cloud"
  | "mobile"
  | "leadership";

export type NavLink = {
  label: string;
  href: string;
};

export type Contact = {
  email: string;
  phone: string;
  location: string;
};

export type Announcement = {
  liveRoleCount: string;
  salaryGuideHref: string;
  salaryGuideLabel: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type Hero = {
  eyebrow: string;
  headline: string;
  subcopy: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type Stat = {
  value: string;
  label: string;
};

export type Region = {
  slug: RegionSlug;
  name: string;
  code: RegionCode;
  summary: string;
  openRoleCount: number;
  image: string;
};

export type Role = {
  slug: string;
  title: string;
  region: RegionSlug;
  city: string;
  workMode: WorkMode;
  engagement: Engagement;
  salary: string;
  discipline: Discipline;
  summary: string;
  consultantName: string;
  tags?: readonly RoleTag[];
};

export type Placement = {
  title: string;
  company: string;
  region: RegionCode;
  engagement: Engagement;
  days: number;
};

export type WeekStep = {
  day: Weekday;
  id: "brief" | "long-list" | "interviews" | "shortlist" | "sent";
  title: string;
  copy: string;
};

export type Person = {
  id: string;
  name: string;
  role: string;
  focus: string;
  placementCount: number;
  image: string;
};

export type SalaryRange = {
  low: number;
  high: number;
  median: number;
};

export type SalaryDiscipline = {
  slug: SalaryDisciplineSlug;
  label: Discipline;
  bands: Record<RegionSlug, SalaryRange>;
};

export type SalaryBands = {
  edition: string;
  basis: string;
  disciplines: readonly SalaryDiscipline[];
};

export type Story = {
  slug: string;
  company: string;
  region: RegionSlug;
  quote: string;
  attribution: string;
  result: string;
  metric: string;
  image: string;
  body: readonly [string, string, string];
};

export type Insight = {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  minutes: number;
  excerpt: string;
  body: readonly [string, string, string, string];
};

export type FaqItem = {
  question: string;
  answer: string;
  audience: FaqAudience;
};

export type Fees = {
  permanent: string;
  contract: string;
  guarantee: string;
};

export type SiteImages = {
  hero: string;
  employers: string;
  engineers: string;
  desk: string;
  close: string;
};

export const contact: Contact = {
  email: "hello@bridgewide.com",
  phone: "+1 (415) 555-0148",
  location: "San Francisco · remote desks in four regions",
};

export const nav: readonly NavLink[] = [
  { label: "Employers", href: "/employers" },
  { label: "Regions", href: "/regions" },
  { label: "Roles", href: "/roles" },
  { label: "Salary guide", href: "/salary-guide" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const images: SiteImages = {
  hero: "/images/hero.webp",
  employers: "/images/employers.webp",
  engineers: "/images/engineers.webp",
  desk: "/images/desk.webp",
  close: "/images/close.webp",
};

export const hero: Hero = {
  eyebrow: "Software engineers for hiring teams",
  headline: "A shortlist your engineering managers will actually interview.",
  subcopy:
    "BridgeWide places software engineers for companies. We source from the USA, Canada, LATAM, and Europe, and we stay on the search until the seat is filled.",
  primaryCta: { label: "Hire engineers", href: "/employers" },
  secondaryCta: { label: "Find a role", href: "/engineers" },
};

export const stats: readonly Stat[] = [
  { value: "186", label: "Placements in the past year" },
  { value: "9", label: "Median days to a shortlist" },
  { value: "94%", label: "Still in role after one year" },
  { value: "11", label: "Median days to fill a contract seat" },
];

export const placements: readonly Placement[] = [
  {
    title: "Staff Backend Engineer",
    company: "Northline",
    region: "USA",
    engagement: "Permanent",
    days: 16,
  },
  {
    title: "Senior Data Engineer",
    company: "Harbor Metrics",
    region: "CAN",
    engagement: "Permanent",
    days: 12,
  },
  {
    title: "Mobile Engineer",
    company: "Campo Health",
    region: "LATAM",
    engagement: "Contract",
    days: 8,
  },
  {
    title: "Platform Engineer",
    company: "Keel Systems",
    region: "EUR",
    engagement: "Permanent",
    days: 19,
  },
];

export const week: readonly WeekStep[] = [
  {
    day: "Mon",
    id: "brief",
    title: "Brief",
    copy: "You tell us the stack, the hiring manager, and what good looks like in the first ninety days.",
  },
  {
    day: "Tue",
    id: "long-list",
    title: "Long list",
    copy: "We send a long list with notes on depth, so your team can see who is worth a conversation.",
  },
  {
    day: "Wed",
    id: "interviews",
    title: "Interviews",
    copy: "We run the first conversations and hold the calendar for people your managers should meet.",
  },
  {
    day: "Thu",
    id: "shortlist",
    title: "Shortlist",
    copy: "A short list arrives with salary, notice, and a plain reason each engineer fits this brief.",
  },
  {
    day: "Fri",
    id: "sent",
    title: "Sent",
    copy: "Offers go out with our desk still on the thread until the engineer starts.",
  },
];

export const people: readonly Person[] = [
  {
    id: "lena-cho",
    name: "Lena Cho",
    role: "Partner, former staff backend engineer",
    focus: "USA",
    placementCount: 42,
    image: "/images/person-lena.webp",
  },
  {
    id: "henrik-dahl",
    name: "Henrik Dahl",
    role: "Principal, former platform engineer",
    focus: "Europe · Cloud",
    placementCount: 31,
    image: "/images/person-henrik.webp",
  },
  {
    id: "sofia-navarro",
    name: "Sofia Navarro",
    role: "Consultant, former iOS engineer",
    focus: "LATAM · Mobile",
    placementCount: 27,
    image: "/images/person-sofia.webp",
  },
  {
    id: "marcus-adeyemi",
    name: "Marcus Adeyemi",
    role: "Consultant, former data engineer",
    focus: "Canada · Data",
    placementCount: 24,
    image: "/images/person-marcus.webp",
  },
  {
    id: "priya-raman",
    name: "Priya Raman",
    role: "Director, former engineering manager",
    focus: "Leadership",
    placementCount: 19,
    image: "/images/person-priya.webp",
  },
];

export const roles: readonly Role[] = [
  {
    slug: "staff-backend-engineer-san-francisco",
    title: "Staff Backend Engineer",
    region: "usa",
    city: "San Francisco",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$210,000–$245,000",
    discipline: "Backend",
    summary:
      "A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team.",
    consultantName: "Lena Cho",
    tags: ["Hot"],
  },
  {
    slug: "senior-frontend-engineer-austin",
    title: "Senior Frontend Engineer",
    region: "usa",
    city: "Austin",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$165,000–$190,000",
    discipline: "Frontend",
    summary:
      "Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team.",
    consultantName: "Lena Cho",
    tags: ["New"],
  },
  {
    slug: "engineering-manager-new-york",
    title: "Engineering Manager",
    region: "usa",
    city: "New York",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$240,000–$280,000",
    discipline: "Leadership",
    summary:
      "A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start.",
    consultantName: "Priya Raman",
  },
  {
    slug: "senior-data-engineer-toronto",
    title: "Senior Data Engineer",
    region: "canada",
    city: "Toronto",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$150,000–$175,000",
    discipline: "Data",
    summary:
      "Toronto hybrid seat on a warehouse that feeds finance and product reporting. The brief calls for a senior data engineer who has run dbt and a cloud warehouse in production.",
    consultantName: "Marcus Adeyemi",
    tags: ["Hot"],
  },
  {
    slug: "cloud-engineer-vancouver",
    title: "Cloud Engineer",
    region: "canada",
    city: "Vancouver",
    workMode: "Remote",
    engagement: "Contract",
    salary: "$850–$980 / day",
    discipline: "Cloud",
    summary:
      "A contract cloud seat, remote in Canada, to finish a platform cutover before year end. The engineer should be comfortable owning Terraform, a Kubernetes cluster, and the on-call that comes with both.",
    consultantName: "Marcus Adeyemi",
    tags: ["New"],
  },
  {
    slug: "senior-backend-engineer-mexico-city",
    title: "Senior Backend Engineer",
    region: "latam",
    city: "Mexico City",
    workMode: "Remote",
    engagement: "Contract",
    salary: "$650–$780 / day",
    discipline: "Backend",
    summary:
      "Contract backend seat in Mexico City, overlapped with US Pacific hours, for an API that is already in market. We want a senior engineer who can pick up a Go service and ship without a long ramp.",
    consultantName: "Sofia Navarro",
    tags: ["Hot"],
  },
  {
    slug: "mobile-engineer-sao-paulo",
    title: "Mobile Engineer",
    region: "latam",
    city: "São Paulo",
    workMode: "Remote",
    engagement: "Permanent",
    salary: "$95,000–$120,000",
    discipline: "Mobile",
    summary:
      "Permanent mobile seat in São Paulo for a health product with iOS and Android already in the stores. The hire joins a small app team and is expected to own releases as well as tickets.",
    consultantName: "Sofia Navarro",
  },
  {
    slug: "frontend-engineer-bogota",
    title: "Frontend Engineer",
    region: "latam",
    city: "Bogotá",
    workMode: "Remote",
    engagement: "Contract",
    salary: "$480–$620 / day",
    discipline: "Frontend",
    summary:
      "Contract frontend seat in Bogotá for a dashboard that account managers live in. The engineer should know React well enough to improve a mature codebase in place.",
    consultantName: "Sofia Navarro",
    tags: ["New"],
  },
  {
    slug: "staff-platform-engineer-london",
    title: "Staff Platform Engineer",
    region: "europe",
    city: "London",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$160,000–$190,000",
    discipline: "Cloud",
    summary:
      "Hybrid staff platform seat in London for a company whose product engineers are blocked on internal tooling. The hire sets the paved path: CI, environments, and the libraries other teams are expected to use.",
    consultantName: "Henrik Dahl",
    tags: ["Hot"],
  },
  {
    slug: "data-engineer-berlin",
    title: "Data Engineer",
    region: "europe",
    city: "Berlin",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$120,000–$145,000",
    discipline: "Data",
    summary:
      "Hybrid data seat in Berlin on event pipelines that feed product analytics and a customer-facing report. We are looking for an engineer who has operated streaming jobs in production.",
    consultantName: "Marcus Adeyemi",
  },
  {
    slug: "ios-engineer-amsterdam",
    title: "iOS Engineer",
    region: "europe",
    city: "Amsterdam",
    workMode: "Remote",
    engagement: "Contract",
    salary: "$700–$860 / day",
    discipline: "Mobile",
    summary:
      "Remote contract iOS seat in Amsterdam to ship a regulated feature before a fixed release window. The engineer should have taken an app through App Store review and be used to working with a backend team in another city.",
    consultantName: "Sofia Navarro",
    tags: ["New"],
  },
  {
    slug: "director-of-engineering-dublin",
    title: "Director of Engineering",
    region: "europe",
    city: "Dublin",
    workMode: "Hybrid",
    engagement: "Permanent",
    salary: "$200,000–$240,000",
    discipline: "Leadership",
    summary:
      "A director seat in Dublin for a product org of about forty engineers across three groups. The search starts confidential, and the hire is expected to reset planning with the managers already in place.",
    consultantName: "Priya Raman",
  },
];

const regionSeed: readonly Omit<Region, "openRoleCount">[] = [
  {
    slug: "usa",
    name: "United States",
    code: "USA",
    summary:
      "Hybrid seats in San Francisco, New York, Austin, and other US hubs, sourced against your stack and your bar. This desk is the default when the hiring manager and the team sit in the same city most weeks.",
    image: "/images/region-usa.webp",
  },
  {
    slug: "canada",
    name: "Canada",
    code: "CAN",
    summary:
      "Toronto and Vancouver anchors, plus remote Canada seats when the team is already distributed. A strong fit for data, cloud, and product engineering that has to follow Canadian employment rules.",
    image: "/images/region-canada.webp",
  },
  {
    slug: "latam",
    name: "Latin America",
    code: "LATAM",
    summary:
      "Remote engineers across Mexico, Brazil, Colombia, and the wider region, overlapped with US hours. Companies use this desk for contract seats and for permanent hires who will join a US or Canadian team.",
    image: "/images/region-latam.webp",
  },
  {
    slug: "europe",
    name: "Europe",
    code: "EUR",
    summary:
      "London, Berlin, Amsterdam, Dublin, and other UK and EU hubs. Hybrid seats for product companies that need senior engineers and engineering leaders on the ground.",
    image: "/images/region-europe.webp",
  },
];

export const regions: readonly Region[] = regionSeed.map((region) => ({
  ...region,
  openRoleCount: roles.filter((role) => role.region === region.slug).length,
}));

export const announcement: Announcement = {
  liveRoleCount: `${roles.length} roles live`,
  salaryGuideHref: "/salary-guide",
  salaryGuideLabel: "Salary guide",
};

export const salaryBands: SalaryBands = {
  edition: "Autumn 2026 edition",
  basis: "Annual base salary in USD",
  disciplines: [
    {
      slug: "backend",
      label: "Backend",
      bands: {
        usa: { low: 165000, high: 245000, median: 198000 },
        canada: { low: 130000, high: 185000, median: 155000 },
        latam: { low: 72000, high: 128000, median: 96000 },
        europe: { low: 110000, high: 178000, median: 142000 },
      },
    },
    {
      slug: "frontend",
      label: "Frontend",
      bands: {
        usa: { low: 150000, high: 220000, median: 180000 },
        canada: { low: 120000, high: 175000, median: 145000 },
        latam: { low: 64000, high: 115000, median: 86000 },
        europe: { low: 100000, high: 165000, median: 130000 },
      },
    },
    {
      slug: "data",
      label: "Data",
      bands: {
        usa: { low: 168000, high: 250000, median: 205000 },
        canada: { low: 135000, high: 195000, median: 162000 },
        latam: { low: 76000, high: 140000, median: 102000 },
        europe: { low: 115000, high: 185000, median: 148000 },
      },
    },
    {
      slug: "cloud",
      label: "Cloud",
      bands: {
        usa: { low: 170000, high: 260000, median: 210000 },
        canada: { low: 140000, high: 200000, median: 168000 },
        latam: { low: 80000, high: 145000, median: 108000 },
        europe: { low: 120000, high: 190000, median: 152000 },
      },
    },
    {
      slug: "mobile",
      label: "Mobile",
      bands: {
        usa: { low: 155000, high: 230000, median: 188000 },
        canada: { low: 125000, high: 180000, median: 150000 },
        latam: { low: 68000, high: 120000, median: 90000 },
        europe: { low: 105000, high: 170000, median: 136000 },
      },
    },
    {
      slug: "leadership",
      label: "Leadership",
      bands: {
        usa: { low: 220000, high: 340000, median: 275000 },
        canada: { low: 180000, high: 270000, median: 220000 },
        latam: { low: 120000, high: 200000, median: 155000 },
        europe: { low: 160000, high: 260000, median: 205000 },
      },
    },
  ],
};

export const stories: readonly Story[] = [
  {
    slug: "northline-ledger-owner",
    company: "Northline",
    region: "usa",
    quote:
      "We stopped interviewing generalists. The shortlist was four people who had already owned a ledger.",
    attribution: "Amira Shah, VP Engineering, Northline",
    result: "Staff backend engineer placed in San Francisco",
    metric: "16 days",
    image: "/images/story-1.webp",
    body: [
      "Northline’s payments team had a ledger service with one owner out on leave and a launch date that would not move. The hiring manager wanted a staff engineer who could read the existing design and take the on-call, and the internal pipeline was full of people a level below the seat.",
      "We wrote the brief around the service boundary, the language, and the review culture on that team. The long list was twelve names. The shortlist was four, each with a note on the production system they had owned.",
      "The engineer started sixteen days after the brief. Three months later the service had a second owner, and the manager asked us to open a senior frontend seat on the same product.",
    ],
  },
  {
    slug: "harbor-metrics-warehouse",
    company: "Harbor Metrics",
    region: "canada",
    quote:
      "They sent people who had already run the warehouse we were trying to grow, which saved us a quarter of interviews.",
    attribution: "Jonah Blake, Head of Data, Harbor Metrics",
    result: "Senior data engineer placed in Toronto",
    metric: "12 days",
    image: "/images/story-2.webp",
    body: [
      "Harbor Metrics was hiring a senior data engineer into a warehouse that finance already depended on. The team had rejected two earlier searches because the candidates knew the tools on a slide and had never operated them on a weekday.",
      "The brief named dbt, the warehouse, and the reporting consumers. We interviewed for production stories and sent a shortlist of three, with salary and notice on the same page.",
      "Harbor hired from that shortlist in twelve days. The new engineer took the finance models in the first month, and the head of data kept the same brief shape for the next seat.",
    ],
  },
  {
    slug: "campo-health-release",
    company: "Campo Health",
    region: "latam",
    quote:
      "We needed a mobile engineer who could ship a release, and we had the contract signed before the sprint slipped.",
    attribution: "Elena Varga, COO, Campo Health",
    result: "Contract mobile engineer placed, remote from São Paulo",
    metric: "8 days",
    image: "/images/story-3.webp",
    body: [
      "Campo Health had a regulated release and one mobile engineer. A contractor who could own the store submission was the difference between shipping and slipping a quarter.",
      "We limited the search to engineers who had taken an app through review and who could overlap US hours from Latin America. The first conversations happened in the same week as the brief.",
      "A contract started eight days later. Campo kept the seat for a second term and then asked for a permanent backend engineer on the same product.",
    ],
  },
  {
    slug: "keel-systems-paved-path",
    company: "Keel Systems",
    region: "europe",
    quote:
      "The platform hire was the one our product managers felt. Deploys got quieter in the first month.",
    attribution: "Thomas Keller, CTO, Keel Systems",
    result: "Staff platform engineer placed in London",
    metric: "19 days",
    image: "/images/story-4.webp",
    body: [
      "Keel’s product engineers were waiting on internal tooling. The CTO wanted a staff platform engineer in London who would set the paved path, and he wanted the search kept inside a small group until offer stage.",
      "We ran it as a confidential search, with the company name shared only after a first conversation. The shortlist was three staff engineers who had built CI and environment standards for a multi-team org.",
      "The hire started in nineteen days. A month in, the team had a single way to ship, and Keel opened a director search on the same desk.",
    ],
  },
];

export const insights: readonly Insight[] = [
  {
    slug: "brief-that-earns-a-shortlist",
    title: "The brief that earns a shortlist in nine days",
    kicker: "For hiring managers",
    date: "12 September 2026",
    minutes: 6,
    excerpt:
      "A short brief that names the manager, the system, and the first ninety days will outrun a long requisition full of tools.",
    body: [
      "Most searches stall on a requisition that lists every tool the company has bought. The engineers who can do the job recognize a pile of keywords and wait. Your managers then spend the week meeting people who match the list and miss the work.",
      "A useful brief fits on one page. Name the hiring manager, the system the hire will own, and what the team needs in the first ninety days. Add the interview loop and the salary band you will actually offer. Leave the rest for the conversation.",
      "When we can see the bar, the long list gets shorter on purpose. Nine days is our sample median to a shortlist because the first pass happens against that page, and we drop people who would waste a calendar slot.",
      "If you are opening a seat this month, write the ninety-day outcome before you write the requirements. Send that to us with the manager’s name. The shortlist that comes back will be people your team can interview with a straight face.",
    ],
  },
  {
    slug: "contract-seat-before-the-sprint-slips",
    title: "Fill a contract seat before the sprint slips",
    kicker: "Contracts",
    date: "18 August 2026",
    minutes: 5,
    excerpt:
      "A contract search moves when the rate, the overlap, and the end date are decided before the first call.",
    body: [
      "Contract seats fail when the company is still debating the day rate while the sprint board is already red. Engineers who can start this month are also talking to two other desks. Ambiguity is how you lose them.",
      "Decide three things up front: the rate band in USD, the hours of overlap with the team, and the date the contract ends. Tell us whether an extension is likely. Those facts belong in the first message, alongside the stack.",
      "Our sample median to fill a contract seat is eleven days. That count starts when the brief is complete. A search that reopens the rate after the first interview starts the clock again, and the engineer has usually moved on.",
      "If the work is real and the budget is approved, send the brief on Monday. You should be choosing from a shortlist before the next planning meeting, with our desk still on the thread through the start date.",
    ],
  },
  {
    slug: "reading-salary-bands-across-regions",
    title: "How to read salary bands across four regions",
    kicker: "Pay",
    date: "2 September 2026",
    minutes: 7,
    excerpt:
      "The Autumn 2026 bands are annual base in USD. Use them to set an offer, and keep equity and local rules in a separate conversation.",
    body: [
      "A band is a range for a conversation, and it is a sample of the market we are seeing this season. The Autumn 2026 edition lists low, high, and median annual base salary in USD for backend, frontend, data, cloud, mobile, and engineering leadership.",
      "Compare a seat to the region where the engineer will be employed. A London platform salary and a Mexico City contract rate answer different questions. Converting a US band straight across will either overpay a local market or lose the person you want.",
      "Base is the number on the guide. Equity, bonus, and benefits sit beside it, and they move the offer more than a small shift inside the band. For contract work, translate the annual figure into a day rate only after you know the margin and the length.",
      "Bring the guide to the brief. If your approved band sits under the median for that discipline and region, say so early. We would rather narrow the search than send a shortlist you cannot close.",
    ],
  },
];

export const faq: readonly FaqItem[] = [
  {
    audience: "Employers",
    question: "What do you charge for a permanent hire?",
    answer:
      "Sample figure: 20% of first-year base salary, invoiced when the engineer starts. The Autumn salary guide is a separate sample and does not change the fee. We confirm the percentage in the search agreement before work begins.",
  },
  {
    audience: "Employers",
    question: "How fast is a shortlist?",
    answer:
      "Sample median: nine days from a complete brief to a shortlist, and eleven days to fill a contract seat. The clock starts when we have the manager, the stack, the band, and what the first ninety days require. A brief that changes mid-search resets that count.",
  },
  {
    audience: "Employers",
    question: "What does the replacement guarantee cover?",
    answer:
      "Sample terms: if a permanent hire leaves within 12 weeks of the start date, we reopen that search once at no extra fee. The guarantee covers a replacement search. It is a sample of our usual terms, and the signed agreement is the one that applies.",
  },
  {
    audience: "Engineers",
    question: "Does it cost anything to be put forward?",
    answer:
      "No. Companies pay BridgeWide. Engineers do not pay a fee to be introduced, interviewed, or hired. If a role is live, your consultant will tell you the band, the city or remote setup, and the hiring manager before your name goes across.",
  },
  {
    audience: "Employers",
    question: "Can you run a confidential search?",
    answer:
      "Yes. We can keep your company name inside a small group until a candidate reaches a first conversation. The brief still needs a real stack and a real band. Confidential searches take the same week-shaped process, with the public title held back.",
  },
  {
    audience: "Employers",
    question: "Which regions do you hire from?",
    answer:
      "Four: the United States, Canada, Latin America, and Europe. Each region has its own desk. We place hybrid and remote engineers, on permanent and contract terms, and we can run one search that draws from more than one region when you want that comparison.",
  },
];

export const fees: Fees = {
  permanent:
    "Sample figure: 20% of first-year base salary for a permanent hire, billed when the engineer starts.",
  contract: "Sample figure: an 18% margin on the agreed contract rate.",
  guarantee:
    "Sample terms: a 12-week replacement guarantee. If a permanent hire leaves inside that window, we reopen the search once at no extra fee.",
};

function findBySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T | undefined {
  return items.find((item) => item.slug === slug);
}

export function getRegion(slug: string): Region | undefined {
  return findBySlug(regions, slug);
}

export function getRole(slug: string): Role | undefined {
  return findBySlug(roles, slug);
}

export function getStory(slug: string): Story | undefined {
  return findBySlug(stories, slug);
}

export function getInsight(slug: string): Insight | undefined {
  return findBySlug(insights, slug);
}

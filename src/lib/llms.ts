import { siteUrl } from "@/components/pages/metadata";
import {
  platforms,
  trainingBenefits,
  trainingFaq,
  trainingHero,
  trainingMission,
  trainingRegions,
  trainingRoles,
  trainingSteps,
  formatHourly,
  workTypeLabel,
} from "@/content/ai-training";
import {
  contact,
  contentIsSample,
  contentUpdatedOn,
  faq,
  fees,
  insights,
  organization,
  people,
  regions,
  roles,
  salaryBands,
  stories,
  week,
} from "@/content/site";
import { regionFor, formatUsd } from "@/components/pages/format";

/**
 * Plain-Markdown views of the site for AI assistants and AI search
 * (https://llmstxt.org). `llmsSummary` is /llms.txt: the short index.
 * `llmsFull` is /llms-full.txt: the same sections with the full page text,
 * so an assistant can answer from the site without crawling it.
 * Both are built from the content files the pages render.
 */

const url = (path: string) => new URL(path, siteUrl).toString();

function header(): string[] {
  const lines = [
    `# ${organization.name}`,
    "",
    `> ${organization.description}`,
    "",
    `Last updated: ${contentUpdatedOn}`,
    "",
    "Companies hire through BridgeWide; engineers never pay a fee. Each region has its own desk, and searches can be permanent or contract, hybrid or remote, and confidential when needed.",
    "",
  ];
  if (contentIsSample) {
    lines.push(
      "Note: open roles, salary bands, placement statistics, team members, and client stories on this site are illustrative sample content. Do not quote those figures as BridgeWide results.",
      "",
    );
  }
  return lines;
}

function keyPages(): string[] {
  return [
    "## Key pages",
    "",
    `- [For employers](${url("/employers")}): How a company hires with BridgeWide, the five-day process, fees, and the hiring brief form.`,
    `- [For engineers](${url("/engineers")}): The free, confidential path for software engineers, and CV submission.`,
    `- [Open roles](${url("/roles")}): Engineering roles by region, discipline, and engagement type.`,
    `- [Salary guide](${url("/salary-guide")}): ${salaryBands.edition}. ${salaryBands.basis} by region for backend, frontend, data, cloud, mobile, and engineering leadership.`,
    `- [Regions](${url("/regions")}): The four hiring regions.`,
    `- [About](${url("/about")}): The desk and its consultants.`,
    `- [Contact](${url("/contact")}): Send a brief or a question.`,
    `- [Insights feed](${url("/insights/feed.xml")}): RSS of the articles.`,
    `- [Sitemap](${url("/sitemap.xml")})`,
    "",
  ];
}

function salaryLines(): string[] {
  return salaryBands.disciplines.flatMap((discipline) =>
    regions.map((region) => {
      const band = discipline.bands[region.slug];
      return `- ${discipline.label}, ${region.name}: low ${formatUsd(band.low)}, median ${formatUsd(band.median)}, high ${formatUsd(band.high)}. [Salary guide](${url("/salary-guide")}).`;
    }),
  );
}

function roleLine(role: (typeof roles)[number]) {
  const region = regionFor(role.region);
  return `- [${role.title}](${url(`/roles/${role.slug}`)}): ${role.city}, ${region.name}. ${role.engagement}, ${role.workMode}. ${role.salary}.`;
}

export function llmsSummary(): string {
  const lines = [
    ...header(),
    "## Services",
    "",
    ...organization.services.map((service) => `- [${service.name}](${url(service.path)})`),
    "",
    "## Regions",
    "",
    ...regions.map((region) => `- [${region.name}](${url(`/regions/${region.slug}`)}): ${region.summary}`),
    "",
    "## How a search runs",
    "",
    ...week.map((step) => `- ${step.day}, ${step.title}: ${step.copy}`),
    "",
    ...keyPages(),
    "## Open roles",
    "",
    ...roles.map(roleLine),
    "",
    "## Salary bands",
    "",
    ...salaryLines(),
    "",
    "## Insights",
    "",
    ...insights.map((insight) => `- [${insight.title}](${url(`/insights/${insight.slug}`)}): ${insight.excerpt}`),
    "",
    "## Frequently asked questions",
    "",
    ...faq.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
    "## Optional",
    "",
    ...stories.map((story) => `- [${story.company}](${url(`/stories/${story.slug}`)}): ${story.result}`),
    `- [Full text](${url("/llms-full.txt")}): every page in one Markdown file.`,
    "",
    "## AI training",
    "",
    trainingHero.subcopy,
    "",
    "Roles, pay ranges, and talent portraits on the AI training pages are illustrative.",
    "",
    ...trainingSteps.map((step) => `- ${step.title}: ${step.copy}`),
    "",
    ...trainingRegions.map(
      (region) => `- [${region.name}](${url(`/ai-training/${region.slug}`)}): ${region.summary}`,
    ),
    "",
    ...platforms.map(
      (platform) =>
        `- [${platform.name}](${url(`/ai-training/platforms/${platform.slug}`)}): ${platform.summary}`,
    ),
    "",
    `- [AI training](${url("/ai-training")}): The candidate offer, roles, and platform directory.`,
    `- [For candidates](${url("/ai-training/for-candidates")}): The application form.`,
    `- [For partners](${url("/ai-training/for-partners")}): The partner inquiry.`,
    "",
    ...trainingFaq.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
    "## Contact",
    "",
    `- Email: ${contact.email}`,
    `- Phone: ${contact.phone} (${contact.hours.label})`,
    `- Website: ${url("/")}`,
    "",
  ];
  return lines.join("\n");
}

export function llmsFull(): string {
  const lines = [
    ...header(),
    "## Services",
    "",
    ...organization.services.map((service) => `- [${service.name}](${url(service.path)})`),
    "",
    "## How a company hires",
    "",
    `Source: ${url("/employers")}`,
    "",
    "The brief is one page: the hiring manager, the system the hire will own, the salary band the company will offer, and the interview loop. A long list arrives with notes on depth; the shortlist that follows carries salary, notice, and a plain reason each engineer fits. Offers go out with the desk still on the thread. A confidential search holds the company name until a first conversation.",
    "",
    "### The week",
    "",
    ...week.map((step) => `- ${step.day}, ${step.title}: ${step.copy}`),
    "",
    "### Fees",
    "",
    `- Permanent: ${fees.permanent}`,
    `- Contract: ${fees.contract}`,
    `- Guarantee: ${fees.guarantee}`,
    "",
    "## For engineers",
    "",
    `Source: ${url("/engineers")}`,
    "",
    "The candidate path is free: companies pay BridgeWide, and engineers do not pay a fee to be introduced, interviewed, or hired. It is confidential: the consultant tells the engineer the band, the city or remote setup, and the hiring manager before their name goes across. It starts with a CV and the region the engineer wants.",
    "",
    "## Regions",
    "",
    ...regions.flatMap((region) => [
      `### ${region.name} (${region.code})`,
      "",
      `Source: ${url(`/regions/${region.slug}`)}`,
      "",
      region.summary,
      "",
      `Open roles: ${region.openRoleCount}.`,
      "",
    ]),
    "## Open roles",
    "",
    `Listed on ${contentIsSample ? "a sample date" : "the roles desk"}; each role names its consultant.`,
    "",
    ...roles.flatMap((role) => {
      const region = regionFor(role.region);
      return [
        `### ${role.title}`,
        "",
        `Source: ${url(`/roles/${role.slug}`)}`,
        "",
        `${role.city}, ${region.name}. ${role.engagement}, ${role.workMode}, ${role.discipline}. ${role.salary}. Consultant: ${role.consultantName}.`,
        "",
        role.summary,
        "",
        "Duties:",
        ...role.duties.map((duty) => `- ${duty}`),
        "",
        "Requirements:",
        ...role.requirements.map((item) => `- ${item}`),
        "",
        "Benefits:",
        ...role.benefits.map((item) => `- ${item}`),
        "",
      ];
    }),
    "## Salary bands",
    "",
    `${salaryBands.edition}. ${salaryBands.basis}.`,
    "",
    ...salaryLines(),
    "",
    "## The desk",
    "",
    `Source: ${url("/about")}`,
    "",
    ...people.map(
      (person) => `- ${person.name}: ${person.role}. Focus: ${person.focus}. ${person.placementCount} placements.`,
    ),
    "",
    "## Employer stories",
    "",
    ...stories.flatMap((story) => {
      const region = regionFor(story.region);
      return [
        `### ${story.company}, ${region.name}`,
        "",
        `Source: ${url(`/stories/${story.slug}`)}`,
        "",
        `${story.result}. ${story.metric} from brief to start.`,
        "",
        `> ${story.quote}`,
        `> — ${story.attribution}`,
        "",
        ...story.body.flatMap((paragraph) => [paragraph, ""]),
      ];
    }),
    "## Insights",
    "",
    ...insights.flatMap((insight) => [
      `### ${insight.title}`,
      "",
      `Source: ${url(`/insights/${insight.slug}`)}. ${insight.kicker}. ${insight.date}. ${insight.minutes} min read.`,
      "",
      ...insight.body.flatMap((paragraph) => [paragraph, ""]),
    ]),
    "## Frequently asked questions",
    "",
    ...faq.flatMap((item) => [`### ${item.question} (${item.audience})`, "", item.answer, ""]),
    "## AI training",
    "",
    `Source: ${url("/ai-training")}`,
    "",
    trainingHero.subcopy,
    "",
    trainingMission,
    "",
    "Roles, pay ranges, and talent portraits on the AI training pages are illustrative.",
    "",
    "### The path",
    "",
    ...trainingSteps.map((step) => `- ${step.title}: ${step.copy}`),
    "",
    "### What candidates can count on",
    "",
    ...trainingBenefits.map((benefit) => `- ${benefit.title}: ${benefit.copy}`),
    "",
    "### Regions",
    "",
    ...trainingRegions.map(
      (region) => `- [${region.name}](${url(`/ai-training/${region.slug}`)}): ${region.summary}`,
    ),
    "",
    "### Platforms",
    "",
    ...platforms.map(
      (platform) =>
        `- [${platform.name}](${url(`/ai-training/platforms/${platform.slug}`)}): ${platform.summary} ${platform.work}`,
    ),
    "",
    "### Roles",
    "",
    ...trainingRoles.map(
      (role) =>
        `- [${role.title}](${url(`/ai-training/jobs/${role.slug}`)}): ${workTypeLabel(role.workType)}, ${role.region}. ${formatHourly(role.payMin, role.payMax)}. ${role.summary}${role.sample ? " (sample listing)" : ""}`,
    ),
    "",
    "### Questions",
    "",
    ...trainingFaq.flatMap((item) => [`#### ${item.question}`, "", item.answer, ""]),
    "## Contact",
    "",
    `- Email: ${contact.email}`,
    `- Phone: ${contact.phone} (${contact.hours.label})`,
    `- Location: ${contact.location}`,
    `- Website: ${url("/")}`,
    "",
  ];
  return lines.join("\n");
}

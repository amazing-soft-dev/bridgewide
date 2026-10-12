import { siteUrl } from "@/components/pages/metadata";
import {
  contact,
  contentIsSample,
  faq,
  insights,
  organization,
  regions,
  stories,
  week,
} from "@/content/site";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

/**
 * /llms.txt (https://llmstxt.org): a plain-Markdown summary of the site for
 * AI assistants and AI search, built from the same content as the pages.
 */
export function GET() {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const lines: string[] = [
    `# ${organization.name}`,
    "",
    `> ${organization.description}`,
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

  lines.push(
    "## Services",
    "",
    ...organization.services.map((service) => `- ${service}`),
    "",
    "## Regions",
    "",
    ...regions.map((region) => `- [${region.name}](${url(`/regions/${region.slug}`)}): ${region.summary}`),
    "",
    "## How a search runs",
    "",
    ...week.map((step) => `- ${step.day}, ${step.title}: ${step.copy}`),
    "",
    "## Key pages",
    "",
    `- [For employers](${url("/employers")}): How a company hires with BridgeWide, the five-day process, fees, and the hiring brief form.`,
    `- [For engineers](${url("/engineers")}): The free, confidential path for software engineers, and CV submission.`,
    `- [Open roles](${url("/roles")}): Engineering roles by region, discipline, and engagement type.`,
    `- [Salary guide](${url("/salary-guide")}): Annual base salary bands in USD by region for backend, frontend, data, cloud, mobile, and engineering leadership.`,
    `- [Regions](${url("/regions")}): The four hiring regions.`,
    `- [About](${url("/about")}): The desk and its consultants.`,
    `- [Contact](${url("/contact")}): Send a brief or a question.`,
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
    `- [Sitemap](${url("/sitemap.xml")})`,
    "",
    "## Contact",
    "",
    `- Email: ${contact.email}`,
    `- Website: ${url("/")}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

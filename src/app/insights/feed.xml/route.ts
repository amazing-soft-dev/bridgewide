import { siteName, siteUrl } from "@/components/pages/metadata";
import { contact, insights, organization } from "@/content/site";
import { isoDate } from "@/lib/structured-data";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

const escape = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });

const rfc822 = (iso: string | undefined) =>
  iso ? new Date(`${iso}T09:00:00Z`).toUTCString() : undefined;

/** RSS 2.0 feed of the insights, one item per article with the full text. */
export function GET() {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const sorted = [...insights].sort((a, b) => (isoDate(b.date) ?? "").localeCompare(isoDate(a.date) ?? ""));
  const newest = rfc822(isoDate(sorted[0]?.date ?? ""));

  const items = sorted.map((insight) => {
    const link = url(`/insights/${insight.slug}`);
    const published = rfc822(isoDate(insight.date));
    const body = insight.body.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("");
    return [
      "    <item>",
      `      <title>${escape(insight.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      ...(published ? [`      <pubDate>${published}</pubDate>`] : []),
      `      <category>${escape(insight.kicker)}</category>`,
      `      <description>${escape(insight.excerpt)}</description>`,
      `      <content:encoded><![CDATA[${body}]]></content:encoded>`,
      "    </item>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    "  <channel>",
    `    <title>${escape(siteName)} insights</title>`,
    `    <link>${url("/insights")}</link>`,
    `    <atom:link href="${url("/insights/feed.xml")}" rel="self" type="application/rss+xml" />`,
    `    <description>${escape(organization.description)}</description>`,
    "    <language>en</language>",
    `    <managingEditor>${escape(contact.email)} (${escape(siteName)})</managingEditor>`,
    ...(newest ? [`    <lastBuildDate>${newest}</lastBuildDate>`] : []),
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

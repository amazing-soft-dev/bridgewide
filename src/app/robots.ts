import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/pages/metadata";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

/**
 * AI crawlers are named and allowed explicitly so the site can be read and
 * cited by AI search and assistants (GEO). The `*` rule already allows them;
 * listing them documents the choice and survives a stricter `*` rule later.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}

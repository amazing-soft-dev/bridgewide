import type { Metadata } from "next";

/**
 * Public origin of the site, used for canonical URLs, Open Graph, the sitemap
 * and robots.txt. Set NEXT_PUBLIC_SITE_URL at build time to override.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.bridgewide.org").replace(
  /\/+$/,
  "",
);

export const siteName = "BridgeWide";

/**
 * Machine-readable companions linked from every page: the llms.txt summary
 * and full text for AI assistants, and the insights feed for readers and
 * aggregators.
 */
const alternateTypes: NonNullable<Metadata["alternates"]>["types"] = {
  "text/plain": [
    { url: "/llms.txt", title: "LLM-readable site summary" },
    { url: "/llms-full.txt", title: "LLM-readable full site text" },
  ],
  "application/rss+xml": [{ url: "/insights/feed.xml", title: "BridgeWide insights" }],
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  robots,
}: {
  /**
   * The page's own title. The root layout appends " · BridgeWide"; pass
   * `{ absolute }` for a title that already carries the brand.
   */
  title: string | { absolute: string };
  description: string;
  path: string;
  type?: "website" | "article";
  /** ISO date; added to Open Graph for articles. */
  publishedTime?: string;
  /** ISO date; added to Open Graph for articles. */
  modifiedTime?: string;
  /** Author URLs for articles. Defaults to the firm for article pages. */
  authors?: readonly string[];
  robots?: Metadata["robots"];
}): Metadata {
  const url = new URL(path, siteUrl).toString();
  const shown = typeof title === "string" ? title : title.absolute;
  const article = type === "article";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: alternateTypes,
    },
    openGraph: {
      title: shown,
      description,
      url,
      siteName,
      locale: "en_US",
      type,
      ...(article && publishedTime ? { publishedTime } : {}),
      ...(article && modifiedTime ? { modifiedTime } : {}),
      ...(article ? { authors: [...(authors ?? [siteUrl])] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shown,
      description,
    },
    ...(robots ? { robots } : {}),
  };
}

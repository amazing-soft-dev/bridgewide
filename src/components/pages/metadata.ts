import type { Metadata } from "next";

/**
 * Public origin of the site, used for canonical URLs, Open Graph, the sitemap
 * and robots.txt. Set NEXT_PUBLIC_SITE_URL at build time to override.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.bridgewide.org").replace(
  /\/+$/,
  "",
);

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** ISO date; added to Open Graph for articles. */
  publishedTime?: string;
}): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
      // Points AI crawlers at the plain-text summary (src/app/llms.txt).
      types: { "text/plain": [{ url: "/llms.txt", title: "LLM-readable site summary" }] },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "BridgeWide",
      locale: "en_US",
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

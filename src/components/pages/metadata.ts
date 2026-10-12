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
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "BridgeWide",
      type,
    },
  };
}

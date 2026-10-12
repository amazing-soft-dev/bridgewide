import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/pages/metadata";
import { insights, regions, roles, stories } from "@/content/site";
import { isoDate } from "@/lib/structured-data";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

const staticPaths = [
  "/",
  "/employers",
  "/engineers",
  "/roles",
  "/regions",
  "/about",
  "/salary-guide",
  "/stories",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...roles.map((role) => `/roles/${role.slug}`),
    ...regions.map((region) => `/regions/${region.slug}`),
    ...stories.map((story) => `/stories/${story.slug}`),
  ];

  return [
    ...paths.map((path) => ({ url: new URL(path, siteUrl).toString() })),
    ...insights.map((insight) => ({
      url: new URL(`/insights/${insight.slug}`, siteUrl).toString(),
      lastModified: isoDate(insight.date),
    })),
  ];
}

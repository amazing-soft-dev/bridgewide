import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/pages/metadata";
import { insights, regions, roles, stories } from "@/content/site";

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
    ...insights.map((insight) => `/insights/${insight.slug}`),
  ];

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}

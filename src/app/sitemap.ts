import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/pages/metadata";
import { platforms, trainingRegions, trainingRoles } from "@/content/ai-training";
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
  "/ai-training",
  "/ai-training/for-candidates",
  "/ai-training/for-partners",
  "/ai-training/jobs",
  "/ai-training/platforms",
  "/ai-training/how-it-works",
  "/ai-training/about",
  "/ai-training/faq",
  "/ai-training/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...roles.map((role) => `/roles/${role.slug}`),
    ...regions.map((region) => `/regions/${region.slug}`),
    ...stories.map((story) => `/stories/${story.slug}`),
    ...trainingRegions.map((region) => `/ai-training/${region.slug}`),
    ...platforms.map((platform) => `/ai-training/platforms/${platform.slug}`),
    ...trainingRoles.filter((role) => !role.sample).map((role) => `/ai-training/jobs/${role.slug}`),
  ];

  return [
    ...paths.map((path) => ({ url: new URL(path, siteUrl).toString() })),
    ...insights.map((insight) => ({
      url: new URL(`/insights/${insight.slug}`, siteUrl).toString(),
      lastModified: isoDate(insight.date),
    })),
  ];
}

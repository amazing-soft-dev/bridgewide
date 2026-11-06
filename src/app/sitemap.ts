import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/pages/metadata";
import { platforms, trainingRegions, trainingRoles } from "@/content/ai-training";
import {
  contentUpdatedOn,
  insights,
  regions,
  roles,
  rolesListedOn,
  stories,
} from "@/content/site";
import { isoDate } from "@/lib/structured-data";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: Frequency;
  priority: number;
};

/**
 * Every indexable route with how often it changes and how central it is.
 * Dates come from the content files, so a content edit moves lastModified
 * without touching this file.
 */
function entries(): Entry[] {
  const content = contentUpdatedOn;
  const list: Entry[] = [
    { path: "/", lastModified: content, changeFrequency: "weekly", priority: 1 },
    { path: "/employers", lastModified: content, changeFrequency: "monthly", priority: 0.9 },
    { path: "/engineers", lastModified: content, changeFrequency: "monthly", priority: 0.9 },
    { path: "/roles", lastModified: rolesListedOn, changeFrequency: "daily", priority: 0.9 },
    { path: "/regions", lastModified: content, changeFrequency: "monthly", priority: 0.7 },
    { path: "/salary-guide", lastModified: content, changeFrequency: "monthly", priority: 0.8 },
    { path: "/about", lastModified: content, changeFrequency: "monthly", priority: 0.6 },
    { path: "/stories", lastModified: content, changeFrequency: "monthly", priority: 0.6 },
    { path: "/insights", lastModified: latestInsight(), changeFrequency: "weekly", priority: 0.7 },
    { path: "/contact", lastModified: content, changeFrequency: "yearly", priority: 0.5 },
    { path: "/ai-training", lastModified: content, changeFrequency: "weekly", priority: 0.9 },
    { path: "/ai-training/for-candidates", lastModified: content, changeFrequency: "monthly", priority: 0.8 },
    { path: "/ai-training/for-partners", lastModified: content, changeFrequency: "monthly", priority: 0.7 },
    { path: "/ai-training/jobs", lastModified: content, changeFrequency: "daily", priority: 0.8 },
    { path: "/ai-training/platforms", lastModified: content, changeFrequency: "monthly", priority: 0.7 },
    { path: "/ai-training/how-it-works", lastModified: content, changeFrequency: "monthly", priority: 0.7 },
    { path: "/ai-training/about", lastModified: content, changeFrequency: "monthly", priority: 0.5 },
    { path: "/ai-training/faq", lastModified: content, changeFrequency: "monthly", priority: 0.6 },
    { path: "/ai-training/contact", lastModified: content, changeFrequency: "yearly", priority: 0.5 },
  ];

  for (const region of regions) {
    list.push({ path: `/regions/${region.slug}`, lastModified: content, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const role of roles) {
    list.push({ path: `/roles/${role.slug}`, lastModified: rolesListedOn, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const story of stories) {
    list.push({ path: `/stories/${story.slug}`, lastModified: content, changeFrequency: "yearly", priority: 0.5 });
  }
  for (const insight of insights) {
    list.push({
      path: `/insights/${insight.slug}`,
      lastModified: isoDate(insight.date) ?? content,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }
  for (const region of trainingRegions) {
    list.push({ path: `/ai-training/${region.slug}`, lastModified: content, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const platform of platforms) {
    list.push({ path: `/ai-training/platforms/${platform.slug}`, lastModified: content, changeFrequency: "monthly", priority: 0.5 });
  }
  for (const role of trainingRoles) {
    list.push({ path: `/ai-training/jobs/${role.slug}`, lastModified: content, changeFrequency: "weekly", priority: 0.6 });
  }

  return list;
}

function latestInsight() {
  const dates = insights.map((insight) => isoDate(insight.date)).filter((date): date is string => Boolean(date));
  return dates.sort().at(-1) ?? contentUpdatedOn;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return entries().map(({ path, lastModified, changeFrequency, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  }));
}

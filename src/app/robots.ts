import type { MetadataRoute } from "next";
import { siteUrl } from "@/components/pages/metadata";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}

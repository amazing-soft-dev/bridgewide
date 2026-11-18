import { ogCard, ogContentType, ogSize } from "@/components/seo/OgCard";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

export const alt =
  "BridgeWide. Hiring engineers across the USA, Canada, LATAM, Europe, and Asia.";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return ogCard({
    eyebrow: "Software engineers for hiring teams",
    title: "Hiring engineers across the USA, Canada, LATAM, Europe, and Asia.",
    line: "A shortlist your managers will interview, with the salary band on every role.",
  });
}

import { llmsSummary } from "@/lib/llms";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

/** /llms.txt (https://llmstxt.org): the short Markdown index of the site. */
export function GET() {
  return new Response(llmsSummary(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

import { llmsSummary } from "@/lib/llms";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";
// A role closes at 18:00 Pacific. Next.js reads this value statically, so it must be a number literal:
// regenerate at most every five minutes in the server build. The static export ignores it.
export const revalidate = 300;

/** /llms.txt (https://llmstxt.org): the short Markdown index of the site. */
export function GET() {
  return new Response(llmsSummary(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

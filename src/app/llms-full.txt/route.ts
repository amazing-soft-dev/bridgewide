import { llmsFull } from "@/lib/llms";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";
// A role closes at 18:00 Pacific. Next.js reads this value statically, so it must be a number literal:
// regenerate at most every five minutes in the server build. The static export ignores it.
export const revalidate = 300;

/** /llms-full.txt: every page's text in one Markdown file, for AI assistants. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

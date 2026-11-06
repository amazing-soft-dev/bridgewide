import { llmsFull } from "@/lib/llms";

// Prerender at build time so this also works in the static export.
export const dynamic = "force-static";

/** /llms-full.txt: every page's text in one Markdown file, for AI assistants. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

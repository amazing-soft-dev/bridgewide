import type { NextConfig } from "next";

/**
 * Two build targets:
 *
 * - Default (`next build`): full Next.js server. Form API routes and Resend work.
 *   Use this on Vercel or any Node host.
 * - Static export (`NEXT_OUTPUT=export next build`): plain HTML in `out/` for
 *   GitHub Pages. There is no server, so the /api form routes are not available.
 *   `PAGES_BASE_PATH` is the sub-path the site is served from (for example
 *   `/bridgewide` on https://<owner>.github.io/bridgewide). Leave it empty for a
 *   custom domain.
 */
const staticExport = process.env.NEXT_OUTPUT === "export";
const basePath = staticExport ? (process.env.PAGES_BASE_PATH ?? "").replace(/\/+$/, "") : "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: staticExport ? "1" : "",
  },
  ...(staticExport && {
    output: "export",
    basePath,
    images: {
      // The default optimizer needs a server. This loader serves the
      // pre-sized WebP files from public/ as they are, under basePath.
      loader: "custom",
      loaderFile: "./src/lib/static-image-loader.ts",
    },
  }),
};

export default nextConfig;

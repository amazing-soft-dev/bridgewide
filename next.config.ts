import type { NextConfig } from "next";
import imageSizes from "./src/lib/image-sizes.json";
import { securityHeaders } from "./src/lib/security-headers";

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
  // Automatic memoization, run as native code inside Turbopack.
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
    // `motion/react` is a barrel; import only the members each file uses.
    optimizePackageImports: ["motion"],
  },
  // The static export has no server, so only the server build can send headers.
  ...(!staticExport && {
    async headers() {
      return [{ source: "/:path*", headers: [...securityHeaders] }];
    },
  }),
  ...(!staticExport && {
    images: {
      // AVIF first, WebP for browsers without it. One quality keeps the
      // optimizer's cache small and the `/_next/image` surface closed.
      formats: ["image/avif", "image/webp"],
      qualities: [75],
    },
  }),
  ...(staticExport && {
    output: "export",
    basePath,
    images: {
      // The default optimizer needs a server. `npm run images` pre-builds a
      // WebP for each of these widths, and this loader points srcset at them.
      loader: "custom",
      loaderFile: "./src/lib/static-image-loader.ts",
      deviceSizes: imageSizes.deviceSizes,
      imageSizes: imageSizes.imageSizes,
    },
  }),
};

export default nextConfig;

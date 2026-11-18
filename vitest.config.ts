import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // The server code: what the forms, crons, and listings run on.
      include: ["src/lib/**/*.ts", "src/app/api/**/*.ts"],
      exclude: ["**/*.test.ts", "src/lib/image-sizes.json", "src/lib/static-image-loader.ts"],
      reporter: ["text-summary", "text"],
      // Just under the numbers on 2026-11-13 (71 / 63 / 79 / 76), so coverage cannot slide.
      // Raise a number when the real one has moved up for good.
      thresholds: { statements: 68, branches: 60, functions: 76, lines: 73 },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});

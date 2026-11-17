import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  use: { baseURL: "http://localhost:3003" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "narrow", use: { viewport: { width: 390, height: 844 } } },
  ],
});

import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { trainingRoles } from "@/content/ai-training";
import { roles } from "@/content/site";
import { llmsFull, llmsSummary } from "@/lib/llms";

describe("llms and sitemap", () => {
  it("counts open roles, names Asia, and lists the training cards", () => {
    const previous = process.env.ROLE_CLOCK;
    delete process.env.ROLE_CLOCK;
    const open = llmsSummary();
    expect(open).toContain("## Open roles");
    expect(open).toContain("Asia");
    expect(open).toContain("Senior Backend Engineer");
    for (const role of trainingRoles) expect(open).toContain(role.slug);

    process.env.ROLE_CLOCK = "2027-01-17T04:00:00.000Z";
    const closed = llmsSummary();
    expect(closed).not.toContain("/roles/senior-backend-engineer-singapore");
    if (previous === undefined) delete process.env.ROLE_CLOCK;
    else process.env.ROLE_CLOCK = previous;

    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.includes("/privacy"))).toBe(false);
    expect(urls.some((url) => url.includes("/terms"))).toBe(false);
    for (const role of trainingRoles) {
      expect(urls.some((url) => url.endsWith(`/ai-training/jobs/${role.slug}`))).toBe(true);
    }
    expect(llmsFull()).toContain("Asia");
    expect(roles.some((role) => role.region === "asia")).toBe(true);
  });
});

import { afterEach, describe, expect, it } from "vitest";
import * as llms from "@/app/llms.txt/route";
import * as llmsFull from "@/app/llms-full.txt/route";
import * as sitemapModule from "@/app/sitemap";
import { roles } from "@/content/site";

afterEach(() => {
  delete process.env.ROLE_CLOCK;
  delete process.env.ROLE_CLOSE_DATES;
});

const usaSlug = roles.find((role) => role.region === "usa")!.slug;

describe("closing a role without a redeploy", () => {
  it("regenerates the machine-readable listings every five minutes", () => {
    expect(llms.revalidate).toBe(300);
    expect(llmsFull.revalidate).toBe(300);
    expect(sitemapModule.revalidate).toBe(300);
  });

  it("changes /llms.txt the minute 18:00 Pacific passes", async () => {
    process.env.ROLE_CLOSE_DATES = "region:usa=2027-01-16";

    process.env.ROLE_CLOCK = "2027-01-17T01:59:00.000Z"; // 17:59 Pacific
    expect(await llms.GET().text()).toContain(`/roles/${usaSlug}`);

    process.env.ROLE_CLOCK = "2027-01-17T02:01:00.000Z"; // 18:01 Pacific
    expect(await llms.GET().text()).not.toContain(`/roles/${usaSlug}`);
  });
});

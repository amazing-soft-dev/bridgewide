import { afterEach, describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { roles } from "@/content/site";
import { jobPosting } from "@/lib/structured-data";

afterEach(() => {
  delete process.env.ROLE_CLOCK;
  delete process.env.ROLE_CLOSE_DATES;
});

const slug = roles.find((role) => role.region === "usa")!.slug;

function closeUsa() {
  process.env.ROLE_CLOCK = "2027-01-17T04:00:00.000Z";
  process.env.ROLE_CLOSE_DATES = "region:usa=2027-01-16";
}

describe("closed role search metadata", () => {
  it("lists an open role in the sitemap", () => {
    expect(sitemap().some((entry) => entry.url.endsWith(`/roles/${slug}`))).toBe(true);
  });

  it("drops a closed role from the sitemap but keeps the open ones", () => {
    closeUsa();
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith(`/roles/${slug}`))).toBe(false);
    const asia = roles.find((role) => role.region === "asia")!.slug;
    expect(urls.some((url) => url.endsWith(`/roles/${asia}`))).toBe(true);
  });

  it("emits no JobPosting for a closed role", () => {
    closeUsa();
    expect(jobPosting(roles.find((role) => role.slug === slug)!)).toBeNull();
  });

  it("marks a closed role page noindex, follow, and an open one indexable", async () => {
    const { generateMetadata } = await import("./[slug]/page");
    const open = await generateMetadata({ params: Promise.resolve({ slug }) });
    expect(open.robots).not.toMatchObject({ index: false });
    closeUsa();
    const closed = await generateMetadata({ params: Promise.resolve({ slug }) });
    expect(closed.robots).toMatchObject({ index: false, follow: true });
  });
});

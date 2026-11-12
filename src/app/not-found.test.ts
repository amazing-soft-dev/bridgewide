import { describe, expect, it } from "vitest";
import { metadata, notFoundLinks } from "@/app/not-found";

describe("the 404 page", () => {
  it("keeps a bad link out of search results but lets crawlers follow its links", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("offers a way back to the home page, the roles board, and the desk", () => {
    expect(notFoundLinks.map((link) => link.href)).toEqual(["/", "/roles", "/contact"]);
  });
});

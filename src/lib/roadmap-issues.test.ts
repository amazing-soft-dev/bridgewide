import { describe, expect, it } from "vitest";
import { issueBody, normalizeTitle, planIssues } from "../../scripts/roadmap-issues-lib.mjs";

describe("roadmap issue planning", () => {
  it("ignores case and spacing when comparing titles", () => {
    expect(normalizeTitle("  Hold  dev to MAIN ")).toBe("hold dev to main");
  });

  it("skips a title that already exists, open or closed", () => {
    const { create, skip } = planIssues(
      [
        ["feat/1-a", "Desk digest", "body"],
        ["feat/2-b", "New thing", "body"],
      ],
      ["desk digest", "Something else"],
    );
    expect(create.map((item) => item.title)).toEqual(["New thing"]);
    expect(skip.map((item) => item.title)).toEqual(["Desk digest"]);
  });

  it("creates nothing the second time", () => {
    const items: [string, string, string][] = [["feat/1-a", "One", "b"], ["feat/2-b", "Two", "b"]];
    const first = planIssues(items, []);
    expect(first.create).toHaveLength(2);
    const second = planIssues(items, first.create.map((item) => item.title));
    expect(second.create).toHaveLength(0);
    expect(second.skip).toHaveLength(2);
  });

  it("does not create a title twice from one file", () => {
    const { create, skip } = planIssues([["a/1", "Same", "x"], ["a/2", "same", "y"]], []);
    expect(create).toHaveLength(1);
    expect(skip).toHaveLength(1);
  });

  it("rejects an item that is not [branch, title, body]", () => {
    expect(() => planIssues([["only-branch"] as unknown as [string, string, string]], [])).toThrow(
      /\[branch, title, body\]/,
    );
  });

  it("states the branch and the trailer rule in the body", () => {
    const text = issueBody({ branch: "feat/9-x", body: "Do it." });
    expect(text).toContain("Do it.");
    expect(text).toContain("`feat/9-x` from `origin/dev`");
    expect(text).toContain("two co-author trailers");
  });
});

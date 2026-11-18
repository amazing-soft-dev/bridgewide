import { describe, expect, it } from "vitest";
import { declaredTooLarge, MAX_CV_BYTES } from "@/lib/cv-file";

const withLength = (value?: string) =>
  new Request("https://example.test/api/cv", { method: "POST", headers: value === undefined ? {} : { "content-length": value } });

describe("declaredTooLarge", () => {
  it("passes a normal CV and a body with no length header", () => {
    expect(declaredTooLarge(withLength("200000"))).toBe(false);
    expect(declaredTooLarge(withLength(String(MAX_CV_BYTES)))).toBe(false);
    expect(declaredTooLarge(withLength(undefined))).toBe(false);
  });

  it("allows the other fields around a CV at the limit", () => {
    expect(declaredTooLarge(withLength(String(MAX_CV_BYTES + 100 * 1024)))).toBe(false);
  });

  it("refuses a declared 50 MB body", () => {
    expect(declaredTooLarge(withLength(String(50 * 1024 * 1024)))).toBe(true);
  });

  it("ignores a header that is not a number", () => {
    expect(declaredTooLarge(withLength("lots"))).toBe(false);
  });
});

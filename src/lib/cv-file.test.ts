import { describe, expect, it } from "vitest";
import { inspectCv, MAX_CV_BYTES } from "@/lib/cv-file";

describe("inspectCv", () => {
  it("accepts pdf, doc, and docx", () => {
    for (const name of ["cv.pdf", "cv.doc", "cv.docx"]) {
      const result = inspectCv({ name, type: "", size: 100 });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects a sixth megabyte", () => {
    const result = inspectCv({ name: "cv.pdf", type: "application/pdf", size: MAX_CV_BYTES + 1 });
    expect(result.ok).toBe(false);
  });

  it("rejects a mismatched extension", () => {
    const result = inspectCv({ name: "cv.pdf", type: "application/msword", size: 100 });
    expect(result.ok).toBe(false);
  });

  it("strips a path from the filename", () => {
    const result = inspectCv({ name: "C:\\users\\ada\\cv.pdf", type: "", size: 20 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.filename).not.toMatch(/[/\\]/);
  });
});

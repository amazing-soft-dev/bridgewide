import { describe, expect, it } from "vitest";
import { inspectCvContent } from "@/lib/cv-file";

const text = (value: string) => new TextEncoder().encode(value);
const bytes = (...values: number[]) => Uint8Array.from(values);

const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0, 0, 0];
const ZIP = [0x50, 0x4b, 0x03, 0x04, 0x14, 0, 0, 0];

function docx(entries: string): Uint8Array {
  return Uint8Array.from([...ZIP, ...text(entries)]);
}

describe("inspectCvContent", () => {
  it("accepts a PDF that starts with %PDF-, even with a short lead-in", () => {
    expect(inspectCvContent("cv.pdf", text("%PDF-1.7 rest"))).toEqual({ ok: true });
    expect(inspectCvContent("cv.pdf", text("   junk before %PDF-1.4"))).toEqual({ ok: true });
  });

  it("refuses a PDF with the marker far into the file", () => {
    expect(inspectCvContent("cv.pdf", text("x".repeat(2000) + "%PDF-1.4")).ok).toBe(false);
  });

  it("accepts a DOC with the OLE header and a DOCX that is a zip holding word/", () => {
    expect(inspectCvContent("cv.doc", bytes(...OLE))).toEqual({ ok: true });
    expect(inspectCvContent("cv.docx", docx("[Content_Types].xml word/document.xml"))).toEqual({ ok: true });
  });

  it("refuses a text file renamed to .pdf, .doc, or .docx", () => {
    for (const name of ["cv.pdf", "cv.doc", "cv.docx"]) {
      const result = inspectCvContent(name, text("This is just a note, not a CV."));
      expect(result.ok).toBe(false);
    }
  });

  it("refuses a Windows program renamed to cv.pdf", () => {
    const exe = Uint8Array.from([0x4d, 0x5a, 0x90, 0, 3, 0, 0, 0, ...text("This program cannot be run in DOS mode")]);
    expect(inspectCvContent("cv.pdf", exe).ok).toBe(false);
  });

  it("refuses a zip that is not a Word file, and a Word file saved under the wrong extension", () => {
    expect(inspectCvContent("cv.docx", Uint8Array.from([...ZIP, ...text("photo.jpg notes.txt")])).ok).toBe(false);
    expect(inspectCvContent("cv.pdf", docx("word/document.xml")).ok).toBe(false);
    expect(inspectCvContent("cv.doc", docx("word/document.xml")).ok).toBe(false);
  });

  it("refuses an empty file and an unknown extension", () => {
    expect(inspectCvContent("cv.pdf", new Uint8Array(0)).ok).toBe(false);
    expect(inspectCvContent("cv.exe", text("%PDF-1.4")).ok).toBe(false);
  });

  it("names the kind of file it expected", () => {
    const result = inspectCvContent("cv.pdf", text("nope"));
    expect(result).toEqual({ ok: false, error: "That file does not look like a real PDF. Upload a PDF, DOC, or DOCX file." });
  });
});

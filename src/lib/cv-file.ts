export const MAX_CV_BYTES = 5 * 1024 * 1024;

export const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const CV_HINT = "PDF, DOC, or DOCX. 5 MB maximum.";

const MIME_BY_EXT = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

type CvExt = keyof typeof MIME_BY_EXT;

export type CvFile =
  | { ok: true; filename: string; contentType: string }
  | { ok: false; error: string };

function extensionOf(name: string): CvExt | null {
  const base = (name.split(/[/\\]/).pop() ?? "").trim();
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return null;
  const ext = base.slice(dot + 1).toLowerCase();
  if (ext === "pdf" || ext === "doc" || ext === "docx") return ext;
  return null;
}

function safeFilename(name: string, ext: CvExt): string {
  const base = (name.split(/[/\\]/).pop() ?? "").trim();
  const cleaned = base.replace(/[^\w.\- ()]/g, "").slice(0, 180);
  if (cleaned.toLowerCase().endsWith(`.${ext}`) && cleaned.length > ext.length + 1) {
    return cleaned;
  }
  return `cv.${ext}`;
}

export function inspectCv(file: { name: string; type: string; size: number }): CvFile {
  if (file.size <= 0) return { ok: false, error: "Attach a CV." };

  const ext = extensionOf(file.name);
  if (!ext) return { ok: false, error: "Upload a PDF, DOC, or DOCX file." };

  const contentType = MIME_BY_EXT[ext];
  const mime = file.type.trim().toLowerCase();
  const genericMime = mime.length === 0 || mime === "application/octet-stream";
  if (!genericMime && mime !== contentType) {
    return { ok: false, error: "Upload a PDF, DOC, or DOCX file." };
  }

  if (file.size > MAX_CV_BYTES) {
    return { ok: false, error: "CV must be 5 MB or smaller." };
  }

  return { ok: true, filename: safeFilename(file.name, ext), contentType };
}

const OLE_HEADER = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ZIP_HEADER = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

/**
 * Check that the bytes are the kind of file the name says. The extension and
 * the type a browser declares are both chosen by the sender, so a renamed
 * program or text file would pass `inspectCv` alone.
 *
 * - PDF: "%PDF-" within the first 1024 bytes (the PDF rules allow some lead-in).
 * - DOC: the OLE compound-file header.
 * - DOCX: a zip whose entries include word/ (names are stored in the clear).
 */
export function inspectCvContent(filename: string, bytes: Uint8Array): { ok: true } | { ok: false; error: string } {
  const ext = extensionOf(filename);
  const buffer = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const wrong = { ok: false as const, error: `That file does not look like a real ${ext ? ext.toUpperCase() : "CV"}. Upload a PDF, DOC, or DOCX file.` };

  if (ext === "pdf") return buffer.subarray(0, 1024).includes("%PDF-") ? { ok: true } : wrong;
  if (ext === "doc") return buffer.subarray(0, 8).equals(OLE_HEADER) ? { ok: true } : wrong;
  if (ext === "docx") {
    return buffer.subarray(0, 4).equals(ZIP_HEADER) && buffer.includes("word/") ? { ok: true } : wrong;
  }
  return wrong;
}

/** Room for the other form fields and the multipart framing around a CV. */
const FORM_OVERHEAD_BYTES = 256 * 1024;

/**
 * True when the request says, in Content-Length, that its body is bigger than
 * a CV plus the other fields. Check it before request.formData(), which reads
 * the whole body into memory. A sender can leave the header off or lie, so the
 * size of the file itself is still checked after parsing.
 */
export function declaredTooLarge(request: Request): boolean {
  const declared = Number(request.headers.get("content-length"));
  return Number.isFinite(declared) && declared > MAX_CV_BYTES + FORM_OVERHEAD_BYTES;
}

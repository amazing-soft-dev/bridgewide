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

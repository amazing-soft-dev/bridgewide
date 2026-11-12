import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SubmissionKind =
  | "hire"
  | "cv"
  | "contact"
  | "salary-guide"
  | "talent-pool"
  | "ai-apply"
  | "partner";

export type SubmissionStatus = "received" | "in review" | "introduced" | "closed" | "paused" | "deleted";

export type Submission = {
  id: string;
  kind: SubmissionKind;
  at: string;
  status: SubmissionStatus;
  email: string;
  roleKey?: string;
  rightToWork?: string;
  consent?: { version: string; at: string };
  feeAcknowledged?: string;
  startDate?: string;
  guaranteeEnd?: string;
  reopenUsed?: boolean;
  body: string;
  filename?: string;
  fileBase64?: string;
};

type Database = {
  submissions: Submission[];
  digestDate?: string;
};

function directory(): string {
  return process.env.DESK_DATA_DIR?.trim() || path.join(process.cwd(), ".data", "desk");
}

function filePath(): string {
  return path.join(directory(), "submissions.json");
}

async function readDb(): Promise<Database> {
  try {
    const raw = await readFile(filePath(), "utf8");
    const parsed = JSON.parse(raw) as Database;
    return { submissions: parsed.submissions ?? [], digestDate: parsed.digestDate };
  } catch {
    return { submissions: [] };
  }
}

async function writeDb(db: Database): Promise<void> {
  await mkdir(directory(), { recursive: true });
  await writeFile(filePath(), JSON.stringify(db), "utf8");
}

export function newSubmissionId(): string {
  return `BW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listSubmissions(): Promise<Submission[]> {
  const db = await readDb();
  return db.submissions;
}

export async function saveSubmission(entry: Submission): Promise<void> {
  const db = await readDb();
  db.submissions.push(entry);
  await writeDb(db);
}

export async function findDuplicate(email: string, kind: SubmissionKind, roleKey?: string): Promise<Submission | undefined> {
  const db = await readDb();
  return db.submissions.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.kind === kind &&
      item.roleKey === roleKey &&
      item.status !== "deleted",
  );
}

export async function updateSubmission(id: string, patch: Partial<Submission>): Promise<Submission | undefined> {
  const db = await readDb();
  const current = db.submissions.find((item) => item.id === id);
  if (!current) return undefined;
  Object.assign(current, patch);
  await writeDb(db);
  return current;
}

export async function readDigestDate(): Promise<string | undefined> {
  return (await readDb()).digestDate;
}

export async function writeDigestDate(date: string): Promise<void> {
  const db = await readDb();
  db.digestDate = date;
  await writeDb(db);
}

export function canIntroduce(entry: Pick<Submission, "status" | "rightToWork">): boolean {
  if (entry.status === "paused" || entry.status === "deleted" || entry.status === "closed") return false;
  return Boolean(entry.rightToWork);
}

/** Guarantee ends 12 weeks after the start date. Contract records have no end date. */
export function guaranteeEnd(startDate: string, engagement: "Permanent" | "Contract"): string | undefined {
  if (engagement !== "Permanent") return undefined;
  const start = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return undefined;
  start.setUTCDate(start.getUTCDate() + 12 * 7);
  return start.toISOString().slice(0, 10);
}

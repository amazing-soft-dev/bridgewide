import path from "node:path";
import { createFileStore } from "@/lib/desk-store-file";

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
  /** Every field the visitor sent, as the desk email shows it. A CV is never part of it. */
  body: string;
};

/**
 * Everything the desk keeps. Callers use the functions below, which go to
 * whichever adapter is configured, so they never know where the data lives.
 */
export interface DeskStore {
  list(): Promise<Submission[]>;
  save(entry: Submission): Promise<void>;
  /** A live (not deleted) record with the same email (any case), kind, and role key. */
  findDuplicate(email: string, kind: SubmissionKind, roleKey?: string): Promise<Submission | undefined>;
  /** Merge a patch into a record and return it, or undefined when there is no such id. */
  update(id: string, patch: Partial<Submission>): Promise<Submission | undefined>;
  readDigestDate(): Promise<string | undefined>;
  writeDigestDate(date: string): Promise<void>;
}

function directory(): string {
  return process.env.DESK_DATA_DIR?.trim() || path.join(process.cwd(), ".data", "desk");
}

let fileStore: DeskStore | undefined;

/** The store in use. The file adapter is the only one so far. */
export function getDeskStore(): DeskStore {
  fileStore ??= createFileStore(directory);
  return fileStore;
}

export function newSubmissionId(): string {
  return `BW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function listSubmissions(): Promise<Submission[]> {
  return getDeskStore().list();
}

export function saveSubmission(entry: Submission): Promise<void> {
  return getDeskStore().save(entry);
}

export function findDuplicate(
  email: string,
  kind: SubmissionKind,
  roleKey?: string,
): Promise<Submission | undefined> {
  return getDeskStore().findDuplicate(email, kind, roleKey);
}

export function updateSubmission(id: string, patch: Partial<Submission>): Promise<Submission | undefined> {
  return getDeskStore().update(id, patch);
}

export function readDigestDate(): Promise<string | undefined> {
  return getDeskStore().readDigestDate();
}

export function writeDigestDate(date: string): Promise<void> {
  return getDeskStore().writeDigestDate(date);
}

/**
 * What a record keeps after a deletion request or after the 12-month limit:
 * its id, kind, time, and status, so counts still add up. Everything that
 * could identify the person is cleared, including the full message text.
 */
export function erasePatch(): Partial<Submission> {
  return {
    status: "deleted",
    email: "",
    body: "",
    roleKey: undefined,
    rightToWork: undefined,
    consent: undefined,
    feeAcknowledged: undefined,
    startDate: undefined,
    guaranteeEnd: undefined,
  };
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

import { neon } from "@neondatabase/serverless";
import path from "node:path";
import { createFileStore } from "@/lib/desk-store-file";
import { createPostgresStore, type SqlClient } from "@/lib/desk-store-postgres";

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
  /** What a hire brief asked for. The 12-week guarantee follows this, not anything sent later. */
  engagement?: "Permanent" | "Contract";
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
  /** Throws DuplicateSubmissionError when a live record for the same person, kind, and role exists. */
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

/** Thrown by save() when the unique rule refuses a second live record. */
export class DuplicateSubmissionError extends Error {
  constructor(
    readonly email: string,
    readonly kind: SubmissionKind,
    readonly roleKey?: string,
  ) {
    super("A live record already exists for this person, kind, and role.");
    this.name = "DuplicateSubmissionError";
  }
}

function neonClient(url: string): SqlClient {
  const sql = neon(url);
  return async (query, params = []) => (await sql.query(query, params)) as Record<string, unknown>[];
}

let current: { key: string; store: DeskStore } | undefined;

/**
 * The store in use. With DATABASE_URL set it is Postgres; otherwise it is the
 * JSON file under DESK_DATA_DIR, which is for local development and tests and
 * is not durable on Vercel.
 */
export function getDeskStore(): DeskStore {
  const url = process.env.DATABASE_URL?.trim();
  const key = url ? `postgres:${url}` : "file";
  if (!current || current.key !== key) {
    current = { key, store: url ? createPostgresStore(neonClient(url)) : createFileStore(directory) };
  }
  return current.store;
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

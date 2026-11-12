import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DeskStore, Submission, SubmissionKind } from "@/lib/desk-store";

type Database = {
  submissions: Submission[];
  digestDate?: string;
};

/**
 * Stores the desk records in one JSON file. It is for local development and
 * for tests. It is not durable on Vercel, and it reads and rewrites the whole
 * file, so two writes at the same moment can lose one.
 *
 * `directory` is a function so DESK_DATA_DIR is read on every call, which lets
 * a test point each case at its own folder.
 */
export function createFileStore(directory: () => string): DeskStore {
  const filePath = () => path.join(directory(), "submissions.json");

  async function readDb(): Promise<Database> {
    try {
      const parsed = JSON.parse(await readFile(filePath(), "utf8")) as Database;
      return { submissions: parsed.submissions ?? [], digestDate: parsed.digestDate };
    } catch {
      return { submissions: [] };
    }
  }

  async function writeDb(db: Database): Promise<void> {
    await mkdir(directory(), { recursive: true });
    await writeFile(filePath(), JSON.stringify(db), "utf8");
  }

  return {
    async list() {
      return (await readDb()).submissions;
    },

    async save(entry: Submission) {
      const db = await readDb();
      db.submissions.push(entry);
      await writeDb(db);
    },

    async findDuplicate(email: string, kind: SubmissionKind, roleKey?: string) {
      const db = await readDb();
      return db.submissions.find(
        (item) =>
          item.email.toLowerCase() === email.toLowerCase() &&
          item.kind === kind &&
          item.roleKey === roleKey &&
          item.status !== "deleted",
      );
    },

    async update(id: string, patch: Partial<Submission>) {
      const db = await readDb();
      const current = db.submissions.find((item) => item.id === id);
      if (!current) return undefined;
      Object.assign(current, patch);
      await writeDb(db);
      return current;
    },

    async readDigestDate() {
      return (await readDb()).digestDate;
    },

    async writeDigestDate(date: string) {
      const db = await readDb();
      db.digestDate = date;
      await writeDb(db);
    },
  };
}

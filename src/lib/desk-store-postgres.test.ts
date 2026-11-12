import { describe, expect, it, vi } from "vitest";
import { DuplicateSubmissionError, type Submission } from "@/lib/desk-store";
import { createPostgresStore, rowToSubmission, schemaStatements, type SqlClient } from "@/lib/desk-store-postgres";

// These tests check the SQL the adapter sends and how it maps rows. They do not
// run against a live database: the real Neon connection needs DATABASE_URL.

type Call = { query: string; params?: unknown[] };

function fakeSql(reply: (call: Call) => Record<string, unknown>[] = () => []) {
  const calls: Call[] = [];
  const sql: SqlClient = vi.fn(async (query, params) => {
    const call = { query, params };
    calls.push(call);
    return reply(call);
  });
  return { sql, calls, dataCalls: () => calls.filter((call) => !/^\s*create /i.test(call.query)) };
}

const entry: Submission = {
  id: "BW-1",
  kind: "hire",
  at: "2026-11-12T10:00:00.000Z",
  status: "received",
  email: "ada@example.com",
  roleKey: "Staff Engineer",
  engagement: "Permanent",
  rightToWork: "Yes",
  consent: { version: "v1", at: "2026-11-12T10:00:00.000Z" },
  feeAcknowledged: "20%",
  body: "Name: Ada\nMessage: hello",
};

describe("the Postgres adapter", () => {
  it("has no column that could hold a CV", () => {
    const ddl = schemaStatements.join("\n");
    expect(ddl).not.toMatch(/base64|filename|file|cv|attachment|bytea/i);
  });

  it("creates the tables and the one-live-record index once, however many calls follow", async () => {
    const { sql, calls } = fakeSql();
    const store = createPostgresStore(sql);
    await store.list();
    await store.readDigestDate();
    await store.findDuplicate("a@b.co", "contact");
    const creates = calls.filter((call) => /^\s*create /i.test(call.query));
    expect(creates).toHaveLength(schemaStatements.length);
    expect(creates.map((call) => call.query).join("\n")).toMatch(/unique index[\s\S]*lower\(email\)[\s\S]*status <> 'deleted'/);
  });

  it("tries to create the tables again after a failure", async () => {
    let fail = true;
    const { sql, calls } = fakeSql(() => {
      if (fail) {
        fail = false;
        throw new Error("connection refused");
      }
      return [];
    });
    const store = createPostgresStore(sql);
    await expect(store.list()).rejects.toThrow("connection refused");
    await expect(store.list()).resolves.toEqual([]);
    expect(calls.filter((call) => /^\s*create table if not exists submissions/i.test(call.query))).toHaveLength(2);
  });

  it("saves every field of a record with parameters, never by string-building", async () => {
    const { sql, dataCalls } = fakeSql((call) => (/^\s*insert into submissions/i.test(call.query) ? [{ id: "BW-1" }] : []));
    await createPostgresStore(sql).save(entry);
    const [insert] = dataCalls();
    expect(insert.query).toMatch(/on conflict do nothing\s+returning id/i);
    expect(insert.query).not.toContain("ada@example.com");
    expect(insert.params).toEqual([
      "BW-1",
      "hire",
      "2026-11-12T10:00:00.000Z",
      "received",
      "ada@example.com",
      "Staff Engineer",
      "Permanent",
      "Yes",
      "v1",
      "2026-11-12T10:00:00.000Z",
      "20%",
      null,
      null,
      false,
      "Name: Ada\nMessage: hello",
    ]);
  });

  it("throws DuplicateSubmissionError when the unique index refuses the row", async () => {
    const { sql } = fakeSql(() => []);
    await expect(createPostgresStore(sql).save(entry)).rejects.toBeInstanceOf(DuplicateSubmissionError);
  });

  it("looks for a duplicate case-insensitively and ignores deleted records", async () => {
    const { sql, dataCalls } = fakeSql((call) =>
      /from submissions/i.test(call.query)
        ? [{ id: "BW-1", kind: "hire", at: "2026-11-12T10:00:00Z", status: "received", email: "Ada@Example.com", body: "x" }]
        : [],
    );
    const found = await createPostgresStore(sql).findDuplicate("ada@example.com", "hire", "Staff Engineer");
    expect(found?.id).toBe("BW-1");
    const [select] = dataCalls();
    expect(select.query).toMatch(/lower\(email\) = lower\(\$1\)/);
    expect(select.query).toMatch(/status <> 'deleted'/);
    expect(select.params).toEqual(["ada@example.com", "hire", "Staff Engineer"]);
  });

  it("updates only the fields in the patch, and sets an explicit undefined to null", async () => {
    const { sql, dataCalls } = fakeSql(() => [
      { id: "BW-1", kind: "hire", at: "2026-11-12T10:00:00Z", status: "deleted", email: "", body: "" },
    ]);
    const updated = await createPostgresStore(sql).update("BW-1", { status: "deleted", email: "", rightToWork: undefined });
    const [update] = dataCalls();
    expect(update.query).toBe("update submissions set status = $2, email = $3, right_to_work = $4 where id = $1 returning *");
    expect(update.params).toEqual(["BW-1", "deleted", "", null]);
    expect(updated?.status).toBe("deleted");
  });

  it("clears the consent columns when the patch sets consent to undefined", async () => {
    const { sql, dataCalls } = fakeSql(() => [{ id: "BW-1", kind: "hire", at: "2026-11-12T10:00:00Z", status: "x", email: "", body: "" }]);
    await createPostgresStore(sql).update("BW-1", { consent: undefined });
    const [update] = dataCalls();
    expect(update.query).toContain("consent_version = $2");
    expect(update.query).toContain("consent_at = $3");
    expect(update.params).toEqual(["BW-1", null, null]);
  });

  it("returns undefined for an unknown id", async () => {
    const { sql } = fakeSql(() => []);
    expect(await createPostgresStore(sql).update("missing", { status: "closed" })).toBeUndefined();
  });

  it("reads and writes the digest date in desk_meta", async () => {
    const { sql, dataCalls } = fakeSql((call) => (/select value/i.test(call.query) ? [{ value: "2026-11-12" }] : []));
    const store = createPostgresStore(sql);
    expect(await store.readDigestDate()).toBe("2026-11-12");
    await store.writeDigestDate("2026-11-13");
    const write = dataCalls().find((call) => /insert into desk_meta/i.test(call.query));
    expect(write?.query).toMatch(/on conflict \(key\) do update/);
    expect(write?.params).toEqual(["2026-11-13"]);
  });
});

describe("rowToSubmission", () => {
  it("turns database values into the Submission shape", () => {
    const submission = rowToSubmission({
      id: "BW-1",
      kind: "hire",
      at: new Date("2026-11-12T10:00:00Z"),
      status: "received",
      email: "ada@example.com",
      role_key: null,
      engagement: "Contract",
      right_to_work: "Yes",
      consent_version: "v1",
      consent_at: "2026-11-12T10:00:00.000Z",
      start_date: new Date("2026-11-12T00:00:00Z"),
      guarantee_end: "2027-02-04",
      reopen_used: true,
      body: "hi",
    });
    expect(submission).toEqual({
      id: "BW-1",
      kind: "hire",
      at: "2026-11-12T10:00:00.000Z",
      status: "received",
      email: "ada@example.com",
      roleKey: undefined,
      engagement: "Contract",
      rightToWork: "Yes",
      consent: { version: "v1", at: "2026-11-12T10:00:00.000Z" },
      feeAcknowledged: undefined,
      startDate: "2026-11-12",
      guaranteeEnd: "2027-02-04",
      reopenUsed: true,
      body: "hi",
    });
  });

  it("leaves consent out unless both parts are present", () => {
    const row = { id: "x", kind: "cv", at: "2026-11-12T10:00:00Z", status: "received", email: "a@b.co", body: "b" };
    expect(rowToSubmission({ ...row, consent_version: "v1" }).consent).toBeUndefined();
    expect(rowToSubmission(row).reopenUsed).toBe(false);
  });
});

import {
  DuplicateSubmissionError,
  type DeskStore,
  type Submission,
  type SubmissionKind,
  type SubmissionStatus,
} from "@/lib/desk-store";

/** One query with $1, $2 placeholders. It returns the rows, or an empty array. */
export type SqlClient = (query: string, params?: unknown[]) => Promise<Record<string, unknown>[]>;

/**
 * The tables. See docs/decisions/desk-store.md. There is no CV column on
 * purpose: a CV only ever goes to the desk email.
 */
export const schemaStatements: readonly string[] = [
  `create table if not exists submissions (
    id               text primary key,
    kind             text not null,
    at               timestamptz not null,
    status           text not null,
    email            text not null,
    role_key         text,
    engagement       text,
    right_to_work    text,
    consent_version  text,
    consent_at       timestamptz,
    fee_acknowledged text,
    start_date       date,
    guarantee_end    date,
    reopen_used      boolean not null default false,
    body             text not null
  )`,
  // One live record per person, kind, and role. A deleted record does not count.
  `create unique index if not exists submissions_one_live
    on submissions (lower(email), kind, coalesce(role_key, ''))
    where status <> 'deleted'`,
  `create table if not exists desk_meta (
    key   text primary key,
    value text not null
  )`,
];

const engagement = (value: unknown): Submission["engagement"] =>
  value === "Permanent" || value === "Contract" ? value : undefined;

const text = (value: unknown): string | undefined =>
  value === null || value === undefined ? undefined : String(value);

const iso = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

/** A `date` column comes back as a Date or as "2027-02-04"; keep only the day. */
const day = (value: unknown): string | undefined => iso(value)?.slice(0, 10);

export function rowToSubmission(row: Record<string, unknown>): Submission {
  const consentVersion = text(row.consent_version);
  const consentAt = iso(row.consent_at);
  return {
    id: String(row.id),
    kind: String(row.kind) as SubmissionKind,
    at: iso(row.at) ?? "",
    status: String(row.status) as SubmissionStatus,
    email: String(row.email),
    roleKey: text(row.role_key),
    engagement: engagement(row.engagement),
    rightToWork: text(row.right_to_work),
    consent: consentVersion && consentAt ? { version: consentVersion, at: consentAt } : undefined,
    feeAcknowledged: text(row.fee_acknowledged),
    startDate: day(row.start_date),
    guaranteeEnd: day(row.guarantee_end),
    reopenUsed: row.reopen_used === true,
    body: String(row.body),
  };
}

/** Column for each patchable Submission field, in the order they are written. */
const patchColumns: Partial<Record<keyof Submission, string>> = {
  status: "status",
  email: "email",
  roleKey: "role_key",
  engagement: "engagement",
  rightToWork: "right_to_work",
  feeAcknowledged: "fee_acknowledged",
  startDate: "start_date",
  guaranteeEnd: "guarantee_end",
  reopenUsed: "reopen_used",
  body: "body",
};

export function createPostgresStore(sql: SqlClient): DeskStore {
  let ready: Promise<void> | undefined;

  /** Create the tables once per server instance. Every statement is idempotent. */
  function ensureSchema(): Promise<void> {
    ready ??= (async () => {
      for (const statement of schemaStatements) await sql(statement);
    })().catch((error) => {
      ready = undefined;
      throw error;
    });
    return ready;
  }

  return {
    async list() {
      await ensureSchema();
      return (await sql("select * from submissions order by at asc, id asc")).map(rowToSubmission);
    },

    async save(entry: Submission) {
      await ensureSchema();
      const inserted = await sql(
        `insert into submissions
           (id, kind, at, status, email, role_key, engagement, right_to_work, consent_version, consent_at,
            fee_acknowledged, start_date, guarantee_end, reopen_used, body)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         on conflict do nothing
         returning id`,
        [
          entry.id,
          entry.kind,
          entry.at,
          entry.status,
          entry.email,
          entry.roleKey ?? null,
          entry.engagement ?? null,
          entry.rightToWork ?? null,
          entry.consent?.version ?? null,
          entry.consent?.at ?? null,
          entry.feeAcknowledged ?? null,
          entry.startDate ?? null,
          entry.guaranteeEnd ?? null,
          entry.reopenUsed ?? false,
          entry.body,
        ],
      );
      // No row back means the unique index refused it: a live record already exists.
      if (inserted.length === 0) throw new DuplicateSubmissionError(entry.email, entry.kind, entry.roleKey);
    },

    async findDuplicate(email: string, kind: SubmissionKind, roleKey?: string) {
      await ensureSchema();
      const rows = await sql(
        `select * from submissions
          where lower(email) = lower($1) and kind = $2 and coalesce(role_key, '') = coalesce($3, '')
            and status <> 'deleted'
          order by at asc limit 1`,
        [email, kind, roleKey ?? null],
      );
      return rows[0] ? rowToSubmission(rows[0]) : undefined;
    },

    async update(id: string, patch: Partial<Submission>) {
      await ensureSchema();
      const sets: string[] = [];
      const params: unknown[] = [id];
      for (const [key, column] of Object.entries(patchColumns)) {
        if (!(key in patch)) continue;
        params.push((patch as Record<string, unknown>)[key] ?? null);
        sets.push(`${column} = $${params.length}`);
      }
      if (patch.consent !== undefined || "consent" in patch) {
        params.push(patch.consent?.version ?? null);
        sets.push(`consent_version = $${params.length}`);
        params.push(patch.consent?.at ?? null);
        sets.push(`consent_at = $${params.length}`);
      }
      if (sets.length === 0) {
        const rows = await sql("select * from submissions where id = $1", [id]);
        return rows[0] ? rowToSubmission(rows[0]) : undefined;
      }
      const rows = await sql(`update submissions set ${sets.join(", ")} where id = $1 returning *`, params);
      return rows[0] ? rowToSubmission(rows[0]) : undefined;
    },

    async readDigestDate() {
      await ensureSchema();
      const rows = await sql("select value from desk_meta where key = 'digest_date'");
      return rows[0] ? String(rows[0].value) : undefined;
    },

    async writeDigestDate(date: string) {
      await ensureSchema();
      await sql(
        `insert into desk_meta (key, value) values ('digest_date', $1)
         on conflict (key) do update set value = excluded.value`,
        [date],
      );
    },
  };
}

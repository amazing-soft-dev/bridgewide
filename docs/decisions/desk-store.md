# Decision: where the desk keeps submissions

Status: accepted 2026-11-12. Issue #277. Roadmap items C1 to C3, C5, C10, C11.

## Problem

`src/lib/desk-store.ts` writes every submission to `.data/desk/submissions.json`. On Vercel the filesystem is read-only or per-instance and does not survive between invocations. So records, duplicate checks, the role-digest "last sent" date, status changes, and the 12-month retention job do not persist. The file is also read, changed, and written whole, so two submissions at once can lose one.

## Decision

1. **A Postgres database holds the records.** The first choice is Neon Postgres from the Vercel Marketplace, through the `@neondatabase/serverless` driver. It is selected when `DATABASE_URL` is set.
2. **The file adapter stays** for local development and for tests. With no `DATABASE_URL`, the app uses `DESK_DATA_DIR` (default `.data/desk`) exactly as today. The README says the file adapter is not durable on Vercel.
3. **One interface** (`DeskStore`) sits in front of both, so callers do not know which is in use.
4. **A record keeps every field that was emailed to the desk**, including the full message text. This was the owner's decision on 2026-11-12.
5. **A record never holds a CV.** The CV is attached to the desk email and nowhere else: no file bytes, no base64, no file name, no storage key. The retention job and the privacy notice say the CV email sits in the desk mailbox and the desk deletes it on the same schedule.
6. **Deletion and expiry anonymize.** They clear email, full message, right to work, consent, fee, and date fields, and keep `id`, `kind`, `status`, and `at` so counts and the audit trail still work.

## Schema

```sql
create table if not exists submissions (
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
);

-- One live record per person, kind, and role. Deleted records do not count.
create unique index if not exists submissions_one_live
  on submissions (lower(email), kind, coalesce(role_key, ''))
  where status <> 'deleted';

create table if not exists desk_meta (
  key   text primary key,
  value text not null
);
```

`desk_meta` holds `digest_date`, the Pacific date the role digest last went out.

## Environment

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | Neon connection string. When set, the Postgres adapter is used. |
| `DESK_DATA_DIR` | Folder for the file adapter. Default `.data/desk`. |

## Not decided here

- The shared rate limiter (roadmap C6) still needs a store; the same database is the likely home.
- Backups and point-in-time recovery are a Neon plan setting, and they hold personal data. The privacy notice should name that retention.
- Alternative if Postgres is rejected: Upstash Redis, with records kept as JSON documents. It is simpler but weaker for reporting and for the unique rule above.

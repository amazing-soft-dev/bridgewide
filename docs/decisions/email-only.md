# Decision: every form goes straight to email, and nothing is stored

Status: accepted 2026-11-12. Issue #308. Replaces the desk-store decision (issue #277), which chose Postgres.

## Decision

1. **No database, no file store, no records.** Each form becomes two emails through Resend: the whole message to the desk, and a short confirmation to the visitor. Both quote one generated reference.
2. **A CV is an attachment on the desk email and nowhere else.**
3. **Status, follow-up, and the 12-week guarantee live in the desk mailbox**, not in code.
4. **Retention and deletion are mailbox policies.** The 12-month talent-pool promise is a retention rule on the desk mailbox. A deletion request is answered by deleting the messages.
5. **The role digest needs no memory.** The cron runs once each weekday and emails the desk the open and closed titles.

## What was removed

The `DeskStore` interface, the file and Postgres adapters, the Neon driver, `DATABASE_URL` and `DESK_DATA_DIR`, duplicate detection, `POST /api/desk/record`, the status emails, the guarantee dates and right-to-work gate, and the 12-month retention cron.

## What this costs

- **No duplicate check.** Two posts make two emails.
- **No shared rate limit.** The in-memory limit only slows one warm server. Turnstile is the real defence.
- **No lost-lead safety net.** If Resend fails after the visitor sees nothing sent, the visitor is told it failed and can retry. Nothing is queued.
- **Reporting is whatever the mailbox can do.** If the desk later needs pipeline reports, an applicant tracking system (Greenhouse, Ashby, Lever) or a CRM (HubSpot) is the next step, and the email stays the hand-off.

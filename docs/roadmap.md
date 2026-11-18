# BridgeWide roadmap

Status: **draft awaiting your approval.** No code, branch, or issue has been changed or created from this document. Written 2026-11-12.

Sources: the repo at `origin/dev` (`a0336d0`, merge of PR #260), the uncommitted working tree on `feat/185-desk-update`, the closed GitHub issues, a clean checkout of `HEAD` tested locally, and the two plans you supplied (the ten edge cases and the 71-issue "BridgeWide update roadmap"). Items marked **[verify]** are claims I could not confirm from code alone.

---

## Status (updated 2026-11-12, after Waves 0 to 2)

**The design changed: nothing is stored.** On 2026-11-12 the owner decided every form goes straight to email and there is no database (see `docs/decisions/email-only.md`). That removes or replaces everything below that depended on a store.

### What shipped

| Area | Issues |
| --- | --- |
| Repair and process | #264 restore after #262; #266 release label holds `dev` into `main`; #267 LF endings; #268 plan and roadmap; #269 safe roadmap script |
| Listings | #271 per-role close dates; #272 open counts at render time; #273 five-minute revalidation; #274 closed roles noindex and out of the sitemap; #275 digest failure is logged; #276 close-boundary tests |
| Email-only | #308 remove the store, status workflow, retention cron, and Neon driver; #322 retry a failed send |
| Spam and uploads | #313 Cloudflare Turnstile; #319 CV content check; #321 413 before reading a big body |
| Security and errors | #314 security.txt; #317 security headers; #325 404, error, and global error pages; #331 env check at start |
| Content and legal drafts | #309 country labels; #327 privacy notice; #329 agency, equal-opportunity, accommodation, and AI-training disclosures |
| Forms | #333 focus the first invalid field |

### Answered on 2026-11-13

- **Stat proof (F1):** trailing 12 months, a placement counts when the engineer has started work, with a footnote under each figure. This is already how the site works (`stats` in `src/content/site.ts`, checked by `src/content/stats.test.ts`). Update the figures and `contentUpdatedOn` together, because the period end follows that date.
- **Permissions (F2):** written permission is on file for every named client and consultant. Recorded in `docs/permissions-log.md`, with a test that fails when the site names someone the log does not list. The dates and storage locations are still to fill in.
- **Case study shape (F3):** a permanent hire made fast (challenge, approach, result, with a metric headline and a named quote). Still needs the client, the quote with the speaker's name and title, the days from brief to start, and the permission row for the speaker.

### Done on 2026-11-13

- **Contrast (#339):** the axe scan now fails on every rule, including color-contrast, and passes on all 11 pages. Muted and red text take their colour from the nearest background, and the brand red fill went from #f30100 to #ec0000 so white text on it passes (4.60:1).
- **Asia notice period (#375):** "1 to 3 months" on both roles, on the page and in the posting text. Client names are still to come.
- **Close dates:** roles stay open until filled; there are no dates to set.
- **Sentry (#380):** wired in and off until `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` are set in Vercel (then redeploy: the browser value is baked in at build time).

### Removed or replaced by the email-only decision

| Item | Now |
| --- | --- |
| C1 to C3, C5, C10, C11, D2 (store, Postgres, file adapter, anonymize, digest date, guarantee from record) | Built, then removed in #308. Replaced by `docs/decisions/email-only.md` |
| C6 shared rate limit | Not possible without a store. Turnstile (C7) is the defence; the per-instance limit stays as a speed bump |
| C8 mail outbox | Replaced by an inline retry (#322) |
| C9 duplicate rule | Dropped: no records to compare |
| C4 CV storage | Dropped earlier: the CV is an attachment only |
| D1, D3, 5.x desk workflow, status mail, 12-week guarantee clock | Dropped: the desk works from the inbox |
| C10 retention job | Now a mailbox retention policy, stated in the privacy notice. **The desk must set the rule in its mail system** |

### Still open

| Item | Waiting on |
| --- | --- |
| B7 Asia notice period and client name | The values for the two Asia roles, and each client's agreement to be named |
| B1 real close dates | Each role's date (roles stay open until then) |
| B8, E9 pay-basis wording and pay transparency | Counsel per market |
| F1 stat footnotes | The period and the counting rule for 186, 94%, 9 and 11 |
| F2 permissions log | Whether clients and consultants agreed in writing |
| F3 named-client case study | Client, quote, one measured result, permission |
| F5 salary-guide method | Sample size and collection dates |
| E1 market matrix | The legal firm's name and contact |
| I1 error monitoring, I4 cron health | An account (for example Sentry) and where to alert |
| C12 SPF, DKIM, DMARC | DNS access for bridgewide.org |
| C14 static export | A decision to keep or drop the GitHub Pages build |
| H, J tests and release checks | More browser tests; one real send from each contact form after deploy |
| Turnstile keys, `CRON_SECRET`, mailbox retention rule | Set in Vercel and the mail system |

---

## 1. Reality check (read this first)

Three facts change what "the plan" means.

1. **Your 71-issue plan has already been executed.** GitHub issues **#185 to #259 (75 issues) are all closed** and their titles match your plan one-to-one: "Drop the placeholder comments", "README says five regions", "Consultant country line", "Measurable case study", "32 live AI-training openings", "Desk digest", "Right to work", "Twelve-month retention", the test issues, and so on. PR **#260** merged `feat/185-desk-update` into `dev`. Creating 50+ more issues from the same list would duplicate them.
2. **The uncommitted working tree is a stale rollback of that shipped work.** It deletes `forms-live.ts`, the talent-pool route and form, the right-to-work and close-date logic, and rewrites the privacy and terms pages back to "A placeholder, not a policy". It matches the *old* state your plan describes ("forms email one inbox"). Against `HEAD` it fails type check and 13 tests.
3. **`HEAD` is healthy.** A clean checkout of `HEAD` passes **16 test files, 50 tests**. `tsc` reports one error (`LayoutProps` not found), which is the type that `next typegen` generates; `npm run typecheck` runs typegen first **[verify in CI]**. A search of `HEAD` for "placeholder" or "sample" in `src/`, README and plan finds only `plan.md:102` ("Short placeholder legal pages") and the word "sampled" in a colour note.

So the useful work is not "do the 71 issues". It is: (a) discard the stale edits, (b) fix what the shipped version gets wrong, (c) close the gaps your plan and I both found, and (d) re-run the release checks.

**Step 0 (needs your approval):** discard the uncommitted changes (`git restore` of the 30 modified and 3 deleted files) after saving a patch of them to the scratchpad, so nothing is lost. I will not do this until you say so.

---

## 2. Decisions on record

From you (2026-11-12):

- Keep the desk feature.
- All content is real. Remove anything marked "placeholder" or "sample" (the words, not the content). Asia roles and the Lumen Pay story are real and stay. **Mei Tan's portrait stays.**
- All markets are in scope: US, Canada, EU, UK, LATAM, Asia.
- Five regions everywhere (README, plan, copy, tests).
- Portraits show `Country (Region)`; a named city shows `City, Country (Region)`.
- A served region with no open role offers a 12-month keep-profile form at `/contact#keep-profile`.
- After a role's close date it shows as closed (same URL, no apply), and a desk-only email reports open versus closed.
- Do not email a talent-pool candidate when a later role opens. The digest never includes CVs or candidate names.
- Every commit ends with the two co-author trailers.
- Do not touch code until you approve this plan.

Answered in review (2026-11-12):

- **Release hold: a `release` label on the `dev` to `main` PR.** Branches still auto-merge into `dev`; `main` (production) waits for the label. This is issue A1 and goes first.
- **CVs are not stored.** They are only emailed to the desk. No CV bytes, base64, or file keys in any database or object store. Issues C4 and C5 are dropped (below).
- **The 32 AI-training cards are verified by you.** I will not re-verify them. I will ask, with selectable options, only about a specific card if something looks unclear.
- **Case study is a named client quote** (still need the client, quote, one measured result, and written permission).

Answered in the third review round (2026-11-12):

- **Records keep everything that is emailed to the contact address**, meaning every form field and the full message text, for all form kinds. The CV file itself is still email-only (an earlier answer), so the record keeps no CV bytes and no file key. Consequence: the full text is personal data in the database, so retention (C10), consent records (E4), the data-request path (E5) and the privacy notice must all cover it.
- **Asia roles gain a notice period and the client name** on both roles. This replaces your earlier line that kept those off the listing. The client name shows on both roles (no role is Confidential), in the page and in `JobPosting.hiringOrganization` alongside BridgeWide. I need the values (section 8).
- **Close dates:** roles stay open until you send each date. Unchanged; B1 removes the shared `2027-01-16`.
- **Labels:** Priya Raman is in New York, so her country is the United States. A bracket is dropped when it repeats the country, so `Canada` and `United States` stand alone. `United Kingdom (Europe)`, `Mexico (LATAM)`, `Singapore (Asia)` and the city forms keep their brackets.
- **Legal review:** one multi-jurisdiction firm signs off all six markets. The firm's name is still to come.
- **Inboxes:** only `michael.allen@bridgewide.org` exists, so it is used for every purpose (hiring, candidates, press, privacy and data requests). Role addresses are not created now. Risk noted in F6.
- **Case study format: challenge, approach, result**, with the named client quote under the result and a metric headline. I need the details (section 8).

Defaults I chose where you gave no answer (reversible; say so and I will change them):

- **Records store:** Neon Postgres (Vercel Marketplace) holding every submitted field and the full message text, plus id, kind, status, consent version and time, right-to-work, and guarantee dates. No CV bytes. This is needed for duplicate checks, the digest date, status mail, and the limiter. Alternative: Upstash Redis.
- **Training-card markup:** keep `JobPosting` as shipped, since you verified the cards, but record each card's source URL and verification date in the data file, and note the policy risk that a posting for a job BridgeWide does not hold can draw a Google action.

---

## 3. Your ten edge cases: where each stands

| # | Your point | State at `HEAD` | What is left |
| --- | --- | --- | --- |
| 1 | Keep resume and profile on `/contact` when a served region has no open role | Built (`TalentPoolForm`, `/api/talent-pool`, `#keep-profile` links) | Persistence on Vercel (C-group); delete personal fields on expiry (E-group); e2e for prefill (H-group) |
| 2 | Keep Mei Tan's portrait; remove "placeholder" and "sample"; sweep everything | Content is clean in `src/`; `plan.md` line 102 still says "placeholder legal pages" | Fix `plan.md`; keep the word-sweep test; re-run the sweep after Step 0 |
| 3 | Closed-role page and a desk report of open versus closed | Built (`isRoleOpen`, closed banner, `/api/cron/role-digest`) | **Closing is only correct at build time** (see B-group); digest needs persisted "already sent" state and failure alerts |
| 4 | README says five regions | Done in `HEAD` README | `plan.md:92` still says "Four regions" |
| 5 | Country (Region) on portraits | Built (`country`, `regionLabel`) | Decide the redundant labels `Canada (Canada)` and `United States (USA)`; confirm Priya Raman's country |
| 6 | Asia roles are real; ask what data is missing | Both roles present | I need the list of missing fields from you (section 8) |
| 7 | Confirm both contact forms | Shared `ContactForm`; unit tests on `/api/contact`; one e2e spec | Full checklist in group H (keyboard, reduced motion, failure feedback, subject and body) as automated tests |
| 8 | A short case study with a measurable outcome | Anonymized Canada story exists, but its outcome is the published *median* | Needs a real engagement's facts (F3) |
| 9 | Review layouts, run all checks, check metadata, confirm production | Issues #241 to #245 closed | Re-run after the fixes below; confirm one real send per form on production |
| 10 | More testing | 16 files, 50 tests; one Playwright spec | Group H adds what is still missing |

---

## 4. Your 71 issues triaged against `HEAD`

Spot-checked by presence of the code and a closed issue; I did not re-read every diff. Status key: **Done** = shipped, nothing to do. **Fix** = shipped but a defect or a conflict with your decisions. **Gap** = not covered.

| Your issues | Topic | Status | Note |
| --- | --- | --- | --- |
| 1 to 4, 61 | Word sweep, README, plan | Done, except `plan.md` | Fix `plan.md:92` and `:102` |
| 5, 6 | Country lines | Done | Confirm redundant labels (section 8) |
| 7 | Case study | **Fix** | Outcome is the median, not a measured result |
| 8 to 12 | SLA copy, apply line, salary guide, tags, stats basis | Done | Stats still lack a period and definition (F1) |
| 13, 14 | Privacy, terms | Done at `HEAD` | Counsel review per market still open (E-group) |
| 15 | 32 AI-training openings | **Fix** | Sourced from aggregators; markup risk (F4) |
| 16 | Close-date field | **Fix** | `HEAD` sets `closesOn: rolesCloseOn` (`2027-01-16`) on **every** role, which your plan says not to do |
| 17 to 21 | Closed page, counts, empty region, JobPosting | **Fix** | No `revalidate` anywhere; counts computed at import (B-group) |
| 22, 23 | Digest, idempotency | **Fix** | The "already sent" date is in a JSON file that does not persist on Vercel |
| 24 | Search tokens | Done | |
| 25 to 28 | Hire brief, AI consent, copy | Done | |
| 29 to 34 | Contact topic, subject, failure, keyboard, reduced motion, AI parity | Done in code | Only one e2e spec; automate each (H-group) |
| 35 to 39 | Talent pool, static export | Done | Static export cannot post; see C14 |
| 40 to 43, 62 to 70 | Tests | Partly done | e2e covers contact only (H-group) |
| 44 to 50 | Submission record, CV store, rate limit, duplicate, confirmation, delete, retention | **Fix** | File store plus in-memory limiter do not work on Vercel (C-group) |
| 51 to 56 | Scoping call, fee, guarantee, right to work, partner, status mail | Done | Status changes are a hand-made `POST` with a shared token (D-group) |
| 57 to 60 | Layout review, checks, metadata, production | Done once | Repeat at the end |
| 71 | Asia right to work | **[verify]** | Confirm the line renders on both Asia roles |

---

## 5. Review of your plan: risks and missing best practices

(Items 4 and 5 below are narrowed by your CV decision: with email-only CVs, the file-storage parts fall away, but the extension-only check and the retention of the mailbox copy remain. Item 7 is narrowed by your verification of the cards.)

These are new points, ordered by how much they can hurt.

1. **Every merged branch reaches production automatically.** `merge-passing-pr.yml` merges a green PR into `dev`, then the `dev` to `main` PR merges itself, and Vercel deploys `main`. Your plan puts the release review (57 to 60) *after* the content work, but each issue would already be live. A half-finished state (for example a privacy page mid-rewrite) goes public. Fix: hold the `dev` to `main` merge until a release label is set, or have Vercel hold production promotion; push branches in dependency waves.
2. **Closed roles do not close at 18:00 Pacific.** `app/roles/[slug]/page.tsx` uses `generateStaticParams` and `dynamicParams = false`, and `site.ts` computes `openRoleCount` and the announcement text at module load. With no `revalidate`, "open" or "closed" is frozen at build time or per server instance. Fix: evaluate the clock per request or revalidate at the close instant (on-demand revalidation from the digest cron), and add a test that advances `ROLE_CLOCK` across the boundary.
3. **The store does not survive Vercel.** `desk-store.ts` writes `.data/desk/submissions.json`. Records, duplicates, the digest date, and the retention job all depend on it. The in-memory rate limiter has the same flaw, and the read-modify-write races under concurrent posts. Your issue 44 defers the choice ("chosen at the start of this issue from the existing host"); it must be decided before issues 22, 23, 46, 47 and 50 mean anything.
4. **Deletion keeps personal data.** The retention cron and `deleted` status clear the file but leave `email` and `body` in the record, and the CV was already emailed as an attachment into a mailbox.
5. **CV checks trust the extension and declared type.** No magic-byte check, no malware scan, size not enforced while streaming.
6. **Spam defence is a honeypot only.**
7. **Sourcing of the 32 AI-training cards.** The sources named are aggregators (Finder, AgentHustles, Parailabs), not the platforms. Google's job-posting rules expect a posting for a job the poster actually holds; markup naming a platform as `hiringOrganization` for a role BridgeWide cannot show an authorization for risks a manual action. I also cannot verify September and October 2026 pay figures, and a few look odd ("Invisible Meridial", a $8/hr Mexico Android evaluator).
8. **The case study is circular.** "11 days is the published median" is not a measured outcome.
9. **Branch naming.** Your earlier run used plan numbers (`feat/7-case-study`); CONTRIBUTING says the *GitHub issue number* goes in the branch so `Closes #N` works. Use real issue numbers.
10. **Cron auth.** The bearer token is compared with `===`, and with no `CRON_SECRET` the routes are open whenever `NODE_ENV` is not `production`.
11. **Missing page types and hardening:** no `not-found.tsx`, `error.tsx` or `global-error.tsx`; no security headers or CSP; no error monitoring; no alert when a cron misses a run.
12. **Compliance across all markets:** privacy and terms need per-market review (GDPR and UK GDPR, CCPA and CPRA, PIPEDA and Quebec Law 25, LGPD, Singapore PDPA); pay-transparency rules (EU directive, several US states); equal-opportunity and agency-disclosure text. Counsel decides; I only prepare the checklist.
13. **Line endings.** Files are CRLF on disk and LF in git, so Git warns on every file and exact-match patches fail.
14. **Source-reading tests.** Tests that `readFileSync` a component (the salary-guide footer test) break on copy edits and prove no behavior.
15. **Roadmap script.** `scripts/open-roadmap-issues.mjs` is untracked, depends on a JSON file that is not committed, and would create duplicates if re-run.

---

## 6. Remaining work: the delta backlog

About **70 candidate issues**, each its own branch from the latest `origin/dev`, named `<prefix>/<real-issue-number>-<slug>`, small enough for one to three commits. Groups marked (gated) wait on an answer from section 8. Acceptance lines are one sentence each.

### A. Baseline and process

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| A1 | `ci/hold-main-until-release` | `dev` to `main` merges only when a release label is present |
| A2 | `docs/refresh-plan-md` | `plan.md` has no "Four regions", no "placeholder legal pages", no "ready to build" |
| A3 | `build/gitattributes-lf` | `.gitattributes` forces LF; one normalizing commit; no CRLF warnings |
| A4 | `ci/roadmap-issues-script` | Script is committed, has `--dry-run`, and skips titles that already exist |
| A5 | `docs/readme-persistence` | README describes the real store, env vars, and crons |

### B. Listings and close rules

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| B1 | `fix/per-role-close-date` | `rolesCloseOn` is no longer applied to every role; only dates you supply are set; others stay open |
| B2 | `fix/closed-state-at-request-time` | A role flips to closed within minutes of 18:00 Pacific on its close date without a redeploy |
| B3 | `fix/open-counts-per-request` | Announcement, region counts, `/llms.txt` and sitemap count open roles at request or revalidate time |
| B4 | `fix/closed-role-metadata` | Closed page keeps 200, emits no `JobPosting`, and carries the metadata you choose (section 8) |
| B5 | `feat/digest-failure-alert` | A failed digest send is logged and alerts the desk by a second channel |
| B6 | `feat/close-boundary-tests` | Tests cross both DST changes and a close at 17:59 versus 18:01 Pacific |
| B7 | `feat/asia-notice-and-client` (gated) | Singapore and Bangalore each show a notice period and the client name on the page, in the description, and in `JobPosting.hiringOrganization` with BridgeWide; right-to-work line verified on both; test fixtures updated |
| B8 | `feat/role-pay-basis` (gated) | Each posting states range, currency, and basis; per-market wording confirmed by counsel |

### C. Persistence and delivery

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| C1 | `docs/store-decision` (gated) | One store chosen for records, files, limiter, and digest date |
| C2 | `feat/store-interface` | Submissions go through one interface with a file adapter for tests |
| C3 | `feat/store-database` | Records live in the chosen database; a concurrent-submit test passes |
| C4 | *dropped* | CVs stay email-only (your decision); no file storage |
| C5 | `fix/cv-email-only-records` | Records never hold `fileBase64` or `filename`; the desk email carries the CV; tests assert no file data is saved |
| C6 | `feat/shared-rate-limit` | The limit holds across instances and uses the platform-verified IP |
| C7 | `feat/form-challenge` | An invisible challenge (for example Turnstile) is checked server-side on public forms, with a keyboard-accessible fallback |
| C8 | `feat/mail-outbox-retry` | A forced Resend outage still notifies the desk exactly once after recovery |
| C9 | `fix/duplicate-rule` | A second role by the same person creates a record; an exact repeat inside a window returns the old id |
| C10 | `fix/retention-deletes-personal-data` | Expiry removes or anonymizes email, full message text, and every personal field in the record and logs a count; the privacy notice says the CV email sits in the desk mailbox and the desk deletes it on the same schedule |
| C11 | `fix/digest-state-persisted` | Two digest runs on one Pacific date send one email across restarts |
| C12 | `docs/email-authentication` | SPF, DKIM, DMARC documented and a test message verified |
| C13 | `fix/cron-auth` | Constant-time compare; missing secret fails closed unless an explicit dev flag is set |
| C14 | `ci/static-export-decision` (gated) | Static export is removed, or documented and tested, with no `rm -rf src/app/api/cron` step |

### D. Desk workflow

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| D1 | `feat/status-audit-log` | Every status change records actor and time; append-only |
| D2 | `fix/guarantee-from-record` | Guarantee end uses the record's engagement, not the request body |
| D3 | `feat/crm-handoff` (gated) | Each submission creates a record in the CRM or ATS you use, with retry |

### E. Privacy and compliance (all markets)

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| E1 | `docs/privacy-market-matrix` | A checklist of notice items per market, sent to the one multi-jurisdiction firm and signed off by it |
| E2 | `feat/privacy-notice-final` | Notice names controller, purposes, recipients, transfers, retention, rights |
| E3 | `feat/terms-final` | Terms reviewed; fee and guarantee wording matches `fees` |
| E4 | `feat/consent-records-all-forms` | Hire, contact, salary guide, talent pool, AI forms store basis and version |
| E5 | `feat/data-request-path` | A tracked request with identity check and a response deadline |
| E6 | `docs/subprocessors` | Resend, Vercel, database, storage listed with purpose and location |
| E7 | `feat/equal-opportunity-and-agency-text` | EO statement, agency disclosure, free-to-candidates line, accommodation contact |
| E8 | `feat/ai-training-disclosure` | Page states the platform pays and sets terms, and how matching is done |
| E9 | `docs/pay-transparency-review` (gated) | Per-market pay-range rules checked; copy changed where required |
| E10 | `docs/analytics-statement` | Statement matches a browser network capture |

### F. Content integrity

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| F1 | `docs/stat-basis` (gated) | 186, 94%, 9 and 11 each show period and definition |
| F2 | `docs/permissions-log` (gated) | Each named client (including the two Asia clients now shown by name) and consultant has permission recorded; others anonymized |
| F3 | `feat/named-client-quote` (gated) | A challenge, approach, result case study with a metric headline and the named client's quote, written permission recorded, replacing the median-based story |
| F4 | `docs/training-card-sources` | Each of the 32 cards stores its source URL and verification date in the data file; no re-verification by me |
| F5 | `docs/salary-guide-method` (gated) | Method, sample size, collection dates, currency note |
| F6 | `docs/single-inbox-risk` | Every purpose uses `michael.allen@bridgewide.org` as decided; the privacy notice names it for data requests; a note records the risk of one person's mailbox (leave, outage, access control) and a trigger to move to role aliases |
| F8 | `fix/story-06-background` | Employer stories slide 06 (`anon-canada-contract`, the last of six) uses a real 2400x1600 Unsplash team-in-office photo in the same style as `story-1` to `story-4`, replacing `story-anon-canada.webp`, which is a 1200x800 generated magenta and blue pattern (not a photo, not in `ATTRIBUTION.md`, mean colour far from the others). The new file is wired to this slot only, has an `ATTRIBUTION.md` row, a regenerated `image-manifest.json` entry, passes `npm run check:images` (no duplicate photo, none used in two slots), and looks right under the slide's dark overlay on desktop and mobile. If F3 replaces this story with the named-client case study, the photo moves with it |
| F7 | `fix/country-label-format` | `Canada` and `United States` show without brackets; Priya Raman reads `United States`; other labels unchanged; AI-training portraits follow the same rule; a test covers the rule |

### G. Forms, accessibility, and error pages

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| G1 | `fix/cv-magic-bytes` | Renamed non-PDF files are rejected |
| G2 | `fix/cv-streaming-limit` | Oversize bodies are refused before full buffering |
| G3 | `fix/form-error-summary` | Errors link to fields (`aria-describedby`), focus moves to the first error, values survive a server error |
| G4 | `feat/not-found-and-error-pages` | Branded 404, 500, and global error pages |
| G5 | `fix/wcag-22-audit` | Axe finds no serious violations on the main routes; manual keyboard and screen-reader pass noted |
| G6 | `fix/reduced-motion-sweep` | Star-field, parallax, and the Sent stamp respect the setting |

### H. Testing

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| H1 | `feat/replace-source-reading-tests` | No test reads `src/` files as text |
| H2 | `feat/e2e-contact-both-pages` | `/contact` and `/ai-training/contact`: topic required, subject and body, failure text, keyboard path, reduced motion |
| H3 | `feat/e2e-hire-brief` | Success and failure paths |
| H4 | `feat/e2e-cv-upload` | Good file, bad file, oversize |
| H5 | `feat/e2e-role-apply-open-closed` | Open role applies; closed role shows the talent-pool link |
| H6 | `feat/e2e-talent-pool` | Prefill from a region and from a closed role; consent required |
| H7 | `feat/e2e-ai-training-forms` | Apply and partner with consent |
| H8 | `feat/a11y-axe-in-ci` | Axe runs in CI and fails on serious issues |
| H9 | `feat/performance-budget` | Lighthouse CI thresholds for LCP, INP, CLS |
| H10 | `feat/store-concurrency-tests` | Parallel writes lose nothing |
| H11 | `feat/cron-auth-tests` | Missing and wrong secret are refused |
| H12 | `feat/mail-failure-tests` | Resend failure paths are asserted end to end |
| H13 | `feat/coverage-threshold` | Coverage reported; a floor set on `lib/` and `app/api/` |

### I. Operations

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| I1 | `feat/error-monitoring` | Form 5xx and cron failures reach an alert |
| I2 | `feat/security-headers` | CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS |
| I3 | `docs/security-txt` | `/.well-known/security.txt` served |
| I4 | `feat/cron-health-monitor` | A missed cron pages someone |
| I5 | `feat/env-validation` | Missing production env fails the build or boot with a clear message |

### J. Release (run last, as gates)

| ID | Branch slug | Acceptance |
| --- | --- | --- |
| J1 | `docs/release-layout-review` | Desktop, mobile, form states, images, keyboard, reduced motion on `/`, `/contact`, `/ai-training/contact`, an open role, a closed role, an empty region, and all six employer-story slides (especially slide 06 after F8) |
| J2 | `ci/release-checks` | Lint, typecheck, image checks, server build, static build all green |
| J3 | `docs/release-metadata-check` | Titles, canonicals, sitemap, and JSON-LD match verified content |
| J4 | `docs/release-production-delivery` | One real send from each contact form after deploy; desk confirms receipt |

Total: A5 + B8 + C14 + D3 + E10 + F8 + G6 + H13 + I5 + J4 = 76 rows, of which C4 is dropped, so **75 issues**. F8 is small and independent, so it can go in Wave 1 if you want the visible fix early. If you want a smaller first wave, A, B, C1 to C3, C10, C13, and J give about 20 and fix the most serious defects above.

---

## 7. How the issues will ship

- Each issue gets its own branch from the latest `origin/dev`, never from `main`, and never stacked. Name: `<prefix>/<issue-number>-<slug>` with `feat/`, `fix/`, `docs/`, `ci/`, or `build/`.
- Conventional Commit subjects. Every commit message ends with the two trailers you gave, plus the harness attribution line:

```
Co-authored-by: shark314 <112891100+shark314@users.noreply.github.com>
Co-authored-by: tomost8 <178904341+tomost8@users.noreply.github.com>
Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
```

- Issues that edit `src/content/site.ts` start after the earlier content PR merges, to avoid conflicts.
- Pushing a branch opens a PR and, when CI is green, merges it into `dev`. Pushing in waves, with A1 first, keeps unfinished work off production.
- I will not push `dev` or `main`, and I will not open issues or branches until you approve.

Suggested waves: **Wave 0** Step 0 and A. **Wave 1** B, C1 to C3, C10, C11, C13, D2. **Wave 2** remaining C, E, G, I. **Wave 3** F (as your answers arrive) and H. **Wave 4** J.

---

## 8. Questions for you

Answered, so no longer open: records body (keep everything), Asia fields (notice period and client name), close dates (stay open until sent), Priya Raman's country, redundant labels, legal reviewer (one firm), inboxes (`michael.allen@` for all), case-study format (challenge, approach, result).

Still needed, grouped by the issue it unblocks:

- **Case study (F3):** the client (for example Harbor Metrics, Keel Systems, Northline, or Campo Health), the challenge in one or two sentences, what the desk did, the measured result (days to start, or 12-month retention), the exact quote with the speaker's name and title, and written permission to publish.
- **Asia roles (B7):** for the Singapore and Bangalore roles, the notice period (for example "30 days" or "1 to 3 months") and the client name, and confirmation each client agreed to be named (F2).
- **Close dates (B1):** send each role's `closesOn` when you have it. Until then every role stays open.
- **Stat definitions (F1):** period and meaning for 186, 94%, 9 and 11.
- **Permissions (F2):** whether written permission and real photos exist for Northline, Harbor Metrics, Campo Health, Keel Systems, Lumen Pay, and each consultant.
- **Legal firm (E1):** the firm's name and a contact, so the market checklist can be sent.
- **Edge cases I may still be missing:** a candidate applying to two regions; a role closing while the form is open; a deletion request after an introduction; a client reopening after the 12-week window; a contract converting to permanent; a candidate with no right to work in the role's country. Tell me which you have seen.

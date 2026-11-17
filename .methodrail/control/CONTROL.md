# Control

Commands below are the ones the repository already runs. There is no database to seed.

## Start

- App: `npm run dev`. Ready when http://localhost:3000 answers.
- `predev` runs `scripts/link-next-dist.mjs`. On Windows, if the repo is not on the `%LOCALAPPDATA%` drive, `.next` is a junction to `%LOCALAPPDATA%\bridgewide\next\<hash>`. Linux, and a repo already on that drive, skip the link.
- Do not use `npm run dev` as the browser-test server. `npm run test:e2e` builds and starts its own server.

## Doctor / readiness

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run check:images`

Ready for a content or form change means lint, typecheck, and `npm test` passed. Ready for a page-level change also means `npm run test:e2e` passed.

## Drive

- `npm run test:e2e` builds, then serves http://127.0.0.1:3456. `playwright.config.ts` sets `ROLE_CLOCK=2027-01-17T04:00:00.000Z`, `ROLE_CLOSE_DATES=region:usa=2027-01-16`, and `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3456`. It does not reuse an existing server.
- Projects: desktop 1280×800 and narrow 390×844.
- Specs: `e2e/contact.spec.ts`, `e2e/uploads.spec.ts`, `e2e/focus.spec.ts`, `e2e/a11y.spec.ts`.
- One dev server on port 3000 can stay up. Do not start a second server on 3456 yourself while Playwright is running.

## Inspect

- Submission state is the desk mailbox, not a file or database. [docs/decisions/email-only.md](../../docs/decisions/email-only.md).
- Role open/closed state comes from `src/content/site.ts` and `src/lib/desk-clock.ts`.

## Capture

- Vitest prints failures in the terminal. `npm run test:coverage` writes gitignored `coverage/`.
- Playwright writes its report for that run. CI's browser job is `e2e` in [.github/workflows/ci.yml](../../.github/workflows/ci.yml).

## Reset

- Stop the server you started. Nothing in the repo stores a form post.
- Test role dates exist only in the Playwright env above.

## Stop

- Stop the `npm run dev` process you started. Playwright stops the server it started. Do not kill every `node` process.

## Known limitations

- Forms return 500 when `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, or `CONTACT_FROM_EMAIL` is missing. `onboarding@resend.dev` delivers only to the Resend account owner.
- `NEXT_OUTPUT=export` has no `/api`.
- `GET /api/cron/role-digest` requires `Authorization: Bearer CRON_SECRET` in production. `DESK_ALLOW_UNAUTHENTICATED=1` is ignored when `NODE_ENV` is `production`.
- Turnstile runs only when both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set.

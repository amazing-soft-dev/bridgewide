# BridgeWide

Marketing site that places software engineers. Next.js 16 App Router. Public copy and figures live in `src/content/site.ts`.

## Important boundaries

- No database and no stored submissions. Each form becomes email. Decision: [docs/decisions/email-only.md](../docs/decisions/email-only.md).
- Do not commit `.env`, `.env*.local`, `.next/`, `out/`, `public/_img/`, or `.cursor/`.
- `dev` is the work branch. `main` is the release branch. Do not push to either. Procedure: [CONTRIBUTING.md](../CONTRIBUTING.md).

## Canonical commands

- Install: `npm install`
- Dev: `npm run dev` (http://localhost:3000)
- Build: `npm run build`
- Start: `npm run start`
- Test: `npm test`
- Browser: `npm run test:e2e`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Images: `npm run images`, then commit `src/lib/image-manifest.json`. Check: `npm run check:images`

## Verification

- Unit and route checks: `npm test`. Coverage floor: `npm run test:coverage`.
- Browser checks: `npm run test:e2e` (`e2e/`, `playwright.config.ts`).
- CI map: [.github/workflows/ci.yml](../.github/workflows/ci.yml) — lint, typecheck, coverage, image check, server build, static export, browser.
- Env limits and which server to drive: [control/CONTROL.md](control/CONTROL.md).
- No project-local verify skill. Those commands are the harness.

## Architecture pointers

- Routes, env, forms, deploy: [README.md](../README.md)
- Email-only decision: [docs/decisions/email-only.md](../docs/decisions/email-only.md)
- Plans: [docs/plans/contact-page.md](../docs/plans/contact-page.md), [docs/plans/unique-images.md](../docs/plans/unique-images.md)
- Mailbox retention: [docs/mailbox-retention.md](../docs/mailbox-retention.md)
- Sending DNS: [docs/email-authentication.md](../docs/email-authentication.md)
- Single-inbox risk: [docs/single-inbox-risk.md](../docs/single-inbox-risk.md)

## Runtime and control

- [control/CONTROL.md](control/CONTROL.md)

## Decision records

- ADR: [docs/decisions/email-only.md](../docs/decisions/email-only.md). No operational `decisions.tsv`.

## Important constraints

- Next.js 16 differs from earlier versions. Read `node_modules/next/dist/docs/` before framework-level changes. The standing note is in [AGENTS.md](../AGENTS.md).
- `NEXT_OUTPUT=export` omits `/api`. Those pages cannot send forms.
- Production forms need `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`. A missing variable returns 500.
- A role closes at 18:00 Pacific on its `closesOn` date. `ROLE_CLOCK` and `ROLE_CLOSE_DATES` are test-only, and the close list is ignored unless `ROLE_CLOCK` is set.

## Model policy

- Task tiers and the Cursor binding: [MODELS.yaml](MODELS.yaml). The binding is configured from Cursor's documented Auto router. It is not a live observation. Cursor Auto and its Balance mode stay a picker action.

## Existing AI guidance

- Host instructions: [AGENTS.md](../AGENTS.md). [CLAUDE.md](../CLAUDE.md) includes that file.

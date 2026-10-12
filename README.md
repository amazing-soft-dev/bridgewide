# BridgeWide

Marketing website for **BridgeWide**, a firm that places software engineers with companies across four regions: the **USA, Canada, LATAM, and Europe**.

The site serves two audiences. Employers can browse regions, salary bands, and client stories, then send a hiring brief. Engineers can browse open roles and submit a CV. All three forms (hire brief, CV, contact) send real email through [Resend](https://resend.com).

> **Note:** Roles, placements, salary bands, stats, people, stories, and articles are sample content. They all live in `src/content/site.ts` and should be replaced with real data before launch.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, configured CSS-first in `src/app/globals.css` (no `tailwind.config`) |
| Animation | [Motion](https://motion.dev) for scroll reveals and staggers; [three.js](https://threejs.org) for the homepage star-field (`AstraField`) |
| Email | Resend, called from Next.js route handlers |
| Fonts | `next/font`: Geist (UI), Bricolage Grotesque (headlines), IBM Plex Mono (labels) |

> Next.js 16 has breaking changes from earlier versions. Before changing framework-level code, read the guides in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Getting started

Requirements: Node.js 20 or newer, and npm.

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint (fails on any warning) |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |

## Environment variables

Copy `.env.example` to `.env.local`. Never commit real keys (`.env` and `.env*.local` are git-ignored).

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from resend.com |
| `CONTACT_TO_EMAIL` | Inbox that receives submissions (default `hello@bridgewide.com`) |
| `CONTACT_FROM_EMAIL` | Sender address. `onboarding@resend.dev` is Resend's sandbox sender and only delivers to the Resend account owner's address. Switch to a sender on a verified domain for production. |

If any of the three is missing, the form APIs return a 500 that names the missing variable.

## Pages

| Route | Content |
| --- | --- |
| `/` | Homepage (employer-first, full section set) |
| `/employers` | How hiring works, the five-day process, fees, hire-brief form |
| `/engineers` | Candidate path (free, confidential), CV upload form |
| `/roles`, `/roles/[slug]` | Open engineering roles and role details |
| `/regions`, `/regions/[region]` | The four regions: `usa`, `canada`, `latam`, `europe` |
| `/salary-guide` | Salary bands by region for backend, frontend, data, cloud, mobile, and leadership |
| `/stories`, `/stories/[slug]` | Employer stories |
| `/insights`, `/insights/[slug]` | Short articles |
| `/about` | The desk and consultants |
| `/contact` | Contact form |
| `/privacy`, `/terms` | Placeholder legal pages |

Dynamic routes prerender with `generateStaticParams`. The app also generates `sitemap.xml`, `robots.txt`, an Open Graph image, and app icons (`src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `apple-icon.tsx`).

### Homepage sections

Announcement bar → header → hero → two doors (employer / engineer) → "placed this month" marquee → regions → the week (Mon–Fri) → open roles → the record (stats) → the desk (team) → salary preview → stories → insights → FAQ → closing band → footer, with the `AstraField` star-field on the homepage only.

Everything below the two-doors section loads through `next/dynamic` to keep first paint small.

## Form API

All routes run on the Node.js runtime and return `{ ok: true }` or `{ ok: false, error }`.

| Endpoint | Body | Fields |
| --- | --- | --- |
| `POST /api/hire` | JSON | `name`, `email`, `company`, `roleTitle`, `region`, `engagement` (`Permanent` / `Contract`), `message` |
| `POST /api/cv` | `multipart/form-data` | `name`, `email`, `region`, `file` (PDF, DOC, or DOCX, 5 MB max; sent as an email attachment) |
| `POST /api/contact` | JSON | `name`, `email`, `message` |

The server validates every field (`src/lib/form.ts`, `src/lib/cv-file.ts`). Each form includes a hidden `companyWebsite` honeypot: if it is filled, the API returns success without sending anything.

## Project structure

```
src/
  app/                  Routes, layout, globals.css, sitemap/robots/OG
    api/{hire,cv,contact}/route.ts
  components/
    brand/              Logo and bridge mark paths
    forms/              HireForm, CvForm, ContactForm, Field
    home/               One component per homepage section, plus AstraField
    pages/              Shared inner-page building blocks and metadata helper
    site/               Header, mobile nav, footer, announcement bar
    ui/                 Button, Reveal, Accordion, Marquee, CountUp, etc.
  content/site.ts       All site copy and data
  lib/                  Form validation, CV checks, Resend mailer, motion variants
public/images/          Self-hosted WebP photos (see ATTRIBUTION.md)
plan.md                 Original build plan and design decisions
```

## Editing content

All copy and data are in **`src/content/site.ts`**: contact details, nav, hero, stats, placements, the weekly process, people, roles, regions, salary bands, stories, insights, FAQ, and fees. Change it there and every page that uses it updates.

The canonical site URL (used for metadata, sitemap, and Open Graph) is `siteUrl` in `src/components/pages/metadata.ts`. It defaults to `https://www.bridgewide.org` and can be overridden with `NEXT_PUBLIC_SITE_URL` at build time.

## Design notes

- Brand tokens are defined in `@theme` in `globals.css`: `ink`, `cloud`, `stone`, and the red `brand` accent.
- All motion respects `prefers-reduced-motion`, and the heavier effects turn off below 900 px wide.
- The logo and bridge mark are original artwork.
- Photos come from Unsplash under the Unsplash License. Credits are in `public/images/ATTRIBUTION.md`.

## CI/CD

Every change ships the same way, and you only do step 1:

1. **You:** create a branch with a type prefix, commit, and push it.
   ```bash
   git checkout dev && git pull
   git checkout -b fix/empty-region      # or feat/, chore/, docs/, refactor/, perf/, test/, ci/, build/, style/
   git commit -am "fix: handle empty region"
   git push -u origin fix/empty-region
   ```
2. **Auto PR → `dev`:** a pull request into `dev` opens (or updates on later pushes), labelled by prefix, with auto-merge on. CI runs and posts a checks-summary comment. When **CI passed** is green, the PR is squash-merged and the branch deleted.
3. **Auto release → `main`:** the merge into `dev` opens (or updates) one **Release: dev → main** pull request listing everything not yet on `main`. CI runs again, and when it passes the release merges with a merge commit.
4. **Deploy:** the push to `main` builds the static site and publishes it to https://www.bridgewide.org.

If CI fails at step 2 or 3, nothing merges. Push a fix to the same branch: the PR updates, CI reruns, and the flow continues.

| Workflow | Runs on | What it does |
| --- | --- | --- |
| `auto-pr.yml` | Push to a work branch (`fix/*`, `feat/*`, ...) | Opens or updates the PR into `dev`, labels it, turns on auto-merge (squash) |
| `ci.yml` | PRs into `dev` or `main`, pushes to `dev` | Lint, type check, server and static builds. The final **CI passed** job is the single required check and posts the checks-summary comment |
| `release.yml` | Push to `dev` | Opens or updates the `dev` → `main` release PR, turns on auto-merge (merge commit) |
| `nextjs.yml` | Push to `main` | Builds the static export and deploys it to GitHub Pages |

Run the same checks locally before pushing:

```bash
npm run lint && npm run typecheck && npm run build
```

**To pause:** click **Disable auto-merge** on an open PR to hold that one change, or disable `release.yml` under **Actions** to stop releases while still collecting changes on `dev`.

**Reviews:** GitHub doesn't let anyone approve their own pull request, and a bot approval would be a rubber stamp. So the gate is the required **CI passed** check plus the summary comment. Rulesets require 0 approvals. If a second person joins, raise `required_approving_review_count` in the `main` ruleset.

### One-time setup

1. **Create the bot GitHub App.** Go to **Settings → Developer settings → GitHub Apps → New GitHub App** on your account.
   - Name it something like `bridgewide-bot`. Homepage URL: the repo URL. Untick **Webhook → Active**.
   - Repository permissions: **Contents: Read and write**, **Pull requests: Read and write**, **Issues: Read and write** (for labels), **Workflows: Read and write** (so it can merge changes to `.github/workflows`).
   - Create the app, note its **App ID**, and under **Private keys** click **Generate a private key**.
   - Click **Install App** and install it on `amazing-soft-dev/bridgewide` only.
2. **Add the credentials to the repo.** In **Settings → Secrets and variables → Actions**:
   - **Variables** tab: `BOT_APP_ID` = the App ID.
   - **Secrets** tab: `BOT_APP_PRIVATE_KEY` = the full contents of the downloaded `.pem` file.

   The bot token is needed because pull requests opened with the default `GITHUB_TOKEN` don't trigger CI, so auto-merge would wait forever.
3. **Repository settings.** In **Settings → General → Pull Requests**, tick **Allow merge commits**, **Allow squash merging**, **Allow auto-merge**, and **Automatically delete head branches**.
4. **Branch rulesets.** In **Settings → Rules → Rulesets → New ruleset → Import a ruleset**, import `.github/rulesets/dev.json`, then `.github/rulesets/main.json`. Both require a pull request and the **CI passed** check and block force pushes and deletion. `dev` allows squash merges only, `main` merge commits only. Run CI once (any PR) before importing, so GitHub knows the **CI passed** check name.
5. **Pages.** In **Settings → Pages**: Source **GitHub Actions**, custom domain `www.bridgewide.org`, **Enforce HTTPS** on. Under **Settings → Environments → github-pages**, make sure `main` is allowed to deploy.

## Deployment

### Node host (full site)

This is a standard Next.js app, so it can run on Vercel or any Node host (`npm run build && npm run start`). Set the three environment variables in the host. Before going live, verify a sending domain in Resend and update `CONTACT_FROM_EMAIL`. This is the only target where the forms send email.

### GitHub Pages (static preview)

`.github/workflows/nextjs.yml` deploys a static export to GitHub Pages on every push to `main`. The site is served from the custom domain **https://www.bridgewide.org**. The workflow builds with:

```bash
NEXT_OUTPUT=export NEXT_PUBLIC_SITE_URL=https://www.bridgewide.org npx next build   # writes ./out
```

- `NEXT_OUTPUT=export` makes `next.config.ts` switch to `output: "export"`, set `basePath`, and use the custom image loader in `src/lib/static-image-loader.ts`.
- `PAGES_BASE_PATH` is the sub-path the site is served from. It is empty for the custom domain. Only set it (repository variable `PAGES_BASE_PATH=/bridgewide`) if you serve the site from `https://<owner>.github.io/bridgewide` without a custom domain. A mismatch makes every script, stylesheet, font and image 404.
- `NEXT_PUBLIC_SITE_URL` sets the canonical origin used in page metadata, `sitemap.xml` and `robots.txt` (default `https://www.bridgewide.org`; override with the repository variable `SITE_URL`).
- Route files that produce files (`sitemap.ts`, `robots.ts`, `apple-icon.tsx`, `opengraph-image.tsx`) set `dynamic = "force-static"` so they prerender.
- Pages has no server, so `/api/*` is left out of the export. On the static site the forms skip sending and tell visitors to email `hello@bridgewide.com` instead.
- Don't add `static_site_generator: next` back to the Pages step. It only patches `next.config.js`, so with this repo's `next.config.ts` it writes a second config that overrides ours.

In the repo settings, set **Pages → Source** to **GitHub Actions**, set the custom domain to `www.bridgewide.org`, and turn on **Enforce HTTPS**.

## License

[MIT](LICENSE) © 2026 amazing-soft-dev

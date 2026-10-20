# BridgeWide

Marketing website for **BridgeWide**, a firm that places software engineers with companies across four regions: the **USA, Canada, LATAM, and Europe**.

The site serves two audiences. Employers can browse regions, salary bands, and client stories, then send a hiring brief. Engineers can browse open roles and submit a CV. All three forms (hire brief, CV, contact) send real email through [Resend](https://resend.com) when the app runs on Vercel or another Node host.

All copy and figures live in `src/content/site.ts`. The public contact address is `michael.allen@bridgewide.org`.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, configured CSS-first in `src/app/globals.css` (no `tailwind.config`) |
| Animation | [Motion](https://motion.dev) for scroll reveals and staggers; [three.js](https://threejs.org) for the homepage star-field (`AstraField`) |
| Email | Resend, called from Next.js route handlers |
| Analytics | Vercel Web Analytics and Speed Insights, production only (`src/components/analytics/ProductionInsights.tsx`) |
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
| `npm run images` | Build the responsive WebP variants in `public/_img` (needed for the static export) |

## Environment variables

Copy `.env.example` to `.env.local`. Never commit real keys (`.env` and `.env*.local` are git-ignored).

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from resend.com |
| `CONTACT_TO_EMAIL` | Inbox that receives submissions (`michael.allen@bridgewide.org`) |
| `CONTACT_FROM_EMAIL` | Fixed sender passed to Resend. It is not the visitor's address. Production uses `BridgeWide <noreply@bridgewide.org>` on the verified `bridgewide.org` domain. That mailbox does not need to exist. `onboarding@resend.dev` is only the local sandbox sender, and it delivers solely to the Resend account owner. The visitor's address is set as `replyTo`. |

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
| `/privacy`, `/terms` | Placeholder legal pages. They are `noindex` and are not in the sitemap. |

Dynamic routes prerender with `generateStaticParams`. The app also generates `sitemap.xml`, `robots.txt`, and an Open Graph image (`src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx`). Tab, Apple, and home-screen icons are the uploaded files in `public/`, linked from the root metadata.

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
    analytics/          Production-only Vercel Analytics and Speed Insights
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
   git checkout dev && git pull          # always branch from dev, not from another work branch
   git checkout -b fix/empty-region      # or feat/, chore/, docs/, refactor/, perf/, test/, ci/, build/, style/
   git commit -am "fix: handle empty region"
   git push -u origin fix/empty-region
   ```
2. **Auto PR → `dev`:** a pull request into `dev` opens (or updates on later pushes), labelled by prefix, with auto-merge on. CI runs and posts a checks-summary comment. When **CI passed** is green, the PR is merged with a merge commit (the branch joins `dev` in the history graph) and `branch-housekeeping.yml` deletes the work branch. A branch whose changes are already in `dev` gets no PR.
3. **Auto release → `main`:** the merge into `dev` opens (or updates) one **Release: dev → main** pull request listing everything not yet on `main`. CI runs again, and when it passes the release merges with a merge commit.
4. **Deploy:** the push to `main` updates production. Vercel serves https://www.bridgewide.org (forms send email). `nextjs.yml` also publishes a static export to GitHub Pages, where the forms do not send.

If CI fails at step 2 or 3, nothing merges. Push a fix to the same branch: the PR updates, CI reruns, and the flow continues.

| Workflow | Runs on | What it does |
| --- | --- | --- |
| `auto-pr.yml` | Push to a work branch (`fix/*`, `feat/*`, ...) | Opens or updates the PR into `dev`, labels it, turns on auto-merge (merge commit) |
| `ci.yml` | PRs into `dev` or `main`, pushes to `dev` | Lint, type check, server and static builds. The final **CI passed** job is the single required check and posts the checks-summary comment |
| `release.yml` | Push to `dev` | Opens or updates the `dev` → `main` release PR, turns on auto-merge (merge commit) |
| `branch-housekeeping.yml` | PR merged into `dev`, push to `main` | Deletes merged work branches; recreates `dev` from `main` if it is ever missing |
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
   - **Variables** tab: `BOT_APP_CLIENT_ID` = the app's **Client ID** (shown under the App ID, starts with `Iv`). `BOT_APP_ID` (the numeric App ID) also works as a fallback.
   - **Secrets** tab: `BOT_APP_PRIVATE_KEY` = the full contents of the downloaded `.pem` file.

   The bot token is needed because pull requests opened with the default `GITHUB_TOKEN` don't trigger CI, so auto-merge would wait forever.
3. **Repository settings.** In **Settings → General → Pull Requests**, tick **Allow merge commits** and **Allow auto-merge** (squash merging is not used). Leave **Automatically delete head branches** **off**. Every release PR's source branch is `dev`, so that setting deletes `dev` after each release. `branch-housekeeping.yml` deletes merged work branches instead.
4. **Branch rulesets.** In **Settings → Rules → Rulesets → New ruleset → Import a ruleset**, import `.github/rulesets/dev.json`, then `.github/rulesets/main.json`. Both require a pull request and the **CI passed** check and block force pushes and deletion. The deletion block matters: **Automatically delete head branches** would otherwise delete `dev` after every release PR, because `dev` is that PR's head branch. If `dev` ever goes missing, the next work-branch push recreates it from `main`. Both allow merge commits only, so every PR shows as a branch joining its target. Run CI once (any PR) before importing, so GitHub knows the **CI passed** check name.
5. **Pages.** In **Settings → Pages**: Source **GitHub Actions**, custom domain `www.bridgewide.org`, **Enforce HTTPS** on. Under **Settings → Environments → github-pages**, make sure `main` is allowed to deploy.

## Performance and CDN

**Responsive images.** GitHub Pages has no image optimizer, so `npm run images` (`scripts/optimize-images.mjs`) pre-builds a WebP for each width in `src/lib/image-sizes.json`. In the static export, `next/image` serves `srcset` from those files through `src/lib/static-image-loader.ts`. For example, a 384px region card loads a 22 KB file, not the 640 KB original. File names carry a content hash (`hero.<hash>.640.webp`), so they can be cached for a year. CI and the deploy run the script before `next build`, and CI fails if any image the HTML references is missing. After adding or replacing a photo in `public/images/`, run `npm run images` and commit `src/lib/image-manifest.json`.

**CDN.** GitHub Pages already serves the site through Fastly's CDN with HTTPS. Its only limit is a fixed 10-minute cache on every file. For long-lived caching, Brotli and HTTP/3, put Cloudflare (free plan) in front:

1. Add `bridgewide.org` to Cloudflare and switch the domain's nameservers to Cloudflare.
2. Keep the GitHub Pages DNS records (`www` CNAME to `amazing-soft-dev.github.io`, apex A/AAAA records). Leave them **DNS only** (grey cloud) until GitHub Pages shows the HTTPS certificate as issued, then switch them to **Proxied**.
3. **SSL/TLS:** Full (strict). Turn on **Always Use HTTPS**, **Brotli** and **HTTP/3**.
4. **Caching → Cache Rules:** for URI paths starting with `/_next/static/` or `/_img/`, set Edge TTL and Browser TTL to 1 year. These files are content-hashed, so they never change in place. Leave HTML on the origin's default.

## SEO and GEO

- **Metadata:** every page has a title, description, canonical URL, Open Graph and Twitter card tags, and a generated Open Graph image (`src/components/pages/metadata.ts`, `src/app/opengraph-image.tsx`).
- **Structured data (JSON-LD, `src/lib/structured-data.ts`):** Organization (San Francisco, no street address) and WebSite on every page, FAQPage on the homepage, BreadcrumbList on detail pages, Article on insights, and JobPosting on each role. There is no Review markup.
- **`contentIsSample`** in `src/content/site.ts` is `false`. Set it back to `true` only if the published figures must not be cited. While it is `true`, `/llms.txt` warns assistants and role pages should not advertise jobs that are not real.
- **Crawlable FAQ:** FAQ answers are in the HTML even when collapsed, so search engines and AI crawlers can read them.
- **AI crawlers:** `robots.txt` allows all crawlers and names the main AI ones (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …).
- **`/llms.txt`:** a plain-Markdown summary for AI assistants, generated from `src/content/site.ts`. It lists services, regions, every open role, every salary band, insights, and the FAQ, each with a URL.
- **`sitemap.xml`:** lists the public pages, with `lastModified` dates for insights. `/privacy` and `/terms` are omitted.
- **Analytics:** Vercel Web Analytics and Speed Insights load only when `VERCEL_ENV` is `production` and the build is not a static export. Do Not Track skips the scripts. Hits with an `email` query are dropped, and other query strings are stripped.

After the next deploy, submit `https://www.bridgewide.org/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Bing's index also feeds ChatGPT search and Copilot.

## Deployment

### Node host (full site)

Production is the Vercel project **bridgewide**, with Production tracking `main` and serving https://www.bridgewide.org. Set these in **Settings → Environment Variables** for Production, then redeploy:

```text
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=michael.allen@bridgewide.org
CONTACT_FROM_EMAIL=BridgeWide <noreply@bridgewide.org>
```

`bridgewide.org` is verified in Resend. Do not put these values in GitHub Actions. The same three variables work on any other Node host (`npm run build && npm run start`). This is the only target where the forms send email.

### GitHub Pages (static preview)

`.github/workflows/nextjs.yml` deploys a static export to GitHub Pages on every push to `main`. It does not serve the form APIs. The workflow builds with:

```bash
NEXT_OUTPUT=export NEXT_PUBLIC_SITE_URL=https://www.bridgewide.org npx next build   # writes ./out
```

- `NEXT_OUTPUT=export` makes `next.config.ts` switch to `output: "export"`, set `basePath`, and use the custom image loader in `src/lib/static-image-loader.ts`.
- `PAGES_BASE_PATH` is the sub-path the site is served from. It is empty for the custom domain. Only set it (repository variable `PAGES_BASE_PATH=/bridgewide`) if you serve the site from `https://<owner>.github.io/bridgewide` without a custom domain. A mismatch makes every script, stylesheet, font and image 404.
- `NEXT_PUBLIC_SITE_URL` sets the canonical origin used in page metadata, `sitemap.xml` and `robots.txt` (default `https://www.bridgewide.org`; override with the repository variable `SITE_URL`).
- Route files that produce files (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) set `dynamic = "force-static"` so they prerender. Icons are static files in `public/` (`favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, and `manifest.webmanifest`).
- Pages has no server, so `/api/*` is left out of the export. On the static site the forms skip sending and tell visitors to email `michael.allen@bridgewide.org` instead.
- Don't add `static_site_generator: next` back to the Pages step. It only patches `next.config.js`, so with this repo's `next.config.ts` it writes a second config that overrides ours.

In the repo settings, set **Pages → Source** to **GitHub Actions**, set the custom domain to `www.bridgewide.org`, and turn on **Enforce HTTPS**.

## License

[MIT](LICENSE) © 2026 amazing-soft-dev

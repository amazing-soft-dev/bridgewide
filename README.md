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

`dev` is where work lands. `main` is the release branch. Do not push to either one. See `CONTRIBUTING.md`.

1. Create a GitHub issue and note the number.
2. Branch from `origin/dev` as `feat/`, `fix/`, `docs/`, `ci/`, or `build/`.
3. Commit with a Conventional Commit subject and a line of its own: `Closes #N`.
4. Push. `open-pull-request.yml` opens the pull request into `dev`.
5. `ci.yml` runs. If **CI passed** is green, `merge-passing-pr.yml` merge-commits into `dev`.
6. That push opens `dev` into `main`. CI runs again and, if it passes, merges into `main`.
7. GitHub closes the issue when `Closes #N` lands on `main`.

A merge to `main` only re-runs CI. Vercel deploys https://www.bridgewide.org from its Git connection. GitHub Pages is not published by Actions.

| Workflow | Runs on | What it does |
| --- | --- | --- |
| `open-pull-request.yml` | Push to `feat/**`, `fix/**`, `docs/**`, `ci/**`, `build/**`, or `dev` | Opens the branch into `dev`, or `dev` into `main` when `dev` is ahead |
| `ci.yml` | Pull requests, pushes to `dev` and `main` | Lint, type check, server and static builds. **CI passed** is the required check |
| `merge-passing-pr.yml` | CI succeeds on a pull request | Merge-commits eligible pull requests if the head commit is still the one CI validated |

Dependabot pull requests are not opened or merged by these workflows.

The workflows call `gh` with the `GH_TOKEN` repository secret, not the default `GITHUB_TOKEN`. In **Settings → General → Pull Requests**, allow merge commits. Leave **Automatically delete head branches** off so a `dev` → `main` merge does not delete `dev`. The rulesets in `.github/rulesets/` require a pull request and **CI passed**, and they allow merge commits only.

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

### Static export

CI still builds a static export so the Pages-shaped output stays valid. Actions no longer publishes that export. Locally:

```bash
NEXT_OUTPUT=export NEXT_PUBLIC_SITE_URL=https://www.bridgewide.org npx next build   # writes ./out
```

- `NEXT_OUTPUT=export` makes `next.config.ts` switch to `output: "export"`, set `basePath`, and use the custom image loader in `src/lib/static-image-loader.ts`.
- `PAGES_BASE_PATH` is the sub-path the site is served from. It is empty for the custom domain. Only set it (repository variable `PAGES_BASE_PATH=/bridgewide`) if you serve the site from `https://<owner>.github.io/bridgewide` without a custom domain. A mismatch makes every script, stylesheet, font and image 404.
- `NEXT_PUBLIC_SITE_URL` sets the canonical origin used in page metadata, `sitemap.xml` and `robots.txt` (default `https://www.bridgewide.org`; override with the repository variable `SITE_URL`).
- Route files that produce files (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) set `dynamic = "force-static"` so they prerender. Icons are static files in `public/` (`favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, and `manifest.webmanifest`).
- The export has no server, so `/api/*` is left out. A static copy of the site cannot send the forms.

## License

[MIT](LICENSE) © 2026 amazing-soft-dev

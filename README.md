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

The canonical site URL (used for metadata, sitemap, and Open Graph) is `siteUrl` in `src/components/pages/metadata.ts`.

## Design notes

- Brand tokens are defined in `@theme` in `globals.css`: `ink`, `cloud`, `stone`, and the red `brand` accent.
- All motion respects `prefers-reduced-motion`, and the heavier effects turn off below 900 px wide.
- The logo and bridge mark are original artwork.
- Photos come from Unsplash under the Unsplash License. Credits are in `public/images/ATTRIBUTION.md`.

## CI/CD

Branch flow: `fix/*` or `feat/*` → pull request into **`dev`** → pull request from `dev` into **`main`** → deploy.

| Workflow | Runs on | What it does |
| --- | --- | --- |
| `.github/workflows/ci.yml` (**CI**) | Pull requests into `dev` or `main`, pushes to `dev` | `npm run lint`, `npm run typecheck`, and two builds: `server` (full app with `/api` routes) and `static` (the GitHub Pages export, with a check that the expected files exist) |
| `.github/workflows/nextjs.yml` (**Deploy**) | Pushes to `main` | Builds the static export and publishes it to GitHub Pages |

Run the same checks locally before opening a pull request:

```bash
npm run lint && npm run typecheck && npm run build
```

To make CI a merge gate, add a branch protection rule (or ruleset) for `dev` and `main` under **Settings → Branches**. Require pull requests and the status checks `Lint and type check`, `Build (server)` and `Build (static)`.

## Deployment

### Node host (full site)

This is a standard Next.js app, so it can run on Vercel or any Node host (`npm run build && npm run start`). Set the three environment variables in the host. Before going live, verify a sending domain in Resend and update `CONTACT_FROM_EMAIL`. This is the only target where the forms send email.

### GitHub Pages (static preview)

`.github/workflows/nextjs.yml` deploys a static export to GitHub Pages on every push to `main`. It builds with:

```bash
NEXT_OUTPUT=export PAGES_BASE_PATH=/bridgewide npx next build   # writes ./out
```

- `NEXT_OUTPUT=export` makes `next.config.ts` switch to `output: "export"`, set `basePath`, and use the custom image loader in `src/lib/static-image-loader.ts`.
- `PAGES_BASE_PATH` comes from `actions/configure-pages` (`/bridgewide` for a project site, empty for a custom domain).
- Route files that produce files (`sitemap.ts`, `robots.ts`, `apple-icon.tsx`, `opengraph-image.tsx`) set `dynamic = "force-static"` so they prerender.
- Pages has no server, so `/api/*` is left out of the export. On the static site the forms skip sending and tell visitors to email `hello@bridgewide.com` instead.
- Don't add `static_site_generator: next` back to the Pages step. It only patches `next.config.js`, so with this repo's `next.config.ts` it writes a second config that overrides ours.

In the repo settings, set **Pages → Source** to **GitHub Actions**.

## License

[MIT](LICENSE) © 2026 amazing-soft-dev

# BridgeWide — Build Plan

A marketing site for **BridgeWide**, a firm whose customers are companies that
need software engineers, sourced across the **USA, Canada, LATAM, and Europe**.
It follows the layout, motion, and page set of the Staffora reference
([forceful-variations-474566.framer.app](https://forceful-variations-474566.framer.app/)),
rewritten as original code with BridgeWide's own copy and an original wordmark.

> Status: plan locked, ready to build. Scaffolding has been created and
> verified in a workspace; the production build happens in the repo at
> `E:\1.workspace\1Mine\Bridgewide`.

---

## Decisions (locked)

| Question | Choice |
| --- | --- |
| Motion fidelity | **Full** — Motion (ex-Framer Motion): scroll reveals, stagger, parallax |
| Forms | **Real submission** via Resend to `hello@bridgewide.com` |
| Images | **Self-hosted** curated Unsplash photos in `public/` |
| Build location | **In place** in `E:\1.workspace\1Mine\Bridgewide` |
| Email provider | **Resend** (key supplied by you in `.env.local`) |

---

## Guardrails

- **Logo is original.** An original BridgeWide wordmark (geometric sans, medium
  weight, tight tracking — the *type idea* from the GPT-6 Astra page) plus a
  simple bridge glyph drawn for this company. It does **not** use the OpenAI
  blossom/flower mark, the words "GPT-6" or "Astra", or OpenAI's logo.
- **Reference is rebuilt, not copied.** Layout, structure, and motion are
  re-authored as original code. No Framer source, CSS, or image assets are
  reused.
- **All numbers are sample data.** Placement counts, salary bands, retention
  stats, team names, and `hello@bridgewide.com` live in one data file and are
  labeled "sample data" in the UI so no one mistakes them for real figures.

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first config in `globals.css`, no `tailwind.config`)
- **Motion** (`motion` package) for animation, code-split so it doesn't bloat
  first paint; honors `prefers-reduced-motion`
- **Resend** for transactional email from the form API routes
- `next/font`: **Geist** (wordmark/UI), **Bricolage Grotesque** (headlines),
  **IBM Plex Mono** (labels) — the Staffora pairing
- `next/image` for all photos — hero eager, everything else lazy with `sizes`
- `next/dynamic` for below-the-fold homepage blocks so first paint stays small;
  App Router already code-splits per route
- Server Components by default; Client Components only for forms and motion

---

## Performance

- Hero image eager + `priority`; every other image lazy with correct `sizes`.
- Below-fold homepage sections loaded with `next/dynamic`.
- Motion library imported only inside the client components that animate.
- Self-hosted, pre-sized WebP/AVIF images — no live Unsplash dependency.

## SEO & accessibility (added in review)

- Per-page `metadata` (title, description, canonical, Open Graph).
- `app/sitemap.ts` and `app/robots.ts`; an OG image.
- Semantic landmarks, visible focus states, labelled form fields, alt text.
- `prefers-reduced-motion` degrades all motion gracefully.

---

## Brand system

Tokens in Tailwind (`@theme` in `globals.css`), sampled to evoke the reference:

- `ink` (near-black), `cloud` (warm off-white), `stone` (muted text),
  `brass` (accent) + light/dark section themes and diagonal section seams.
- Primary button: **"Hire engineers"**. Secondary: **"Find a role"**.

---

## Pages

```
/                     Home (employer-first, full section set)
/employers            How a company hires, the week, fees, brief form
/engineers            Candidate path (free, confidential), CV form
/roles                Open engineering roles
/roles/[slug]         Role detail — region, salary, engagement
/regions              Four regions (replaces Staffora's six industries)
/regions/[region]     usa | canada | latam | europe
/about                The desk and consultants
/salary-guide         Bands by region for backend, frontend, data, cloud,
                      mobile, engineering leadership
/stories              Employer stories
/stories/[slug]       Single story
/insights             Short articles
/insights/[slug]      Single article
/contact              Brief form
/privacy  /terms      Short placeholder legal pages (labeled not legal advice)
```

Dynamic routes (`[slug]`, `[region]`) use `generateStaticParams` so they
prerender.

---

## Homepage section order

Announcement strip → header → hero (live role list + stats) → two doors
(employer / engineer) → "placed this month" marquee → four regions → the week
(Mon–Fri) → open roles → the record (stats) → the desk (team) → salary guide →
employer stories → insights → FAQ → closing band → footer.

---

## Content model

Everything lives in `src/content/site.ts` so it can be swapped later:
regions, roles, people, stories, insights, FAQ, salary bands, nav, and contact
details (`hello@bridgewide.com`, sample phone/location).

---

## Forms (real submission)

Three client forms — hire brief, CV upload, contact — post to Next.js route
handlers that send through Resend:

```
src/app/api/hire/route.ts
src/app/api/cv/route.ts       (accepts a PDF/doc upload, size-capped)
src/app/api/contact/route.ts
```

- Each validates client-side, shows a success/error state.
- You supply your own key in `.env.local`; the repo ships `.env.example`
  documenting what's needed. No real key is ever committed.

```
# .env.example
RESEND_API_KEY=            # from resend.com
CONTACT_TO_EMAIL=hello@bridgewide.com
CONTACT_FROM_EMAIL=onboarding@resend.dev   # swap for a verified domain sender
```

---

## File structure

```
src/
  app/
    layout.tsx              fonts, metadata, header + footer
    page.tsx                homepage
    globals.css             Tailwind v4 theme + tokens
    sitemap.ts  robots.ts  opengraph-image
    (routes listed above)
    api/{hire,cv,contact}/route.ts
  components/
    brand/Logo.tsx
    site/SiteHeader.tsx  site/SiteFooter.tsx  site/AnnouncementBar.tsx
    ui/   (Reveal, Button, Section, Stat, Pill, Accordion, Marquee)
    forms/ (HireForm, CvForm, ContactForm, Field)
    home/  (one component per homepage section)
  content/site.ts
  lib/   (motion variants, helpers)
public/
  images/  (curated, self-hosted photos + attribution note)
```

---

## Verification (before handoff)

Run the dev server and walk the homepage, one region, one role, and the hire
form on desktop and a narrow viewport. Confirm:

- the hero loads first and lower sections load after,
- images below the fold are lazy,
- motion respects reduced-motion,
- forms submit and show success/error,
- `next build` passes clean.

---

## Build sequence

1. Scaffold (done): Next 16 + TS + Tailwind v4 + Motion + Resend.
2. Brand: tokens, fonts, original wordmark + bridge glyph.
3. Content: `src/content/site.ts` (sample, labeled).
4. Shared chrome + form components + Resend API routes.
5. Homepage with dynamic below-fold imports + motion.
6. Inner pages with per-page metadata.
7. Images (self-hosted), sitemap/robots/OG, a11y + reduced-motion pass.
8. Verify in browser (desktop + narrow), `next build`, commit in place.

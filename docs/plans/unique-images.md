# Every photo used once

Issues: #161 (home and staffing pages), #162 (`/ai-training` slides and the check).

Every photo under `public/images` appears in exactly one slot on the site. The platform logos under `public/images/platforms/` are company marks, each used once, and are out of scope.

## Inventory

47 photos in `public/images` (plus 18 platform logos). All photo paths live in `src/content/site.ts`, `src/content/ai-training.ts`, and four components (`ai-training/page.tsx`, `MissionBand.tsx`, `PathSteps.tsx`, `PortraitWall.tsx`). `npm run images` (`scripts/optimize-images.mjs`) builds the responsive WebPs into the ignored `public/_img/` and writes the committed `src/lib/image-manifest.json`, keyed by a content hash, so every photo change needs a manifest rebuild.

### A. Byte-identical files

None. The three stand-in copies from the Asia region work (`person-mei`, `region-asia`, `story-5`) were replaced by their own photos in #155 and #158. A perceptual-hash pass over all 47 photos finds no near-duplicates either.

### B. One file wired into several slots (different content, same photo)

Resolved by #161 and #162. Each secondary slot got its own photo, named for the slot.

| File | Primary slot (keeps the file) | Former secondary slots | New file |
| --- | --- | --- | --- |
| `hero.webp` | Home hero (LCP image) | "The week" step 1 | `week-1.webp` |
| `employers.webp` | `/employers` hero | Employers door tile on `/` | `door-employers.webp` |
| | | "The week" step 2 | `week-2.webp` |
| `engineers.webp` | `/engineers` hero | Engineers door tile on `/` | `door-engineers.webp` |
| | | "The week" step 3 | `week-3.webp` |
| `desk.webp` | `/about` hero | "Meet the desk" wall backdrop on `/` | `desk-wall.webp` |
| | | "The week" step 4 | `week-4.webp` |
| `close.webp` | Closing band on `/` | Closing band on `/roles` | `roles-close.webp` |
| | | "The week" step 5 | `week-5.webp` |
| `training-benefits.webp` | `/ai-training` hero | "One application" slide | `training-benefit-1.webp` |
| `story-3.webp` | Campo Health story | "Free for candidates" slide | `training-benefit-2.webp` |
| `story-4.webp` | Keel Systems story | "Paid by the platform" slide | `training-benefit-3.webp` |
| `story-1.webp` | Northline story | "Your say on sharing" slide | `training-benefit-4.webp` |

The week's five photos follow its five steps (brief, long list, interviews, shortlist, sent) and live on each `WeekStep` in the content. The door tiles, desk wall and roles band are keys on `images` in `site.ts`, and `ClosingBand` takes its photo as a prop.

### C. Same entity's own photo on several pages (not a duplicate)

A story's photo on `/` → `/stories` → `/stories/[slug]`, a region's photo on `/` → `/regions` → `/regions/[region]` → the heroes of its roles, a consultant's portrait on `/` → `/about` → the role apply card. The photo is the entity's identity across the site, like a logo. Each is referenced once, in its content entry, however many pages render it. Confirmed as the intended reading when #161 was planned.

## Guard

`npm run check:images` (`scripts/check-images.mjs`) runs in the CI quality job and fails when:

- two files under `public/images` have the same bytes, or
- one `/images/<file>` path is referenced from more than one place in `src/` (comment lines and the generated manifest do not count).

## Adding a photo

1. Pick a free Unsplash photo (no Unsplash+), 2400px wide for scenes, 1600px wide for portraits, and convert it to WebP at quality 80 with sharp.
2. Save it under `public/images/` with a name for its slot, and reference it once: from a content entry when it belongs to an entity, otherwise from a key on `images` in `site.ts`.
3. Add its row to `public/images/ATTRIBUTION.md`.
4. Run `npm run images` and commit `src/lib/image-manifest.json`.
5. `npm run check:images` must pass.

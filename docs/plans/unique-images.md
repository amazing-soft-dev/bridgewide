# Every photo used once

Issue: (to be created; see "Issues and branches")

Every photo under `public/images` should appear in exactly one place on the site. Today three files are byte-for-byte copies of other files, and several photos are wired into more than one slot. The platform logos under `public/images/platforms/` are company marks, each used once, and are out of scope.

## Inventory

34 photos in `public/images` (plus 18 platform logos). All photo paths live in `src/content/site.ts`, `src/content/ai-training.ts`, and four components (`ai-training/page.tsx`, `MissionBand.tsx`, `PathSteps.tsx`, `PortraitWall.tsx`). `npm run images` (`scripts/optimize-images.mjs`) builds the responsive WebPs into the ignored `public/_img/` and writes the committed `src/lib/image-manifest.json`, keyed by a content hash, so every photo change needs a manifest rebuild.

### A. Byte-identical files (md5 and perceptual hash both match)

All three were introduced by commit `14ed04a` (Asia as the fifth region), which copied existing photos as stand-ins.

| Copy to replace | Original | Where the copy shows |
| --- | --- | --- |
| `person-mei.webp` | `portraits/hanae.webp` | Mei Tan: desk wall on `/`, `/about`, consultant card on `/roles/[slug]`, Person JSON-LD |
| `region-asia.webp` | `training-region-asia.webp` | Asia: coverage row on `/`, `/regions` card, `/regions/asia` hero, hero of every Asia role |
| `story-5.webp` | `training-mission.webp` | Lumen Pay story: `/`, `/stories`, `/stories/lumen-pay-settlements` |

### B. One file wired into several slots (different content, same photo)

| File | Primary slot (keeps the file) | Secondary slots (get a new photo) |
| --- | --- | --- |
| `training-benefits.webp` | `/ai-training` hero | "One application" benefit slide on the same page |
| `story-1.webp` | Northline story (`/`, `/stories`, detail) | "Your say on sharing" slide on `/ai-training` |
| `story-3.webp` | Campo Health story | "Free for candidates" slide on `/ai-training` |
| `story-4.webp` | Keel Systems story | "Paid by the platform" slide on `/ai-training` |
| `hero.webp` | Home hero (LCP image, untouched) | "The week" step 1 background on `/` |
| `employers.webp` | `/employers` hero | Employers door tile on `/`, "The week" step 2 |
| `engineers.webp` | `/engineers` hero | Engineers door tile on `/`, "The week" step 3 |
| `desk.webp` | `/about` hero | "Meet the desk" wall photo on `/`, "The week" step 4 |
| `close.webp` | Closing band on `/` | Closing band on `/roles`, "The week" step 5 |

New photos needed: 1 + 3 + 9 = 13.

### C. Same entity's own photo on several pages (proposed: not a duplicate)

A story's photo on `/` → `/stories` → `/stories/[slug]`, a region's photo on `/` → `/regions` → `/regions/[region]` → the heroes of its roles, a consultant's portrait on `/` → `/about` → the role apply card. The photo is the entity's identity across the site, like a logo. Replacing these would mean a different photo for the same story or region on each page, which reads as a mistake. Left as is unless told otherwise.

## Plan

1. **Create the issue(s)** on `amazing-soft-dev/bridgewide` with the tables above, label `enhancement`.
2. **Branch** from `origin/dev` (two commits ahead of local `dev`) as `fix/<n>-<slug>`.
3. **Pick replacement photos** on unsplash.com (free photos only, no Unsplash+), one per slot, matched to the subject and the slot's aspect ratio:
   - Portrait for Mei Tan: 4:5 professional headshot, a different person from every other portrait, crop that keeps the face under the wall's `object-[50%_18%]` crop. Source size 960×1184 like the other portraits.
   - Asia region: a city or landmark in India, Pakistan, Indonesia, or Singapore (the region's named countries), landscape, 1920 wide.
   - Lumen Pay story: a fintech or settlements team scene in Singapore, 16:9 like the other story photos.
   - Benefit slides: four office or candidate scenes distinct from the five employer stories, 1920×1280.
   - The week: five scenes that follow the five steps (brief, search, interview, offer, start), 1920×1280.
   - Door tiles, about desk wall, roles closing band: team and desk scenes distinct from the page heroes.
4. **Download and convert** each pick from `images.unsplash.com/photo-<id>?w=<width>&q=80` with sharp to WebP at quality 80 (the existing sources are 100–400 KB; stay in that range). Each file needs the user's download OK; the plan asks for one blanket OK for the listed ids.
5. **Wire the files**: the copies in A keep their names and get new bytes. The secondary slots in B get new files named for the slot: `training-benefit-1..4.webp`, `week-1..5.webp`, `door-employers.webp`, `door-engineers.webp`, `desk-wall.webp`, `roles-close.webp`. Update the paths and every alt text that describes the photo (`StoriesSection.storyAlt`, `trainingBenefits[].alt`, `TwoDoors` alts).
6. **Credits**: add a row per new photo to `public/images/ATTRIBUTION.md`. Note: the ten `training-*` photos have no row today and their Unsplash ids are not recoverable from the repo.
7. **Guard** (optional): make `npm run images` fail when two source photos share a content hash, so a copy cannot land again.
8. **Rebuild and check**: `npm run images` (commit the manifest), `npm run lint && npm run typecheck && npm run build`, then view every changed page on the running dev server at the desktop and phone widths and confirm the crops (object-position tweaks where a face or horizon lands wrong).
9. **Commit** with a Conventional Commit subject and the shark314 and tomost8 co-author trailers, push, and let `open-pull-request.yml` open the PR into `dev`.

## Issues and branches

Proposed split, one branch each, in this order:

1. `fix/<n>-asia-stand-in-photos`: section A, three photos.
2. `fix/<n>-ai-training-own-photos`: section B on `/ai-training`, four photos. Continues issue #96, which gave the mission band and path steps their own photos.
3. `fix/<n>-home-photos-used-once`: section B on the home set, nine photos.

All three touch `ATTRIBUTION.md` and `image-manifest.json`, and each branch auto-merges into `dev` when CI is green, so branch 2 is cut after branch 1 merges, and branch 3 after branch 2, to avoid conflicts.

## Edge cases and open questions

1. Scope: A only (3 photos), A + B (13 photos), or A + B + C?
2. Three issues and branches as above, or one issue and one branch?
3. Download OK: one blanket OK for the chosen Unsplash files, or approve the list of ids before any download?
4. Photo choice: pick them myself, or show a contact sheet of candidates first?
5. Add the duplicate-hash guard to the image script?
6. The ten uncredited `training-*` photos: leave them, or try to identify them on Unsplash and add rows?
7. The home hero is the LCP image and stays. The week's step 1 gets the new photo instead. OK?
8. Mei Tan's portrait is a stand-in "until the Asia consultant's own photo is in". The new one is still a stand-in. The comment stays.

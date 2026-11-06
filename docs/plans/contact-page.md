# Contact page rebuild

Issue: https://github.com/amazing-soft-dev/bridgewide/issues/113

Rebuild `/contact` to match the Staffora contact page (layout, components, motion, hover, and responsive behaviour), keeping BridgeWide's own palette, fonts, copy, and wordmark. The header, announcement strip, mega menu, search row, mobile sheet, and footer curtain already exist site-wide and are out of scope here.

Reference: <https://forceful-variations-474566.framer.app/contact>. Rebuild as original code; no Framer CSS or assets are reused.

## What is there now

`src/app/contact/page.tsx` is `PageHero` ("The desk answers.") plus one `PageSection` holding an `<address>` and `ContactForm`. The form has three fields with static labels above plain bordered inputs. There is no FAQ, no desk card, no sticky column, no topic select, and no highlighted word in the headings.

## What the reference does

Five stacked blocks: hero, message section, questions section, footer. On the contact page the hero has no image so it is a single column. The message section is a two-column grid (0.85fr / 1.15fr) with a sticky left column (eyebrow chip, heading, lede, white "desk" card) and a white form card on the right. The questions section is a two-column grid with numbered question stubs on the left and a sticky dark answer panel on the right, followed by a "Still asking?" line with phone and email. Every heading's last word sits on an accent block that wipes in after the words rise. Form fields float their mono label, turn white, and wipe an accent underline on focus. The submit button slides its label, levels its arrow, lifts 2px, and follows the pointer.

## Part 1: Content (`src/content/site.ts`)

1. Extend `Contact` with `phone`, `phoneHref`, `address`, and `hours: { days: string; open: string; close: string; timeZone: string }`. Keep `email` and `location`. Fill with the desk's real details or clearly labelled placeholders.
2. Add `contactTopics: readonly string[]` for the topic select: "Hiring engineers", "Looking for a role", "AI training", "Press", "Something else".
3. Add `contactFaq: readonly FaqEntry[]` with three short entries for this page: which regions the desk covers, where the desk is based, when someone can reach it. Reuse the existing `faq` answers where the question already exists.

## Part 2: Hero (`PageHero`, `HeroCopy`, `SplitWords`)

1. Add an `accent` option to `SplitWords` that wraps the last word in a span with a `before:` block. The block starts at `scale: 0 1` with `origin-left`, wipes to `1 1` with a 0.8s `cubic-bezier(0.7,0,0.2,1)` ease delayed until after the word rise, and the word's colour flips to white at the end. Reduced motion renders the block and the white word at once.
2. Add an optional breadcrumb row to `PageHero` (mono, uppercase, "Home ⟶ Contact") above the eyebrow, with `aria-label="Breadcrumb"`. The existing `breadcrumbs()` JSON-LD stays.
3. Copy: title "Talk to the desk." (accent on "desk."), lede "Hiring, looking, or a question about the market. A person answers, usually within two working hours." adapted to BridgeWide's voice.
4. Hero sizes stay on the shared `clamp` scale; the reference runs 44px on a phone to 92px on a wide screen, so raise the `md:text-6xl` cap to an `xl:` step if the current scale tops out early.

## Part 3: Message section (new `src/components/contact/MessageSection.tsx`)

1. `PageSection` with `id="message"`, no built-in heading. Inside it a grid `md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]`, gap `clamp(28px,5vw,90px)`, `items-start`.
2. Left column: `md:sticky md:top-[110px]`. Eyebrow chip ("Contact") as a bordered chip with a thick accent left edge, matching the reference's `st-eb` style, then `SectionHeading` with the accent on "message.", then the lede, then the desk card.
3. Desk card (`DeskCard.tsx`): white, 1px border `cloud-soft`, radius 8, `corner-cut` at 14px, max-width 380px. Rows: mono "The desk" plus an "Open now" / "Closed now" pill computed from `contact.hours` in the desk's time zone (client component, renders "Closed now" on the server and corrects after mount so there is no hydration mismatch); phone in `font-display` bold; email; address; mono hours line. Links take the accent colour on hover.
4. Right column: the form card. White, border `cloud-soft`, radius 12, `corner-cut` at 22px, padding `clamp(22px,2.8vw,40px)`, soft shadow `0 30px 70px rgb(17 17 17 / 0.08)`.
5. Reveal timings as the reference: card at 200ms, lede at 280ms, desk card at 520ms, all 0.9s opacity and 1s rise with the shared ease. Use `Reveal` with `delay`.

## Part 4: Form (`ContactForm`, `Field`, `/api/contact`)

1. Add a `floating` variant to `Field` (or a `FloatingField` in `src/components/forms/`): wrapper `relative rounded-md bg-cloud border border-transparent`, control `pt-6 pb-2 px-3.5 bg-transparent border-0`, label `absolute left-3.5 top-[19px]` in mono uppercase 12px `text-stone`. On `focus-within` or when the control has a value (`data-filled`, set on change) the label moves `translate: 0 -10px; scale: 0.82` and takes the accent colour, the box turns white with a `cloud-soft` border, and an absolute 2px accent line along the bottom scales from `0 1` to `1 1` over 0.45s. The select keeps the same shell with a chevron on the right. Errors keep the current `role="alert"` line.
2. Field grid: `grid-cols-1 min-[900px]:grid-cols-2`, gap `18px 16px`. Name and email side by side, topic select full width, message textarea full width (min 120px), then a row with the mono footnote "We only use these details to answer you." on the left and `SubmitButton` ("Send message", with arrow) on the right. Under 640px the button spans the row.
3. `ContactForm` gains the optional `topic` field, validated against `contactTopics`. `/api/contact` accepts `topic`, prefixes the subject ("Contact · Hiring engineers from Jane"), and adds a "Topic:" line to the body. `/ai-training/contact` uses the same form, so the select stays optional and defaults to "Something else" when absent.
4. Success state: swap the status line for a rotated accent "Sent" stamp (reference `stfm-stamp`, `rotate: -7deg`, 0.5s overshoot ease) above the thanks line.

## Part 5: Questions section (`Faq`, `QuestionDesk`)

1. Generalise `QuestionDesk` so `/contact` can use `Faq layout="desk"`: the stub label and the panel eyebrow read `item.label` instead of the hard-coded "Candidates", and the "Still asking?" footer takes `links` (phone and email for this page) and an optional `cta` instead of the fixed AI-training button.
2. Stub styling to match the reference: white, 1px `cloud-soft` border, radius 6, `corner-cut`, grid `34px minmax(0,1fr) auto` with mono number, display question, mono label, and a dashed 12px "punch hole" circle on the right. Hover nudges `translate-x-1`. The open stub fills with the accent, text white, hole filled.
3. Answer panel: `md:sticky md:top-24`, dark (`bg-ink text-cloud`), radius 10, `corner-cut` at 18px, min-height 280px. When the open item changes, the answer's words fade and rise one by one (0.5s, 25ms stagger) through `SplitWords`; reduced motion shows the text at once.
4. Section heading: eyebrow chip "Questions", h2 "Quick answers." with the accent on "answers.". Stubs reveal with a 70ms stagger via `RevealGroup`.
5. `Faq` already emits `FAQPage` JSON-LD; keep it on for this page.

## Part 6: Hover and motion details

1. Buttons already match (label slide, arrow rotate, 2px lift, magnet, `active:scale-[0.97]`). Confirm `SubmitButton` passes `arrow` so the form button shows the chip.
2. Text links on this page (desk card, still-asking line, breadcrumb "Home") take a 1px bottom border that turns `ink` on hover, as the reference's `stf-links` and `stph-route` do.
3. Every transition honours `prefers-reduced-motion` through the existing `motion-reduce:` utilities and `usePrefersReducedMotion`.

## Part 7: Responsive

| Width | Behaviour |
| --- | --- |
| ≥ 1200px | Full two-column message and questions grids, sticky side columns, 56px gutter (the `wrap` utility already handles the gutter). |
| 900–1199px | Same grids, gutter 32px. |
| < 900px | Message and questions grids collapse to one column; sticky turns off; form fields single column; desk card moves above the form card. |
| < 700px | Gutter 20px. |
| < 640px | Footnote and submit button stack; button spans full width. |

Use the existing `gate:` variant (`max-width: 899px` or reduced motion) for the sticky and stagger switches so the breakpoints stay in one place.

## Part 8: Metadata and SEO

1. `pageMetadata` title "Contact", description naming the desk's phone and email and the response window.
2. Keep `breadcrumbs()`; add a `ContactPoint` (telephone, email, hours, area served) to the organization node in `src/lib/structured-data.ts` from the extended `contact` object.

## Verification

- `npm run lint && npm run typecheck && npm run build` (server and static export).
- Compare against the reference at 1440, 810, and 375px: hero, message, questions, footer; hover on stubs, fields, and the button; keyboard focus rings; reduced motion.
- `/ai-training/contact` still renders and submits.
- Send a test message locally and confirm the topic appears in the email subject and body.

## Out of scope

Brand colours stay as they are (`--color-brand`, `--color-cloud`, `--color-ink`). Header, announcement strip, search, mega menu, mobile sheet, and footer curtain are already built and are not touched.

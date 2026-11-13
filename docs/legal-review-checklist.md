# Legal review checklist

For the law firm that signs off the privacy notice and terms for all six markets. This is not legal advice and it does not say what the law requires. It says what the site does, which laws probably apply, and the question to answer for each market. The firm decides.

The pages under review: the privacy notice (`/privacy`, text in `src/content/privacy.ts`) and the terms (`/terms`, fees in `src/content/site.ts`, disclosures in `src/content/disclosures.ts`). Both are `noindex` until the firm signs off. Index them only after.

## What the site does (facts for every market)

- A visitor fills in a form: hire brief, CV or role application, keep-a-profile (talent pool), contact, salary-guide email box, AI-training application, partner inquiry.
- Each form becomes two emails through Resend: the whole message (and a CV, as an attachment) to one desk mailbox, and a confirmation to the visitor. **Nothing is stored in a database.** There are no accounts, no cookies for advertising, and no tracking pixels.
- Companies that handle a message: Resend (email), Vercel (hosting; Web Analytics and Speed Insights in production, skipped when the browser sends Do Not Track), Cloudflare Turnstile (spam check; sees IP address and browser signals), Sentry (error reports, with request bodies, cookies, headers, query strings, and email addresses removed before sending; off until a DSN is set), and the desk's mail provider.
- A CV or profile leaves BridgeWide only after the candidate agrees to an introduction. For AI-training work the platform, not BridgeWide, pays and sets terms.
- Retention: a talent-pool profile and CV for 12 months, then the desk deletes the email (a mailbox policy, see `docs/mailbox-retention.md`). Other mail is kept while it is needed. A deletion request is answered by deleting the messages.
- The public contact address is one person's mailbox for every purpose, including data requests.
- Salary figures are shown in US dollars for every region.

## The checklist

For each market, answer: is the notice complete, is consent needed and worded right, how fast must a request be answered, are transfers covered, and is anything else required (pay transparency, agency registration)?

| Market | Law that probably applies (to confirm) | Questions for the firm |
| --- | --- | --- |
| **United States** | State privacy laws such as California (CCPA and CPRA) and others; pay-range rules in several states and cities; state rules on employment agencies | Is BridgeWide a "business" under each state law, and which notices does it owe (categories collected, "do not sell or share")? What reply time applies (California states 45 days)? Which postings need a pay range? Is an employment-agency licence or registration needed anywhere BridgeWide places people? |
| **Canada** | PIPEDA; Quebec Law 25; provincial privacy laws for some provinces; Canadian anti-spam law (CASL) for any marketing email | Is consent for the CV and profile valid as worded? What does Quebec require (a named privacy officer, transfer assessment)? Is the visitor confirmation email exempt from CASL as a reply? |
| **European Union** | GDPR; the Pay Transparency Directive (national laws due mid-2026) | Which lawful basis for each form (consent, contract steps, legitimate interest)? Is an EU representative needed? Are transfers to the US covered (Resend, Vercel, Cloudflare), for example by the EU-US Data Privacy Framework or standard clauses? Reply time (one month)? Pay ranges in postings? |
| **United Kingdom** | UK GDPR and the Data Protection Act 2018; the Employment Agencies Act and the Conduct of Employment Agencies and Employment Businesses Regulations | Is a UK representative needed? Transfers and reply time (one month)? Do the agency regulations require terms or a disclosure beyond what the terms page says? |
| **Latin America** | Brazil: LGPD. Mexico: the federal private-party data law. Colombia: Law 1581. Others vary | Brazil needs a legal basis and a named contact; reply time is short (check, 15 days for a full declaration). Is the Portuguese or Spanish version of the notice needed to count as clear? Do Mexico and Colombia require a notice in a set form? |
| **Asia** | Singapore: PDPA. India: the Digital Personal Data Protection Act 2023. Also Pakistan and Indonesia (the Singapore and Bangalore roles are the live ones) | Does PDPA need a named data protection officer and a 30-day reply window? How does the India law treat consent for a CV and for the transfer abroad? Are the Pakistan and Indonesia rules relevant while there are no roles there? |

## Questions that apply everywhere

1. **Is the mailbox the controller's record, and is that enough?** With no database, the desk mailbox is the system of record. Does the notice need to name the mailbox provider and its location?
2. **Is "the time the law of your place allows" an acceptable reply promise,** or should the notice state a number per region?
3. **Is the equal-opportunity wording right** where BridgeWide places candidates, and is "we do not pass on a client brief that asks us to" a promise the firm can keep?
4. **Is the AI-training disclosure enough** for the platforms' candidates, including any rules on automated decisions? (The site does not say how profiles are matched; the desk should say, and the firm should check what the answer triggers.)
5. **Do the published fees and the 12-week replacement need to appear in an agreement,** not just on the terms page? The terms page says the signed agreement wins.
6. **Contact details:** is one person's email acceptable as the privacy contact, or should there be a role address and, where required, a postal address and registration number? (The site has `michael.allen@bridgewide.org` and no street address.)
7. **Cookies and analytics:** Vercel Analytics is described as cookieless and skipped on Do Not Track. Does any market still need a banner?
8. **Currency and pay:** salary bands are in US dollars for every region. Do EU and UK postings need local currency?

## When the firm is done

- Update `src/content/privacy.ts` and `src/content/disclosures.ts` with the firm's wording; the tests in `src/content/*.test.ts` check the facts above, so a change that drops a processor or a form fails the build.
- Remove `robots: { index: false }` from `src/app/privacy/page.tsx` and `src/app/terms/page.tsx`, and add the two pages to `src/app/sitemap.ts`.
- Record who signed off, for which markets, and the date, at the top of this file.

# Choosing the legal firm

No firm is chosen yet. This page says what to look for, what to ask on a first call, and gives a short brief to send. It is not legal advice and it does not recommend a firm.

## The job

A small recruiting business with a marketing site wants the firm to review and sign off two pages, the privacy notice and the terms, for six markets: the United States, Canada, the European Union, the United Kingdom, Latin America, and Asia. The site stores nothing in a database. Every form becomes an email. The facts and the questions are in [legal-review-checklist.md](legal-review-checklist.md), so the firm can start from that instead of from a blank page.

The work is a review and a few rounds of edits to two pages, not an ongoing programme. Ask for a fixed fee or a capped estimate.

## What to look for

| Need | Why it matters here |
| --- | --- |
| **Privacy and employment-agency experience, not general corporate work** | The risk is in data protection and in how recruiters must describe themselves and their fees |
| **One firm, or a named network, that covers all six markets** | The owner wants one sign-off. A firm that covers the US, Canada, the EU and the UK directly, and uses correspondent firms in Latin America and Asia, is normal. Ask who the correspondents are |
| **A named lead, and a named backup** | A single lawyer who is away stalls the launch |
| **Fixed or capped fee, with scope in writing** | Two pages and a checklist should not become open-ended |
| **A turnaround you can plan around** | Ask for the days from receiving the checklist to a first mark-up, and from your edits to sign-off |
| **Plain language** | The notice is read by candidates. A firm that drafts in clear English is worth more than one that sends legalese |
| **Willingness to sign off by market** | You can publish the pages as soon as the main markets are done and add the others later, if they say which is which |

Some firms need a conflict check first. If a firm also acts for a competitor or a client you place with, they will say so early.

## Questions for the first call

1. Which of the six markets do you cover yourselves, and who covers the rest?
2. Have you reviewed a recruiting or staffing site before? Which laws did you flag?
3. The site has no database and every message lands in one mailbox. What does each market need that a stored-records design would not?
4. Is a representative or a named privacy contact needed for the EU and the UK, and who can act as one?
5. Which of our statements about retention and deletion could we not keep, given the mailbox is cleaned by hand once a month?
6. Do the pay-transparency rules, and any employment-agency registration, apply to us in the markets where we place people?
7. Do the published fees and the 12-week replacement need to be in a signed agreement, and will you review a template?
8. What do you need from us, in what form, and by when? What is the fee, and what happens if the scope grows?

## The brief to send

> Subject: Privacy notice and terms review for a recruiting site, six markets
>
> We run BridgeWide, a recruitment firm that places software engineers with companies, and we also introduce candidates to AI-training platforms. Our website collects names, emails, CVs and short profiles through seven forms. Nothing is kept in a database: every form becomes an email to one mailbox, and a CV is an email attachment. We use Resend (email), Vercel (hosting and page measurement), Cloudflare Turnstile (spam check), Sentry (error reports, with personal data removed), and Hostinger (the mailbox).
>
> We need a lawyer or firm to review and sign off two pages, a privacy notice and terms, for the United States, Canada, the EU, the UK, Latin America and Asia. A checklist with the facts about the site, the law we think applies in each market, and our open questions is attached.
>
> Please tell us: which markets you cover yourselves, who covers the rest, your fee or a capped estimate, and how many working days a first review would take.

Attach `docs/legal-review-checklist.md`, the text of the privacy notice (`src/content/privacy.ts`) and the terms (`src/content/disclosures.ts`, and the fees in `src/content/site.ts`).

## When you have chosen

Write the firm's name, the lead lawyer, and the contact at the top of `docs/legal-review-checklist.md`, with the date. Then follow "When the firm is done" at the bottom of that file.

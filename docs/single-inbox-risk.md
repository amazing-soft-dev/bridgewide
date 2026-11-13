# One mailbox for everything

Decision (2026-11-12): `michael.allen@bridgewide.org` is the only mailbox. It is the address for hiring, candidates, press, privacy and deletion requests, accommodation requests, and security reports. It also receives every form and every CV. This page records what that puts at risk and when to split it.

## What it puts at risk

| Risk | What happens |
| --- | --- |
| **The person is away or leaves** | Forms, CVs, deletion requests and security reports pile up unseen. A data request has a legal clock in several markets. |
| **One account is the single point of failure** | A locked account, a lapsed licence, or a phished password stops every form from arriving, and exposes every CV at once. |
| **No access control** | Anyone who needs to help with privacy or hiring needs the whole mailbox, including every candidate's CV. |
| **A personal address in public** | The name shows in the footer, structured data, `llms.txt`, the security file, and the privacy notice, and draws spam and impersonation. |
| **Nothing is stored elsewhere** | Because the site keeps no database, this mailbox is the only copy of every message. Losing it loses the leads. |

## Triggers to move to role addresses

Do it when any one is true:

- a second person handles hiring, privacy, or candidates;
- the first data-subject request or security report arrives;
- the mailbox misses a form for a day because of an outage or absence;
- the legal firm asks for a role address or postal contact (see `docs/legal-review-checklist.md`);
- the volume of CV mail makes the mailbox hard to search.

## How to split it

1. In the mail system, create aliases or shared mailboxes: for example `hello@` (hiring and general), `careers@` (candidates), `privacy@` (data and deletion requests), `security@`. Forward each to the current mailbox first, so nothing changes for the desk.
2. Update the address in the places listed below, one purpose at a time. `CONTACT_TO_EMAIL` in Vercel decides where form mail goes; change it last.
3. Keep the old address forwarding for at least a year.
4. Re-run the checks in `docs/email-authentication.md`.

## Where the address appears in the code

| Place | Purpose |
| --- | --- |
| `src/content/site.ts` (`contact.email`) | The one source for the footer, contact page, role pages, error pages, structured data, and `llms.txt` |
| `src/content/privacy.ts`, `src/content/disclosures.ts` | Data requests, deletion, accommodation (they read `contact.email`) |
| `public/.well-known/security.txt` | Security reports (a literal copy: edit it and `Expires` together) |
| `.env.example`, Vercel `CONTACT_TO_EMAIL` | Where form mail is delivered |
| `README.md`, `docs/*.md` | Instructions that name the address |

To use a different address for one purpose, add a field (for example `contact.privacyEmail`) to `src/content/site.ts` and point `privacy.ts` at it, so there is still one place to change each.

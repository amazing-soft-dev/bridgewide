# Mailbox retention runbook (Hostinger email)

The site stores nothing. Every form becomes an email to the desk mailbox (`CONTACT_TO_EMAIL`, `michael.allen@bridgewide.org`), so that mailbox is the only place a message or CV lives. The privacy notice promises that a talent-pool profile and CV are **kept for 12 months and then deleted**. That promise is true only if someone deletes them. No code does it.

## What Hostinger can and cannot do

The desk mailbox is Hostinger standard email. From Hostinger's help pages (check them again before relying on this, because plans change):

- **It cannot delete mail by age on its own.** There is no retention policy of the kind Google Vault or Microsoft Purview offer. Hostinger's webmail is Roundcube, which has no "delete after N months" setting.
- **Filters work on new mail only.** A filter made in hPanel (*Emails* → the mailbox → *Email filters*) files messages that arrive after it exists. It does not touch mail already in the inbox.
- **Spam and Trash empty themselves after 30 days.** So a message you delete is gone from the mailbox within a month.

So the 12-month rule is a **monthly manual task**, not an automatic one. Do it, and write down that it was done, or the promise in the privacy notice is not true.

## What the site sends

The subject line tells you what a message is. Use these to file and expire them.

| Form | Subject starts with | Keep |
| --- | --- | --- |
| Keep a profile (`/contact#keep-profile`) | `Talent pool ·` | **12 months, then delete** (the published promise) |
| CV upload and role application | `CV from` | Decide below |
| AI-training application | `AI training application from` | Decide below |
| AI-training partner inquiry | `AI training partner inquiry from` | Decide below |
| Hire brief | `Hire brief:` | Decide below |
| Contact | `Contact ·` | Decide below |
| Salary guide request | `Salary guide request` | Decide below |
| Role digest (to the desk only) | `Role digest` | 30 days is plenty |

The visitor's confirmation has the subject `BridgeWide received your note (BW-…)` and goes to the visitor, not to this mailbox.

**Decide below.** The notice says other messages are "kept while we are working with you or answering you, and then deleted when they are no longer needed". Pick one number and write it here so the rule and the notice agree: **24 months** is a common choice for recruiting mail, but the legal firm should confirm the right figure for each market.

## Step 1: file the talent-pool mail (once)

1. In webmail, create a folder `Talent pool`.
2. In hPanel, open *Emails* → the mailbox → *Email filters* and add a filter: *Subject* contains `Talent pool ·`, action *Move to* `Talent pool`.
3. Move the talent-pool messages already in the inbox by hand: search the inbox for `Talent pool ·`, select all, move to the folder.

Do the same for the other kinds if you want each in its own folder (`CV from`, `Hire brief:`, and so on). It makes the monthly review quick.

## Step 2: the monthly review (every month, first working day)

Put a repeating reminder in your calendar: "Mailbox retention: delete mail past its limit."

1. Open webmail, then the `Talent pool` folder.
2. Use Roundcube's advanced search (the arrow next to the search box): *Date* → *before* → the date one year ago today. Search within the folder.
3. Check the list, select all, and delete.
4. Empty the Trash folder for the same messages (it also empties itself after 30 days).
5. Repeat for the other folders with their number from the table (for example 24 months), and for `Role digest` with 30 days.
6. Write the date, the folder, and the count in a log (a spreadsheet, or a note in the calendar event). Keep no personal details in the log.

If the mailbox is large, Hostinger's storage guide recommends deleting old mail with big attachments first; CVs are the biggest items.

## Step 3: answer a deletion request

When someone writes to the desk mailbox asking for their details to be deleted:

1. Reply to confirm you received it, and say you will answer within the time that applies where they live (the notice commits to "the time the law of your place allows"; the legal firm sets the figure).
2. In webmail, search every folder for their email address and name. Delete every message from or about them, including the CV attachment, from the inbox, the other folders, Sent, and Trash.
3. Deleting a message does not delete the copy Resend, the hosting company, or Hostinger keeps in its own logs for a short time. Say so if asked.
4. Reply to confirm it is done. Keep only a note that a request was handled (date and reference, no personal details) if you need an audit trail.

A request to *pause* a profile (do not introduce them) is handled by moving the message to a `Paused` folder and not using it. It does not delete anything.

## If manual is not good enough

A monthly task can be forgotten. If the desk grows or a market's law needs proof of automatic deletion, move the mail to a system with real retention rules: Google Workspace (Vault) or Microsoft 365 (Purview). Changing provider changes the MX records, so follow `docs/email-authentication.md` again and warn the legal firm.

## Check it is working

- Send a test through the keep-a-profile form and confirm the filter files it in `Talent pool`.
- After the first monthly review, read the log and confirm the count matches what the search showed.
- After 12 months and a day, confirm a message from the first month is gone.
- Review this page whenever a form's subject line changes in `src/app/api/*/route.ts`.

Sources for the Hostinger statements: [how to create email filters on hPanel](https://support.hostinger.com/en/articles/4469173-how-to-create-email-filters-on-hpanel), [what happens to emails in the spam folder](https://www.hostinger.com/support/?p=1077), [how to manage your email storage](https://www.hostinger.com/support/10627479-how-to-manage-your-email-storage-with-hostinger-email/).

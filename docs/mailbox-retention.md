# Mailbox retention runbook

The site stores nothing. Every form becomes an email to the desk mailbox (`CONTACT_TO_EMAIL`), so that mailbox is the only place a message or CV lives. The privacy notice promises that a talent-pool profile and CV are **kept for 12 months and then deleted**. That promise is true only if the mailbox deletes them. No code does it. This page says how to set it up.

I could not set this for you: it needs an administrator of your mail system. The steps below name the provider screens as they were when this was written; menus move, so check each against your admin console.

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
| Role digest (to the desk only) | `Role digest` | Short, 30 days is plenty |

The visitor's confirmation has the subject `BridgeWide received your note (BW-…)` and goes to the visitor, not to this mailbox.

**Decide below.** The notice says other messages are "kept while we are working with you or answering you, and then deleted when they are no longer needed". Pick one number and write it here so the rule and the notice agree. A common choice for recruiting mail is 24 months; the right figure for each market is a question for the legal firm.

## Step 1: label the talent-pool mail

Do this first, because the retention rule needs something to attach to.

- **Google Workspace (Gmail):** create a label `Talent pool`. In Gmail settings, add a filter: *Subject* contains `Talent pool ·`, action *Apply the label* `Talent pool` (and, if you like, *Skip the inbox* so it does not crowd the desk's view).
- **Microsoft 365 (Outlook):** create a folder `Talent pool`. Add an inbox rule: *Subject includes* `Talent pool ·`, action *Move to folder* `Talent pool`.

Existing talent-pool messages need the label or folder applied once by hand (search the subject, select all, apply).

## Step 2: set the 12-month deletion

- **Google Workspace:** an administrator uses **Google Vault** (needs a Vault license): *Retention* → *Custom rules* → *Gmail*. Scope it to the `Talent pool` label, set *retain for* 365 days, and choose *delete after the retention period*. Without Vault, there is no admin-enforced delete; the fallback is a monthly calendar reminder for the desk to search `label:"Talent pool" older_than:12m`, review, and delete.
- **Microsoft 365:** an administrator opens **Microsoft Purview** → *Data lifecycle management* → *Retention policies*, creates a policy for *Exchange email* scoped to the desk mailbox, with *retain for 12 months* then *delete items automatically*. Scoping to the `Talent pool` folder needs a retention label published to the mailbox and applied by an Outlook rule; if that is too fiddly, use the same monthly review as the fallback above.

Check the first deletion run: ask the administrator for the retention report a month after turning it on.

## Step 3: answer a deletion request

When someone writes to the desk mailbox asking for their details to be deleted:

1. Reply to confirm you received it, and say you will answer within the time that applies where they live (the notice commits to "the time the law of your place allows"; the legal firm sets the figure).
2. Search the mailbox for their email address and name. Delete every message from or about them, including the CV attachment, from the inbox, the label or folder, sent items, and trash.
3. Deleting a message does not delete the copy Resend, the hosting company, or the mail provider keeps in its own logs for a short time. Say so if asked.
4. Reply to confirm it is done, and keep only a note that a request was handled (date and reference, no personal details) if you need an audit trail.

A request to *pause* a profile (do not introduce them) is handled by moving the message to a `Paused` label and not using it. It does not delete anything.

## Check it is working

- Send a test through the keep-a-profile form with the subject line above and confirm the filter files it.
- After 12 months and a day, confirm a message from the first month is gone.
- Review this page whenever a form's subject line changes in `src/app/api/*/route.ts`.

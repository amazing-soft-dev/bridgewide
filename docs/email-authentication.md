# Email authentication for bridgewide.org

Every form is two emails: one to the desk and a confirmation to the visitor, both sent through Resend as `BridgeWide <noreply@bridgewide.org>`. Nothing is stored, so an email that is not delivered is a lost lead. Three DNS records decide whether mail providers trust these messages. This page says what to set and how to check it. It needs access to the DNS for `bridgewide.org`, which I do not have.

Exact record values come from your dashboards. They differ by account and change over time, so copy them from the screens named below instead of from this page.

## What each record does

| Record | Question it answers | Where the value comes from |
| --- | --- | --- |
| **SPF** | Is this server allowed to send for the domain? | Resend's domain page (and your mailbox provider's setup guide for staff mail) |
| **DKIM** | Is this message signed by the domain, and unchanged? | Resend's domain page: the DKIM records it asks you to add |
| **DMARC** | What should a receiver do if SPF and DKIM do not line up, and who gets reports? | You write it, as below |

## Step 1: confirm Resend's records

In the Resend dashboard, open **Domains** → `bridgewide.org`. Every record Resend lists (DKIM, SPF, and the bounce/return-path record) should show **Verified**. If any shows pending or failed, copy it again into your DNS host exactly as shown; a stray space or a doubled domain name is the usual cause.

Staff mail from the desk mailbox is a different sender. Your mailbox provider (Google Workspace or Microsoft 365) gives its own SPF and DKIM records. An SPF record is one TXT line per domain, so if both senders share the same name, they must be merged into one record rather than added as two. Resend uses its own sub-domain for the return path, so in most setups the two do not collide; check Resend's page to see which name it asks for.

## Step 2: add a DMARC record, in monitoring mode

Add one TXT record at `_dmarc.bridgewide.org`:

```text
v=DMARC1; p=none; rua=mailto:michael.allen@bridgewide.org; fo=1
```

`p=none` means "report, do not block". `rua` is where daily summary reports go. They are XML from Google, Microsoft, Yahoo and others, and are easier to read through a free DMARC report reader than raw. Use a mailbox that exists (the desk address is the only one today).

## Step 3: read the reports for two to four weeks

You are looking for any legitimate sender that fails SPF and DKIM, for example a form tool, a newsletter service, or a forgotten system. Fix or add each before tightening the policy.

## Step 4: tighten the policy

When the reports show only mail you recognise passing, change `p=none` to `p=quarantine` (suspicious mail goes to spam), and after another few weeks to `p=reject`. Move one step at a time and keep watching the reports.

## Check it in a real inbox

1. Submit the keep-a-profile form or `/contact` with your own address as the visitor.
2. In Gmail, open the confirmation, then **⋮ → Show original**. The header block should read `SPF: PASS`, `DKIM: PASS`, and `DMARC: PASS` for `bridgewide.org`.
3. In Outlook, open the message headers and look for `spf=pass`, `dkim=pass`, `dmarc=pass` in the `Authentication-Results` line.
4. Do the same for the desk copy in the mailbox that receives it.

Re-check after any DNS change and after changing `CONTACT_FROM_EMAIL`.

## If mail goes missing

- A visitor says they got no confirmation: ask them to check spam, then check Resend's **Emails** log for that time. A bounce or "suppressed" status names the reason.
- The desk got nothing: check Resend's log first (was it sent?), then the mailbox's spam and quarantine, then the Vercel function logs for a `502`.
- Resend errors that mean a wrong setting (a bad API key, an unverified sender) are not retried by the site. They show up as a 502 to the visitor and as the same error in the log.

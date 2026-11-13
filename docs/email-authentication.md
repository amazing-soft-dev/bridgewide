# Email authentication for bridgewide.org (Hostinger mail, Resend, Cloudflare DNS)

Every form is two emails: one to the desk and a confirmation to the visitor. Both are sent through **Resend** as `BridgeWide <noreply@bridgewide.org>`. The desk mailbox lives at **Hostinger**. The DNS is on **Cloudflare**. Nothing is stored, so an email that is not delivered is a lost lead. Three kinds of DNS record decide whether mail providers trust these messages. I cannot change DNS from here; this page says what to set and how to check it.

Values below come from Hostinger's help pages. The exact targets are shown in your dashboards, and they change, so copy them from there rather than from this page.

## The records, by purpose

| Purpose | Name (host) | Type | Value | Comes from |
| --- | --- | --- | --- | --- |
| Receive mail at Hostinger | `@` | MX | `mx1.hostinger.com` priority 5, and `mx2.hostinger.com` priority 10 | Hostinger |
| Hostinger may send for the domain (staff replies) | `@` | TXT | `v=spf1 include:_spf.mail.hostinger.com ~all` | Hostinger |
| Hostinger signs mail | `hostingermail-a._domainkey`, `hostingermail-b._domainkey`, `hostingermail-c._domainkey` | CNAME | the matching `….dkim.mail.hostinger.com` target | Hostinger hPanel |
| Resend signs and sends the forms' mail | the names Resend lists (a DKIM record and a return-path record on a sub-domain) | TXT, CNAME, MX | exactly as shown | Resend → Domains |
| Tell receivers what to do on a failure, and send reports | `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:michael.allen@bridgewide.org; fo=1` | you |

Rules that cause most failures:

- **Only one SPF record per name.** If a second SPF TXT is added at `@`, SPF breaks. Add anything new inside the existing record. Resend puts its SPF on its own sub-domain, so the root record stays Hostinger's.
- **Keep only Hostinger's MX records** at `@`. A leftover MX from an old host sends some mail to the wrong place.
- **SPF counts at most 10 lookups.** Each `include:` costs one. Hostinger plus one more sender is fine.

## Step 1: add the records in Cloudflare

1. Cloudflare dashboard → the `bridgewide.org` zone → **DNS** → **Records** → **Add record**.
2. Add each row above. Copy values from the Hostinger and Resend screens named in the last column.
3. **Set every CNAME to "DNS only" (the grey cloud).** A proxied (orange) CNAME hides the target, and the DKIM check fails. MX and TXT records are never proxied.
4. In hPanel (*Emails* → the domain → DNS records) and in Resend (*Domains* → `bridgewide.org`) press the check button. Both should show every record verified. A record that will not verify is nearly always a stray space, a doubled domain name (`…bridgewide.org.bridgewide.org`), or a proxied CNAME.

## Step 2: leave DMARC at `p=none` and read the reports for two to four weeks

`p=none` means "report, do not block". The daily reports are XML from Google, Microsoft, Yahoo and others, sent to the address in `rua`. A free DMARC report reader makes them readable. You are looking for a legitimate sender that fails, for example a form tool or a newsletter service nobody remembered.

## Step 3: tighten the policy

When the reports show only mail you recognise passing, change `p=none` to `p=quarantine`, and after another few weeks to `p=reject`. Move one step at a time, and keep reading the reports.

## Check it in a real inbox

1. Submit `/contact` with your own address as the visitor.
2. In Gmail, open the confirmation, then **⋮ → Show original**. The header block should read `SPF: PASS`, `DKIM: PASS`, and `DMARC: PASS` for `bridgewide.org`.
3. In Outlook, open the message headers and look for `spf=pass`, `dkim=pass`, `dmarc=pass`.
4. Do the same for the desk copy in the Hostinger mailbox.

Re-check after any DNS change and after changing `CONTACT_FROM_EMAIL`.

## If mail goes missing

- A visitor says they got no confirmation: ask them to check spam, then check the Resend **Emails** log for that time. A bounce or "suppressed" status names the reason.
- The desk got nothing: check Resend's log first (was it sent?), then the Hostinger spam folder, then the Vercel function logs for a `502`.
- Resend errors that mean a wrong setting (a bad API key, an unverified sender) are not retried by the site. They show up as a 502 to the visitor and as the same error in the log.

Sources: [Hostinger: set up a domain for Hostinger mail](https://www.hostinger.com/support/8650765-set-up-a-domain-for-hostinger-mail/), [Hostinger: domain settings](https://docs.hostinger.com/emails/domain-settings), [Hostinger email SPF and DKIM walkthrough](https://easydmarc.com/blog/hostinger-email-spf-and-dkim-configuration-step-by-step-guideline/).

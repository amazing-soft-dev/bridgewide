# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /privacy
- Location: e2e\a11y.spec.ts:30:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner:
    - generic [ref=e3]:
      - generic [ref=e5]: 14 roles live
      - link "Salary guide →" [ref=e6] [cursor=pointer]:
        - /url: /salary-guide
    - generic [ref=e8]:
      - link "BridgeWide" [ref=e9] [cursor=pointer]:
        - /url: /
      - generic [ref=e13]:
        - button "Search roles" [ref=e14] [cursor=pointer]
        - button "Menu" [ref=e18] [cursor=pointer]
  - main [ref=e21]:
    - generic [ref=e24]:
      - paragraph [ref=e25]: Privacy
      - heading "How the desk handles your details." [level=1] [ref=e26]
      - paragraph [ref=e28]: Every form is an email, and nothing is stored in a database. Updated 12 November 2026. A lawyer reviews this notice before it is indexed.
    - region "Who we are" [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]:
          - paragraph [ref=e32]: Notice
          - heading "Who we are" [level=2] [ref=e33]
        - paragraph [ref=e36]: BridgeWide is a recruitment firm that places software engineers with companies. BridgeWide decides why and how the details you send through this site are used. Write to michael.allen@bridgewide.org for anything in this notice.
    - region "How a form works" [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - paragraph [ref=e40]: Notice
          - heading "How a form works" [level=2] [ref=e41]
        - generic [ref=e43]:
          - paragraph [ref=e44]: "Every form on this site becomes two emails: one to the BridgeWide desk with everything you typed, and one back to you to confirm we have it. We do not keep a database of submissions, and there is no account or login. A CV is attached to the email to the desk and is not stored anywhere else."
          - paragraph [ref=e45]: That means your message lives in the desk mailbox, and in the mailboxes and logs of the companies that deliver it.
    - region "What each form collects" [ref=e46]:
      - generic [ref=e47]:
        - generic [ref=e48]:
          - paragraph [ref=e49]: Notice
          - heading "What each form collects" [level=2] [ref=e50]
        - generic [ref=e52]:
          - paragraph [ref=e53]: "Hire brief: your name, work email, company, the role and regions, the engagement, the stack, the pay band, a hiring manager, and your message."
          - paragraph [ref=e54]: "CV upload and role application: your name, email, region, phone (optional), right to work, and your CV file."
          - paragraph [ref=e55]: "Talent pool: your name, email, region, country, discipline, years of experience, work mode, a short profile, your CV, and your consent to keep it for 12 months."
          - paragraph [ref=e56]: "Contact: your name, email, the topic, and your message."
          - paragraph [ref=e57]: "Salary guide and the footer email box: your email address."
          - paragraph [ref=e58]: "AI-training application and partner inquiry: the fields on the form, your right to work, your consent to an introduction, and a CV (candidates) or company details and volumes (partners)."
    - region "What we use it for" [ref=e59]:
      - generic [ref=e60]:
        - generic [ref=e61]:
          - paragraph [ref=e62]: Notice
          - heading "What we use it for" [level=2] [ref=e63]
        - generic [ref=e65]:
          - paragraph [ref=e66]: To answer you. To match you with a role, or a company with an engineer. To make an introduction, but only after you agree to it. For AI-training work, a profile is introduced to a platform only after you agree to that introduction, and the platform pays you.
          - paragraph [ref=e67]: We do not sell your details, and we do not use them to send marketing you did not ask for.
    - region "Who handles it" [ref=e68]:
      - generic [ref=e69]:
        - generic [ref=e70]:
          - paragraph [ref=e71]: Notice
          - heading "Who handles it" [level=2] [ref=e72]
        - generic [ref=e74]:
          - paragraph [ref=e75]: "Resend sends the emails: the message to the desk and the confirmation to you."
          - paragraph [ref=e76]: Vercel hosts the site and, in production, measures page views and speed.
          - paragraph [ref=e77]: Cloudflare Turnstile checks that a form is filled in by a person; it sees your IP address and browser signals.
          - paragraph [ref=e78]: "Sentry receives a report when the site hits an error: the page address and technical details, never what you typed, a request body, a cookie, or an email address."
          - paragraph [ref=e79]: Hostinger holds the desk mailbox, where every message and CV is kept.
          - paragraph [ref=e80]: A company or platform sees your details only after you agree to an introduction.
    - region "How long we keep it" [ref=e81]:
      - generic [ref=e82]:
        - generic [ref=e83]:
          - paragraph [ref=e84]: Notice
          - heading "How long we keep it" [level=2] [ref=e85]
        - generic [ref=e87]:
          - paragraph [ref=e88]: Because nothing is in a database, how long we keep a message is how long it stays in the desk mailbox.
          - paragraph [ref=e89]: A talent-pool profile and CV are kept for 12 months from the day you consent, then the desk deletes the email. You can ask michael.allen@bridgewide.org to delete it sooner, or to pause it so we do not introduce you. Other messages are kept while we are working with you or answering you, and then deleted when they are no longer needed.
          - paragraph [ref=e90]: Deleting an email from the desk mailbox does not delete the copies the delivery companies keep in their own logs for a short time.
    - region "Page measurement" [ref=e91]:
      - generic [ref=e92]:
        - generic [ref=e93]:
          - paragraph [ref=e94]: Notice
          - heading "Page measurement" [level=2] [ref=e95]
        - paragraph [ref=e98]: In production, Vercel Web Analytics and Speed Insights count page views and measure speed. They are skipped when your browser sends Do Not Track. Query strings are removed, and a page view whose address contains an email is dropped. We do not use advertising cookies.
    - region "Your rights" [ref=e99]:
      - generic [ref=e100]:
        - generic [ref=e101]:
          - paragraph [ref=e102]: Notice
          - heading "Your rights" [level=2] [ref=e103]
        - generic [ref=e105]:
          - paragraph [ref=e106]: Where you live decides which rights you have. In many places, including the United States (for example California), Canada (including Quebec), the United Kingdom, the European Union, Brazil, other parts of Latin America, and Singapore, you can ask for a copy of your details, ask us to correct or delete them, ask us to stop using them, and withdraw a consent you gave. Email michael.allen@bridgewide.org from the address you used. We may ask you to confirm who you are, and we answer within the time the law of your place allows.
          - paragraph [ref=e107]: If you are not happy with an answer, you can complain to the data protection authority where you live.
    - region "Moving data between countries" [ref=e108]:
      - generic [ref=e109]:
        - generic [ref=e110]:
          - paragraph [ref=e111]: Notice
          - heading "Moving data between countries" [level=2] [ref=e112]
        - paragraph [ref=e115]: The companies listed above run in several countries, including the United States. Your details can leave the country where you are. We rely on the safeguards those companies offer for that.
    - region "Children" [ref=e116]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - paragraph [ref=e119]: Notice
          - heading "Children" [level=2] [ref=e120]
        - paragraph [ref=e123]: This site is for people who are old enough to work. We do not knowingly collect details from children.
    - region "Changes" [ref=e124]:
      - generic [ref=e125]:
        - generic [ref=e126]:
          - paragraph [ref=e127]: Notice
          - heading "Changes" [level=2] [ref=e128]
        - paragraph [ref=e131]: This notice was last updated on 12 November 2026. We change it when what the site does changes.
  - contentinfo [ref=e134]:
    - generic [ref=e135]:
      - generic [ref=e136]:
        - generic [ref=e137]:
          - link "BridgeWide" [ref=e138] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e142]:
            - generic [aria-hidden] [ref=e143]:
              - text: Company website
              - textbox [ref=e144]
            - paragraph [ref=e148]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e150]
            - generic [ref=e152]:
              - generic [ref=e153]:
                - textbox "Email" [ref=e154]
                - generic: Email
              - button "Send" [ref=e155] [cursor=pointer]:
                - generic [ref=e156]:
                  - generic [ref=e157]: Send
                  - generic [aria-hidden] [ref=e158]: Send
        - navigation "Footer" [ref=e162]:
          - generic [ref=e163]:
            - heading "Company" [level=2] [ref=e164]
            - list [ref=e165]:
              - listitem [ref=e166]:
                - link "About" [ref=e167] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e168]:
                - link "Regions" [ref=e169] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e170]:
                - link "Stories" [ref=e171] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e172]:
                - link "Insights" [ref=e173] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e174]:
            - heading "Staffing" [level=2] [ref=e175]
            - list [ref=e176]:
              - listitem [ref=e177]:
                - link "Hire engineers" [ref=e178] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e179]:
                - link "How hiring works" [ref=e180] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e181]:
                - link "Salary guide" [ref=e182] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e183]:
                - link "Open roles" [ref=e184] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e185]:
            - heading "AI training" [level=2] [ref=e186]
            - list [ref=e187]:
              - listitem [ref=e188]:
                - link "Overview" [ref=e189] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e190]:
                - link "For candidates" [ref=e191] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e192]:
                - link "For partners" [ref=e193] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e194]:
                - link "Jobs" [ref=e195] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e196]:
            - heading "The desk" [level=2] [ref=e197]
            - list [ref=e198]:
              - listitem [ref=e199]:
                - link "michael.allen@bridgewide.org" [ref=e200] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e201]:
                - link "+1 (442) 567-1328" [ref=e202] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e205] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e208]:
                  - text: Open
                  - generic [ref=e209]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e210]:
                - link "Send a CV" [ref=e211] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e212]:
        - generic [ref=e213]: © 2026 BridgeWide
        - generic [ref=e214]: San Francisco · remote desks in five regions
        - generic [ref=e215]:
          - link "Privacy" [ref=e216] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e217] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e223] [cursor=pointer]
  - alert [ref=e227]
```

# Test source

```ts
  1  | import AxeBuilder from "@axe-core/playwright";
  2  | import { expect, test } from "@playwright/test";
  3  | 
  4  | // Pages a visitor reaches first. The browser job runs this on a desktop and a
  5  | // narrow viewport. A serious or critical violation fails the job and names the
  6  | // rule, the page, and each element, with the two colours and the ratio for a
  7  | // contrast failure.
  8  | const routes = [
  9  |   "/",
  10 |   "/contact",
  11 |   "/ai-training/contact",
  12 |   "/roles",
  13 |   "/employers",
  14 |   "/engineers",
  15 |   "/salary-guide",
  16 |   "/regions/usa",
  17 |   "/privacy",
  18 |   "/terms",
  19 |   "/this-page-does-not-exist",
  20 | ];
  21 | 
  22 | const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
  23 | 
  24 | test.beforeEach(async ({ page }) => {
  25 |   // Motion that fades content in would hide it from the scan, so ask for none.
  26 |   await page.emulateMedia({ reducedMotion: "reduce" });
  27 | });
  28 | 
  29 | for (const route of routes) {
  30 |   test(`axe finds no serious problem on ${route}`, async ({ page }) => {
  31 |     await page.goto(route);
> 32 |     await page.waitForLoadState("networkidle");
     |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  33 | 
  34 |     const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  35 | 
  36 |     const serious = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  37 |     const report = serious.map((violation) => {
  38 |       const nodes = violation.nodes.slice(0, 12).map((node) => {
  39 |         const data = (node.any[0]?.data ?? {}) as { fgColor?: string; bgColor?: string; contrastRatio?: number };
  40 |         const colours = data.fgColor ? ` [${data.fgColor} on ${data.bgColor}, ${data.contrastRatio}:1]` : "";
  41 |         return `  ${node.target.join(" ")}${colours}`;
  42 |       });
  43 |       return `${violation.id} (${violation.impact}), ${violation.nodes.length} element(s): ${violation.help}\n${nodes.join("\n")}`;
  44 |     });
  45 |     expect(report, `accessibility violations on ${route}:\n${report.join("\n")}`).toEqual([]);
  46 |   });
  47 | }
  48 | 
```
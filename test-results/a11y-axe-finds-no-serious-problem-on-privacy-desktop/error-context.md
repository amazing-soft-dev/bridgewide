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
      - generic [aria-hidden] [ref=e6]: ·
      - link "Salary guide →" [ref=e7] [cursor=pointer]:
        - /url: /salary-guide
    - generic [ref=e9]:
      - link "BridgeWide" [ref=e10] [cursor=pointer]:
        - /url: /
      - navigation "Primary" [ref=e14]:
        - link "Employers" [ref=e15] [cursor=pointer]:
          - /url: /employers
        - link "AI training" [ref=e16] [cursor=pointer]:
          - /url: /ai-training
        - link "Regions" [ref=e17] [cursor=pointer]:
          - /url: /regions
        - link "Roles" [ref=e18] [cursor=pointer]:
          - /url: /roles
        - link "Salary guide" [ref=e19] [cursor=pointer]:
          - /url: /salary-guide
        - link "Insights" [ref=e20] [cursor=pointer]:
          - /url: /insights
        - link "About" [ref=e21] [cursor=pointer]:
          - /url: /about
        - link "Contact" [ref=e22] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e23]:
        - button "Search roles" [ref=e24] [cursor=pointer]
        - link "Hire engineers" [ref=e28] [cursor=pointer]:
          - /url: /employers
          - generic [ref=e29]:
            - generic [ref=e30]: Hire engineers
            - generic [aria-hidden] [ref=e31]: Hire engineers
  - main [ref=e35]:
    - generic [ref=e38]:
      - paragraph [ref=e39]: Privacy
      - heading "How the desk handles your details." [level=1] [ref=e40]
      - paragraph [ref=e42]: Every form is an email, and nothing is stored in a database. Updated 12 November 2026. A lawyer reviews this notice before it is indexed.
    - region "Who we are" [ref=e43]:
      - generic [ref=e44]:
        - generic [ref=e45]:
          - paragraph [ref=e46]: Notice
          - heading "Who we are" [level=2] [ref=e47]
        - paragraph [ref=e50]: BridgeWide is a recruitment firm that places software engineers with companies. BridgeWide decides why and how the details you send through this site are used. Write to michael.allen@bridgewide.org for anything in this notice.
    - region "How a form works" [ref=e51]:
      - generic [ref=e52]:
        - generic [ref=e53]:
          - paragraph [ref=e54]: Notice
          - heading "How a form works" [level=2] [ref=e55]
        - generic [ref=e57]:
          - paragraph [ref=e58]: "Every form on this site becomes two emails: one to the BridgeWide desk with everything you typed, and one back to you to confirm we have it. We do not keep a database of submissions, and there is no account or login. A CV is attached to the email to the desk and is not stored anywhere else."
          - paragraph [ref=e59]: That means your message lives in the desk mailbox, and in the mailboxes and logs of the companies that deliver it.
    - region "What each form collects" [ref=e60]:
      - generic [ref=e61]:
        - generic [ref=e62]:
          - paragraph [ref=e63]: Notice
          - heading "What each form collects" [level=2] [ref=e64]
        - generic [ref=e66]:
          - paragraph [ref=e67]: "Hire brief: your name, work email, company, the role and regions, the engagement, the stack, the pay band, a hiring manager, and your message."
          - paragraph [ref=e68]: "CV upload and role application: your name, email, region, phone (optional), right to work, and your CV file."
          - paragraph [ref=e69]: "Talent pool: your name, email, region, country, discipline, years of experience, work mode, a short profile, your CV, and your consent to keep it for 12 months."
          - paragraph [ref=e70]: "Contact: your name, email, the topic, and your message."
          - paragraph [ref=e71]: "Salary guide and the footer email box: your email address."
          - paragraph [ref=e72]: "AI-training application and partner inquiry: the fields on the form, your right to work, your consent to an introduction, and a CV (candidates) or company details and volumes (partners)."
    - region "What we use it for" [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e75]:
          - paragraph [ref=e76]: Notice
          - heading "What we use it for" [level=2] [ref=e77]
        - generic [ref=e79]:
          - paragraph [ref=e80]: To answer you. To match you with a role, or a company with an engineer. To make an introduction, but only after you agree to it. For AI-training work, a profile is introduced to a platform only after you agree to that introduction, and the platform pays you.
          - paragraph [ref=e81]: We do not sell your details, and we do not use them to send marketing you did not ask for.
    - region "Who handles it" [ref=e82]:
      - generic [ref=e83]:
        - generic [ref=e84]:
          - paragraph [ref=e85]: Notice
          - heading "Who handles it" [level=2] [ref=e86]
        - generic [ref=e88]:
          - paragraph [ref=e89]: "Resend sends the emails: the message to the desk and the confirmation to you."
          - paragraph [ref=e90]: Vercel hosts the site and, in production, measures page views and speed.
          - paragraph [ref=e91]: Cloudflare Turnstile checks that a form is filled in by a person; it sees your IP address and browser signals.
          - paragraph [ref=e92]: "Sentry receives a report when the site hits an error: the page address and technical details, never what you typed, a request body, a cookie, or an email address."
          - paragraph [ref=e93]: Hostinger holds the desk mailbox, where every message and CV is kept.
          - paragraph [ref=e94]: A company or platform sees your details only after you agree to an introduction.
    - region "How long we keep it" [ref=e95]:
      - generic [ref=e96]:
        - generic [ref=e97]:
          - paragraph [ref=e98]: Notice
          - heading "How long we keep it" [level=2] [ref=e99]
        - generic [ref=e101]:
          - paragraph [ref=e102]: Because nothing is in a database, how long we keep a message is how long it stays in the desk mailbox.
          - paragraph [ref=e103]: A talent-pool profile and CV are kept for 12 months from the day you consent, then the desk deletes the email. You can ask michael.allen@bridgewide.org to delete it sooner, or to pause it so we do not introduce you. Other messages are kept while we are working with you or answering you, and then deleted when they are no longer needed.
          - paragraph [ref=e104]: Deleting an email from the desk mailbox does not delete the copies the delivery companies keep in their own logs for a short time.
    - region "Page measurement" [ref=e105]:
      - generic [ref=e106]:
        - generic [ref=e107]:
          - paragraph [ref=e108]: Notice
          - heading "Page measurement" [level=2] [ref=e109]
        - paragraph [ref=e112]: In production, Vercel Web Analytics and Speed Insights count page views and measure speed. They are skipped when your browser sends Do Not Track. Query strings are removed, and a page view whose address contains an email is dropped. We do not use advertising cookies.
    - region "Your rights" [ref=e113]:
      - generic [ref=e114]:
        - generic [ref=e115]:
          - paragraph [ref=e116]: Notice
          - heading "Your rights" [level=2] [ref=e117]
        - generic [ref=e119]:
          - paragraph [ref=e120]: Where you live decides which rights you have. In many places, including the United States (for example California), Canada (including Quebec), the United Kingdom, the European Union, Brazil, other parts of Latin America, and Singapore, you can ask for a copy of your details, ask us to correct or delete them, ask us to stop using them, and withdraw a consent you gave. Email michael.allen@bridgewide.org from the address you used. We may ask you to confirm who you are, and we answer within the time the law of your place allows.
          - paragraph [ref=e121]: If you are not happy with an answer, you can complain to the data protection authority where you live.
    - region "Moving data between countries" [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - paragraph [ref=e125]: Notice
          - heading "Moving data between countries" [level=2] [ref=e126]
        - paragraph [ref=e129]: The companies listed above run in several countries, including the United States. Your details can leave the country where you are. We rely on the safeguards those companies offer for that.
    - region "Children" [ref=e130]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - paragraph [ref=e133]: Notice
          - heading "Children" [level=2] [ref=e134]
        - paragraph [ref=e137]: This site is for people who are old enough to work. We do not knowingly collect details from children.
    - region "Changes" [ref=e138]:
      - generic [ref=e139]:
        - generic [ref=e140]:
          - paragraph [ref=e141]: Notice
          - heading "Changes" [level=2] [ref=e142]
        - paragraph [ref=e145]: This notice was last updated on 12 November 2026. We change it when what the site does changes.
  - contentinfo [ref=e148]:
    - generic [ref=e149]:
      - generic [ref=e150]:
        - generic [ref=e151]:
          - link "BridgeWide" [ref=e152] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e156]:
            - generic [aria-hidden] [ref=e157]:
              - text: Company website
              - textbox [ref=e158]
            - paragraph [ref=e162]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e164]
            - generic [ref=e166]:
              - generic [ref=e167]:
                - textbox "Email" [ref=e168]
                - generic: Email
              - button "Send" [ref=e169] [cursor=pointer]:
                - generic [ref=e170]:
                  - generic [ref=e171]: Send
                  - generic [aria-hidden] [ref=e172]: Send
        - navigation "Footer" [ref=e176]:
          - generic [ref=e177]:
            - heading "Company" [level=2] [ref=e178]
            - list [ref=e179]:
              - listitem [ref=e180]:
                - link "About" [ref=e181] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e182]:
                - link "Regions" [ref=e183] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e184]:
                - link "Stories" [ref=e185] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e186]:
                - link "Insights" [ref=e187] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e188]:
            - heading "Staffing" [level=2] [ref=e189]
            - list [ref=e190]:
              - listitem [ref=e191]:
                - link "Hire engineers" [ref=e192] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e193]:
                - link "How hiring works" [ref=e194] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e195]:
                - link "Salary guide" [ref=e196] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e197]:
                - link "Open roles" [ref=e198] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e199]:
            - heading "AI training" [level=2] [ref=e200]
            - list [ref=e201]:
              - listitem [ref=e202]:
                - link "Overview" [ref=e203] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e204]:
                - link "For candidates" [ref=e205] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e206]:
                - link "For partners" [ref=e207] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e208]:
                - link "Jobs" [ref=e209] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e210]:
            - heading "The desk" [level=2] [ref=e211]
            - list [ref=e212]:
              - listitem [ref=e213]:
                - link "michael.allen@bridgewide.org" [ref=e214] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e215]:
                - link "+1 (442) 567-1328" [ref=e216] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e219] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e222]:
                  - text: Open
                  - generic [ref=e223]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e224]:
                - link "Send a CV" [ref=e225] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e226]:
        - generic [ref=e227]: © 2026 BridgeWide
        - generic [ref=e228]: San Francisco · remote desks in five regions
        - generic [ref=e229]:
          - link "Privacy" [ref=e230] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e231] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e237] [cursor=pointer]
  - alert [ref=e241]
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
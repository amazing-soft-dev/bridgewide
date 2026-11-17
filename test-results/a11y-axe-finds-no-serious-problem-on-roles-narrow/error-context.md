# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> axe finds no serious problem on /roles
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
      - navigation "Breadcrumb" [ref=e25]:
        - list [ref=e26]:
          - listitem [ref=e27]:
            - link "Home" [ref=e28] [cursor=pointer]:
              - /url: /
          - listitem [ref=e29]:
            - generic [ref=e31]: Roles
      - heading "Seats that are live this season." [level=1] [ref=e32]:
        - generic [ref=e33]:
          - generic [ref=e34]: Seats
          - generic [ref=e36]: that
          - generic [ref=e38]: are
          - generic [ref=e40]: live
          - generic [ref=e42]: this
          - generic [ref=e44]: season.
      - paragraph [ref=e47]: Engineering seats across the USA, Canada, Latin America, and Europe. Salary on every role, and a named consultant behind each one.
      - list [ref=e48]:
        - listitem [ref=e49]: Salary on every role
        - listitem [ref=e51]: Named consultant
        - listitem [ref=e53]: Five regions
    - region "Open roles" [ref=e55]:
      - generic [ref=e56]:
        - generic [ref=e57]:
          - generic [ref=e58]:
            - generic [ref=e59]: Search
            - textbox "Search" [ref=e63]:
              - /placeholder: Job title, skill or keyword
          - generic [ref=e64]:
            - generic [ref=e65]: Engagement
            - combobox "Engagement" [ref=e66] [cursor=pointer]:
              - option "All types" [selected]
              - option "Permanent"
              - option "Contract"
          - generic [ref=e67]:
            - generic [ref=e68]: City
            - combobox "City" [ref=e69] [cursor=pointer]:
              - option "Anywhere" [selected]
              - option "Singapore"
              - option "Bangalore"
              - option "San Francisco"
              - option "Austin"
              - option "New York"
              - option "Toronto"
              - option "Vancouver"
              - option "Mexico City"
              - option "São Paulo"
              - option "Bogotá"
              - option "London"
              - option "Berlin"
              - option "Amsterdam"
              - option "Dublin"
          - paragraph [ref=e70]:
            - generic [ref=e71]: "14"
            - text: roles
        - generic [ref=e72]:
          - button [pressed] [ref=e73] [cursor=pointer]:
            - text: All
            - emphasis [ref=e74]: "14"
          - button [ref=e75] [cursor=pointer]:
            - text: USA
            - emphasis [ref=e76]: "3"
          - button [ref=e77] [cursor=pointer]:
            - text: Canada
            - emphasis [ref=e78]: "2"
          - button [ref=e79] [cursor=pointer]:
            - text: LATAM
            - emphasis [ref=e80]: "3"
          - button [ref=e81] [cursor=pointer]:
            - text: Europe
            - emphasis [ref=e82]: "4"
          - button [ref=e83] [cursor=pointer]:
            - text: Asia
            - emphasis [ref=e84]: "2"
        - list [ref=e85]:
          - listitem [ref=e86]:
            - link "ENG Senior Backend Engineer A senior backend seat on a Singapore fintech’s settlements team, remote across Asia with a daily overlap on Singapore hours. The engineer should have run Kotlin or Go services in production and be ready to own a queue-backed workflow end to end. $95k" [ref=e87] [cursor=pointer]:
              - /url: /roles/senior-backend-engineer-singapore
              - generic [ref=e88]: ENG
              - generic [ref=e89]:
                - generic [ref=e90]: Senior Backend Engineer
                - generic [ref=e91]: A senior backend seat on a Singapore fintech’s settlements team, remote across Asia with a daily overlap on Singapore hours. The engineer should have run Kotlin or Go services in production and be ready to own a queue-backed workflow end to end.
              - generic [ref=e92]: $95k
          - listitem [ref=e93]:
            - link "DAT Senior Data Engineer A senior data seat on a Bangalore analytics team that serves product managers in three time zones. The engineer should have run dbt and a cloud warehouse at scale and be able to explain a model to the people who read its numbers. $85k" [ref=e94] [cursor=pointer]:
              - /url: /roles/senior-data-engineer-bangalore
              - generic [ref=e95]: DAT
              - generic [ref=e96]:
                - generic [ref=e97]: Senior Data Engineer
                - generic [ref=e98]: A senior data seat on a Bangalore analytics team that serves product managers in three time zones. The engineer should have run dbt and a cloud warehouse at scale and be able to explain a model to the people who read its numbers.
              - generic [ref=e99]: $85k
          - listitem [ref=e100]:
            - link "ENG Staff Backend Engineer A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team. $210k" [ref=e101] [cursor=pointer]:
              - /url: /roles/staff-backend-engineer-san-francisco
              - generic [ref=e102]: ENG
              - generic [ref=e103]:
                - generic [ref=e104]: Staff Backend Engineer
                - generic [ref=e105]: A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team.
              - generic [ref=e106]: $210k
          - listitem [ref=e107]:
            - link "ENG Senior Frontend Engineer Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team. $165k" [ref=e108] [cursor=pointer]:
              - /url: /roles/senior-frontend-engineer-austin
              - generic [ref=e109]: ENG
              - generic [ref=e110]:
                - generic [ref=e111]: Senior Frontend Engineer
                - generic [ref=e112]: Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team.
              - generic [ref=e113]: $165k
          - listitem [ref=e114]:
            - link "MGT Engineering Manager A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start. $240k" [ref=e115] [cursor=pointer]:
              - /url: /roles/engineering-manager-new-york
              - generic [ref=e116]: MGT
              - generic [ref=e117]:
                - generic [ref=e118]: Engineering Manager
                - generic [ref=e119]: A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start.
              - generic [ref=e120]: $240k
          - listitem [ref=e121]:
            - link "DAT Senior Data Engineer Toronto hybrid seat on a warehouse that feeds finance and product reporting. The brief calls for a senior data engineer who has run dbt and a cloud warehouse in production. $150k" [ref=e122] [cursor=pointer]:
              - /url: /roles/senior-data-engineer-toronto
              - generic [ref=e123]: DAT
              - generic [ref=e124]:
                - generic [ref=e125]: Senior Data Engineer
                - generic [ref=e126]: Toronto hybrid seat on a warehouse that feeds finance and product reporting. The brief calls for a senior data engineer who has run dbt and a cloud warehouse in production.
              - generic [ref=e127]: $150k
          - listitem [ref=e128]:
            - link "CLD Cloud Engineer A contract cloud seat, remote in Canada, to finish a platform cutover before year end. The engineer should be comfortable owning Terraform, a Kubernetes cluster, and the on-call that comes with both. $850/day" [ref=e129] [cursor=pointer]:
              - /url: /roles/cloud-engineer-vancouver
              - generic [ref=e130]: CLD
              - generic [ref=e131]:
                - generic [ref=e132]: Cloud Engineer
                - generic [ref=e133]: A contract cloud seat, remote in Canada, to finish a platform cutover before year end. The engineer should be comfortable owning Terraform, a Kubernetes cluster, and the on-call that comes with both.
              - generic [ref=e134]: $850/day
          - listitem [ref=e135]:
            - link "ENG Senior Backend Engineer Contract backend seat in Mexico City, overlapped with US Pacific hours, for an API that is already in market. We want a senior engineer who can pick up a Go service and ship without a long ramp. $650/day" [ref=e136] [cursor=pointer]:
              - /url: /roles/senior-backend-engineer-mexico-city
              - generic [ref=e137]: ENG
              - generic [ref=e138]:
                - generic [ref=e139]: Senior Backend Engineer
                - generic [ref=e140]: Contract backend seat in Mexico City, overlapped with US Pacific hours, for an API that is already in market. We want a senior engineer who can pick up a Go service and ship without a long ramp.
              - generic [ref=e141]: $650/day
          - listitem [ref=e142]:
            - link "MOB Mobile Engineer Permanent mobile seat in São Paulo for a health product with iOS and Android already in the stores. The hire joins a small app team and is expected to own releases as well as tickets. $95k" [ref=e143] [cursor=pointer]:
              - /url: /roles/mobile-engineer-sao-paulo
              - generic [ref=e144]: MOB
              - generic [ref=e145]:
                - generic [ref=e146]: Mobile Engineer
                - generic [ref=e147]: Permanent mobile seat in São Paulo for a health product with iOS and Android already in the stores. The hire joins a small app team and is expected to own releases as well as tickets.
              - generic [ref=e148]: $95k
          - listitem [ref=e149]:
            - link "ENG Frontend Engineer Contract frontend seat in Bogotá for a dashboard that account managers live in. The engineer should know React well enough to improve a mature codebase in place. $480/day" [ref=e150] [cursor=pointer]:
              - /url: /roles/frontend-engineer-bogota
              - generic [ref=e151]: ENG
              - generic [ref=e152]:
                - generic [ref=e153]: Frontend Engineer
                - generic [ref=e154]: Contract frontend seat in Bogotá for a dashboard that account managers live in. The engineer should know React well enough to improve a mature codebase in place.
              - generic [ref=e155]: $480/day
          - listitem [ref=e156]:
            - 'link "CLD Staff Platform Engineer Hybrid staff platform seat in London for a company whose product engineers are blocked on internal tooling. The hire sets the paved path: CI, environments, and the libraries other teams are expected to use. $160k" [ref=e157] [cursor=pointer]':
              - /url: /roles/staff-platform-engineer-london
              - generic [ref=e158]: CLD
              - generic [ref=e159]:
                - generic [ref=e160]: Staff Platform Engineer
                - generic [ref=e161]: "Hybrid staff platform seat in London for a company whose product engineers are blocked on internal tooling. The hire sets the paved path: CI, environments, and the libraries other teams are expected to use."
              - generic [ref=e162]: $160k
          - listitem [ref=e163]:
            - link "DAT Data Engineer Hybrid data seat in Berlin on event pipelines that feed product analytics and a customer-facing report. We are looking for an engineer who has operated streaming jobs in production. $120k" [ref=e164] [cursor=pointer]:
              - /url: /roles/data-engineer-berlin
              - generic [ref=e165]: DAT
              - generic [ref=e166]:
                - generic [ref=e167]: Data Engineer
                - generic [ref=e168]: Hybrid data seat in Berlin on event pipelines that feed product analytics and a customer-facing report. We are looking for an engineer who has operated streaming jobs in production.
              - generic [ref=e169]: $120k
          - listitem [ref=e170]:
            - link "MOB iOS Engineer Remote contract iOS seat in Amsterdam to ship a regulated feature before a fixed release window. The engineer should have taken an app through App Store review and be used to working with a backend team in another city. $700/day" [ref=e171] [cursor=pointer]:
              - /url: /roles/ios-engineer-amsterdam
              - generic [ref=e172]: MOB
              - generic [ref=e173]:
                - generic [ref=e174]: iOS Engineer
                - generic [ref=e175]: Remote contract iOS seat in Amsterdam to ship a regulated feature before a fixed release window. The engineer should have taken an app through App Store review and be used to working with a backend team in another city.
              - generic [ref=e176]: $700/day
          - listitem [ref=e177]:
            - link "EXE Director of Engineering A director seat in Dublin for a product org of about forty engineers across three groups. The search starts confidential, and the hire is expected to reset planning with the managers already in place. $200k" [ref=e178] [cursor=pointer]:
              - /url: /roles/director-of-engineering-dublin
              - generic [ref=e179]: EXE
              - generic [ref=e180]:
                - generic [ref=e181]: Director of Engineering
                - generic [ref=e182]: A director seat in Dublin for a product org of about forty engineers across three groups. The search starts confidential, and the hire is expected to reset planning with the managers already in place.
              - generic [ref=e183]: $200k
        - complementary [ref=e184]:
          - generic [ref=e185]:
            - text: Not seeing it yet?
            - paragraph [ref=e186]: Most seats are filled before they are listed. Send a CV and a consultant calls when the right one opens.
          - link "Send a CV" [ref=e187] [cursor=pointer]:
            - /url: /engineers
            - generic [ref=e188]:
              - generic [ref=e189]: Send a CV
              - generic [aria-hidden] [ref=e190]: Send a CV
    - region "Tell us the seat." [ref=e194]:
      - generic [ref=e198]:
        - generic [ref=e199]:
          - heading "Tell us the seat." [level=2] [ref=e200]:
            - generic [ref=e201]:
              - generic [ref=e202]: Tell
              - generic [ref=e204]: us
              - generic [ref=e206]: the
              - generic [ref=e208]: seat.
          - paragraph [ref=e211]: A brief or a CV. Either way a consultant, not a form, gets back to you.
          - generic [ref=e212]:
            - link "Hire engineers" [ref=e213] [cursor=pointer]:
              - /url: /employers
              - generic [ref=e214]:
                - generic [ref=e215]: Hire engineers
                - generic [aria-hidden] [ref=e216]: Hire engineers
            - link "Send a CV" [ref=e220] [cursor=pointer]:
              - /url: /engineers
              - generic [ref=e221]:
                - generic [ref=e222]: Send a CV
                - generic [aria-hidden] [ref=e223]: Send a CV
        - generic [ref=e227]:
          - paragraph [ref=e228]: Open
          - paragraph [ref=e229]:
            - generic [ref=e230]: "14"
            - text: roles open right now
  - contentinfo [ref=e233]:
    - generic [ref=e234]:
      - generic [ref=e235]:
        - generic [ref=e236]:
          - link "BridgeWide" [ref=e237] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e241]:
            - generic [aria-hidden] [ref=e242]:
              - text: Company website
              - textbox [ref=e243]
            - paragraph [ref=e247]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e249]
            - generic [ref=e251]:
              - generic [ref=e252]:
                - textbox "Email" [ref=e253]
                - generic: Email
              - button "Send" [ref=e254] [cursor=pointer]:
                - generic [ref=e255]:
                  - generic [ref=e256]: Send
                  - generic [aria-hidden] [ref=e257]: Send
        - navigation "Footer" [ref=e261]:
          - generic [ref=e262]:
            - heading "Company" [level=2] [ref=e263]
            - list [ref=e264]:
              - listitem [ref=e265]:
                - link "About" [ref=e266] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e267]:
                - link "Regions" [ref=e268] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e269]:
                - link "Stories" [ref=e270] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e271]:
                - link "Insights" [ref=e272] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e273]:
            - heading "Staffing" [level=2] [ref=e274]
            - list [ref=e275]:
              - listitem [ref=e276]:
                - link "Hire engineers" [ref=e277] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e278]:
                - link "How hiring works" [ref=e279] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e280]:
                - link "Salary guide" [ref=e281] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e282]:
                - link "Open roles" [ref=e283] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e284]:
            - heading "AI training" [level=2] [ref=e285]
            - list [ref=e286]:
              - listitem [ref=e287]:
                - link "Overview" [ref=e288] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e289]:
                - link "For candidates" [ref=e290] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e291]:
                - link "For partners" [ref=e292] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e293]:
                - link "Jobs" [ref=e294] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e295]:
            - heading "The desk" [level=2] [ref=e296]
            - list [ref=e297]:
              - listitem [ref=e298]:
                - link "michael.allen@bridgewide.org" [ref=e299] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e300]:
                - link "+1 (442) 567-1328" [ref=e301] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e304] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e307]:
                  - text: Open
                  - generic [ref=e308]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e309]:
                - link "Send a CV" [ref=e310] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e311]:
        - generic [ref=e312]: © 2026 BridgeWide
        - generic [ref=e313]: San Francisco · remote desks in five regions
        - generic [ref=e314]:
          - link "Privacy" [ref=e315] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e316] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e322] [cursor=pointer]
  - alert [ref=e326]
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
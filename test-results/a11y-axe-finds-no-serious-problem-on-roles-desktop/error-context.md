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
      - navigation "Breadcrumb" [ref=e39]:
        - list [ref=e40]:
          - listitem [ref=e41]:
            - link "Home" [ref=e42] [cursor=pointer]:
              - /url: /
          - listitem [ref=e43]:
            - generic [ref=e45]: Roles
      - heading "Seats that are live this season." [level=1] [ref=e46]:
        - generic [ref=e47]:
          - generic [ref=e48]: Seats
          - generic [ref=e50]: that
          - generic [ref=e52]: are
          - generic [ref=e54]: live
          - generic [ref=e56]: this
          - generic [ref=e58]: season.
      - paragraph [ref=e61]: Engineering seats across the USA, Canada, Latin America, and Europe. Salary on every role, and a named consultant behind each one.
      - list [ref=e62]:
        - listitem [ref=e63]: Salary on every role
        - listitem [ref=e65]: Named consultant
        - listitem [ref=e67]: Five regions
    - region "Open roles" [ref=e69]:
      - generic [ref=e70]:
        - generic [ref=e71]:
          - generic [ref=e72]:
            - generic [ref=e73]: Search
            - textbox "Search" [ref=e77]:
              - /placeholder: Job title, skill or keyword
          - generic [ref=e78]:
            - generic [ref=e79]: Engagement
            - combobox "Engagement" [ref=e80] [cursor=pointer]:
              - option "All types" [selected]
              - option "Permanent"
              - option "Contract"
          - generic [ref=e81]:
            - generic [ref=e82]: City
            - combobox "City" [ref=e83] [cursor=pointer]:
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
          - paragraph [ref=e84]:
            - generic [ref=e85]: "14"
            - text: roles
        - generic [ref=e86]:
          - button [pressed] [ref=e87] [cursor=pointer]:
            - text: All
            - emphasis [ref=e88]: "14"
          - button [ref=e89] [cursor=pointer]:
            - text: USA
            - emphasis [ref=e90]: "3"
          - button [ref=e91] [cursor=pointer]:
            - text: Canada
            - emphasis [ref=e92]: "2"
          - button [ref=e93] [cursor=pointer]:
            - text: LATAM
            - emphasis [ref=e94]: "3"
          - button [ref=e95] [cursor=pointer]:
            - text: Europe
            - emphasis [ref=e96]: "4"
          - button [ref=e97] [cursor=pointer]:
            - text: Asia
            - emphasis [ref=e98]: "2"
        - list [ref=e99]:
          - listitem [ref=e100]:
            - link "ENG Senior Backend Engineer A senior backend seat on a Singapore fintech’s settlements team, remote across Asia with a daily overlap on Singapore hours. The engineer should have run Kotlin or Go services in production and be ready to own a queue-backed workflow end to end. Singapore · Remote Permanent $95k 29 days" [ref=e101] [cursor=pointer]:
              - /url: /roles/senior-backend-engineer-singapore
              - generic [ref=e102]: ENG
              - generic [ref=e103]:
                - generic [ref=e104]: Senior Backend Engineer
                - generic [ref=e105]: A senior backend seat on a Singapore fintech’s settlements team, remote across Asia with a daily overlap on Singapore hours. The engineer should have run Kotlin or Go services in production and be ready to own a queue-backed workflow end to end.
              - generic [ref=e106]: Singapore · Remote
              - generic [ref=e107]: Permanent
              - generic [ref=e108]: $95k
              - generic [ref=e109]: 29 days
              - generic [aria-hidden] [ref=e110]: →
          - listitem [ref=e111]:
            - link "DAT Senior Data Engineer A senior data seat on a Bangalore analytics team that serves product managers in three time zones. The engineer should have run dbt and a cloud warehouse at scale and be able to explain a model to the people who read its numbers. Bangalore · Hybrid Permanent $85k 29 days" [ref=e112] [cursor=pointer]:
              - /url: /roles/senior-data-engineer-bangalore
              - generic [ref=e113]: DAT
              - generic [ref=e114]:
                - generic [ref=e115]: Senior Data Engineer
                - generic [ref=e116]: A senior data seat on a Bangalore analytics team that serves product managers in three time zones. The engineer should have run dbt and a cloud warehouse at scale and be able to explain a model to the people who read its numbers.
              - generic [ref=e117]: Bangalore · Hybrid
              - generic [ref=e118]: Permanent
              - generic [ref=e119]: $85k
              - generic [ref=e120]: 29 days
              - generic [aria-hidden] [ref=e121]: →
          - listitem [ref=e122]:
            - link "ENG Staff Backend Engineer A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team. San Francisco · Hybrid Permanent $210k Hot 29 days" [ref=e123] [cursor=pointer]:
              - /url: /roles/staff-backend-engineer-san-francisco
              - generic [ref=e124]: ENG
              - generic [ref=e125]:
                - generic [ref=e126]: Staff Backend Engineer
                - generic [ref=e127]: A staff backend seat for a San Francisco payments team that needs one owner for a ledger service. The engineer should have shipped Go or Java in production and be ready to review design with the people already on the team.
              - generic [ref=e128]: San Francisco · Hybrid
              - generic [ref=e129]: Permanent
              - generic [ref=e130]: $210k
              - generic [ref=e131]: Hot
              - generic [ref=e132]: 29 days
              - generic [aria-hidden] [ref=e133]: →
          - listitem [ref=e134]:
            - link "ENG Senior Frontend Engineer Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team. Austin · Hybrid Permanent $165k 29 days" [ref=e135] [cursor=pointer]:
              - /url: /roles/senior-frontend-engineer-austin
              - generic [ref=e136]: ENG
              - generic [ref=e137]:
                - generic [ref=e138]: Senior Frontend Engineer
                - generic [ref=e139]: Hybrid frontend seat in Austin on a product surface that operations staff use all day. We are shortlisting senior engineers who have owned a design system and can work beside an existing React team.
              - generic [ref=e140]: Austin · Hybrid
              - generic [ref=e141]: Permanent
              - generic [ref=e142]: $165k
              - generic [ref=e143]: 29 days
              - generic [aria-hidden] [ref=e144]: →
          - listitem [ref=e145]:
            - link "MGT Engineering Manager A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start. New York · Hybrid Permanent $240k 29 days" [ref=e146] [cursor=pointer]:
              - /url: /roles/engineering-manager-new-york
              - generic [ref=e147]: MGT
              - generic [ref=e148]:
                - generic [ref=e149]: Engineering Manager
                - generic [ref=e150]: A manager seat in New York for a group of eight product engineers and a roadmap the company has already shared internally. The search is for a manager who has run a team of engineers and who will hire into that team after they start.
              - generic [ref=e151]: New York · Hybrid
              - generic [ref=e152]: Permanent
              - generic [ref=e153]: $240k
              - generic [ref=e154]: 29 days
              - generic [aria-hidden] [ref=e155]: →
          - listitem [ref=e156]:
            - link "DAT Senior Data Engineer Toronto hybrid seat on a warehouse that feeds finance and product reporting. The brief calls for a senior data engineer who has run dbt and a cloud warehouse in production. Toronto · Hybrid Permanent $150k Hot 29 days" [ref=e157] [cursor=pointer]:
              - /url: /roles/senior-data-engineer-toronto
              - generic [ref=e158]: DAT
              - generic [ref=e159]:
                - generic [ref=e160]: Senior Data Engineer
                - generic [ref=e161]: Toronto hybrid seat on a warehouse that feeds finance and product reporting. The brief calls for a senior data engineer who has run dbt and a cloud warehouse in production.
              - generic [ref=e162]: Toronto · Hybrid
              - generic [ref=e163]: Permanent
              - generic [ref=e164]: $150k
              - generic [ref=e165]: Hot
              - generic [ref=e166]: 29 days
              - generic [aria-hidden] [ref=e167]: →
          - listitem [ref=e168]:
            - link "CLD Cloud Engineer A contract cloud seat, remote in Canada, to finish a platform cutover before year end. The engineer should be comfortable owning Terraform, a Kubernetes cluster, and the on-call that comes with both. Vancouver · Remote Contract $850/day 29 days" [ref=e169] [cursor=pointer]:
              - /url: /roles/cloud-engineer-vancouver
              - generic [ref=e170]: CLD
              - generic [ref=e171]:
                - generic [ref=e172]: Cloud Engineer
                - generic [ref=e173]: A contract cloud seat, remote in Canada, to finish a platform cutover before year end. The engineer should be comfortable owning Terraform, a Kubernetes cluster, and the on-call that comes with both.
              - generic [ref=e174]: Vancouver · Remote
              - generic [ref=e175]: Contract
              - generic [ref=e176]: $850/day
              - generic [ref=e177]: 29 days
              - generic [aria-hidden] [ref=e178]: →
          - listitem [ref=e179]:
            - link "ENG Senior Backend Engineer Contract backend seat in Mexico City, overlapped with US Pacific hours, for an API that is already in market. We want a senior engineer who can pick up a Go service and ship without a long ramp. Mexico City · Remote Contract $650/day Hot 29 days" [ref=e180] [cursor=pointer]:
              - /url: /roles/senior-backend-engineer-mexico-city
              - generic [ref=e181]: ENG
              - generic [ref=e182]:
                - generic [ref=e183]: Senior Backend Engineer
                - generic [ref=e184]: Contract backend seat in Mexico City, overlapped with US Pacific hours, for an API that is already in market. We want a senior engineer who can pick up a Go service and ship without a long ramp.
              - generic [ref=e185]: Mexico City · Remote
              - generic [ref=e186]: Contract
              - generic [ref=e187]: $650/day
              - generic [ref=e188]: Hot
              - generic [ref=e189]: 29 days
              - generic [aria-hidden] [ref=e190]: →
          - listitem [ref=e191]:
            - link "MOB Mobile Engineer Permanent mobile seat in São Paulo for a health product with iOS and Android already in the stores. The hire joins a small app team and is expected to own releases as well as tickets. São Paulo · Remote Permanent $95k 29 days" [ref=e192] [cursor=pointer]:
              - /url: /roles/mobile-engineer-sao-paulo
              - generic [ref=e193]: MOB
              - generic [ref=e194]:
                - generic [ref=e195]: Mobile Engineer
                - generic [ref=e196]: Permanent mobile seat in São Paulo for a health product with iOS and Android already in the stores. The hire joins a small app team and is expected to own releases as well as tickets.
              - generic [ref=e197]: São Paulo · Remote
              - generic [ref=e198]: Permanent
              - generic [ref=e199]: $95k
              - generic [ref=e200]: 29 days
              - generic [aria-hidden] [ref=e201]: →
          - listitem [ref=e202]:
            - link "ENG Frontend Engineer Contract frontend seat in Bogotá for a dashboard that account managers live in. The engineer should know React well enough to improve a mature codebase in place. Bogotá · Remote Contract $480/day 29 days" [ref=e203] [cursor=pointer]:
              - /url: /roles/frontend-engineer-bogota
              - generic [ref=e204]: ENG
              - generic [ref=e205]:
                - generic [ref=e206]: Frontend Engineer
                - generic [ref=e207]: Contract frontend seat in Bogotá for a dashboard that account managers live in. The engineer should know React well enough to improve a mature codebase in place.
              - generic [ref=e208]: Bogotá · Remote
              - generic [ref=e209]: Contract
              - generic [ref=e210]: $480/day
              - generic [ref=e211]: 29 days
              - generic [aria-hidden] [ref=e212]: →
          - listitem [ref=e213]:
            - 'link "CLD Staff Platform Engineer Hybrid staff platform seat in London for a company whose product engineers are blocked on internal tooling. The hire sets the paved path: CI, environments, and the libraries other teams are expected to use. London · Hybrid Permanent $160k Hot 29 days" [ref=e214] [cursor=pointer]':
              - /url: /roles/staff-platform-engineer-london
              - generic [ref=e215]: CLD
              - generic [ref=e216]:
                - generic [ref=e217]: Staff Platform Engineer
                - generic [ref=e218]: "Hybrid staff platform seat in London for a company whose product engineers are blocked on internal tooling. The hire sets the paved path: CI, environments, and the libraries other teams are expected to use."
              - generic [ref=e219]: London · Hybrid
              - generic [ref=e220]: Permanent
              - generic [ref=e221]: $160k
              - generic [ref=e222]: Hot
              - generic [ref=e223]: 29 days
              - generic [aria-hidden] [ref=e224]: →
          - listitem [ref=e225]:
            - link "DAT Data Engineer Hybrid data seat in Berlin on event pipelines that feed product analytics and a customer-facing report. We are looking for an engineer who has operated streaming jobs in production. Berlin · Hybrid Permanent $120k Confidential 29 days" [ref=e226] [cursor=pointer]:
              - /url: /roles/data-engineer-berlin
              - generic [ref=e227]: DAT
              - generic [ref=e228]:
                - generic [ref=e229]: Data Engineer
                - generic [ref=e230]: Hybrid data seat in Berlin on event pipelines that feed product analytics and a customer-facing report. We are looking for an engineer who has operated streaming jobs in production.
              - generic [ref=e231]: Berlin · Hybrid
              - generic [ref=e232]: Permanent
              - generic [ref=e233]: $120k
              - generic [ref=e234]: Confidential
              - generic [ref=e235]: 29 days
              - generic [aria-hidden] [ref=e236]: →
          - listitem [ref=e237]:
            - link "MOB iOS Engineer Remote contract iOS seat in Amsterdam to ship a regulated feature before a fixed release window. The engineer should have taken an app through App Store review and be used to working with a backend team in another city. Amsterdam · Remote Contract $700/day 29 days" [ref=e238] [cursor=pointer]:
              - /url: /roles/ios-engineer-amsterdam
              - generic [ref=e239]: MOB
              - generic [ref=e240]:
                - generic [ref=e241]: iOS Engineer
                - generic [ref=e242]: Remote contract iOS seat in Amsterdam to ship a regulated feature before a fixed release window. The engineer should have taken an app through App Store review and be used to working with a backend team in another city.
              - generic [ref=e243]: Amsterdam · Remote
              - generic [ref=e244]: Contract
              - generic [ref=e245]: $700/day
              - generic [ref=e246]: 29 days
              - generic [aria-hidden] [ref=e247]: →
          - listitem [ref=e248]:
            - link "EXE Director of Engineering A director seat in Dublin for a product org of about forty engineers across three groups. The search starts confidential, and the hire is expected to reset planning with the managers already in place. Dublin · Hybrid Permanent $200k Confidential 29 days" [ref=e249] [cursor=pointer]:
              - /url: /roles/director-of-engineering-dublin
              - generic [ref=e250]: EXE
              - generic [ref=e251]:
                - generic [ref=e252]: Director of Engineering
                - generic [ref=e253]: A director seat in Dublin for a product org of about forty engineers across three groups. The search starts confidential, and the hire is expected to reset planning with the managers already in place.
              - generic [ref=e254]: Dublin · Hybrid
              - generic [ref=e255]: Permanent
              - generic [ref=e256]: $200k
              - generic [ref=e257]: Confidential
              - generic [ref=e258]: 29 days
              - generic [aria-hidden] [ref=e259]: →
        - complementary [ref=e260]:
          - generic [ref=e261]:
            - text: Not seeing it yet?
            - paragraph [ref=e262]: Most seats are filled before they are listed. Send a CV and a consultant calls when the right one opens.
          - link "Send a CV" [ref=e263] [cursor=pointer]:
            - /url: /engineers
            - generic [ref=e264]:
              - generic [ref=e265]: Send a CV
              - generic [aria-hidden] [ref=e266]: Send a CV
    - region "Tell us the seat." [ref=e270]:
      - generic [ref=e274]:
        - generic [ref=e275]:
          - heading "Tell us the seat." [level=2] [ref=e276]:
            - generic [ref=e277]:
              - generic [ref=e278]: Tell
              - generic [ref=e280]: us
              - generic [ref=e282]: the
              - generic [ref=e284]: seat.
          - paragraph [ref=e287]: A brief or a CV. Either way a consultant, not a form, gets back to you.
          - generic [ref=e288]:
            - link "Hire engineers" [ref=e289] [cursor=pointer]:
              - /url: /employers
              - generic [ref=e290]:
                - generic [ref=e291]: Hire engineers
                - generic [aria-hidden] [ref=e292]: Hire engineers
            - link "Send a CV" [ref=e296] [cursor=pointer]:
              - /url: /engineers
              - generic [ref=e297]:
                - generic [ref=e298]: Send a CV
                - generic [aria-hidden] [ref=e299]: Send a CV
        - generic [ref=e303]:
          - paragraph [ref=e304]: Open
          - paragraph [ref=e305]:
            - generic [ref=e306]: "14"
            - text: roles open right now
  - contentinfo [ref=e309]:
    - generic [ref=e310]:
      - generic [ref=e311]:
        - generic [ref=e312]:
          - link "BridgeWide" [ref=e313] [cursor=pointer]:
            - /url: /
          - form "Salary guide" [ref=e317]:
            - generic [aria-hidden] [ref=e318]:
              - text: Company website
              - textbox [ref=e319]
            - paragraph [ref=e323]: Salary guide
            - heading "Autumn 2026 edition" [level=2] [ref=e325]
            - generic [ref=e327]:
              - generic [ref=e328]:
                - textbox "Email" [ref=e329]
                - generic: Email
              - button "Send" [ref=e330] [cursor=pointer]:
                - generic [ref=e331]:
                  - generic [ref=e332]: Send
                  - generic [aria-hidden] [ref=e333]: Send
        - navigation "Footer" [ref=e337]:
          - generic [ref=e338]:
            - heading "Company" [level=2] [ref=e339]
            - list [ref=e340]:
              - listitem [ref=e341]:
                - link "About" [ref=e342] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e343]:
                - link "Regions" [ref=e344] [cursor=pointer]:
                  - /url: /regions
              - listitem [ref=e345]:
                - link "Stories" [ref=e346] [cursor=pointer]:
                  - /url: /stories
              - listitem [ref=e347]:
                - link "Insights" [ref=e348] [cursor=pointer]:
                  - /url: /insights
          - generic [ref=e349]:
            - heading "Staffing" [level=2] [ref=e350]
            - list [ref=e351]:
              - listitem [ref=e352]:
                - link "Hire engineers" [ref=e353] [cursor=pointer]:
                  - /url: /employers
              - listitem [ref=e354]:
                - link "How hiring works" [ref=e355] [cursor=pointer]:
                  - /url: /employers#how
              - listitem [ref=e356]:
                - link "Salary guide" [ref=e357] [cursor=pointer]:
                  - /url: /salary-guide
              - listitem [ref=e358]:
                - link "Open roles" [ref=e359] [cursor=pointer]:
                  - /url: /roles
          - generic [ref=e360]:
            - heading "AI training" [level=2] [ref=e361]
            - list [ref=e362]:
              - listitem [ref=e363]:
                - link "Overview" [ref=e364] [cursor=pointer]:
                  - /url: /ai-training
              - listitem [ref=e365]:
                - link "For candidates" [ref=e366] [cursor=pointer]:
                  - /url: /ai-training/for-candidates
              - listitem [ref=e367]:
                - link "For partners" [ref=e368] [cursor=pointer]:
                  - /url: /ai-training/for-partners
              - listitem [ref=e369]:
                - link "Jobs" [ref=e370] [cursor=pointer]:
                  - /url: /ai-training/jobs
          - generic [ref=e371]:
            - heading "The desk" [level=2] [ref=e372]
            - list [ref=e373]:
              - listitem [ref=e374]:
                - link "michael.allen@bridgewide.org" [ref=e375] [cursor=pointer]:
                  - /url: mailto:michael.allen@bridgewide.org
              - listitem [ref=e376]:
                - link "+1 (442) 567-1328" [ref=e377] [cursor=pointer]:
                  - /url: tel:+14425671328
                - link "WhatsApp +1 (442) 567-1328" [ref=e380] [cursor=pointer]:
                  - /url: https://wa.me/14425671328
                - generic "Mon–Fri · 08:00–18:00 PT" [ref=e383]:
                  - text: Open
                  - generic [ref=e384]: . Mon–Fri · 08:00–18:00 PT
              - listitem [ref=e385]:
                - link "Send a CV" [ref=e386] [cursor=pointer]:
                  - /url: /engineers
      - generic [ref=e387]:
        - generic [ref=e388]: © 2026 BridgeWide
        - generic [ref=e389]: San Francisco · remote desks in five regions
        - generic [ref=e390]:
          - link "Privacy" [ref=e391] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e392] [cursor=pointer]:
            - /url: /terms
  - button "Open Next.js Dev Tools" [ref=e398] [cursor=pointer]
  - alert [ref=e402]
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
# Portfolio and publication progress

This ledger tracks implementation checkpoints for the personal portfolio and writing site. Update it immediately after verifying each checkpoint. Technical checks and visual review are recorded separately.

## Scope

Build the author-led portfolio and publication described in [blueprint section 28](technical-blog-blueprint.md#28-portfolio-expansion-and-visual-review--10-october-2026). Use real, attributable experience, talks, projects, and writing. Preserve existing article behavior and legacy-source boundaries. Production deployment and domain cutover are separate decisions.

## Checkpoints

| Checkpoint | Status | Evidence | Open items |
|---|---|---|---|
| 0. Plan and source inventory | Complete | [Implementation plan](docs/superpowers/plans/2026-10-10-portfolio-publication.md) added; blueprint section 28, installed Next.js guidance, author site, GitHub, The Security Diff, shadcn MCP, and ReUI registry reviewed; work moved to `feat/portfolio-publication`; scope set to portfolio and writing first | Source gaps were resolved by the supplied September 2026 résumé in checkpoint 3 |
| 1. Identity, navigation, and design system | Complete | Full name, Writing/Portfolio/Résumé and profile links, shadcn Sheet mobile menu, self-hosted Newsreader + DM Sans, warm light/dark tokens; focused Playwright navigation test passed (1/1); lint and typecheck passed | Mobile menu interaction and visual polish included in checkpoint 5 review |
| 2. Home and writing archive | Complete | New author-led homepage, selected DevTools feature with an explanatory postMessage artifact, distinct editorial Writing index, and unified article typography; publication browser checks passed (2/2), lint passed | Phone/desktop light/dark screenshot review will be reconciled in checkpoint 5 |
| 3. Portfolio experience, projects, and talks | Complete | Five roles, The Security Diff, and five talks sourced from the supplied résumé and author talk page; ReUI Radix timeline adopted from its public registry; portfolio browser checks passed (2/2), content tests passed (9/9), lint and typecheck passed | Additional maintained projects need the author's confirmation; visual review in checkpoint 5 |
| 4. Discovery, metadata, résumé, and legacy routes | Complete | Published-only body search, RSS, sitemap, robots, canonical and social metadata, HTML résumé, byte-identical downloadable PDF, and local legacy redirect; focused browser checks passed (2/2); build listed all intended routes; PDF text and rendered first page checked | The original `noshellaccess.com` host remains independent, so its redirect needs deployment-side cutover/configuration |
| 5. Accessibility, responsive visual review, and final verification | Complete | Phone (375 px), tablet (768 px reader), desktop (1280 px), and wide (1600 px reader) screenshots reviewed in light and dark; first viewport feature title, mobile navigation/theme, keyboard article controls, search, PDF, and no horizontal overflow verified; lint, typecheck, 9 content tests, 15 browser tests, and production build passed; live HTTP returned 200 for 12 key routes on `http://127.0.0.1:3101` | Legacy content was addressed in checkpoints 7–10; original-host redirects and production cutover remain |
| 6. Heading scale and homepage identity refinement | Complete | Reduced display headings across home, archive, portfolio, résumé, and reader; reduced home lede and feature-card height; replaced generic home sidebar copy with the résumé-backed Harness role; regenerated and inspected phone/desktop screenshots; 3 focused browser checks passed, including first-viewport and overflow assertions; lint passed; restarted local preview and verified refreshed HTML | More writing was added in checkpoint 8; additional maintained projects still need confirmation |
| 7. Legacy content expansion inventory | Complete | [Content expansion plan](docs/superpowers/plans/2026-10-10-content-expansion.md) and [route map](docs/migration/legacy-route-map.json) enumerate six additional articles, 14 Same Origin Policy chapters, seven Kubernetes 101 chapters, two excluded legacy utility pages, and 96 referenced image occurrences; migration script verifies each local image exists and copies it | Source material remains historical and needs reader labeling; host-level redirects await deployment control |
| 8. Article archive migration | Complete | Six MDX articles and referenced figures generated from the read-only Docusaurus checkout; source dates and URL mappings recorded; production build prerendered all seven public article routes; archive previews now reflect each article and homepage keeps the intentional DevTools feature; historical reader notice added | Browser and redirect checks join final checkpoint |
| 9. Two web book readers | Complete | Twenty-one chapter MDX files and figures generated; `/books` catalog, two book landing pages, ordered chapter rails, mobile chapter menus, previous/next navigation, chapter TOCs, historical notices, search results, and sitemap entries added; production build prerendered all 21 chapters and two book indexes | Responsive browser review and local redirect checks join final checkpoint |
| 10. Talks and legacy paths | Complete | Speaking archive expanded from five to nine source-backed sessions, with the OWASP slide deck and related book links; local permanent redirects generated from the [route map](docs/migration/legacy-route-map.json) for seven articles and two books; focused browser checks confirmed DevTools, Kubernetes article, and Same Origin Policy chapter redirects; source inventory regenerated | Original `noshellaccess.com` and `talks.pankajmouriya.com` hosts need their own redirect configuration at cutover |
| 11. Final content and responsive review | Complete | Lint, typecheck, 11 content tests, and production build passed; final full browser run passed 17/18 with a selector error in the new visual test, then the focused corrected visual test passed; desktop and phone book screenshots inspected in light and dark with real figures loaded; final rebuild passed after reference-link cleanup; refreshed local server returned HTTP 200 with expected content for six representative routes at `http://127.0.0.1:3101` | Original-host redirects and production cutover require separate deployment work |

## Known source gaps

- The supplied September 2026 résumé identifies Harness as the current employer (Senior Product Security Engineer, November 2025–present); the older personal site is stale on the current role.
- The user supplied `/Users/pankajmouriya/Documents/Pankaj-Resume-2026_v1.pdf`; use this résumé for the downloadable artifact and source-backed portfolio facts.
- GitHub ownership does not establish which repositories are currently maintained. Feature The Security Diff from its live site and repository; do not claim other repositories are maintained without review.
- Earlier talk resource links were taken from the author's public talk archive. The legacy hosts are independent and must be configured to redirect traffic when a cutover is approved.
- The legacy `toc.md` and stale social-links page were replaced by reader navigation; unfinished legacy series were not presented as complete books. PDF/EPUB exports remain a separate workflow under the blueprint.

## Visual review

Screenshots are saved under [`docs/review/screenshots`](docs/review/screenshots). The new home, writing archive, portfolio, and résumé were inspected at phone and desktop widths in both themes; the article reader was inspected at phone, tablet, desktop, and wide widths in both themes. The first review found the featured article title below the desktop first viewport. The hero and feature spacing were adjusted, and the follow-up browser check confirms the title starts within the 900 px desktop and 812 px phone viewports.

The next visual pass addressed the author's feedback that headings and titles felt too large. Display sizes were reduced and the homepage now identifies the current role. The refreshed screenshots and browser first-viewport checks passed at phone and desktop widths.

The content expansion review added a book catalog and chapter reader screenshots. The Same Origin Policy reader shows its chapter rail, local diagrams, code, and page TOC at desktop width. The Kubernetes reader shows loaded diagrams, chapter navigation, and no horizontal overflow at 375 px in light and dark themes. The first full-page screenshot captured lazy figures before scrolling; the focused review now loads visible figures before capture.

## Local preview

The refreshed production server is running at `http://127.0.0.1:3101`. Port 3000 was already occupied by another process in this checkout. This run did not change the public site or domain.

## Reader and color refinement — 10 October 2026

### Checkpoint 12: Direction and implementation inventory — complete

Reviewed the article layout, chapter reader, shared navigation, archive, and portfolio styles against the request for a wider, less congested reader. The former article grid capped prose at 46rem and reserved up to 15rem for a contents rail; nested book readers also lost space to a second rail. Reviewed TweakCN's public Claude theme preset and adapted its ivory/terracotta palette with stronger text contrast and blue/teal topic colors. Preserve Newsreader/DM Sans and the author's existing content and navigation.

Planned acceptance: larger usable reading column at desktop width, generous paragraph/section/figure spacing, one chapter rail in book readers, quiet inline page contents, consistent accessible icons and color cues across the site, light/dark and phone/desktop checks. The in-app browser connector reports no available browser; use the repository's automated local browser tests and saved screenshots for verification.

### Checkpoint 13: Reader and shared visual system — complete

Expanded the article canvas from 80rem to 96rem, reduced the contents rail to 12rem, aligned the title and reading column, and added generous paragraph, section, figure, and code spacing. Book chapters now use one persistent chapter rail with an inline page contents disclosure. Added back-to-writing navigation, metadata icons, colored topic badges and callouts, and a small reusable SVG icon set. Applied the TweakCN-inspired light/dark palette and purposeful icon/color treatments to home, archive, books, navigation, portfolio tabs, projects, talks, search, and résumé. No content claims or legacy routes changed. Next: production build, interaction regression suite, and screenshot review.


### Checkpoint 14: Responsive review and regression verification — complete

- Production build succeeded through Playwright's server setup; lint, typecheck, all 11 content tests, and all 19 browser tests passed.
- At 1280px, the article column is approximately 941px (previous cap 736px); automated checks require more than 880px for articles and 850px for book chapters. Article title and body left edges align.
- Inspected the target reader opening and prose in light/dark, phone opening, home, books, chapter reader, portfolio, and phone talks screenshots. Regenerated broader application captures at 375px and 1280px plus the existing reader captures at 375/768/1280/1600px.
- Initial suite exposed the same 1px phone overflow on seven checks. A temporary DOM diagnostic traced it to the menu button at x=375.98px after adding its icon. Reduced header gaps/button padding, removed the temporary diagnostic, and the complete 19-test rerun passed.
- Normal text contrast pairs are at least 4.79:1 across both themes (foreground, muted, action, and blue/teal topic text). Copy, image zoom, keyboard focus, contents navigation, mobile menu, theme controls, search, and legacy redirects remain covered.
- Changes and acceptance criteria: [reader refinement plan](docs/superpowers/plans/2026-10-10-reader-refinement.md). Screenshots: [review directory](docs/review/screenshots).
- Refreshed the local production preview at `http://127.0.0.1:3101`; production publication/domain cutover remains outside this pass.

### Checkpoint 15: Green accent balance — complete

Author feedback: keep the new icons and placement, retain the warm reddish palette, and restore the earlier green in selected places. Restore the former `#275d49` / `#9acaad` green pair for the identity dot, the primary home reading action, the featured technical illustration, and existing security/work cues. Leave the broader warm background, headings, and emphasis intact. Verify contrast and the refreshed local screenshots before closing this checkpoint.


### Checkpoint 16: Green accent verification — complete

Restored the earlier green tokens (`#275d49` light, `#9acaad` dark) and matching feature surfaces in the name mark, homepage reading actions, featured diagram, and security/work treatments. The terracotta color remains on editorial emphasis, talk details, search, and general interactions; icon shapes and placement are unchanged. Inspected regenerated home light/dark and target reader dark screenshots. A production build and four focused Playwright visual/interaction checks passed (books, portfolio and mobile menu, target reader); phone/desktop overflow checks passed. Green text contrast is 5.95:1 or higher on its tinted surfaces and 7.25:1 or higher on the page background in both themes. The local preview was refreshed on port 3101.

### Checkpoint 17: Local repository snapshot — prepared

Audited the initial commit on `feat/portfolio-publication`: site code, content, migration scripts, documentation, source assets, and the résumé PDF are in scope. Generated Playwright screenshots are reproducible and excluded from version control through `.gitignore`; they remain available in the local review directory. The latest verified checks remain the 19-browser-test publication run and the four focused green-accent visual checks, plus 11 content tests, lint, and typecheck.

## Experience timeline block — 10 October 2026

### Checkpoint 18: Format and integration plan — complete

Reviewed the supplied Shadcn Studio Timeline 07 code, the Timeline 4 screenshot, the current five-role portfolio timeline, `components.json`, and the installed Next.js page guidance. Recommend a vertical numbered timeline for experience: it keeps full role details legible at desktop and phone widths, while the pictured horizontal sequence works better for short milestones. The project already runs React 19.2.8, Tailwind CSS 4.3.3, and TypeScript 6.0.3. Add Motion, shadcn Badge, and `cn` utilities; create the supplied block and demo route under `src/`, then replace the portfolio's current timeline with source-backed career data. Keep the site's Newsreader/DM Sans and green/terracotta palette, support reduced motion and visible content without animation, and verify desktop/mobile interactions and build.

### Checkpoint 19: Block dependencies and project paths — complete

Confirmed `components.json` points to `src/components` and `src/app/globals.css`, with `@/*` resolving to `src/*`. Installed the declared pnpm 10.18.3 into a temporary tool directory because it was not on the shell path; used it to add Motion, clsx, and tailwind-merge to the project lockfile. Installed the official shadcn Badge via `pnpm dlx shadcn@latest add badge --yes`, which generated `src/components/ui/badge.tsx`. No Tailwind/React/TypeScript setup migration is needed. Next: adapt the supplied Timeline 07 block and connect source-backed roles.

### Checkpoint 20: Timeline block and portfolio integration — complete

Created the adapted Timeline 07 block, scroll animation component, real five-role data mapping, `cn` utility, and `/timeline-component-07` demo route under `src/`. Replaced the old ReUI timeline on `/portfolio`; retained every résumé-backed role and highlight. Sample company logos, career claims, and metrics were not introduced. The current Harness role has a Present status, company initials stand in for unavailable logos, and reduced-motion users get visible static content. Added only the theme mappings needed for shadcn Badge styling to `globals.css`. Initial 11 content tests and typecheck passed; lint found one Next image warning, corrected before browser QA.


### Checkpoint 21: Timeline responsive and regression review — complete

- Production build passed through Playwright's server setup. Lint and typecheck passed without warnings; 11 content tests and all 21 browser tests passed.
- Inspected full-page portfolio screenshots at 1280px in light/dark and 375px with reduced motion. The five roles appear in source order, all résumé-backed highlights remain visible, and no horizontal overflow occurs. The same component renders at `/timeline-component-07`.
- Initial reduced-motion browser check found Motion left the connecting line scaled to zero. The browser media preference was confirmed and a CSS override now keeps the line and all rows visible; the focused rerun and complete browser suite passed.
- Removed the unused ReUI career timeline source and styles. The numbered Shadcn Studio adaptation uses local company initials when no validated logo asset exists, so the portfolio does not display unrelated sample brands. A standalone demo route is excluded from search indexing.
- The local preview is refreshed on port 3101. The component, data map, dependencies, documentation, and test are ready for the next local commit.

## Search in the site header — 10 October 2026

### Checkpoint 22: Search redesign and dependency review — complete

The separate `/search` page breaks the flow between the portfolio and writing. The current search already covers published article and book-chapter bodies while excluding drafts; preserve that behavior in a compact header dialog with keyboard navigation, mobile access, and a Ctrl/⌘ K shortcut. Keep existing `/search?q=...` URLs as redirects that open the dialog with the supplied query. Reviewed the installed Next.js route and redirect guides and `components.json`; installed the official shadcn Command component with its Dialog dependency through the project pnpm CLI. Next: implement the search endpoint and shared dialog, then test responsive behavior and legacy links.

### Checkpoint 23: Integrated search implementation — complete

Added a shared Command/Dialog search overlay, desktop and mobile triggers, Ctrl/⌘ K shortcut, published-only article/chapter API, and relevance ordering. The old page now redirects to the homepage and opens the overlay with its query. Removed the footer link and retired the old page presentation; added search styling in the existing green, terracotta, and neutral palette. Updated browser tests and the README. Lint, typecheck, and all 11 content tests pass; browser and production checks follow.

### Checkpoint 24: Responsive review and local verification — complete

Reviewed search dialog screenshots at desktop and 375px phone widths in light and dark themes. The first mobile capture revealed a dialog shifted offscreen; corrected its positioning and added a viewport bounding-box assertion. The final focused browser run passed 10/10, and the full regression run passed 23/23; all 11 content tests, lint, standalone typecheck, and production build passed. A parallel typecheck/build attempt briefly raced over generated `.next` types; rerunning typecheck after build passed. The refreshed production preview is running at `http://127.0.0.1:3101`: homepage and search API return 200, the API returns four published results for `postMessage`, and `/search?q=postMessage` redirects to the homepage dialog. Search is now part of the shared navigation; original-host publication cutover remains a separate release step.

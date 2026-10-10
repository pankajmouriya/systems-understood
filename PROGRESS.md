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

## Footer refinement — 10 October 2026

### Checkpoint 25: Footer block and content review — complete

Reviewed the current shared footer and the blueprint's About/RSS/social/copyright contract. The official shadcn registry exposes no public-site footer block; Shadcnblocks Footer 2 is a free shadcn-compatible pattern with an identity area, grouped links, and a separated bottom row. Registered `@shadcnblocks` in `components.json` to inspect/install that block through the project CLI. The adaptation will keep the site's editorial typography, green and terracotta accents, existing profile URLs, and published RSS feed; no fictional contact information or newsletter form is needed. Next: integrate the block and inspect phone/desktop light/dark renders.

### Checkpoint 26: Footer block integration — complete

Installed free `@shadcnblocks/footer2` via the project pnpm CLI and adapted its identity/link-grid/bottom-row structure into the shared `SiteFooter`. Added an editorial writing invitation, distinct Explore/Work/Elsewhere groups, the existing RSS feed, and verified profile/project destinations. Replaced the registry's demo branding and placeholder links with site content; removed its unused demo logo/context-menu files and `react-icons` dependency. The footer remains a server component and uses the existing Next.js Link convention and site's display/body fonts. Next: responsive visual inspection, navigation checks, lint, typecheck, and build.

### Checkpoint 27: Footer visual and functional review — complete

Inspected the home page's footer at 1280px and 375px in light and dark themes. The deep green closing section, editorial invitation, grouped navigation, and copyright row stay legible without horizontal overflow; the dark theme retains clear separation from the page body. Added a footer browser check for writing, books, talks, RSS, GitHub, and back-to-top behavior. Focused browser checks passed 5/5; the full browser suite and production build passed 24/24. Lint, standalone typecheck, and all 11 content tests passed. Shadcn's component audit found no missing imports or dependencies; the unused registry demo assets and package were removed. The refreshed preview at `http://127.0.0.1:3101` returns 200 for home and RSS and includes the footer content. Next: local commit.

## Editorial writing layout — 10 October 2026

### Checkpoint 28: Reference and current-page review — complete

Reviewed the supplied krash.dev screenshot against current home and Writing captures. The useful reference cues are a concise introduction, featured reading paths, a technical illustration, compact dated rows, and a small topic marker. The current Writing index repeats each article description in a large preview card, making seven posts unnecessarily long. Preserve the personal name and selected DevTools story on home, and the existing green/terracotta identity. Add a short list of other published pieces below the home feature; on `/blog`, give three source-backed articles a featured area with original systems artwork and replace repetitive cards with a compact date/title/description index. Keep all seven published posts, semantic links/dates, book discovery, and phone readability. Next: implement and inspect both pages in light/dark at desktop and phone widths.

### Checkpoint 29: Home and Writing composition — complete

Added three other published articles below the homepage DevTools feature using a shared compact article-row component. Rebuilt `/blog` with three curated paths (Kubernetes controllers, DevTools, and long-lived JWT), original diagrammatic artwork, and a dated seven-post index. The previous per-row preview cards repeated each summary and were removed; rows now have one description, a date, a topic marker, and a direct title link. The archive introduction is shorter and its display scale is reduced. Updated focused browser expectations; lint and typecheck pass. Next: production browser checks, responsive screenshots, and final visual adjustments.

### Checkpoint 30: Editorial layout visual and regression review — complete

Inspected refreshed home and Writing screenshots at 1280px and 375px in light and dark themes. The first pass found an archive topic marker wrapping its arrow on desktop; simplified the marker and confirmed the final captures keep rows aligned. A featured article appeared twice by design (in selected paths and the complete index), so the browser selector was scoped to the index. All seven published articles remain available, the homepage shows three additional articles beneath its illustrated feature, and no page overflows at 375px. Focused browser checks passed 6/6; the full browser suite and its production build passed 24/24. Lint, standalone typecheck, and all 11 content tests passed. The refreshed preview at `http://127.0.0.1:3101` returns 200 with the new home and Writing sections. Next: local commit.

## Article reader character — 10 October 2026

### Checkpoint 31: Reader inspection and direction — complete

Inspected the admission controllers reader in the local production preview and reviewed shared header, prose, figures, and table-of-contents components. The article currently has no semantic section headings, so its long walkthrough has no navigation rail. Keep the established wide reading layout and green/terracotta palette; add a faint dotted header/margin treatment, green section rules, restrained figure mounts, and an active TOC marker. Promote the existing admission-controller section labels into headings and introduce a request-path heading without changing technical claims. Scope visual changes to blog readers so book layouts stay intact. The Impeccable launcher was unavailable; used current source and rendered page as design context. Next: implement and inspect desktop/phone in both themes.

### Checkpoint 32: Reader treatment implemented — complete

Added blog-scoped dotted margins and a fading header texture using CSS, with no image assets or client animation. Green header/section rules, a clearer active TOC rail, and surface-backed figure frames carry the existing identity through the reading page. The admission controllers walkthrough now has five semantic sections, enabling desktop and mobile navigation; original technical prose and legacy figure assets are preserved. Book presentation remains outside the new CSS scope. Next: production build, reader interaction checks, and visual review.

### Checkpoint 33: Reader visual and functional verification — complete

Inspected admission-controller opening and figure captures at 1280px and 375px in light/dark. Texture fades across the title area and stays at the outer edges of body content; diagrams retain their original colors inside neutral frames. Verified all five headings, desktop/mobile section navigation, image enlargement, Escape/focus restoration, and no horizontal overflow. The existing reader regression checks passed 7/7, including code copy, metadata, keyboard controls, wide prose, and the unchanged book layout. All 11 content tests, lint, standalone typecheck, and the production build passed. Updated local production preview is running at `http://127.0.0.1:3101/blog/guide-admission-controllers`. No deployment or technical-content claims changed. Ready for local commit.

## Hero 44 homepage — 10 October 2026

### Checkpoint 34: Supplied block reviewed — complete

Reviewed the user's local Hero 44 source, including its Three.js/Rapier draggable lanyard. Adapt the split introduction and hanging portrait composition with source-backed name, role, location, résumé, and profile links. Keep selected writing immediately below the hero; avoid importing the demo's availability claim, unrelated technology logos, or stock portrait. Use a locally stored public GitHub portrait by default while a preferred-photo question is pending. Load 3D separately with static portrait fallback for reduced motion and rendering failure; keep the supplied model attribution. Next: dependencies, integration, and responsive/interaction verification.

### Checkpoint 35: Hero and lanyard integration — complete

Added the adapted Hero 44 block and its physics-based draggable portrait, using the GitHub photo confirmed by the author. Installed Three.js, React Three Fiber/Drei/Rapier and Three types through pnpm. Decoded the supplied embedded model into a local GLB and stored its clip/portrait assets locally. The homepage now has compact personal copy, writing/CV/connect actions, and relevant topic links beneath the split hero. A static portrait remains available during loading, reduced motion, or renderer failure; a pause control and viewport suspension limit continuous rendering. Excluded the user's unmodified `tmp/` reference source from lint/typecheck so the demo imports do not become application code. Lint and typecheck pass. Next: production rendering, drag behavior, fallback and responsive checks.

### Checkpoint 36: Hero visual and interaction verification — complete

Inspected desktop/phone captures in both themes and corrected spacing between the hanging card and pause control. Verified real pointer capture/drag, pause/resume, working writing/CV links, reduced-motion static portrait, and a simulated unavailable-WebGL fallback. No horizontal overflow at 375px. The first complete browser run passed 25/26; the only failure was an obsolete first-viewport article-title requirement from the prior hero. Updated that check to require a visible writing action and the featured article directly after the new hero; the affected four tests then passed. All other browser regressions passed, plus lint, standalone typecheck, 11 content tests, and production build. The downloaded model/assets are local, and source attribution is documented in `docs/credits/hero-44.md`. The user's `tmp/` reference files remain untouched and uncommitted. Refreshed preview runs on port 3101; next: local commit.

### Checkpoint 37: Author-supplied hero portrait — implemented

Replaced the GitHub avatar with the author's supplied photograph for both the draggable 3D card and static fallback. Stored the original PNG unchanged under a new asset URL to avoid stale browser/texture caches and updated the portrait attribution. Next: production preview and crop check.

### Checkpoint 38: Animated greeting and availability — implemented

Added the supplied Hello / नमस्ते / 你好 / Ciao rotation and the explicitly requested green Available badge. The greeting reserves its width to avoid shifting surrounding text, has a stable accessible heading, includes a pause control, and stays on Hello for reduced-motion users. The author-supplied portrait has been visually verified in the 3D card and checked in its static fallback. Next: verify the combined homepage update and commit locally.

### Checkpoint 39: Portrait and greeting verified — complete

Production build and lint passed. Inspected desktop/phone hero captures and confirmed the new portrait in the animated card and static fallback. The five affected browser checks pass across the initial run and focused rerun: card dragging/pause, reduced motion, rotating greeting/pause, responsive layout, and navigation. The initial greeting assertion encountered both entering/exiting words during the intended transition; corrected the selector to target the incoming word and confirmed rotation, pause, and static Hello behavior. Refreshed the preview on port 3101. Ready for local commit.

## Restrained signal lines and sheen — 10 October 2026

### Checkpoint 40: Reference and placement — complete

Inspected the supplied recording frame and screenshot: fine curved tracks, short travelling highlights, and soft reflected light on cards. Place low-opacity green signal paths behind the homepage portrait and in the two book panels. Add one-pass hover/focus sheen to homepage work links, portfolio project/talk links, and book panels. Keep reading pages free of new effects. Hero lines share the existing card pause/viewport state; book motion runs briefly on hover/focus. Reduced-motion users see static tracks only.

### Checkpoint 41: Effects implemented — complete

Added reusable decorative SVG paths with CSS-driven signals and a pointer-transparent sheen. No new dependencies, canvas, layout shifts, or pointer handlers. Effects use existing theme colors, lower opacity on phones, and are excluded from accessibility navigation. Next: verify actual appearance, links, pause/reduced-motion behavior, and responsive rendering.

### Checkpoint 42: Effects verified — complete

Production build, lint, and six focused browser checks passed. Reviewed the homepage tracks and book-panel sheen in rendered captures, including dark theme; responsive suite confirms desktop/phone layouts and navigation. Direct browser checks confirmed hero signal animation pauses with the portrait control, sheen activates on hover, reduced-motion preferences hide all new animated highlights, and the book link remains clickable. The effects are deliberately faint; no new effects were added to article prose or reader controls. Local preview refreshed on port 3101. Ready for local commit.

### Checkpoint 43: Recognizable technology marks — implemented

Replaced the generic three-category outline-icon strip with six actual technology marks: Burp Suite, OWASP, Kubernetes, Docker, Google Cloud, and GitHub. These appear in the site's existing talks, guides, experience, or public-profile links. Downloaded local SVGs from Simple Icons, retained visible names, added restrained icon mounts with brand colors, and kept the portfolio link. Phone layout uses two rows of three logos. Next: production and responsive rendering checks.

### Checkpoint 44: Technology strip verified — complete

Inspected rendered desktop and phone logo-strip crops: all six SVG marks load, labels stay readable, and the mobile three-column layout fits without overflow. Production build, lint, and both responsive/navigation browser checks passed, covering light and dark themes. The refreshed homepage is available on port 3101. Ready for local commit.

### Checkpoint 45: Skills correction and component review — complete

The previous logo strip misread the requirement: show skills and preserve hero space. Searched shadcn Badge through its MCP registry and reviewed current shadcn/ReUI badge documentation. Reused the installed shadcn Badge with compact icon-and-label styling informed by ReUI light variants. Replaced tool names with résumé-backed Application security, Cloud security, Supply chain security, and Security automation. Removed the tile grid, large mounts, and now-unused downloaded logos. Next: verify reduced strip height and responsive behavior.

### Checkpoint 46: Compact skills strip verified — complete

Inspected screenshots of the actual strip at 1280px and 375px. It measures 55px high on desktop and 117px on phone, with four readable skill badges and the portfolio link; the previous phone logo grid occupied roughly 277px. Lint, production build/type compilation, and both responsive/navigation browser checks passed in light/dark. Preview refreshed on port 3101. Ready for local commit.

## Header identity refinement — 10 October 2026

### Checkpoint 47: Header hover and focus review — complete

Confirmed the boxed appearance comes from the global terracotta `:focus-visible` outline, while the plain underline comes from a blanket header hover rule. Applied the approved quiet editorial treatment: a faint green header tint, a short green rule beneath the name on hover/focus, and the same rule on the active desktop navigation section. The name keeps a visible green keyboard focus indicator. The client header reads the pathname through Next's documented `usePathname` hook so article, book, and portfolio subroutes highlight their parent link. Next: verify states across desktop/phone and light/dark, then commit locally.

### Checkpoint 48: Header visual and behavior verification — complete

Inspected production screenshots at 1280px in light and dark, including the name's hover and keyboard focus states, plus a 375px dark header. The blanket hover underline is gone; the short green name rule animates in, and keyboard focus remains visible with a green outline. Confirmed the faint green header tint and active navigation rule on nested Writing, Books, and Portfolio routes and the résumé route. The phone page has no horizontal overflow. Lint, all 11 content checks, production build, and five focused browser checks passed. Local preview is refreshed at port 3101. Ready for local commit.

## AI agent character study — 10 October 2026

### Checkpoint 49: Scene design and implementation — complete

The author chose pixel-art characters for the live homepage and asked to see clean illustrated figures as a comparison. Added a compact green defender and terracotta rogue as original code-native SVG characters beside the hanging portrait. They approach, clash briefly with a small spark, and retreat on a nine-second cycle. The lanyard's existing pause control and viewport visibility also pause the scene; reduced-motion visitors see still characters. Added `/animation-study` as a noindex visual comparison showing pixel and smooth illustrated variants with the same portrait context. No external sprite assets or new runtime dependencies. Next: inspect rendered motion and responsive composition, verify pause/reduced-motion behavior, and commit.

### Checkpoint 50: Scene review and verification — complete

Inspected live desktop and phone screenshots of the homepage and both comparison styles. The characters remain small near the lanyard and do not cover the portrait or text. Connected the study page's lanyard visually to the photo after spotting a gap. The focused browser suite passed all four checks, including pause/resume, reduced motion, both styles at 375px, and no horizontal overflow. Lint, all 11 content checks, TypeScript, and the production build passed. Next: refresh the local preview and commit the task-owned files.

### Checkpoint 51: Character art and scene direction replaced — complete

The user's review rejected the icon-like characters and repetitive bump animation. Replaced those drawings with original generated sprite atlases: an armored green sentinel and hooded terracotta rogue, each with idle, action, and reaction poses. Both pixel and clean illustrated versions share a coordinated 14-second story: portal arrival, fragment attack, airborne shield interception, reflected fragment, recoil, and a quiet return to patrol. The comparison route now presents one larger scene with art-style switching, pause/replay, and buttons to hold specific story moments. Kept the live homepage's portrait pause, viewport, and reduced-motion behavior. Artwork prompts and provenance are saved beside optimized assets. Next: inspect scene timing, clipping, light/dark, desktop/phone, and controls.

### Checkpoint 52: Approved artwork and final scene verification — complete

The user approved the new direction. A fresh visual reviewer identified atlas clipping; regenerated padded sheets and added explicit per-pose SVG clipping to remove neighboring fragments. Final desktop and phone captures show complete shield, cast, recoil, and victory poses; the reviewer scored the clipping issue resolved. Pixel remains the homepage default and the study route switches to illustrated art. Existing portfolio colors, typography, photo, and navigation remain the visual context. Four focused browser checks passed for portrait interaction, pause/resume, reduced motion, style switching, seeking/replay, and phone width; the final production build with TypeScript and lint passed after the clipping fix. Preview runs at port 3101. The artwork and exact generation/edit prompts are in `public/images/agents/`. Ready for local commit.

## Security story rotation and portrait composition — 10 October 2026

### Checkpoint 53: Story model and synchronized composition — complete

Resumed after the user's hold with explicit approval for a smaller, lower portrait and four industry-tool stories. Implemented SQL injection (AWS WAF), prompt injection (Bedrock Guardrails plus a separate tool allowlist), unsigned supply-chain image (Cosign-backed admission policy), and RCE (Cloud Armor edge rules, an evasion, then Falco detection plus a configured isolation response). Added distinct WAF, trust-boundary, signature-gate, and containment diagrams and attack labels. The illustrated agents are now the default. Each 24-second story hides the portrait during combat, then returns it with a short drop animation; the card is about 20% smaller and its strap begins lower. A shared phase clock changes state only at phase boundaries, pauses offscreen/background/in reduced motion, and stops the WebGL render loop while the portrait is hidden. The study page supports all four stories, style switching, seek, pause, and replay. Next: verify synchronization, story rotation, reduced motion, card interaction, and desktop/phone composition.

### Checkpoint 54: Story and portrait verification — complete

Inspected all four story diagrams, light/dark scenes, and desktop/375px phone composition. The RCE packet passes the edge defense before runtime detection and a configured isolation response, distinct from the SQLi block. Visual review caught strap interpolation overshooting after the hidden interval and a blank canvas on paused resize: clamped interpolation and switched inactive rendering to demand, then confirmed the returned portrait and connected strap in fresh desktop/phone captures. Continuous WebGL rendering and physics pause during combat; demand rendering still permits necessary resize updates. All five focused browser checks passed after the fix (portrait drag/return, pause, reduced motion, story rotation, study controls, and phone overflow), as did the production build with TypeScript, lint, and diff checks. A bounded independent review found no blockers. Preview refreshed at http://localhost:3101; scenario references and technical boundaries are in docs/design/security-stories.md. Ready for local commit.

### Checkpoint 55: AI opening, guardian entrance, and clearer action lanes — implemented

Made prompt injection the initial story. Added a measured entrance over the actual “Mouriya” text, followed by an arcing jump to the portrait before it disappears at 5.8 seconds. Kept combat characters in the upper lane through the recoil; moved defense diagrams below that lane and delayed the guardian's return until the diagram fades. Added an explicitly enabled, quiet synthesized rogue-arrival cue with mute, pause/visibility cleanup, and no audio download. Next: inspect the surname perch/jump and recoil spacing on desktop/phone, verify sound opt-in and existing behavior, then update this checkpoint with results.

### Checkpoint 56: Entrance, audio, and spacing verified — complete

Reviewed the surname perch and jump at desktop width, the measured surname position at 375px, and the final recoil in desktop light and phone dark layouts. The natural opening keeps the settled portrait visible until the guardian arrives; the recoil leaves defense labels unobstructed. Phone document width remains 375px. Six focused browser tests passed, including a new check for AI default, zero synthesized voices before opt-in, a two-voice arrival cue after enabling, and mute state. Production build/TypeScript, lint, and diff checks passed. A bounded code review found no material blockers. Sound starts disabled and enabling it replays the opening; pause, hidden-tab/offscreen state, reduced motion, and unmount stop audio. Preview is running on port 3101. Ready for local commit.

### Checkpoint 57: Persistent identity portrait and infrastructure scene — implemented

Resumed with approval for a persistent hanging portrait beside “Mouriya” and a separate story area. Replaced the homepage WebGL portrait with a small static hanging image, removing its automatic swinging, hide/return loop, drag controls, and Three.js loading from this route. Added an original pixel-grid terminal, gateway, and server rack between the agents, above the defense diagrams. Corrected the premature secured label. Signal lines are idle initially, red/right-to-left from rogue arrival, and green/left-to-right after the relevant defense result (later for RCE). Review fixes also reset semantic/CSS clocks together after a reduced-motion change, catch up overdue scene boundaries, pause the greeting offscreen/hidden, and guard asynchronous audio cleanup. Next: browser/visual validation and the detailed animation handoff document.

### Checkpoint 58: Animation audit, visual review, and handoff — complete

Seven focused production-browser checks passed for persistent identity, no canvas, phone/reduced motion, four stories, pause/replay/seek, opt-in sound, traffic direction/state, later RCE defense, and reduced-motion restart. The new interruption test reproduced duplicate FlowLines layers caused by sibling key collisions; namespaced keys resolved it. Inspected desktop light and phone dark opening/attack/secured captures: portrait stays beside the name, infrastructure occupies the former photo area, and diagram text remains clear. Browser inspection found zero canvases and no GLB/pin requests; phone width is 375px with no overflow. Lint and diff checks are clean. Added docs/design/hero-animation-handoff.md with architecture, clock boundaries, review findings, accessibility/audio behavior, actual performance facts, test recipes, device limitations, dormant-code concerns, and prioritized improvements; updated security-stories.md to match. Independent code/document review found no actionable blockers. Final production preview refresh and local commit follow.

### Checkpoint 59: Topic-specific article guardian illustrations — implemented

Added a silent title-side guardian boundary with six defense labels inside and four topic-specific threat labels outside. Implemented Kubernetes, cloud, application, runtime, and AI variants with different signal treatments; current article tags automatically choose Kubernetes or application security. All five can be reviewed at the noindex /security-study route without inventing articles for missing categories. The approved green guardian is the only character. Each sequence runs once for 12 seconds then rests; pause/replay, offscreen/hidden suspension, and reduced-motion behavior are supported. Reference links and contextual notes clarify that these are illustrative defense layers, including AWS-specific workload identity and Falco detection versus response. Next: verify title composition, phone label placement, mapping, finite playback, and reading behavior.

### Checkpoint 60: Article guardian verification and documentation — complete

Both focused production-browser tests passed: article/tag mapping, persistent readable title and prose navigation, pause/play, finite 12-second completion/replay, offscreen suspension, all five domains, reduced motion, and 375px overflow. Inspected the actual Informers title at 1440px, its phone layout, and every domain in dark phone captures. Corrected long labels crossing the rounded boundary by moving top/bottom labels inward and wrapping middle labels; final Cloud/Runtime/AppSec captures keep all controls inside. Final production build/TypeScript, lint, and diff checks passed. A bounded independent review found no material blockers. Added docs/design/article-guardian-boundaries.md and linked it from the main animation handoff. Preview is available on port 3101, with all five variants at /security-study. Ready for local commit.

### Checkpoint 61: Compact circles, perimeter highlights, and reader stamp — implemented

Inspected a frame from the supplied video and adapted its thin traveling border highlights for article headers, book panels, and the shared footer invitation. Highlights are finite, quiet, pause outside view/hidden tabs, and disappear under reduced motion. Compressed title illustrations into a 320px slot with a true circular inner boundary and smaller stationary labels. Added a below-article “Well read” ink-style seal, awarded only after 120 seconds of document-visible time and reaching the article-end marker. The earned flag is local to this tab/session and article, with an in-memory fallback if storage is blocked; no server tracking or account needed. Next: qualification/visibility tests, compact label review, stamp appearance, and documentation.

### Checkpoint 62: Reading rewards and compact illustrations verified — complete

Six focused browser checks passed against a production build: both reward gates, background-time exclusion, returning to a visible end marker, per-article session persistence, blocked storage, reduced motion, topic mapping, and phone overflow. Review caught a hidden-tab intersection edge case; retaining intersection state fixes qualification on return. The new regression initially failed because lazy article figures moved its marker out of view; the test now verifies actual viewport intersection before returning. Inspected desktop light and phone dark stamp captures, compact AppSec/Cloud/Runtime/Kubernetes labels, and book/footer surfaces. Production build/TypeScript, lint, and diff checks passed. Added docs/design/reading-rewards-and-traces.md covering timing, storage, cleanup, accessibility, finite traces, and testing limitations. Physical-device background behavior and multi-engine profiling remain outside this local check.

### Checkpoint 63: Compact experience selector — implemented

Replaced the five-card vertical career feed with a single focused role panel and a horizontal five-company milestone rail. The rail is a real ARIA tab interface with click, left/right arrow, Home, and End navigation. Selection advances a green progress trace and transitions the detailed panel laterally; reduced motion uses an immediate state change. Harness, Kong, DeepSource, and invideo use locally stored official site assets, while Appsecco uses the approved text monogram. Mobile keeps the milestones in a touch-scrollable rail and stacks the selected role content. Next: production browser checks, logo/theme review, responsive inspection, and bounded visual corrections.

### Checkpoint 64: Compact experience selector verified — complete

Five production browser checks passed for the experience interaction and adjacent portfolio navigation. They cover the five-company tab contract, click and arrow-key selection, a single changing role panel, the desktop height budget, phone overflow, the demo route, and reduced motion. The initial test run failed against the old vertical feed as expected. A later legacy portfolio assertion was narrowed after the new selected company correctly appeared in both its tab and panel. Inspected desktop light and 375px dark captures: all employers fit the wide rail, the selected milestone and progress trace use the green palette, the panel remains within one desktop viewport, and mobile exposes the rail through horizontal touch scrolling. The Impeccable layout scan reported no findings; lint, production build/TypeScript, and diff checks passed.

### Checkpoint 65: Full-width experience composition — implemented

Moved the experience heading above the interaction in a compact horizontal header and expanded the milestone rail and role panel across the portfolio container. The selected role now uses three desktop columns for summary and skills, principal achievement, and supporting work; mobile keeps the established single-column reading order. Harness is identified as the present role with a finite warm-red signal around its milestone and the panel perimeter when selected. The signal fades after one pass, leaves the green selected state intact, and becomes a quiet static mark under reduced motion. Removed the panel shadow so the expanded surface uses one clear border-based depth treatment. Next: production interaction tests, desktop/phone visual inspection, trace timing review, and layout scan.

### Checkpoint 66: Full-width experience composition verified — complete

Five production browser checks passed for the experience selector and adjacent portfolio routes. The focused test first failed because the old layout had neither the full-width header nor current-role trace, then passed after implementation. Verified a timeline and heading width above 1,000px at 1280px, Harness-only signaling, trace removal on other selections, keyboard navigation, phone overflow, and the reduced-motion static treatment. Inspected a 1440px light capture during the trace and a 375px dark reduced-motion capture: the heading leads the section, the panel spans the container, three desktop content groups remain readable, and red stays confined to thin perimeter marks. The Impeccable layout scan returned no findings; lint, production build/TypeScript, and diff checks passed.

### Checkpoint 67: Capability ledger — implemented

Added “// Stacks & Experience / Where I’m good” below the career timeline and before the project/talk paths. The ledger presents six capability areas in a compact three-by-two editorial grid: product security, vulnerability management, application security, cloud and Kubernetes security, software supply chain security, and security automation with AI-assisted triage. Each area pairs a consistent icon with a concise practice statement and an evidence line drawn from existing résumé content. A thin green route follows the two desktop rows while one finite red signal travels the route on first view; mobile converts it to a vertical route beside a single-column list, and reduced motion keeps a quiet static marker. Next: production content/motion checks, light/dark visual inspection, responsive review, and layout scan.

### Checkpoint 68: Capability ledger verified — complete

Seven production-browser checks pass across the new capability ledger, the compact experience selector, and portfolio navigation. The focused checks cover all six evidence-backed capabilities, the visibility-triggered finite signal, a static reduced-motion treatment, and a 375px layout without document overflow. Inspected a 1440px light capture and a 375px dark capture: the ledger holds a compact three-by-two editorial rhythm on desktop, becomes one readable vertical route on mobile, and stays visually subordinate to the experience section. The Impeccable layout scan returned no findings. ESLint, the Next.js 16 production build, TypeScript, static generation, and the final diff checks pass. Ready for local commit.

### Checkpoint 69: Photo-free homepage identity — implemented

Simplified the homepage role from “Senior Product Security Engineer” to “Security Engineer” and removed the hanging author portrait, strap, clip, component, and unused portrait-only CSS. The greeting, name, location, writing actions, skills, and animated security theater remain in place. Personal imagery is reserved for the planned About Me page. Updated the animation handoff and security-story documentation so future changes no longer assume a homepage portrait. Two focused production-browser checks pass for the exact role, absent portrait markup, scene controls, reduced motion, and 375px overflow. Next: visual inspection, full hero regression, lint, production build, and refreshed local preview.

### Checkpoint 70: Simplified homepage hero verified — complete

Inspected the photo-free homepage at 1440×950 in light mode and 375×900 in dark mode. The shorter identity block gives the name and “Security Engineer” role more space while preserving a distinct security-story stage; mobile stacks the two areas without horizontal overflow. All seven hero browser checks pass for the exact role, absent portrait, primary actions, animation study, rotating greeting, four defense stories, opt-in audio, traffic direction, pause behavior, and reduced motion. The Impeccable layout scan returned no findings. ESLint, the Next.js 16 production build, TypeScript, and static generation pass. Ready for local commit.

### Checkpoint 71: About Me composition and Shadcn foundation — ready

Confirmed the repository already uses React 19, Tailwind CSS 4, TypeScript, and the Shadcn project structure under `src/`. Installed the missing Avatar and Card primitives through the Shadcn CLI; their runtime dependencies were already present. The About Me page will combine the supplied editorial portrait/biography reference with the supplied scroll-reactive flip-card block. Pricing, client metrics, and freelance claims are excluded because no source supports them. The second panel will instead present security practice areas, public profile links, résumé access, and the evidence-backed counts already represented by the site. Personal imagery remains isolated to `/about`. Next: browser contract, page implementation, shared navigation, responsive inspection, and production verification.

### Checkpoint 72: About Me page verified — complete

Added `/about` and the shared About Me navigation entry across desktop, mobile, footer, sitemap, and route documentation. The page combines the supplied editorial portrait/biography composition with a Shadcn-based scroll-reactive profile card that flips by pointer or keyboard. The reverse explains the working philosophy; the adjacent panel presents four security practice areas plus GitHub, LinkedIn, and résumé links. The author's existing local portrait is the only personal image. No pricing, client metrics, testimonials, or template identities remain. Inspected a 1440×1100 light capture and a 375×812 dark capture; the portrait crop, biography measure, two-panel composition, mobile order, and footer integration are clear without document overflow. Five production-browser checks pass across About Me and shared navigation, including reduced motion and keyboard flipping. ESLint, TypeScript, the Next.js 16 production build, and all 48 static pages pass. The Shadcn audit is satisfied; the Impeccable detector only reports the pre-existing experience-timeline width transition outside this change. Ready for local commit.

### Checkpoint 73: About Me refinement — implemented

Reduced the opening headline and removed its forced line break, bringing the portrait and biography closer to the first viewport. Aligned the two content rows, retained the editorial portrait and flip-card interaction, and filled the card's empty space with the existing Harness summary from the portfolio data. The working-principles section now uses an open layout, restrained skill icons, readable descriptions, and correctly spaced Shadcn separators. Added a tablet layout, preserved mobile reading order, and bounded the portrait seal to two rotations. Next: inspect desktop, tablet, phone, dark theme, and flipped-card states; run the existing About interaction checks.

### Checkpoint 74: About Me refinement verified — complete

Inspected fresh production captures at 1440px light, 768px light, and 375px dark, including the reverse profile-card face at all three sizes. No horizontal document overflow was measured. Both existing About browser tests pass, covering the biography, navigation, card flip and keyboard return, reduced motion, and mobile menu. Production build (48 routes), TypeScript, lint, and diff checks pass. The design detector reported only the pre-existing experience-rail width transition outside this change. The connected Browser plugin had no available browser; local Chrome/Playwright provided the captures and interaction evidence. Refreshed localhost:3101 with the new production build. No deployment or push performed.

# Technical Publication Foundation Implementation Plan

> **For agentic workers:** Implement this plan task by task. Read the [approved blueprint](../../../technical-blog-blueprint.md) first, then verify the current workspace and installed package APIs before writing application code. Use the repository's normal review process once one exists.

**Goal:** Deliver one real, long-form security article in a custom, accessible Next.js reader, using validated MDX content and working technical-media controls.

**Architecture:** Keep authored MDX and media in Git. Fumadocs MDX/Core owns collection parsing, frontmatter validation, heading extraction, and the single Shiki code transform; custom Next.js Server Components own article rendering and metadata. Small Client Components handle theme switching, code copy, screenshot zoom, and active heading tracking.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, selected shadcn/ui primitives, Fumadocs MDX/Core, pnpm. Pin and record exact working versions during Task 1; the blueprint intentionally does not freeze them.

**Spec:** [technical-blog-blueprint.md](../../../technical-blog-blueprint.md), especially sections 5–9, 11, 15–16, 19, 22, and 26.

**Execution checkpoint (10 October 2026):** The first real article reader is implemented at `/blog/devtools`. The [review record](../../review/first-slice.md) has the source audit, screenshots, exact verification results, and remaining hosted-migration gates. The checkboxes below retain the original execution plan; use the review record for current status.

**Design and scope update (10 October 2026):** The user requested a stronger visual identity and a personal portfolio containing experience, conference talks, maintained projects, resume, and GitHub/LinkedIn links. [Blueprint section 28](../../../technical-blog-blueprint.md#28-portfolio-expansion-and-visual-review--10-october-2026) is the consolidated brief: it records the current composition gaps, revised reference priorities including Arpit Bhayani and ReUI, three alternative directions, and the recommended author's studio with annotation. This foundation plan does not cover that redesign. Functional checks do not establish visual acceptance; reconcile subsequent implementation work with section 28's concrete brief and visual review criteria.

## Global constraints

- The article page is the design priority. Use real long-form content before finalizing typography and spacing.
- Do not import Fumadocs' documentation layout. Keep prose free of a left documentation sidebar.
- Use one MDX compiler and one code-fence transform. Do not add Expressive Code or Code Hike in this slice.
- Public article output is prerendered; the article body remains a Server Component.
- Drafts are absent from public routes, lists, metadata feeds, and any eventual search index.
- Support light and dark themes, keyboard use, narrow phones, and desktop reading.
- Preserve legacy URLs and heading fragments where practical; do not cut over production as part of this plan.
- Keep the existing blueprint. At planning time the workspace contained that file only; the application and repository were created during execution.

## Scope and delivery boundary

This is the first implementation slice described in blueprint section 26. Its reviewable result is a running article route, not a homepage or a complete migration. Search gets a small compatibility probe after the article slice, before archive and ebook work. Production deployment and any DNS or URL cutover require a separate launch plan based on the legacy inventory.

The existing Docusaurus source and a representative post are required inputs for the real-content acceptance test. If they are unavailable at execution time, complete the compiler and reader with an explicitly labeled temporary fixture, record that the real-content gate is still open, and do not claim this slice accepted.

## Planned file map

| Path | Responsibility |
|---|---|
| `package.json`, `pnpm-lock.yaml`, `next.config.mjs`, `components.json` | Pinned app and content-tool configuration |
| `source.config.ts` **or** the supported Macro API collection file | One typed `blog` collection; choose the API that compiles with pinned Fumadocs |
| `content/blog/<real-post>.mdx` | Migrated representative security article, with validated metadata |
| `public/images/blog/<post-slug>/` | Article figures after redaction and optimization |
| `src/lib/content.ts`, `src/lib/reading-time.ts` | Published-post lookup and presentation metadata |
| `src/app/layout.tsx`, `src/app/globals.css`, `src/styles/prose.css` | Theme provider boundary, tokens, responsive prose styling |
| `src/app/blog/[slug]/page.tsx` | Static params, article rendering, page metadata, missing-route handling |
| `src/components/shell/` | Minimal site header, footer, skip link, theme control |
| `src/components/articles/` | Article header/layout/TOC, code block, figure and lightbox, callout, table overflow |
| `src/components/mdx/` | MDX component map and semantic element wrappers |
| `tests/content/`, `tests/e2e/` | Schema/draft checks and browser-level reader checks |
| `README.md` | Local setup, authoring syntax, build and verification commands |

The file map is a responsibility map, not a requirement to create empty directories or components before their task needs them. Choose the Fumadocs Macro API or Config API after a compiling probe; do not maintain both.

---

### Task 1: Audit inputs and establish a compiling content route

**Reviewable deliverable:** One MDX article builds at `/blog/<slug>` with typed metadata, extracted headings, and a prerendered route. The dependency versions and actual Fumadocs API are documented.

**Files:** Create the app/config files, the selected collection definition, `src/lib/content.ts`, `src/app/blog/[slug]/page.tsx`, one article, and a focused content test. Add `docs/migration/legacy-inventory.csv` only when the legacy source can be inspected.

- [ ] Inspect the legacy Docusaurus checkout or deployment if supplied. Record public URL, source path, title, date, canonical URL, heading fragments, local images, code fences, admonitions, and custom MDX for three representative posts: long security research, screenshot-heavy tutorial, and short note. Mark the selected first article. If no legacy source is available, record that dependency in `README.md` and keep a temporary fixture clearly labeled.
- [ ] Bootstrap Next.js App Router with TypeScript, Tailwind v4, linting, `src/`, and `@/*` imports **in this workspace**, preserving the blueprint. Initialize shadcn/ui with one primitive foundation. Install only Fumadocs MDX/Core, theme support, and the primitives used in this slice. Commit a single pnpm lockfile when Git is available.
- [ ] Pin compatible package versions. Confirm the selected Fumadocs collection API, Next plugin, compiled MDX export shape, frontmatter schema hook, TOC data, and code-fence metadata syntax using the installed version's official documentation and a working build. Record exact versions and the chosen syntax in `README.md`.
- [ ] Define the blog schema from blueprint section 9.1: required `title`, `description`, `slug`, `date`, `draft`, `kind`, and controlled `tags`; validate unique slugs, parseable dates, `updated >= date`, and optional security fields when present. Reject malformed content at build/check time.
- [ ] Add a published-post selector that filters drafts before route generation. `generateStaticParams` contains published slugs; an unknown or draft slug returns 404. Generate the article title, description, canonical URL, and publish/updated metadata from validated frontmatter. Keep site origin configurable for local versus preview deployment.
- [ ] Verify with `pnpm lint`, the project typecheck command, and `pnpm build`. Inspect build output for the static article route. Add a focused content test proving duplicate slug, unknown tag, invalid date order, and draft exclusion fail or filter as specified. Run the test and retain the result in the PR description.

**Gate:** A real article can be compiled without dropped content. If the selected post requires unsupported Docusaurus MDX, record every unsupported construct and conversion decision before moving on. Do not silently remove it.

### Task 2: Build the article shell around the real post

**Reviewable deliverable:** The article has readable title, summary, author/date/reading time, semantic structure, responsive prose width, stable heading anchors, and a TOC that works at the intended breakpoints.

**Files:** `src/app/layout.tsx`, `src/app/globals.css`, `src/styles/prose.css`, `src/components/shell/`, `src/components/articles/ArticleHeader.tsx`, `ArticleLayout.tsx`, `ArticleTOC.tsx`, `src/lib/reading-time.ts`, and the article route.

- [ ] Write browser checks for the article heading, metadata, skip link, heading-anchor navigation, responsive layout, and absence of page-level horizontal scrolling at 375 px. Capture a failed baseline before building the shell.
- [ ] Build a minimal site header and footer, semantic `main`/`article` landmarks, and a skip link. Display publication date and reviewed/updated status accurately; do not infer a review date from build time.
- [ ] Implement the blueprint's initial light tokens and typography ranges. Target roughly 700–760 px prose width and allow media to widen independently up to roughly 1120 px. Set `scroll-margin-top` for linked headings.
- [ ] Render the compiled TOC in a right rail only when screen width and heading count justify it. Provide an inline or compact TOC on narrower screens. Keep active-heading tracking in the smallest possible Client Component; linked headings and article prose work without JavaScript.
- [ ] Render a representative article with nested H2/H3/H4 headings, footnotes, references, long title, and at least 5,000 words or the longest available real post. Review 375 px, tablet, desktop, and wide desktop screenshots; adjust tokens based on content rather than homepage mockups.
- [ ] Run the browser checks and production build. Keyboard-test the skip link and TOC, including back/forward navigation and an anchored URL loaded directly.

**Gate:** Body text, headings, and metadata remain readable at 200% zoom; the TOC never narrows prose excessively or obscures it.

### Task 3: Make technical content reliable

**Reviewable deliverable:** Code, screenshots, callouts, and tables remain legible and usable in light/dark themes and on a narrow phone.

**Files:** `src/components/articles/CodeBlock.tsx`, `Figure.tsx`, `ZoomableImage.tsx`, `Callout.tsx`, `DataTable.tsx`, `src/components/mdx/`, prose styles, and the article fixture/assets.

- [ ] Add failing browser cases for a shell fence and TypeScript fence, a long filename, a very long code line, copy feedback, a wide table, a captioned screenshot, and Escape/focus return from screenshot zoom.
- [ ] Use Fumadocs MDX's Shiki processing as the only code transform. Standardize and document one authoring syntax for language, title, and supported line highlights. Keep code as selectable text, preserve indentation, and contain overflow inside the block. If line highlighting is unavailable in the pinned pipeline, remove that authoring promise from v1 rather than adding a second transform.
- [ ] Implement the copy control with an accessible name and live feedback. Copy the original code text, excluding line-number chrome or rendered markup. Verify copy by pasting into a test-controlled clipboard and comparing exact whitespace.
- [ ] Map MDX callouts and figures to source-owned components. Require meaningful figure alt text, visible captions when provided, explicit image dimensions/aspect ratio, and a lightbox with Escape, focus restore, and background-scroll control. Redact and strip sensitive metadata from real screenshots before committing them.
- [ ] Wrap actual Markdown tables in a horizontal scroll region while preserving `<table>`, `<th>`, and header associations. Confirm a seven-column table and long terminal output do not expand the page viewport.
- [ ] Run the browser cases in both themes and at narrow and desktop widths. Manually inspect screenshots with small text at full zoom. Run lint, typecheck, and production build.

**Gate:** The test post includes code, a figure, a callout, and a wide table with no data loss from Docusaurus conversion.

### Task 4: Finish theme, accessibility, and first-slice review

**Reviewable deliverable:** The article works in both themes, passes focused automated checks, and has a reviewable visual record.

**Files:** Theme control/provider, CSS tokens, browser tests, `README.md`, and a short PR evidence note or screenshot artifacts.

- [ ] Add a theme control with Light, Dark, and System choices. Persist the preference and avoid a disruptive first-paint flash. Verify dark-mode code, table, callout, focus, and image framing contrast.
- [ ] Add an accessibility smoke test for the article route and interactive controls. Manually check keyboard order, focus visibility, code-copy announcement, image zoom, linked headings, and reduced-motion behavior. Treat automated output as a smoke test, not complete WCAG evidence.
- [ ] Capture narrow phone, tablet, desktop, and wide desktop views in light and dark. Include the difficult content cases from blueprint section 20.3. Record any unresolved visual defect with its viewport and a concrete follow-up.
- [ ] Run one final lint/typecheck/test/build sequence after the last code change. Check article metadata and rendered HTML, then review the diff for accidental secrets, private URLs, and unrelated files.
- [ ] Present the article route, screenshots, exact pinned versions, test output, unsupported authoring constructs, and open migration dependencies for review. The real-post route must satisfy blueprint section 26's acceptance test before calling this slice complete.

**Gate:** Accurate metadata, legible prose, navigable headings, working code copy, an enlargable screenshot, responsive behavior, and no documentation sidebar.

---

## Follow-on plans after the first article slice

These are separate review gates because they touch independent systems. Write detailed task plans against the validated app and legacy inventory, then implement in this order:

1. **Search compatibility probe:** Index two articles and one chapter fixture with the pinned Fumadocs search API. Check exact CVE-like IDs, package names, headings, keyboard operation, and draft exclusion. Fix tokenization only where the probe demonstrates a miss. This precedes the full archive/search UI.
2. **Discovery and archives:** Build the text-led homepage, reverse-chronological `/blog` listing, controlled `/topics` pages, deterministic related posts, RSS, sitemap, robots, canonical and OG metadata. Keep drafts out of every generated output.
3. **Legacy migration and launch:** Use the three-post audit to inventory *all* approved Docusaurus content, assets, URLs, and heading fragments. Convert content with explicit reports for ambiguous constructs; check internal links and images; build a reviewed `old_url,new_url,status,notes` map; test popular deep links. Prepare preview, rollback, and cutover checks. Keep the old deployment recoverable until launch acceptance.
4. **Web ebook reader:** Add validated book/chapter collections, ordered chapter routes, landing page, responsive chapter navigation, previous/next links, and search indexing. Publish one small real book as the acceptance fixture. PDF/EPUB exports remain a later, separate workstream.

## First-slice acceptance checklist

- [ ] A selected real security post is migrated with its code, callout, table, screenshots, metadata, and references intact.
- [ ] Frontmatter validation rejects malformed records and duplicate slugs; drafts are not publicly routed.
- [ ] The article route is prerendered, has accurate canonical and social metadata, and returns 404 for unknown slugs.
- [ ] Reading works at 375 px and wide desktop, in both themes, without page-level horizontal overflow.
- [ ] TOC anchors, code copy, and screenshot zoom work by keyboard and retain sensible focus behavior.
- [ ] Lint, typecheck, focused content/browser tests, and production build pass on the final changes.
- [ ] The review includes screenshots, known limitations, and the unmapped legacy-source/URL work that remains before launch.

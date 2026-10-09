# Portfolio and Publication Implementation Plan

> **For agentic workers:** Implement this plan task by task. Read [blueprint section 28](../../../technical-blog-blueprint.md#28-portfolio-expansion-and-visual-review--10-october-2026), verify current files and installed Next.js guidance, and update `PROGRESS.md` after every checkpoint.

**Goal:** Deliver an author-led personal portfolio and writing site with distinct home and archive layouts, real experience/projects/talks, discoverable résumé and profiles, and an excellent technical article reader.

**Architecture:** Keep the existing Next.js App Router, Fumadocs MDX collection, and server-rendered pages. Use small shared data modules for source-backed portfolio entries and small client components only for interactions. Use the configured shadcn MCP to inspect and adopt necessary components; review ReUI components for compatible additions.

**Tech Stack:** Next.js 16.4.0, React 19.2.8, TypeScript 6.0.3, Tailwind CSS 4.3.3, Fumadocs MDX/Core, shadcn/ui with Radix primitives, Playwright.

**Spec:** [technical-blog-blueprint.md](../../../technical-blog-blueprint.md), especially sections 3–6, 9–16, 18, 22, and 28.

## Global constraints

- Show only verified career, talk, project, and article facts. Avoid a claim that a role is current until confirmed.
- Keep the selected writing visible in the first viewport of the homepage; use real titles and meaningful technical artifacts.
- Keep prose readable at 65–75 characters, preserve article heading links, code copy, TOC, zoom, themes, and server rendering.
- Use source-owned shadcn components selected through MCP. Inspect ReUI registry items, access, and Radix style compatibility before importing source.
- Homepage, archive, article, and Portfolio must share one typography, color, spacing, and interaction system while serving distinct purposes.
- Mobile previews expose the same essential information as desktop hover/focus states. Respect keyboard and reduced-motion behavior.
- Do not configure production domain or DNS changes as part of this implementation.
- `PROGRESS.md` is updated after the verification of every checkpoint, including a concrete result or blocker.

## File map

| Path | Responsibility |
|---|---|
| `src/app/globals.css`, `src/styles/prose.css` | Shared visual tokens, shell, portfolio, archive, and reading typography |
| `src/components/shell/*` | Author identity, responsive navigation, profile links, footer, theme control |
| `src/components/home/*`, `src/app/page.tsx` | Authored homepage and selected writing/project/talk compositions |
| `src/components/writing/*`, `src/app/blog/page.tsx` | Distinct editorial archive and article previews |
| `src/lib/portfolio.ts`, `src/app/portfolio/**` | Source-backed experience, project, and talk routes |
| `src/app/resume/page.tsx`, `public/resume.pdf` | Printable and downloadable résumé using reviewed public facts |
| `src/app/search/page.tsx`, `src/app/rss.xml/route.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` | Search, feed, and discovery from published content only |
| `tests/content/*`, `tests/e2e/*` | Data and browser behavior checks for the new routes and accessibility |
| `PROGRESS.md`, `README.md`, `THIRD_PARTY_NOTICES.md` | Checkpoint evidence, usage guidance, and adopted component provenance |

---

### Checkpoint 0: Plan and source inventory

**Deliverable:** A documented source-backed implementation scope and progress ledger.

- [ ] Confirm the changed blueprint and current worktree; read installed Next.js docs for the route and metadata conventions used below.
- [ ] Record the source-backed portfolio facts and unresolved current-role/résumé data in `PROGRESS.md`.
- [ ] Inventory available shadcn MCP items and compatible ReUI components before choosing any source to install.
- [ ] Mark checkpoint 0 complete in `PROGRESS.md` with source and component evidence.

### Checkpoint 1: Identity, navigation, and design system

**Deliverable:** A recognizable author identity and accessible shell in both themes.

- [ ] Add a browser check that fails when the full author name, Writing/Portfolio links, and GitHub/LinkedIn/Résumé links are missing or cannot be navigated by keyboard.
- [ ] Select and inspect the smallest shadcn navigation and mobile control primitives through MCP; add them without replacing the server-rendered article body.
- [ ] Replace the `PM.` mark with the full name, add visible profile links, and build responsive navigation.
- [ ] Set a deliberate display and reading type system, warm neutral palette, focus treatment, and reduced-motion behavior; retain existing technical-content contrast.
- [ ] Run focused browser checks, lint, and typecheck, then update `PROGRESS.md` with results.

### Checkpoint 2: Home and writing archive

**Deliverable:** A personal homepage with selected writing and a distinct, scannable archive.

- [ ] Add browser checks for a homepage first viewport containing author introduction and selected article, plus separate archive structure and mobile visibility of article preview material.
- [ ] Build the homepage composition around the actual DevTools article and an accurate technical artifact or excerpt, with a selected The Security Diff project and speaking preview.
- [ ] Build an editorial article-row component with date, title, summary, topic/type, and a supporting preview where real media exists. The archive lists only published posts and provides an honest one-article state until more posts migrate.
- [ ] Align article title, prose, code, tables, figures, captions, and TOC with the new visual system; retain existing behavior checks.
- [ ] Run focused checks and visual captures at phone and desktop widths in light and dark; update `PROGRESS.md`.

### Checkpoint 3: Portfolio experience, projects, and talks

**Deliverable:** Shareable Portfolio routes with real career, project, and speaking material.

- [ ] Add tests for source data ordering, valid external URLs, and route navigation to experience, project, and talk entries.
- [ ] Create `src/lib/portfolio.ts` with the sourced historical experience and talks from `pankajmouriya.com`, and The Security Diff as a verified selected project. Represent ambiguous current dates conservatively.
- [ ] Build `/portfolio`, `/portfolio/projects`, and `/portfolio/talks` with accessible route links styled as a compact section strip, semantic dates, and available resource links.
- [ ] Inspect ReUI's Radix-compatible free timeline and any selected shadcn components before incorporating them; document provenance and license in `THIRD_PARTY_NOTICES.md`.
- [ ] Run data, browser, lint, and typecheck checks; update `PROGRESS.md` with results and the remaining fact checks.

### Checkpoint 4: Discovery, metadata, résumé, and legacy routes

**Deliverable:** Published work can be found and syndicated; a sourced résumé can be opened and downloaded.

- [ ] Add failing route checks for published-only search, RSS, sitemap, robots, résumé, metadata, and the selected legacy URL mapping.
- [ ] Implement accessible search over published article titles, summaries, headings, and technical body text, with a no-results state and keyboard access. Keep drafts out of all public indexes.
- [ ] Generate RSS, sitemap, and robots from the published collection; add canonical and social metadata for home, archive, portfolio, and resume.
- [ ] Build an HTML résumé from source-backed facts and generate a PDF artifact from it. Confirm page rendering, selectable text, and no unsupported current-role claim.
- [ ] Preserve the verified legacy DevTools URL with a permanent route mapping after confirming its hosted behavior; record remaining migration URLs separately.
- [ ] Run route checks, lint, typecheck, and build; update `PROGRESS.md`.

### Checkpoint 5: Accessibility, responsive visual review, and final verification

**Deliverable:** A documented, reviewable local site with functional and visual evidence.

- [ ] Capture and inspect home, archive, reader, and portfolio at 375 px and desktop in light and dark themes in one review round. Fix material overflow, contrast, spacing, or focus defects found, then confirm in one follow-up round.
- [ ] Keyboard-check navigation, search, article links, copy, zoom, and portfolio route links. Check focus visibility, semantic landmarks, reduced motion, and 200% zoom.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, `PLAYWRIGHT_CHANNEL=chrome npm run test:browser`, and `npm run build` after final edits. Inspect route output and generated public artifacts.
- [ ] Update `README.md`, `PROGRESS.md`, and component provenance with final results, known content limitations, and local URLs. Report visual review and technical verification separately.

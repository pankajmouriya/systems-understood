# Technical Writing Platform: Design and Implementation Blueprint

> **Status:** Content foundation implemented; visual direction under review; personal portfolio scope added  
> **Document version:** 1.2  
> **Prepared:** 10 October 2026  
> **Scope:** Personal portfolio and technical/security writing, including experience, conference talks, maintained projects, resume, long-form research, tutorials, and occasional multi-chapter ebooks  
> **Primary decision:** Next.js + Tailwind CSS + shadcn/ui

---

## 0. Executive summary

Build an original, content-first engineering publication to replace the current Docusaurus documentation-themed site. The new experience should feel like an intentional magazine for developers and security engineers, **not documentation software with the sidebar hidden**.

**Current brief:** a polished personal portfolio with writing as the main attraction. Include experience, conference talks, maintained projects, a resume, and GitHub/LinkedIn links. [Section 28](#28-portfolio-expansion-and-visual-review--10-october-2026) consolidates the portfolio requirements, critique of the current implementation, updated reference priorities, alternative directions, and the recommended author's studio treatment. It governs the next design pass where earlier publication-only guidance differs.

The guiding combination is:

- **Fly.io:** serious, engaging, long-form technical writing.
- **Linear:** restraint, disciplined visual hierarchy, polished navigation and spacing.
- **Tailwind Spotlight:** personal publication structure, strong typography and clean article archives.
- **Vercel / Supabase:** pragmatic developer content patterns, readable technical examples, structured discovery.

The implementation will use **Next.js App Router, TypeScript, Tailwind CSS v4 and shadcn/ui**. Use the **shadcn MCP server** to discover, inspect and add suitable registry components and blocks to the project; adapt the installed source to the publication's design. Author articles in local Markdown/MDX committed to Git. Use **Fumadocs MDX as a headless content-processing layer** for typed content, headings, table of contents and search-related structured data, **not** for its default documentation shell. Build the editorial layouts and navigation independently.

**Primary design priority:** writing quality across the personal homepage, archive, and article reader. The first implementation established the article mechanics; the next visual proposal must consider these surfaces and Portfolio together. Continue to test long-form reading with a real post containing complex code snippets, terminal output, wide screenshots, diagrams, callouts, citations and footnotes. The earlier 5,000-word content target remains a reader validation requirement, not a reason to defer the personal identity and composition work in section 28.

### Decisions at a glance

| Area | Chosen approach | Notes |
|---|---|---|
| Framework | Next.js App Router, stable release | TypeScript and React Server Components where appropriate |
| Styling | Tailwind CSS v4 | CSS variables and minimal custom CSS |
| Components | shadcn/ui via its MCP registry workflow | Discover and add source-owned components and suitable blocks as screens need them |
| Content authoring | Markdown and MDX | Git-first; content reviewed through pull requests |
| Content engine | Fumadocs MDX + Fumadocs Core | Type-safe collections and extracted TOC; no Fumadocs docs layout |
| Code highlighting | Fumadocs MDX's Shiki-based pipeline | One syntax-highlighting pipeline in v1; custom presentation |
| Interactive code stories | Code Hike, optional later | Add only for articles that genuinely need it |
| Alternative code frames | Expressive Code, evaluated later | Do not run alongside another code processor on the same fences |
| Search | Fumadocs self-hosted search, wrapped in a custom command dialog | Use the supported engine/API in the installed version |
| Ebooks | MDX chapter collections and a dedicated reader | Web-first; PDF/EPUB export as a separate phase |
| Media | Repo-local optimized images initially | Width-aware screenshot viewer and proper captions |
| Theming | Light first, dark supported | Persistent theme preference; system setting available |
| Hosting | Vercel as recommended initial deployment | Prerender public articles; retain Next runtime for search/redirects |
| CMS / database | None initially | Avoid adding operational complexity without a concrete need |

### Success definition

A reader can find an article, read it comfortably on phone or desktop, copy and understand code, enlarge a screenshot, navigate headings, verify linked references and move to related content without fighting the interface. An author can publish a new article by adding one MDX file and its assets, with build-time validation and a preview deployment.

---

## 1. Background, user needs and scope

### 1.1 Existing situation

The current site uses the Docusaurus documentation theme. This is a good documentation tool but has an information architecture and visual language optimized for product manuals: dense nav structures, persistent documentation chrome and topic trees. It is a less natural default for essays, incident analyses and independent engineering writing.

**Migration objective:** retain the strengths of Markdown authoring and navigability while making the experience calmer, more recognizable and more pleasurable for long-form reading.

### 1.2 Primary content types

1. **Engineering essay:** architecture, implementation decisions, performance, deployment or developer tooling.
2. **Security research:** incident reconstruction, vulnerability deep dive, supply-chain case study, investigation methodology, mitigations and references.
3. **Hands-on tutorial:** commands, configuration snippets, expected output, screenshots and troubleshooting.
4. **Field notes:** shorter operational observations or lessons learned.
5. **Ebook / series:** ordered chapters, persistent book navigation, chapter progress and potentially downloadable editions.

### 1.3 Reader jobs

- Scan the title, description, date and estimated reading time and decide whether to continue.
- Read lengthy text with comfortable width and line spacing.
- Distinguish commands, configuration files, expected output and error output.
- Copy commands with one click, while still being able to select text manually.
- Zoom in on screenshots without opening external files or losing place in the article.
- Jump to a specific heading and share the exact section URL.
- Search an archive for a CVE, package name, technique, tool or topic.
- Understand whether technical findings are historical, current, fixed or superseded.
- Follow chapters sequentially in an ebook without returning to a listing page.

### 1.4 Non-goals for the first release

- Reimplementing a complete Docusaurus documentation system.
- A full headless CMS, collaborative rich-text editor or author dashboard.
- User accounts, comments, gamification, memberships or paid subscriptions.
- Heavy animated hero sections, mandatory post thumbnails or marketing-style card grids.
- Dynamic production execution of untrusted code snippets.
- Auto-generated PDF/EPUB that tries to exactly mirror interactive MDX on day one.

---

## 2. Design references and what to borrow

These are **design references, not templates to clone**. Recreate the underlying principles and interaction patterns, not protected brand assets or distinctive artwork.

| Reference | Study closely | Borrow | Avoid copying |
|---|---|---|---|
| [Fly.io Blog](https://fly.io/blog/) | Long-form article pages, technical storytelling, media in essays | Reading-led layout, restrained chrome, confident prose | Brand-specific typography, graphics and illustration system |
| [Linear Now](https://linear.app/now) | Spacing, navigation, type scale, image composition | Discipline, polished hierarchy, subtle surface contrast | Excessive dark/product-marketing treatment of article prose |
| [Vercel Engineering](https://vercel.com/blog/category/engineering) | Developer blog organization, technical examples | Metadata, categorized technical content, code-oriented layouts | Generic corporate case-study structure |
| [Supabase Blog](https://supabase.com/blog) | Engineering/security categories and discovery | Clear taxonomy and predictable archives | Overly promotional page elements |
| [Spotlight](https://tailwindcss.com/plus/templates/spotlight) | Personal writing archive and author identity | White space, personal brand presence, post lists | Treating a paid theme as an unrestricted source; review its license |
| [AstroPaper](https://github.com/satnaing/astro-paper) | Blog feature completeness | Search, tags, footnotes, lightbox concepts | Its Astro implementation (we have selected Next.js) |
| [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) | Ultra-lean technical writing | Reduced navigation and fast content discovery | Constraining every long-form post to its minimal aesthetic |

### 2.1 Existing blocks and component references

| Resource | Specific inspiration | Intended reuse |
|---|---|---|
| [Shadcnblocks Blog Post](https://www.shadcnblocks.com/blocks/blog-post) | Blogpost 2: sticky sidebar | Inspiration for article shell |
| [Shadcnblocks Blog Post](https://www.shadcnblocks.com/blocks/blog-post) | Blogpost 8: sidebar TOC | Inspiration for heading navigation |
| [Shadcnblocks Blog Post](https://www.shadcnblocks.com/blocks/blog-post) | Blogpost 10: reading progress | Optional subtle reading control |
| [Shadcnblocks Blog Post](https://www.shadcnblocks.com/blocks/blog-post) | Blogpost 6: chapter list | Ebook navigation patterns |
| [Shadcnblocks Blog](https://www.shadcnblocks.com/blocks/blog) | Featured and categorized post sections | Inspiration for homepage/archive composition |
| [Tailark](https://tailark.com/) | Site navigation and low-noise hero patterns | Borrow spacing/composition ideas, not large marketing pages |
| [Origin UI](https://originui.com/) | Inputs, controls and navigation details | Search control and smaller interaction details |
| [shadcn/ui](https://ui.shadcn.com/docs) | Components under direct source-code ownership | Dialog, Sheet, Tooltip, Tabs, Separator, Button, Badge, etc. |
| [shadcn MCP](https://ui.shadcn.com/docs/mcp) and [official blocks](https://ui.shadcn.com/blocks) | Registry search, source inspection and installation | Start from available components and blocks, then adapt composition to the article reader |

**Registry rule:** the standard shadcn/ui registry needs no extra `components.json` entry. Add third-party registry namespaces only after checking their source, dependencies, access and license. A visual reference such as Shadcnblocks is not automatically an installable shadcn MCP item. Public demos are not automatic permission to reproduce paid implementation source. Maintain a `THIRD_PARTY_NOTICES.md` file as needed.

---

## 3. Product identity and design principles

### 3.1 Identity

Working identity: **a modern engineering and security publication**. It should feel like an engineer's carefully edited notebook, not a SaaS landing page or enterprise documentation portal.

Tone: precise, curious, technically credible and restrained. Decorative elements should support content, not compete with it.

### 3.2 Seven design principles

1. **Reading beats decoration.** Prose gets the highest attention budget.
2. **Technical material is first-class.** Code, console output, diagrams and screenshots are native content, not awkward attachments.
3. **Progressive disclosure.** Only show sidebars, controls and secondary information where useful.
4. **Consistency without sameness.** Article, tutorial and ebook layouts share tokens, but handle their unique navigation needs.
5. **Legible in both themes.** No novelty dark mode that makes long prose harder to read.
6. **Fast and accessible by default.** Server-rendered content with minimal client JavaScript.
7. **Authoring remains simple.** Common writing tasks should not require React knowledge.

### 3.3 What not to design

- No documentation sidebar on ordinary blog posts.
- No full-screen animated hero or heavy gradient wallpaper.
- No article cards that rely on cover images to be understandable.
- No more than one prominent accent color in the core UI.
- No sticky elements that squeeze the prose on tablet or mobile.
- No forced newsletter popups or intrusive progress animations.

---

## 4. Information architecture and routes

### 4.1 Proposed sitemap

```text
/
/blog
/blog/[slug]
/topics
/topics/[topic]
/books
/books/[bookSlug]
/books/[bookSlug]/[chapterSlug]
/about
/search                 (optional URL; search dialog is the primary entry)
/rss.xml
/sitemap.xml
/robots.txt
```

**Important migration qualification:** these are recommended routes for the new system. If Docusaurus already has indexed URLs, keep their exact public paths where practical or provide permanent redirects. Do not casually change an existing URL simply to match this sitemap.

### 4.2 Primary navigation

Desktop: Logo/site name | Writing | Topics | Books | About | Search | Theme toggle.

Mobile: Logo | Search | Menu. Keep the menu short; never render the full desktop table of contents alongside the mobile menu.

### 4.3 Homepage

A calm, editorial homepage with:

1. Name and one-sentence focus (technical engineering and security writing).
2. One featured article (text-first; optional supporting image).
3. A vertical list of recent articles with dates, descriptions and tags.
4. An optional compact section for ongoing research series or books.
5. A modest author/about section and social/RSS links.

**Prefer a text-led list over a three-across grid of large image cards.** A collection of diverse technical topics rarely has consistently high-quality cover art.

### 4.4 Blog listing

- Reverse-chronological default.
- Featured items separated from the main feed, but not repeated awkwardly.
- Filter by topic or type, with URL state for shareability.
- Optional search shortcut; no database filtering required initially.
- Pagination after a sensible number of posts (e.g., 10-15), not an endless feed by default.
- Each list item: title, short summary, date, reading time and 1-3 relevant tags.

### 4.5 Topic system

Use a controlled vocabulary. Initial candidates:

- Application Security
- Vulnerability Research
- Supply Chain Security
- Cloud Security
- Containers & Kubernetes
- DevSecOps
- Engineering
- Tools & Automation

The UI can display friendly labels while frontmatter stores stable slugs such as `supply-chain-security`. Avoid uncontrolled near-duplicates such as `cloud`, `aws-cloud` and `cloud-security` unless deliberate.

---

## 5. Page layouts

### 5.1 Editorial article: default template

```text
+--------------------------------------------------------------------------------+
| Logo                        Writing  Topics  Books       Search  Theme          |
+--------------------------------------------------------------------------------+
|                                                                                |
|                  SECURITY RESEARCH    12 MIN READ     2026-10-10               |
|                  Anatomy of a Supply-Chain Attack                              |
|                  A clear 1-2 sentence description                              |
|                  Author / last reviewed / topic tags                          |
|                                                                                |
|              +-----------------------------------------+    +---------------+   |
|              | Main prose (comfortable reading width)  |    | ON THIS PAGE  |   |
|              |                                         |    | Overview      |   |
|              | Paragraphs, headings, figures,         |    | Investigation |   |
|              | citations, equations, callouts          |    | Detection     |   |
|              |                                         |    | References    |   |
|              +-----------------------------------------+    +---------------+   |
|           [Wide code / screenshots may expand beyond prose column]           |
|                                                                                |
|                  References / updated status / related articles                |
+--------------------------------------------------------------------------------+
```

**Layout decisions:**

- Article title and summary get a wider but still readable title width.
- Content column target: ~68-76 characters; approximately 700-760 px at the chosen font metrics.
- Main prose has no left documentation sidebar.
- A TOC rail appears at wider desktop breakpoints only when the article has enough headings.
- Hide/collapse right rail on tablet; provide an inline TOC or a compact 'On this page' control when useful.
- Wide tables/screenshots/code may opt into a media-width container (approximately 960-1120 px) without pushing the body prose wider.
- Ensure anchor links account for the sticky top bar with CSS `scroll-margin-top`.

### 5.2 Tutorial / lab template

Same article foundation with optional additional components:

- Prerequisites and expected outcome box.
- Tested versions and environment note.
- Numbered steps and filename-aware code fences.
- Command, expected output and troubleshooting variants.
- Screenshot figures that can be enlarged.
- Copyable configuration snippets and warnings when a step is destructive.
- Optional repository link and reproducibility date.

### 5.3 Security research template

Introduce metadata without turning the page into a vulnerability scanner dashboard:

- Publication date, last reviewed date, affected technologies.
- CVE identifiers (if applicable), severity and advisory/source links.
- Disclosure status, vendor response or fix status (if appropriate).
- Short 'What this means' and 'Affected scope' summaries.
- Optional incident/disclosure timeline.
- Defensive detection and mitigation sections.
- Clear distinction between observed evidence, inference and hypothesis.
- Redaction policy for screenshots, logs, secrets and customer information.

Avoid colored severity badges everywhere; severity color should convey actual risk, not decorate labels.

### 5.4 Ebook reader template

```text
+--------------------------------------------------------------------------------+
| Logo                         Books / Book title                      Search     |
+--------------------------------------------------------------------------------+
| CHAPTERS                    | CHAPTER CONTENT                  | ON THIS PAGE    |
| 01 Introduction             | Chapter title                     | Section A       |
| 02 Foundations              | Reading column                    | Section B       |
| 03 Hands-on Lab   [active]  | Code + figures                    | Section C       |
| 04 Investigation            |                                    |                 |
| 05 Mitigation               |                                    |                 |
|                             | Previous chapter  Next chapter     |                 |
+--------------------------------------------------------------------------------+
```

- Desktop: left chapter navigation, central reading column, optional right section TOC only when there is enough horizontal room.
- Tablet: chapter navigation collapses; section TOC becomes inline or popover.
- Mobile: a clear 'Chapters' button, chapter label and previous/next controls.
- Book home: cover or tasteful hero, description, intended audience, prerequisites, estimated total time, complete ordered chapter list.
- Stable chapter URLs, keyboard navigation and sensible focus behavior.
- Persist reading progress locally only after explicit implementation/UX evaluation; never make progress tracking a prerequisite for reading.

---

## 6. Visual system and design tokens

These are **starting specifications for implementation**, not immutable brand colors. Validate contrast and content screenshots before freezing tokens.

### 6.1 Visual direction

Light theme first, resembling natural paper rather than glaring pure white. Dark theme uses a neutral slate/near-black background and warm light body text. Accent colors should be modest and primarily reserved for links, active TOC items and meaningful interactions.

| Token | Light starting value | Dark starting value | Usage |
|---|---|---|---|
| `--background` | `#FAFAF8` | `#111316` | Global page |
| `--foreground` | `#202226` | `#ECEDEA` | Primary text |
| `--surface` | `#FFFFFF` | `#191C20` | Popovers, controlled surfaces |
| `--muted` | `#61666C` | `#A5ABB1` | Metadata and secondary text |
| `--border` | `#E7E7E3` | `#30343A` | Quiet separators |
| `--accent` | `#315EAA` | `#8CAFF0` | Links, focus and active elements |
| `--code-bg` | `#F2F3F4` | `#181A1F` | Code or terminal containers |
| `--radius` | `0.5rem` | `0.5rem` | Standard non-decorative rounding |

The code renderer may use its own syntax-highlighting palette while preserving a legible border, text and background contrast. Do not use dark terminal blocks for every code example solely for aesthetic effect.

### 6.2 Typography

| Role | Initial range | Notes |
|---|---|---|
| Body | 17-18 px | Generous but not oversized |
| Body line height | 1.7-1.8 | Comfortable for long posts |
| Article title | 42-58 px desktop; 32-40 px mobile | Deliberate responsive scaling |
| H2 | 28-34 px | Distinct, readable rhythm |
| H3 | 22-26 px | Never indistinguishable from H2 |
| Metadata | 12-14 px | Still legible and accessible |
| Code | 13-15 px | Monospace; preserve alignment |
| Content width | ~700-760 px | Tune after rendering real content |
| Wide media | Up to ~1120 px | Independent of prose width |

Suggested typography: a polished system sans or Geist/Inter for UI and prose; a dedicated monospace such as Geist Mono for code. Evaluate a serif article-title experiment only if it strengthens the publication's identity; do not mix too many families.

### 6.3 Rhythm and treatments

- Strong vertical separation between major article sections.
- Dividers only where they clarify structure.
- Links visibly distinguishable without relying on color alone, especially in prose.
- Headings have shareable anchors with subdued hover/focus treatment.
- Quotes use typography and a small border, not thick colorful cards.
- Notes, warnings and danger callouts are semantic and accessible.
- Do not introduce content motion unless meaningful; respect `prefers-reduced-motion`.

---

## 7. Technical architecture

### 7.1 Runtime and rendering

```text
Git repository
  |-- content/blog/*.mdx
  |-- content/books/<book>/*.mdx
  |-- public/images/**
        |
        v
Fumadocs MDX (collection parsing, validation, TOC, structured data)
        |
        v
Next.js App Router (static prerendering of public content)
        |
        +--> Custom React article / tutorial / ebook layouts
        +--> shadcn/ui interaction components
        +--> Fumadocs Core TOC + supported search backend
        +--> Metadata, RSS, sitemap, Open Graph
        |
        v
Vercel deployment (recommended) + CDN
```

**Rendering principle:** use Server Components for article pages, metadata, post lists and data assembly. Add small Client Components only for interactive behavior such as search dialog, mobile drawer, theme switcher, image lightbox and a TOC observer.

**Hosting mode decision:** deploy to a Next.js-capable host such as Vercel, with public content pre-rendered. Do **not** choose Next.js `output: 'export'` as a hard requirement for v1. A pure static export removes server-dependent functionality and changes how redirects, image optimization and search are implemented. Static-only hosting remains a valid future variant if needs change.

### 7.2 Content pipeline

Chosen: `fumadocs-mdx` and `fumadocs-core` for typed collections, headings, TOC and search structures. Build the visual shell from custom Next.js components and shadcn/ui, rather than importing Fumadocs' documentation layouts.

Why this instead of raw `@next/mdx` alone:

- Collection-level metadata and data access.
- Build-time content schema validation.
- Heading/TOC extraction useful for blog and ebook readers.
- Search-ready structured text.
- Less custom plumbing as ebooks and series grow.

`@next/mdx` remains a reasonable fallback if Fumadocs' content abstraction becomes restrictive, but should not be installed as a second competing content compiler without an intentional migration.

**Compatibility checkpoint:** Fumadocs' current releases offer Macro API and Config API variants. The code skeleton below assumes the current documented Macro API and must be checked against the pinned package version before implementation.

### 7.3 Code pipeline: one owner

**v1 choice:** use Fumadocs MDX's built-in Rehype Code/Shiki processing and render it in our custom `CodeBlock` wrapper. Preserve support for syntax highlighting, filename/title, copy button, line highlighting and dark/light tokens.

**Possible v2 evaluation:** `rehype-expressive-code` for terminal/editor frames and richer markers. If selected, explicitly replace or disable the default transform for those fences so code isn't processed twice. Code Hike can be introduced for opt-in interactive walkthrough components only after testing its compatibility with the active MDX compiler and bundler.

Do not promise that all three tools will automatically coexist; they overlap in responsibilities.

### 7.4 Search

- Global `Cmd/Ctrl + K` shortcut plus visible accessible search affordance.
- One search surface for blog posts and ebook chapters; typed result labels indicate content type.
- Search title, description, headings and body, including exact technical tokens where possible.
- Prefer Fumadocs Core's supported self-hosted search API; the current official documentation describes a ZBSearch-backed option. Use the engine and client APIs bundled with the installed version rather than copying old Orama examples.
- Search should be testable on actual strings such as CVE IDs, package names and camel-cased tool identifiers. Tokenization may require a technical-term normalization strategy.
- Exclude drafts and private content from the index.
- A Pagefind alternative is viable **only** if the deployment/build pipeline generates inspectable static HTML and indexes it after the build. Pagefind is not simply a plug-in to any runtime Next.js deployment.

### 7.5 Storage and publication

- Keep original text in Git; store screenshots/diagrams in the repository initially.
- No CMS for v1.
- Published posts should have immutable stable slugs where practical.
- Use Git pull requests and preview builds to review both writing and layout.
- Large media or downloadable book exports can move to object storage/CDN when it materially improves cost or repository size.

---

## 8. Suggested project structure

```text
engineering-publication/
├── content/
│   ├── blog/
│   │   ├── supply-chain-attack.mdx
│   │   └── container-cve-triage.mdx
│   ├── books/
│   │   └── container-security/
│   │       ├── index.mdx
│   │       ├── 01-introduction.mdx
│   │       ├── 02-image-anatomy.mdx
│   │       └── 03-vulnerability-triage.mdx
│   └── taxonomies.ts
├── public/
│   ├── images/
│   │   ├── blog/
│   │   └── books/
│   └── downloads/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── topics/
│   │   │   ├── page.tsx
│   │   │   └── [topic]/page.tsx
│   │   ├── books/
│   │   │   ├── page.tsx
│   │   │   └── [bookSlug]/
│   │   │       ├── page.tsx
│   │   │       └── [chapterSlug]/page.tsx
│   │   ├── api/search/route.ts
│   │   ├── rss.xml/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn source components
│   │   ├── shell/              # SiteHeader, Footer, MobileNav
│   │   ├── articles/           # ArticleHeader, ReadingRail, Figure, CodeBlock
│   │   ├── books/              # BookNav, ChapterFooter, BookProgress
│   │   ├── mdx/                # MDX component mappings and semantics
│   │   └── search/             # SearchDialog and result presentation
│   ├── lib/
│   │   ├── source.ts           # Fumadocs MDX collections (illustrative)
│   │   ├── content.ts          # data selectors and filtering
│   │   ├── seo.ts              # URLs, JSON-LD, metadata helpers
│   │   ├── reading-time.ts
│   │   ├── redirects.ts        # migration map, if generated
│   │   └── utils.ts
│   └── styles/
│       └── prose.css
├── scripts/
│   ├── audit-content.ts
│   ├── check-internal-links.ts
│   └── migrate-docusaurus.ts  # optional one-time tool
├── tests/
│   ├── e2e/
│   └── fixtures/
├── next.config.mjs
├── source.config.ts            # only if Config API is chosen over Macro API
├── components.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

This is a target structure, not a claim that all files already exist. In implementation, choose **Macro API OR Config API** for each content collection; do not create both paths merely because the tree illustrates both options.

---

## 9. Content model and MDX authoring contract

### 9.1 Blog frontmatter

Recommended schema (illustrative values):

```yaml
---
title: "Anatomy of a Supply-Chain Attack"
description: "Investigating package compromise from installation to detection."
slug: "anatomy-of-a-supply-chain-attack"
date: "2026-10-10"
updated: "2026-10-10"
author: "Site author"
draft: false
featured: false
kind: "research"             # essay | tutorial | research | note
tags:
  - supply-chain-security
  - application-security
series: null
cover: null                  # optional; no mandatory thumbnail
canonicalUrl: null            # optional; for imported/cross-posted content
security:
  advisoryIds: []             # e.g. CVE IDs, if applicable
  reviewedOn: "2026-10-10"
  status: "historical"       # optional: investigating | active | fixed | historical
---
```

**Validation rules:** `title`, `description`, `slug`, `date`, `draft`, `kind` and `tags` are required. `slug` is unique and stable; `date` is parseable; `tags` come from the declared taxonomy; `updated` cannot precede `date`. A draft never appears in public lists, search, RSS or sitemap. `security` fields are optional and should be validated only if present.

Use a schema library such as Zod, integrated through the content collection layer. Keep editorial fields generic; not every article is a CVE advisory.

### 9.2 Ebook frontmatter

Book home (`index.mdx`):

```yaml
---
title: "Practical Container Security"
slug: "container-security"
description: "A hands-on guide to understanding and triaging image risk."
status: "in-progress"       # draft | in-progress | complete
published: "2026-10-10"
updated: "2026-10-10"
draft: false
level: "intermediate"
cover: null
---
```

Chapter file:

```yaml
---
title: "Investigating Vulnerability Findings"
slug: "vulnerability-triage"
order: 3
book: "container-security"
draft: false
---
```

Use metadata `order` rather than relying solely on numeric filename prefixes. Validate missing, duplicated or skipped chapters according to the desired book policy. A book's declared publication state and each chapter's draft state both control public visibility.

### 9.3 Authoring conventions

- Write standard Markdown for basic content; introduce JSX/MDX components sparingly.
- Prefer ordinary fenced code blocks over custom JSX code blocks for simple examples.
- Store post-specific assets in clearly named subdirectories.
- Every figure should have meaningful alt text; image captions are visible when they add information.
- Use descriptive heading IDs where permanence matters; protect anchor links during migration.
- Prefer reference links/citations with stable URLs to vague 'click here' copy.
- Include a testing environment/version note when commands depend on versions.
- Do not embed unreviewed third-party scripts in MDX.
- Avoid executing MDX from untrusted sources; MDX may contain JavaScript/React constructs.

### 9.4 Example post body

````mdx
## Why this matters

A short explanation of the risk and the scope of the observation.

<Callout type="note" title="Environment">
  This walkthrough uses a disposable test environment. Outputs are illustrative.
</Callout>

## Inspect the dependency tree

```bash title="terminal"
npm ls axios
```

<Figure
  src="/images/blog/supply-chain/dependency-tree.webp"
  alt="Example dependency tree showing a transitive package relationship"
  caption="Example dependency structure in the test project."
/>

## Findings

A conclusion with linked evidence and next steps.
````

The exact fenced-code title syntax and `<Callout>` / `<Figure>` props are **proposed authoring APIs**. They need to be standardized against the chosen renderer in the implementation spike. The example is a target developer experience, not guaranteed drop-in source code.

---

## 10. Component inventory and contracts

### 10.1 Layout and navigation

| Component | Responsibility | Priority |
|---|---|---|
| `SiteHeader` | Site identity, primary navigation, search trigger, theme | P0 |
| `SiteFooter` | About, RSS, social links, copyright | P0 |
| `MobileNav` | Accessible drawer/menu | P0 |
| `PostListItem` | Text-led metadata-rich archive item | P0 |
| `ArticleHeader` | Title, summary, date, author, status | P0 |
| `ArticleLayout` | Prose and responsive TOC framing | P0 |
| `ArticleTOC` | Scroll-aware active heading and accessible anchors | P0 |
| `Breadcrumbs` | Book navigation and deep hierarchies | P1 |
| `ReadingProgress` | Quiet progress indicator | P2 |

### 10.2 Technical content

| Component | Responsibility | Priority |
|---|---|---|
| `CodeBlock` | Language/filename title, Shiki markup, copy, overflow | P0 |
| `TerminalBlock` | A distinct visual variant for commands and output | P1 |
| `Figure` | Captions, alt text, intrinsic dimensions | P0 |
| `ZoomableImage` | Enlarged screenshot view with keyboard exit | P0 |
| `Callout` | Note, tip, warning, danger with semantic structure | P0 |
| `DataTable` | Horizontal overflow and accessible headers | P0 |
| `FileTree` | File/directory structures for tutorials | P1 |
| `Steps` | Sequential lab instructions | P1 |
| `Tabs` | OS/tool-specific steps, accessible controls | P1 |
| `DiffBlock` | Added/removed lines for patches | P1 |
| `ReferenceList` | Sources and external links | P1 |
| `DisclosureTimeline` | Dated findings and vendor actions | P2 |
| `CodeWalkthrough` | Progressive, annotated explanation | P2 |

### 10.3 Ebook components

| Component | Responsibility | Priority |
|---|---|---|
| `BookLanding` | Overview, prerequisites, TOC, chapters | P1 |
| `ChapterSidebar` | Ordered chapter navigation | P1 |
| `ChapterSwitcher` | Previous/next and book home | P1 |
| `ChapterTOC` | In-chapter heading navigation | P1 |
| `DownloadEdition` | PDF/EPUB edition links after export pipeline exists | P2 |

### 10.4 shadcn MCP component and block workflow

For each screen or interaction, ask the shadcn MCP server to search the configured registries for matching components and blocks. Inspect the candidate's source, files, dependencies, behavior and accessibility before adding it. Install the smallest useful item, review the resulting files and dependency changes, then adapt its styles and composition to the publication's tokens. Keep a record of the registry/item name and meaningful local modifications so future updates are deliberate.

Likely primitives to evaluate as screens require them: Button, Dialog/Command, Sheet, Separator, Tooltip, Tabs, Accordion, Badge and Scroll Area. Evaluate official or explicitly configured third-party blocks for site navigation, search, archive and book navigation only when their structure fits the screen. Keep `ArticleLayout`, prose, TOC, code, figures and other MDX semantics source-owned where a registry block does not meet the reading and technical-content requirements.

**Avoid:** installing an entire block library or every shadcn component just to have a bigger UI inventory. A registry block is a starting point for a screen, not a reason to introduce a documentation sidebar or unrelated dashboard chrome.

---

## 11. Code blocks, screenshots and specialized content

### 11.1 Code-block requirements

Mandatory in v1:

- Language-aware syntax highlighting via Shiki.
- Filename or shell label where meaningful.
- Copy button with accessible feedback and keyboard support.
- Comfortable long-line handling: horizontal scroll by default with an optional wrap control when practical.
- Visible focus styles and an accessible contrast ratio.
- Screen-reader-friendly copy and code content.
- Stable formatting for indentation and whitespace.
- A clearly differentiated appearance for shell commands and command output.
- Safe rendering: treat code examples as text, not executable content.

Desirable for v1 if supported by the chosen pipeline:

- Highlighted lines and diffs.
- Collapsible long code blocks.
- Line numbers for code samples where they clarify a discussion.

Explicit later enhancement:

- Synchronized text-and-code walkthroughs with Code Hike.
- Rich terminal/editor frames via Expressive Code after a compatibility spike.

### 11.2 Screenshots and images

- Use `webp` or optimized `png` when screenshot fidelity/text readability warrants it; do not aggressively compress terminal text until illegible.
- Provide image dimensions or a predictable aspect ratio to prevent layout shift.
- Apply a subtle border on screenshots, especially those containing white UI against a white page.
- Permit wider screenshots to break out of the body measure on desktop.
- Show a zoomable lightbox for screenshots; `Esc` closes, focus is restored and background scrolling is controlled.
- Captions identify what the reader is viewing and why it matters.
- Do not crop away important error text, version numbers or terminal columns merely to make thumbnails uniform.
- Redact access tokens, customer data, internal endpoints and identifiers before publishing; image editing must not leave recoverable visible secrets in source files.

### 11.3 Tables and diagrams

- Tables must remain readable when wide: horizontal scroll container with visible overflow affordance on mobile.
- Use true table headers, not div grids masquerading as tables.
- Support Mermaid only after verifying server/browser rendering performance, dark theme and accessibility; exported SVG/PNG diagrams are acceptable for v1.
- Mathematical content (KaTeX/remark-math) is optional; add only when actual articles require it.
- Links and references should not rely on JavaScript to display their essential content.

---

## 12. Search, recommendations and archive behavior

### 12.1 Search UX

- Shortcut `Cmd/Ctrl + K` and visible search trigger.
- Search placeholder: "Search articles, topics, CVEs, tools..."
- Group results by Articles, Books/Chapters and Topics where helpful.
- Keyboard navigation: arrows to select, Enter to open, Escape to close.
- Highlight matching portions where the search engine supports it accessibly.
- Search result card contains title, relevant excerpt, topic and date/type label.
- Show meaningful empty state, not a blank modal.

### 12.2 Relevance acceptance tests

Populate sample articles with known identifiers and verify matches on:

- `CVE-2026-XXXX` / CVE-like patterns.
- `npm audit`, `axios`, `Trivy` and package names.
- `Kubernetes` and `k8s` aliases only if explicitly configured.
- Multiword security terms (`supply chain`, `container image`).
- Chapter titles and code-related headings.

Avoid falsely claiming that a search backend natively handles all technical tokenization. Test and tune it.

### 12.3 Related content

Initial recommendations should be transparent and deterministic:

1. Same series/book, if applicable.
2. Shared primary tags.
3. Recently updated or adjacent technical topics.

No tracking or personalization engine is needed.

---

## 13. Ebook strategy

### 13.1 Why web-first

The primary ebook edition is a set of high-quality web chapters using the same writing system as articles. This avoids maintaining two incompatible writing workflows.

### 13.2 MVP ebook capabilities

- Book landing page with description, audience, chapter inventory and status.
- Ordered chapter routes with stable slugs.
- Desktop chapter sidebar and mobile chapter switcher.
- Prev/next links and clear 'Back to book' action.
- Per-chapter TOC and optional overall estimated reading time.
- Same screenshot, code, callout and reference components as blog posts.

### 13.3 PDF/EPUB exports: separate workstream

PDF/EPUB are **not** automatic because interactive React MDX components, tabs, diagrams and responsive layouts do not translate directly to paginated formats.

Recommended later workflow:

1. Define a print-safe subset/fallback rendering for MDX components.
2. Establish book-specific frontmatter and ordered chapters.
3. Produce a print/PDF layout separately and test tables, page breaks, code and figure captions.
4. Evaluate Quarto or a purpose-built conversion pipeline for PDF/EPUB.
5. Expose downloadable editions only after a human QA pass.

Treat the print export as a publication product, not a `window.print()` button disguised as a proper ebook.

---

## 14. SEO, discovery and metadata

- Every published article has title, unique meta description, canonical URL and Open Graph metadata.
- Next.js `generateMetadata` derives post-level metadata from validated frontmatter.
- Use `Article` or `BlogPosting` JSON-LD only when fields are accurate; ebook pages may use appropriate structured data with caution.
- Generate sitemap and RSS from published content only.
- Published/updated timestamps should reflect editorial reality, not every rebuild timestamp.
- No accidental duplicate pages from new and old paths; redirects and canonical tags should agree.
- Stable semantic heading IDs with deep-link support.
- Proper `robots.txt`, favicons, social image fallback and per-article OG image strategy.
- Keep posts discoverable even when JavaScript is disabled.
- Links to external references should have descriptive names and sensible opening behavior.

**Image strategy:** prefer a generic editorial OG card with title/topic instead of forcing every post to have custom illustration. Generate OG images using Next metadata facilities only when the deployment mode supports the chosen method reliably.

---

## 15. Accessibility and mobile design

### 15.1 Minimum bar

Target WCAG 2.2 AA behavior for core reading and navigation experiences, with automated checks plus keyboard/screen-reader spot tests.

- Landmarks (`header`, `main`, `nav`, `article`, `footer`) and a skip-to-content link.
- Accessible focus visible on all interactive controls.
- Search dialog focus trap and proper return focus.
- Theme toggle with discernible accessible label.
- Screenshot lightbox with Escape, focus management and alt text.
- Code-copy button announces action/result appropriately.
- Active TOC cannot rely exclusively on color.
- Tables have proper `th` and horizontal scroll behavior.
- All reading content readable at 200% zoom without losing content.
- Motion limited and disabled according to reduced-motion preferences.

### 15.2 Responsive rules

| Width context | Reading layout | Navigation |
|---|---|---|
| Narrow phone | Single column; comfortable side padding; code scrolls horizontally | Compact top bar, Search and Menu |
| Tablet | Single main article column; inline TOC as needed | Condensed header |
| Desktop | Centered prose plus right TOC when space permits | Full top navigation |
| Wide desktop ebook | Left chapter rail, reading column, optional right TOC | Full header |

Do not force three persistent columns at widths where content would become narrow or squashed.

---

## 16. Performance and quality budgets

### 16.1 Targets

| Metric | Target | Measurement |
|---|---|---|
| Largest Contentful Paint (LCP) | <= 2.5 s at p75 mobile | Real-user data when available |
| Interaction to Next Paint (INP) | <= 200 ms at p75 | Real-user data when available |
| Cumulative Layout Shift (CLS) | <= 0.1 at p75 | Real-user data when available |
| Lighthouse Accessibility | Aim for >= 95 on representative pages | Lab audit, not proof of full accessibility |
| Lighthouse SEO | Aim for >= 95 | Lab audit plus manual checks |
| Article JS | Minimize; no client-side MDX rendering by default | Bundle analyzer |

### 16.2 Performance practices

- Render articles server-side or prerender them at build time.
- Avoid converting the entire article shell into a Client Component.
- Use `next/font` or another intentional self-hosted font strategy to reduce layout shifts.
- Give images explicit sizing; lazy-load non-critical media.
- Defer search dialog logic until used if practical.
- Prefer CSS for transitions and layout; no general-purpose animation dependency by default.
- Audit the actual heaviest post (screenshots, code, tables, diagrams), not just the empty homepage.
- Test mobile connection and mid-range devices, not exclusively a fast workstation.

---

## 17. Security and editorial controls

This platform will publish security content, so the editorial pipeline needs safety checks beyond typography.

### 17.1 Content hygiene

- Never publish production secrets, private keys, working tokens, unredacted customer information or confidential logs.
- Run automated secret detection in CI on new MDX and media metadata where possible.
- Review code examples for accidental destructive commands; mark risky actions clearly.
- Strip sensitive EXIF/metadata from publicly published screenshots.
- Validate external links and downloads without performing untrusted remote execution.
- Explain when code is a safe demonstration versus a production-ready recommendation.
- Maintain a correction/update note for historical security findings.

### 17.2 Platform security

- Keep `content/` trusted and version-controlled. Do not accept public arbitrary MDX and compile it unsandboxed.
- Configure a tested Content Security Policy appropriate to Next.js, theme, search and image requirements; use report-only rollout where necessary.
- Prefer minimal third-party embeds and analytics; avoid marketing pixels by default.
- Keep Next.js, React, MDX tooling and dependencies patched.
- Configure HTTPS and appropriate security headers in the deployment environment.
- Publish only approved download artifacts; scan ebook archives before release.

---

## 18. Docusaurus migration plan

### 18.1 Pre-migration inventory

Export or enumerate:

- All existing public URLs and their canonical values.
- Markdown/MDX files and frontmatter fields.
- Admonitions (`:::note`, `:::tip`, `:::warning`, etc.).
- Tabs, code-block metadata, imports and custom components.
- Heading anchors, internal links, relative links and local images.
- Static assets and image references.
- Sidebar/category definitions and any versioned-doc structure.
- Search-indexed pages with external backlinks or meaningful traffic.
- RSS, sitemap, robots, redirect and analytics settings.

### 18.2 Content conversion rules

| Docusaurus feature | New-system handling |
|---|---|
| Markdown paragraphs/headings/lists | Preserve verbatim where valid |
| `:::note`, `:::warning`, etc. | Convert to canonical `<Callout>` or supported directive syntax |
| Docusaurus `Tabs` / `TabItem` | Map to custom accessible shadcn Tabs wrapper where needed |
| Code fence titles/highlights | Normalize to selected Shiki renderer syntax |
| Relative links | Resolve against new route map and validate |
| Image paths | Move or preserve in `public/images`; update references |
| Sidebar category metadata | Convert to topic taxonomy, series or ebook chapters as appropriate |
| Generated TOC IDs | Compare actual old/new IDs and preserve explicit anchor aliases where needed |
| Versioned docs | Decide if archival books/series or separate legacy routes are necessary |

The conversion script should automate predictable changes while reporting ambiguous constructs for manual review; never silently drop embedded MDX components.

### 18.3 URL preservation policy

1. Produce a CSV inventory: `old_url,new_url,status,notes`.
2. Preserve the exact old path when doing so is reasonable.
3. When changing the path, configure a permanent redirect on the Next.js-capable deployment.
4. For historical links with `#heading`, verify the target anchor still exists (HTTP redirects do not reliably rewrite fragment IDs on the server).
5. Update internal links to final canonical URLs; do not rely on your own redirects indefinitely.
6. Validate the redirects and update RSS/sitemap after deployment.
7. Keep a legacy route/redirect map in version control.

### 18.4 Migration verification

- Zero high-value URLs lost or incorrectly mapped.
- Zero broken local images on migrated posts.
- No dropped code fences or callouts.
- Long code blocks, tables and screenshots manually reviewed.
- Old popular deep links and anchor links tested.
- Post titles, descriptions, publish dates and metadata preserved.
- Search finds known articles by technical keywords.
- Docusaurus remains rollback option until cutover is accepted.

### 18.5 Rollback

Keep the original Docusaurus source and prior deployment configuration intact until validation completes. Store DNS/hosting/redirect changes in an operational checklist. A rollback should not discard or overwrite original content or its URL inventory.

---

## 19. Development setup and implementation notes

### 19.1 Initial bootstrap

Use the current stable ecosystem packages at project creation; commit the lockfile and record exact versions in the implementation PR. Representative commands:

```bash
pnpm create next-app@latest engineering-publication --ts --tailwind --eslint --app --src-dir --import-alias '@/*'
cd engineering-publication
pnpm dlx shadcn@latest init
pnpm add fumadocs-mdx fumadocs-core @types/mdx
pnpm add next-themes lucide-react
pnpm add -D @tailwindcss/typography
```

Follow prompts when they differ from the flags; shadcn's setup options and component names can evolve. Choose a single shadcn primitive foundation at initialization, then retain it consistently. Configure the [shadcn MCP server](https://ui.shadcn.com/docs/mcp) in the development MCP client and confirm it can list registry items from this project's `components.json` before choosing components or blocks. For Codex, the server is a stdio entry named `shadcn` running `shadcn mcp`; Codex must be restarted after a new MCP entry is added.

Use MCP to search and inspect candidates for the current screen, then add only the selected items. The equivalent CLI fallback is:

```bash
pnpm dlx shadcn@latest add button
```

For blocks, search the available registry through MCP first. Inspect each candidate's file list and dependencies, confirm it belongs to a configured registry, and install only a block that serves an approved screen. Do not assume a named block from an inspiration site is available through the standard registry.

With Tailwind v4, register the typography plugin through CSS according to the version's documentation; do not paste old `tailwind.config.js` examples into a new CSS-first setup without checking them.

### 19.2 Fumadocs MDX: conceptual wiring

The current official Next.js integration uses an MDX plugin in `next.config.mjs`:

```js
// Illustrative; confirm against pinned Fumadocs version.
import { createMDX } from 'fumadocs-mdx/next';

const config = {
  reactStrictMode: true,
};

export default createMDX()(config);
```

Then define typed blog and book collections using the supported `fumadocs-mdx/macro` API or its Config API alternative. For a custom blog, **do not import Fumadocs `DocsLayout` just because the content library is Fumadocs**. Instead, pass the compiled MDX component, frontmatter and TOC to our custom `ArticleLayout` / `BookLayout`.

The exact collection definitions, additional frontmatter schemas, generated imports and search server wiring must be established in a small compiling prototype; examples in third-party docs may describe older APIs.

### 19.3 Implementation spikes before broad coding

**Spike A: content end-to-end (P0)**

- One real article in MDX.
- Frontmatter validated by the selected Fumadocs API.
- Dynamic route prerendered.
- TOC generated and active heading behavior working.
- A shell code block, TS block, table, callout and screenshot render.
- Light/dark mode styles verified.

**Spike B: technical media (P0)**

- Test copy buttons, highlighted lines, long file names, very long output lines and mobile overflow.
- Test image optimization/lightbox for screenshots with small text.
- Verify final renderer handles the proposed MDX authoring syntax.

**Spike C: search (P0)**

- Index two articles and one book chapter.
- Search by exact CVE-like identifier and package name.
- Confirm no draft exposure and keyboard operation.

Only after these pass should the wider layout/component system be built out.

---

## 20. CI/CD, testing and publishing workflow

### 20.1 Contributor workflow

```text
Create branch
   -> write/edit .mdx and assets
   -> format and validate frontmatter
   -> local preview
   -> open PR
   -> CI checks and deployment preview
   -> editorial/security review
   -> merge to main
   -> production deployment
   -> verify live page, sitemap and search
```

### 20.2 Required automated checks

1. TypeScript type checking and linting.
2. Next.js production build.
3. Content schema and unique-slug validation.
4. Internal link and missing-image validation.
5. Draft exclusion tests.
6. Secret scanning of committed content and relevant assets.
7. Accessibility smoke tests on article, book and search dialog.
8. Route checks for important legacy URLs.
9. Basic RSS/sitemap metadata assertions.

### 20.3 Visual regression fixtures

Keep an intentionally difficult sample article with:

- Very long title and description.
- Nested H2/H3/H4 headings.
- A long shell output and extremely long code line.
- One full-width screenshot and one portrait screenshot.
- A comparison table with 7+ columns.
- Nested lists, blockquotes, footnotes and link-heavy references.
- Note, warning and danger callouts.
- A highlighted-code example.

Capture at least mobile narrow, tablet, desktop and wide desktop in both light and dark themes. Add ebook screenshots once BookLayout is implemented.

### 20.4 Manual release checks

Test Chrome/Chromium, Firefox and Safari; keyboard-only interactions; a screen reader spot check; dark-mode persistence; copy button feedback; CodeBlock horizontal scroll; screenshot zoom; old redirects; search and BookLayout navigation.

---

## 21. Delivery phases and milestones

Avoid beginning with the homepage; sequence the work to de-risk content and migration first.

### Phase 0 - audit and proof of concept

- [ ] Inventory existing Docusaurus articles, image assets and URLs.
- [ ] Select 3 representative sample posts (long security research, screenshot-heavy tutorial, short note).
- [ ] Bootstrap Next.js, Tailwind v4 and shadcn/ui.
- [ ] Prove Fumadocs MDX collection, schema, code and TOC integration.
- [ ] Choose syntax convention for code titles/highlights.

**Exit criterion:** at least one real post renders end to end without custom hacks or data loss.

### Phase 1 - design system and article reader

- [ ] Freeze typography, spacing and color tokens after real-content reviews.
- [ ] Implement header, footer, post metadata and article shell.
- [ ] Implement responsive active TOC.
- [ ] Implement code, figure/lightbox, callout, table and reference components.
- [ ] Add light/dark theming and accessible interaction states.
- [ ] Visual QA against the difficult sample article.

**Exit criterion:** long articles are visually polished and usable at target breakpoints.

### Phase 2 - discovery and archives

- [ ] Homepage with featured article and text-led recent writing list.
- [ ] Blog archive, topic pages and filtering.
- [ ] Search dialog and relevant results.
- [ ] Related posts and deterministic recommendations.
- [ ] RSS, sitemap, canonical metadata, OG strategy.

**Exit criterion:** a reader can discover and navigate the content without external search.

### Phase 3 - Docusaurus migration and launch

- [ ] Convert and validate all desired legacy content.
- [ ] Move or map media and resolve relative links.
- [ ] Complete redirect/anchor inventory and verification.
- [ ] Run CI, accessibility, link and secret checks.
- [ ] Deploy preview, compare output, complete launch checklist.
- [ ] Switch production only after redirect/rollback readiness.

**Exit criterion:** existing traffic and deep links remain functional; all migration blockers resolved.

### Phase 4 - ebooks

- [ ] Book metadata and chapter schema.
- [ ] Book landing page, chapter sidebar and prev/next navigation.
- [ ] Responsive and keyboard behavior.
- [ ] Search indexing and metadata for chapters.
- [ ] Publish one small book/series to validate end-to-end authoring.

**Exit criterion:** a complete book can be read chapter-by-chapter without a documentation-theme UI.

### Phase 5 - optional enhancements

- [ ] PDF/EPUB publishing pipeline with print-safe components.
- [ ] Expressive Code evaluation for richer terminal/editor frames.
- [ ] Code Hike proof of concept for annotated walkthroughs.
- [ ] Optional diagrams, math, print stylesheet and enhanced references.
- [ ] Optional privacy-preserving analytics and feedback mechanism.

---

## 22. Acceptance criteria / Definition of Done

### Article reader

- [ ] Comfortable prose width in both themes on desktop and mobile.
- [ ] Code fences show readable syntax highlighting, language/title and accessible copy controls.
- [ ] Long code lines and wide tables do not force horizontal scrolling of the entire page.
- [ ] Screenshots have captions where relevant and can be zoomed accessibly.
- [ ] Headings have functional stable anchors, TOC active state and back/forward navigation.
- [ ] A 5,000-word post remains responsive and fast.

### Publishing

- [ ] A new file with validated frontmatter appears in appropriate listing and search.
- [ ] Draft content remains absent from all public outputs.
- [ ] Dates, tags, canonical metadata, RSS and sitemap are correct.
- [ ] Relevant security content passes privacy/secret-review gates.

### Migration

- [ ] All approved legacy articles migrated or explicitly retained at old location.
- [ ] Redirect map reviewed and testable.
- [ ] No high-priority broken inbound links or missing media.
- [ ] Old Docusaurus deployment remains recoverable until cutover is accepted.

### Ebook

- [ ] Ordered chapters, previous/next navigation and mobile chapter selection work.
- [ ] Code, screenshots and callouts behave consistently with articles.
- [ ] Chapters are discoverable from book home and search.

### Reliability

- [ ] Production build, type checks, content checks and accessibility smoke suite pass.
- [ ] Performance budgets evaluated on representative real posts.
- [ ] Responsive visual QA completed in light and dark mode.

---

## 23. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Fumadocs MDX API changes | Content tooling integration rework | Pin versions; complete content spike; follow official versioned docs |
| Two code processors transform same fences | Broken highlighting or duplicated markup | Use one default transform; explicitly replace only after compatibility tests |
| Heavy screenshots slow reading | Poor LCP/layout stability | Optimize selectively; dimensions; lazy-load non-critical media |
| Docusaurus route/anchor mismatch | Lost SEO and broken backlinks | URL/anchor inventory; redirect matrix; automated tests |
| shadcn block copying causes visual inconsistency | UI loses coherence | Adopt tokens first, then extract and restyle only selected patterns |
| MDX custom components become brittle for export | PDF/EPUB conversion difficult | Define print-safe fallbacks and defer exports |
| Search mishandles CVEs/symbols | Security content hard to find | Technical-token test set; validate search engine behavior early |
| Too much client JavaScript | Slow technical article pages | Server Components by default and lazy interactive islands |
| Publication of accidental sensitive data | Security/privacy exposure | CI secret scan, editorial check, sanitized assets |
| Feature creep into full docs CMS | Delayed launch / clutter | Maintain phase boundaries and non-goals |

---

## 24. Choices considered and explicitly declined

| Option | Decision | Rationale |
|---|---|---|
| Continue Docusaurus theme | Declined | Documentation-first interface conflicts with editorial direction |
| Adopt AstroPaper unchanged | Declined | Attractive feature set but chosen framework is Next.js |
| Adopt Spotlight unchanged | Declined as default | Excellent design reference; need custom security and ebook patterns |
| Adopt full Fumadocs docs UI | Declined | Would reproduce the documentation shell being left behind |
| Use raw `@next/mdx` with custom content indexing | Reserve fallback | More bespoke tooling; typed collections/search need extra work |
| Start with headless CMS | Deferred | Local Git-first writing is sufficient now |
| Use Pagefind as default in runtime deployment | Deferred | Postbuild indexing is most natural with a static HTML output pipeline |
| Require fully static Next export | Declined for v1 | Limits redirects, default image optimization and runtime search choices |
| Install Expressive Code and Code Hike immediately | Deferred | Overlap/compatibility risk; begin with one reliable highlighting pipeline |
| Build downloadable ebooks first | Deferred | Separate print/export constraints; web reader comes first |

---

## 25. Research sources and official documentation

### Inspiration and templates

- [Fly.io Blog](https://fly.io/blog/)
- [Linear Now](https://linear.app/now)
- [Vercel Engineering](https://vercel.com/blog/category/engineering)
- [Supabase Blog](https://supabase.com/blog)
- [Tailwind Spotlight](https://tailwindcss.com/plus/templates/spotlight)
- [AstroPaper repository](https://github.com/satnaing/astro-paper)
- [Astro Cactus repository](https://github.com/chrismwilliams/astro-theme-cactus)
- [Shadcnblocks Blog Post layouts](https://www.shadcnblocks.com/blocks/blog-post)
- [Shadcnblocks Blog layouts](https://www.shadcnblocks.com/blocks/blog)
- [Tailark](https://tailark.com/)
- [Origin UI](https://originui.com/)

### Framework and UI

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx)
- [Next.js static export limitations](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js metadata / OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next)
- [shadcn/ui Tailwind v4 notes](https://ui.shadcn.com/docs/tailwind-v4)

### MDX, code, search and ebooks

- [Fumadocs MDX](https://www.fumadocs.dev/docs/mdx)
- [Fumadocs Next.js integration](https://www.fumadocs.dev/docs/mdx/next)
- [Fumadocs MDX presets](https://www.fumadocs.dev/docs/mdx/mdx)
- [Fumadocs TOC headless components](https://www.fumadocs.dev/docs/headless/components/toc)
- [Fumadocs built-in search](https://www.fumadocs.dev/docs/headless/search/orama)
- [Fumadocs code block](https://www.fumadocs.dev/docs/ui/components/codeblock)
- [Expressive Code Next.js installation](https://expressive-code.com/installation/)
- [Code Hike](https://codehike.org/)
- [Pagefind documentation](https://pagefind.app/docs/)
- [Quarto books](https://quarto.org/docs/books/)
- [Docusaurus admonitions syntax](https://docusaurus.io/docs/markdown-features/admonitions)

**Research note (10 October 2026):** documentation and APIs evolve. Official pages were reviewed while planning; the implementation should pin exact dependency versions and verify copied examples against that pinned set. A link to documentation describes a source of truth, not a claim that all optional features have been implemented.

---

## 26. First implementation PR: recommended scope

Do **not** start by importing ten third-party blocks. Create one narrow vertical slice:

1. Bootstrap Next.js App Router, Tailwind CSS v4 and shadcn/ui; verify the shadcn MCP registry workflow against this project's `components.json`.
2. Add Fumadocs MDX with a validated `blog` collection.
3. Search and inspect shadcn MCP components or blocks for the article shell and interactions; add suitable primitives, then create or adapt `ArticleLayout`, `ArticleHeader`, `ArticleTOC` and `CodeBlock` around the reading requirements.
4. Use one migrated, representative security post as a content fixture.
5. Add a code example, a screenshot with caption, a callout and a wide table.
6. Get the design comfortable on a narrow phone and wide desktop in both themes.
7. Run production build, basic accessibility checks and a metadata validation.
8. Capture screenshots and use them to decide final design tokens.

**PR acceptance test:** entering the real article's route displays accurate metadata, legible prose, navigable headings, working code copy, an enlargable screenshot and correct responsive behavior without recreating a documentation sidebar.

Once this vertical slice is approved, proceed with archives, search, migration and ebooks in the documented phases.

---

## 27. Final decision record

**Accepted:** Build a unique, editorial technical publication on **Next.js App Router + TypeScript + Tailwind CSS v4 + shadcn/ui**. Use the **shadcn MCP server** to find, inspect and add fitting registry components and blocks, then adapt their source to the publication. Use **Fumadocs MDX/Core as headless content infrastructure**, with an original article and ebook experience. Prioritize the quality of long-form writing, security material, code and screenshots over decorative homepage effects. Keep Git/MDX authoring simple and preserve existing Docusaurus URLs during migration.

**Implementation-dependent, not yet finalized:** exact pinned dependency versions; final color/font tokens; precise code-fence metadata syntax; current search engine adapter; whether PDFs/EPUB use Quarto or another pipeline; deployment domain and legacy redirect mappings. These are recorded as explicit validation tasks rather than hidden assumptions.

**Next action:** develop the portfolio and writing visual proposal in section 28 using the implemented article reader as the technical foundation. Passing checks establish functional readiness; visual acceptance remains open.

---

## 28. Portfolio expansion and visual review — 10 October 2026

This section records the user's subsequent requirements and supersedes the earlier status and next-action statements where they conflict. Working article controls and passing technical checks do not constitute approval of the visual design. The user found the current blog too basic and requested a renewed review of the blueprint and its references.

### 28.1 Confirmed requirements

- The site is a polished personal portfolio with writing as the main attraction.
- Include a Portfolio navigation destination for professional experience, conference talks, and projects the author maintains.
- Provide an accessible resume link and direct GitHub and LinkedIn links.
- Retain the custom technical article reader and its content, accessibility, theme, and migration requirements.
- Use suitable shadcn blocks and required components, discovered and inspected through the working shadcn MCP server.
- Add [Arpit Bhayani's site](https://arpitbhayani.me/) as a reference for the relationship between personal identity, writing, projects, and speaking. The requested presentation should be cleaner and more deliberately composed.
- Add [ReUI](https://reui.io/) as a source of design inspiration and suitable components.

### 28.2 Proposed organization — design review still open

Primary navigation: author name linking home, Writing, Portfolio. Resume, GitHub, LinkedIn, and theme controls remain readily discoverable. Mobile navigation uses a compact accessible menu.

| Surface | Proposed responsibility |
|---|---|
| `/` | Personal introduction, selected writing, a selected maintained project, and a compact speaking/experience preview |
| `/blog` | Editorial writing archive; keep existing article URLs |
| `/portfolio` | Career and community experience, with dates and concise descriptions |
| `/portfolio/projects` | Selected maintained projects, author's role, purpose, and repository/site links |
| `/portfolio/talks` | Talk title, event, date, abstract, and available recording/slides links |
| Resume link | Open the HTML résumé or download the supplied September 2026 PDF |

Experience, Projects, and Talks can look like a compact tab strip while remaining ordinary route links, with browser history, direct URLs, and an accessible current-page indication. Actual tab widgets are reserved for panels on the same page. This is a proposed route structure, not a record of implemented routes or a final visual decision.

The recommended visual direction is an author-led portfolio: prominent name and concise introduction, expressive title typography, an asymmetric selected-writing composition, readable prose, and meaningful technical artifacts. Use real content to establish hierarchy. Homepage previews are curated; full career and speaking inventories live on their dedicated pages. Final typography, colors, composition, and motion remain subject to visual review.

### 28.3 Sources supplied by the author

| Source | Verified material and qualification |
|---|---|
| [GitHub profile](https://github.com/pankajmouriya) | Author's public profile; select portfolio projects deliberately rather than treating all owned repositories as maintained products |
| [Existing personal site](https://pankajmouriya.com/) | Biography, experience entries, community work, and talk archive; the site labels Kong as current, which requires a freshness check before writing current-role copy |
| [LinkedIn](https://www.linkedin.com/in/pankajmouriya/) | Link extracted from the existing personal site's public HTML; profile contents have not been verified |
| [The Security Diff](https://tsd.report/) and [repository](https://github.com/pankajmouriya/tsd.report) | Public site and owned, non-archived repository verified; a strong candidate for selected work, with a link to the separate publication |
| [Same Origin Policy talk](https://pankajmouriya.com/talk/sameoriginpolicy/) | Existing talk page supplies title, date, OWASP Bay Area event, abstract, and resource links; resource destinations still need validation before migration |
| Supplied September 2026 résumé (`/Users/pankajmouriya/Documents/Pankaj-Resume-2026_v1.pdf`) | Primary source for current Harness role, previous employers, certifications, education, and named conference talks; copied byte for byte as the downloadable résumé |

The other cloud-security and container talks on the existing site are migration candidates. Preserve their source titles and dates until reviewed. Do not invent achievements, maintenance commitments, audience numbers, or recordings. The supplied résumé establishes Harness as the current role from November 2025; the older personal site's Kong label is stale.

### 28.4 Component discovery and integration findings

- The shadcn MCP was exercised successfully: project registry discovery, navigation search, item inspection, and a navigation-menu usage example. Only `@shadcn` is currently configured.
- Inspected shadcn candidates include Navigation Menu, Sheet, and Tabs. Use source-owned Button, Card/Item, Separator, and appropriate controls where the design requires them; avoid installing primitives solely to fill a checklist.
- ReUI's [Timeline](https://reui.io/components/timeline) is a candidate for career history. Public blog, profile, navigation, and timeline examples provide composition references.
- ReUI distinguishes free components from Pro blocks. Use free component source where appropriate; copying Pro block source depends on available licensed access.
- The [ReUI registry documentation](https://reui.io/docs/registry) uses `@reui` and `https://reui.io/r/{style}/{name}.json`. Its supported styles use `base-*` or `radix-*`; this project's `new-york` style does not match that scheme. Resolve this explicitly during integration using a supported Radix variant and verified registry configuration. Do not paste the placeholder URL into the current configuration and assume compatibility.
- Preserve the current Radix foundation and inspect each selected item's files, dependencies, API, and license before installation. Record adopted source and local adaptations in `THIRD_PARTY_NOTICES.md`.

### 28.5 Critique of the current implementation

The current page undershoots the blueprint's ambition. The earlier readiness assessment gave working reading controls and passing tests more weight than they warranted. The content foundation is useful, but the visual identity still needs substantial work. Technical verification must not be reported as visual-design acceptance.

The main gap is composition:

- **Personal identity:** the author is reduced to `PM.` in the header. The full name and personal introduction need a deliberate visual presence.
- **Homepage and archive:** both use almost the same narrow layout. They need distinct roles and compositions: the homepage introduces the author and selected work; the archive supports scanning and discovery.
- **Featured writing:** the selected article gets little special treatment, and the writing has little variation in emphasis. Give a real article a carefully composed presentation using a meaningful diagram, annotated screenshot, or excerpt.
- **Provisional styling:** the starting colors and system font effectively became the finished appearance without a stronger identity taking shape. Revisit them as design choices, not frozen defaults.

The opportunity is a personal portfolio with a prominent name, a short introduction, and one carefully presented article. This creates visual character while keeping the writing central.

### 28.6 Updated reference priorities

Judge the references against the confirmed preference: **a polished personal portfolio where writing is the main attraction**. These weights refine section 2; they do not replace its licensing and source-ownership rules.

| Reference | What should influence the design |
|---|---|
| [Tailwind Spotlight](https://tailwindcss.com/plus/templates/spotlight) | Author presence and the relationship between personal identity and writing. During the reference review its linked page redirected to login, so it was not freshly inspected; retain that evidence limitation. |
| [Linear Now](https://linear.app/now) | Deliberate presentation of individual stories, clear hierarchy, and organized discovery. |
| [Fly.io](https://fly.io/blog/) | Technical writing with personality and substantial excerpts that make readers curious. |
| [Vercel Engineering](https://vercel.com/blog/category/engineering) / [Supabase](https://supabase.com/blog) | Clear article metadata and archive organization. |
| [AstroPaper](https://github.com/satnaing/astro-paper) / [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) | Useful reading and discovery features; their minimalism alone will not deliver the requested distinction. |
| [Shadcnblocks Blog](https://www.shadcnblocks.com/blocks/blog) / [Blog Post](https://www.shadcnblocks.com/blocks/blog-post), [Tailark](https://tailark.com/), [Origin UI](https://originui.com/) / its observed destination [coss ui](https://coss.com/ui) | Specific composition and interaction ideas, adapted into one coherent identity. |
| [Arpit Bhayani](https://arpitbhayani.me/) | The connection between personal identity, writing, projects, and speaking. Use shorter introductions and curated homepage selections, with full inventories on dedicated pages, to meet the requested cleaner UI/UX. |
| [ReUI](https://reui.io/) | Suitable components and refined navigation, profile, timeline, and blog compositions. Evaluate alongside shadcn MCP candidates and adapt to the portfolio's identity. |

The prior review used current UI code, saved article screenshots, and public reference pages. A live browser connection was unavailable; it was not a fresh interactive visual audit of every reference.

### 28.7 Directions considered

| Direction | What the visitor encounters | Tradeoff |
|---|---|---|
| **Author's studio — recommended** | A prominent name and personal introduction alongside a generously presented selected article. Below: an editorial writing index and a compact view of the author's work. | Requires thoughtful personal copy and careful composition. |
| **Personal magazine** | A large masthead, a lead story with original technical artwork, then varied sections for essays, research, and notes. | More expressive, but can make the publication feel larger than the person behind it. |
| **Annotated notebook** | Writing presented through excerpts, figure annotations, dates, and occasional marginal observations from the author. | Distinctive and intimate, but the notebook treatment could become decorative if overused. |

**Recommendation:** the author's studio, with annotation as its signature detail. Keep the other directions as documented alternatives. Recording the recommendation does not mean a final visual composition has been reviewed or approved.

### 28.8 Concrete design brief

| Area | Intended treatment |
|---|---|
| **Opening** | Give `Pankaj Mouriya` real visual presence. A brief introduction explains the author's interests. The selected article appears within the first viewport; validate the composition on desktop and narrow mobile. |
| **Featured writing** | Pair the actual title with one meaningful artifact: a diagram, annotated screenshot, or short code excerpt. For the DevTools article, a candidate illustration shows how a message moves between browser contexts. Keep that illustration technically accurate and tied to the article. |
| **Archive** | Use generous article rows with a narrow date column, strong titles, useful summaries, and selective supporting visuals. Preserve reading order when the columns stack on mobile. |
| **Reader** | Carry the same typography into a composed title section, then use quiet prose, wider technical figures, and carefully placed captions. Retain working anchors, TOC, copy controls, and accessible screenshot enlargement. |
| **Interaction** | On desktop, a focused article row can reveal a supporting excerpt or figure preview. Provide equivalent keyboard focus behavior. On mobile, show that material directly; essential titles, summaries, and links remain available without hover. |
| **Visual character** | Expressive display typography, highly readable body text, warm neutral surfaces, and one confident accent. Scale, alignment, and artwork provide the richness. Validate the treatment in both themes; the existing system font and provisional color tokens are not the final identity. |
| **Portfolio integration** | Present experience, conference talks, maintained projects, resume, GitHub, and LinkedIn within the same visual system. Keep homepage previews compact and curated; retain complete inventories and resource links within Portfolio. |

The intended result is recognizably personal and gives the writing a stronger stage. Annotations should explain an artifact or observation. Keep motion purposeful and respect reduced-motion preferences. Use shadcn blocks and required components through MCP, with appropriate ReUI inspiration and components as described in section 28.4.

### 28.9 Visual review criteria and next deliverable

Develop a coherent homepage, archive, Portfolio, and article-reader proposal using the real author, project, and talk material above. Review desktop and mobile composition together before treating the visual identity as settled.

- [ ] The full name, short introduction, and selected article establish the first viewport's hierarchy.
- [ ] Homepage and archive have visibly distinct compositions suited to their different purposes.
- [ ] Featured writing has a meaningful artifact or excerpt and clear emphasis.
- [ ] Typography, palette, spacing, figures, and captions form one recognizable identity across writing and portfolio surfaces.
- [ ] Experience, talks, maintained projects, resume, and GitHub/LinkedIn links are easy to find.
- [ ] Article previews work with keyboard focus; mobile exposes the supporting material directly.
- [ ] Desktop and mobile proposals use actual content, including long titles and uneven description lengths, and are reviewed in light and dark themes.
- [ ] Visual acceptance is recorded separately from build, test, accessibility, and content-verification results.

Then reconcile the implementation plan with the chosen direction and confirmed content. The supplied résumé resolves current-role dates and the document destination. This portfolio expansion does not authorize production migration or domain changes.

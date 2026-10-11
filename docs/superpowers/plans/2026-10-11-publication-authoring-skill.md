# Publication Authoring Skill Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a repository skill and human guide that convert rough Markdown and images into review-ready site content.

**Architecture:** Keep one concise routing skill with separate article, book, and component references. Store copyable MDX templates as skill assets and keep all rendering in the existing dynamic routes.

**Tech Stack:** Agent Skills Markdown, Fumadocs MDX, Zod schemas, Next.js 16, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-11-publication-authoring-skill-design.md`

## Global Constraints

- Preserve author claims and source material.
- Default generated content to `draft: true`.
- Do not create route-specific HTML or React pages.
- Do not commit, push, deploy, or publish without the relevant user instruction.

---

### Task 1: Build the publication authoring package

**Files:**
- Create: `skills/publication-authoring/SKILL.md`
- Create: `skills/publication-authoring/agents/openai.yaml`
- Create: `skills/publication-authoring/references/articles.md`
- Create: `skills/publication-authoring/references/books.md`
- Create: `skills/publication-authoring/references/components-and-validation.md`
- Create: `skills/publication-authoring/assets/article-template.mdx`
- Create: `skills/publication-authoring/assets/book-chapter-template.mdx`
- Create: `docs/AUTHORING.md`

**Interfaces:**
- Consumes: rough Markdown or MDX files and local image paths.
- Produces: repository-valid article or book MDX plus copied public assets.

- [ ] Write the human guide with exact article and book workflows.
- [ ] Write the templates from the current Zod schemas.
- [ ] Write the skill entrypoint and focused references.
- [ ] Add UI metadata for `$publication-authoring`.

### Task 2: Validate the skill and repository

**Files:**
- Modify: `PROGRESS.md`

**Interfaces:**
- Consumes: the complete skill package from Task 1.
- Produces: validator, content-test, typecheck, and production-build evidence.

- [ ] Run a read-only baseline authoring scenario without the skill and record the missed decisions.
- [ ] Run `quick_validate.py` against the skill folder.
- [ ] Run a read-only forward scenario with the completed skill.
- [ ] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- [ ] Record the implementation and verification checkpoints in `PROGRESS.md`.
- [ ] Stage only task-owned files and create the authorized local commit.

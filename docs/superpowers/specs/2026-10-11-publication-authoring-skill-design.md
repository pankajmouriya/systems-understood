# Publication Authoring Skill Design
## Goal

Let Pankaj provide a rough Markdown file and local image references, then have Codex convert it into a review-ready article, ebook, or ebook chapter for this repository without writing a new page component.

## Structure

Create one versioned repository skill at `skills/publication-authoring/` and install it into Codex's discoverable skills directory. Its short entrypoint routes between article and book workflows. Detailed schemas live in focused references, and copyable MDX files live under `assets/`. A human guide at `docs/AUTHORING.md` explains the same workflow without requiring the skill runtime.

## Supported inputs and outputs

- Blog article: one Markdown or MDX draft plus optional referenced images becomes `content/blog/<slug>.mdx` and images under `public/images/blog/<slug>/`.
- Existing ebook chapter: one draft becomes `content/books/<book>/<slug>.mdx` with ordered chapter metadata and book-scoped images.
- New ebook: chapter drafts become a new `content/books/<book>/` directory, and the book slug and catalog metadata are registered in `src/lib/source.ts`.

The dynamic article and book routes continue to own rendering. The skill must not create route-specific HTML or React pages.

## Editorial safeguards

- Preserve the author's technical claims, code, links, and voice. Improve structure and formatting without silently changing meaning.
- Do not invent publication history, security findings, advisory IDs, employers, talk appearances, or source attribution.
- New content defaults to `draft: true`. Change it to public only when the user explicitly asks to publish that content.
- Resolve image references relative to the supplied draft, copy them into the repository, inspect their dimensions, and produce meaningful figure metadata. Flag missing or unreadable images instead of fabricating replacements.
- Do not commit, push, deploy, or modify redirects unless the user requests that action.

## Validation

Validate the skill package with the skill-creator validator. Validate generated content with `pnpm test`, `pnpm typecheck`, and `pnpm build`; add focused browser checks only when a new component or reader behavior is introduced. Report the generated route, draft state, moved images, checks run, and anything that still needs author review.

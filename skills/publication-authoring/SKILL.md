---
name: publication-authoring
description: Use when a rough Markdown or MDX draft and referenced images need to become an article, ebook, or ebook chapter in the Pankaj portfolio publication.
---
# Publication Authoring

Convert source material into the repository's existing MDX content system. Reuse the dynamic readers; never create a route-specific HTML or React page for ordinary content.

## Choose the workflow

- Blog post or standalone essay: read [references/articles.md](references/articles.md).
- Chapter for an existing ebook: read [references/books.md](references/books.md).
- Entirely new ebook: read [references/books.md](references/books.md), including registration.
- Figures, callouts, code, tables, or final checks: read [references/components-and-validation.md](references/components-and-validation.md).

Do not use this skill for résumé facts, experience history, arbitrary landing pages, or visual redesigns.

## Required behavior

1. Work from the repository root and inspect the current schema before editing. Treat the references as maintained guidance, while current code remains authoritative.
2. Read the complete source draft. Resolve image links relative to that file. Preserve technical claims, code, links, citations, and the author's voice; improve structure and MDX syntax without silently changing meaning.
3. Infer a concise title, description, slug, kind, and controlled tags when the draft supports them. Preserve a supplied historical date. For clearly new content without a date, use the current date and report that choice. If provenance is ambiguous, keep the item in draft and flag it for review.
4. Default new content to `draft: true`. Set `draft: false` only when the user explicitly asks to publish or “make live.” In this skill, that phrase means production-ready repository content; it authorizes deployment only when the same instruction identifies a deployment target or clearly requests a public release. Publishing never implies a push, DNS change, or replacement of hand-selected homepage features.
5. Never invent advisory IDs, security status, review dates, canonical sources, publication history, or attribution. Omit unsupported optional metadata.
6. Copy referenced images into the content type's public asset directory. Inspect each image, record its real dimensions, provide meaningful alt text from visible evidence and surrounding context, and report missing or unreadable assets. Do not overwrite a different existing image. A missing, unreadable, or sensitive referenced image blocks `draft: false`; keep the converted content in draft and do not copy unsafe material into `public/`.
7. Run the checks in the relevant reference. Fix content and metadata failures within scope. Add browser checks only when reader behavior or shared UI changes.

## Completion report

Report the source consumed, files created or changed, route, draft state, image moves, inferred metadata, validation results, and anything needing author review. Do not commit unless the user explicitly requests it or the current session already authorizes local commits. Do not claim public availability unless the deployed public URL was verified.

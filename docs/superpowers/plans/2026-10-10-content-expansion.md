# Content expansion: articles, books, and speaking archive

## Goal

Publish the author's remaining substantial legacy AppSec and Kubernetes writing, two complete web book series, and a fuller source-backed talks archive. Keep the writing central to the portfolio.

## Source and boundaries

- Source checkout: `../noShellAccess.com-main-blog` (read only).
- Migrate four AppSec posts and two Kubernetes controller posts in addition to the already migrated DevTools article. Preserve the publication dates, original article bodies, code, and referenced figures. Mark historical technical material clearly.
- Publish the substantive Same Origin Policy and Kubernetes 101 chapters as ordered web books. The legacy `toc.md` duplicates navigation and `Online.md` contains stale profile links; omit those from the reader and record the omission. Leave stub series unpublished.
- Expand talks only where the résumé or the author's public talk pages establish the event and title; link to primary pages when validated.
- Add local route redirects and a mapping ledger. Redirects from `noshellaccess.com` require control of that host at deployment.

## Checkpoints

1. Inventory sources, old routes, images, and conversion exceptions; update `PROGRESS.md`.
2. Migrate six articles and figures, correct archive previews and homepage selection, then build and check route/media integrity; update `PROGRESS.md`.
3. Implement book collection, two readers, navigation, search, sitemap, and legacy route mappings; run content/build/browser checks; update `PROGRESS.md`.
4. Enrich talks with verified source links, inspect responsive pages, run full checks and a fresh local preview; update `PROGRESS.md`.

## Acceptance

- No missing local images or dropped source code fences in published content.
- Every public article and book chapter has a stable route, metadata, and internal discovery path.
- Book readers provide ordered navigation and phone-friendly chapter access.
- Search and sitemap include book chapters; RSS includes published articles.
- Tests and local HTTP checks demonstrate the new routes, redirects, and layout.

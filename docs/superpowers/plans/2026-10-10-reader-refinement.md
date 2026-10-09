# Reader and portfolio refinement

## Request and direction

The author asked for a wider, less congested reading page, more icons and color throughout the application, using TweakCN as a reference. Keep the author-led portfolio and writing central; preserve factual content, book ordering, routes, search, reading controls, and theme switching.

Reference: [TweakCN Claude preset](https://github.com/jnsahaj/tweakcn/blob/main/utils/theme-presets.ts). Adapt its ivory/charcoal/terracotta palette with stronger foreground contrast. Use blue for Kubernetes/technical guides and restore the site's earlier green for identity, security/work, and a few home accents. Retain the established self-hosted Newsreader and DM Sans. Use a consistent local line-icon component; avoid new runtime dependencies.

## Implementation

- [x] Expand article canvas to 96rem, with a 12rem contents rail and aligned title/body edges.
- [x] Increase paragraph, section, figure, list, and code spacing; constrain prose to 84ch while technical figures use the available column.
- [x] Give chapters one persistent chapter rail and an inline page-contents disclosure.
- [x] Add back-to-writing navigation, metadata icons, and topic badges.
- [x] Carry warm/blue/teal surface and icon treatments through navigation, home, archive, books, experience, projects, talks, résumé, and search.
- [x] Use light/dark color pairs meeting 4.5:1 for normal text.
- [x] Diagnose and correct the phone header overflow introduced by the menu icon.
- [x] Finish final browser regression and screenshot review; refresh port 3101.

## Acceptance evidence

`tests/e2e/reader-refinement.spec.ts` checks that the 1280px article reading column exceeds 880px and the chapter reading column exceeds 850px, with aligned article edges, usable contents links, loaded diagrams, and phone overflow checks. The broader suite preserves copy, zoom, keyboard, search, redirects, metadata, mobile navigation, and theme behavior. Screenshots cover the target reader and shared application pages in both themes.

Checkpoint details and test outcomes: [PROGRESS.md](../../../PROGRESS.md).

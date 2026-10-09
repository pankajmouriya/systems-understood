# Third-party source

`src/components/ui/button.tsx` was generated from the official shadcn/ui Button registry with CLI 4.21.4. The registry source is maintained at [shadcn/ui](https://github.com/shadcn-ui/ui) under the MIT License. The article's copy control uses this source-owned component; its size and surface colors are adapted through the publication's `.code-copy` styles.

`src/components/ui/sheet.tsx` and `src/components/ui/separator.tsx` were generated from the official shadcn/ui registry with CLI 4.21.4. The Sheet close control uses a text glyph in place of the registry's optional Lucide icon. Both components are source-owned and adapted to the site's theme.

The self-hosted DM Sans and Newsreader Latin WOFF2 font files came from Google Fonts and use the SIL Open Font License 1.1. Their sources are [DM Sans](https://fonts.google.com/specimen/DM+Sans) and [Newsreader](https://fonts.google.com/specimen/Newsreader).

`src/components/reui/timeline.tsx` comes from the free [ReUI Radix Vega Timeline registry](https://reui.io/r/radix-vega/timeline.json). ReUI describes its free components as MIT licensed; this source was reviewed before adoption and used for the career timeline. The project's existing `new-york` shadcn style was not changed to a ReUI style.

## TweakCN theme reference

The reader refinement takes palette inspiration from TweakCN's `claude` preset (ivory, warm charcoal, and terracotta), adapted with darker light-theme action text, lighter dark-theme text, a custom blue topic token, and restored green accents from this site's earlier palette. Fonts, icons, and layout remain local implementations.

Source: https://github.com/jnsahaj/tweakcn/blob/main/utils/theme-presets.ts. The TweakCN repository uses the [Apache License 2.0](https://github.com/jnsahaj/tweakcn/blob/main/LICENSE). TweakCN is a design reference; no hosted theme dependency is required.

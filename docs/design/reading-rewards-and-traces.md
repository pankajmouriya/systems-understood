# Reading stamp and perimeter traces

10 October 2026. This refinement makes article guardian diagrams compact and circular, adds restrained border highlights, and rewards readers at the article end.

## Reading reward contract

`ReadingStamp.tsx` mounts after the MDX body inside `ArticleLayout`. Two independent conditions must be satisfied in the current visit:

1. At least 120,000 milliseconds while `document.hidden` is false.
2. The article-end marker has intersected the viewport while the document is visible.

Either condition may happen first. Scrolling straight to the end does not award the stamp early. Waiting at the top does not award it until the end has been reached. The marker records reaching the end; the reader does not have to remain there while the timer finishes. The seal remains at the end, with no modal, toast, sound, or forced scrolling.

This measures visible time and end-of-article reach, not comprehension, continuous attention, or proof of reading every word. A visible browser window can still be unattended. The copy thanks readers without claiming certification.

### State, timing, and cleanup

- `performance.now()` measures elapsed time. One timeout covers the remaining duration; there is no polling interval.
- `visibilitychange` accounts for the visible interval, clears the timeout when hidden, and schedules the remaining time when visible again.
- IntersectionObserver tracks the one-pixel end marker. Image/content layout shifts are handled by observation, not a cached page height.
- Intersection state is retained while hidden. If the end is already visible when the tab returns, the visibility handler records reaching it; background time still does not count.
- The timeout and observer both call the same award predicate; an `awarded` guard prevents duplicates.
- Unmount clears timers, disconnects the observer, and removes the visibility listener. The component is keyed by slug, preventing carryover to another article.
- The only stored value is `sessionStorage['reading-stamp:<slug>'] = 'earned'`. Earned stamps persist on reload in the tab session; unfinished elapsed time does not persist. No identifier, browsing history, duration, or award is sent to a server.
- If storage is blocked, the stamp still works in memory for that visit.

### Presentation and accessibility

The seal uses concentric ink-colored SVG rings, a slightly interrupted inner ring, circular lettering, a book/check icon, and “Well read.” The accompanying text says “Curiosity looks good on you.” The visual seal is decorative; a polite status region announces the accompanying text once inserted. Its short arrival press respects reduced motion and has no continuous rotation. On narrow screens, seal and message stack.

## Perimeter traces

`BorderTrace.tsx` is a decorative, pointer-transparent SVG overlay. Two short stroke segments travel around a normalized rectangle: foreground/charcoal and the existing warm red accent. The reference was the supplied screen recording of a panel with short moving edge highlights.

Placements: article headers, book illustration panels, and the shared footer invitation. The homepage fight retains its existing semantic red/green traffic. There is no global full-screen animation or new effect around every link.

Each border pass lasts nine seconds once, fading at both ends. `useSceneVisibility` pauses it offscreen or in a hidden document. Reduced motion hides it. The traces do not intercept clicks, add accessibility-tree noise, or alter layout. Foreground color follows the theme so a literal black line does not disappear in dark mode.

## Compact guardian update

The title-side slot is capped at 320px; the diagram is 280px wide and 306px high. The green inner boundary is a 232px circle. Defense labels stay stationary inside, threats outside, and the guardian is 80px. This restores more horizontal room to the article title. The existing finite playback, topic mapping, and reduced-motion rules remain documented in `article-guardian-boundaries.md`.

## Verification

Run:

```sh
npm run lint
PLAYWRIGHT_CHANNEL=chrome npm run test:browser -- tests/e2e/reading-stamp.spec.ts tests/e2e/article-boundary.spec.ts
```

Reward tests cover both eligibility gates, hidden-time exclusion, returning to an end marker reached in the background, per-article persistence, blocked storage, phone overflow, and reduced motion. Browser virtual time avoids a two-minute wall-clock test. Hidden-state tests deliberately override the visibility getter and dispatch the browser event; this is not a claim of physical-device background testing.

Review screenshots of the earned stamp in light/dark and phone layouts, long control labels inside the smaller circle, and traces on each surface. Public deployment and multi-engine/device profiling are outside this local check.

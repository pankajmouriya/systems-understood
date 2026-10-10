# Hero animation: engineering handoff and review

Reviewed: 10 October 2026. Scope: homepage identity, security theater, study route, shared traffic, greeting, audio, motion preferences, and retained legacy portrait code. This document describes the persistent-portrait design; it supersedes earlier photo hide/drop behavior in progress checkpoints 53–56.

## 1. Product intent

The author remains visible beside his name. The story area demonstrates security interests through four fictional encounters. The approved illustrated guardian/rogue artwork is retained; a small original pixel-grid infrastructure diagram provides the object being protected. It consists of a terminal, gateway, rack, and connecting network line. It is not a copied logo or a claim about this website's infrastructure.

The theater begins with prompt injection. A rogue arrives, the guardian appears above the measured surname and jumps toward the infrastructure, the attack is contained, and the guardian returns to watch. Defense diagrams remain below the character lane. The portrait no longer hides, swings automatically, or participates in combat.

## 2. Ownership and file map

Paths below are relative to the repository root.

| File | Responsibility |
| --- | --- |
| `src/components/shadcn-studio/blocks/hero-section-44/hero-section-44.tsx` | Server-rendered composition: identity and portrait on the left, theater on the right. |
| `.../identity-portrait.tsx` | Persistent Next Image portrait with CSS strap/clip; no client runtime or physics. |
| `.../security-theater.tsx` | Homepage client controller: visibility, pause, sound toggle, story selection, shared semantic state. |
| `.../greeting-word.tsx` | Separate multilingual greeting; independent pause control, reduced motion, offscreen/hidden suspension. |
| `src/components/effects/security-stories.ts` | Story copy, source links, duration, phase boundaries, defense timing, signal state. |
| `src/components/effects/use-security-stories.ts` | Boundary timer, pause accounting, seeking, cycling, catch-up, visibility/preference subscription. |
| `src/components/effects/AgentDuel.tsx` | Atlas rendering, measured surname entrance, pixel infrastructure, defense diagrams, SVG labels. |
| `src/styles/agent-duel.css` | Character choreography, sprite poses, effects, result labels, traffic state styling, identity layout. |
| `src/components/effects/FlowLines.tsx` | Seven SVG paths and moving packet strokes. Optional semantic mode leaves book-panel usage independent. |
| `src/app/globals.css` | Base traffic geometry/style, rightward travel, existing hero layout and generic motion preferences. |
| `src/components/effects/use-threat-audio.ts` | Gesture-enabled Web Audio cue, voice cleanup, pause/visibility suspension, unmount guard. |
| `src/components/effects/AgentStudy.tsx` | Noindex study route controller: art variants, four stories, pause, seek, replay. |
| `tests/e2e/hero.spec.ts` | Production-browser regression coverage. |

`src/components/ui/id-card.tsx` is retained legacy code. It is no longer imported by the homepage. Its Three.js/Rapier code and GLB assets are not part of the active portrait path. The old `portrait-lanyard.tsx` controller was replaced by `security-theater.tsx`.

## 3. State and clocks

There are two kinds of timing, with different jobs:

1. **Semantic story timer:** `useSecurityStories` owns `{id, index, startAt}`, phase, and signal mode. It wakes only at boundaries. It does not update React on every animation frame.
2. **CSS animation timelines:** characters, poses, trails, portal, labels and particles share a 24-second duration and a negative delay derived from `startAt`. CSS handles intermediate frames.

The signal paths have their own short linear travel cycles. Their *meaning* comes from the semantic clock: `idle`, `attack`, or `secured`. They do not need to share the individual projectile's exact position.

### Boundary table

| Time | Phase/event | Traffic |
| --- | --- | --- |
| 0–1.2 s | Arrival begins; no success label | Idle, no moving signals |
| 1.2 s | Rogue cue if audio is enabled | Red, right-to-left |
| ~1.92–2.88 s | Guardian perched above surname | Red, right-to-left |
| ~2.88–5.28 s | Jump into theater | Red, right-to-left |
| 5.8 s | Combat phase | Red, right-to-left |
| 11.04 s | SQLi, prompt, supply-chain defense result | Green, left-to-right |
| 12.96 s | RCE runtime-response result | Green, left-to-right |
| 15.6 s | Recovery phase | Green, left-to-right |
| 18 s | Patrol phase | Green, left-to-right |
| ~19.2–23.04 s | “perimeter secured” visible after encounter | Green, left-to-right |
| 24 s | Next story, new run ID | Idle until new arrival |

`scenePhaseAt`, `signalModeAt`, and `securedAt` provide the semantic mapping. CSS percentages use `seconds / 24 * 100`. If duration or a defense timestamp changes, update both mappings and CSS verdict/choreography percentages, then run the interruption tests.

### Pause and interruption rules

- Active playback requires motion allowed, intersection visibility, a visible document, and no user pause.
- Cleanup records elapsed time and clears the outstanding boundary timer. Resume schedules from that elapsed time.
- An overdue callback samples current elapsed time rather than replaying stale phase transitions. Whole elapsed cycles are accounted for; very late audio cues are suppressed.
- Story selection/replay/seek increments the run ID, remounting CSS timelines with the desired negative delay.
- Sibling keys must remain distinct: `flow-${id}` and `agents-${id}`. Giving them both a numeric ID caused duplicate traffic layers during this review.
- Switching reduced motion on resets the semantic clock to arrival/idle. CSS removes nonessential animation. Switching it off starts a coherent fresh opening.
- The greeting has a separate 2.2-second interval and separate user pause control. It now suspends when its heading is offscreen or the document is hidden.

## 4. Composition and artwork

### Identity

The name and portrait share `.profile-identity`. The portrait card is 120×156 CSS pixels on desktop and 88×120 on narrow screens. Its strap, clip, and five-degree resting tilt are CSS. It is intentionally still and no longer advertises dragging. `sizes` guides Next Image delivery.

### Theater coordinates

The SVG viewBox is 480×520. Agent combat poses occupy the upper left/right lanes. Infrastructure begins at `(182,222)` and spans roughly 116×78 units. The defense diagram starts at `(140,310)`, with text below its geometry. Do not expand sprite bounds downward into the defense labels.

The guardian's initial position is measured from `#guardian-name-anchor` using the inverse SVG screen matrix. ResizeObserver recalculates after size changes; font readiness also triggers a measurement. This avoids desktop-only hardcoded name coordinates. Its intermediate arc crosses the gap into the theater. Mobile still uses the actual surname measurement, so inspect its longer travel distance whenever hero copy/layout changes.

Approved illustrated and pixel WebP atlases each contain multiple poses. Explicit SVG clip paths prevent adjacent cells from leaking. Preserve those clips when changing poses; ordinary overflow alone previously produced fragments in rendered output. The infrastructure uses crisp integer geometry and status lights driven by signal state, without adding a separate blinking loop.

### Traffic

Path geometry runs left-to-right. `signal-travel` decreases dash offset (100 → 0), yielding rightward motion. `signal-inbound` increases it (0 → 100), yielding leftward motion. Attack mode uses the site's warm/red accent; secured mode uses green. The track color transitions briefly. Idle signals have no animation name. Reduced motion hides moving signals and leaves quiet tracks.

Do not alter generic book-panel traffic while changing theater-specific behavior. Use the `data-signal-mode` selector for story changes.

## 5. Sound and accessibility

Sound starts off. The explicit sound button creates/resumes an AudioContext and replays the opening. There is no autoplay workaround, audio asset download, speech, or persistent sound preference.

The cue uses two low triangle oscillators with a descending pitch and short gain envelope, lasting approximately 0.62 seconds. It is intentionally quiet. Disabling sound or stopping active playback stops voices and suspends the context. Unmount closes it. A request token and mounted guard prevent a late asynchronous resume from applying state after navigation.

The story is understandable without sound. Story buttons expose `aria-pressed`; pause and sound controls have action labels. Decorative background SVGs are hidden from assistive technology. The agent scene has a descriptive image label. The portrait has an ordinary image alternative. Reduced-motion visitors see a still portrait, infrastructure, and characters with no premature success message.

The separate greeting and scene pause buttons control different loops. This is deliberate current behavior; a future global motion preference could consolidate them. Do not silently make the scene's sound switch activate on unrelated clicks.

## 6. Review findings and disposition

| Finding | Evidence | Disposition |
| --- | --- | --- |
| Success label appeared before attack | Original `patrol-label` keyframes set opacity at 0% and 12% | Fixed: hidden base state; only late-cycle patrol interval reveals it. |
| Traffic did not reflect attack state | Generic `FlowLines` always used green/rightward travel | Fixed: semantic mode controls color/direction; RCE waits for its later result. |
| Duplicate/stale traffic after story changes | Browser regression reproduced two `.flow-lines` SVGs, one secured and one attacking | Fixed: unique sibling keys for traffic and agents. Test intentionally uses a strict single-element locator. |
| Reduced-motion switch could desynchronize playback | CSS removed/recreated animations while JS retained elapsed clock | Fixed: preference transition resets run, phase, and signal together; covered by browser test. |
| Delayed boundary could show stale state | Old timeout callback applied the scheduled boundary rather than actual elapsed time | Fixed: elapsed-time catch-up with cycle accounting. |
| Greeting interval kept running offscreen | Interval depended only on pause/reduced motion | Fixed: heading intersection and document visibility now gate it. |
| Homepage used continuous portrait physics | Active ID card used Three.js/Rapier and rebuilt rope geometry each frame | Removed from active homepage by persistent static identity portrait. |
| Audio could finish an async resume after unmount | `resume()` awaited before unguarded state update | Guarded with request generation and mounted state; promise cleanup failures are handled. |

The legacy ID card still has potential maintenance concerns if reintroduced: per-frame tube allocation, separate pointer-capture lifecycle, retained large model assets, and its own readiness/failure path. Its dormant code is not evidence of current homepage runtime cost. Do not re-enable it without a focused drag/cancel/blur, context-loss, pause/resize, and device-performance pass.

## 7. Performance facts and limits

- Homepage portrait: no WebGL canvas, model request, Rapier physics, or automatic swing.
- Story: one boundary timer; no per-frame React scene updates.
- Traffic: seven SVG tracks/signals; reduced motion hides signals, and inactive scenes pause travel.
- Character atlas: about 249 KiB per style on disk. The homepage selects illustrated; the study loads the chosen variant.
- Existing source portrait PNG is about 914 KiB; the identity uses Next Image sizing. On-disk source size is not a measured transferred byte count.
- Retained legacy GLB is about 2.3 MiB and the pin PNG about 216 KiB. They should not be requested by the active homepage.

This review does not claim a frame-rate, battery, or heap-leak benchmark. CSS drop shadows, SVG paths, image decoding, and the large mobile jump still deserve a real-device profile if performance is a release criterion. Headless Chrome viewport checks are not physical-device measurements.

## 8. Verification and repeatable review

Run from the repository root:

```sh
npm run lint
PLAYWRIGHT_CHANNEL=chrome npm run test:browser -- tests/e2e/hero.spec.ts
```

The Playwright configuration builds production output and serves it on port 3100. Keep the user preview on 3101. Stop an existing production preview before replacing `.next`. Do not use an old dev server as evidence for the new build.

Coverage in the focused suite:

- Persistent portrait visible during combat; no canvas; primary links work.
- Phone width and reduced-motion still presentation.
- Illustrated/pixel switching, seeking, replay, and pause.
- Greeting rotation, user pause, and reduced motion.
- Four distinct tool stories and paused story clock.
- AI default; no audio voices before opt-in; cue generation and mute state.
- Idle label/traffic, inbound red mode, outbound secured mode, paused travel, later RCE defense, reduced-motion reset.

Visual review should capture the surname perch, leap, incoming attack, recoil, and patrol in light/dark and desktop/phone. Wait for short color/opacity transitions to settle before judging a held state. A full-page phone screenshot can distort sticky/animated content; prefer viewport or element captures.

Manual checks still recommended before public release: physical touch scrolling during the cross-column jump; Safari/WebKit and Firefox; actual speaker/headphone cue loudness; low-power hardware profiling; repeated background/foreground transitions and long-session memory observation. These are verification limits, not reproduced failures.

## 9. Change recipes and future improvements

**Add a story:** add truthful copy and a source in `SECURITY_STORIES`, add a nav icon, diagram, and any differing defense time. Keep the attack outcome specific; a product name is not a universal security guarantee. Update the distinct-story test.

**Change timing:** edit semantic constants and matching CSS percentages together. Test pause near boundaries, seek into combat, replay after patrol, reduced motion on/off, and fast-forward across a cycle. Keep flow and agents uniquely keyed.

**Change art:** preserve atlas cell layout, explicit clipping, viewBox proportions, and the red/green silhouettes. Review all poses, not only idle. Keep the source artwork/provenance files.

**Change identity layout:** preserve `guardian-name-anchor`, responsive portrait size, and the measurement observer. Inspect the initial pose and apex on both stacked and two-column layouts.

**Prioritized follow-up options:**

1. Profile actual mobile rendering before adding more effects. Consider shortening the mobile jump if it distracts from reading.
2. If stronger frame-accurate synchronization is needed, consolidate CSS and semantic timing under one Web Animations controller. The current boundary model is smaller, but timing edits require care in two places.
3. Add a site-wide motion preference only if users need a single control for greeting and story; respect the OS preference.
4. Remove dormant 3D dependencies/assets and legacy portrait CSS in a separate, dependency-usage-verified cleanup. Their presence alone is not runtime loading.
5. Consider a one-cycle-then-rest mode if the looping story competes with writing. This would be a behavior decision, not an unrequested change in this pass.

## 10. Evidence from this pass

- Production build/TypeScript and focused browser suite: seven tests passed after fixing duplicate keys and waiting for the media-change event in the reduced-motion test.
- ESLint and `git diff --check`: clean after audio cleanup refinement.
- Actual homepage browser inspection: zero canvases and zero requests for `.glb` or the legacy lanyard pin image during the captured opening/attack sequence.
- Desktop 1280×900: portrait beside identity; surname perch; red inbound attack; infrastructure and defense labels remain separate.
- Phone 375×900, dark: portrait remains beside name, theater fits without horizontal overflow (document width 375), and held attack/secured states are readable.
- Independent code/document review found no actionable blocker; that review did not replace the executed browser suite or device caveats above.

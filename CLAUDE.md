# APEX — concept site

Portfolio concept for a fictional night street-racing team (APEX Racing, NOCTURNE series).
Pure front-end, no backend, no CMS. Talk to the owner in Ukrainian; code, commits and file
names in English.

## Deviations from `nextjs-rules`

- **Tailwind v4, not SCSS modules** — tokens live in `src/styles/tokens.css` (`--apex-*`) and
  are exposed to Tailwind via `@theme` in `src/app/globals.css`. No literal colours in components.
- **Single locale (English), no `next-intl`** — copy is written in components.
- **Sections live in `src/components/sections/<name>/`** (per the brief), composed directly in
  `src/app/page.tsx`; there is no `views/` layer for a one-page site.
- **Animation is the point of the site** — GSAP + ScrollTrigger + Lenis, always with a
  `prefers-reduced-motion` path.
- Desktop-first.

## Scroll engine

- `ImageSequence` (server) reads `public/sequences/<scene>/manifest.json` at build time and renders
  `SequenceScrubber` (client), a sticky canvas scrubbed by ScrollTrigger (`use-image-sequence`).
- Two tiers per scene: the 960 `mobile` frames are drafts (the whole scene scrubs on them within
  a couple of seconds), the 2560 `desktop` frames replace them around the playhead. Phones load
  drafts only. The canvas draws the best loaded frame nearest the target.
- One page-wide `preloader` (`lib/sequence/preloader.ts`, 10 at a time) picks each next frame by
  priority relative to the current scene: its drafts → its sharp frames near the playhead → the
  next scene's drafts → the rest → the previous scene's drafts → the next scene's sharp frames.
  Scenes further away are left alone. Before the page is idle only urgent frames load (the
  opening frame, a coarse draft pass of the opening scene, frame 0 of every other scene).
- Frames are served `immutable` for a year, so every manifest carries a `version` (hash of video +
  fps + quality) appended as `?v=` — never serve changed frames under an unchanged URL.
- Lenis runs on GSAP's ticker (`use-lenis`); do not add a second rAF loop for scrolling.

## Scene transitions

- The choreography lives in `src/app/page.tsx`: every section after the first is wrapped in
  `<SceneEnter mode>`.
  - `continue` — for shots whose first frame is the previous last frame (garage → launch →
    turntable): overlaps 120svh, stays hidden, then cross-fades while both are pinned.
  - `curtain` — slides over the pinned previous stage, which scales to 0.92 and dims; the incoming
    top edge is feathered with a mask.
- A section can only be curtained over if it is pinned: sequences are; one-screen sections use
  `<Stage>` (200svh wrapper, sticky inner, `data-stage` + `data-stage-dim`).
- Overlay copy on sequences fades out over the last 15% (`lib/scene/fades.ts`) so nothing is cut
  at a hand-over. Chained `continue` scenes must share the zoom at the seam (garage ends at 1.12,
  launch starts at 1.12).

## Circuits / Drivers

- Circuits is a pinned reel (`use-circuits-reel`): draw → slide → draw…, ranges in
  `lib/circuits/reel.ts`. Desktop slides sideways, mobile stacks cards sliding up. The section
  accent is `data-accent`, and `--apex-accent` is a registered `@property`, so it transitions.
- Tracks are invented SVG paths with `pathLength=1`; tween `strokeDashoffset` with
  `autoRound: false` or GSAP rounds 0.x px to 0.
- Driver telemetry opens on mouse hover or a tap on the button; the closed panel is `inert`.

## Overlays locked to a sequence

- `lib/sequence/track-trigger.ts` builds a ScrollTrigger over the enclosing `[data-sequence-track]`,
  so an overlay reads the same progress as the canvas.
- Hotspots (`lib/machine/hotspots.ts`) are measured on the current turntable video in footage
  progress (0..1) and source-frame fractions. The machine scene holds its last frame for the final
  30% (`hold`, same constant in the hook). Re-generating that video means re-measuring them.
- Race HUD speed comes from scroll velocity (`lib/race/gearbox.ts`), ticking on GSAP's ticker only
  while the race track is active.
- Tailwind v4 `scale-*` / `translate-*` classes set the separate `scale` / `translate` properties —
  never put them on an element GSAP animates via `transform`; set the start value inline instead.

## Atmosphere (`components/fx`, mounted once in the layout)

- Rain: raw WebGL, one fragment shader (`lib/rain/shaders.ts`), rendered at 0.4–0.5 of CSS
  pixels. Each section sets `data-rain` (0..1); the shader eases between them and goes idle at 0.
- Grain: CSS-only tiled SVG noise, jittered with `steps()`. No blend modes (they force expensive
  compositing over the scrubbed canvases).
- `data-reveal` (+ `data-reveal-delay`) = rise-in on first view; `scanlines` is a Tailwind utility.

## Navigation & scroll cues

- `components/navigation/scroll-guide.tsx`: right-hand rail (one tick per `NAV_SECTIONS` entry in
  `lib/navigation/sections.ts`) + an idle "keep scrolling" nudge after 4 s. Adding a section means
  adding it there too.
- A section counts as current when it is actually visible (`sectionThreshold`), not when its top
  crosses the viewport — scenes overlap. Jumps land past the overlay fade-in (`use-scroll-guide`).
- Lenis is registered in `lib/scroll.ts` so anything can call `scrollToY`.

## Finish / signup

- Finish is a static image (`src/assets/finish/`) plus a signup form — no sequence.
- There is no backend: `lib/signup/submit-signup.ts` keeps spots in `localStorage` and is the only
  place to swap for a real POST. Race date and free-spot count live in `lib/race/next-race.ts`.

## Footage

- Scenes are Kling 3.0 pro 5 s clips upscaled to 2K @ 60 fps (Bytedance upscale), cut at 36 fps,
  WebP q80 `-m 6 -sharp_yuv` (`pnpm frames:extract <video> <scene> 36`). 36 fps is the sweet spot:
  ~10 px of scroll per frame; 48 fps added a third more weight for no visible gain.
- The opening scene (`priority`) loads a coarse pass first and the rest when the page is idle.

## Assets

- Raw Higgsfield output goes to `assets-src/` (gitignored). The approved car reference is
  `assets-src/reference/car-reference.png`.
- `pnpm frames:extract <video> <scene> [fps]` → `public/sequences/<scene>/{desktop,mobile}/NNNN.webp`
  (2560 / 960 wide, WebP q80 `-sharp_yuv`; 1920 was visibly soft on Retina) + `manifest.json`. ffmpeg here has no libwebp, so it uses `cwebp`.
- `pnpm frames:placeholder <scene> [frames] [hue]` writes numbered test frames; those folders
  carry their own `.gitignore` and are never committed.

## Testing

- Unit: Jest next to the code (`pnpm test`). E2E: Playwright in `tests/e2e` against the system Chrome
  (`channel: 'chrome'`, no browser download), desktop + Pixel 7, including a `reducedMotion`
  suite (`pnpm test:e2e`, builds must exist — it runs `pnpm start -p 3200`).
- The hero title uses nested spans on purpose: GSAP folds a running CSS `translate` into its own
  transform, so the CSS rise-in and the GSAP spread must never share an element.

## Commands

`pnpm dev` · `pnpm build` · `pnpm verify` (lint, typecheck, format, tests) · `pnpm test:e2e`

The preview pane cannot spawn servers inside `~/Documents` (macOS EPERM on cwd): start the server
from a terminal (`pnpm start -p 3100`) and attach via `.claude/launch.json`.

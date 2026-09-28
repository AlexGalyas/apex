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
- Frames load through one shared queue (6 at a time): the first frame on mount, the full set
  coarse-to-fine when the section is within 1.5 viewports; `priority` loads everything on mount.
- Frames are served `immutable` for a year, so every manifest carries a `version` (hash of video +
  fps + quality) appended as `?v=` — never serve changed frames under an unchanged URL.
- Lenis runs on GSAP's ticker (`use-lenis`); do not add a second rAF loop for scrolling.

## Finish / signup

- Finish is a static image (`src/assets/finish/`) plus a signup form — no sequence.
- There is no backend: `lib/signup/submit-signup.ts` keeps spots in `localStorage` and is the only
  place to swap for a real POST. Race date and free-spot count live in `lib/race/next-race.ts`.

## Assets

- Raw Higgsfield output goes to `assets-src/` (gitignored). The approved car reference is
  `assets-src/reference/car-reference.png`.
- `pnpm frames:extract <video> <scene> [fps]` → `public/sequences/<scene>/{desktop,mobile}/NNNN.webp`
  (1920 / 960 wide, WebP q75) + `manifest.json`. ffmpeg here has no libwebp, so it uses `cwebp`.
- `pnpm frames:placeholder <scene> [frames] [hue]` writes numbered test frames; those folders
  carry their own `.gitignore` and are never committed.

## Commands

`pnpm dev` · `pnpm build` · `pnpm verify` (lint, typecheck, format, tests)

The preview pane cannot spawn servers inside `~/Documents` (macOS EPERM on cwd): start the server
from a terminal (`pnpm start -p 3100`) and attach via `.claude/launch.json`.

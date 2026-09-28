# APEX Racing — concept site

A portfolio concept for a fictional night street-racing team in the fictional NOCTURNE series
(Tokyo, Monaco, Dubai). The whole page is one cinematic scroll: generated footage scrubbed frame by
frame, scenes that hand over without seams, and a lens-rain shader over everything.

> Fictional brand. No real teams, drivers, cars or series are depicted or endorsed.

## Highlights

- **Scroll-scrubbed image sequences** on `<canvas>` — prioritised, coarse-to-fine frame loading,
  pre-decoded frames, versioned immutable caching.
- **Scene choreography** — `continue` cross-fades for shots that share a frame, `curtain` slides
  for the rest, all declared in one place (`src/app/page.tsx`).
- **Circuits reel** — pinned horizontal scroll, SVG tracks that draw themselves, counters, and an
  accent colour that transitions per city via a registered `@property`.
- **The Machine** — spec hotspots tracked onto the rotating car, measured per frame.
- **Race HUD** — speedometer and gearbox driven by scroll _velocity_.
- **Lens rain** — a single raw-WebGL fragment shader, intensity set per section.
- `prefers-reduced-motion` gets a calm, fully readable page; Lighthouse 100 desktop / 98 mobile.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · WebGL ·
Jest · Playwright. Imagery and footage generated with Higgsfield (Nano Banana Pro, Kling 3.0).

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm verify         # lint, typecheck, format, unit tests
pnpm build && pnpm test:e2e
```

Frames live in `public/sequences/<scene>/`; `pnpm frames:extract <video> <scene> [fps]` rebuilds a
scene from a source video (needs `ffmpeg` and `cwebp`).

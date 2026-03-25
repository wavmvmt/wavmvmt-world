@AGENTS.md

# WAVMVMT World

## Read First
- BUILDSYSTEM.md — 12-discipline scoring system
- BUILDLIST.md — Master feature list with status
- src/lib/roomConfig.ts — All room definitions, positions, colors
- src/lib/performanceMode.ts — Performance tiers (low/medium/high)
- src/lib/audioManager.ts — Centralized audio singleton (ALL audio routes here)

## Stack
- Next.js 16.2 + React Three Fiber + Three.js r183 + Tailwind + Supabase
- Vercel deployment (GitHub push → auto-deploy)
- Supabase project: vutsqfyyfoppebqsbjpx

## Architecture
- `src/components/three/` — All 3D scene components (R3F)
- `src/components/` — UI overlay components (React)
- `src/lib/audioManager.ts` — Single AudioContext for ALL audio
- `src/lib/performanceMode.ts` — Performance gating (low/medium/high)
- `src/lib/roomConfig.ts` — Room definitions, positions, colors, worker data
- `src/lib/accessibility.ts` — Reduced motion/high contrast detection
- `src/lib/errorReporting.ts` — logError with dev/prod modes

## Key Patterns
- **audioManager singleton** — Never create raw `new AudioContext()`. Use `audioManager.init()`, `.playOneShot()`, `.playLoop()`, `.createOscillator()`.
- **Performance gating** — Components in SceneContent.tsx are gated by `perf.enableParticles`, `perf.enableDecorations`, `perf.enableOutdoor`, `perf.enableWeather`. HIGH ONLY: fireflies, rain, outdoor zone, weather, cranes, etc. MEDIUM+: sparks, decorations, construction props.
- **Lerp movement** — Player velocity uses `smoothVel.lerp(targetVel, delta * 8)` for buttery acceleration/deceleration.
- **CustomEvent communication** — Components communicate via `window.dispatchEvent(new CustomEvent(...))`: `playerMove`, `playFootstep`, `roomInteract`, `toggleAudio`, `startAudio`, `openShare`.
- **Reduced motion** — Particle components (DustMotes, Sparks, Fireflies, PlayerTrail) return null if `prefersReducedMotion()`.

## Rules
1. Never stop to ask. Make the best decision and continue.
2. Run `npx tsc --noEmit` after changes. Run `npm run build` before commit.
3. Conventional commits: `feat(scope):`, `fix(scope):`, `perf(scope):`, `refactor(scope):`
4. TypeScript strict. No `any` types. No `@ts-ignore`.
5. Mobile-first. Test `window.innerWidth < 768` paths in every component.
6. Jake's Rule: "Think Flappy Bird before GTA6." Polish > features.
7. Performance budget: Target 60fps desktop, 30fps mobile. Every change must not regress FPS.
8. All audio through audioManager — no raw AudioContext in components.

# WAVMVMT World — Autonomous Build Prompt
# Phase 1: Core Experience Polish (The Flappy Bird Phase)
# Created by Shim (Saadiq Abdullah Khan) | WAVMVMT
# Using the WAVMVMT Autonomous Build System
# Date: March 25, 2026

---

## CONTEXT

You are the WAVMVMT World Build Runner. Execute ALL 3 PHASES (9 agents) sequentially.
Do NOT stop to ask questions. Fix errors and continue. Type nothing except code and commits.

**Repo:** ~/wavmvmt-world (or wherever you cloned it)
**Branch strategy:** main (production) — each agent creates a feature branch, merges to main
**Deploy:** GitHub push → Vercel auto-deploys
**Stack:** Next.js 16.2 + React Three Fiber + Three.js r183 + Tailwind + Supabase
**Database:** Supabase project vutsqfyyfoppebqsbjpx (tables already exist: world_users, world_visits, world_messages)

## READ FIRST
1. `BUILDSYSTEM.md` — 12-discipline scoring (understand current state)
2. `BUILDLIST.md` — Master feature list with status
3. `src/lib/roomConfig.ts` — All room definitions, positions, colors
4. `src/lib/performanceMode.ts` — Performance tiers (low/medium/high)
5. `src/components/three/SceneContent.tsx` — Everything loaded in the 3D scene

## CURRENT STATE AUDIT
- 134 TypeScript files, 55 Three.js components, 46 UI components, 13 pages
- SceneContent.tsx loads 50+ components — many NOT gated by performance level
- Player.tsx creates its own AudioContext bypassing master volume
- BirdSounds.tsx creates its own AudioContext (fixed but verify)
- No geometry instancing — every worker/prop is unique geometry
- No LOD (Level of Detail) system
- No frustum culling beyond Three.js defaults
- No music tracks — only construction foley/SFX
- Mobile FPS likely <30 on mid-range devices
- Movement/camera feel needs tuning per user feedback

## UNIVERSAL RULES

1. **Never stop to ask.** Make the best decision and continue.
2. **Fix errors immediately.** If `tsc` or `build` fails, fix before proceeding.
3. **QA gate after each agent.** `npx tsc --noEmit && npm run build` must pass.
4. **Conventional commits:** `feat(scope):`, `fix(scope):`, `perf(scope):`, `refactor(scope):`
5. **TypeScript strict.** No `any` types. No `@ts-ignore`.
6. **Preserve backward compatibility.** Nothing that works today should break.
7. **Each agent:** branch → build → verify → fix → merge → next agent.
8. **Mobile-first.** Test `window.innerWidth < 768` paths in every component.
9. **Jake's Rule:** "Think Flappy Bird before GTA6." Polish > features.
10. **Performance budget:** Target 60fps desktop, 30fps mobile. Every agent must not regress FPS.

---

## HORIZONTAL SLICE SCORING — PHASE 1 TARGET

After Phase 1 completes, these disciplines should reach these minimums:

| # | Discipline | Current | Target | Focus |
|---|-----------|---------|--------|-------|
| 1 | Architecture | 10% | 15% | Performance config expansion |
| 2 | Structural | 10% | 20% | Movement, camera, collision |
| 3 | Mechanical | 8% | 18% | Audio routing, volume system |
| 4 | Interior | 12% | 22% | Lighting, materials optimization |
| 5 | Fixtures | 5% | 12% | Room interactions foundation |
| 6 | Safety | 3% | 8% | Input validation, error boundaries |
| 7 | Accessibility | 0% | 5% | Keyboard nav, reduced motion |
| 8 | Landscaping | 15% | 18% | OG tags, loading optimization |
| 9 | Inspection | 2% | 12% | Dev mode, perf profiling |
| 10 | Utilities | 10% | 12% | Deploy pipeline, error logging |
| 11 | Furnishing | 8% | 12% | Audio content, room descriptions |
| 12 | Operations | 2% | 5% | Admin basics, visitor analytics |

**Rule: No discipline at 0% after Phase 1.**

---

## PHASE 1: PERFORMANCE & MOVEMENT (The Foundation)
*"A few solid features with a clean experience goes further than building the whole operating system." — Jake Lately*

### AGENT 1: PERFORMANCE PASS [branch: feat/perf-pass]

**Scope:** Reduce draw calls, add geometry instancing, gate more components by performance level, implement LOD. Do NOT change any visual appearance — same look, fewer GPU calls.

**Files to Modify:**
- `src/components/three/SceneContent.tsx` — Gate all non-essential components by perf level
- `src/lib/performanceMode.ts` — Add more granular controls, add `enableParticles`, `enableDecorations`, `enableOutdoor`, `enableWeather`, `maxLights`
- `src/components/three/Workers.tsx` — Implement InstancedMesh for worker bodies (all same geometry, different transforms)
- `src/components/three/DustMotes.tsx` — Reduce particle count on low/medium
- `src/components/three/Sparks.tsx` — Reduce particle count on low/medium
- `src/components/three/ConstructionProps.tsx` — Merge static geometries where possible
- `src/components/World3D.tsx` — Reduce fog density slightly, reduce post-processing intensity on medium

**Key Implementation Details:**
```
SceneContent.tsx changes:
- Move these to HIGH ONLY: Fireflies, RainEffect, OutdoorZone, ExteriorDetails, 
  GlobalExpansionGlobe, LiveWeather, FootprintHeatmap, InspirationalQuotes, 
  MembershipBillboard, ConstructionCrane, FloorMarkings, PlayerTrail
- Move these to MEDIUM+: Sparks, PhaseProps, Decorations, BulletinBoard, 
  SiteClock, Skateboards, ParkourTrampolines, RemainingRoomFX
- ALWAYS render: Warehouse, Player, RoomInteriors, Workers, AmbientAudio, 
  DustMotes (reduced), AnimatedDoors, LightShafts, Signage, NightSky

Workers.tsx instancing pattern:
- Create ONE CylinderGeometry, ONE SphereGeometry for body parts
- Use InstancedMesh with count = perf.maxWorkers
- Set per-instance transforms and colors via instanceMatrix and instanceColor
- This alone should cut draw calls by 60-100 calls
```

**Do NOT Touch:** HUD.tsx, Minimap.tsx, VolumeControl.tsx, FPSCounter.tsx, any page file, any API route

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 1 PASS" || echo "❌ FIX"
# Verify SceneContent still exports correctly
grep -c "perf\." src/components/three/SceneContent.tsx  # should be > 10
```

---

### AGENT 2: MOVEMENT & CAMERA [branch: feat/movement]

**Scope:** Make walking around feel buttery smooth. Fix camera jitter, improve collision detection, add smooth acceleration/deceleration, improve mouse look sensitivity. This is the #1 user complaint.

**Files to Modify:**
- `src/components/three/Player.tsx` — Complete movement overhaul:
  - Smooth acceleration/deceleration (lerp velocity, not instant)
  - Camera bob while walking (subtle sinusoidal)
  - Smooth mouse look with adjustable sensitivity
  - Better sprint feel (FOV widens slightly when sprinting)
  - Fix: route footstep AudioContext through global volume system
  - Collision: use simple AABB checks against room boundaries from roomConfig
  - Camera height: eye level at y=8 (adult standing height relative to scene)
  - Pointer lock: better enter/exit handling, show cursor when ESC pressed
  - Touch controls: smoother response, less jittery camera on mobile

**Key Implementation Details:**
```typescript
// Smooth movement pattern (replace instant velocity)
const targetVel = new THREE.Vector3()
// ... compute target from input
velocity.lerp(targetVel, delta * 8) // smooth acceleration

// Camera bob
const bobAmount = isMoving ? Math.sin(walkPhase * 6) * 0.08 : 0
camera.position.y = baseY + bobAmount

// Sprint FOV
const targetFov = isSprinting ? 62 : 55
camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 4)
camera.updateProjectionMatrix()

// Mouse sensitivity
const MOUSE_SENSITIVITY = 0.002 // adjustable
yaw -= movementX * MOUSE_SENSITIVITY
pitch -= movementY * MOUSE_SENSITIVITY
pitch = THREE.MathUtils.clamp(pitch, -Math.PI/3, Math.PI/3)
```

**Do NOT Touch:** SceneContent.tsx (Agent 1's work), any UI component, any room component, performanceMode.ts

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 2 PASS" || echo "❌ FIX"
grep "lerp" src/components/three/Player.tsx  # smooth movement exists
```

---

### AGENT 3: AUDIO SYSTEM [branch: feat/audio-system]

**Scope:** Centralize all audio through one master AudioContext. Add volume slider support everywhere. Add background music loop capability (the files may not exist yet, but the system should be ready). Fix BirdSounds and Player footsteps to route through master.

**Files to Create:**
- `src/lib/audioManager.ts` — Singleton audio manager:
  ```typescript
  class AudioManager {
    private ctx: AudioContext
    private masterGain: GainNode
    private musicGain: GainNode
    private sfxGain: GainNode
    private ambientGain: GainNode
    
    setMasterVolume(v: number): void
    setMusicVolume(v: number): void
    setSFXVolume(v: number): void
    playOneShot(url: string, category: 'sfx'|'ambient'|'music', volume?: number): void
    playLoop(url: string, category: 'sfx'|'ambient'|'music', volume?: number): AudioBufferSourceNode
    getMuted(): boolean
    toggleMute(): void
  }
  export const audioManager = new AudioManager()
  ```

**Files to Modify:**
- `src/components/three/AmbientAudio.tsx` — Use audioManager instead of own AudioContext
- `src/components/three/BirdSounds.tsx` — Use audioManager instead of own AudioContext
- `src/components/three/Player.tsx` — Use audioManager for footsteps (remove local AudioContext)
- `src/components/three/CafeAmbient.tsx` — Use audioManager
- `src/components/three/RoomAmbience.tsx` — Use audioManager
- `src/components/VolumeControl.tsx` — Wire to audioManager.setMasterVolume()

**Do NOT Touch:** SceneContent.tsx, Warehouse.tsx, Workers.tsx, any page, HUD.tsx, Minimap.tsx

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 3 PASS" || echo "❌ FIX"
[ -f "src/lib/audioManager.ts" ] && echo "✅ audioManager exists" || echo "❌ MISSING"
grep -c "audioManager" src/components/three/AmbientAudio.tsx  # should be > 0
```

---

## PHASE 1 CHECKPOINT
```bash
echo "=== PHASE 1 CHECKPOINT ==="
npx tsc --noEmit && npm run build && echo "✅ PHASE 1 PASS" || echo "❌ FIX BEFORE PHASE 2"
# Verify key files
[ -f "src/lib/audioManager.ts" ] && echo "✅ audioManager" || echo "❌"
grep "InstancedMesh\|instancedMesh" src/components/three/Workers.tsx && echo "✅ instancing" || echo "⚠️ no instancing found"
grep "lerp" src/components/three/Player.tsx && echo "✅ smooth movement" || echo "❌"
```

**Commit and push to main. Wait for Vercel deploy. Verify https://wavmvmt-world.vercel.app/world loads.**

---

## PHASE 2: ENGAGEMENT & FEEL

### AGENT 4: ROOM INTERACTIONS [branch: feat/room-interact]

**Scope:** When you press E near a room, something happens. Each room gets a basic interaction. Keep it simple — text popup, sound change, or visual effect. NOT full room mechanics (that's Phase 3+).

**Files to Modify:**
- `src/components/three/RoomInteractions.tsx` — Expand interaction system:
  - Detect player proximity to each room (within 15 units of room center)
  - Show "Press E to interact" tooltip (dispatch event for RoomTooltip)
  - On E press: dispatch room-specific event
- `src/components/RoomTooltip.tsx` — Show room name + interaction hint when near
- `src/components/RoomNotification.tsx` — Show room info popup on interaction

**Key Implementation: Room interaction map:**
```typescript
const ROOM_INTERACTIONS: Record<string, { hint: string, action: string }> = {
  'Parkour Gym': { hint: 'View obstacle course plans', action: 'showGallery' },
  'Sound Bath': { hint: 'Play a singing bowl', action: 'playSoundBowl' },
  'Music Studio': { hint: 'Try the beat pads', action: 'activateBeatPads' },
  'Cafe & Lounge': { hint: 'Check the menu', action: 'showMenu' },
  'Amphitheatre': { hint: 'Step on stage', action: 'spotlightOn' },
  'Weight Training': { hint: 'View equipment list', action: 'showEquipment' },
  'Yoga Room': { hint: 'Start a breathing exercise', action: 'breathingMode' },
  'Photo Studio': { hint: 'Take a photo', action: 'photoMode' },
  'Video Studio': { hint: 'Start recording', action: 'recordMode' },
  'Recovery Suite': { hint: 'View cold plunge specs', action: 'showSpecs' },
  'Spa & Wellness': { hint: 'Book a session', action: 'showBooking' },
  'Education Wing': { hint: 'Browse courses', action: 'showCourses' },
  'Front Desk': { hint: 'Check in', action: 'checkIn' },
}
```

**Do NOT Touch:** Player.tsx (Agent 2's work), audioManager.ts, SceneContent.tsx, performanceMode.ts

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 4 PASS" || echo "❌ FIX"
```

---

### AGENT 5: ACCESSIBILITY FOUNDATION [branch: feat/a11y]

**Scope:** Get accessibility from 0% to 5%. Minimum viable: reduced motion support, keyboard focus indicators, skip-to-content, aria labels on interactive elements. This is a horizontal slice requirement — no discipline stays at 0%.

**Files to Create:**
- `src/lib/accessibility.ts` — Preferences detection:
  ```typescript
  export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  export function prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: more)').matches
  }
  ```

**Files to Modify:**
- `src/components/three/DustMotes.tsx` — Skip particles if `prefersReducedMotion()`
- `src/components/three/Sparks.tsx` — Skip particles if `prefersReducedMotion()`
- `src/components/three/Fireflies.tsx` — Skip if `prefersReducedMotion()`
- `src/components/three/PlayerTrail.tsx` — Skip if `prefersReducedMotion()`
- `src/components/SplashScreen.tsx` — Add `aria-label`, keyboard-focusable Enter button
- `src/components/HUD.tsx` — Add `aria-label` to interactive buttons
- `src/app/layout.tsx` — Add `<html lang="en">` if missing, meta viewport

**Do NOT Touch:** Player.tsx, audioManager.ts, Workers.tsx, SceneContent.tsx, performanceMode.ts

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 5 PASS" || echo "❌ FIX"
[ -f "src/lib/accessibility.ts" ] && echo "✅ a11y lib" || echo "❌"
grep "aria-label" src/components/SplashScreen.tsx && echo "✅ aria" || echo "❌"
grep "prefers-reduced-motion\|prefersReducedMotion" src/components/three/DustMotes.tsx && echo "✅ reduced motion" || echo "❌"
```

---

### AGENT 6: ERROR HANDLING & SAFETY [branch: feat/safety]

**Scope:** Get Safety discipline from 3% to 8%. Add error boundaries around 3D scene, handle WebGL context loss gracefully, validate all user inputs, add console error suppression in production.

**Files to Modify:**
- `src/components/SceneErrorBoundary.tsx` — Improve with:
  - WebGL context loss detection and recovery message
  - "Your device may not support 3D" fallback for no-WebGL
  - Retry button
- `src/components/WorldLoader.tsx` — Add timeout: if scene doesn't load in 15s, show fallback
- `src/components/three/Player.tsx` — Wrap pointer lock in try/catch (some browsers restrict)
- `src/app/layout.tsx` — Add global error boundary, suppress console errors in production

**Files to Create:**
- `src/lib/errorReporting.ts` — Simple error logger:
  ```typescript
  export function logError(context: string, error: unknown) {
    if (process.env.NODE_ENV === 'production') {
      // Silent in prod, or send to service
      console.warn(`[WAVMVMT] ${context}:`, error)
    } else {
      console.error(`[WAVMVMT] ${context}:`, error)
    }
  }
  ```

**Do NOT Touch:** Any Three.js scene component (except Player.tsx pointer lock fix), audioManager.ts, HUD.tsx

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 6 PASS" || echo "❌ FIX"
[ -f "src/lib/errorReporting.ts" ] && echo "✅ error reporting" || echo "❌"
```

---

## PHASE 2 CHECKPOINT
```bash
echo "=== PHASE 2 CHECKPOINT ==="
npx tsc --noEmit && npm run build && echo "✅ PHASE 2 PASS" || echo "❌ FIX BEFORE PHASE 3"
[ -f "src/lib/accessibility.ts" ] && echo "✅ a11y" || echo "❌"
[ -f "src/lib/errorReporting.ts" ] && echo "✅ errors" || echo "❌"
```

**Commit and push to main.**

---

## PHASE 3: LOADING & SHARE

### AGENT 7: LOADING OPTIMIZATION [branch: feat/loading]

**Scope:** Reduce initial load time. Lazy-load non-essential Three.js components. Add proper loading progress. Optimize asset delivery.

**Files to Modify:**
- `src/components/LoadingScreen.tsx` — Show real progress (count loaded components)
- `src/components/three/SceneContent.tsx` — Lazy-load Phase 2/3 components:
  ```typescript
  // Lazy load non-essential after scene is interactive
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 3000) // load extras after 3s
    return () => clearTimeout(timer)
  }, [])
  
  // ... in JSX:
  {loaded && perf.enableDecorations && <Decorations />}
  {loaded && <PhaseProps />}
  // etc.
  ```
- `src/components/SplashScreen.tsx` — Preload critical audio during splash screen wait
- `next.config.ts` — Add image optimization config if missing

**Do NOT Touch:** Player.tsx, audioManager.ts, Workers.tsx, any page file except world

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 7 PASS" || echo "❌ FIX"
```

---

### AGENT 8: SHARE & SCREENSHOT [branch: feat/share]

**Scope:** Make sharing work properly. Screenshot captures the 3D scene, generates a share card, opens native share or copy-to-clipboard.

**Files to Modify:**
- `src/components/ShareCard.tsx` — Improve share flow:
  - Screenshot button captures WebGL canvas → blob → downloadable PNG
  - Pre-written share text with room name if near a room
  - Copy link button
  - Native Web Share API on mobile (navigator.share)
- `src/components/three/Player.tsx` — Dispatch current room name on playerMove event
- `src/components/PhotoMode.tsx` — Wire to actual canvas capture (use renderer.domElement.toBlob)

**Do NOT Touch:** SceneContent.tsx, audioManager.ts, Workers.tsx, HUD.tsx (except add share event dispatch)

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 8 PASS" || echo "❌ FIX"
```

---

### AGENT 9: CLAUDE.md + BUILD REPORT [branch: feat/docs]

**Scope:** Update CLAUDE.md with proper instructions for future builds. Generate BUILD_REPORT.md. Update BUILDLIST.md status. Tag the release.

**Files to Create/Modify:**
- `CLAUDE.md` — Replace with comprehensive instructions:
  ```markdown
  # WAVMVMT World — Claude Code Instructions
  
  ## Read First
  - BUILDSYSTEM.md (12-discipline scoring)
  - BUILDLIST.md (feature status)
  - src/lib/roomConfig.ts (room definitions)
  - src/lib/performanceMode.ts (perf tiers)
  - src/lib/audioManager.ts (centralized audio)
  
  ## Rules
  - Never stop to ask. Fix errors and continue.
  - `npx tsc --noEmit` after every file change
  - `npm run build` before committing
  - Conventional commits: feat(), fix(), perf(), refactor()
  - Mobile test: check window.innerWidth < 768 paths
  - Jake's Rule: Flappy Bird before GTA6
  - Performance budget: 60fps desktop, 30fps mobile
  - No new npm packages without checking bundle size impact
  
  ## Stack
  - Next.js 16.2 + React Three Fiber + Three.js r183 + Tailwind
  - Supabase (project: vutsqfyyfoppebqsbjpx)
  - Deploy: Vercel (auto from GitHub push to main)
  
  ## Architecture
  - src/components/three/ — All 3D scene components
  - src/components/ — UI overlay components
  - src/lib/audioManager.ts — ALL audio goes through this
  - src/lib/performanceMode.ts — Gate components by device capability
  - src/lib/roomConfig.ts — Room positions, colors, features
  - src/lib/accessibility.ts — Reduced motion, contrast preferences
  
  ## Key Patterns
  - Audio: `import { audioManager } from '@/lib/audioManager'` — never create raw AudioContext
  - Performance: Check `perf.enableX` before rendering expensive components
  - Movement: Player.tsx uses lerp-based smooth movement — maintain this pattern
  - Events: Components communicate via window.dispatchEvent(new CustomEvent(...))
  ```

- `BUILD_REPORT.md` — Auto-generated build report (follow template from Build System doc)
- `BUILDLIST.md` — Update status of completed items

**Do NOT Touch:** Any source code file

**QA Gate:**
```bash
npx tsc --noEmit && npm run build && echo "✅ Agent 9 PASS" || echo "❌ FIX"
[ -f "BUILD_REPORT.md" ] && echo "✅ build report" || echo "❌"
git tag -a v1.1-phase1 -m "Phase 1: Core Experience Polish" 2>/dev/null
```

---

## FINAL QA
```bash
echo "========================================="
echo "  WAVMVMT WORLD — FINAL QA"
echo "========================================="

# 1. Types
npx tsc --noEmit && echo "✅ Types pass" || echo "❌ Types FAIL"

# 2. Build
npm run build && echo "✅ Build pass" || echo "❌ Build FAIL"

# 3. Critical file existence
for f in \
  src/lib/audioManager.ts \
  src/lib/accessibility.ts \
  src/lib/errorReporting.ts \
  BUILD_REPORT.md \
  ; do
  [ -f "$f" ] && echo "✅ $f" || echo "❌ $f MISSING"
done

# 4. Performance gates
grep -c "perf\.\|enableShadows\|enablePostProcessing\|enableCeilingFans\|enableRoomIcons\|enableParticles\|enableDecorations\|enableOutdoor\|enableWeather" src/components/three/SceneContent.tsx
echo "(should be 15+ perf checks)"

# 5. Audio centralization
grep -rn "new AudioContext" src/components/ --include="*.tsx" | grep -v audioManager
echo "(should be EMPTY — all AudioContext creation in audioManager only)"

# 6. Accessibility
grep -rn "prefersReducedMotion\|aria-label\|prefers-reduced-motion" src/ --include="*.tsx" --include="*.ts" | wc -l
echo "(should be 5+ accessibility references)"

# 7. Git log
git log --oneline -15

# 8. Push
git push origin main
echo "✅ DEPLOYED — check https://wavmvmt-world.vercel.app"
```

---

## BUILD REPORT TEMPLATE

Generate this as `BUILD_REPORT.md`:

```markdown
# WAVMVMT World — Build Report
## Phase 1: Core Experience Polish
## Date: [auto-generate]

### Phase 1: Performance & Movement
- Agent 1 (Performance Pass): [PASS/FAIL]
- Agent 2 (Movement & Camera): [PASS/FAIL]
- Agent 3 (Audio System): [PASS/FAIL]

### Phase 2: Engagement & Feel
- Agent 4 (Room Interactions): [PASS/FAIL]
- Agent 5 (Accessibility): [PASS/FAIL]
- Agent 6 (Error Handling): [PASS/FAIL]

### Phase 3: Loading & Share
- Agent 7 (Loading Optimization): [PASS/FAIL]
- Agent 8 (Share & Screenshot): [PASS/FAIL]
- Agent 9 (Docs & Report): [PASS/FAIL]

### Horizontal Slice Scores (Post-Build)
| # | Discipline | Before | After |
|---|-----------|--------|-------|
| 1 | Architecture | 10% | __% |
| 2 | Structural | 10% | __% |
| 3 | Mechanical | 8% | __% |
| 4 | Interior | 12% | __% |
| 5 | Fixtures | 5% | __% |
| 6 | Safety | 3% | __% |
| 7 | Accessibility | 0% | __% |
| 8 | Landscaping | 15% | __% |
| 9 | Inspection | 2% | __% |
| 10 | Utilities | 10% | __% |
| 11 | Furnishing | 8% | __% |
| 12 | Operations | 2% | __% |

### Decisions Made Autonomously
[List what was decided without asking]

### Known Issues
[What doesn't fully work]

### What's Next (Phase 2 Prompt)
[Features deferred]
```

---

## BEGIN NOW

Start with Agent 1: Performance Pass.
Create branch `feat/perf-pass` from main.
Read `src/components/three/SceneContent.tsx` and `src/lib/performanceMode.ts` first.
Execute the full scope. Run QA. Fix any failures. Merge to main. Proceed to Agent 2.

Do not stop until all 9 agents are complete and BUILD_REPORT.md is generated.

Type "continue" if you pause.

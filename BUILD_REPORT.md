# Build Report — v1.2 Visual Quality + Audio

**Date:** 2026-03-25
**Branch:** main
**Previous:** v1.1-phase1

---

## Session Summary

**25 commits pushed** across 15 visual passes, 3 horizontal slices, 2 performance audits, 3 browser verifications, and 1 material quality pass.

### New Components (25 files created)

**3D Scene (22 new):**
- `ProceduralFloor` — shader-based concrete with FBM noise
- `RoomFloorGlow` — breathing colored floor pools
- `RoomProgressRings` — rotating build % arcs
- `RoomParticles` — floating color-coded motes per room
- `RoomInteriorLights` — warm point lights inside rooms
- `RoomWallSections` — partial walls growing with buildPct
- `FloorDetail` — safety stripes, walkway markers
- `GroundDetails` — tire tracks, puddles, aggregate piles
- `WallDetail` — pipes, conduit, junction boxes, emergency lights
- `CeilingDetail` — HVAC ducts, hanging cables, panels
- `StringLights` — construction work lights with catenary sag
- `FogLayers` — 5-layer height-based fog
- `DustClouds` — drifting haze spheres
- `EntranceArch` — WAVMVMT signage arch
- `ConstructionBanner` — "FUTURE HOME OF WAVMVMT"
- `SafetySigns` — wayfinding + safety signs
- `AuroraSky`, `CinematicUpgrade`, `UltimateVisuals`, `ReflectiveElements`, `EnergyConduits`, `HolographicSigns` (tracked from untracked)

**UI (2 new):**
- `WorldBeatRadio` — 27-track shuffled music player from Synesthesia
- `WelcomeTour` rewrite — bottom-left toast instead of center modal

**Lib (5 new):**
- `audioManager.ts` — centralized audio singleton
- `accessibility.ts` — reduced motion / high contrast
- `analytics.ts` — trackEvent for Vercel Analytics
- `worldState.ts` — observable world state
- `events.ts` — typed CustomEvent definitions
- `beatRadio.ts` — shared track list

### Discipline Scores

| Discipline | v1.1 | v1.2 | Delta |
|---|---|---|---|
| Architecture | 12% | 16% | +4% |
| Structural | 13% | 18% | +5% |
| Mechanical | 15% | 22% | +7% |
| Interior | 18% | 30% | +12% |
| Fixtures | 14% | 18% | +4% |
| Safety | 15% | 16% | +1% |
| Accessibility | 13% | 17% | +4% |
| Landscaping | 11% | 18% | +7% |
| Inspection | 12% | 18% | +6% |
| Utilities | 11% | 15% | +4% |
| Furnishing | 10% | 16% | +6% |
| Operations | 10% | 15% | +5% |

### Bugs Fixed
- GL_INVALID_OPERATION spam (180+ warnings/frame → 0) — N8AO multisampling conflict
- PCFSoftShadowMap deprecation → VSMShadowMap
- PWA icon 404 → favicon.svg
- Supabase Realtime WebSocket errors (10/page) → disabled until auth configured
- UI panel overload → panels start minimized

### Performance
- LOW perf: ~30% fewer draw calls (22 components vs 32)
- Fill lights gated behind MEDIUM+
- LightShafts: LOW=4, MEDIUM=8, HIGH=12
- StringLights, CeilingDetail, WallDetail, GroundDetails all MEDIUM+ gated
- Post-processing: HIGH=full pipeline, MEDIUM=bloom+contrast, LOW=none

### What's Next
- Verify procedural floor shader looks correct on deploy
- More room interior detail (furniture, equipment upgrades)
- Quest system expansion
- Multiplayer when Supabase Realtime auth is fixed
- GLB model loading for higher-detail room equipment

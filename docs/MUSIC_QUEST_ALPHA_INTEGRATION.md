# WAVMVMT World — Music Studio playable alpha bridge

Status: **DRAFT / REVIEW ONLY**, 2026-10-12. No production deployment approved.

## Architecture: two independent WAVMVMT repositories

- Game design and original static alpha: `wavmvmt/wavmvmt-world-game`, draft PR #2, `prototype/playable-alpha.html`.
- Existing 3D virtual Center: `wavmvmt/wavmvmt-world`, branch `feature/studio-music-quest-alpha`.
- The 3D branch stages a reviewed copy of the alpha at `public/alpha/music-quest.html`. Next.js will serve it at `/alpha/music-quest.html` after that branch is deployed. This is **not yet a live route**.
- `StudioQuestGateway.tsx` is mounted by `UIOverlay.tsx`, which remains outside the Three.js Canvas. The gateway uses the existing `playerMove` event and the canonical Music Studio rectangle from `src/lib/roomConfig.ts`.
- Players must move near the Music Studio and explicitly activate **Play**. There is no forced redirect, no 3D engine transplant, and no dependence on Lovable credits.
- The alpha opens with `?from=world` at the Studio view, and has a **Back to 3D Center** link at `/world`.
- The demo uses one origin-local `localStorage` key, `wavmvmt-world-alpha-v1`. The Studio proximity prompt reads the completion flag when the 3D world mounts. This is not cross-device sync, a public profile, or a server-side achievement.
- Do not merge this with the private WAVMVMT CORE app or its Supabase database. HQ can track decisions and links but never becomes a public game backend.

## What this branch adds

1. `public/alpha/music-quest.html`: standalone working beat pattern quest, optional audio, Mind Palace SVG, local export/reset.
2. `src/components/StudioQuestGateway.tsx`: reachable in all quality modes, including low/potato mode. Does not add 3D draw calls.
3. `src/components/UIOverlay.tsx`: mounts only that separate optional gateway.
4. `scripts/check-music-quest.mjs`: Node built-in smoke checks for static source, JavaScript syntax and pattern rules.

## Verification requirements before merging

Run from a checkout of the **feature branch**, not from main:

```sh
node scripts/check-music-quest.mjs
npm install
npx tsc --noEmit
npm run build
npm run dev
```

Manual checks on desktop and a real phone (including `/world?q=low`):

- Enter World, walk to the Music Studio at x=110, z=50; gateway appears only near it and remains tappable.
- Select Play; navigating away does not accidentally trigger pointer lock.
- Alpha opens in Studio view; browser Back and **Back to 3D Center** return as expected.
- In the Studio, load the starter groove, play eight steps, finish; missing any required beat must block completion.
- Switch Sound ON after a user gesture; verify sounds and mute on iOS, Android, and desktop. Visual playback must function with audio off.
- Return to World and walk back to the Music Studio; gateway recognizes local completion.
- In Alpha, reset progress and verify the gateway no longer claims completion.
- Use keyboard Tab, Space and Enter for beat steps and graph nodes; test with reduced-motion setting.
- Verify no off-screen or overlapping UI at 320px, 390px and desktop widths.
- Confirm no public release, no outgoing data or payments, and that underlying 3D World behavior is unchanged.
- Audit old 3D landing copy separately before future public promotion; existing aspirational facility figures and prize announcements are **not** evidence of funding, real construction, or active prizes.

## Known limitations

- Only a 2D sequencer + graph prototype is playable. There is **no** direct 3D step-sequencer interaction, player avatar sync, shared profiles, server persistence, or multiplayer quest.
- This branch creates a **proximity launch button**, not a new physically enterable interior or doorway.
- Browser completion is untrusted and easily editable; never use it to award money, issue credentials or authorize permissions.
- The copy in the game repo and 3D repo will drift if independently edited. After QA, share the same quest logic as a package or embed a versioned static build generated from one source of truth. Avoid hand-copying in production.
- Separate standalone `/alpha/music-quest.html` is a temporary integration route, not the desired ultimate app architecture.
- No automated or manual browser test has been executed through the connector; do not describe this feature as production-ready until tests pass.

## Next safe increments

1. Browser build + device QA. Fix any regressions.
2. Introduce a common progression schema and non-duplicated quest package shared by the game and 3D apps.
3. Design the next actual vertical-slice quest (e.g. photography composition, movement), only after the music loop is proven.
4. Add an accessible route independent of 3D for lower-powered devices and keyboard-only visitors.
5. If approved, mount the public game as its own app/subdomain under the WAVMVMT ecosystem and link to it from wavmvmt.com. Keep CORE private.


## Extension: Photography quest + shared progress V2

The draft now includes `public/alpha/progression-v2.js`, `public/alpha/photo-quest.html`, and studio gateway access from both the Music Studio and Photo Studio, with no additional 3D draw calls. All skill unlocks use the same local browser key `wavmvmt-world-progress-v2`, preserving and migrating older V1 music progress. A visitor can complete Music + Photo independently, with eight practice nodes total.

The photo experience is a stylized 2D rule-of-thirds composition exercise with a side-light selector, preview requirement and clear disclaimers. It is **not** a real camera, professional assessment or photo upload. To access a Mind Palace reflecting both quests, use `/alpha/music-quest.html?view=palace`.

Both studios now have a keyboard-focusable skip-3D shortcut in `UIOverlay.tsx`. Physical walk-in/door transitions and real 3D minigames are **not** implemented. The PR's smoke script now checks both quest JS files and the V2 rules, but actual Node/Next/mobile tests remain pending.

**Important:** The earlier statements in this integration document about "only one playable quest" reflect the original draft baseline, not this extension. Follow this later checkpoint for current state.

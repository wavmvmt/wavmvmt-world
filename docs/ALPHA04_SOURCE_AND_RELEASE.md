# WAVMVMT World Alpha 04 — Source of Truth, QA and Release Gate

**Status:** Internal review build only — four standalone learning quests; no public deploy or production DB changes.

## Where the code lives

- **Canonical game source:** private `wavmvmt/wavmvmt-world-game` repository, under `prototype/`.
- **3D World integration:** private `wavmvmt/wavmvmt-world` repository, under `public/alpha/`, with additional `WorldQuestDirectory`, `StudioQuestGateway` and a Player pointer-lock fix.
- **Private HQ:** `wavmvmt/wavmvmt-core`, tracks links and decisions only; do **not** copy private HQ data or auth into public game systems.
- No unrelated business/entity affiliations are claimed, implied, connected or copied.

## The current playable vertical slices

1. **Music / Find Your Rhythm:** Four-track eight-step drum sequencer, visual/audio playback, qualification and Mind Palace skills.
2. **Photography / Frame a Moment:** A stylized portrait composition exercise, rule-of-thirds grid, and lighting preview.
3. **Movement / Pathfinder:** Safe 2D route planning, three stations, blocked tiles and a final goal. *Not physical parkour instruction.*
4. **Energy / Balance the System:** Fictional supply, demand and build-token puzzle; not a real electrical, solar, engineering, financial or installation calculator.
5. **Player Passport:** Shows all four quest statuses, 14 available practice nodes (2 starting + 12 unlockable), basic local intention, JSON export, and full reset.

All are local HTML/JS demonstrations using `progression-v2.js` and browser `localStorage`, not server records, credentials, earnings, financial assets, or real membership benefits. Existing V1 beat progress migrates, and completion records are independent and idempotent.

## Stop editing two copies

From local sibling checkouts of the **same review branches**:

```sh
cd wavmvmt-world
node scripts/sync-game-alpha.mjs --check
# Inspect the actual game repository changes and their suitability first.
node scripts/sync-game-alpha.mjs --write
git diff -- public/alpha
```

This script reads `../wavmvmt-world-game/prototype` by default; override with `WAVMVMT_GAME_PROTOTYPE_DIR` if your local layout differs. It has exactly six known inputs/outputs, reproduces the single World back link and same-origin quest routing, and performs **no Git operations, database changes, publication, package installation or external network calls**. `--check` is read-only and exits nonzero if differences are detected. `--write` is the only mutating mode and must always be followed by a diff review.

**Source sync status on October 13:** Connector-side comparisons showed that each of the six staged World files matched the source Game files after the documented transformations byte-for-byte. The script is newly added and still requires execution from sibling checkouts for verification in an actual local environment.

## Verified QA

- **Game repository CI:** Node regression suites covering all four quests; inline JavaScript syntax and static source checks. GitHub Actions success confirmed at Alpha 04 commit `76e2bd732fe`.
- **3D World CI:** Source checks and Next.js TypeScript production build, success confirmed at Alpha 04 commit `772945449bd`.
- **Standalone browser simulation:** Chromium+Playwright loaded the *actual alpha page markup and scripts* using `page.set_content` and an injected localStorage polyfill because browser policy blocked local HTTP navigation. The four quest controls were exercised in order, with four separate completion records, 14/14 skills in the Passport, and clear/reset returning to 0/4 and 2/14. No page exceptions, no console errors or document horizontal overflow at widths 320, 390, 768 and 1280px for the five UI pages. This validates the DOM/app logic and layout, **not** actual HTTP routing, native persistence, web audio output or 3D rendering.
- **Prototype ZIP:** GitHub Actions `wavmvmt-world-playable-alpha` private artifact contains six files, runs in a local browser or local server.

## Public-release approval checklist

- Real hosted preview of *both* World WebGL and the standalone pages; verify all studio proximity triggers and links in low/medium/high modes.
- Real iOS/Android phones, tablet and desktop across Safari/Chrome/Firefox/Edge where practical; audio unlock/mute and focus indicators; keyboard-only access without 3D movement.
- Browser native localStorage across routes; JSON export/reset; failure handling in private browsing/storage-blocked environments.
- Asset rights, safety and privacy audit, including any existing fundraising, facility-development, competitions, prizes, or visitor metrics displayed in the old 3D app. Do **not** treat conceptual figures as actual financing or active prizes.
- Confirm domain design with the owner, with links from public `wavmvmt.com` only after explicit launch approval.
- Keep HQ private, do not share or merge databases, and never derive real-world financial benefits from client-editable quest achievements.

No full launch, production merge, release, game account sync or public deployment has been authorized through this document.

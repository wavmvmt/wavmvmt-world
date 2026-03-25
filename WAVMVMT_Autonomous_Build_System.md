# The WAVMVMT Autonomous Build System
## A reusable framework for AI-driven multi-agent software construction
## Created by Shim (Saadiq Abdullah Khan) | WAVMVMT
## Proven on SET OS 2026 — 16 agents, 5 phases, one prompt

---

## WHAT THIS IS

A complete system for building software using Claude Code as an autonomous multi-agent builder. You define the phases, agents, and features — then paste one prompt and Claude Code executes the entire build sequentially with self-QA at every gate.

This system was battle-tested building SET OS 2026 (a capital markets platform) — 16 agents across 5 phases, running autonomously with self-correction.

---

## PART 1: THE PHILOSOPHY

### The Horizontal Slice Build Method

Build software like a construction project. All trades work simultaneously — never finish the kitchen while the bathroom is bare studs.

**12 Disciplines** (apply to ANY software project):

| # | Discipline | Construction | Software |
|---|-----------|-------------|----------|
| 1 | **Architecture** | Blueprints | Data models, API design, component hierarchy, file structure |
| 2 | **Structural** | Framing | Core features, main user flows, CRUD, state management |
| 3 | **Mechanical** | HVAC/Plumbing | Networking, real-time, WebSocket, audio, AI pipelines |
| 4 | **Interior** | Drywall/Paint | UI polish, animations, transitions, loading/empty states, themes |
| 5 | **Fixtures** | Lights/Appliances | Interactive elements, buttons, modals, forms, special features |
| 6 | **Safety** | Fire code | Auth, validation, rate limiting, error handling, input sanitization |
| 7 | **Accessibility** | ADA compliance | Keyboard nav, screen readers, color contrast, aria, reduced motion |
| 8 | **Landscaping** | Exterior/Signage | Landing page, OG tags, SEO, social sharing, branding, PWA |
| 9 | **Inspection** | Building inspector | Tests, QA, browser compat, performance audits, type checking |
| 10 | **Utilities** | Power/Internet | CI/CD, monitoring, logging, analytics, deployment pipeline |
| 11 | **Furnishing** | Decoration | Content, copy, labels, error messages, help text, media |
| 12 | **Operations** | Property mgmt | Admin dashboard, user management, metrics, reporting |

### The Rules

1. **Every feature slice touches 8+ disciplines.** No exceptions.
2. **Never 100% one discipline while another is 0%.** If your pipeline has perfect CRUD but zero tests, you're building a house with no fire extinguishers.
3. **Fix bugs before adding features.** If Slice 1 has bugs, they become the FIRST items in Slice 2.
4. **Batch 5-8 features per deploy.** Each slice is a meaningful deliverable you can demo.
5. **Mobile test after every deploy.**
6. **Score every feature: Impact (1-5) × Effort (1-5).** High impact + low effort = build first.

### Discipline Scoring Template

Use this for every feature in your build plan:

```
Feature: [Name]
Impact: [1-5]  Effort: [1-5]

| # | Discipline     | Score | What's Done | What's Remaining |
|---|---------------|-------|-------------|-----------------|
| 1 | Architecture  | ___%  |             |                 |
| 2 | Structural    | ___%  |             |                 |
| 3 | Mechanical    | ___%  |             |                 |
| 4 | Interior      | ___%  |             |                 |
| 5 | Fixtures      | ___%  |             |                 |
| 6 | Safety        | ___%  |             |                 |
| 7 | Accessibility | ___%  |             |                 |
| 8 | Landscaping   | ___%  |             |                 |
| 9 | Inspection    | ___%  |             |                 |
| 10| Utilities     | ___%  |             |                 |
| 11| Furnishing    | ___%  |             |                 |
| 12| Operations    | ___%  |             |                 |

Minimum 8 disciplines >0% before this feature ships.
```

---

## PART 2: TWO-TRACK ARCHITECTURE

Split your build into two parallel tracks that never conflict:

### Track 1: Database (Claude Chat + Supabase MCP)
- All table creation, migrations, views, RLS policies
- Schema design, column mapping, data audits
- Cron jobs, maintenance, backups
- Real-time monitoring during build

### Track 2: Codebase (Claude Code)
- All application code, components, API routes
- Auth, middleware, UI, features
- Testing, CI/CD, deployment
- Runs autonomously with self-QA

**Why this works:** Zero merge conflicts. Database work happens through Supabase MCP (no files touched). Codebase work happens through Claude Code (no SQL executed). The two tracks communicate through table schemas — Track 1 creates the tables, Track 2 writes code that queries them.

### Track 1 Checklist (do BEFORE launching Claude Code)
- [ ] All tables created with correct schemas
- [ ] All RLS policies enabled
- [ ] All indexes created
- [ ] All seed data inserted
- [ ] Views created (if needed)
- [ ] Cron jobs scheduled (if needed)
- [ ] Backup taken
- [ ] Schema documentation generated (column mappings, audit reports)

### Track 2 Checklist (the Claude Code prompt handles this)
- [ ] Each agent creates a feature branch
- [ ] Each agent builds, verifies, fixes, merges to dev
- [ ] QA gate passes before next agent starts
- [ ] Final QA runs after all agents complete
- [ ] Build report generated

---

## PART 3: THE AGENT SYSTEM

### How Agents Work

Each agent is a self-contained unit of work:
1. Creates a feature branch from `dev`
2. Builds its assigned scope (files to create/modify are listed explicitly)
3. Runs QA (tsc, lint, build)
4. Fixes any errors
5. Commits with conventional commit messages
6. Merges to `dev`
7. Next agent branches from the updated `dev`

**Sequential execution prevents merge conflicts.** Agent 2 starts from the state Agent 1 left behind. No parallel branches fighting over the same files.

### Agent Definition Template

```
## AGENT [N]: [NAME] [branch: feat/agent-name]

### Scope
[One sentence: what this agent does. What it does NOT do.]

### Files to Create/Modify
- `path/to/file.ts` — [What it does, key patterns to follow]
- `path/to/another.ts` — [What it does]

### Key Implementation Details
[Specific patterns, algorithms, API contracts, or business logic the agent needs]

### Do NOT Touch
[Explicit list of files this agent must not modify]

### QA Gate
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] [Feature-specific checks: files exist, routes work, etc.]

If ANY fail → fix before proceeding to Agent [N+1].
```

### Merge Order Strategy

Define your agents in dependency order. Common patterns:

**Foundation-first** (most projects):
```
1. Security/Auth (middleware, tokens, roles)
2. Infrastructure (shared utilities, types, providers, CI)
3. UI Framework (layout, navigation, theming)
4. Feature A (builds on all three above)
5. Feature B (builds on all three above)
...
```

**Why this order matters:**
- Security creates `middleware.ts` — no other agent touches it
- Infrastructure creates shared types — all later agents import them
- UI creates sidebar/layout — later agents add pages to it
- Features build on the stable foundation

### Conflict Prevention Rules

| Rule | Why |
|------|-----|
| Only one agent installs npm packages | Prevents package.json conflicts |
| Shared types live in `src/types/` and are owned by Infrastructure agent | Single source of truth |
| Shared utilities live in `src/lib/` and are owned by Infrastructure agent | No duplicate implementations |
| Each agent lists files it must NOT touch | Hard boundaries |
| Merge order is strict and documented | Dependency chain is explicit |

---

## PART 4: THE PROMPT TEMPLATE

### Structure

Every autonomous build prompt follows this structure:

```
## HEADER
- Who you are (Build Runner)
- What you're building (project name + description)
- Where the code lives (repo path, branch)
- What's already done (database, existing code)
- What docs to read first (in the repo)

## UNIVERSAL RULES
- Never stop to ask
- Fix errors immediately
- QA gate after each agent
- Commit frequently (conventional commits)
- TypeScript strict
- Preserve backward compatibility
- Each agent: branch → build → verify → merge → next

## PHASE 1
### Agent 1: [Scope, files, QA gate]
### Agent 2: [Scope, files, QA gate]
### Phase 1 Checkpoint: [tsc + build + file checks]

## PHASE 2
### Agent 3: [Scope, files, QA gate]
...

## FINAL QA
[Comprehensive checks across all phases]

## BUILD REPORT
[Auto-generated report of what happened]

## BEGIN NOW
[Explicit start instruction]
```

### Prompt Writing Tips

1. **Reference docs in the repo, don't repeat specs.** Instead of pasting a full API schema into the prompt, write: "See `docs/schema.md` for the full column mapping." This saves ~60% of prompt space.

2. **Be explicit about files.** Don't say "build the auth system." Say: "Create `src/middleware.ts` — RBAC edge middleware that decodes JWT from header/cookie, checks role against route permission map, returns 401 for API routes and 302 for pages."

3. **Include the QA command, not just the concept.** Don't say "verify it builds." Say: `npx tsc --noEmit && npm run build && echo "✅" || echo "❌"`.

4. **Tell it what NOT to touch.** Boundaries prevent the most common failures. "Do NOT touch: sidebar.tsx, auth.ts, any hook file."

5. **Give fallback instructions.** "If Puppeteer fails to install, create the endpoint structure but note it needs an external service." This prevents the build from stalling on one feature.

6. **Keep each agent under ~50 lines in the prompt.** More than that and Claude Code loses focus. If an agent needs more detail, put it in a doc file in the repo and reference it.

---

## PART 5: THE QA SYSTEM

### Per-Agent QA Gate

Every agent ends with:
```bash
npx tsc --noEmit       # Types pass
npm run lint            # No lint errors (or manageable warnings)
npm run build           # Next.js/Vite/etc builds successfully
# Feature-specific file existence checks
[ -f "path/to/expected/file.ts" ] && echo "✅" || echo "❌ MISSING"
```

### Phase Checkpoint

Between phases:
```bash
echo "=== PHASE [N] CHECKPOINT ==="
npx tsc --noEmit && npm run build && echo "✅ PASS" || echo "❌ FIX BEFORE NEXT PHASE"
```

### Final QA

After all agents:
```bash
# 1. Types
npx tsc --noEmit

# 2. Build
npm run build

# 3. Security audit
grep -rn "[PATTERNS_FOR_SECRETS]" src/ --include="*.ts" --include="*.tsx"

# 4. Branding (if applicable)
grep -rn "[OLD_BRAND_NAME]" src/ public/

# 5. File existence (check critical files from every phase)
for f in [LIST_OF_CRITICAL_FILES]; do
  [ -f "$f" ] && echo "✅ $f" || echo "❌ $f"
done

# 6. Git log
git log --oneline -20

# 7. Push to staging
git push origin dev
git checkout staging && git merge dev && git push origin staging && git checkout dev
```

### Build Report Template

The prompt tells Claude Code to generate this at the end:

```markdown
# [Project] — Build Report

### Phase 1: [Name]
- Agent 1 ([Name]): [PASS/FAIL]
- Agent 2 ([Name]): [PASS/FAIL]

### Phase 2: [Name]
...

### Decisions Made Autonomously
[What Claude Code decided without asking, and why]

### External Dependencies Needed
[APIs, keys, services that need manual setup]

### Known Issues
[What doesn't fully work]

### What's Next
[Features deferred to future phases]
```

---

## PART 6: APPLYING TO A 3D WORLD BUILD

Here's how the system maps to a Three.js / 3D world project like WAVMVMT:

### Discipline Translation for 3D

| # | Discipline | 3D World Translation |
|---|-----------|---------------------|
| 1 | Architecture | Scene graph, room hierarchy, asset loading pipeline, state management |
| 2 | Structural | Room rendering, player movement, camera controls, collision detection |
| 3 | Mechanical | Audio engine, WebSocket multiplayer, physics, asset streaming, real-time sync |
| 4 | Interior | Lighting, materials, post-processing, particle effects, transitions between rooms |
| 5 | Fixtures | Interactive objects (beat pads, sound bowls, parkour obstacles), UI overlays, menus |
| 6 | Safety | Auth (BYOK), input validation, rate limiting, anti-cheat, XSS in chat |
| 7 | Accessibility | Keyboard controls, screen reader for UI, reduced motion, color blind modes |
| 8 | Landscaping | Landing page, OG images, loading screen, social sharing, SEO |
| 9 | Inspection | Performance profiling (60fps target), memory leak detection, GPU benchmarks |
| 10 | Utilities | CDN for assets, Supabase auth/data, Vercel deployment, error tracking |
| 11 | Furnishing | 3D models, textures, sounds, music, room descriptions, NPC dialogue |
| 12 | Operations | Admin panel (room config, user management, analytics), moderation tools |

### Example Agent Breakdown for 3D World

```
PHASE 1 — FOUNDATION
Agent 1: Auth + BYOK (Supabase Auth, API key storage, session management)
Agent 2: Scene Infrastructure (Three.js setup, scene manager, room loader, asset pipeline)
Agent 3: Player System (first-person controls, collision, camera, movement physics)
Agent 4: UI Framework (HUD overlay, menu system, room transitions, loading screens)

PHASE 2 — ROOMS
Agent 5: Parkour Gym (obstacles, physics, timer, scoring)
Agent 6: Music Studio (beat pads, sequencer, audio engine, recording)
Agent 7: Sound Bath Room (ambient audio, reactive visuals, binaural beats)
Agent 8: Amphitheatre (seating, stage, presentation mode, audience view)

PHASE 3 — MULTIPLAYER + SOCIAL
Agent 9: WebSocket Multiplayer (player sync, position broadcast, avatar rendering)
Agent 10: Chat System (text chat, voice chat, emoji reactions)
Agent 11: World Events (scheduled events, live performances, room capacity)

PHASE 4 — POLISH + DEPLOY
Agent 12: Performance (LOD, occlusion culling, texture compression, 60fps enforcement)
Agent 13: PWA + Mobile (touch controls, responsive UI, offline assets)
Agent 14: Landing + Onboarding (landing page, tutorial, first-time experience)
```

### Example Prompt Structure for 3D World

```
You are the [PROJECT] Build Runner. Execute ALL [N] PHASES ([N] agents) sequentially.

## CONTEXT
Repo: [path]
Database: [what's done via Supabase MCP]
3D Engine: Three.js r[version]
Auth: Supabase Auth with BYOK for Claude API

## READ FIRST
1. [Project]_Master_Doc.md
2. [Project]_Horizontal_Slice.md
3. docs/room-specs.md
4. docs/asset-pipeline.md

## RULES
[Same universal rules as any build]

## AGENT 1: SCENE INFRASTRUCTURE [feat/scene-infra]
Create/Modify:
- `src/engine/scene-manager.ts` — Scene lifecycle, room loading, transitions
- `src/engine/asset-loader.ts` — GLTF/texture/audio loading with progress
- `src/engine/renderer.ts` — Three.js renderer setup, post-processing pipeline
- `src/types/world.ts` — Room, Player, Asset, SceneConfig types

Do NOT touch: auth, UI, any room-specific code.
QA: tsc + build + scene-manager exists → merge to dev.

## AGENT 2: PLAYER SYSTEM [feat/player]
...
```

---

## PART 7: QUICK START CHECKLIST

To use this system on a new project:

### Step 1: Set Up the Repo
- [ ] Create GitHub repo (private)
- [ ] Branch structure: main (prod) → staging (preview) → dev (active)
- [ ] Tag initial state: `v0-pre-build`

### Step 2: Database Track (Claude Chat + Supabase MCP)
- [ ] Design all table schemas
- [ ] Create tables, indexes, RLS policies
- [ ] Seed reference data
- [ ] Set up cron jobs if needed
- [ ] Generate schema documentation
- [ ] Take backup

### Step 3: Build the Prompt
- [ ] List ALL features
- [ ] Group into phases (foundation → features → integrations → polish)
- [ ] Break each phase into agents (3-5 per phase)
- [ ] Define each agent: scope, files, QA gate, restrictions
- [ ] Score each feature across 12 disciplines (catch gaps)
- [ ] Write the prompt following the template in Part 4

### Step 4: Write Supporting Docs
- [ ] Master Build Document (architecture, decisions, specs)
- [ ] Horizontal Slice scoring tables (12 disciplines per feature)
- [ ] Schema documentation (table audit, column mappings)
- [ ] Push all docs to repo root + docs/ folder

### Step 5: Launch
- [ ] Open Claude Code, point to repo
- [ ] Paste the prompt
- [ ] Walk away (type "continue" if it pauses)
- [ ] Review the BUILD_REPORT.md when done
- [ ] Check staging deployment

### Step 6: Iterate
- [ ] Review build report for known issues
- [ ] Build Phase N+1 prompt for remaining features
- [ ] Score discipline health across the project
- [ ] Fix any discipline at 0% before adding features

---

## PART 8: LESSONS LEARNED (SET OS 2026)

Things that worked:
- **Sequential agents with merge-to-dev between each** — zero merge conflicts across 16 agents
- **Database done first via Supabase MCP** — agents never had to create tables or run SQL
- **Referencing docs instead of repeating specs** — kept the prompt under 600 lines for 16 agents
- **Explicit "Do NOT touch" lists** — prevented agents from stepping on each other
- **QA gates that auto-fix** — "if tsc fails, fix before proceeding" keeps the chain clean
- **Conventional commits** — git log tells the story of what each agent did

Things to watch for:
- **Claude Code context limits** — you'll need to type "continue" 3-5 times across a 16-agent build
- **Package installs that break builds** — always include "skip if build breaks" fallback
- **Three.js / heavy 3D work** — Claude Code is better at application code than shader programming. For complex shaders, provide the GLSL inline in the prompt.
- **API integrations** — external APIs may need keys. Build the route structure with placeholder responses so the architecture is in place even if the API isn't live.
- **One agent trying to do too much** — keep agents focused. If an agent's scope is more than ~50 lines in the prompt, split it.

---

*This system is open source under the WAVMVMT banner.*
*Built by Shim. Powered by Claude.*
*First deployed: SET OS 2026, March 2026.*

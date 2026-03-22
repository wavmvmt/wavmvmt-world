# WAVMVMT World — 12-Discipline Build System
# The Construction Method Applied to Software

---

## How This Works

Like a real construction project, 12 trades work simultaneously on each floor.
Each "Horizontal Slice" advances ALL disciplines at once. No discipline gets
to 100% while another sits at 0%.

**Current progress: ~10% (Slice 3.5 complete)**

---

## THE 12 DISCIPLINES

### 1. ARCHITECTURE (Blueprints & Planning)
*Component design, data models, API design, file structure*

| Slice | Items |
|-------|-------|
| 10% ✅ | Project scaffold, room config system, fundraising config, component tree |
| 15% | Database schema (Supabase tables for visitors, messages, analytics) |
| 20% | API routes design (visitor count, guest book, fundraising updates) |
| 30% | State management plan (Zustand or context for player/world state) |
| 40% | Multiplayer architecture (Supabase Realtime channels) |
| 50% | CMS data model (dynamic content, events, announcements) |
| 60% | Auth flow redesign (optional profile, avatar saves) |
| 70% | API rate limiting + caching strategy |
| 80% | Microservice boundaries (if needed) |
| 90% | Documentation (API docs, component docs) |
| 100% | Architecture decision records (ADRs) |

### 2. STRUCTURAL (Core Features)
*Room systems, player mechanics, 3D scene, physics*

| Slice | Items |
|-------|-------|
| 10% ✅ | 12 rooms, player controller, workers, cranes, forklifts, skateboards |
| 15% | Wall collision detection (can't walk through walls) |
| 20% | Room entry system (door opens at 80%+ buildPct, camera transition) |
| 25% | Parkour physics foundation (Rapier.js basic setup) |
| 30% | Interactive objects system (click/tap to interact) |
| 35% | Vehicle system (skateboard physics, forklift driving, golf cart) |
| 40% | NPC pathfinding (workers walk between tasks intelligently) |
| 50% | Room-specific mechanics (beat maker, sound bowls, weight lifting) |
| 60% | Multiplayer player sync (see other visitors) |
| 70% | Advanced parkour (wall-run, vault, precision jump) |
| 80% | Physics-based interactions (push objects, throw balls) |
| 90% | AI tour guide (Claude API, conversational) |
| 100% | VR mode (WebXR) |

### 3. MECHANICAL (Systems & Networking)
*Audio, networking, real-time, WebSocket, state management*

| Slice | Items |
|-------|-------|
| 10% ✅ | Web Audio construction SFX, real .ogg files, mute toggle |
| 15% | Spatial audio foundation (volume based on distance to source) |
| 20% | Room-specific ambient soundscapes (lo-fi cafe, drone sound bath) |
| 25% | Supabase Realtime setup (presence channel) |
| 30% | Visitor counter (live, persisted) |
| 35% | 3D positional audio (Web Audio panner nodes) |
| 40% | State persistence (save player position, visited rooms to localStorage) |
| 50% | WebSocket multiplayer (broadcast position, receive others) |
| 60% | Dynamic music system (layers that respond to location/activity) |
| 70% | Audio occlusion (muffled through walls) |
| 80% | Voice chat (WebRTC) |
| 90% | Notification system (push notifications for events) |
| 100% | Offline mode (service worker, cached assets) |

### 4. INTERIOR (UI Polish & Visual Effects)
*Animations, transitions, visual effects, particle systems*

| Slice | Items |
|-------|-------|
| 10% ✅ | Day/night cycle, dust/embers, sparks, light shafts, proximity glow |
| 15% | Stars through skylights at night |
| 20% | Fireflies during night cycle |
| 25% | Rain effect visible through skylights |
| 30% | Room build animations (walls slowly rising over time) |
| 35% | Camera transitions (smooth fly-to when entering rooms) |
| 40% | Ghibli-style plants/trees inside warehouse |
| 50% | Water feature (fountain in cafe area) |
| 60% | GLB model loading (real 3D models replace primitives) |
| 70% | Cel-shade post-processing |
| 80% | Volumetric fog |
| 90% | Weather system (rain, snow, seasonal) |
| 100% | Cinematic camera paths (auto-tour mode) |

### 5. FIXTURES (Interactive Elements)
*Beat pads, sound bowls, parkour, room-specific interactions*

| Slice | Items |
|-------|-------|
| 10% ✅ | 4 beat pads in Music Studio (click to play tones) |
| 15% | Sound Bath bowls (click for resonant tones, 7 bowls) |
| 20% | Amphitheatre spotlight (stand on stage, light follows) |
| 25% | Cafe menu board (readable, scrollable) |
| 30% | Photo Studio flash effect (screenshot capture) |
| 35% | Weight Training barbell interaction (lift animation) |
| 40% | 16-step beat sequencer (full grid, tempo, patterns) |
| 50% | Parkour Gym obstacle course (timed runs) |
| 60% | Video Studio recording indicator + green screen |
| 70% | Yoga Room guided session (breathing animation + audio) |
| 80% | Recovery Suite contrast therapy demo |
| 90% | Front Desk check-in kiosk (mockup) |
| 100% | All 12 rooms fully interactive |

### 6. SAFETY (Security & Error Handling)
*Auth, validation, error handling, rate limiting*

| Slice | Items |
|-------|-------|
| 10% ✅ | Supabase auth (Google OAuth + magic link), error boundary |
| 15% | Input sanitization on any user-generated content |
| 20% | Rate limiting on API routes |
| 25% | CSRF protection |
| 30% | Content Security Policy headers |
| 35% | XSS prevention audit |
| 40% | Auth session management (refresh tokens, expiry) |
| 50% | Role-based access (admin vs visitor vs investor) |
| 60% | API key management (if external services added) |
| 70% | Security headers audit (Helmet-style) |
| 80% | Penetration test checklist |
| 90% | GDPR compliance (data deletion, privacy policy) |
| 100% | SOC 2 readiness checklist |

### 7. ACCESSIBILITY (ADA Compliance)
*Keyboard nav, screen readers, reduced motion, color contrast*

| Slice | Items |
|-------|-------|
| 10% ✅ | Basic responsive design, mobile controls |
| 15% | Skip to content link |
| 20% | ARIA labels on all HUD interactive elements |
| 25% | Keyboard navigation for HUD panels |
| 30% | Reduced motion mode (disable particles, camera shake) |
| 35% | High contrast mode toggle |
| 40% | Screen reader room descriptions |
| 50% | Tab order optimization |
| 60% | Color blind safe palette option |
| 70% | Audio descriptions for visual elements |
| 80% | Text size controls |
| 90% | Full WCAG 2.1 AA audit |
| 100% | Captions for all audio/video content |

### 8. LANDSCAPING (Marketing & Branding)
*Landing page, OG images, SEO, social sharing*

| Slice | Items |
|-------|-------|
| 10% ✅ | Landing page with stats, OG meta tags, Twitter cards |
| 15% | Dynamic OG image (Satori — renders facility stats as image) |
| 20% | Social share buttons (share your visit) |
| 25% | Email capture (newsletter signup on landing page) |
| 30% | QR code generator (for IRL marketing materials) |
| 35% | Press kit page (downloadable brand assets) |
| 40% | SEO audit + sitemap.xml + robots.txt |
| 50% | Blog/updates section |
| 60% | Video trailer embed |
| 70% | Referral system (invite friends, track) |
| 80% | Countdown timer to milestones |
| 90% | A/B test landing page variants |
| 100% | Full brand guidelines page |

### 9. INSPECTION (Testing & QA)
*Browser compat, performance audits, Lighthouse, testing*

| Slice | Items |
|-------|-------|
| 10% ✅ | Manual testing on mobile + desktop, build passes |
| 15% | FPS counter (debug mode, press F to toggle) |
| 20% | Browser compatibility matrix (Chrome, Safari, Firefox, Edge) |
| 25% | Lighthouse audit (target 70+) |
| 30% | Mobile device testing matrix (iPhone, Android, iPad) |
| 35% | Load time measurement (<3s target) |
| 40% | Memory leak detection |
| 50% | E2E test framework setup (Playwright) |
| 60% | Visual regression tests |
| 70% | Performance profiling (GPU, CPU, memory) |
| 80% | Stress test (100 simultaneous visitors) |
| 90% | Lighthouse 90+ score |
| 100% | Automated CI test suite |

### 10. UTILITIES (DevOps & Infrastructure)
*CI/CD, monitoring, logging, analytics, deployment*

| Slice | Items |
|-------|-------|
| 10% ✅ | Vercel deploy, GitHub repo, manual deploys |
| 15% | Vercel Analytics setup |
| 20% | Error tracking (console errors → logged) |
| 25% | Environment variable management (dev/staging/prod) |
| 30% | Staging environment |
| 35% | GitHub Actions CI (build + lint on PR) |
| 40% | Performance monitoring dashboard |
| 50% | Log aggregation |
| 60% | Alerting (deploy fails, error spikes) |
| 70% | CDN optimization for audio/model assets |
| 80% | Edge caching configuration |
| 90% | Disaster recovery plan |
| 100% | Full observability stack |

### 11. FURNISHING (Content & Media)
*Photos, videos, events, CMS, dynamic data*

| Slice | Items |
|-------|-------|
| 10% ✅ | Static room specs, fundraising milestones, Phase 2 vision |
| 15% | Photo gallery wall (upload real WAVMVMT photos) |
| 20% | Video screen in Amphitheatre (YouTube embed) |
| 25% | Event calendar display |
| 30% | Instagram/social feed wall |
| 35% | Podcast booth (playable episodes) |
| 40% | Merch display cases (product images) |
| 50% | CMS setup (Supabase tables for dynamic content) |
| 60% | Admin dashboard for content management |
| 70% | Blog/news feed |
| 80% | Live event streaming |
| 90% | Community contributed content |
| 100% | Full CMS with versioning + scheduling |

### 12. OPERATIONS (Business & Analytics)
*Admin dashboard, user management, metrics, investor tools*

| Slice | Items |
|-------|-------|
| 10% ✅ | Fundraising tracker ($20M), Phase 2 vision, IRL phases |
| 15% | Live visitor counter (Supabase) |
| 20% | Visitor analytics (rooms visited, time spent) |
| 25% | Live fundraising updates (Supabase, no redeploy) |
| 30% | Milestone celebration effects (confetti) |
| 35% | Email notifications on milestones |
| 40% | Investor portal (auth-gated) |
| 50% | ROI calculator widget |
| 60% | Revenue projection charts |
| 70% | Admin dashboard (manage content, view analytics) |
| 80% | Webhook automations |
| 90% | Partner/sponsor management |
| 100% | Full business intelligence dashboard |

---

## HORIZONTAL SLICE SCHEDULE

Each session = 1 slice across ALL 12 disciplines.

| Slice | Target % | Focus Theme |
|-------|----------|-------------|
| 1-3.5 | 10% ✅ | Foundation — everything exists at minimum |
| 4 | 15% | Spatial audio + stars + visitor counter + collision |
| 5 | 20% | Room entry + interactive bowls + social share + gallery |
| 6 | 25% | Sequencer + environment FX + Realtime + CSP |
| 7 | 30% | Parkour foundation + CMS + staging + Lighthouse |
| 8 | 35% | Vehicles + camera transitions + email capture |
| 9 | 40% | NPC AI + dynamic music + admin dashboard |
| 10 | 50% | Full room interactions + multiplayer + GLB models |
| 11 | 60% | Advanced physics + voice chat + blog |
| 12 | 70% | Cel-shade + achievements + investor portal |
| 13 | 80% | Weather + stress testing + CDN |
| 14 | 90% | VR mode + full a11y + production hardening |
| 15 | 100% | Launch-ready — all disciplines complete |

---

## RULES

1. Never finish one discipline while another is at 0%
2. Every slice must touch at least 8 of 12 disciplines
3. Fix bugs before adding features (within same slice)
4. Mobile test after every deploy
5. Audio test after every deploy
6. Performance check (FPS) after every deploy
7. Commit messages reference the slice number
8. BUILDLIST_EXPANDED.md stays updated with [x] marks

(function (root) {
  'use strict';

  // One canonical format for the static alpha and the 3D World bridge.
  // Demo progression is client-editable. Never trust it for money or permissions.
  const KEY = 'wavmvmt-world-progress-v2';
  const LEGACY_KEY = 'wavmvmt-world-alpha-v1';
  const QUEST_ID = 'music_producer_001';
  const PHOTO_ID = 'photo_composition_001';
  const MOVEMENT_ID = 'movement_pathfinder_001';
  const ENERGY_ID = 'energy_balancer_001';
  const PHOTO_POSITIONS = ['center', 'upper-left', 'upper-right', 'lower-left', 'lower-right'];
  const SKILLS = Object.freeze([
    { id: 'curiosity', title: 'Curiosity', from: null },
    { id: 'listening', title: 'Listening', from: null },
    { id: 'rhythm', title: 'Rhythm', from: QUEST_ID },
    { id: 'sequencing', title: 'Sequencing', from: QUEST_ID },
    { id: 'creative-practice', title: 'Creative practice', from: QUEST_ID },
    { id: 'composition', title: 'Composition', from: PHOTO_ID },
    { id: 'light-awareness', title: 'Light awareness', from: PHOTO_ID },
    { id: 'visual-storytelling', title: 'Visual storytelling', from: PHOTO_ID },
    { id: 'spatial-planning', title: 'Spatial planning', from: MOVEMENT_ID },
    { id: 'route-adaptation', title: 'Route adaptation', from: MOVEMENT_ID },
    { id: 'wayfinding', title: 'Wayfinding', from: MOVEMENT_ID },
    { id: 'load-balancing', title: 'Load balancing', from: ENERGY_ID },
    { id: 'resource-planning', title: 'Resource planning', from: ENERGY_ID },
    { id: 'systems-thinking', title: 'Systems thinking', from: ENERGY_ID },
  ]);
  const EMPTY_PATTERN = () => Array.from({ length: 4 }, () => Array(8).fill(0));
  const PATHS = ['continue', 'reclaim', 'curiosity', 'wildcard'];
  const PHOTO_LIGHTS = ['front', 'side'];
  const MOVEMENT_BARRIERS = ['2,3', '2,2', '3,1', '4,3', '0,1'];
  const MOVEMENT_CHECKPOINTS = { '1,3': 'warmup', '3,2': 'adapt', '4,0': 'wayfinding' };
  const MOVEMENT_GOAL = '5,0';

  function validPattern(p) {
    return Array.isArray(p) && p.length === 4 &&
      p.every(row => Array.isArray(row) && row.length === 8 &&
        row.every(v => v === 0 || v === 1));
  }

  function qualifiedPattern(p) {
    return validPattern(p) &&
      p[0][0] === 1 && p[0][4] === 1 &&
      p[1][2] === 1 && p[1][6] === 1 &&
      p[2].reduce((a, b) => a + b, 0) >= 4;
  }

  function clonePattern(p) {
    return p.map(row => row.slice());
  }

  function defaultPhotoDraft() {
    return { placement: 'center', lighting: 'front', previewed: false };
  }

  function validPhotoDraft(draft) {
    return !!draft && typeof draft === 'object' &&
      PHOTO_POSITIONS.includes(draft.placement) &&
      PHOTO_LIGHTS.includes(draft.lighting) &&
      typeof draft.previewed === 'boolean';
  }

  function qualifiedPhotoDraft(draft) {
    return validPhotoDraft(draft) && draft.placement !== 'center' &&
      draft.lighting === 'side' && draft.previewed === true;
  }

  function defaultMovementDraft() {
    return { x: 0, y: 4, checkpoints: [] };
  }

  function validMovementDraft(draft) {
    return !!draft && typeof draft === 'object' &&
      Number.isInteger(draft.x) && draft.x >= 0 && draft.x < 6 &&
      Number.isInteger(draft.y) && draft.y >= 0 && draft.y < 5 &&
      !MOVEMENT_BARRIERS.includes(draft.x + ',' + draft.y) &&
      Array.isArray(draft.checkpoints) &&
      draft.checkpoints.every(id => ['warmup', 'adapt', 'wayfinding'].includes(id));
  }

  function qualifiedMovementDraft(draft) {
    return validMovementDraft(draft) &&
      (draft.x + ',' + draft.y) === MOVEMENT_GOAL &&
      ['warmup', 'adapt', 'wayfinding'].every(id => draft.checkpoints.includes(id));
  }

  function defaultEnergyDraft() {
    return { panels: 0, batteries: 0, loads: { lights: true, studio: true, ventilation: true }, tested: false };
  }

  function validEnergyDraft(draft) {
    return !!draft && typeof draft === 'object' &&
      Number.isInteger(draft.panels) && draft.panels >= 0 && draft.panels <= 4 &&
      Number.isInteger(draft.batteries) && draft.batteries >= 0 && draft.batteries <= 3 &&
      !!draft.loads && typeof draft.loads === 'object' &&
      ['lights', 'studio', 'ventilation'].every(k => typeof draft.loads[k] === 'boolean') &&
      typeof draft.tested === 'boolean';
  }

  // Fictional teaching units and tokens, NOT engineering estimates or actual equipment sizing.
  function energyStats(draft) {
    if (!validEnergyDraft(draft)) throw new TypeError('Invalid energy design');
    const demand = (draft.loads.lights ? 2 : 0) +
      (draft.loads.studio ? 4 : 0) + (draft.loads.ventilation ? 3 : 0);
    return {
      supply: draft.panels * 2 + draft.batteries * 2,
      demand,
      credits: draft.panels * 2 + draft.batteries,
    };
  }

  function qualifiedEnergyDraft(draft) {
    if (!validEnergyDraft(draft) || !draft.tested || draft.panels < 2 || draft.batteries < 1 ||
        !Object.values(draft.loads).every(Boolean)) return false;
    const stats = energyStats(draft);
    return stats.supply >= stats.demand && stats.credits <= 8;
  }

  function newProgress() {
    return {
      version: 2,
      onboarding: { path: null },
      drafts: { [QUEST_ID]: { pattern: EMPTY_PATTERN(), playedBar: false },
        [PHOTO_ID]: defaultPhotoDraft(),
        [MOVEMENT_ID]: defaultMovementDraft(),
        [ENERGY_ID]: defaultEnergyDraft() },
      completions: [],
    };
  }

  function safePath(path) {
    return PATHS.includes(path) ? path : null;
  }

  function isCompleted(progress, questId = QUEST_ID) {
    return !!progress && Array.isArray(progress.completions) &&
      progress.completions.some(item => item && item.questId === questId);
  }

  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || raw.version !== 2 ||
        !raw.drafts || typeof raw.drafts !== 'object' ||
        !Array.isArray(raw.completions)) return null;
    const result = newProgress();
    result.onboarding.path = safePath(raw.onboarding && raw.onboarding.path);
    const draft = raw.drafts[QUEST_ID];
    if (draft && validPattern(draft.pattern)) {
      result.drafts[QUEST_ID].pattern = clonePattern(draft.pattern);
      result.drafts[QUEST_ID].playedBar = draft.playedBar === true;
    }
    const photoDraft = raw.drafts[PHOTO_ID];
    if (validPhotoDraft(photoDraft)) result.drafts[PHOTO_ID] = {
      placement: photoDraft.placement,
      lighting: photoDraft.lighting,
      previewed: photoDraft.previewed,
    };
    const movementDraft = raw.drafts[MOVEMENT_ID];
    if (validMovementDraft(movementDraft)) result.drafts[MOVEMENT_ID] = {
      x: movementDraft.x, y: movementDraft.y,
      checkpoints: [...new Set(movementDraft.checkpoints)],
    };
    const energyDraft = raw.drafts[ENERGY_ID];
    if (validEnergyDraft(energyDraft)) result.drafts[ENERGY_ID] = {
      panels: energyDraft.panels, batteries: energyDraft.batteries,
      loads: { lights: energyDraft.loads.lights, studio: energyDraft.loads.studio,
        ventilation: energyDraft.loads.ventilation },
      tested: energyDraft.tested,
    };
    // Keep only whitelisted local-demo completions, deduplicated per quest.
    for (const questId of [QUEST_ID, PHOTO_ID, MOVEMENT_ID, ENERGY_ID]) {
      if (isCompleted(raw, questId)) {
        const original = raw.completions.find(item => item && item.questId === questId);
        result.completions.push({
          questId,
          source: original.source === 'legacy_local_alpha' ? 'legacy_local_alpha' : 'local_demo',
          completedAt: typeof original.completedAt === 'string' ? original.completedAt : null,
        });
      }
    }
    return result;
  }

  function fromLegacy(raw) {
    if (!raw || typeof raw !== 'object' || raw.version !== 1 ||
        !validPattern(raw.pattern)) return null;
    const result = newProgress();
    result.onboarding.path = safePath(raw.path);
    result.drafts[QUEST_ID] = {
      pattern: clonePattern(raw.pattern),
      playedBar: raw.playedBar === true,
    };
    if (raw.completed === true) {
      result.completions.push({
        questId: QUEST_ID,
        source: 'legacy_local_alpha',
        completedAt: null,
      });
    }
    return result;
  }

  function read(storage) {
    // A present but invalid V2 record must not silently recreate rewards from stale V1.
    const v2 = storage.getItem(KEY);
    if (v2 !== null) {
      try { return normalize(JSON.parse(v2)) || newProgress(); }
      catch (_) { return newProgress(); }
    }
    const v1 = storage.getItem(LEGACY_KEY);
    if (v1 !== null) {
      try { return fromLegacy(JSON.parse(v1)) || newProgress(); }
      catch (_) { return newProgress(); }
    }
    return newProgress();
  }

  function persist(storage, progress) {
    const clean = normalize(progress);
    if (!clean) throw new TypeError('Invalid V2 progress');
    storage.setItem(KEY, JSON.stringify(clean));
    return clean;
  }

  function getMusicSnapshot(progress) {
    const clean = normalize(progress) || newProgress();
    const draft = clean.drafts[QUEST_ID];
    return {
      version: 1, // The alpha UI uses this legacy-shaped view until fully modularized.
      path: clean.onboarding.path,
      pattern: clonePattern(draft.pattern),
      playedBar: draft.playedBar,
      completed: isCompleted(clean),
    };
  }

  function updateDraft(progress, state) {
    const clean = normalize(progress) || newProgress();
    if (!state || !validPattern(state.pattern)) throw new TypeError('Invalid music pattern');
    clean.onboarding.path = safePath(state.path);
    clean.drafts[QUEST_ID] = {
      pattern: clonePattern(state.pattern),
      playedBar: state.playedBar === true && qualifiedPattern(state.pattern),
    };
    return clean;
  }

  function completeMusic(progress, state, clock) {
    const clean = updateDraft(progress, state);
    if (!qualifiedPattern(state.pattern) || state.playedBar !== true) {
      throw new Error('Complete a qualifying eight-step bar before claiming the quest');
    }
    if (!isCompleted(clean)) {
      const now = typeof clock === 'function' ? clock() : new Date().toISOString();
      clean.completions.push({
        questId: QUEST_ID,
        source: 'local_demo',
        completedAt: now,
      });
    }
    return clean;
  }

  function getPhotoSnapshot(progress) {
    const clean = normalize(progress) || newProgress();
    return {
      ...clean.drafts[PHOTO_ID],
      completed: isCompleted(clean, PHOTO_ID),
    };
  }

  function updatePhotoDraft(progress, draft) {
    const clean = normalize(progress) || newProgress();
    if (!validPhotoDraft(draft)) throw new TypeError('Invalid photo draft');
    clean.drafts[PHOTO_ID] = {
      placement: draft.placement,
      lighting: draft.lighting,
      previewed: draft.previewed,
    };
    return clean;
  }

  function completePhoto(progress, draft, clock) {
    const clean = updatePhotoDraft(progress, draft);
    if (!qualifiedPhotoDraft(draft)) {
      throw new Error('Select an off-center third, side lighting and preview before completion');
    }
    if (!isCompleted(clean, PHOTO_ID)) {
      const now = typeof clock === 'function' ? clock() : new Date().toISOString();
      clean.completions.push({
        questId: PHOTO_ID,
        source: 'local_demo',
        completedAt: now,
      });
    }
    return clean;
  }

  function getMovementSnapshot(progress) {
    const clean = normalize(progress) || newProgress();
    return { ...clean.drafts[MOVEMENT_ID], completed: isCompleted(clean, MOVEMENT_ID) };
  }

  function updateMovementDraft(progress, draft) {
    if (!validMovementDraft(draft)) throw new TypeError('Invalid movement path state');
    const clean = normalize(progress) || newProgress();
    clean.drafts[MOVEMENT_ID] = {
      x: draft.x, y: draft.y,
      checkpoints: [...new Set(draft.checkpoints)],
    };
    return clean;
  }

  function completeMovement(progress, draft, clock) {
    const clean = updateMovementDraft(progress, draft);
    if (!qualifiedMovementDraft(draft)) throw new Error('Visit all route checkpoints and reach the goal');
    if (!isCompleted(clean, MOVEMENT_ID)) {
      const now = typeof clock === 'function' ? clock() : new Date().toISOString();
      clean.completions.push({ questId: MOVEMENT_ID, source: 'local_demo', completedAt: now });
    }
    return clean;
  }

  function advanceMovement(progress, direction) {
    const moves = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
    if (!Object.prototype.hasOwnProperty.call(moves, direction)) throw new TypeError('Invalid direction');
    const clean = normalize(progress) || newProgress();
    const before = clean.drafts[MOVEMENT_ID];
    const [dx,dy] = moves[direction];
    const x = before.x + dx, y = before.y + dy;
    if (x < 0 || x > 5 || y < 0 || y > 4 || MOVEMENT_BARRIERS.includes(x + ',' + y)) {
      return { progress: clean, moved: false };
    }
    const checkpoints = before.checkpoints.slice();
    const checkpoint = MOVEMENT_CHECKPOINTS[x + ',' + y];
    if (checkpoint && !checkpoints.includes(checkpoint)) checkpoints.push(checkpoint);
    clean.drafts[MOVEMENT_ID] = { x, y, checkpoints };
    return { progress: clean, moved: true };
  }

  function getEnergySnapshot(progress) {
    const clean = normalize(progress) || newProgress();
    const d = clean.drafts[ENERGY_ID];
    return { panels: d.panels, batteries: d.batteries, loads: { ...d.loads },
      tested: d.tested, completed: isCompleted(clean, ENERGY_ID) };
  }

  function updateEnergyDraft(progress, draft) {
    if (!validEnergyDraft(draft)) throw new TypeError('Invalid energy draft');
    const clean = normalize(progress) || newProgress();
    clean.drafts[ENERGY_ID] = {
      panels: draft.panels, batteries: draft.batteries,
      loads: { lights: draft.loads.lights, studio: draft.loads.studio,
        ventilation: draft.loads.ventilation }, tested: draft.tested,
    };
    return clean;
  }

  function completeEnergy(progress, draft, clock) {
    const clean = updateEnergyDraft(progress, draft);
    if (!qualifiedEnergyDraft(draft)) throw new Error('Energy puzzle does not meet the challenge');
    if (!isCompleted(clean, ENERGY_ID)) {
      const now = typeof clock === 'function' ? clock() : new Date().toISOString();
      clean.completions.push({ questId: ENERGY_ID, source: 'local_demo', completedAt: now });
    }
    return clean;
  }

  function unlockedSkills(progress) {
    return SKILLS.filter(skill => !skill.from || isCompleted(progress, skill.from))
      .map(skill => skill.id);
  }

  function reset(storage) {
    storage.removeItem(KEY);
    storage.removeItem(LEGACY_KEY); // Prevent old completion from re-importing.
    return newProgress();
  }

  root.WAVMVMTProgression = Object.freeze({
    KEY, LEGACY_KEY, QUEST_ID, PHOTO_ID, MOVEMENT_ID, ENERGY_ID, SKILLS,
    newProgress, validPattern, qualifiedPattern, validPhotoDraft,
    qualifiedPhotoDraft, validMovementDraft, qualifiedMovementDraft,
    validEnergyDraft, qualifiedEnergyDraft, energyStats,
    normalize, fromLegacy,
    read, persist, getMusicSnapshot, updateDraft, completeMusic,
    getPhotoSnapshot, updatePhotoDraft, completePhoto,
    getMovementSnapshot, updateMovementDraft, completeMovement, advanceMovement,
    getEnergySnapshot, updateEnergyDraft, completeEnergy,
    isCompleted, unlockedSkills, reset,
  });
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
  'use strict';

  // One canonical format for the static alpha and the 3D World bridge.
  // Demo progression is client-editable. Never trust it for money or permissions.
  const KEY = 'wavmvmt-world-progress-v2';
  const LEGACY_KEY = 'wavmvmt-world-alpha-v1';
  const QUEST_ID = 'music_producer_001';
  const PHOTO_ID = 'photo_composition_001';
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
  ]);
  const EMPTY_PATTERN = () => Array.from({ length: 4 }, () => Array(8).fill(0));
  const PATHS = ['continue', 'reclaim', 'curiosity', 'wildcard'];
  const PHOTO_LIGHTS = ['front', 'side'];

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

  function newProgress() {
    return {
      version: 2,
      onboarding: { path: null },
      drafts: { [QUEST_ID]: { pattern: EMPTY_PATTERN(), playedBar: false },
        [PHOTO_ID]: defaultPhotoDraft() },
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
    // Keep only whitelisted local-demo completions, deduplicated per quest.
    for (const questId of [QUEST_ID, PHOTO_ID]) {
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
    KEY, LEGACY_KEY, QUEST_ID, PHOTO_ID, SKILLS,
    newProgress, validPattern, qualifiedPattern, validPhotoDraft,
    qualifiedPhotoDraft, normalize, fromLegacy,
    read, persist, getMusicSnapshot, updateDraft, completeMusic,
    getPhotoSnapshot, updatePhotoDraft, completePhoto,
    isCompleted, unlockedSkills, reset,
  });
})(typeof window !== 'undefined' ? window : globalThis);

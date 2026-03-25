/**
 * Centralized audio manager — single AudioContext for the entire app.
 * All audio components route through this instead of creating their own AudioContext.
 */

type AudioCategory = 'master' | 'music' | 'sfx' | 'ambient'

interface AudioManagerState {
  ctx: AudioContext | null
  masterGain: GainNode | null
  musicGain: GainNode | null
  sfxGain: GainNode | null
  ambientGain: GainNode | null
  muted: boolean
  masterVolume: number
  bufferCache: Map<string, AudioBuffer>
  initialized: boolean
}

const state: AudioManagerState = {
  ctx: null,
  masterGain: null,
  musicGain: null,
  sfxGain: null,
  ambientGain: null,
  muted: false,
  masterVolume: 0.25,
  bufferCache: new Map(),
  initialized: false,
}

function ensureInit(): boolean {
  if (state.initialized && state.ctx) return true
  if (typeof window === 'undefined') return false

  try {
    const ctx = new AudioContext()
    state.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = state.masterVolume
    master.connect(ctx.destination)
    state.masterGain = master

    const music = ctx.createGain()
    music.gain.value = 0.5
    music.connect(master)
    state.musicGain = music

    const sfx = ctx.createGain()
    sfx.gain.value = 0.7
    sfx.connect(master)
    state.sfxGain = sfx

    const ambient = ctx.createGain()
    ambient.gain.value = 0.6
    ambient.connect(master)
    state.ambientGain = ambient

    state.initialized = true
    return true
  } catch {
    return false
  }
}

function getGain(category: AudioCategory): GainNode | null {
  switch (category) {
    case 'music': return state.musicGain
    case 'sfx': return state.sfxGain
    case 'ambient': return state.ambientGain
    default: return state.masterGain
  }
}

export const audioManager = {
  /** Initialize the audio context — call on first user interaction */
  init(): boolean {
    return ensureInit()
  },

  /** Get the raw AudioContext (for components that need direct access) */
  getContext(): AudioContext | null {
    if (!state.initialized) ensureInit()
    return state.ctx
  },

  /** Get a category gain node to connect sources to */
  getCategoryGain(category: AudioCategory): GainNode | null {
    if (!state.initialized) ensureInit()
    return getGain(category)
  },

  /** Load and cache an audio buffer */
  async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (!state.ctx) return null
    const cached = state.bufferCache.get(url)
    if (cached) return cached

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await state.ctx.decodeAudioData(arrayBuffer)
      state.bufferCache.set(url, audioBuffer)
      return audioBuffer
    } catch {
      return null
    }
  },

  /** Play a one-shot sound effect */
  async playOneShot(url: string, category: AudioCategory = 'sfx', volume = 0.3): Promise<void> {
    const ctx = state.ctx
    const gain = getGain(category)
    if (!ctx || !gain) return

    const buffer = await this.loadBuffer(url)
    if (!buffer) return

    const source = ctx.createBufferSource()
    source.buffer = buffer
    const vol = ctx.createGain()
    vol.gain.value = volume
    source.connect(vol)
    vol.connect(gain)
    source.start()
  },

  /** Play a looping sound, returns stop function */
  async playLoop(url: string, category: AudioCategory = 'ambient', volume = 0.3): Promise<(() => void) | null> {
    const ctx = state.ctx
    const gain = getGain(category)
    if (!ctx || !gain) return null

    const buffer = await this.loadBuffer(url)
    if (!buffer) return null

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const vol = ctx.createGain()
    vol.gain.value = volume
    source.connect(vol)
    vol.connect(gain)
    source.start()

    return () => {
      try { source.stop() } catch { /* already stopped */ }
    }
  },

  /** Create an oscillator connected to a category gain */
  createOscillator(category: AudioCategory = 'sfx'): { osc: OscillatorNode; gain: GainNode } | null {
    const ctx = state.ctx
    const catGain = getGain(category)
    if (!ctx || !catGain) return null

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(catGain)
    return { osc, gain }
  },

  setMasterVolume(v: number): void {
    state.masterVolume = v
    if (state.masterGain) {
      state.masterGain.gain.value = state.muted ? 0 : v
    }
  },

  setMusicVolume(v: number): void {
    if (state.musicGain) state.musicGain.gain.value = v
  },

  setSFXVolume(v: number): void {
    if (state.sfxGain) state.sfxGain.gain.value = v
  },

  toggleMute(): boolean {
    state.muted = !state.muted
    if (state.masterGain) {
      state.masterGain.gain.value = state.muted ? 0 : state.masterVolume
    }
    return state.muted
  },

  getMuted(): boolean {
    return state.muted
  },

  getMasterVolume(): number {
    return state.masterVolume
  },
}

'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'

// Audio file paths (served from /public/audio/)
const LOOPS = {
  construction: '/audio/construction_loop.ogg',
  machine: '/audio/machine_loop.ogg',
  ambient: '/audio/ambient_01.ogg',
}

const SFX = {
  hits: ['/audio/hit_01.ogg', '/audio/hit_02.ogg', '/audio/hit_03.ogg'],
  metalHits: ['/audio/metal_hit_01.ogg', '/audio/metal_hit_02.ogg'],
  woodHits: ['/audio/wood_hit_01.ogg', '/audio/wood_hit_02.ogg'],
  metal: ['/audio/metal_01.ogg', '/audio/metal_02.ogg'],
  stones: ['/audio/stones_01.ogg'],
}

const FOOTSTEPS = ['/audio/footstep_01.ogg', '/audio/footstep_02.ogg']

/**
 * Real audio file-based construction site ambience.
 * Loops continuous background, plays random SFX events.
 */
export function AmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)
  const nextEventRef = useRef(0)
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map())
  const loopsStartedRef = useRef(false)

  // Load an audio file and cache it
  const loadBuffer = useCallback(async (url: string): Promise<AudioBuffer | null> => {
    const ctx = ctxRef.current
    if (!ctx) return null

    const cached = bufferCacheRef.current.get(url)
    if (cached) return cached

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      bufferCacheRef.current.set(url, audioBuffer)
      return audioBuffer
    } catch (e) {
      console.warn('Failed to load audio:', url, e)
      return null
    }
  }, [])

  // Play a one-shot sound effect
  const playSFX = useCallback(async (url: string, volume = 0.3) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    const buffer = await loadBuffer(url)
    if (!buffer) return

    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(master)
    source.start()
  }, [loadBuffer])

  // Start looping background tracks
  const startLoops = useCallback(async () => {
    if (loopsStartedRef.current) return
    loopsStartedRef.current = true

    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    // Construction site loop — main ambience
    const constructionBuf = await loadBuffer(LOOPS.construction)
    if (constructionBuf) {
      const src = ctx.createBufferSource()
      src.buffer = constructionBuf
      src.loop = true
      const gain = ctx.createGain()
      gain.gain.value = 0.35
      src.connect(gain)
      gain.connect(master)
      src.start()
    }

    // Machine hum loop — subtle background
    const machineBuf = await loadBuffer(LOOPS.machine)
    if (machineBuf) {
      const src = ctx.createBufferSource()
      src.buffer = machineBuf
      src.loop = true
      const gain = ctx.createGain()
      gain.gain.value = 0.15
      src.connect(gain)
      gain.connect(master)
      src.start()
    }

    // Ambient atmosphere loop
    const ambientBuf = await loadBuffer(LOOPS.ambient)
    if (ambientBuf) {
      const src = ctx.createBufferSource()
      src.buffer = ambientBuf
      src.loop = true
      const gain = ctx.createGain()
      gain.gain.value = 0.2
      src.connect(gain)
      gain.connect(master)
      src.start()
    }
  }, [loadBuffer])

  const initAudio = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    const ctx = new AudioContext()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.value = 0.25
    master.connect(ctx.destination)
    masterRef.current = master

    // Start loading and playing loops
    startLoops()

    // Pre-load SFX for instant playback
    Object.values(SFX).flat().forEach(url => loadBuffer(url))
    FOOTSTEPS.forEach(url => loadBuffer(url))
  }, [startLoops, loadBuffer])

  // Start on first click, touch, or explicit startAudio event
  useEffect(() => {
    const start = () => {
      initAudio()
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('click', start)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('startAudio', start)
    }
    window.addEventListener('click', start)
    window.addEventListener('touchstart', start)
    window.addEventListener('startAudio', start)

    // Listen for mute toggle from HUD
    const onToggleMute = () => {
      if (masterRef.current) {
        const current = masterRef.current.gain.value
        masterRef.current.gain.value = current > 0 ? 0 : 0.25
        window.dispatchEvent(new CustomEvent('audioState', { detail: { muted: current > 0 } }))
      }
    }
    window.addEventListener('toggleAudio', onToggleMute)

    // Listen for volume slider changes
    const onSetVolume = (e: Event) => {
      if (masterRef.current) {
        const vol = (e as CustomEvent).detail.volume
        masterRef.current.gain.value = vol * 0.5 // scale 0-1 to 0-0.5 range
      }
    }
    window.addEventListener('setVolume', onSetVolume)

    // Listen for footstep events from Player
    const onFootstep = () => {
      const url = FOOTSTEPS[Math.floor(Math.random() * FOOTSTEPS.length)]
      playSFX(url, 0.2 + Math.random() * 0.1)
    }
    window.addEventListener('playFootstep', onFootstep)

    return () => {
      cleanup()
      window.removeEventListener('playFootstep', onFootstep)
      window.removeEventListener('toggleAudio', onToggleMute)
      window.removeEventListener('setVolume', onSetVolume)
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [initAudio, playSFX])

  // Random construction SFX events
  useFrame(() => {
    const ctx = ctxRef.current
    if (!ctx || !masterRef.current) return

    const now = ctx.currentTime
    if (now < nextEventRef.current) return

    // Random event every 1.5-4 seconds
    nextEventRef.current = now + 1.5 + Math.random() * 2.5

    const type = Math.random()
    const allSfx = [
      ...SFX.hits,
      ...SFX.metalHits,
      ...SFX.woodHits,
      ...SFX.metal,
      ...SFX.stones,
    ]

    if (type < 0.3) {
      // Hammer/hit
      const url = SFX.hits[Math.floor(Math.random() * SFX.hits.length)]
      playSFX(url, 0.25 + Math.random() * 0.15)
    } else if (type < 0.5) {
      // Metal hit
      const url = SFX.metalHits[Math.floor(Math.random() * SFX.metalHits.length)]
      playSFX(url, 0.2 + Math.random() * 0.1)
    } else if (type < 0.65) {
      // Wood hit
      const url = SFX.woodHits[Math.floor(Math.random() * SFX.woodHits.length)]
      playSFX(url, 0.25 + Math.random() * 0.1)
    } else if (type < 0.8) {
      // Metal scrape/clang
      const url = SFX.metal[Math.floor(Math.random() * SFX.metal.length)]
      playSFX(url, 0.15 + Math.random() * 0.1)
    } else {
      // Stones/rubble
      playSFX(SFX.stones[0], 0.2)
    }
  })

  return null
}

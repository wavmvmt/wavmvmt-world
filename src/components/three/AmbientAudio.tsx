'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

/**
 * Generates construction-like ambient sounds using Web Audio API oscillators.
 * No external audio files needed — pure synthesis.
 */
export function AmbientAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)
  const nextEventRef = useRef(0)
  const { camera } = useThree()

  const initAudio = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    // Master gain — audible but not overwhelming
    const master = ctx.createGain()
    master.gain.value = 0.15
    master.connect(ctx.destination)
    gainRef.current = master

    // Constant low rumble — distant construction
    const rumbleOsc = ctx.createOscillator()
    rumbleOsc.type = 'sawtooth'
    rumbleOsc.frequency.value = 35
    const rumbleGain = ctx.createGain()
    rumbleGain.gain.value = 0.06
    const rumbleFilter = ctx.createBiquadFilter()
    rumbleFilter.type = 'lowpass'
    rumbleFilter.frequency.value = 80
    rumbleOsc.connect(rumbleFilter)
    rumbleFilter.connect(rumbleGain)
    rumbleGain.connect(master)
    rumbleOsc.start()

    // Subtle wind-like noise via detuned oscillators
    const windOsc1 = ctx.createOscillator()
    windOsc1.type = 'sine'
    windOsc1.frequency.value = 220
    const windOsc2 = ctx.createOscillator()
    windOsc2.type = 'sine'
    windOsc2.frequency.value = 223 // slight detune = beating/wind effect
    const windGain = ctx.createGain()
    windGain.gain.value = 0.02
    windOsc1.connect(windGain)
    windOsc2.connect(windGain)
    windGain.connect(master)
    windOsc1.start()
    windOsc2.start()
  }, [])

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
    return () => {
      cleanup()
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [initAudio])

  // Random construction sound events (hammer taps, metallic clinks)
  useFrame(() => {
    if (!audioCtxRef.current || !gainRef.current) return
    const ctx = audioCtxRef.current
    const now = ctx.currentTime

    if (now < nextEventRef.current) return

    // Schedule next event 1-4 seconds from now
    nextEventRef.current = now + 1 + Math.random() * 3

    // Random construction sound
    const type = Math.random()

    if (type < 0.4) {
      // Hammer tap — short percussive hit
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = 800 + Math.random() * 400
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.04, now)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.connect(env)
      env.connect(gainRef.current)
      osc.start(now)
      osc.stop(now + 0.1)
    } else if (type < 0.7) {
      // Metal clink — higher pitched, very short
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 2000 + Math.random() * 1500
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.025, now)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      osc.connect(env)
      env.connect(gainRef.current)
      osc.start(now)
      osc.stop(now + 0.06)
    } else {
      // Distant thud — low, resonant
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 60 + Math.random() * 40
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.05, now)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc.connect(env)
      env.connect(gainRef.current)
      osc.start(now)
      osc.stop(now + 0.35)
    }
  })

  return null // Audio only — no visual output
}

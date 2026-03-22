'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Construction site audio — uses noise + filtered oscillators for
 * realistic-sounding impacts, machinery, and atmosphere.
 * Much louder and more present than the previous version.
 */
export function AmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)
  const nextEventRef = useRef(0)
  const noiseBufferRef = useRef<AudioBuffer | null>(null)

  const initAudio = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    const ctx = new AudioContext()
    ctxRef.current = ctx

    // Master volume — clearly audible
    const master = ctx.createGain()
    master.gain.value = 0.4
    master.connect(ctx.destination)
    masterRef.current = master

    // Pre-generate noise buffer (used for impacts, machinery, etc.)
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    noiseBufferRef.current = noiseBuffer

    // === CONTINUOUS LAYERS ===

    // 1. Deep machinery hum (like a generator running)
    const hum1 = ctx.createOscillator()
    hum1.type = 'sawtooth'
    hum1.frequency.value = 55
    const hum1Gain = ctx.createGain()
    hum1Gain.gain.value = 0.08
    const hum1Filter = ctx.createBiquadFilter()
    hum1Filter.type = 'lowpass'
    hum1Filter.frequency.value = 120
    hum1.connect(hum1Filter)
    hum1Filter.connect(hum1Gain)
    hum1Gain.connect(master)
    hum1.start()

    // 2. Mid-range machinery whir
    const hum2 = ctx.createOscillator()
    hum2.type = 'triangle'
    hum2.frequency.value = 110
    const hum2Gain = ctx.createGain()
    hum2Gain.gain.value = 0.03
    const hum2Filter = ctx.createBiquadFilter()
    hum2Filter.type = 'bandpass'
    hum2Filter.frequency.value = 150
    hum2Filter.Q.value = 2
    hum2.connect(hum2Filter)
    hum2Filter.connect(hum2Gain)
    hum2Gain.connect(master)
    hum2.start()

    // 3. Air/ventilation noise (filtered white noise)
    const airNoise = ctx.createBufferSource()
    airNoise.buffer = noiseBuffer
    airNoise.loop = true
    const airFilter = ctx.createBiquadFilter()
    airFilter.type = 'bandpass'
    airFilter.frequency.value = 400
    airFilter.Q.value = 0.5
    const airGain = ctx.createGain()
    airGain.gain.value = 0.04
    airNoise.connect(airFilter)
    airFilter.connect(airGain)
    airGain.connect(master)
    airNoise.start()

    // 4. Slow LFO modulating the hum (makes it feel alive)
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.15 // very slow wobble
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 5
    lfo.connect(lfoGain)
    lfoGain.connect(hum1.frequency)
    lfo.start()

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
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [initAudio])

  // Random construction events — much more varied and realistic
  useFrame(() => {
    const ctx = ctxRef.current
    const master = masterRef.current
    const noiseBuffer = noiseBufferRef.current
    if (!ctx || !master || !noiseBuffer) return

    const now = ctx.currentTime
    if (now < nextEventRef.current) return

    // Events every 0.5-2.5 seconds (more frequent than before)
    nextEventRef.current = now + 0.5 + Math.random() * 2

    const type = Math.random()

    if (type < 0.25) {
      // HAMMER HIT — noise burst + low thump
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = 1000 + Math.random() * 2000
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.12, now)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      noise.connect(filter)
      filter.connect(env)
      env.connect(master)
      noise.start(now)
      noise.stop(now + 0.08)

      // Low thump component
      const thump = ctx.createOscillator()
      thump.type = 'sine'
      thump.frequency.setValueAtTime(150, now)
      thump.frequency.exponentialRampToValueAtTime(50, now + 0.05)
      const thumpEnv = ctx.createGain()
      thumpEnv.gain.setValueAtTime(0.15, now)
      thumpEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      thump.connect(thumpEnv)
      thumpEnv.connect(master)
      thump.start(now)
      thump.stop(now + 0.12)

    } else if (type < 0.45) {
      // METAL CLANG — resonant metallic ring
      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.value = 800 + Math.random() * 1200
      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.value = osc1.frequency.value * 1.5 // harmonic
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.08, now)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc1.connect(env)
      osc2.connect(env)
      env.connect(master)
      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.35)
      osc2.stop(now + 0.35)

    } else if (type < 0.6) {
      // DRILL / SAW — noise burst with resonance
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 3000 + Math.random() * 2000
      filter.Q.value = 5
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.06, now)
      env.gain.setValueAtTime(0.06, now + 0.3 + Math.random() * 0.5)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + Math.random() * 0.5)
      noise.connect(filter)
      filter.connect(env)
      env.connect(master)
      noise.start(now)
      noise.stop(now + 1)

    } else if (type < 0.75) {
      // HEAVY THUD — something being dropped
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(80, now)
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2)
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.2, now)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.connect(env)
      env.connect(master)
      osc.start(now)
      osc.stop(now + 0.45)

      // Impact noise
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 500
      const nEnv = ctx.createGain()
      nEnv.gain.setValueAtTime(0.1, now)
      nEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      noise.connect(filter)
      filter.connect(nEnv)
      nEnv.connect(master)
      noise.start(now)
      noise.stop(now + 0.2)

    } else if (type < 0.88) {
      // WRENCH / RATCHET — rapid clicks
      const clickCount = 3 + Math.floor(Math.random() * 5)
      for (let i = 0; i < clickCount; i++) {
        const clickTime = now + i * 0.06
        const noise = ctx.createBufferSource()
        noise.buffer = noiseBuffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.value = 4000
        const env = ctx.createGain()
        env.gain.setValueAtTime(0.06, clickTime)
        env.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02)
        noise.connect(filter)
        filter.connect(env)
        env.connect(master)
        noise.start(clickTime)
        noise.stop(clickTime + 0.03)
      }

    } else {
      // DISTANT BEEPING — reversing vehicle
      for (let i = 0; i < 3; i++) {
        const beepTime = now + i * 0.6
        const osc = ctx.createOscillator()
        osc.type = 'square'
        osc.frequency.value = 1000
        const env = ctx.createGain()
        env.gain.setValueAtTime(0.04, beepTime)
        env.gain.setValueAtTime(0.04, beepTime + 0.2)
        env.gain.exponentialRampToValueAtTime(0.001, beepTime + 0.25)
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 2000
        osc.connect(filter)
        filter.connect(env)
        env.connect(master)
        osc.start(beepTime)
        osc.stop(beepTime + 0.3)
      }
    }
  })

  return null
}

'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Occasional bird chirps heard near skylights during daytime.
 * Pure synthesis — short sine sweeps that sound like distant birds.
 */
export function BirdSounds() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const nextChirpRef = useRef(5)
  const mutedRef = useRef(false)

  useEffect(() => {
    const init = () => {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext()
        const gain = ctxRef.current.createGain()
        gain.gain.value = 0.02
        gain.connect(ctxRef.current.destination)
        masterGainRef.current = gain
      }
    }
    window.addEventListener('startAudio', init)
    window.addEventListener('click', init)

    // Respect global mute
    const onToggle = () => {
      mutedRef.current = !mutedRef.current
      if (masterGainRef.current) {
        masterGainRef.current.gain.value = mutedRef.current ? 0 : 0.02
      }
    }
    window.addEventListener('toggleAudio', onToggle)

    // Respect global volume
    const onVolume = (e: Event) => {
      if (masterGainRef.current) {
        const vol = (e as CustomEvent).detail.volume
        masterGainRef.current.gain.value = vol * 0.04
        mutedRef.current = vol === 0
      }
    }
    window.addEventListener('setVolume', onVolume)

    return () => {
      window.removeEventListener('startAudio', init)
      window.removeEventListener('click', init)
      window.removeEventListener('toggleAudio', onToggle)
      window.removeEventListener('setVolume', onVolume)
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [])

  useFrame((state) => {
    const ctx = ctxRef.current
    if (!ctx) return

    const t = state.clock.elapsedTime
    const cycle = (t % 300) / 300

    // Only chirp during daytime (0-40% and 85-100% of cycle)
    const isDaytime = cycle < 0.4 || cycle > 0.85
    if (!isDaytime) return

    if (t < nextChirpRef.current) return
    nextChirpRef.current = t + 4 + Math.random() * 8

    const now = ctx.currentTime
    const chirpCount = 1 + Math.floor(Math.random() * 3)

    for (let i = 0; i < chirpCount; i++) {
      const startTime = now + i * 0.15
      const osc = ctx.createOscillator()
      osc.type = 'sine'

      // Bird chirp: quick frequency sweep up then down
      const baseFreq = 2000 + Math.random() * 2000
      osc.frequency.setValueAtTime(baseFreq, startTime)
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.3, startTime + 0.04)
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, startTime + 0.08)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.02, startTime + 0.01)
      gain.gain.linearRampToValueAtTime(0, startTime + 0.1)

      osc.connect(gain)
      gain.connect(masterGainRef.current || ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.12)
    }
  })

  return null
}

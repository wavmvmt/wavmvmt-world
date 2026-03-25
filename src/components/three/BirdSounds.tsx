'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioManager } from '@/lib/audioManager'

/**
 * Occasional bird chirps heard near skylights during daytime.
 * Uses audioManager instead of own AudioContext.
 */
export function BirdSounds() {
  const nextChirpRef = useRef(5)

  useFrame((state) => {
    const ctx = audioManager.getContext()
    if (!ctx) return

    const t = state.clock.elapsedTime
    const cycle = (t % 300) / 300

    // Only chirp during daytime
    const isDaytime = cycle < 0.4 || cycle > 0.85
    if (!isDaytime) return

    if (t < nextChirpRef.current) return
    nextChirpRef.current = t + 4 + Math.random() * 8

    const now = ctx.currentTime
    const chirpCount = 1 + Math.floor(Math.random() * 3)

    for (let i = 0; i < chirpCount; i++) {
      const startTime = now + i * 0.15
      const result = audioManager.createOscillator('ambient')
      if (!result) return
      const { osc, gain } = result

      osc.type = 'sine'
      const baseFreq = 2000 + Math.random() * 2000
      osc.frequency.setValueAtTime(baseFreq, startTime)
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.3, startTime + 0.04)
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, startTime + 0.08)

      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.02, startTime + 0.01)
      gain.gain.linearRampToValueAtTime(0, startTime + 0.1)

      osc.start(startTime)
      osc.stop(startTime + 0.12)
    }
  })

  return null
}

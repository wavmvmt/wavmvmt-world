'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioManager } from '@/lib/audioManager'

/**
 * Cafe lo-fi ambient — plays a gentle synth pad when player is in the cafe.
 * Uses audioManager instead of own AudioContext.
 */
let _fs_CafeAmbi = 0
export function CafeAmbient() {
  const gainRef = useRef<GainNode | null>(null)
  const activeRef = useRef(false)
  const oscsRef = useRef<OscillatorNode[]>([])
  const playerNear = useRef(false)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerNear.current = Math.abs(x + 105) < 55 && Math.abs(z - 55) < 40
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      oscsRef.current.forEach(o => { try { o.stop() } catch { /* already stopped */ } })
    }
  }, [])

  useFrame(() => {
    if ((_fs_CafeAmbi = (_fs_CafeAmbi + 1) % 6) !== 0) return
    if (playerNear.current && !activeRef.current) {
      activeRef.current = true
      const ctx = audioManager.getContext()
      const ambientGain = audioManager.getCategoryGain('ambient')
      if (!ctx || !ambientGain) return

      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3)
      gain.connect(ambientGain)
      gainRef.current = gain

      const notes = [130.81, 164.81, 196.00, 246.94]
      const oscs: OscillatorNode[] = []

      notes.forEach(freq => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = freq
        const oscGain = ctx.createGain()
        oscGain.gain.value = 0.3

        const osc2 = ctx.createOscillator()
        osc2.type = 'sine'
        osc2.frequency.value = freq * 1.002
        const oscGain2 = ctx.createGain()
        oscGain2.gain.value = 0.15

        osc.connect(oscGain)
        osc2.connect(oscGain2)
        oscGain.connect(gain)
        oscGain2.connect(gain)
        osc.start()
        osc2.start()
        oscs.push(osc, osc2)
      })

      oscsRef.current = oscs
    }

    if (!playerNear.current && activeRef.current) {
      activeRef.current = false
      const ctx = audioManager.getContext()
      if (gainRef.current && ctx) {
        gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
        const oscs = oscsRef.current
        setTimeout(() => {
          oscs.forEach(o => { try { o.stop() } catch { /* already stopped */ } })
        }, 2500)
        oscsRef.current = []
      }
    }
  })

  return null
}

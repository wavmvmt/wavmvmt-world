'use client'

import { useEffect, useRef } from 'react'
import { ROOMS } from '@/lib/roomConfig'
import { audioManager } from '@/lib/audioManager'

interface RoomSound {
  roomName: string
  file: string
  maxVolume: number
  falloffDistance: number
}

const ROOM_SOUNDS: RoomSound[] = [
  { roomName: 'Sound Bath', file: '/audio/ambient_03.ogg', maxVolume: 0.12, falloffDistance: 60 },
  { roomName: 'Music Studio', file: '/audio/ambient_04.ogg', maxVolume: 0.1, falloffDistance: 50 },
  { roomName: 'Cafe & Lounge', file: '/audio/ambient_02.ogg', maxVolume: 0.08, falloffDistance: 50 },
  { roomName: 'Recovery Suite', file: '/audio/water_loop.ogg', maxVolume: 0.1, falloffDistance: 55 },
  { roomName: 'Weight Training', file: '/audio/machine_loop.ogg', maxVolume: 0.06, falloffDistance: 50 },
  { roomName: 'Amphitheatre', file: '/audio/ambient_01.ogg', maxVolume: 0.08, falloffDistance: 60 },
]

export function RoomAmbience() {
  const sourcesRef = useRef<Map<string, { source: AudioBufferSourceNode; gain: GainNode }>>(new Map())
  const playerPos = useRef({ x: 0, z: 0 })
  const startedRef = useRef(false)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }

    const onStart = () => {
      if (startedRef.current) return
      startedRef.current = true
      initAudio()
    }

    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('startAudio', onStart)
    document.addEventListener('click', onStart, { once: true })

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('startAudio', onStart)
    }
  }, [])

  async function initAudio() {
    if (!audioManager.init()) return
    const ctx = audioManager.getContext()
    const ambientGain = audioManager.getCategoryGain('ambient')
    if (!ctx || !ambientGain) return

    for (const rs of ROOM_SOUNDS) {
      try {
        const buffer = await audioManager.loadBuffer(rs.file)
        if (!buffer) continue

        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.loop = true

        const gain = ctx.createGain()
        gain.gain.value = 0
        source.connect(gain)
        gain.connect(ambientGain)
        source.start()

        sourcesRef.current.set(rs.roomName, { source, gain })
      } catch {
        // Skip sounds that fail to load
      }
    }

    function updateVolumes() {
      const px = playerPos.current.x
      const pz = playerPos.current.z

      for (const rs of ROOM_SOUNDS) {
        const entry = sourcesRef.current.get(rs.roomName)
        if (!entry) continue

        const room = ROOMS.find(r => r.name === rs.roomName)
        if (!room) continue

        const dist = Math.sqrt((px - room.x) ** 2 + (pz - room.z) ** 2)
        const normalizedDist = Math.max(0, 1 - dist / rs.falloffDistance)
        const targetVolume = audioManager.getMuted() ? 0 : normalizedDist * rs.maxVolume

        const current = entry.gain.gain.value
        entry.gain.gain.value = current + (targetVolume - current) * 0.05
      }

      requestAnimationFrame(updateVolumes)
    }

    updateVolumes()
  }

  return null
}

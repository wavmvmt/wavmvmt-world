'use client'

import { useEffect, useRef } from 'react'
import { ROOMS } from '@/lib/roomConfig'

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

/**
 * Room proximity audio — each room has its own ambient loop that
 * fades in as the player approaches and fades out as they leave.
 * Creates a spatial soundscape across the warehouse.
 */
export function RoomAmbience() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourcesRef = useRef<Map<string, { source: AudioBufferSourceNode; gain: GainNode }>>(new Map())
  const playerPos = useRef({ x: 0, z: 0 })
  const mutedRef = useRef(false)
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

    const onToggle = () => {
      mutedRef.current = !mutedRef.current
    }

    const onMuteState = (e: Event) => {
      mutedRef.current = (e as CustomEvent).detail.muted
    }

    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('startAudio', onStart)
    window.addEventListener('toggleAudio', onToggle)
    window.addEventListener('audioState', onMuteState as EventListener)

    // Also start on first click (browser autoplay policy)
    document.addEventListener('click', onStart, { once: true })

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('startAudio', onStart)
      window.removeEventListener('toggleAudio', onToggle)
      window.removeEventListener('audioState', onMuteState as EventListener)
    }
  }, [])

  async function initAudio() {
    try {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      for (const rs of ROOM_SOUNDS) {
        try {
          const response = await fetch(rs.file)
          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

          const source = ctx.createBufferSource()
          source.buffer = audioBuffer
          source.loop = true

          const gain = ctx.createGain()
          gain.gain.value = 0 // Start silent

          source.connect(gain)
          gain.connect(ctx.destination)
          source.start()

          sourcesRef.current.set(rs.roomName, { source, gain })
        } catch {
          // Skip sounds that fail to load
        }
      }

      // Update volumes based on proximity
      function updateVolumes() {
        if (!audioCtxRef.current) return

        const px = playerPos.current.x
        const pz = playerPos.current.z

        for (const rs of ROOM_SOUNDS) {
          const entry = sourcesRef.current.get(rs.roomName)
          if (!entry) continue

          const room = ROOMS.find(r => r.name === rs.roomName)
          if (!room) continue

          const dist = Math.sqrt((px - room.x) ** 2 + (pz - room.z) ** 2)
          const normalizedDist = Math.max(0, 1 - dist / rs.falloffDistance)
          const targetVolume = mutedRef.current ? 0 : normalizedDist * rs.maxVolume

          // Smooth transition
          const current = entry.gain.gain.value
          entry.gain.gain.value = current + (targetVolume - current) * 0.05
        }

        requestAnimationFrame(updateVolumes)
      }

      updateVolumes()
    } catch {
      // Web Audio not available
    }
  }

  return null // No visual output
}

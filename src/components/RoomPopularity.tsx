'use client'

import { useState, useEffect, useRef } from 'react'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Tracks which rooms visitors spend the most time in.
 * Shows a "Most Popular Rooms" mini-display.
 * Data is per-session but gives a feel of engagement.
 */
export function useRoomPopularity() {
  const timeInRoom = useRef<Record<string, number>>({})
  const currentRoom = useRef<string | null>(null)
  const lastTick = useRef(Date.now())

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const now = Date.now()
      const delta = (now - lastTick.current) / 1000
      lastTick.current = now

      // Add time to current room
      if (currentRoom.current && delta < 1) {
        timeInRoom.current[currentRoom.current] = (timeInRoom.current[currentRoom.current] || 0) + delta
      }

      // Check which room we're in
      currentRoom.current = null
      for (const room of ROOMS) {
        if (Math.abs(x - room.x) < room.w / 2 + 5 && Math.abs(z - room.z) < room.d / 2 + 5) {
          currentRoom.current = room.name
          break
        }
      }
    }

    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [])

  return timeInRoom
}

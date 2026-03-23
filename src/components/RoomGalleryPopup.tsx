'use client'

import { useState, useEffect } from 'react'

/**
 * When a player approaches a room and presses G, shows the
 * architectural render for that room as a fullscreen popup.
 * Lets visitors see what the room will actually look like.
 */

const ROOM_RENDERS: Record<string, { src: string; label: string }[]> = {
  'Parkour Gym': [
    { src: '/images/renders/parkour-gym.png', label: 'Parkour Gym — Aerial Arts & Movement' },
    { src: '/images/renders/parkour-springboard.png', label: 'Parkour — Vault Boxes & Foam Pit' },
  ],
  'Sound Bath': [
    { src: '/images/renders/sound-bath.png', label: 'Sound Bath — Crystal Bowls & Gong' },
  ],
  'Music Studio': [
    { src: '/images/renders/creative-spaces.png', label: 'Music Studios A, B & C' },
  ],
  'Weight Training': [
    { src: '/images/renders/weight-training.png', label: 'WAVMVMT Gym Floor' },
  ],
  'Front Desk': [
    { src: '/images/renders/front-desk.png', label: 'WAVMVMT Reception & Lobby' },
  ],
  'Amphitheatre': [
    { src: '/images/renders/amphitheatre-interior.png', label: 'Amphitheatre — Stage & Performance' },
  ],
  'Recovery Suite': [
    { src: '/images/renders/ice-bath-sauna.png', label: 'Ice Baths, Sauna & Salt Room' },
  ],
  'Yoga Room': [
    { src: '/images/renders/yoga-meditation.png', label: 'Yoga & Meditation Studio' },
  ],
  'Cafe & Lounge': [
    { src: '/images/renders/cafe-lounge.png', label: 'Café & Lounge — Espresso Bar' },
  ],
}

export function RoomGalleryPopup() {
  const [room, setRoom] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [nearRoom, setNearRoom] = useState<string | null>(null)

  // Track which room player is near
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const { ROOMS } = require('@/lib/roomConfig')
      let closest: string | null = null
      for (const r of ROOMS) {
        const dx = x - r.x
        const dz = z - r.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < Math.max(r.w, r.d) / 2 + 8) {
          closest = r.name
          break
        }
      }
      setNearRoom(closest)
    }
    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  // G key opens gallery for nearest room
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        if (room) {
          setRoom(null)
        } else if (nearRoom && ROOM_RENDERS[nearRoom]) {
          setRoom(nearRoom)
          setCurrentImage(0)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [room, nearRoom])

  if (!room) {
    // Show hint when near a room with renders
    if (nearRoom && ROOM_RENDERS[nearRoom]) {
      return (
        <div className="fixed bottom-40 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full text-[0.5rem] tracking-wider"
            style={{
              background: 'rgba(26,21,32,0.7)',
              border: '1px solid rgba(240,198,116,0.15)',
              color: 'rgba(240,198,116,0.4)',
            }}>
            Press G to view render
          </div>
        </div>
      )
    }
    return null
  }

  const renders = ROOM_RENDERS[room] || []
  const current = renders[currentImage]
  if (!current) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      onClick={() => setRoom(null)}>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.label}
          className="w-full rounded-2xl"
          style={{ maxHeight: '70vh', objectFit: 'contain' }}
        />

        {/* Label */}
        <div className="text-center mt-4">
          <p className="text-sm" style={{ color: 'rgba(255,220,180,0.6)', fontFamily: "'Playfair Display', serif" }}>
            {current.label}
          </p>
          <p className="text-[0.45rem] mt-1" style={{ color: 'rgba(255,220,180,0.2)' }}>
            Conceptual render · {currentImage + 1} / {renders.length} · Press G or click to close
          </p>
        </div>

        {/* Nav arrows if multiple */}
        {renders.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2">
            <button onClick={(e) => { e.stopPropagation(); setCurrentImage(i => (i - 1 + renders.length) % renders.length) }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(26,21,32,0.8)', color: '#f0c674', fontSize: '1.2rem' }}>
              ‹
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImage(i => (i + 1) % renders.length) }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(26,21,32,0.8)', color: '#f0c674', fontSize: '1.2rem' }}>
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

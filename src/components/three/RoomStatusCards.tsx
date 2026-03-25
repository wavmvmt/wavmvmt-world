'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Floating status cards above each room showing live data:
 * - Current build phase description
 * - Estimated completion status
 * - Key feature highlight
 * Only visible when player is within range.
 */

const BUILD_PHASES: Record<string, string> = {
  'Parkour Gym': 'Obstacle layout finalized — wall-run zones in progress',
  'Sound Bath': 'Acoustic treatment spec\'d — bowl placement mapped',
  'Music Studio': 'Console selected — booth soundproofing underway',
  'Cafe & Lounge': 'Kitchen design approved — espresso bar sourced',
  'Front Desk': 'Reception desk fabrication — kiosk software in dev',
  'Yoga Room': 'Bamboo flooring ordered — aerial rigging engineered',
  'Weight Training': 'Equipment list finalized — platform bases poured',
  'Amphitheatre': 'Stage framing complete — seating layout locked',
  'Photo Studio': 'Cyclorama wall formed — lighting grid hung',
  'Video Studio': 'Sound stage framed — green screen ordered',
  'Recovery Suite': 'Plumbing roughed in — sauna cedar delivered',
  'Spa & Wellness': 'Treatment room walls up — cryo unit sourced',
  'Education Wing': 'Classroom partitions planned — tech spec in review',
}

export function RoomStatusCards() {
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 })

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      setPlayerPos({ x, z })
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [])

  return (
    <group>
      {ROOMS.map((room) => {
        const dx = playerPos.x - room.x
        const dz = playerPos.z - room.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        const range = Math.max(room.w, room.d) / 2 + 20
        if (dist > range) return null

        const hexColor = `#${room.color.toString(16).padStart(6, '0')}`
        const phase = BUILD_PHASES[room.name] || 'Planning phase'

        return (
          <Html
            key={room.name}
            position={[room.x, room.h + 8, room.z]}
            center
            distanceFactor={20}
          >
            <div style={{
              background: 'rgba(26,21,32,0.88)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${hexColor}30`,
              borderRadius: '10px',
              padding: '6px 10px',
              maxWidth: '180px',
              pointerEvents: 'none',
              opacity: Math.max(0, 1 - (dist / range) * 0.5),
            }}>
              <div style={{
                fontSize: '7px',
                color: hexColor,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '3px',
              }}>
                {room.buildPct > 0 ? `Phase: ${room.buildPct}%` : 'Pre-construction'}
              </div>
              <div style={{
                fontSize: '6px',
                color: 'rgba(255,220,180,0.45)',
                lineHeight: '1.3',
              }}>
                {phase}
              </div>
              {room.features.length > 0 && (
                <div style={{
                  fontSize: '5.5px',
                  color: `${hexColor}80`,
                  marginTop: '3px',
                  borderTop: `1px solid ${hexColor}15`,
                  paddingTop: '3px',
                }}>
                  Next: {room.features[0]}
                </div>
              )}
            </div>
          </Html>
        )
      })}
    </group>
  )
}

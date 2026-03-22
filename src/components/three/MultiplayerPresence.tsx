'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS, SKIN_TONES } from '@/lib/roomConfig'
import { createClient } from '@/lib/supabase/client'

interface PresenceState {
  id: string
  x: number
  z: number
  color: number
}

/**
 * Real-time multiplayer presence using Supabase Realtime.
 * Shows other visitors as simple animated avatars.
 * Each visitor gets a unique color.
 */
export function MultiplayerPresence() {
  const [others, setOthers] = useState<Map<string, PresenceState>>(new Map())
  const myId = useRef(`v-${Math.random().toString(36).slice(2, 8)}`)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const lastBroadcast = useRef(0)
  const myColor = useRef(SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('world-presence', {
      config: { presence: { key: myId.current } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const map = new Map<string, PresenceState>()
        Object.entries(state).forEach(([key, presences]) => {
          if (key !== myId.current && presences.length > 0) {
            const p = presences[0] as unknown as PresenceState
            map.set(key, p)
          }
        })
        setOthers(map)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: myId.current,
            x: 0,
            z: 12,
            color: myColor.current,
          })
        }
      })

    channelRef.current = channel

    // Listen for player position and broadcast
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const now = Date.now()
      // Throttle broadcasts to every 100ms
      if (now - lastBroadcast.current > 100) {
        lastBroadcast.current = now
        channel.track({
          id: myId.current,
          x: Math.round(x * 10) / 10,
          z: Math.round(z * 10) / 10,
          color: myColor.current,
        })
      }
    }
    window.addEventListener('playerMove', onMove as EventListener)

    // Dispatch visitor count
    const countInterval = setInterval(() => {
      const count = others.size + 1
      window.dispatchEvent(new CustomEvent('visitorCount', { detail: { count } }))
    }, 2000)

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      clearInterval(countInterval)
      channel.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <group>
      {Array.from(others.values()).map((other) => (
        <OtherPlayer key={other.id} state={other} />
      ))}
    </group>
  )
}

/** Simple avatar for other visitors */
function OtherPlayer({ state }: { state: PresenceState }) {
  const groupRef = useRef<THREE.Group>(null)
  const targetPos = useRef(new THREE.Vector3(state.x, 0, state.z))

  useEffect(() => {
    targetPos.current.set(state.x, 0, state.z)
  }, [state.x, state.z])

  useFrame(() => {
    if (!groupRef.current) return
    // Smooth interpolation to target position
    groupRef.current.position.lerp(targetPos.current, 0.1)
  })

  return (
    <group ref={groupRef} position={[state.x, 0, state.z]} scale={1.8}>
      {/* Body */}
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 6, 8]} />
        <meshStandardMaterial color={0x3a5080} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.25, 10, 10]} />
        <meshStandardMaterial color={state.color || 0xf0c898} roughness={0.8} />
      </mesh>
      {/* Name tag */}
      <Html position={[0, 2.2, 0]} center distanceFactor={15}>
        <div style={{
          color: 'rgba(255,220,180,0.5)',
          fontSize: '7px',
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          background: 'rgba(26,21,32,0.6)',
          padding: '1px 6px',
          borderRadius: '6px',
        }}>
          visitor
        </div>
      </Html>
    </group>
  )
}

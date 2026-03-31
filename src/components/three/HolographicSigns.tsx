'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'
import { Html } from '@react-three/drei'

/**
 * Holographic floating room signs — each room gets a glowing
 * nameplate that hovers above it, rotating slowly to face
 * the player. Sci-fi construction site aesthetic.
 */
let _fs_Holograp = 0
export function HolographicSigns() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if ((_fs_Holograp = (_fs_Holograp + 1) % 4) !== 0) return
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      // Gentle float
      child.position.y = 14 + Math.sin(t * 0.4 + i * 0.5) * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {ROOMS.filter(r => r.buildPct > 0).map((room) => {
        const hexColor = `#${room.color.toString(16).padStart(6, '0')}`

        return (
          <group key={room.name} position={[room.x, 14, room.z]}>
            {/* Holographic plate */}
            <mesh>
              <planeGeometry args={[12, 3]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.03}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Border frame */}
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(12, 3)]} />
              <lineBasicMaterial color={room.color} transparent opacity={0.08} />
            </lineSegments>

            {/* Scan line effect */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[12, 0.05]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Text via HTML */}
            <Html center distanceFactor={35} occlude={false}>
              <div style={{
                textAlign: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: hexColor,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textShadow: `0 0 10px ${hexColor}40, 0 0 30px ${hexColor}20`,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {room.name}
                </div>
                <div style={{
                  fontSize: '8px',
                  color: `${hexColor}60`,
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  marginTop: '2px',
                }}>
                  {room.buildPct}% · {room.sqft?.toLocaleString() || '—'} sqft
                </div>
              </div>
            </Html>

            {/* Vertical line from sign down to room */}
            <mesh position={[0, -7, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 14, 4]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.04}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

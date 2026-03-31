'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Wall-mounted clock showing in-world time.
 * Synced to the day/night cycle (5-min = 24 hours).
 */
let _fs_SiteCloc = 0
export function SiteClock() {
  const hourRef = useRef<THREE.Mesh>(null)
  const minuteRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef('12:00')

  useFrame((state) => {
    if ((_fs_SiteCloc = (_fs_SiteCloc + 1) % 6) !== 0) return
    const t = state.clock.elapsedTime
    const cycle = (t % 300) / 300 // 0-1 over 5 minutes
    const hours24 = cycle * 24
    const hours = Math.floor(hours24)
    const minutes = Math.floor((hours24 % 1) * 60)

    timeRef.current = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    if (hourRef.current) {
      hourRef.current.rotation.z = -(hours24 / 12) * Math.PI * 2
    }
    if (minuteRef.current) {
      minuteRef.current.rotation.z = -(minutes / 60) * Math.PI * 2
    }
  })

  return (
    <group position={[0, 18, -228]}>
      {/* Clock face */}
      <mesh>
        <circleGeometry args={[2, 24]} />
        <meshLambertMaterial color={0xf0e8d8} side={THREE.DoubleSide} />
      </mesh>
      {/* Rim */}
      <mesh>
        <torusGeometry args={[2, 0.15, 8, 24]} />
        <meshLambertMaterial color={COLORS.copper} />
      </mesh>
      {/* Hour hand */}
      <mesh ref={hourRef} position={[0, 0, 0.05]}>
        <boxGeometry args={[0.08, 1, 0.02]} />
        <meshBasicMaterial color={0x1a1520} />
      </mesh>
      {/* Minute hand */}
      <mesh ref={minuteRef} position={[0, 0, 0.06]}>
        <boxGeometry args={[0.05, 1.4, 0.02]} />
        <meshBasicMaterial color={0x3a3040} />
      </mesh>
      {/* Center dot */}
      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[0.1, 8]} />
        <meshBasicMaterial color={COLORS.copper} />
      </mesh>
      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.7, Math.sin(angle) * 1.7, 0.03]}>
            <boxGeometry args={[0.06, i % 3 === 0 ? 0.25 : 0.12, 0.01]} />
            <meshBasicMaterial color={0x1a1520} />
          </mesh>
        )
      })}
      {/* Digital time below */}
      <Html position={[0, -2.8, 0]} center distanceFactor={20}>
        <div style={{
          color: 'rgba(255,220,180,0.3)',
          fontSize: '8px',
          fontFamily: "'DM Mono', monospace",
          pointerEvents: 'none',
        }}>
          SITE TIME
        </div>
      </Html>
    </group>
  )
}

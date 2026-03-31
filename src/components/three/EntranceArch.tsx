'use client'

import { detectPerformanceLevel } from '@/lib/performanceMode'
const _level = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Grand entrance arch at the warehouse front.
 * Steel frame with WAVMVMT signage, warm lighting, and a welcoming glow.
 * Positioned at the south entrance (z=200+).
 */
let _fs_Entrance = 0
export function EntranceArch() {
  if (_level === 'low') return null
  const glowRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if ((_fs_Entrance = (_fs_Entrance + 1) % 4) !== 0) return
    if (glowRef.current) {
      glowRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group position={[0, 0, 180]}>
      {/* Left pillar */}
      <mesh position={[-18, 12, 0]}>
        <boxGeometry args={[2, 24, 2]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[18, 12, 0]}>
        <boxGeometry args={[2, 24, 2]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, 24, 0]}>
        <boxGeometry args={[40, 2, 2]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
      {/* Cross brace — X pattern */}
      <mesh position={[-9, 12, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.3, 28, 0.3]} />
        <meshLambertMaterial color={COLORS.copper} />
      </mesh>
      <mesh position={[9, 12, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.3, 28, 0.3]} />
        <meshLambertMaterial color={COLORS.copper} />
      </mesh>

      {/* Signage backplate */}
      <mesh position={[0, 20, 0.5]}>
        <boxGeometry args={[28, 4, 0.3]} />
        <meshLambertMaterial color={0x1a1520} />
      </mesh>

      {/* WAVMVMT text */}
      <Html position={[0, 20, 1]} center distanceFactor={25}>
        <div style={{
          color: '#f0c674',
          fontSize: '28px',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          letterSpacing: '0.4em',
          textShadow: '0 0 20px rgba(240,198,116,0.4)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          WAVMVMT
        </div>
      </Html>

      {/* Subtitle */}
      <Html position={[0, 18.5, 1]} center distanceFactor={25}>
        <div style={{
          color: 'rgba(255,220,180,0.4)',
          fontSize: '8px',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          Under Construction · Toronto, ON
        </div>
      </Html>

      {/* Warm entrance light */}
      <pointLight
        ref={glowRef}
        position={[0, 15, 3]}
        color={COLORS.gold}
        intensity={0.8}
        distance={40}
        decay={2}
      />

      {/* Ground glow under arch */}
      <mesh position={[0, 0.05, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={0.03}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

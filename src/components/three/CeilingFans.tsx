'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Ceiling fans — spinning slowly near the top of the warehouse.
 * Adds life and industrial feel to the space.
 */
function Fan({ position, speed = 0.5 }: { position: [number, number, number]; speed?: number }) {
  const bladeRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.y = state.clock.elapsedTime * speed
    }
  })

  return (
    <group position={position}>
      {/* Mount rod */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 4]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
      </mesh>
      {/* Motor housing */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Blades */}
      <group ref={bladeRef}>
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 1.2, 0, Math.sin(i * Math.PI / 2) * 1.2]}
            rotation={[0, i * Math.PI / 2, 0]}>
            <boxGeometry args={[2, 0.04, 0.4]} />
            <meshStandardMaterial color={COLORS.woodLt} roughness={0.85} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function CeilingFans() {
  return (
    <group>
      <Fan position={[-60, 40, -30]} speed={0.4} />
      <Fan position={[60, 40, -30]} speed={0.5} />
      <Fan position={[0, 40, 50]} speed={0.45} />
      <Fan position={[-120, 40, 40]} speed={0.35} />
      <Fan position={[120, 40, -80]} speed={0.55} />
      <Fan position={[0, 40, -120]} speed={0.4} />
    </group>
  )
}

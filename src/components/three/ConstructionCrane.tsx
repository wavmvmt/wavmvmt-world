'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Animated tower crane that slowly rotates.
 * The most iconic construction site element — visible from anywhere
 * in the warehouse, immediately tells visitors "this is being built."
 */
let _fs_Construc = 0
export function ConstructionCrane({ position = [0, 0, 0] as [number, number, number] }) {
  const boomRef = useRef<THREE.Group>(null)
  const cableRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if ((_fs_Construc = (_fs_Construc + 1) % 3) !== 0) return
    const t = state.clock.elapsedTime
    // Slow rotation
    if (boomRef.current) {
      boomRef.current.rotation.y = t * 0.03
    }
    // Cable swings gently
    if (cableRef.current) {
      cableRef.current.position.x = Math.sin(t * 0.5) * 2
    }
  })

  const towerH = 60
  const boomLen = 50
  const craneColor = COLORS.amber

  return (
    <group position={position}>
      {/* Tower — vertical mast */}
      <mesh position={[0, towerH / 2, 0]}>
        <boxGeometry args={[2, towerH, 2]} />
        <meshStandardMaterial color={craneColor} roughness={0.7} />
      </mesh>

      {/* Tower cross-bracing (X pattern) */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} position={[0, 7 + i * 7, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 3, 0.1]} />
            <meshStandardMaterial color={craneColor} roughness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 3, 0.1]} />
            <meshStandardMaterial color={craneColor} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Rotating boom group */}
      <group ref={boomRef} position={[0, towerH, 0]}>
        {/* Main boom (jib) */}
        <mesh position={[boomLen / 2, 1, 0]}>
          <boxGeometry args={[boomLen, 1.5, 1.5]} />
          <meshStandardMaterial color={craneColor} roughness={0.7} />
        </mesh>

        {/* Counter-jib (shorter, back) */}
        <mesh position={[-12, 1, 0]}>
          <boxGeometry args={[20, 1.2, 1.2]} />
          <meshStandardMaterial color={craneColor} roughness={0.7} />
        </mesh>

        {/* Counterweight */}
        <mesh position={[-20, 0, 0]}>
          <boxGeometry args={[4, 3, 3]} />
          <meshStandardMaterial color={COLORS.concrete} roughness={0.9} />
        </mesh>

        {/* Operator cab */}
        <mesh position={[2, -1, 0]}>
          <boxGeometry args={[3, 2.5, 2.5]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Cab windows */}
        <mesh position={[2, -0.5, 1.3]}>
          <boxGeometry args={[2, 1.2, 0.05]} />
          <meshStandardMaterial color={COLORS.sky} transparent opacity={0.3} metalness={0.8} roughness={0.1} />
        </mesh>

        {/* Cable from boom tip */}
        <mesh ref={cableRef} position={[boomLen - 5, -12, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 24, 4]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.6} />
        </mesh>

        {/* Hook at cable end */}
        <mesh position={[boomLen - 5, -24, 0]}>
          <torusGeometry args={[0.5, 0.12, 6, 8, Math.PI]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Support cables from tower top to boom */}
        {[15, 30, 45].map((x, i) => {
          const len = Math.sqrt(x * x + 8 * 8)
          const angle = Math.atan2(8, x)
          return (
            <mesh key={i} position={[x / 2, 5, 0]} rotation={[0, 0, angle]}>
              <cylinderGeometry args={[0.03, 0.03, len, 4]} />
              <meshStandardMaterial color={COLORS.steel} metalness={0.5} />
            </mesh>
          )
        })}
      </group>

      {/* Base — concrete pad */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial color={COLORS.concrete} roughness={0.95} />
      </mesh>

      {/* Warning light on top */}
      <pointLight color={0xff3333} intensity={0.5} distance={15} position={[0, towerH + 3, 0]} />
    </group>
  )
}

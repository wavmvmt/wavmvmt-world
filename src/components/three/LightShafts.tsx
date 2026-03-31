'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { detectPerformanceLevel } from '@/lib/performanceMode'

function LightShaft({ position, width = 6, depth = 6, opacity = 0.02 }: {
  position: [number, number, number]; width?: number; depth?: number; opacity?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const frameSkip = useRef(0)
  useFrame((state) => {
    frameSkip.current = (frameSkip.current + 1) % 4
    if (frameSkip.current !== 0) return  // Update opacity 15fps max
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity + Math.sin(t * 0.5 + position[0]) * 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[width, 44, depth]} />
      <meshBasicMaterial
        color={0xffe8c0}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function SkylightOpening({ position, width = 6, depth = 6 }: {
  position: [number, number, number]; width?: number; depth?: number
}) {
  return (
    <group>
      <mesh position={[position[0], 43, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={0xfff8e8} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {[
        [position[0] - width / 2, 43, position[2]],
        [position[0] + width / 2, 43, position[2]],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.3, 0.3, depth]} />
          <meshStandardMaterial color={0x5a5060} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export function LightShafts() {
  const level = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'
  // Spread across the massive warehouse
  const allPositions: [number, number, number][] = [
    [-75, 20, -50],
    [25, 20, -85],
    [125, 20, 12],
    [-125, 20, 35],
    [0, 20, 50],
    [-50, 20, -100],
    [75, 20, 75],
    [-150, 20, -20],
    [150, 20, -40],
    [0, 20, -150],
    [-100, 20, 80],
    [100, 20, -120],
  ]
  // LOW: 4 shafts, MEDIUM: 8, HIGH: all 12
  const maxShafts = level === 'low' ? 3 : level === 'medium' ? 5 : 10
  const positions = allPositions.slice(0, maxShafts)

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i}>
          <LightShaft
            position={pos}
            width={5 + (i % 3) * 2}
            depth={5 + (i % 2) * 2}
            opacity={0.025 + (i % 3) * 0.008}
          />
          <SkylightOpening
            position={pos}
            width={5 + (i % 3) * 2}
            depth={5 + (i % 2) * 2}
          />
          {/* Only 3 spot lights instead of 12 — massive perf gain */}
          {i < 3 && (
            <spotLight
              position={[pos[0], 42, pos[2]]}
              target-position={[pos[0], 0, pos[2]]}
              intensity={0.5}
              color={0xfff0d0}
              angle={0.4}
              penumbra={0.9}
              distance={50}
              decay={2}
            />
          )}
        </group>
      ))}
    </group>
  )
}

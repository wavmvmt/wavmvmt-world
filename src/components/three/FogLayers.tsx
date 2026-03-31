'use client'
import { detectPerformanceLevel } from '@/lib/performanceMode'
const _fogLevel = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Layered volumetric fog planes at different heights.
 * Creates depth and atmosphere — thicker near the floor,
 * thinner higher up. Slowly drifts for a living feel.
 */
let _fs_FogLayer = 0
export function FogLayers() {
  if (_fogLevel === 'low') return null  // skip on low

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if ((_fs_FogLayer = (_fs_FogLayer + 1) % 6) !== 0) return
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      // Slow drift
      mesh.position.x = Math.sin(t * 0.015 + i * 2) * 15
      mesh.position.z = Math.cos(t * 0.012 + i * 1.5) * 10
    })
  })

  const layers = [
    { y: 0.5, opacity: 0.018, color: 0x1e1828, scale: 1 },
    { y: 3, opacity: 0.012, color: 0x2a2040, scale: 0.9 },
    { y: 8, opacity: 0.008, color: 0x1e1828, scale: 0.8 },
    { y: 15, opacity: 0.006, color: 0x2a2535, scale: 0.7 },
    { y: 25, opacity: 0.004, color: 0x1a1520, scale: 0.6 },
  ]

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, layer.y, -20]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[500 * layer.scale, 400 * layer.scale]} />
          <meshBasicMaterial
            color={layer.color}
            transparent
            opacity={layer.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

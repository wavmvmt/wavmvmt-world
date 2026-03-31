'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '@/lib/accessibility'

const CLOUD_COUNT = 12

/**
 * Subtle dust clouds near construction zones.
 * Large, very transparent spheres that drift slowly.
 * Creates the hazy atmosphere of an active construction site.
 */
let _fs_DustClou = 0
export function DustClouds() {
  if (prefersReducedMotion()) return null

  const groupRef = useRef<THREE.Group>(null)

  const clouds = useMemo(() => {
    return Array.from({ length: CLOUD_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 350,
      y: 2 + Math.random() * 10,
      z: (Math.random() - 0.5) * 300,
      scale: 8 + Math.random() * 15,
      speed: 0.008 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    if ((_fs_DustClou = (_fs_DustClou + 1) % 3) !== 0) return
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const cloud = clouds[i]
      if (!cloud) return
      const mesh = child as THREE.Mesh
      mesh.position.x = cloud.x + Math.sin(t * cloud.speed + cloud.phase) * 20
      mesh.position.z = cloud.z + Math.cos(t * cloud.speed * 0.7 + cloud.phase) * 15
      // Gentle scale pulse
      const pulse = 1 + Math.sin(t * 0.2 + cloud.phase) * 0.1
      mesh.scale.setScalar(cloud.scale * pulse)
    })
  })

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={[cloud.x, cloud.y, cloud.z]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={0x2a2535}
            transparent
            opacity={0.015}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

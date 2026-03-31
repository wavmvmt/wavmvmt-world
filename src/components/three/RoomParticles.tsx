'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'
import { prefersReducedMotion } from '@/lib/accessibility'

const PARTICLES_PER_ROOM = 8

/**
 * Floating ambient particles inside each room.
 * Small glowing motes that drift slowly upward in each room's signature color.
 * Makes rooms feel alive and inhabited even before they're built.
 */
export function RoomParticles() {
  if (prefersReducedMotion()) return null

  const pointsRef = useRef<THREE.Points>(null)

  const totalCount = ROOMS.length * PARTICLES_PER_ROOM

  const { positions, colors, roomIndices } = useMemo(() => {
    const pos = new Float32Array(totalCount * 3)
    const col = new Float32Array(totalCount * 3)
    const indices: number[] = []
    const tmpColor = new THREE.Color()

    ROOMS.forEach((room, ri) => {
      tmpColor.set(room.color)
      for (let p = 0; p < PARTICLES_PER_ROOM; p++) {
        const idx = ri * PARTICLES_PER_ROOM + p
        pos[idx * 3] = room.x + (Math.random() - 0.5) * room.w * 0.6
        pos[idx * 3 + 1] = 2 + Math.random() * (room.h * 0.6)
        pos[idx * 3 + 2] = room.z + (Math.random() - 0.5) * room.d * 0.6
        col[idx * 3] = tmpColor.r
        col[idx * 3 + 1] = tmpColor.g
        col[idx * 3 + 2] = tmpColor.b
        indices.push(ri)
      }
    })
    return { positions: pos, colors: col, roomIndices: indices }
  }, [])

  const frameSkip = useRef(0)
  useFrame((state) => {
    if (!pointsRef.current) return
    frameSkip.current = (frameSkip.current + 1) % 2
    if (frameSkip.current !== 0) return
    const t = state.clock.elapsedTime
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < totalCount; i++) {
      const ri = roomIndices[i]
      const room = ROOMS[ri]
      const phase = i * 1.7 + ri * 0.5

      // Slow upward drift with sine wobble
      arr[i * 3] += Math.sin(t * 0.3 + phase) * 0.01
      arr[i * 3 + 1] += 0.008 + Math.sin(t * 0.5 + phase) * 0.003
      arr[i * 3 + 2] += Math.cos(t * 0.25 + phase) * 0.01

      // Reset when too high
      if (arr[i * 3 + 1] > room.h * 0.8) {
        arr[i * 3] = room.x + (Math.random() - 0.5) * room.w * 0.6
        arr[i * 3 + 1] = 1
        arr[i * 3 + 2] = room.z + (Math.random() - 0.5) * room.d * 0.6
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={totalCount} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={totalCount} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.4}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

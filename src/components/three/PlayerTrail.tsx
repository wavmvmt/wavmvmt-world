'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'
import { prefersReducedMotion } from '@/lib/accessibility'

const TRAIL_LENGTH = 20

/**
 * Subtle glowing trail behind the player as they walk.
 * Small dots that fade out over time — like fairy dust.
 */
export function PlayerTrail() {
  if (prefersReducedMotion()) return null
  const pointsRef = useRef<THREE.Points>(null)
  const positions = useRef(new Float32Array(TRAIL_LENGTH * 3))
  const ages = useRef(new Float32Array(TRAIL_LENGTH).fill(1))
  const writeIdx = useRef(0)
  const lastPos = useRef({ x: 0, z: 0 })
  const lastDrop = useRef(0)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      lastPos.current = { x, z }
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [])

  const frameSkip = useRef(0)
  useFrame((state) => {
    frameSkip.current = (frameSkip.current + 1) % 2
    if (frameSkip.current !== 0) return
    if (!pointsRef.current) return
    const now = state.clock.elapsedTime
    const pos = positions.current

    // Drop a new trail point every 0.15s
    if (now - lastDrop.current > 0.15) {
      lastDrop.current = now
      const idx = writeIdx.current % TRAIL_LENGTH
      pos[idx * 3] = lastPos.current.x + (Math.random() - 0.5) * 0.5
      pos[idx * 3 + 1] = 0.3 + Math.random() * 0.3
      pos[idx * 3 + 2] = lastPos.current.z + (Math.random() - 0.5) * 0.5
      ages.current[idx] = 0
      writeIdx.current++
    }

    // Age all points
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      ages.current[i] += 0.02
      // Float up as they age
      if (ages.current[i] < 1) {
        pos[i * 3 + 1] += 0.01
      }
    }

    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    attr.needsUpdate = true

    const mat = pointsRef.current.material as THREE.PointsMaterial
    // Overall opacity based on youngest point
    const minAge = Math.min(...Array.from(ages.current))
    mat.opacity = Math.max(0.1, 0.4 - minAge * 0.3)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={TRAIL_LENGTH} />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.gold}
        size={0.15}
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

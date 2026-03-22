'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const PARTICLE_COUNT = 200
const CONFETTI_COLORS = [COLORS.gold, COLORS.rose, COLORS.lavender, COLORS.sage, COLORS.sky, COLORS.amber]

/**
 * Confetti explosion — triggers on milestone events.
 * Dispatch 'celebrate' event to trigger from anywhere.
 */
export function Confetti() {
  const pointsRef = useRef<THREE.Points>(null)
  const [active, setActive] = useState(false)
  const phaseRef = useRef(0)

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const vel: { x: number; y: number; z: number; rot: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = 0
      pos[i * 3 + 1] = 5
      pos[i * 3 + 2] = 0

      const color = new THREE.Color(CONFETTI_COLORS[i % CONFETTI_COLORS.length])
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b

      vel.push({
        x: (Math.random() - 0.5) * 0.6,
        y: Math.random() * 0.4 + 0.2,
        z: (Math.random() - 0.5) * 0.6,
        rot: Math.random() * 0.1,
      })
    }
    return { positions: pos, velocities: vel, colors: col }
  }, [])

  useEffect(() => {
    const handler = () => {
      setActive(true)
      phaseRef.current = 0
      // Reset positions to player location
      const pos = positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 5
        pos[i * 3 + 1] = 8 + Math.random() * 3
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5
        velocities[i].x = (Math.random() - 0.5) * 0.6
        velocities[i].y = Math.random() * 0.4 + 0.1
        velocities[i].z = (Math.random() - 0.5) * 0.6
      }
      setTimeout(() => setActive(false), 5000)
    }
    window.addEventListener('celebrate', handler)
    return () => window.removeEventListener('celebrate', handler)
  }, [positions, velocities])

  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return
    phaseRef.current += delta

    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = velocities[i]
      arr[i * 3] += v.x * 0.5
      arr[i * 3 + 1] += v.y * 0.3
      arr[i * 3 + 2] += v.z * 0.5
      v.y -= 0.008 // gravity
      // Flutter
      v.x += Math.sin(phaseRef.current * 5 + i) * 0.002
    }
    pos.needsUpdate = true

    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = Math.max(0, 1 - phaseRef.current / 5)
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={PARTICLE_COUNT} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={PARTICLE_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        transparent
        opacity={1}
        vertexColors
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

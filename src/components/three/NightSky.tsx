'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 200

/**
 * Stars visible through skylights at night.
 * Only visible when the day/night cycle is in the night phase.
 * Stars twinkle gently.
 */
export function NightSky() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, twinklePhases } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3)
    const phases: number[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      // Place stars high above the warehouse, spread wide
      pos[i * 3] = (Math.random() - 0.5) * 600
      pos[i * 3 + 1] = 80 + Math.random() * 100 // Far above ceiling
      pos[i * 3 + 2] = (Math.random() - 0.5) * 500
      phases.push(Math.random() * Math.PI * 2)
    }
    return { positions: pos, twinklePhases: phases }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime

    // Day/night cycle: 5-minute rotation, night is 50-75% (150-225s)
    const cycle = (t % 300) / 300
    const isNight = cycle > 0.4 && cycle < 0.85
    const nightIntensity = isNight
      ? Math.min(1, Math.min(cycle - 0.4, 0.85 - cycle) * 10)
      : 0

    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = nightIntensity * 0.8

    // Twinkle
    if (nightIntensity > 0) {
      mat.size = 0.8 + Math.sin(t * 0.5) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={STAR_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={0xffffff}
        size={0.8}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

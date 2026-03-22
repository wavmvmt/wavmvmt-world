'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DROP_COUNT = 300
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

/**
 * Rain visible through skylights — only during certain parts of the day/night cycle.
 * Drops fall from above the ceiling through skylight openings.
 */
export function RainEffect() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = IS_MOBILE ? 100 : DROP_COUNT

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd: number[] = []
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400
      pos[i * 3 + 1] = 50 + Math.random() * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300
      spd.push(0.5 + Math.random() * 0.8)
    }
    return { positions: pos, speeds: spd }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime

    // Rain during dusk/dawn transitions (25-40% and 75-90% of cycle)
    const cycle = (t % 300) / 300
    const isRaining = (cycle > 0.22 && cycle < 0.38) || (cycle > 0.72 && cycle < 0.88)
    const rainIntensity = isRaining ? Math.min(1, Math.min(
      cycle > 0.5 ? (cycle - 0.72) * 10 : (cycle - 0.22) * 10,
      cycle > 0.5 ? (0.88 - cycle) * 10 : (0.38 - cycle) * 10
    )) : 0

    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = rainIntensity * 0.4

    if (rainIntensity <= 0) return

    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= speeds[i]
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3] = (Math.random() - 0.5) * 400
        arr[i * 3 + 1] = 50 + Math.random() * 20
        arr[i * 3 + 2] = (Math.random() - 0.5) * 300
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={0x8888cc}
        size={0.15}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

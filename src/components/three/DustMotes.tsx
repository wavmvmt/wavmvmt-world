'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const DUST_COUNT = 200

export function DustMotes() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3)
    const spd = []
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = Math.random() * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35
      spd.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.005 + 0.002,
        z: (Math.random() - 0.5) * 0.003,
        drift: Math.random() * Math.PI * 2,
      })
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < DUST_COUNT; i++) {
      const s = speeds[i]
      arr[i * 3] += s.x + Math.sin(s.drift) * 0.001
      arr[i * 3 + 1] += s.y
      arr[i * 3 + 2] += s.z + Math.cos(s.drift) * 0.001
      s.drift += delta * 0.5

      // Reset when too high
      if (arr[i * 3 + 1] > 13) {
        arr[i * 3 + 1] = 0
        arr[i * 3] = (Math.random() - 0.5) * 50
        arr[i * 3 + 2] = (Math.random() - 0.5) * 35
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={DUST_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.cream}
        size={0.08}
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

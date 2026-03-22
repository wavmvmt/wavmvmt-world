'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const SPARK_COUNT = 25

function SparkEmitter({ origin }: { origin: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(SPARK_COUNT * 3)
    const vel = []
    for (let i = 0; i < SPARK_COUNT; i++) {
      pos[i * 3] = origin[0]
      pos[i * 3 + 1] = origin[1]
      pos[i * 3 + 2] = origin[2]
      vel.push({
        x: (Math.random() - 0.5) * 0.12,
        y: Math.random() * 0.1 + 0.02,
        z: (Math.random() - 0.5) * 0.12,
        life: Math.random(),
      })
    }
    return { positions: pos, velocities: vel }
  }, [origin])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < SPARK_COUNT; i++) {
      const v = velocities[i]
      arr[i * 3] += v.x
      arr[i * 3 + 1] += v.y
      arr[i * 3 + 2] += v.z
      v.y -= 0.003 // gravity
      v.life -= 0.02

      if (v.life <= 0) {
        arr[i * 3] = origin[0]
        arr[i * 3 + 1] = origin[1]
        arr[i * 3 + 2] = origin[2]
        v.x = (Math.random() - 0.5) * 0.12
        v.y = Math.random() * 0.1 + 0.02
        v.z = (Math.random() - 0.5) * 0.12
        v.life = Math.random()
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
          count={SPARK_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.amber}
        size={0.06}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function Sparks() {
  return (
    <group>
      <SparkEmitter origin={[-10, 2, -7]} />
      <SparkEmitter origin={[12, 1.5, -10]} />
      <SparkEmitter origin={[22, 1.5, -5]} />
    </group>
  )
}

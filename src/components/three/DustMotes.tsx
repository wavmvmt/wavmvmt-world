'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const DUST_COUNT = 350
const EMBER_COUNT = 40

/** Floating dust motes — Ghibli signature atmospheric particles */
export function DustMotes() {
  const dustRef = useRef<THREE.Points>(null)
  const emberRef = useRef<THREE.Points>(null)

  const dust = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3)
    const sizes = new Float32Array(DUST_COUNT)
    const spd = []
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160
      pos[i * 3 + 1] = Math.random() * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 110
      sizes[i] = 0.04 + Math.random() * 0.08
      spd.push({
        x: (Math.random() - 0.5) * 0.004,
        y: Math.random() * 0.006 + 0.001,
        z: (Math.random() - 0.5) * 0.004,
        drift: Math.random() * Math.PI * 2,
        twinkle: Math.random() * Math.PI * 2,
      })
    }
    return { positions: pos, sizes, speeds: spd }
  }, [])

  const embers = useMemo(() => {
    const pos = new Float32Array(EMBER_COUNT * 3)
    const spd = []
    for (let i = 0; i < EMBER_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = Math.random() * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60
      spd.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.015 + 0.005,
        z: (Math.random() - 0.5) * 0.01,
        life: Math.random(),
      })
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame((state, delta) => {
    // Dust motes — gentle floating upward with drift
    if (dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array

      for (let i = 0; i < DUST_COUNT; i++) {
        const s = dust.speeds[i]
        const drift = Math.sin(s.drift + state.clock.elapsedTime * 0.3) * 0.002
        arr[i * 3] += s.x + drift
        arr[i * 3 + 1] += s.y
        arr[i * 3 + 2] += s.z + Math.cos(s.drift) * 0.001
        s.drift += delta * 0.3

        if (arr[i * 3 + 1] > 17) {
          arr[i * 3 + 1] = 0
          arr[i * 3] = (Math.random() - 0.5) * 160
          arr[i * 3 + 2] = (Math.random() - 0.5) * 110
        }
      }
      pos.needsUpdate = true
    }

    // Embers — faster rising, orange glow, die and respawn
    if (emberRef.current) {
      const pos = emberRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array

      for (let i = 0; i < EMBER_COUNT; i++) {
        const s = embers.speeds[i]
        arr[i * 3] += s.x
        arr[i * 3 + 1] += s.y
        arr[i * 3 + 2] += s.z
        s.life -= delta * 0.15

        if (s.life <= 0 || arr[i * 3 + 1] > 16) {
          arr[i * 3] = (Math.random() - 0.5) * 80
          arr[i * 3 + 1] = 0.5 + Math.random() * 2
          arr[i * 3 + 2] = (Math.random() - 0.5) * 60
          s.x = (Math.random() - 0.5) * 0.01
          s.y = Math.random() * 0.015 + 0.005
          s.z = (Math.random() - 0.5) * 0.01
          s.life = 0.5 + Math.random() * 0.5
        }
      }
      pos.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Main dust motes — cream/warm white */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.positions, 3]} count={DUST_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          color={COLORS.cream}
          size={0.1}
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Floating embers — warm orange, larger, brighter */}
      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[embers.positions, 3]} count={EMBER_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          color={COLORS.amber}
          size={0.12}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

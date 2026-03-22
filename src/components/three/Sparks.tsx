'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const SPARK_COUNT = 30

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
        x: (Math.random() - 0.5) * 0.2,
        y: Math.random() * 0.15 + 0.03,
        z: (Math.random() - 0.5) * 0.2,
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
      v.y -= 0.004
      v.life -= 0.02

      if (v.life <= 0) {
        arr[i * 3] = origin[0] + (Math.random() - 0.5) * 0.5
        arr[i * 3 + 1] = origin[1]
        arr[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * 0.5
        v.x = (Math.random() - 0.5) * 0.2
        v.y = Math.random() * 0.15 + 0.03
        v.z = (Math.random() - 0.5) * 0.2
        v.life = Math.random()
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={SPARK_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.amber}
        size={0.1}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Flickering welding light */
function WeldFlash({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (!lightRef.current) return
    const t = state.clock.elapsedTime
    // Rapid flickering — simulates welding arc
    const flicker = Math.sin(t * 30) * Math.sin(t * 17) * Math.sin(t * 7)
    lightRef.current.intensity = Math.max(0, flicker) * 1.5
  })

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color={0x88ccff}
      intensity={0}
      distance={15}
      decay={2}
    />
  )
}

export function Sparks() {
  return (
    <group>
      {/* Near Parkour Gym */}
      <SparkEmitter origin={[-60, 4, -60]} />
      <SparkEmitter origin={[-120, 4, -80]} />
      {/* Near Sound Bath */}
      <SparkEmitter origin={[90, 3, -70]} />
      {/* Near Music Studio */}
      <SparkEmitter origin={[130, 3, 40]} />
      {/* Near Front Desk */}
      <SparkEmitter origin={[15, 3, 120]} />
      <SparkEmitter origin={[-15, 3, 125]} />
      {/* Near Weight Training */}
      <SparkEmitter origin={[170, 3, -25]} />
      {/* Near Amphitheatre */}
      <SparkEmitter origin={[20, 3, -90]} />
      {/* Near Recovery Suite */}
      <SparkEmitter origin={[-80, 3, -175]} />

      {/* Welding flashes — blue-white flickers */}
      <WeldFlash position={[-60, 3, -60]} />
      <WeldFlash position={[170, 3, -25]} />
    </group>
  )
}

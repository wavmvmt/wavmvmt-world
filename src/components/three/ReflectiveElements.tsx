'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * REFLECTIVE ELEMENTS — water, glass, and light
 *
 * 1. Decorative water pools in key areas
 * 2. Animated blueprint projections on warehouse walls
 * 3. Ambient light pulses that sweep across the floor
 */

/** Decorative reflecting pools — adds elegance and calm */
function ReflectingPools() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Subtle water shimmer via material opacity
    ref.current.children.forEach((child, i) => {
      const mesh = child.children?.[0] as THREE.Mesh
      if (mesh?.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.opacity = 0.12 + Math.sin(t * 0.8 + i * 1.5) * 0.03
      }
    })
  })

  const pools = [
    { x: 0, z: 45, w: 16, d: 4, label: 'Entrance Pool' },
    { x: -50, z: 0, w: 6, d: 6, label: 'Zen Pool' },
    { x: 50, z: -20, w: 5, d: 8, label: 'Reflection Pool' },
  ]

  return (
    <group ref={ref}>
      {pools.map((pool, i) => (
        <group key={i} position={[pool.x, 0, pool.z]}>
          {/* Water surface */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[pool.w, pool.d]} />
            <meshStandardMaterial
              color={COLORS.sky}
              transparent
              opacity={0.12}
              metalness={0.95}
              roughness={0.05}
              side={THREE.DoubleSide}
              envMapIntensity={2}
            />
          </mesh>
          {/* Pool edge — stone border */}
          <lineSegments position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(pool.w + 0.5, pool.d + 0.5)]} />
            <lineBasicMaterial color={COLORS.copper} transparent opacity={0.1} />
          </lineSegments>
          {/* Underwater glow */}
          <pointLight
            color={COLORS.sky}
            intensity={0.08}
            distance={8}
            position={[0, -0.5, 0]}
          />
        </group>
      ))}
    </group>
  )
}

/** Animated light sweep — a beam that periodically sweeps across the floor */
function LightSweep() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Sweep from left to right every 20 seconds
    const cycle = (t % 20) / 20
    ref.current.position.x = -120 + cycle * 240
    ref.current.position.z = Math.sin(t * 0.1) * 30
    // Fade in and out
    const mat = ref.current.material as THREE.MeshBasicMaterial
    const fadeIn = Math.min(1, cycle * 5)
    const fadeOut = Math.min(1, (1 - cycle) * 5)
    mat.opacity = 0.015 * fadeIn * fadeOut
  })

  return (
    <mesh ref={ref} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3, 200]} />
      <meshBasicMaterial
        color={COLORS.gold}
        transparent
        opacity={0.015}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Blueprint projections — animated technical drawings on walls */
function BlueprintProjections() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Scan line effect — move a bright line down each projection
    ref.current.children.forEach((child, i) => {
      const scanLine = child.children?.[1] as THREE.Mesh
      if (scanLine) {
        const y = ((t * 0.3 + i * 0.5) % 1) * 8 - 4
        scanLine.position.y = y
      }
    })
  })

  const walls = [
    { x: -100, z: 0, ry: Math.PI / 2, label: 'West Wall' },
    { x: 100, z: 0, ry: -Math.PI / 2, label: 'East Wall' },
    { x: 0, z: -70, ry: 0, label: 'North Wall' },
  ]

  return (
    <group ref={ref}>
      {walls.map((wall, i) => (
        <group key={i} position={[wall.x, 6, wall.z]} rotation={[0, wall.ry, 0]}>
          {/* Blueprint grid */}
          <mesh>
            <planeGeometry args={[20, 10]} />
            <meshBasicMaterial
              color={COLORS.sky}
              transparent
              opacity={0.015}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Scan line */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[20, 0.08]} />
            <meshBasicMaterial
              color={COLORS.sage}
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Grid lines on blueprint */}
          {Array.from({ length: 8 }, (_, j) => (
            <mesh key={`h-${j}`} position={[0, -4 + j * 1.25, 0.005]}>
              <planeGeometry args={[20, 0.02]} />
              <meshBasicMaterial color={COLORS.sky} transparent opacity={0.02} />
            </mesh>
          ))}
          {Array.from({ length: 10 }, (_, j) => (
            <mesh key={`v-${j}`} position={[-9 + j * 2, 0, 0.005]}>
              <planeGeometry args={[0.02, 10]} />
              <meshBasicMaterial color={COLORS.sky} transparent opacity={0.02} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Entrance portal shimmer — glowing threshold at main entrance */
function EntrancePortal() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.03 + Math.sin(t * 1.5) * 0.015
  })

  return (
    <group position={[0, 4, 70]}>
      {/* Portal frame glow */}
      <mesh ref={ref}>
        <planeGeometry args={[10, 8]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Edge lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(10, 8)]} />
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.06} />
      </lineSegments>
      {/* Inner particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 8
        const y = (Math.random() - 0.5) * 6
        return (
          <mesh key={i} position={[x, y, Math.random() * 0.5]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function ReflectiveElements() {
  return (
    <group>
      <ReflectingPools />
      <LightSweep />
      <BlueprintProjections />
      <EntrancePortal />
    </group>
  )
}

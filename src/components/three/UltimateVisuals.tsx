'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS } from '@/lib/roomConfig'

/**
 * ULTIMATE VISUALS — the "million people watching" batch
 *
 * 1. Giant holographic WAVMVMT logo rotating above the warehouse
 * 2. Player light trail — golden particles following your path
 * 3. Laser grid ceiling — sci-fi construction grid overhead
 * 4. Pulse rings — expanding rings from the energy core
 * 5. Construction hologram projectors around the site
 */

/** Massive holographic WAVMVMT logo floating above everything */
let _fs_Ultimate = 0
function HoloLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if ((_fs_Ultimate = (_fs_Ultimate + 1) % 4) !== 0) return
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.03
    groupRef.current.position.y = 80 + Math.sin(t * 0.2) * 2
  })

  return (
    <group ref={groupRef} position={[0, 80, -20]}>
      {/* Logo text via HTML — always faces camera */}
      <Html center distanceFactor={120} occlude={false}>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 900,
            color: 'rgba(240,198,116,0.12)',
            letterSpacing: '0.3em',
            textShadow: '0 0 40px rgba(240,198,116,0.06), 0 0 80px rgba(240,198,116,0.03)',
            fontFamily: "'Playfair Display', serif",
          }}>
            WAVMVMT
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(128,212,168,0.08)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginTop: '4px',
          }}>
            A New Renaissance
          </div>
        </div>
      </Html>

      {/* Decorative rings around logo */}
      {[20, 28, 36].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.05, 4, 64]} />
          <meshBasicMaterial
            color={[COLORS.gold, COLORS.sage, COLORS.lavender][i]}
            transparent
            opacity={0.03}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Player trail — golden particles that follow your path */
function PlayerTrailParticles() {
  const COUNT = 60
  const ref = useRef<THREE.Points>(null)
  const trailRef = useRef<{ x: number; y: number; z: number; age: number }[]>([])
  const playerPos = useRef({ x: 0, z: 0 })

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  const positions = useMemo(() => new Float32Array(COUNT * 3), [])

  useFrame((_, delta) => {
    if (!ref.current) return

    // Add new trail point
    trailRef.current.push({
      x: playerPos.current.x + (Math.random() - 0.5) * 1.5,
      y: 0.2 + Math.random() * 0.8,
      z: playerPos.current.z + (Math.random() - 0.5) * 1.5,
      age: 0,
    })

    // Keep only last COUNT points
    while (trailRef.current.length > COUNT) trailRef.current.shift()

    // Update positions and age
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    trailRef.current.forEach((p, i) => {
      p.age += delta
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y + p.age * 0.5 // float upward
      arr[i * 3 + 2] = p.z
    })

    // Zero out unused slots
    for (let i = trailRef.current.length; i < COUNT; i++) {
      arr[i * 3] = 0
      arr[i * 3 + 1] = -100
      arr[i * 3 + 2] = 0
    }

    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.gold}
        size={0.12}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Pulse rings — expanding circles from the energy core */
function PulseRings() {
  const COUNT = 5
  const ringsRef = useRef<THREE.Mesh[]>([])
  const scalesRef = useRef(Array.from({ length: COUNT }, (_, i) => i * 20))

  useFrame((_, delta) => {
    scalesRef.current.forEach((scale, i) => {
      scalesRef.current[i] += delta * 15
      if (scalesRef.current[i] > 100) scalesRef.current[i] = 0

      const ring = ringsRef.current[i]
      if (ring) {
        const s = scalesRef.current[i]
        ring.scale.set(s, s, s)
        // Fade out as it expands
        const mat = ring.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.04 * (1 - s / 100))
      }
    })
  })

  return (
    <group position={[0, 0.1, 30]}>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringsRef.current[i] = el }}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Laser grid on the ceiling — sci-fi construction aesthetic */
function LaserCeiling() {
  return (
    <group position={[0, 28, -20]}>
      {/* X-axis lines */}
      {Array.from({ length: 15 }, (_, i) => {
        const z = -70 + i * 10
        return (
          <mesh key={`x-${i}`} position={[0, 0, z]}>
            <boxGeometry args={[180, 0.02, 0.02]} />
            <meshBasicMaterial
              color={COLORS.sage}
              transparent
              opacity={0.025}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
      {/* Z-axis lines */}
      {Array.from({ length: 19 }, (_, i) => {
        const x = -90 + i * 10
        return (
          <mesh key={`z-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.02, 0.02, 140]} />
            <meshBasicMaterial
              color={COLORS.sage}
              transparent
              opacity={0.025}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
      {/* Intersection dots */}
      {Array.from({ length: 15 * 19 }, (_, idx) => {
        const row = Math.floor(idx / 19)
        const col = idx % 19
        if (Math.random() > 0.3) return null // only 30% of intersections
        return (
          <mesh key={idx} position={[-90 + col * 10, 0, -70 + row * 10]}>
            <sphereGeometry args={[0.08, 4, 4]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function UltimateVisuals() {
  return (
    <group>
      <HoloLogo />
      <PlayerTrailParticles />
      <PulseRings />
      <LaserCeiling />
    </group>
  )
}

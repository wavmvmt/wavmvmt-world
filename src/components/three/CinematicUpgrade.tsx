'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/**
 * CINEMATIC UPGRADE — transforms the warehouse from "cool" to "WHOA"
 *
 * 1. Glowing floor paths between rooms (circuit-board aesthetic)
 * 2. Volumetric light columns at each room
 * 3. Animated energy pulses along pathways
 * 4. Floating holographic room labels
 * 5. Central energy core (lobby fountain of light)
 */

/** Glowing pathway lines connecting rooms — like a circuit board of light */
function GlowPaths() {
  const ref = useRef<THREE.Group>(null)

  // Generate paths between nearby rooms
  const paths = useMemo(() => {
    const result: { from: [number, number, number]; to: [number, number, number]; color: number }[] = []
    for (let i = 0; i < ROOMS.length; i++) {
      for (let j = i + 1; j < ROOMS.length; j++) {
        const dx = ROOMS[i].x - ROOMS[j].x
        const dz = ROOMS[i].z - ROOMS[j].z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < 100) { // only connect nearby rooms
          result.push({
            from: [ROOMS[i].x, 0.1, ROOMS[i].z],
            to: [ROOMS[j].x, 0.1, ROOMS[j].z],
            color: ROOMS[i].color,
          })
        }
      }
    }
    return result
  }, [])

  return (
    <group ref={ref}>
      {paths.map((path, i) => {
        const dir = new THREE.Vector3(
          path.to[0] - path.from[0],
          0,
          path.to[2] - path.from[2]
        )
        const len = dir.length()
        const mid: [number, number, number] = [
          (path.from[0] + path.to[0]) / 2,
          0.08,
          (path.from[2] + path.to[2]) / 2,
        ]
        const angle = Math.atan2(dir.x, dir.z)

        return (
          <group key={i}>
            {/* Main path line */}
            <mesh position={mid} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.15, 0.02, len]} />
              <meshBasicMaterial
                color={path.color}
                transparent
                opacity={0.08}
              />
            </mesh>
            {/* Glow line (wider, dimmer) */}
            <mesh position={[mid[0], 0.06, mid[2]]} rotation={[0, angle, 0]}>
              <boxGeometry args={[1.5, 0.01, len]} />
              <meshBasicMaterial
                color={path.color}
                transparent
                opacity={0.02}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Light columns rising from each room — volumetric beams */
function RoomLightColumns() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      // Gentle breathing pulse
      const scale = 1 + Math.sin(t * 0.5 + i * 0.7) * 0.1
      child.scale.set(scale, 1, scale)
    })
  })

  return (
    <group ref={ref}>
      {ROOMS.map((room) => {
        if (room.buildPct < 5) return null
        const intensity = room.buildPct / 100
        return (
          <group key={room.name} position={[room.x, 0, room.z]}>
            {/* Light column */}
            <mesh position={[0, 15, 0]}>
              <cylinderGeometry args={[2, 6, 30, 8, 1, true]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.015 * intensity}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* Base glow ring */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[Math.min(room.w, room.d) / 2 - 2, Math.min(room.w, room.d) / 2, 32]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.04 * intensity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Central energy core — a pulsing orb of light in the lobby area */
function EnergyCoreComponent() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.15
      coreRef.current.scale.set(pulse, pulse, pulse)
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.2
      ringsRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
    }
  })

  return (
    <group position={[0, 6, 30]}>
      {/* Core orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={COLORS.gold} transparent opacity={0.15} />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={0.015}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rotating rings */}
      <group ref={ringsRef}>
        {[3, 4.5, 6].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
            <torusGeometry args={[r, 0.03, 8, 32]} />
            <meshBasicMaterial
              color={[COLORS.gold, COLORS.sage, COLORS.sky][i]}
              transparent
              opacity={0.06}
            />
          </mesh>
        ))}
      </group>

      {/* Point light from core */}
      <pointLight color={COLORS.gold} intensity={0.4} distance={25} decay={2} />
    </group>
  )
}

/** Animated particles flowing along pathways */
function EnergyParticles() {
  const ref = useRef<THREE.Points>(null)
  const COUNT = 200

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const spd: { x: number; z: number; speed: number; phase: number }[] = []
    for (let i = 0; i < COUNT; i++) {
      // Start at random room positions
      const room = ROOMS[Math.floor(Math.random() * ROOMS.length)]
      pos[i * 3] = room.x + (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = 0.3 + Math.random() * 0.5
      pos[i * 3 + 2] = room.z + (Math.random() - 0.5) * 20
      // Move toward another room
      const target = ROOMS[Math.floor(Math.random() * ROOMS.length)]
      const dx = target.x - room.x
      const dz = target.z - room.z
      const dist = Math.sqrt(dx * dx + dz * dz) || 1
      spd.push({
        x: (dx / dist) * (0.3 + Math.random() * 0.5),
        z: (dz / dist) * (0.3 + Math.random() * 0.5),
        speed: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const s = speeds[i]
      arr[i * 3] += s.x * s.speed * delta
      arr[i * 3 + 2] += s.z * s.speed * delta
      arr[i * 3 + 1] = 0.3 + Math.sin(s.phase + state.clock.elapsedTime * 2) * 0.2

      // Respawn when too far from center
      if (Math.abs(arr[i * 3]) > 120 || Math.abs(arr[i * 3 + 2]) > 80) {
        const room = ROOMS[Math.floor(Math.random() * ROOMS.length)]
        arr[i * 3] = room.x
        arr[i * 3 + 2] = room.z
        const target = ROOMS[Math.floor(Math.random() * ROOMS.length)]
        const dx = target.x - room.x
        const dz = target.z - room.z
        const dist = Math.sqrt(dx * dx + dz * dz) || 1
        s.x = (dx / dist) * (0.3 + Math.random() * 0.5)
        s.z = (dz / dist) * (0.3 + Math.random() * 0.5)
      }
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
        size={0.15}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Ground grid — subtle tech/blueprint aesthetic */
function GroundGrid() {
  return (
    <group>
      {/* Main grid */}
      <gridHelper
        args={[400, 80, COLORS.gold, COLORS.gold]}
        position={[0, 0.01, 0]}
        material-transparent
        material-opacity={0.015}
      />
      {/* Fine grid */}
      <gridHelper
        args={[400, 200, COLORS.sage, COLORS.sage]}
        position={[0, 0.02, 0]}
        material-transparent
        material-opacity={0.008}
      />
    </group>
  )
}

/**
 * All cinematic upgrades bundled together.
 * Drop this single component into SceneContent for the full effect.
 */
export function CinematicUpgrade() {
  return (
    <group>
      <GlowPaths />
      <RoomLightColumns />
      <EnergyCoreComponent />
      <EnergyParticles />
      <GroundGrid />
    </group>
  )
}

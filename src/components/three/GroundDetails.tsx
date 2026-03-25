'use client'

import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Ground-level construction site details — tire tracks, puddles,
 * aggregate piles, and floor stains. Adds gritty realism to
 * the polished concrete warehouse floor.
 */

function TireTrack({ start, end }: {
  start: [number, number]
  end: [number, number]
}) {
  const dx = end[0] - start[0]
  const dz = end[1] - start[1]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)
  const mid: [number, number, number] = [(start[0] + end[0]) / 2, 0.025, (start[1] + end[1]) / 2]

  return (
    <group position={mid} rotation={[0, angle, 0]}>
      {/* Double track lines */}
      {[-0.4, 0.4].map((offset, i) => (
        <mesh key={i} position={[offset, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, length]} />
          <meshBasicMaterial color={0x151015} transparent opacity={0.06} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Puddle({ position, size }: {
  position: [number, number, number]
  size: number
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[size, 12]} />
      <meshStandardMaterial
        color={COLORS.sky}
        transparent
        opacity={0.04}
        metalness={0.8}
        roughness={0.1}
        depthWrite={false}
      />
    </mesh>
  )
}

function AggregatePile({ position, scale = 1 }: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.8, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={0x4a3a2a} roughness={0.95} />
      </mesh>
      <mesh position={[0.5, 0.2, 0.3]}>
        <sphereGeometry args={[0.5, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={0x5a4a38} roughness={0.95} />
      </mesh>
    </group>
  )
}

function FloorStain({ position, size, color = 0x1a1015 }: {
  position: [number, number, number]
  size: number
  color?: number
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
      <circleGeometry args={[size, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.03} depthWrite={false} />
    </mesh>
  )
}

export function GroundDetails() {
  return (
    <group>
      {/* Tire tracks — forklift routes */}
      <TireTrack start={[-80, -180]} end={[-80, 100]} />
      <TireTrack start={[80, -180]} end={[80, 100]} />
      <TireTrack start={[-180, 0]} end={[180, 0]} />
      <TireTrack start={[-40, -100]} end={[40, -100]} />

      {/* Small puddles near rooms */}
      <Puddle position={[-50, 0.022, -40]} size={2} />
      <Puddle position={[70, 0.022, -60]} size={1.5} />
      <Puddle position={[-120, 0.022, 20]} size={2.5} />
      <Puddle position={[30, 0.022, 80]} size={1.8} />
      <Puddle position={[-90, 0.022, -150]} size={2} />

      {/* Aggregate / gravel piles */}
      <AggregatePile position={[-30, 0, -55]} scale={1.5} />
      <AggregatePile position={[45, 0, -75]} scale={1.2} />
      <AggregatePile position={[-140, 0, 30]} scale={1.8} />
      <AggregatePile position={[140, 0, -15]} scale={1} />

      {/* Floor stains — oil, concrete, paint */}
      <FloorStain position={[-20, 0.021, -20]} size={3} />
      <FloorStain position={[50, 0.021, 30]} size={2.5} />
      <FloorStain position={[-100, 0.021, -80]} size={4} />
      <FloorStain position={[100, 0.021, -100]} size={3} color={0x201518} />
      <FloorStain position={[0, 0.021, 50]} size={2} color={0x181520} />
      <FloorStain position={[-60, 0.021, 60]} size={3.5} />
    </group>
  )
}

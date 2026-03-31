'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Ceiling detail — exposed ductwork, hanging cables, and skylight panels.
 * Adds industrial texture to the warehouse ceiling.
 */

function Duct({ start, end, radius = 0.4 }: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
}) {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ]

  // Compute rotation to align cylinder between start and end
  const dir = new THREE.Vector3(dx, dy, dz).normalize()
  const up = new THREE.Vector3(0, 1, 0)
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir)
  const euler = new THREE.Euler().setFromQuaternion(quat)

  return (
    <mesh position={mid} rotation={euler}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshLambertMaterial color={COLORS.steel} />
    </mesh>
  )
}

function HangingCable({ x, z, length = 8 }: { x: number; z: number; length?: number }) {
  return (
    <group position={[x, 43, z]}>
      <mesh position={[0, -length / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, length, 4]} />
        <meshBasicMaterial color={COLORS.steel} transparent opacity={0.3} />
      </mesh>
      {/* Junction box at bottom */}
      <mesh position={[0, -length, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshLambertMaterial color={0x2a2030} />
      </mesh>
    </group>
  )
}

export function CeilingDetail() {
  return (
    <group>
      {/* Main HVAC ducts running along the warehouse */}
      <Duct start={[-220, 40, -80]} end={[220, 40, -80]} radius={0.6} />
      <Duct start={[-220, 40, 40]} end={[220, 40, 40]} radius={0.6} />
      <Duct start={[-220, 39, 0]} end={[220, 39, 0]} radius={0.5} />

      {/* Cross ducts */}
      <Duct start={[-120, 40, -80]} end={[-120, 40, 40]} radius={0.35} />
      <Duct start={[0, 40, -80]} end={[0, 40, 40]} radius={0.35} />
      <Duct start={[120, 40, -80]} end={[120, 40, 40]} radius={0.35} />

      {/* Hanging cables with junction boxes */}
      {[
        [-160, -60], [-80, -60], [0, -60], [80, -60], [160, -60],
        [-160, 0], [-80, 0], [80, 0], [160, 0],
        [-120, 40], [0, 40], [120, 40],
      ].map(([x, z], i) => (
        <HangingCable key={i} x={x} z={z} length={5 + (i % 3) * 2} />
      ))}

      {/* Ceiling panels between beams — subtle industrial texture */}
      {Array.from({ length: 10 }, (_, i) => {
        const z = -140 + i * 32
        return (
          <mesh key={i} position={[0, 42.8, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[480, 30]} />
            <meshStandardMaterial
              color={0x1a1520}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </group>
  )
}

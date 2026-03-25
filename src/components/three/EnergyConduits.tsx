'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * ENERGY CONDUITS — glowing tubes running along walls and ceiling
 * like the building's nervous system. Pulses of light travel
 * through them, connecting rooms to the energy core.
 *
 * Think Tron meets construction site.
 */

interface Conduit {
  points: [number, number, number][]
  color: number
}

const CONDUITS: Conduit[] = [
  // Main spine — runs the length of the warehouse
  { points: [[0, 12, 65], [0, 12, 30], [0, 12, 0], [0, 12, -30], [0, 12, -65]], color: COLORS.gold },
  // West branch
  { points: [[0, 12, 0], [-30, 12, 0], [-60, 12, 0], [-90, 12, 0]], color: COLORS.sage },
  // East branch
  { points: [[0, 12, 0], [30, 12, 0], [60, 12, 0], [90, 12, 0]], color: COLORS.sky },
  // Diagonal — NW
  { points: [[0, 12, 0], [-40, 12, -30], [-70, 12, -50]], color: COLORS.lavender },
  // Diagonal — NE
  { points: [[0, 12, 0], [40, 12, -30], [70, 12, -50]], color: COLORS.rose },
  // Vertical drops from spine to floor
  { points: [[0, 12, 30], [0, 0.5, 30]], color: COLORS.gold },
  { points: [[-60, 12, 0], [-60, 0.5, 0]], color: COLORS.sage },
  { points: [[60, 12, 0], [60, 0.5, 0]], color: COLORS.sky },
]

function ConduitTube({ points, color }: Conduit) {
  const pulseRef = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    pulseRef.current.forEach((mesh, i) => {
      if (!mesh) return
      // Move pulse along the conduit
      const progress = ((t * 0.4 + i * 0.3) % 1)
      const segIdx = Math.floor(progress * (points.length - 1))
      const segProgress = (progress * (points.length - 1)) % 1
      const nextIdx = Math.min(segIdx + 1, points.length - 1)

      mesh.position.set(
        points[segIdx][0] + (points[nextIdx][0] - points[segIdx][0]) * segProgress,
        points[segIdx][1] + (points[nextIdx][1] - points[segIdx][1]) * segProgress,
        points[segIdx][2] + (points[nextIdx][2] - points[segIdx][2]) * segProgress,
      )

      // Pulse brightness
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.3 + Math.sin(t * 4 + i) * 0.15
    })
  })

  return (
    <group>
      {/* Tube segments */}
      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1]
        const dx = next[0] - p[0]
        const dy = next[1] - p[1]
        const dz = next[2] - p[2]
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const mid: [number, number, number] = [(p[0] + next[0]) / 2, (p[1] + next[1]) / 2, (p[2] + next[2]) / 2]

        // Calculate rotation to align cylinder with segment
        const dir = new THREE.Vector3(dx, dy, dz).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir)
        const euler = new THREE.Euler().setFromQuaternion(quat)

        return (
          <group key={i}>
            {/* Conduit tube */}
            <mesh position={mid} rotation={euler}>
              <cylinderGeometry args={[0.08, 0.08, len, 6]} />
              <meshBasicMaterial color={color} transparent opacity={0.04} />
            </mesh>
            {/* Glow tube (wider) */}
            <mesh position={mid} rotation={euler}>
              <cylinderGeometry args={[0.4, 0.4, len, 6]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.008}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}

      {/* Traveling pulse lights — 3 per conduit */}
      {[0, 1, 2].map((i) => (
        <mesh key={`pulse-${i}`} ref={(el) => { if (el) pulseRef.current[i] = el }}>
          <sphereGeometry args={[0.25, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Junction nodes */}
      {points.map((p, i) => (
        <mesh key={`node-${i}`} position={p}>
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  )
}

export function EnergyConduits() {
  return (
    <group>
      {CONDUITS.map((conduit, i) => (
        <ConduitTube key={i} {...conduit} />
      ))}
    </group>
  )
}

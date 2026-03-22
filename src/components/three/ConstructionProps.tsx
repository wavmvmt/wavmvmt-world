'use client'

import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/** Traffic/safety cone */
function SafetyCone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.2, 0.8, 8]} />
        <meshStandardMaterial color={0xff6600} roughness={0.8} />
      </mesh>
      {/* White stripes */}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.14, 0.02, 4, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.17, 0.02, 4, 8]} />
        <meshBasicMaterial color={0xffffff} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshStandardMaterial color={0xff6600} roughness={0.9} />
      </mesh>
    </group>
  )
}

/** Caution tape between two points */
function CautionTape({ start, end, height = 0.8 }: {
  start: [number, number, number]; end: [number, number, number]; height?: number
}) {
  const mid = [
    (start[0] + end[0]) / 2,
    height,
    (start[2] + end[2]) / 2,
  ] as [number, number, number]

  const dx = end[0] - start[0]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)

  return (
    <group>
      {/* Tape */}
      <mesh position={mid} rotation={[0, angle, 0]}>
        <planeGeometry args={[0.08, length]} />
        <meshBasicMaterial color={0xffcc00} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Posts */}
      {[start, end].map((p, i) => (
        <mesh key={i} position={[p[0], height / 2, p[2]]}>
          <cylinderGeometry args={[0.03, 0.03, height, 6]} />
          <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** Blueprint on an easel */
function BlueprintEasel({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Easel legs */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.7, -0.1]} rotation={[0.1, 0, x > 0 ? -0.05 : 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 4]} />
          <meshStandardMaterial color={COLORS.woodLt} roughness={0.9} />
        </mesh>
      ))}
      {/* Back leg */}
      <mesh position={[0, 0.6, -0.3]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 4]} />
        <meshStandardMaterial color={COLORS.woodLt} roughness={0.9} />
      </mesh>
      {/* Blueprint paper */}
      <mesh position={[0, 1.2, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial color={0x2040a0} transparent opacity={0.8} side={THREE.DoubleSide} roughness={0.95} />
      </mesh>
      {/* Grid lines on blueprint */}
      <lineSegments position={[0, 1.2, 0.005]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.7, 0.5, 4, 3)]} />
        <lineBasicMaterial color={0x80a0ff} transparent opacity={0.3} />
      </lineSegments>
    </group>
  )
}

/** Ladder leaning on scaffolding */
function Ladder({ position, height = 5, lean = 0.3 }: {
  position: [number, number, number]; height?: number; lean?: number
}) {
  return (
    <group position={position} rotation={[lean, 0, 0]}>
      {/* Side rails */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.05, height, 0.05]} />
          <meshStandardMaterial color={COLORS.amber} roughness={0.7} />
        </mesh>
      ))}
      {/* Rungs */}
      {Array.from({ length: Math.floor(height / 0.4) }, (_, i) => (
        <mesh key={`r-${i}`} position={[0, 0.3 + i * 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
          <meshStandardMaterial color={COLORS.amber} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

/** Wheelbarrow */
function Wheelbarrow({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Tray */}
      <mesh position={[0, 0.4, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.8]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Wheel */}
      <mesh position={[0, 0.15, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 8]} />
        <meshStandardMaterial color={0x1a1015} roughness={0.95} />
      </mesh>
      {/* Handles */}
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.35, -0.5]} rotation={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
          <meshStandardMaterial color={COLORS.woodDk} roughness={0.9} />
        </mesh>
      ))}
      {/* Dirt/gravel in tray */}
      <mesh position={[0, 0.5, -0.05]}>
        <sphereGeometry args={[0.2, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={0x5a4a3a} roughness={0.95} />
      </mesh>
    </group>
  )
}

export function ConstructionProps() {
  return (
    <group>
      {/* Safety cones — near active construction */}
      <SafetyCone position={[-65, 0, -55]} />
      <SafetyCone position={[-55, 0, -55]} />
      <SafetyCone position={[85, 0, -65]} />
      <SafetyCone position={[95, 0, -65]} />
      <SafetyCone position={[-15, 0, 115]} />
      <SafetyCone position={[15, 0, 115]} />
      <SafetyCone position={[165, 0, -20]} />
      <SafetyCone position={[-165, 0, -20]} />
      <SafetyCone position={[-75, 0, -165]} />
      <SafetyCone position={[75, 0, -165]} />

      {/* Caution tape — around active areas */}
      <CautionTape start={[-70, 0, -55]} end={[-50, 0, -55]} />
      <CautionTape start={[80, 0, -65]} end={[100, 0, -65]} />
      <CautionTape start={[-20, 0, 115]} end={[20, 0, 115]} />

      {/* Blueprints on easels — near rooms */}
      <BlueprintEasel position={[-40, 0, -50]} rotation={0.3} />
      <BlueprintEasel position={[80, 0, -50]} rotation={-0.5} />
      <BlueprintEasel position={[80, 0, 30]} rotation={0.8} />
      <BlueprintEasel position={[-20, 0, 110]} rotation={0.1} />
      <BlueprintEasel position={[-70, 0, -155]} rotation={-0.2} />

      {/* Ladders */}
      <Ladder position={[-130, 0, -60]} height={6} lean={0.25} />
      <Ladder position={[155, 0, -30]} height={5} lean={0.3} />
      <Ladder position={[15, 0, -95]} height={7} lean={0.2} />

      {/* Wheelbarrows */}
      <Wheelbarrow position={[-20, 0, -30]} rotation={0.5} />
      <Wheelbarrow position={[40, 0, 50]} rotation={-1.2} />
      <Wheelbarrow position={[-90, 0, -140]} rotation={2.1} />
    </group>
  )
}

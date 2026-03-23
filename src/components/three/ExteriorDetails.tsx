'use client'

import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/** Loading dock bays on the back wall */
function LoadingDocks() {
  return (
    <group position={[0, 0, -232]}>
      {[-80, -30, 30, 80].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Dock platform */}
          <mesh position={[0, 1.5, -3]}>
            <boxGeometry args={[18, 3, 6]} />
            <meshStandardMaterial color={COLORS.concrete} roughness={0.95} />
          </mesh>
          {/* Roll-up door */}
          <mesh position={[0, 5, 0.1]}>
            <boxGeometry args={[14, 7, 0.2]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.4} roughness={0.6} transparent opacity={0.7} />
          </mesh>
          {/* Door frame */}
          <lineSegments position={[0, 5, 0.2]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(14, 7)]} />
            <lineBasicMaterial color={COLORS.gold} transparent opacity={0.15} />
          </lineSegments>
          {/* Bumper guards */}
          {[-5, 5].map((bx, j) => (
            <mesh key={j} position={[bx, 1, -0.5]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
              <meshStandardMaterial color={COLORS.amber} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Parking lot lines and lamp posts */
function ParkingArea() {
  return (
    <group position={[0, 0, 180]}>
      {/* Parking lines — 20 spots */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[-95 + i * 10, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 12]} />
          <meshBasicMaterial color={0xffffff} transparent opacity={0.06} />
        </mesh>
      ))}

      {/* Lamp posts */}
      {[-80, -20, 40, 100].map((x, i) => (
        <group key={i} position={[x, 0, -5]}>
          {/* Pole */}
          <mesh position={[0, 6, 0]}>
            <cylinderGeometry args={[0.12, 0.15, 12, 6]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Light fixture */}
          <mesh position={[0, 11.5, 0]}>
            <boxGeometry args={[1.5, 0.3, 0.8]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.6} />
          </mesh>
          {/* Light glow */}
          <pointLight position={[0, 11, 0]} color={COLORS.cream} intensity={0.15} distance={25} decay={2} />
        </group>
      ))}

      {/* Handicap spots */}
      {[-85, -75].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 12]} />
          <meshBasicMaterial color={0x2060c0} transparent opacity={0.04} />
        </mesh>
      ))}
    </group>
  )
}

/** Dumpster and utility area */
function UtilityArea() {
  return (
    <group position={[240, 0, -100]}>
      {/* Dumpster */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 4, 5]} />
        <meshStandardMaterial color={0x2a5030} roughness={0.9} />
      </mesh>
      {/* Dumpster lid */}
      <mesh position={[0, 4.1, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[8.2, 0.2, 5.2]} />
        <meshStandardMaterial color={0x1a3020} roughness={0.85} />
      </mesh>

      {/* HVAC unit */}
      <mesh position={[15, 2.5, 0]}>
        <boxGeometry args={[6, 5, 5]} />
        <meshStandardMaterial color={COLORS.steel} metalness={0.4} roughness={0.7} />
      </mesh>
      {/* HVAC fan grille */}
      <mesh position={[15, 4, 2.6]}>
        <circleGeometry args={[1.5, 12]} />
        <meshBasicMaterial color={COLORS.steel} transparent opacity={0.3} />
      </mesh>

      {/* Electrical panel */}
      <mesh position={[-10, 2.5, 0]}>
        <boxGeometry args={[3, 4, 1]} />
        <meshStandardMaterial color={0x404040} metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** Exterior ground — concrete apron around building */
function GroundApron() {
  return (
    <group>
      {/* Concrete apron around building */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[560, 500]} />
        <meshStandardMaterial color={0x252028} roughness={0.95} />
      </mesh>

      {/* Sidewalk paths */}
      {[
        { pos: [0, 0.01, 160] as [number, number, number], w: 560, d: 4 },
        { pos: [-252, 0.01, -30] as [number, number, number], w: 4, d: 430 },
        { pos: [252, 0.01, -30] as [number, number, number], w: 4, d: 430 },
      ].map((path, i) => (
        <mesh key={i} position={path.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[path.w, path.d]} />
          <meshStandardMaterial color={0x302830} roughness={0.9} />
        </mesh>
      ))}

      {/* Curb stops in parking */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[-90 + i * 10, 0.15, 186]}>
          <boxGeometry args={[4, 0.3, 0.5]} />
          <meshStandardMaterial color={COLORS.concrete} roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export function ExteriorDetails() {
  return (
    <group>
      <LoadingDocks />
      <ParkingArea />
      <UtilityArea />
      <GroundApron />
    </group>
  )
}

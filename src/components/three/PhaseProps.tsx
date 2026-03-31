'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'
import { FUNDRAISING } from '@/lib/fundraisingConfig'

/**
 * Construction phase-specific props that appear based on the current
 * IRL construction phase. Like a real construction site — what's on-site
 * tells you what phase the project is in.
 */

// Get the current active phase
function getActivePhase(): string {
  const active = FUNDRAISING.phases.find(p => p.status === 'active')
  return active?.name ?? 'Site Selection'
}

/** Survey stakes — for Site Selection phase */
function SurveyStakes({ positions }: { positions: [number, number, number][] }) {
  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Stake */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.05, 1, 0.05]} />
            <meshStandardMaterial color={COLORS.woodLt} roughness={0.9} />
          </mesh>
          {/* Pink survey ribbon */}
          <mesh position={[0.1, 0.8, 0]}>
            <planeGeometry args={[0.3, 0.15]} />
            <meshBasicMaterial color={0xff69b4} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {/* Survey string between stakes */}
      {positions.length > 1 && positions.slice(0, -1).map((start, i) => {
        const end = positions[i + 1]
        const mid: [number, number, number] = [(start[0] + end[0]) / 2, 0.9, (start[2] + end[2]) / 2]
        const dx = end[0] - start[0]
        const dz = end[2] - start[2]
        const len = Math.sqrt(dx * dx + dz * dz)
        const angle = Math.atan2(dx, dz)
        return (
          <mesh key={`s-${i}`} position={mid} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.01, 0.01, len]} />
            <meshBasicMaterial color={0xff69b4} transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Map table — blueprints spread out on a folding table */
function MapTable({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Table */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 0.05, 1.2]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Legs */}
      {[[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.5], [0.8, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.74, 4]} />
          <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
        </mesh>
      ))}
      {/* Map/blueprint on table */}
      <mesh position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[1.6, 1]} />
        <meshStandardMaterial color={0x2040a0} transparent opacity={0.7} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Coffee cup */}
      <mesh position={[0.7, 0.85, 0.3]}>
        <cylinderGeometry args={[0.05, 0.04, 0.12, 8]} />
        <meshStandardMaterial color={0xd0d0d0} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** Cement truck — for Foundation phase */
let _fs_PhasePro = 0
function CementTruck({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const drumRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if ((_fs_PhasePro = (_fs_PhasePro + 1) % 3) !== 0) return
    if (drumRef.current) {
      drumRef.current.rotation.z = state.clock.elapsedTime * 0.8
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={2}>
      {/* Cab */}
      <mesh position={[0, 0.8, 1.8]}>
        <boxGeometry args={[1.8, 1.2, 1.2]} />
        <meshStandardMaterial color={0xcc4444} roughness={0.7} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.1, 2.35]}>
        <planeGeometry args={[1.4, 0.6]} />
        <meshStandardMaterial color={0x88bbdd} transparent opacity={0.5} roughness={0.2} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 0.8, 3]} />
        <meshStandardMaterial color={0xcc4444} roughness={0.7} />
      </mesh>
      {/* Drum */}
      <mesh ref={drumRef} position={[0, 1.5, -0.2]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.6, 2.5, 10]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Chute */}
      <mesh position={[0.3, 0.8, -1.8]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.4, 0.08, 1]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
      </mesh>
      {/* Wheels */}
      {[-0.7, 0.7].flatMap(x =>
        [-1, 0.5, 1.5].map((z, i) => (
          <mesh key={`${x}-${i}`} position={[x, 0.2, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshStandardMaterial color={0x1a1015} roughness={0.95} />
          </mesh>
        ))
      )}
    </group>
  )
}

/** Rebar stack — for Foundation phase */
function RebarStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[Math.random() * 0.3 - 0.15, i * 0.06, 0]} rotation={[0, Math.random() * 0.1, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 5, 4]} />
          <meshStandardMaterial color={0x8a5030} roughness={0.8} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

/** Lumber stack — for Framing phase */
function LumberStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 12 }, (_, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        return (
          <mesh key={i} position={[col * 0.12 - 0.18, row * 0.1 + 0.05, 0]}>
            <boxGeometry args={[0.09, 0.09, 3]} />
            <meshStandardMaterial color={0xc8a060} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Excavator — for Foundation phase */
function Excavator({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const armRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 - 0.3
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={2.5}>
      {/* Tracks */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]}>
          <boxGeometry args={[0.3, 0.3, 1.8]} />
          <meshStandardMaterial color={0x2a2020} roughness={0.9} />
        </mesh>
      ))}
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1, 0.5, 1.2]} />
        <meshStandardMaterial color={COLORS.amber} roughness={0.7} />
      </mesh>
      {/* Cab */}
      <mesh position={[-0.15, 1, 0.1]}>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color={COLORS.amber} roughness={0.7} />
      </mesh>
      {/* Window */}
      <mesh position={[-0.15, 1.1, 0.41]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshStandardMaterial color={0x88bbdd} transparent opacity={0.4} />
      </mesh>
      {/* Arm */}
      <group ref={armRef} position={[0.3, 0.9, 0.5]}>
        <mesh position={[0, 0.3, 0.5]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.15, 0.12, 1.2]} />
          <meshStandardMaterial color={COLORS.amber} roughness={0.7} />
        </mesh>
        {/* Bucket */}
        <mesh position={[0, 0.1, 1.1]} rotation={[-0.8, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color={COLORS.steel} roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export function PhaseProps() {
  const phase = getActivePhase()

  return (
    <group>
      {/* Always present: survey/map tables */}
      <MapTable position={[30, 0, 15]} rotation={0.3} />
      <MapTable position={[-40, 0, 90]} rotation={-0.5} />

      {/* Site Selection phase props */}
      {phase === 'Site Selection' && (
        <>
          <SurveyStakes positions={[
            [-60, 0, -40], [-40, 0, -40], [-40, 0, -20], [-60, 0, -20],
            [80, 0, -50], [100, 0, -50], [100, 0, -30], [80, 0, -30],
            [-20, 0, 100], [20, 0, 100], [20, 0, 120], [-20, 0, 120],
          ]} />
          <SurveyStakes positions={[
            [-80, 0, -160], [-50, 0, -160], [-50, 0, -190], [-80, 0, -190],
          ]} />
        </>
      )}

      {/* Foundation phase props */}
      {(phase === 'Foundation' || phase === 'Site Selection') && (
        <>
          <CementTruck position={[-30, 0, -60]} rotation={0.5} />
          <CementTruck position={[60, 0, -100]} rotation={-0.8} />
          <Excavator position={[-120, 0, -130]} rotation={0.3} />
          <Excavator position={[80, 0, 80]} rotation={-1.2} />
          <RebarStack position={[-45, 0, -80]} />
          <RebarStack position={[70, 0, -40]} />
          <RebarStack position={[0, 0, -130]} />
        </>
      )}

      {/* Framing phase props */}
      {phase === 'Structure' && (
        <>
          <LumberStack position={[-50, 0, -30]} />
          <LumberStack position={[40, 0, -60]} />
          <LumberStack position={[-80, 0, 40]} />
          <LumberStack position={[100, 0, 20]} />
          <LumberStack position={[0, 0, -80]} />
        </>
      )}

      {/* All phases: some equipment always visible for visual interest */}
      <CementTruck position={[160, 0, -100]} rotation={1.2} />
      <Excavator position={[-170, 0, -50]} rotation={-0.5} />
    </group>
  )
}

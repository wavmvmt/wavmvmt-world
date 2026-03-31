import { detectPerformanceLevel } from '@/lib/performanceMode'
const _dLevel = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'
'use client'

import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Wall-mounted industrial details — exposed pipes, electrical conduit,
 * junction boxes, and emergency lights along the warehouse walls.
 * Adds visual depth to the otherwise flat wall surfaces.
 */

function PipeRun({ y, z1, z2, x, color = COLORS.copper }: {
  y: number; z1: number; z2: number; x: number; color?: number
}) {
  const length = Math.abs(z2 - z1)
  const midZ = (z1 + z2) / 2
  return (
    <group>
      <mesh position={[x, y, midZ]}>
        <cylinderGeometry args={[0.12, 0.12, length, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Pipe brackets every 30 units */}
      {Array.from({ length: Math.floor(length / 30) + 1 }, (_, i) => (
        <mesh key={i} position={[x, y, z1 + i * 30]}>
          <torusGeometry args={[0.18, 0.03, 4, 8, Math.PI]} />
          <meshLambertMaterial color={COLORS.steel} />
        </mesh>
      ))}
    </group>
  )
}

function ConduitRun({ y, z1, z2, x }: {
  y: number; z1: number; z2: number; x: number
}) {
  const length = Math.abs(z2 - z1)
  const midZ = (z1 + z2) / 2
  return (
    <mesh position={[x, y, midZ]}>
      <boxGeometry args={[0.08, 0.08, length]} />
      <meshLambertMaterial color={COLORS.steel} />
    </mesh>
  )
}

function JunctionBox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.5, 0.15]} />
        <meshLambertMaterial color={0x2a2535} />
      </mesh>
      {/* Cover plate */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.35, 0.45, 0.02]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
    </group>
  )
}

function EmergencyLight({ position, rotation = 0 }: {
  position: [number, number, number]; rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Housing */}
      <mesh>
        <boxGeometry args={[1, 0.3, 0.15]} />
        <meshLambertMaterial color={0x2a2535} />
      </mesh>
      {/* Red light */}
      <mesh position={[0, 0, 0.09]}>
        <circleGeometry args={[0.08, 8]} />
        <meshBasicMaterial color={0xff2020} />
      </mesh>
      {/* Green status */}
      <mesh position={[0.3, 0, 0.09]}>
        <circleGeometry args={[0.04, 6]} />
        <meshBasicMaterial color={0x20ff20} />
      </mesh>
    </group>
  )
}

function WallDetailInner() {
  return (
    <group>
      {/* === BACK WALL (z = -230) === */}
      {/* Pipes at different heights */}
      <PipeRun y={8} z1={-200} z2={200} x={-248} />
      <PipeRun y={15} z1={-200} z2={200} x={-248} color={COLORS.steel} />
      <PipeRun y={8} z1={-200} z2={200} x={248} />
      <PipeRun y={15} z1={-200} z2={200} x={248} color={COLORS.steel} />

      {/* Electrical conduit runs */}
      <ConduitRun y={12} z1={-180} z2={180} x={-249} />
      <ConduitRun y={12} z1={-180} z2={180} x={249} />

      {/* Junction boxes along walls */}
      {[-200, -120, -40, 40, 120].map((z, i) => (
        <group key={`jb-l-${i}`}>
          <JunctionBox position={[-249, 10, z]} />
          <JunctionBox position={[249, 10, z]} />
        </group>
      ))}

      {/* Emergency exit lights */}
      <EmergencyLight position={[-249, 18, -100]} rotation={Math.PI / 2} />
      <EmergencyLight position={[-249, 18, 50]} rotation={Math.PI / 2} />
      <EmergencyLight position={[249, 18, -100]} rotation={-Math.PI / 2} />
      <EmergencyLight position={[249, 18, 50]} rotation={-Math.PI / 2} />
      <EmergencyLight position={[0, 18, -229]} />

      {/* Fire extinguisher stations */}
      {[-160, 0, 160].map((x, i) => (
        <group key={`fe-${i}`} position={[x, 3, -228]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <meshLambertMaterial color={0xcc2020} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.45, 0]}>
            <torusGeometry args={[0.08, 0.02, 4, 8, Math.PI]} />
            <meshLambertMaterial color={0x1a1015} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

import * as _React from 'react'
// Distance-culled export
export function WallDetail() {
  const [visible, setVisible] = _React.useState(false)
  _React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800)
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const inRange = x > -230 && x < 230 && z > -230 && z < 230
      setVisible(inRange)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => { clearTimeout(t); window.removeEventListener('playerMove', onMove as EventListener) }
  }, [])
  return visible ? <WallDetailInner /> : null
}

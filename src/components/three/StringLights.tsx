'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Construction string lights — warm bulbs strung between columns.
 * Classic construction site feel. Each bulb gently sways and flickers.
 */

interface LightString {
  start: [number, number, number]
  end: [number, number, number]
  bulbs: number
}

const STRINGS: LightString[] = [
  { start: [-200, 25, -120], end: [-100, 25, -120], bulbs: 6 },
  { start: [-100, 25, -120], end: [0, 25, -120], bulbs: 6 },
  { start: [0, 25, -120], end: [100, 25, -120], bulbs: 6 },
  { start: [100, 25, -120], end: [200, 25, -120], bulbs: 6 },
  { start: [-200, 25, -30], end: [-100, 25, -30], bulbs: 6 },
  { start: [0, 25, -30], end: [100, 25, -30], bulbs: 6 },
  { start: [-200, 25, 60], end: [-100, 25, 60], bulbs: 6 },
  { start: [0, 25, 60], end: [100, 25, 60], bulbs: 6 },
  { start: [100, 25, 60], end: [200, 25, 60], bulbs: 6 },
  { start: [-100, 25, 120], end: [100, 25, 120], bulbs: 8 },
]

let _fs_StringLi = 0
function StringLightSegment({ string, index }: { string: LightString; index: number }) {
  const bulbRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    if ((_fs_StringLi = (_fs_StringLi + 1) % 3) !== 0) return
    const t = state.clock.elapsedTime
    bulbRefs.current.forEach((bulb, i) => {
      if (!bulb) return
      const mat = bulb.material as THREE.MeshBasicMaterial
      // Gentle flicker
      mat.opacity = 0.7 + Math.sin(t * 2 + index * 3 + i * 1.5) * 0.15
    })
  })

  const bulbs = []
  for (let i = 0; i < string.bulbs; i++) {
    const t = (i + 0.5) / string.bulbs
    const x = string.start[0] + (string.end[0] - string.start[0]) * t
    const z = string.start[2] + (string.end[2] - string.start[2]) * t
    // Catenary sag
    const sag = Math.sin(t * Math.PI) * 3
    const y = string.start[1] - sag

    bulbs.push(
      <group key={i} position={[x, y, z]}>
        {/* Bulb */}
        <mesh ref={el => { bulbRefs.current[i] = el }}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshBasicMaterial color={0xffe8a0} transparent opacity={0.8} />
        </mesh>
        {/* Bulb glow */}
        <mesh>
          <sphereGeometry args={[0.35, 6, 6]} />
          <meshBasicMaterial
            color={0xffe0a0}
            transparent
            opacity={0.04}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Small point light every 3rd bulb for performance */}
        {i % 3 === 0 && (
          <pointLight color={0xffe0a0} intensity={0.15} distance={12} decay={2} />
        )}
      </group>
    )
  }

  // Wire between bulbs
  const wirePoints: THREE.Vector3[] = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const x = string.start[0] + (string.end[0] - string.start[0]) * t
    const z = string.start[2] + (string.end[2] - string.start[2]) * t
    const sag = Math.sin(t * Math.PI) * 3
    wirePoints.push(new THREE.Vector3(x, string.start[1] - sag, z))
  }

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(wirePoints.flatMap(p => [p.x, p.y, p.z])), 3]}
            count={wirePoints.length}
          />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.steel} transparent opacity={0.15} />
      </line>
      {bulbs}
    </group>
  )
}

function StringLightsInner() {
  return (
    <group>
      {STRINGS.map((s, i) => (
        <StringLightSegment key={i} string={s} index={i} />
      ))}
    </group>
  )
}

import * as _React from 'react'
// Distance-culled export
export function StringLights() {
  const [visible, setVisible] = _React.useState(false)
  _React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800)
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const inRange = x > -250 && x < 250 && z > -250 && z < 250
      setVisible(inRange)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => { clearTimeout(t); window.removeEventListener('playerMove', onMove as EventListener) }
  }, [])
  return visible ? <StringLightsInner /> : null
}

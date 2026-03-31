'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/** Stylized potted plant — Ghibli round shapes */
let _fs_Decorati = 0
function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leafRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if ((_fs_Decorati = (_fs_Decorati + 1) % 3) !== 0) return
    if (leafRef.current) {
      // Gentle sway
      leafRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.03
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.6, 8]} />
        <meshStandardMaterial color={0x8a5030} roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 8]} />
        <meshStandardMaterial color={0x3a2a1a} roughness={0.95} />
      </mesh>
      {/* Leaves — round bushy Ghibli style */}
      <group ref={leafRef}>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 0.3, 1.1 + i * 0.08, Math.sin(angle) * 0.3]}>
            <sphereGeometry args={[0.35 - i * 0.03, 8, 6]} />
            <meshStandardMaterial color={0x4a8a3a} roughness={0.85} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* Central tall leaf cluster */}
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.25, 8, 6]} />
          <meshStandardMaterial color={0x5a9a4a} roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}

/** Neon accent sign — glowing text on wall */
function NeonSign({ position, text, color, rotation = 0 }: {
  position: [number, number, number]; text: string; color: number; rotation?: number
}) {
  const glowRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (glowRef.current) {
      // Subtle flicker
      glowRef.current.intensity = 0.4 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
    }
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Backing plate */}
      <mesh>
        <boxGeometry args={[text.length * 0.35 + 0.5, 0.8, 0.08]} />
        <meshStandardMaterial color={0x1a1015} roughness={0.9} />
      </mesh>
      {/* Neon tubes — simplified as emissive boxes */}
      {text.split('').map((char, i) => (
        <mesh key={i} position={[(i - text.length / 2 + 0.5) * 0.35, 0, 0.05]}>
          <boxGeometry args={[0.25, 0.4, 0.03]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Glow light */}
      <pointLight ref={glowRef} position={[0, 0, 0.5]} color={color} intensity={0.4} distance={8} decay={2} />
    </group>
  )
}

/** Hanging string lights between columns */
function StringLights({ start, end, count = 8 }: {
  start: [number, number, number]; end: [number, number, number]; count?: number
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count
        const x = start[0] + (end[0] - start[0]) * t
        const y = start[1] - Math.sin(t * Math.PI) * 1.5 // catenary sag
        const z = start[2] + (end[2] - start[2]) * t
        return (
          <group key={i}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshBasicMaterial color={i % 2 === 0 ? COLORS.gold : COLORS.amber} />
            </mesh>
            <pointLight position={[x, y, z]} color={COLORS.gold} intensity={0.08} distance={4} decay={2} />
          </group>
        )
      })}
    </group>
  )
}

export function Decorations() {
  return (
    <group>
      {/* Potted plants — scattered around for warmth */}
      <Plant position={[25, 0, 120]} scale={1.5} />
      <Plant position={[-25, 0, 120]} scale={1.2} />
      <Plant position={[5, 0, -30]} />
      <Plant position={[-60, 0, 40]} scale={1.3} />
      <Plant position={[60, 0, -20]} />
      <Plant position={[-140, 0, -30]} scale={1.1} />
      <Plant position={[140, 0, 50]} scale={0.9} />

      {/* Neon signs — personality */}
      <NeonSign position={[-248, 12, -60]} text="BUILD" color={COLORS.gold} rotation={Math.PI / 2} />
      <NeonSign position={[248, 12, -60]} text="CREATE" color={COLORS.rose} rotation={-Math.PI / 2} />
      <NeonSign position={[0, 15, -228]} text="WAVMVMT" color={COLORS.lavender} />

      {/* String lights — cafe area warmth */}
      <StringLights start={[-130, 12, 40]} end={[-80, 12, 70]} count={10} />
      <StringLights start={[-130, 12, 70]} end={[-80, 12, 40]} count={8} />
    </group>
  )
}

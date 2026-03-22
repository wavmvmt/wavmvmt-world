'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS, SKIN_TONES, WORKER_DATA, WORKER_POSITIONS } from '@/lib/roomConfig'

function Worker({ position, index }: { position: [number, number]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)

  const info = WORKER_DATA[index % WORKER_DATA.length]
  const skin = SKIN_TONES[index % SKIN_TONES.length]
  const phase = useRef(Math.random() * Math.PI * 2)
  const type = ['hammer', 'measure', 'walk', 'dance', 'hammer', 'walk', 'weld', 'carry', 'idle', 'dance'][index % 10]

  useFrame((_, delta) => {
    const t = phase.current
    phase.current += delta * 3

    if (leftArmRef.current && rightArmRef.current && headRef.current) {
      // Gentle idle breathing on all workers
      if (groupRef.current) {
        groupRef.current.scale.y = 1 + Math.sin(t * 0.8) * 0.008
      }

      switch (type) {
        case 'hammer':
          rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 2) * 0.8
          leftArmRef.current.rotation.z = 0.3
          // Slight body bob with each hit
          if (groupRef.current) {
            groupRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.03
          }
          break
        case 'measure':
          leftArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.5) * 0.15
          rightArmRef.current.rotation.z = -0.8
          headRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
          // Look up and down too
          headRef.current.rotation.x = Math.sin(t * 0.2) * 0.15
          break
        case 'walk':
          leftArmRef.current.rotation.z = 0.3 + Math.sin(t) * 0.25
          rightArmRef.current.rotation.z = -0.3 - Math.sin(t) * 0.25
          if (groupRef.current) {
            groupRef.current.position.x = position[0] + Math.sin(t * 0.3) * 1.5
            groupRef.current.position.z = position[1] + Math.cos(t * 0.2) * 0.8
            groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
            // Walking bob
            groupRef.current.position.y = Math.abs(Math.sin(t * 1.2)) * 0.04
          }
          break
        case 'dance':
          // The signature WAVMVMT move — a worker busting out
          leftArmRef.current.rotation.z = 0.5 + Math.sin(t * 1.5) * 0.6
          rightArmRef.current.rotation.z = -0.5 - Math.sin(t * 1.5 + 1) * 0.6
          leftArmRef.current.rotation.x = Math.sin(t * 3) * 0.3
          rightArmRef.current.rotation.x = Math.cos(t * 3) * 0.3
          headRef.current.rotation.z = Math.sin(t * 1.5) * 0.15
          if (groupRef.current) {
            groupRef.current.position.y = Math.abs(Math.sin(t * 3)) * 0.08
            groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.4
          }
          break
        case 'weld':
          // Focused forward lean, steady arm, slight vibration
          rightArmRef.current.rotation.z = -0.7 + Math.sin(t * 8) * 0.03
          rightArmRef.current.rotation.x = -0.5
          leftArmRef.current.rotation.z = 0.2
          leftArmRef.current.rotation.x = -0.3
          headRef.current.rotation.x = 0.2
          break
        case 'carry':
          // Both arms forward, steady walk
          leftArmRef.current.rotation.z = 0.1
          leftArmRef.current.rotation.x = -0.8
          rightArmRef.current.rotation.z = -0.1
          rightArmRef.current.rotation.x = -0.8
          if (groupRef.current) {
            groupRef.current.position.x = position[0] + Math.sin(t * 0.15) * 2
            groupRef.current.rotation.y = Math.sin(t * 0.15) > 0 ? 0 : Math.PI
            groupRef.current.position.y = Math.abs(Math.sin(t * 0.8)) * 0.02
          }
          break
        case 'idle':
          // Scratching head, looking around
          headRef.current.rotation.y = Math.sin(t * 0.2) * 0.5
          rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 0.4) * 0.1
          leftArmRef.current.rotation.z = 0.3
          break
      }
    }
  })

  const outlineMat = <meshBasicMaterial color={COLORS.outline} side={THREE.BackSide} />

  return (
    <group ref={groupRef} position={[position[0], 0, position[1]]} castShadow>
      {/* Body */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.9, 10]} />
        <meshStandardMaterial color={0x3a5080} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0]} scale={[1.08, 1.08, 1.08]}>
        <cylinderGeometry args={[0.22, 0.28, 0.9, 10]} />
        {outlineMat}
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0]} scale={[1.07, 1.07, 1.07]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        {outlineMat}
      </mesh>

      {/* Big anime eyes */}
      {[-1, 1].map(s => (
        <group key={s}>
          <mesh position={[s * 0.09, 1.97, 0.2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          <mesh position={[s * 0.09, 1.97, 0.24]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={0x1a1520} />
          </mesh>
          {/* Anime sparkle highlight */}
          <mesh position={[s * 0.07, 1.99, 0.25]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
        </group>
      ))}

      {/* Hard hat */}
      <mesh position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.27, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={info.hat} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.03, 12]} />
        <meshStandardMaterial color={info.hat} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.33, 1.25, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.055, 0.055, 0.65, 6]} />
        <meshStandardMaterial color={0x3a5080} roughness={0.9} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.33, 1.25, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.055, 0.055, 0.65, 6]} />
        <meshStandardMaterial color={0x3a5080} roughness={0.9} />
      </mesh>

      {/* Tool belt */}
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.26, 0.03, 6, 12]} />
        <meshStandardMaterial color={0x6a4a28} roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 0.72, 0.25]}>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color={COLORS.copper} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.35, 0]}>
        <cylinderGeometry args={[0.07, 0.075, 0.55, 6]} />
        <meshStandardMaterial color={0x2a3548} roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.35, 0]}>
        <cylinderGeometry args={[0.07, 0.075, 0.55, 6]} />
        <meshStandardMaterial color={0x2a3548} roughness={0.9} />
      </mesh>

      {/* Chunky boots (Ghibli style — round and oversized) */}
      <mesh position={[-0.1, 0.06, 0.03]}>
        <boxGeometry args={[0.12, 0.12, 0.18]} />
        <meshStandardMaterial color={0x3a2a1a} roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.06, 0.03]}>
        <boxGeometry args={[0.12, 0.12, 0.18]} />
        <meshStandardMaterial color={0x3a2a1a} roughness={0.85} />
      </mesh>
      {/* Boot soles */}
      <mesh position={[-0.1, 0.01, 0.03]}>
        <boxGeometry args={[0.13, 0.02, 0.2]} />
        <meshStandardMaterial color={0x1a1010} roughness={0.95} />
      </mesh>
      <mesh position={[0.1, 0.01, 0.03]}>
        <boxGeometry args={[0.13, 0.02, 0.2]} />
        <meshStandardMaterial color={0x1a1010} roughness={0.95} />
      </mesh>

      {/* Gloves (skin-colored hands at arm ends) */}
      <mesh position={[-0.42, 0.95, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={0xd4a060} roughness={0.8} />
      </mesh>
      <mesh position={[0.42, 0.95, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color={0xd4a060} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function Workers() {
  return (
    <group>
      {WORKER_POSITIONS.map((pos, i) => (
        <Worker key={i} position={pos} index={i} />
      ))}
    </group>
  )
}

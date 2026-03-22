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
  const type = ['hammer', 'measure', 'walk', 'idle', 'hammer', 'walk'][index % 6]

  useFrame((_, delta) => {
    const t = phase.current
    phase.current += delta * 3

    if (leftArmRef.current && rightArmRef.current && headRef.current) {
      switch (type) {
        case 'hammer':
          rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 2) * 0.8
          leftArmRef.current.rotation.z = 0.3
          break
        case 'measure':
          leftArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.5) * 0.15
          rightArmRef.current.rotation.z = -0.8
          headRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
          break
        case 'walk':
          leftArmRef.current.rotation.z = 0.3 + Math.sin(t) * 0.25
          rightArmRef.current.rotation.z = -0.3 - Math.sin(t) * 0.25
          if (groupRef.current) {
            groupRef.current.position.x = position[0] + Math.sin(t * 0.3) * 1.5
          }
          break
        case 'idle':
          // Gentle breathing
          if (groupRef.current) {
            groupRef.current.scale.y = 1 + Math.sin(t * 0.8) * 0.01
          }
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

      {/* Legs */}
      <mesh position={[-0.1, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 6]} />
        <meshStandardMaterial color={0x2a3548} roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 6]} />
        <meshStandardMaterial color={0x2a3548} roughness={0.9} />
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

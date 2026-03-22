'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Volumetric light shafts coming through skylights in the warehouse roof */
function LightShaft({ position, width = 4, depth = 4, opacity = 0.02 }: {
  position: [number, number, number]; width?: number; depth?: number; opacity?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle shimmer — dust in the light
      const t = state.clock.elapsedTime
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = opacity + Math.sin(t * 0.5 + position[0]) * 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[width, 18, depth]} />
      <meshBasicMaterial
        color={0xffe8c0}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/** Skylight opening in the roof — bright rectangle */
function SkylightOpening({ position, width = 4, depth = 4 }: {
  position: [number, number, number]; width?: number; depth?: number
}) {
  return (
    <group>
      {/* Bright opening */}
      <mesh position={[position[0], 17.5, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={0xfff8e8} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Frame */}
      {[
        [position[0] - width / 2, 17.5, position[2]],
        [position[0] + width / 2, 17.5, position[2]],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.2, 0.2, depth]} />
          <meshStandardMaterial color={0x5a5060} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export function LightShafts() {
  const positions: [number, number, number][] = [
    [-30, 8, -20],
    [10, 8, -35],
    [50, 8, 5],
    [-50, 8, 15],
    [0, 8, 20],
    [-20, 8, -40],
    [30, 8, 30],
  ]

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i}>
          <LightShaft position={pos} width={3 + i % 3} depth={3 + i % 2} opacity={0.015 + (i % 3) * 0.005} />
          <SkylightOpening position={pos} width={3 + i % 3} depth={3 + i % 2} />
          {/* Spot light from skylight */}
          <spotLight
            position={[pos[0], 17, pos[2]]}
            target-position={[pos[0], 0, pos[2]]}
            intensity={0.3}
            color={0xfff0d0}
            angle={0.4}
            penumbra={0.8}
            distance={20}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}

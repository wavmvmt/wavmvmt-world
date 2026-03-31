'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Animated floor glow for each room — a subtle colored light pool
 * on the ground that breathes slowly. Makes rooms feel alive
 * even from a distance.
 */
export function RoomFloorGlow() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const _fsFg = useRef(0)
  useFrame((state) => {
    _fsFg.current = (_fsFg.current + 1) % 6  // ~10fps — subtle breathing
    if (_fsFg.current !== 0) return
    const t = state.clock.elapsedTime
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshBasicMaterial
      // Each room breathes at a slightly different rate
      const breath = 0.7 + Math.sin(t * 0.4 + i * 0.8) * 0.3
      mat.opacity = 0.04 * breath * (0.5 + (ROOMS[i]?.buildPct || 0) / 100 * 0.5)
    })
  })

  return (
    <group>
      {ROOMS.map((room, i) => (
        <mesh
          key={room.name}
          ref={el => { meshRefs.current[i] = el }}
          position={[room.x, 0.04, room.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[room.w * 0.85, room.d * 0.85]} />
          <meshBasicMaterial
            color={room.color}
            transparent
            opacity={0.03}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

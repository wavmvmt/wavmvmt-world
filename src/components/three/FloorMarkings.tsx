'use client'

import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/**
 * Painted floor markings around each room — like a real construction site.
 * Safety lines, room boundaries, directional arrows.
 */
export function FloorMarkings() {
  return (
    <group>
      {/* Room boundary lines — painted on the floor */}
      {ROOMS.map(room => {
        const hexColor = room.color
        const hw = room.w / 2 + 3
        const hd = room.d / 2 + 3

        return (
          <group key={room.name} position={[room.x, 0.04, room.z]}>
            {/* Corner L-brackets */}
            {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cz], i) => (
              <group key={i}>
                {/* Horizontal */}
                <mesh position={[cx * hw, 0, cz * hd]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[4 * cx, 0.15]} />
                  <meshBasicMaterial color={hexColor} transparent opacity={0.15} side={THREE.DoubleSide} />
                </mesh>
                {/* Vertical */}
                <mesh position={[cx * hw, 0, cz * hd]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                  <planeGeometry args={[4 * cz, 0.15]} />
                  <meshBasicMaterial color={hexColor} transparent opacity={0.15} side={THREE.DoubleSide} />
                </mesh>
              </group>
            ))}
          </group>
        )
      })}

      {/* Main walkway center line — guides visitors through the space */}
      <mesh position={[0, 0.04, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 200]} />
        <meshBasicMaterial color={COLORS.gold} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Cross walkway */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.3, 400]} />
        <meshBasicMaterial color={COLORS.gold} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* "ENTRANCE" text area near Front Desk */}
      <mesh position={[0, 0.04, 145]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 3]} />
        <meshBasicMaterial color={COLORS.sage} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

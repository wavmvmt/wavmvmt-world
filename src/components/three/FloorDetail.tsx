'use client'

import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/**
 * Construction zone floor markings — safety stripes around rooms,
 * walkway center lines, and area indicators. Makes the warehouse
 * floor feel like a real active construction site.
 */
export function FloorDetail() {
  return (
    <group>
      {/* Safety stripe borders around each room */}
      {ROOMS.map((room) => {
        const hw = room.w / 2 + 1
        const hd = room.d / 2 + 1
        return (
          <group key={room.name} position={[room.x, 0.04, room.z]}>
            {/* Yellow safety perimeter — 4 sides */}
            {[
              { pos: [0, 0, -hd] as [number, number, number], rot: 0, len: room.w + 2 },
              { pos: [0, 0, hd] as [number, number, number], rot: 0, len: room.w + 2 },
              { pos: [-hw, 0, 0] as [number, number, number], rot: Math.PI / 2, len: room.d + 2 },
              { pos: [hw, 0, 0] as [number, number, number], rot: Math.PI / 2, len: room.d + 2 },
            ].map((side, i) => (
              <mesh key={i} position={side.pos} rotation={[-Math.PI / 2, 0, side.rot]}>
                <planeGeometry args={[side.len, 0.4]} />
                <meshBasicMaterial
                  color={COLORS.amber}
                  transparent
                  opacity={0.06}
                  depthWrite={false}
                />
              </mesh>
            ))}
            {/* Corner markers */}
            {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cz], i) => (
              <mesh key={`c-${i}`} position={[cx * hw, 0, cz * hd]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.5, 6]} />
                <meshBasicMaterial color={room.color} transparent opacity={0.08} depthWrite={false} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Central walkway — main corridor indicator */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 400]} />
        <meshBasicMaterial color={COLORS.cream} transparent opacity={0.025} depthWrite={false} />
      </mesh>
      {/* Cross walkway */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[1.5, 500]} />
        <meshBasicMaterial color={COLORS.cream} transparent opacity={0.02} depthWrite={false} />
      </mesh>

      {/* Dashed center line on main walkway */}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={`dash-${i}`} position={[0, 0.036, -190 + i * 10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 3]} />
          <meshBasicMaterial color={COLORS.cream} transparent opacity={0.04} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

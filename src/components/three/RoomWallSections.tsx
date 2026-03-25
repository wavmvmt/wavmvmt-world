'use client'

import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/**
 * Partial wall sections for rooms — builds up based on buildPct.
 * At low build%, just corner posts. At higher%, partial walls emerge.
 * Creates physical enclosure while keeping the wireframe aesthetic.
 */

function RoomWalls({ room }: { room: typeof ROOMS[0] }) {
  if (room.buildPct < 2) return null

  const hw = room.w / 2
  const hd = room.d / 2
  const wallH = room.h * Math.min(1, room.buildPct / 100 + 0.3) // walls grow with build %
  const opacity = 0.08 + (room.buildPct / 100) * 0.12 // 8-20% opacity

  return (
    <group position={[room.x, 0, room.z]}>
      {/* Bottom wall band — concrete base (always present, solid) */}
      {[
        { pos: [0, 1, -hd] as [number, number, number], size: [room.w, 2, 0.3] as [number, number, number], rot: 0 },
        { pos: [0, 1, hd] as [number, number, number], size: [room.w, 2, 0.3] as [number, number, number], rot: 0 },
        { pos: [-hw, 1, 0] as [number, number, number], size: [0.3, 2, room.d] as [number, number, number], rot: 0 },
        { pos: [hw, 1, 0] as [number, number, number], size: [0.3, 2, room.d] as [number, number, number], rot: 0 },
      ].map((wall, i) => (
        <mesh key={`base-${i}`} position={wall.pos}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            color={COLORS.concrete}
            transparent
            opacity={opacity * 2}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Upper wall sections — transparent, grow with build % */}
      {room.buildPct > 10 && (
        <>
          {/* Back wall — tallest */}
          <mesh position={[0, wallH / 2 + 2, -hd]}>
            <boxGeometry args={[room.w, wallH, 0.15]} />
            <meshStandardMaterial
              color={room.color}
              transparent
              opacity={opacity}
              roughness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Side walls — half height */}
          {[-hw, hw].map((x, i) => (
            <mesh key={`side-${i}`} position={[x, wallH / 4 + 2, 0]}>
              <boxGeometry args={[0.15, wallH / 2, room.d]} />
              <meshStandardMaterial
                color={room.color}
                transparent
                opacity={opacity * 0.7}
                roughness={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Horizontal beam at wall top — structural */}
      {room.buildPct > 20 && (
        <>
          <mesh position={[0, wallH + 2, -hd]}>
            <boxGeometry args={[room.w + 0.5, 0.4, 0.4]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, wallH + 2, hd]}>
            <boxGeometry args={[room.w + 0.5, 0.4, 0.4]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
          </mesh>
        </>
      )}
    </group>
  )
}

export function RoomWallSections() {
  return (
    <group>
      {ROOMS.map((room) => (
        <RoomWalls key={room.name} room={room} />
      ))}
    </group>
  )
}

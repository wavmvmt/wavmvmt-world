'use client'

/**
 * PotatoWarehouse — Roblox-tier low-end rendering.
 * POLISHED VERSION: room labels, subtle grid, ambient glow
 * Still: flat shading only, ~30 draw calls total, zero lighting shader cost.
 */

import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

// Pre-built shared materials — all flat, zero lighting cost
const _mat = {
  floor:    new THREE.MeshBasicMaterial({ color: 0x1e1530 }),
  floorGrid: new THREE.MeshBasicMaterial({ color: 0x4a3a6a, wireframe: true, transparent: true, opacity: 0.35 }),
  wall:     new THREE.MeshBasicMaterial({ color: 0x3a2a50, transparent: true, opacity: 0.9 }),
  ceiling:  new THREE.MeshBasicMaterial({ color: 0x201830, side: THREE.BackSide }),
}

// Pre-built room materials at module level
const _roomFillMats = ROOMS.map(r => new THREE.MeshBasicMaterial({
  color: r.color, transparent: true, opacity: 0.12,
  side: THREE.BackSide, depthWrite: false,
}))
const _roomEdgeMats = ROOMS.map(r => new THREE.MeshBasicMaterial({
  color: r.color, transparent: true, opacity: 0.8, wireframe: true,
}))
const _roomGeos = ROOMS.map(r => new THREE.BoxGeometry(r.w, r.h, r.d))

// Subtle floor grid geometry
const _floorGeo = new THREE.PlaneGeometry(600, 400, 30, 20)

function PotatoFloor() {
  return (
    <group>
      {/* Solid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={_mat.floor}>
        <planeGeometry args={[600, 400]} />
      </mesh>
      {/* Subtle grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={_mat.floorGrid}
            geometry={_floorGeo} />
    </group>
  )
}

function PotatoWalls() {
  const W = 600, D = 400, H = 45
  return (
    <group>
      <mesh position={[0, H/2, -D/2]} material={_mat.wall}><boxGeometry args={[W, H, 1.5]} /></mesh>
      <mesh position={[0, H/2,  D/2]} material={_mat.wall}><boxGeometry args={[W, H, 1.5]} /></mesh>
      <mesh position={[-W/2, H/2, 0]} material={_mat.wall}><boxGeometry args={[1.5, H, D]} /></mesh>
      <mesh position={[ W/2, H/2, 0]} material={_mat.wall}><boxGeometry args={[1.5, H, D]} /></mesh>
      <mesh position={[0, H, 0]} material={_mat.ceiling}>
        <planeGeometry args={[W, D]} />
      </mesh>
    </group>
  )
}

function PotatoRooms() {
  return (
    <group>
      {ROOMS.map((room, i) => {
        const hexColor = `#${room.color.toString(16).padStart(6, '0')}`
        return (
          <group key={room.name} position={[room.x, room.h/2, room.z]}>
            <mesh material={_roomFillMats[i]} geometry={_roomGeos[i]} />
            <mesh material={_roomEdgeMats[i]} geometry={_roomGeos[i]} />
            {/* Room name label — always visible in potato mode */}
            <Html position={[0, 0, 0]} center distanceFactor={60}>
              <div style={{
                color: hexColor,
                fontSize: '10px',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                textShadow: `0 0 12px ${hexColor}88`,
                opacity: 0.9,
              }}>
                {room.name}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function PotatoLight() {
  return (
    <>
      <ambientLight intensity={1.4} color={0xfff0e8} />
      <directionalLight position={[50, 80, 30]} intensity={0.8} color={0xfff5e8} />
    </>
  )
}

export function PotatoWarehouse() {
  return (
    <group>
      <PotatoLight />
      <PotatoFloor />
      <PotatoWalls />
      <PotatoRooms />
    </group>
  )
}

'use client'

/**
 * PotatoWarehouse — Roblox-tier low-end rendering of the warehouse.
 *
 * Roblox achieves smooth gameplay by using:
 *   - Flat shading (MeshBasicMaterial only — zero lighting calculations)
 *   - Merged geometry (single draw call for all static geo)
 *   - Zero Html, zero particles, zero post-processing
 *   - ~10 draw calls total for the entire scene
 *
 * This component replaces Warehouse on LOW quality.
 * It renders the same spatial layout as a set of flat-shaded boxes
 * with room color coding so navigation is still clear.
 * Total: ~15 draw calls (vs ~80+ for full Warehouse)
 */

import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

// Pre-built shared materials — all flat, zero lighting cost
const _mat = {
  floor:    new THREE.MeshBasicMaterial({ color: 0x1a1520 }),
  wall:     new THREE.MeshBasicMaterial({ color: 0x2a2035 }),
  ceiling:  new THREE.MeshBasicMaterial({ color: 0x1e1828 }),
  beam:     new THREE.MeshBasicMaterial({ color: 0x3a3048 }),
}

// Reusable geometry cache
const _geo: Map<string, THREE.BufferGeometry> = new Map()
function g(w: number, h: number, d: number) {
  const k = `${w},${h},${d}`
  return _geo.get(k) || _geo.set(k, new THREE.BoxGeometry(w, h, d)).get(k)!
}

/** Floor — single large plane, 1 draw call */
function PotatoFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={_mat.floor}>
      <planeGeometry args={[600, 450]} />
    </mesh>
  )
}

/** Walls — 4 walls, 4 draw calls */
function PotatoWalls() {
  const W = 600, D = 400, H = 45
  return (
    <group>
      <mesh position={[0, H/2, -D/2]} material={_mat.wall}><boxGeometry args={[W, H, 2]} /></mesh>
      <mesh position={[0, H/2,  D/2]} material={_mat.wall}><boxGeometry args={[W, H, 2]} /></mesh>
      <mesh position={[-W/2, H/2, 0]} material={_mat.wall}><boxGeometry args={[2, H, D]} /></mesh>
      <mesh position={[ W/2, H/2, 0]} material={_mat.wall}><boxGeometry args={[2, H, D]} /></mesh>
      {/* Ceiling */}
      <mesh position={[0, H, 0]} material={_mat.ceiling}>
        <planeGeometry args={[W, D]} />
      </mesh>
    </group>
  )
}

// Pre-built room materials — created once at module load, never GC'd
const _roomFillMats = ROOMS.map(r => new THREE.MeshBasicMaterial({
  color: r.color, transparent: true, opacity: 0.08,
  side: THREE.BackSide, depthWrite: false,
}))
const _roomEdgeMats = ROOMS.map(r => new THREE.MeshBasicMaterial({
  color: r.color, transparent: true, opacity: 0.4, wireframe: true,
}))
const _roomGeos = ROOMS.map(r => new THREE.BoxGeometry(r.w, r.h, r.d))

/** Room outlines — color-coded wireframe boxes */
function PotatoRooms() {
  return (
    <group>
      {ROOMS.map((room, i) => (
        <group key={room.name} position={[room.x, room.h/2, room.z]}>
          <mesh material={_roomFillMats[i]} geometry={_roomGeos[i]} />
          <mesh material={_roomEdgeMats[i]} geometry={_roomGeos[i]} />
        </group>
      ))}
    </group>
  )
}

/** Single ambient directional light — replaces all point lights */
function PotatoLight() {
  return (
    <>
      <ambientLight intensity={0.8} color={0xffe8d0} />
      <directionalLight position={[50, 80, 30]} intensity={0.4} color={0xfff0e0} />
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

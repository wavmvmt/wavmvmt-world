'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Warehouse entrance system:
 * - Front entrance with automatic sliding doors
 * - Smart glass windows along walls (toggle tint)
 * - Doors open when player is within range
 * - Clear separation between indoor and outdoor zones
 */

/** Automatic sliding doors — open when player approaches */
let _fs_Warehous = 0
function SlidingDoor({ position, rotation = [0, 0, 0] }: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const leftRef = useRef<THREE.Mesh>(null)
  const rightRef = useRef<THREE.Mesh>(null)
  const playerRef = useRef({ x: 0, z: 0 })
  const openRef = useRef(0)

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerRef.current = { x, z }
    }
    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  useFrame(() => {
    if ((_fs_Warehous = (_fs_Warehous + 1) % 3) !== 0) return
    const dx = playerRef.current.x - position[0]
    const dz = playerRef.current.z - position[2]
    const dist = Math.sqrt(dx * dx + dz * dz)

    // Open when within 15 units
    const target = dist < 15 ? 1 : 0
    openRef.current += (target - openRef.current) * 0.05

    if (leftRef.current && rightRef.current) {
      const slide = openRef.current * 4.5
      leftRef.current.position.x = -slide
      rightRef.current.position.x = slide
    }
  })

  const doorH = 8
  const doorW = 4
  const doorD = 0.3

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      <group>
        {/* Top beam */}
        <mesh position={[0, doorH + 0.3, 0]}>
          <boxGeometry args={[doorW * 2 + 2, 0.6, doorD + 0.6]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Side posts */}
        {[-doorW - 0.5, doorW + 0.5].map((x, i) => (
          <mesh key={i} position={[x, doorH / 2, 0]}>
            <boxGeometry args={[0.4, doorH, doorD + 0.4]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Left door panel — slides left */}
      <mesh ref={leftRef} position={[0, doorH / 2, 0]}>
        <boxGeometry args={[doorW, doorH, doorD]} />
        <meshStandardMaterial
          color={COLORS.sky}
          transparent
          opacity={0.15}
          metalness={0.8}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right door panel — slides right */}
      <mesh ref={rightRef} position={[0, doorH / 2, 0]}>
        <boxGeometry args={[doorW, doorH, doorD]} />
        <meshStandardMaterial
          color={COLORS.sky}
          transparent
          opacity={0.15}
          metalness={0.8}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* WAVMVMT sign above door */}
      <Html position={[0, doorH + 2, 0]} center distanceFactor={30}>
        <div style={{
          color: '#f0c674',
          fontSize: '14px',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          letterSpacing: '0.3em',
          textShadow: '0 0 15px rgba(240,198,116,0.3)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          WAVMVMT
        </div>
      </Html>

      {/* Motion sensor indicator */}
      <pointLight
        color={COLORS.sage}
        intensity={0.3}
        distance={5}
        position={[0, doorH + 0.5, 1]}
      />
    </group>
  )
}

/** Smart glass window panels — electrochromic glass that can tint */
function SmartGlassWindow({ position, width, height, rotation = [0, 0, 0] }: {
  position: [number, number, number]
  width: number
  height: number
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Window frame */}
      <mesh position={[0, height / 2 + 2, 0]}>
        <boxGeometry args={[width + 0.4, height + 0.4, 0.15]} />
        <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glass pane — slightly transparent, reflective */}
      <mesh position={[0, height / 2 + 2, 0.05]}>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial
          color={0x88bbdd}
          transparent
          opacity={0.12}
          metalness={0.9}
          roughness={0.05}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Mullions (vertical dividers) */}
      {Array.from({ length: Math.floor(width / 4) - 1 }, (_, i) => {
        const x = -width / 2 + (i + 1) * (width / Math.floor(width / 4))
        return (
          <mesh key={i} position={[x, height / 2 + 2, 0.08]}>
            <boxGeometry args={[0.08, height, 0.08]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
          </mesh>
        )
      })}

      {/* Horizontal mullion */}
      <mesh position={[0, 2 + height * 0.4, 0.08]}>
        <boxGeometry args={[width, 0.08, 0.08]} />
        <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

export function WarehouseEntrance() {
  // Warehouse dimensions from roomConfig
  const W = 200 // total width
  const D = 140 // total depth
  const wallH = 12

  return (
    <group>
      {/* MAIN ENTRANCE — south wall, center */}
      <SlidingDoor position={[0, 0, D / 2]} rotation={[0, 0, 0]} />

      {/* SIDE ENTRANCE — east wall */}
      <SlidingDoor position={[W / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* BACK EXIT — north wall (to outdoor zone) */}
      <SlidingDoor position={[0, 0, -D / 2]} rotation={[0, Math.PI, 0]} />

      {/* SMART GLASS WINDOWS — south wall (flanking main entrance) */}
      <SmartGlassWindow position={[-25, 0, D / 2]} width={20} height={6} />
      <SmartGlassWindow position={[25, 0, D / 2]} width={20} height={6} />
      <SmartGlassWindow position={[-55, 0, D / 2]} width={15} height={5} />
      <SmartGlassWindow position={[55, 0, D / 2]} width={15} height={5} />

      {/* SMART GLASS WINDOWS — east wall */}
      <SmartGlassWindow position={[W / 2, 0, -30]} width={18} height={6} rotation={[0, -Math.PI / 2, 0]} />
      <SmartGlassWindow position={[W / 2, 0, 30]} width={18} height={6} rotation={[0, -Math.PI / 2, 0]} />

      {/* SMART GLASS WINDOWS — west wall */}
      <SmartGlassWindow position={[-W / 2, 0, -30]} width={18} height={6} rotation={[0, Math.PI / 2, 0]} />
      <SmartGlassWindow position={[-W / 2, 0, 30]} width={18} height={6} rotation={[0, Math.PI / 2, 0]} />

      {/* CLERESTORY WINDOWS — high up on all walls for natural light */}
      {[-W / 2, W / 2].map((x, i) => (
        <SmartGlassWindow key={`cl-${i}`}
          position={[x, wallH - 4, 0]}
          width={60} height={3}
          rotation={[0, i === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        />
      ))}

      {/* Entrance mat / welcome zone */}
      <mesh position={[0, 0.02, D / 2 - 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={0.15} roughness={0.95} />
      </mesh>

      {/* "ENTER" prompt near main door */}
      <Html position={[0, 1, D / 2 + 3]} center distanceFactor={20}>
        <div style={{
          color: 'rgba(255,220,180,0.2)',
          fontSize: '8px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          Walk through to enter
        </div>
      </Html>
    </group>
  )
}

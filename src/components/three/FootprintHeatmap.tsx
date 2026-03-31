'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GRID_SIZE = 40 // 40x40 grid
const CELL_SIZE = 5 // each cell = 5 units
const MAX_HEAT = 50

/**
 * Visitor footprint heatmap — shows where the player has spent
 * the most time. Warm colors = heavy traffic, cool = unexplored.
 *
 * Creates a subtle glowing grid on the floor that builds up
 * as you walk around. Encourages exploration by showing
 * which areas are still "cold" (unexplored).
 *
 * Toggle with H key.
 */
let _fs_Footprin = 0
export function FootprintHeatmap() {
  const meshRef = useRef<THREE.Mesh>(null)
  const heatData = useRef(new Float32Array(GRID_SIZE * GRID_SIZE).fill(0))
  const visible = useRef(false)

  // Toggle with H key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'h' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        visible.current = !visible.current
        if (meshRef.current) {
          meshRef.current.visible = visible.current
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Track player position
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      // Map world position to grid cell
      const gx = Math.floor((x + GRID_SIZE * CELL_SIZE / 2) / CELL_SIZE)
      const gz = Math.floor((z + GRID_SIZE * CELL_SIZE / 2) / CELL_SIZE)
      if (gx >= 0 && gx < GRID_SIZE && gz >= 0 && gz < GRID_SIZE) {
        const idx = gz * GRID_SIZE + gx
        heatData.current[idx] = Math.min(MAX_HEAT, heatData.current[idx] + 0.1)
      }
    }
    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      GRID_SIZE * CELL_SIZE,
      GRID_SIZE * CELL_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1
    )
    // Add color attribute
    const colors = new Float32Array(geo.attributes.position.count * 3)
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame(() => {
    if ((_fs_Footprin = (_fs_Footprin + 1) % 4) !== 0) return
    if (!meshRef.current || !visible.current) return
    const colors = geometry.attributes.color as THREE.BufferAttribute
    const arr = colors.array as Float32Array

    for (let i = 0; i < GRID_SIZE * GRID_SIZE && i < colors.count; i++) {
      const heat = heatData.current[i] / MAX_HEAT // 0-1

      // Cold (blue) → warm (gold) → hot (red)
      if (heat < 0.01) {
        arr[i * 3] = 0
        arr[i * 3 + 1] = 0
        arr[i * 3 + 2] = 0
      } else if (heat < 0.3) {
        arr[i * 3] = heat * 0.3
        arr[i * 3 + 1] = heat * 0.5
        arr[i * 3 + 2] = heat
      } else if (heat < 0.7) {
        arr[i * 3] = heat
        arr[i * 3 + 1] = heat * 0.8
        arr[i * 3 + 2] = (1 - heat) * 0.3
      } else {
        arr[i * 3] = 1
        arr[i * 3 + 1] = (1 - heat) * 0.5
        arr[i * 3 + 2] = 0
      }
    }
    colors.needsUpdate = true
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.15, 0]}
      visible={false}
    >
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'
import { QUESTS } from '@/lib/quests'

// Map quest IDs to target positions
function getQuestTarget(questId: number): { pos: [number, number, number]; name: string } | null {
  const q = QUESTS.find(q => q.id === questId)
  if (!q) return null

  const roomMap: Record<string, string> = {
    'Parkour Gym': 'Parkour Gym', 'Sound Bath': 'Sound Bath',
    'Music Studio': 'Music Studio', 'Cafe': 'Cafe & Lounge',
    'Front Desk': 'Front Desk', 'Yoga': 'Yoga Room',
    'Weight': 'Weight Training', 'Amphitheatre': 'Amphitheatre',
    'Photo Studio': 'Photo Studio', 'Video Studio': 'Video Studio',
    'Recovery': 'Recovery Suite', 'Spa': 'Spa & Wellness',
    'Education': 'Education Wing',
  }

  for (const [keyword, roomName] of Object.entries(roomMap)) {
    if (q.instruction.includes(keyword) || q.title.includes(keyword)) {
      const room = ROOMS.find(r => r.name === roomName)
      if (room) return { pos: [room.x, 0.1, room.z], name: q.title }
    }
  }

  // Default: point to front desk for generic quests
  return { pos: [0, 0.1, 130], name: q.title }
}

const TRAIL_COUNT = 50
const ARROW_SPACING = 4

/**
 * Animated trail of arrows leading from player to quest target.
 * Arrows flow toward the destination, pulse with proximity, and
 * show the quest name as a floating label at the midpoint.
 */
export function QuestPath() {
  const trailRef = useRef<THREE.Points>(null)
  const arrowGroupRef = useRef<THREE.Group>(null)
  const positions = useRef(new Float32Array(TRAIL_COUNT * 3))
  const sizes = useRef(new Float32Array(TRAIL_COUNT))
  const playerPos = useRef({ x: 0, z: 0 })
  const [currentQuest, setCurrentQuest] = useState(1)
  const [questTitle, setQuestTitle] = useState('')

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', onMove as EventListener)

    const interval = setInterval(() => {
      const completed = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]') as number[]
      const next = QUESTS.find(q => !completed.includes(q.id))
      if (next) {
        setCurrentQuest(next.id)
        setQuestTitle(next.title)
      }
    }, 2000)

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      clearInterval(interval)
    }
  }, [])

  useFrame((state) => {
    if (!trailRef.current) return
    const target = getQuestTarget(currentQuest)
    const mat = trailRef.current.material as THREE.PointsMaterial

    if (!target) {
      mat.opacity = 0
      return
    }

    const px = playerPos.current.x
    const pz = playerPos.current.z
    const tx = target.pos[0]
    const tz = target.pos[2]
    const dist = Math.sqrt((px - tx) ** 2 + (pz - tz) ** 2)

    // Hide when very close
    if (dist < 12) {
      mat.opacity = 0
      return
    }

    const pos = positions.current
    const sz = sizes.current
    const t = state.clock.elapsedTime

    // Direction vector
    const dx = tx - px
    const dz = tz - pz
    const len = Math.sqrt(dx * dx + dz * dz)
    const dirX = dx / len
    const dirZ = dz / len

    // Trail length — cap at 80 units or actual distance
    const trailLen = Math.min(dist - 5, 80)

    for (let i = 0; i < TRAIL_COUNT; i++) {
      // Each dot is evenly spaced along the trail, with a flowing animation
      const baseProgress = i / TRAIL_COUNT
      const flowOffset = ((t * 0.5) % 1)
      const progress = ((baseProgress + flowOffset) % 1) * trailLen

      pos[i * 3] = px + dirX * progress
      pos[i * 3 + 1] = 0.2 + Math.sin(t * 3 + i * 0.4) * 0.08
      pos[i * 3 + 2] = pz + dirZ * progress

      // Size: larger dots near the front (closer to target), smaller near player
      const frontness = baseProgress
      sz[i] = 0.3 + frontness * 0.5

      // Fade dots at the edges
      const edgeFade = Math.min(baseProgress * 5, (1 - baseProgress) * 5, 1)
      sz[i] *= edgeFade
    }

    const posAttr = trailRef.current.geometry.attributes.position as THREE.BufferAttribute
    posAttr.needsUpdate = true
    const sizeAttr = trailRef.current.geometry.attributes.size as THREE.BufferAttribute
    sizeAttr.needsUpdate = true

    // Brightness — much more visible now that dog leads the way
    const proximity = Math.max(0, 1 - dist / 200)
    mat.opacity = 0.45 + proximity * 0.3 + Math.sin(t * 2) * 0.08
    mat.size = 0.8

    // Update arrow indicators (3 chevrons pointing toward target)
    if (arrowGroupRef.current) {
      arrowGroupRef.current.position.set(
        px + dirX * 8,
        0.3,
        pz + dirZ * 8,
      )
      arrowGroupRef.current.rotation.y = -Math.atan2(dirZ, dirX) + Math.PI / 2
      arrowGroupRef.current.visible = dist > 12
    }
  })

  return (
    <group>
      {/* Flowing dot trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={TRAIL_COUNT} />
          <bufferAttribute attach="attributes-size" args={[sizes.current, 1]} count={TRAIL_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          color={0xf0c674}
          size={0.5}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Directional chevrons — 5 arrows pointing toward target, brighter */}
      <group ref={arrowGroupRef}>
        {[0, 1.8, 3.6, 5.4, 7.2].map((offset, i) => (
          <mesh key={i} position={[0, 0.05, -offset]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.8 - i * 0.08, 1.5, 3]} />
            <meshBasicMaterial
              color={0xf0c674}
              transparent
              opacity={0.6 - i * 0.1}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

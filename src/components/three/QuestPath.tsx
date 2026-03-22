'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'
import { QUESTS } from '@/lib/quests'

// Map quest IDs to target positions
function getQuestTarget(questId: number): [number, number, number] | null {
  const q = QUESTS.find(q => q.id === questId)
  if (!q) return null

  // Room-based quests
  const roomMap: Record<string, string> = {
    'Parkour Gym': 'Parkour Gym', 'Sound Bath': 'Sound Bath',
    'Music Studio': 'Music Studio', 'Cafe': 'Cafe & Lounge',
    'Front Desk': 'Front Desk', 'Yoga': 'Yoga Room',
    'Weight': 'Weight Training', 'Amphitheatre': 'Amphitheatre',
    'Photo Studio': 'Photo Studio', 'Video Studio': 'Video Studio',
    'Recovery': 'Recovery Suite', 'Spa': 'Spa & Wellness',
  }

  for (const [keyword, roomName] of Object.entries(roomMap)) {
    if (q.instruction.includes(keyword) || q.title.includes(keyword)) {
      const room = ROOMS.find(r => r.name === roomName)
      if (room) return [room.x, 0.1, room.z]
    }
  }

  return null
}

/**
 * Glowing path on the floor leading to the current quest target.
 * Creates a series of dots from player position toward the goal.
 */
export function QuestPath() {
  const pointsRef = useRef<THREE.Points>(null)
  const DOT_COUNT = 30
  const positions = useRef(new Float32Array(DOT_COUNT * 3))
  const playerPos = useRef({ x: 0, z: 0 })
  const [currentQuest, setCurrentQuest] = useState(1)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', onMove as EventListener)

    // Check current quest
    const interval = setInterval(() => {
      const completed = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]') as number[]
      const next = QUESTS.find(q => !completed.includes(q.id))
      if (next) setCurrentQuest(next.id)
    }, 3000)

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      clearInterval(interval)
    }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const target = getQuestTarget(currentQuest)
    if (!target) {
      // No target — hide dots
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = 0
      return
    }

    const px = playerPos.current.x
    const pz = playerPos.current.z
    const dist = Math.sqrt((px - target[0]) ** 2 + (pz - target[2]) ** 2)

    // Don't show if already close
    if (dist < 15) {
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = 0
      return
    }

    const pos = positions.current
    const t = state.clock.elapsedTime

    for (let i = 0; i < DOT_COUNT; i++) {
      const progress = i / DOT_COUNT
      // Animate dots flowing toward target
      const animOffset = ((t * 0.3 + progress) % 1)
      const p = Math.min(1, animOffset)

      pos[i * 3] = px + (target[0] - px) * p
      pos[i * 3 + 1] = 0.15 + Math.sin(t * 2 + i * 0.5) * 0.05
      pos[i * 3 + 2] = pz + (target[2] - pz) * p
    }

    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    attr.needsUpdate = true

    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = 0.3 + Math.sin(t) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={DOT_COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={0xf0c674}
        size={0.4}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

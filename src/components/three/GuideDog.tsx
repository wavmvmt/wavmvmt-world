'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { ROOMS } from '@/lib/roomConfig'
import { QUESTS } from '@/lib/quests'
import { COLORS } from '@/lib/roomConfig'

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
      if (room) return { pos: [room.x, 0, room.z], name: q.title }
    }
  }
  return { pos: [0, 0, 130], name: q.title }
}

/**
 * A cute guide dog (simplified Shiba Inu) that runs ahead of the player
 * toward the current quest target. Pauses and looks back if the player
 * falls behind. Sits down when at the destination.
 */
let _fs_GuideDog = 0
export function GuideDog() {
  const groupRef = useRef<THREE.Group>(null)
  const playerPos = useRef({ x: 0, z: 0 })
  const dogPos = useRef({ x: 5, z: 15 })
  const dogRotY = useRef(0)
  const legPhase = useRef(0)
  const tailPhase = useRef(0)
  const [currentQuest, setCurrentQuest] = useState(1)
  const [sitting, setSitting] = useState(false)
  const [lookingBack, setLookingBack] = useState(false)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', onMove as EventListener)

    const interval = setInterval(() => {
      const completed = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]') as number[]
      const next = QUESTS.find(q => !completed.includes(q.id))
      if (next) setCurrentQuest(next.id)
    }, 2000)

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      clearInterval(interval)
    }
  }, [])

  useFrame((state, delta) => {
    if ((_fs_GuideDog = (_fs_GuideDog + 1) % 2) !== 0) return
    if (!groupRef.current) return
    const target = getQuestTarget(currentQuest)
    if (!target) return

    const px = playerPos.current.x
    const pz = playerPos.current.z
    const tx = target.pos[0]
    const tz = target.pos[2]

    // Dog should be between player and target, about 12-18 units ahead
    const distToTarget = Math.sqrt((px - tx) ** 2 + (pz - tz) ** 2)
    const distPlayerToDog = Math.sqrt((px - dogPos.current.x) ** 2 + (pz - dogPos.current.z) ** 2)

    // Direction from player to target
    const dirX = (tx - px) / (distToTarget || 1)
    const dirZ = (tz - pz) / (distToTarget || 1)

    // Target position for dog: 15 units ahead of player toward quest
    const dogTargetX = px + dirX * Math.min(15, distToTarget * 0.4)
    const dogTargetZ = pz + dirZ * Math.min(15, distToTarget * 0.4)

    // At destination?
    const atDest = distToTarget < 15
    setSitting(atDest)

    // Player too far behind?
    const playerFarBehind = distPlayerToDog > 25
    setLookingBack(playerFarBehind)

    // Move dog toward its target position
    const speed = atDest ? 0 : playerFarBehind ? 0.5 : 3
    const dx = dogTargetX - dogPos.current.x
    const dz = dogTargetZ - dogPos.current.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist > 0.5 && !atDest) {
      const moveX = (dx / dist) * speed * delta
      const moveZ = (dz / dist) * speed * delta
      dogPos.current.x += moveX
      dogPos.current.z += moveZ

      // Face movement direction (or face player if looking back)
      if (playerFarBehind) {
        const toPlayerAngle = Math.atan2(px - dogPos.current.x, pz - dogPos.current.z)
        dogRotY.current += (toPlayerAngle - dogRotY.current) * 0.05
      } else {
        const moveAngle = Math.atan2(moveX, moveZ)
        dogRotY.current += (moveAngle - dogRotY.current) * 0.08
      }

      // Leg animation
      legPhase.current += delta * (speed > 1 ? 12 : 6)
    }

    // Tail always wags
    tailPhase.current += delta * 8

    // Update group
    groupRef.current.position.set(dogPos.current.x, 0, dogPos.current.z)
    groupRef.current.rotation.y = dogRotY.current
  })

  const legSwing = Math.sin(legPhase.current) * 0.4
  const tailWag = Math.sin(tailPhase.current) * 0.5

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.8, 0.7, 1.4]} />
        <meshLambertMaterial color={0xd4a050} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.7, sitting ? 0.5 : 0.8]}>
        <boxGeometry args={[0.65, 0.6, 0.6]} />
        <meshLambertMaterial color={0xd4a050} />
      </mesh>

      {/* Snout */}
      <mesh position={[0, 1.55, sitting ? 0.85 : 1.15]}>
        <boxGeometry args={[0.35, 0.3, 0.3]} />
        <meshLambertMaterial color={0xf0e0c0} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.6, sitting ? 1.02 : 1.32]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshLambertMaterial color={0x201010} />
      </mesh>

      {/* Eyes */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 1.78, sitting ? 0.78 : 1.08]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshLambertMaterial color={0x201510} />
        </mesh>
      ))}

      {/* Ears — pointed like Shiba */}
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={`ear-${i}`} position={[x, 2.05, sitting ? 0.5 : 0.8]} rotation={[0.2, x > 0 ? 0.2 : -0.2, 0]}>
          <coneGeometry args={[0.12, 0.3, 3]} />
          <meshLambertMaterial color={0xc09040} />
        </mesh>
      ))}

      {/* Legs */}
      {[[-0.25, -0.5], [0.25, -0.5], [-0.25, 0.5], [0.25, 0.5]].map(([x, z], i) => (
        <mesh key={`leg-${i}`}
          position={[x, sitting ? 0.3 : 0.4, z]}
          rotation={[sitting ? -0.8 : (i < 2 ? legSwing : -legSwing), 0, 0]}
        >
          <cylinderGeometry args={[0.1, 0.08, sitting ? 0.5 : 0.8, 6]} />
          <meshLambertMaterial color={0xd4a050} />
        </mesh>
      ))}

      {/* Tail — curled up like Shiba */}
      <mesh position={[0, 1.6, -0.8]} rotation={[tailWag, 0, -0.5]}>
        <cylinderGeometry args={[0.06, 0.04, 0.6, 6]} />
        <meshLambertMaterial color={0xf0e0c0} />
      </mesh>

      {/* Speech bubble when looking back */}
      {lookingBack && (
        <Html position={[0, 2.5, 0]} center distanceFactor={15}>
          <div style={{
            background: 'rgba(26,21,32,0.85)',
            border: '1px solid rgba(240,198,116,0.2)',
            borderRadius: '8px',
            padding: '3px 8px',
            fontSize: '10px',
            color: '#f0c674',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            This way! 🐾
          </div>
        </Html>
      )}

      {/* Sitting indicator */}
      {sitting && (
        <Html position={[0, 2.3, 0]} center distanceFactor={15}>
          <div style={{
            background: 'rgba(26,21,32,0.85)',
            border: '1px solid rgba(128,212,168,0.2)',
            borderRadius: '8px',
            padding: '3px 8px',
            fontSize: '10px',
            color: '#80d4a8',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            You made it! 🎉
          </div>
        </Html>
      )}

      {/* Subtle glow under dog for visibility */}
      <pointLight position={[0, 0.5, 0]} color={COLORS.gold} intensity={0.3} distance={5} decay={2} />
    </group>
  )
}

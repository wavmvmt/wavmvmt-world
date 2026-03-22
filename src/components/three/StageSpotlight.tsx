'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Amphitheatre stage spotlight — follows the player when they're on stage.
 * Amphitheatre is at x:0, z:-105. Stage is in the front half.
 */
export function StageSpotlight() {
  const spotRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)
  const onStageRef = useRef(false)
  const playerPos = useRef({ x: 0, z: 0 })

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  useFrame(() => {
    const px = playerPos.current.x
    const pz = playerPos.current.z

    // Stage area: roughly x: -17 to 17, z: -122 to -110 (front of amphitheatre)
    const onStage = px > -20 && px < 20 && pz > -125 && pz < -98

    if (onStage !== onStageRef.current) {
      onStageRef.current = onStage
    }

    if (spotRef.current && targetRef.current) {
      if (onStage) {
        // Follow player on stage
        targetRef.current.position.set(px, 0, pz)
        spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, 3, 0.05)
      } else {
        // Dim when player not on stage — point at center stage
        targetRef.current.position.set(0, 0, -112)
        spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, 0.2, 0.05)
      }
    }
  })

  return (
    <group>
      {/* Spot light target */}
      <object3D ref={targetRef} position={[0, 0, -112]} />

      {/* Main spotlight from above */}
      <spotLight
        ref={spotRef}
        position={[0, 35, -105]}
        intensity={0.2}
        color={0xfff0d0}
        angle={0.3}
        penumbra={0.6}
        distance={50}
        decay={1.5}
        target={targetRef.current ?? undefined}
      />

      {/* Stage edge lights — always on, dim */}
      {[-15, -7, 0, 7, 15].map((x, i) => (
        <pointLight
          key={i}
          position={[x, 0.5, -117]}
          intensity={0.15}
          color={[COLORS.rose, COLORS.lavender, COLORS.gold, COLORS.sage, COLORS.sky][i]}
          distance={8}
          decay={2}
        />
      ))}
    </group>
  )
}

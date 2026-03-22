'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Drone/cinematic camera mode.
 * Press C to toggle. Camera orbits the warehouse slowly,
 * showing the full construction site from above.
 */
export function DroneCamera() {
  const [active, setActive] = useState(false)
  const { camera } = useThree()
  const savedPos = useRef(new THREE.Vector3())
  const savedLookAt = useRef(new THREE.Vector3())
  const phaseRef = useRef(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        setActive(prev => {
          if (!prev) {
            // Save current camera state
            savedPos.current.copy(camera.position)
            phaseRef.current = 0
          }
          return !prev
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [camera])

  useFrame((state, delta) => {
    if (!active) return
    phaseRef.current += delta * 0.15

    const t = phaseRef.current
    const radius = 200
    const height = 80 + Math.sin(t * 0.3) * 20

    // Slow orbit around the center
    camera.position.set(
      Math.cos(t) * radius,
      height,
      Math.sin(t) * radius
    )
    camera.lookAt(0, 5, -20)
  })

  return null
}

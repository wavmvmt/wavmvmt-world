'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Cinematic intro flyover when entering the world.
 * Camera sweeps across the warehouse before giving control to the player.
 * Duration: 6 seconds.
 */
export function IntroFlyover() {
  const [active, setActive] = useState(true)
  const { camera } = useThree()
  const phaseRef = useRef(0)
  const DURATION = 6

  useEffect(() => {
    // Skip intro if returning visitor
    if (sessionStorage.getItem('wavmvmt_intro_done')) {
      setActive(false)
    }
  }, [])

  useFrame((_, delta) => {
    if (!active) return
    phaseRef.current += delta
    const t = phaseRef.current / DURATION // 0 → 1

    if (t >= 1) {
      setActive(false)
      sessionStorage.setItem('wavmvmt_intro_done', 'true')
      return
    }

    // Smooth ease-in-out
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    // Camera path: high wide shot → swooping down to player start
    const startPos = new THREE.Vector3(200, 120, 150)
    const endPos = new THREE.Vector3(0, 8, 80)
    const lookTarget = new THREE.Vector3(0, 5, -20)

    camera.position.lerpVectors(startPos, endPos, ease)
    camera.lookAt(
      lookTarget.x + Math.sin(t * Math.PI) * 30,
      lookTarget.y + (1 - ease) * 40,
      lookTarget.z
    )
  })

  return null
}

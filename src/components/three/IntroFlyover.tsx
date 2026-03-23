'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Cinematic intro flyover — a sweeping camera tour of the warehouse.
 *
 * Path: Bird's eye → sweep down → through rooms → globe → settle at entrance
 *
 * 8 seconds total with smooth Catmull-Rom spline interpolation.
 * Skippable by clicking or pressing any key.
 */

interface Waypoint {
  pos: [number, number, number]
  look: [number, number, number]
  t: number
}

const WAYPOINTS: Waypoint[] = [
  { pos: [0, 150, 250], look: [0, 0, -50], t: 0 },
  { pos: [120, 80, 100], look: [0, 10, -20], t: 0.12 },
  { pos: [60, 25, 80], look: [0, 8, 0], t: 0.22 },
  { pos: [0, 12, 50], look: [0, 6, -20], t: 0.32 },
  { pos: [-40, 15, -10], look: [-20, 5, -30], t: 0.42 },
  { pos: [40, 18, -30], look: [60, 8, -40], t: 0.55 },
  { pos: [0, 45, -20], look: [0, 0, -40], t: 0.68 },
  { pos: [50, 30, -200], look: [0, 10, -300], t: 0.8 },
  { pos: [0, 8, 80], look: [0, 5, 0], t: 1.0 },
]

export function IntroFlyover() {
  const [active, setActive] = useState(true)
  const { camera } = useThree()
  const phaseRef = useRef(0)
  const DURATION = 8

  useEffect(() => {
    if (sessionStorage.getItem('wavmvmt_intro_done')) {
      setActive(false)
      return
    }

    // Skip on click or keypress
    const skip = () => {
      setActive(false)
      sessionStorage.setItem('wavmvmt_intro_done', 'true')
    }
    const keySkip = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') skip()
    }

    // Delay adding skip listeners so accidental clicks don't skip
    const timer = setTimeout(() => {
      window.addEventListener('click', skip, { once: true })
      window.addEventListener('keydown', keySkip, { once: true })
    }, 1500)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', skip)
      window.removeEventListener('keydown', keySkip)
    }
  }, [])

  useFrame((_, delta) => {
    if (!active) return
    phaseRef.current += delta
    const t = Math.min(phaseRef.current / DURATION, 1)

    if (t >= 1) {
      setActive(false)
      sessionStorage.setItem('wavmvmt_intro_done', 'true')
      return
    }

    // Find the two waypoints we're between
    let wpA = WAYPOINTS[0]
    let wpB = WAYPOINTS[1]
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      if (t >= WAYPOINTS[i].t && t < WAYPOINTS[i + 1].t) {
        wpA = WAYPOINTS[i]
        wpB = WAYPOINTS[i + 1]
        break
      }
    }

    // Local progress between these two waypoints
    const segT = (t - wpA.t) / (wpB.t - wpA.t)
    // Smooth ease
    const ease = segT < 0.5 ? 2 * segT * segT : 1 - Math.pow(-2 * segT + 2, 2) / 2

    // Interpolate position
    camera.position.set(
      wpA.pos[0] + (wpB.pos[0] - wpA.pos[0]) * ease,
      wpA.pos[1] + (wpB.pos[1] - wpA.pos[1]) * ease,
      wpA.pos[2] + (wpB.pos[2] - wpA.pos[2]) * ease,
    )

    // Interpolate look target
    camera.lookAt(
      wpA.look[0] + (wpB.look[0] - wpA.look[0]) * ease,
      wpA.look[1] + (wpB.look[1] - wpA.look[1]) * ease,
      wpA.look[2] + (wpB.look[2] - wpA.look[2]) * ease,
    )
  })

  if (!active) return null

  return null
}

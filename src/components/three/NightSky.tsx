'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { detectPerformanceLevel } from '@/lib/performanceMode'
const _level = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'
const STAR_COUNT = _level === 'low' ? 80 : _level === 'medium' ? 200 : 400
const BRIGHT_STAR_COUNT = _level === 'low' ? 8 : _level === 'medium' ? 15 : 30

/**
 * Multi-layer night sky visible through skylights.
 * Layer 1: Dense small stars (white, faint)
 * Layer 2: Bright colored stars (gold/blue, larger, twinkle more)
 * Only visible during night phase of day/night cycle.
 */
export function NightSky() {
  const starsRef = useRef<THREE.Points>(null)
  const brightRef = useRef<THREE.Points>(null)

  const stars = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.35
      const r = 200 + Math.random() * 200
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = 60 + r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  const brightStars = useMemo(() => {
    const pos = new Float32Array(BRIGHT_STAR_COUNT * 3)
    const phases: number[] = []
    for (let i = 0; i < BRIGHT_STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.3
      const r = 180 + Math.random() * 150
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = 70 + r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      phases.push(Math.random() * Math.PI * 2)
    }
    return { positions: pos, phases }
  }, [])

  const frameSkip = useRef(0)
  useFrame((state) => {
    frameSkip.current = (frameSkip.current + 1) % 4
    if (frameSkip.current !== 0) return  // Twinkle update ~15fps
    const t = state.clock.elapsedTime
    const cycle = (t % 300) / 300
    const isNight = cycle > 0.4 && cycle < 0.85
    const nightIntensity = isNight
      ? Math.min(1, Math.min(cycle - 0.4, 0.85 - cycle) * 10)
      : 0

    if (starsRef.current) {
      const mat = starsRef.current.material as THREE.PointsMaterial
      mat.opacity = nightIntensity * 0.6
    }

    if (brightRef.current) {
      const mat = brightRef.current.material as THREE.PointsMaterial
      // Twinkle bright stars
      mat.opacity = nightIntensity * (0.6 + Math.sin(t * 1.5) * 0.2)
      mat.size = 1.5 + Math.sin(t * 0.8) * 0.3
    }
  })

  return (
    <group>
      {/* Dense small stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} count={STAR_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          color={0xeeeeff}
          size={0.5}
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Bright colored stars */}
      <points ref={brightRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[brightStars.positions, 3]} count={BRIGHT_STAR_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          color={0xffd080}
          size={1.5}
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

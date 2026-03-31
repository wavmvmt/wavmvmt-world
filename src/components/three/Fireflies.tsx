'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '@/lib/accessibility'

const COUNT = 30

/**
 * Fireflies that appear during the night cycle.
 * Small yellow-green glowing dots that drift lazily.
 */
let _fs_Fireflie = 0
export function Fireflies() {
  if (prefersReducedMotion()) return null
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, data } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const d = []
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 300
      pos[i * 3 + 1] = 1 + Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 250
      d.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        radius: 2 + Math.random() * 4,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: 1 + Math.random() * 2,
        baseX: pos[i * 3],
        baseZ: pos[i * 3 + 2],
      })
    }
    return { positions: pos, data: d }
  }, [])

  const _fsFly = useRef(0)
  useFrame((state) => {
    _fsFly.current = (_fsFly.current + 1) % 3
    if (_fsFly.current !== 0) return
    if ((_fs_Fireflie = (_fs_Fireflie + 1) % 3) !== 0) return
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime

    // Only visible at night (40-85% of 5-min cycle)
    const cycle = (t % 300) / 300
    const isNight = cycle > 0.4 && cycle < 0.85
    const nightFade = isNight ? Math.min(1, Math.min(cycle - 0.4, 0.85 - cycle) * 10) : 0

    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = nightFade * 0.8

    if (nightFade <= 0) return

    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const d = data[i]
      // Lazy circular drift
      arr[i * 3] = d.baseX + Math.sin(t * d.speed + d.phase) * d.radius
      arr[i * 3 + 1] = 2 + Math.sin(t * d.speed * 0.7 + d.phase) * 2
      arr[i * 3 + 2] = d.baseZ + Math.cos(t * d.speed * 0.8 + d.phase) * d.radius

      // Blink
      const blink = Math.sin(t * d.blinkSpeed + d.blinkPhase)
      // Size varies with blink
      mat.size = 0.4 + Math.max(0, blink) * 0.3
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={0xaaff44}
        size={0.5}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * ATMOSPHERIC EFFECTS — the final layer of visual magic
 *
 * 1. Volumetric fog planes at different heights
 * 2. Constellation particles (stars that form shapes)
 * 3. Sweeping searchlights from the cranes
 * 4. Ambient floating orbs (will-o-wisps)
 */

/** Layered fog planes at different heights — creates depth */
let _fs_Atmosphe = 0
function VolumetricFog() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if ((_fs_Atmosphe = (_fs_Atmosphe + 1) % 4) !== 0) return
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      // Slow drift
      const mesh = child as THREE.Mesh
      mesh.position.x = Math.sin(t * 0.02 + i * 2) * 20
      mesh.position.z = Math.cos(t * 0.015 + i * 3) * 15
    })
  })

  return (
    <group ref={ref}>
      {[4, 8, 12, 18, 25].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[300, 200]} />
          <meshBasicMaterial
            color={i < 3 ? COLORS.gold : COLORS.sage}
            transparent
            opacity={0.006 - i * 0.0008}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Sweeping searchlights from the crane positions */
function CraneSearchlights() {
  const light1Ref = useRef<THREE.SpotLight>(null)
  const light2Ref = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (light1Ref.current) {
      const target = light1Ref.current.target
      target.position.set(
        Math.sin(t * 0.15) * 80,
        0,
        Math.cos(t * 0.15) * 60 - 40
      )
      target.updateMatrixWorld()
    }
    if (light2Ref.current) {
      const target = light2Ref.current.target
      target.position.set(
        Math.cos(t * 0.12 + 1) * 70,
        0,
        Math.sin(t * 0.12 + 1) * 50 - 60
      )
      target.updateMatrixWorld()
    }
  })

  return (
    <group>
      <spotLight
        ref={light1Ref}
        position={[-110, 60, -80]}
        color={COLORS.cream}
        intensity={0.15}
        angle={0.15}
        penumbra={0.8}
        distance={200}
        castShadow={false}
      />
      <spotLight
        ref={light2Ref}
        position={[120, 60, -200]}
        color={COLORS.sage}
        intensity={0.1}
        angle={0.12}
        penumbra={0.9}
        distance={180}
        castShadow={false}
      />
    </group>
  )
}

/** Floating orbs — will-o-wisps that drift through the warehouse */
function FloatingOrbs() {
  const COUNT = 15
  const ref = useRef<THREE.Group>(null)

  const orbs = useMemo(() => {
    return Array.from({ length: COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 160,
      y: 3 + Math.random() * 12,
      z: (Math.random() - 0.5) * 120,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      color: [COLORS.gold, COLORS.sage, COLORS.sky, COLORS.rose, COLORS.lavender][i % 5],
      size: 0.3 + Math.random() * 0.5,
    }))
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      const orb = orbs[i]
      if (!orb) return
      const mesh = child as THREE.Mesh
      mesh.position.set(
        orb.x + Math.sin(t * orb.speed + orb.phase) * 10,
        orb.y + Math.sin(t * orb.speed * 1.5 + orb.phase) * 2,
        orb.z + Math.cos(t * orb.speed * 0.8 + orb.phase) * 8,
      )
      // Pulse
      const pulse = 1 + Math.sin(t * 2 + orb.phase) * 0.3
      mesh.scale.setScalar(pulse)
    })
  })

  return (
    <group ref={ref}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={[orb.x, orb.y, orb.z]}>
          <sphereGeometry args={[orb.size, 8, 8]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** High-altitude star field — visible through the warehouse skylights */
function StarField() {
  const COUNT = 500
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      // Distribute on a sphere shell at distance 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.4 // only upper hemisphere
      const r = 380 + Math.random() * 40
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi) + 50 // above the warehouse
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    // Very slow rotation
    ref.current.rotation.y = state.clock.elapsedTime * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={0xffffff}
        size={0.8}
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function AtmosphericEffects() {
  return (
    <group>
      <VolumetricFog />
      <CraneSearchlights />
      <FloatingOrbs />
      <StarField />
    </group>
  )
}

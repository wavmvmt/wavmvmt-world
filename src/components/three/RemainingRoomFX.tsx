'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'
import { audioManager } from '@/lib/audioManager'

/**
 * Yoga Room — ambient music shifts to calming tone when player enters.
 * Yoga Room at x:-190, z:-35
 */
function YogaRoomAmbience() {
  const playerNear = useRef(false)
  const activeRef = useRef(false)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerNear.current = Math.abs(x + 190) < 35 && Math.abs(z + 35) < 35
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      if (oscRef.current) { try { oscRef.current.stop() } catch { /* stopped */ } }
    }
  }, [])

  useFrame(() => {
    if (playerNear.current && !activeRef.current) {
      activeRef.current = true
      audioManager.init()
      const ctx = audioManager.getContext()
      const ambientGain = audioManager.getCategoryGain('ambient')
      if (!ctx || !ambientGain) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 174 // Solfeggio healing frequency
      const gain = ctx.createGain()
      gain.gain.value = 0
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)
      osc.connect(gain)
      gain.connect(ambientGain)
      osc.start()
      oscRef.current = osc
      gainRef.current = gain
    }
    if (!playerNear.current && activeRef.current) {
      activeRef.current = false
      const ctx = audioManager.getContext()
      if (gainRef.current && ctx) {
        gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
        const osc = oscRef.current
        setTimeout(() => { try { osc?.stop() } catch { /* stopped */ } }, 1200)
      }
    }
  })

  // Visual: soft glow orbs floating in the yoga room
  return (
    <group position={[-190, 3, -35]}>
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 12, 2 + Math.sin(i) * 2, Math.sin(angle) * 12]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color={COLORS.gold} transparent opacity={0.08} />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * Recovery Suite — steam particles rise from sauna/plunge areas.
 * Recovery Suite at x:-100, z:-190
 */
function RecoverySteam() {
  const pointsRef = useRef<THREE.Points>(null)
  const COUNT = 40

  const positions = useRef(new Float32Array(COUNT * 3))
  const speeds = useRef<{ y: number; drift: number; life: number }[]>([])

  useEffect(() => {
    for (let i = 0; i < COUNT; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 20
      positions.current[i * 3 + 1] = Math.random() * 5
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 15
      speeds.current.push({
        y: 0.01 + Math.random() * 0.02,
        drift: Math.random() * Math.PI * 2,
        life: Math.random(),
      })
    }
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const s = speeds.current[i]
      if (!s) continue
      arr[i * 3] += Math.sin(s.drift + state.clock.elapsedTime * 0.3) * 0.005
      arr[i * 3 + 1] += s.y
      s.drift += delta * 0.2

      if (arr[i * 3 + 1] > 8) {
        arr[i * 3] = (Math.random() - 0.5) * 20
        arr[i * 3 + 1] = 0
        arr[i * 3 + 2] = (Math.random() - 0.5) * 15
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={[-100, 1, -190]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={COUNT} />
      </bufferGeometry>
      <pointsMaterial
        color={0xddddee}
        size={0.6}
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * Spa & Wellness — massage table with subtle glow.
 * Spa at x:100, z:-190
 */
function SpaMassageTable() {
  return (
    <group position={[100, 0, -190]}>
      {/* 4 massage tables in a row */}
      {[-8, -3, 3, 8].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Table surface */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1.5, 0.15, 3]} />
            <meshStandardMaterial color={0xf0e8d8} roughness={0.9} />
          </mesh>
          {/* Legs */}
          {[[-0.6, -1.2], [0.6, -1.2], [-0.6, 1.2], [0.6, 1.2]].map(([lx, lz], j) => (
            <mesh key={j} position={[lx, 0.5, lz]}>
              <cylinderGeometry args={[0.04, 0.04, 1, 4]} />
              <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
            </mesh>
          ))}
          {/* Pillow */}
          <mesh position={[0, 1.12, -1.1]}>
            <boxGeometry args={[0.6, 0.1, 0.4]} />
            <meshStandardMaterial color={0xffffff} roughness={0.95} />
          </mesh>
          {/* Soft glow */}
          <pointLight position={[0, 2, 0]} intensity={0.1} color={COLORS.gold} distance={5} decay={2} />
        </group>
      ))}
    </group>
  )
}

export function RemainingRoomFX() {
  return (
    <group>
      <YogaRoomAmbience />
      <RecoverySteam />
      <SpaMassageTable />
    </group>
  )
}

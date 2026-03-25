'use client'

import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'
import { audioManager } from '@/lib/audioManager'

const BOWL_NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88] // C D E F G A B
const BOWL_COLORS = [COLORS.gold, COLORS.amber, COLORS.rose, COLORS.lavender, COLORS.sage, COLORS.sky, COLORS.gold]

function SingingBowl({ position, note, color, index }: {
  position: [number, number, number]; note: number; color: number; index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef(0)
  const playBowl = useCallback(() => {
    audioManager.init()
    const ctx = audioManager.getContext()
    const sfxGain = audioManager.getCategoryGain('sfx')
    if (!ctx || !sfxGain) return
    const now = ctx.currentTime

    // Singing bowl — long resonant sine with harmonics
    const fundamental = ctx.createOscillator()
    fundamental.type = 'sine'
    fundamental.frequency.value = note

    const harmonic2 = ctx.createOscillator()
    harmonic2.type = 'sine'
    harmonic2.frequency.value = note * 2.01

    const harmonic3 = ctx.createOscillator()
    harmonic3.type = 'sine'
    harmonic3.frequency.value = note * 3.02

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.15, now)
    env.gain.exponentialRampToValueAtTime(0.08, now + 0.5)
    env.gain.exponentialRampToValueAtTime(0.001, now + 4)

    const env2 = ctx.createGain()
    env2.gain.setValueAtTime(0.05, now)
    env2.gain.exponentialRampToValueAtTime(0.001, now + 3)

    fundamental.connect(env)
    harmonic2.connect(env2)
    harmonic3.connect(env2)
    env.connect(sfxGain)
    env2.connect(sfxGain)

    fundamental.start(now)
    harmonic2.start(now)
    harmonic3.start(now)
    fundamental.stop(now + 4.5)
    harmonic2.stop(now + 3.5)
    harmonic3.stop(now + 3)

    glowRef.current = 2
  }, [note])

  useFrame(() => {
    if (meshRef.current && glowRef.current > 0) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = glowRef.current * 0.3
      glowRef.current *= 0.97
    }
  })

  return (
    <group position={position}>
      {/* Bowl */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); playBowl() }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <cylinderGeometry args={[1.2, 0.8, 0.5, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Cushion */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.25, 12]} />
        <meshStandardMaterial color={COLORS.rose} transparent opacity={0.5} roughness={0.9} />
      </mesh>
      {/* Note label */}
      <Html position={[0, 0.8, 0]} center distanceFactor={15}>
        <div style={{
          color: `#${color.toString(16).padStart(6, '0')}`,
          fontSize: '8px',
          fontFamily: "'DM Mono', monospace",
          opacity: 0.5,
          pointerEvents: 'none',
        }}>
          {['C', 'D', 'E', 'F', 'G', 'A', 'B'][index]}
        </div>
      </Html>
    </group>
  )
}

/**
 * Interactive singing bowls in the Sound Bath room.
 * Click/tap a bowl to hear a resonant tone.
 * Sound Bath is at x:110, z:-90
 */
export function SoundBathBowls() {
  return (
    <group position={[110, 0.5, -90]}>
      {Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2
        const r = 18
        return (
          <SingingBowl
            key={i}
            position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
            note={BOWL_NOTES[i]}
            color={BOWL_COLORS[i]}
            index={i}
          />
        )
      })}
      {/* Center label */}
      <Html position={[0, 3, 0]} center distanceFactor={25}>
        <div style={{
          color: '#f0c674',
          fontSize: '10px',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.5,
          pointerEvents: 'none',
        }}>
          tap bowls to play
        </div>
      </Html>
    </group>
  )
}

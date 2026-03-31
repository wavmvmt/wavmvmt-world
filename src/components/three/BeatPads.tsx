'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS } from '@/lib/roomConfig'
import { audioManager } from '@/lib/audioManager'

const PAD_COLORS = [COLORS.rose, COLORS.lavender, COLORS.gold, COLORS.sage]
const PAD_NOTES = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5

// Kick, snare, hat, clap frequencies
const DRUM_FREQS = [
  { freq: 60, type: 'sine' as OscillatorType, decay: 0.3 },   // Kick
  { freq: 200, type: 'triangle' as OscillatorType, decay: 0.1 }, // Snare-ish
  { freq: 800, type: 'square' as OscillatorType, decay: 0.05 },  // Hat
  { freq: 400, type: 'sawtooth' as OscillatorType, decay: 0.15 }, // Clap-ish
]

function playPadSound(index: number) {
  const ctx = audioManager.getContext()
  const sfxGain = audioManager.getCategoryGain('sfx')
  if (!ctx || !sfxGain) return

  const drum = DRUM_FREQS[index]
  const note = PAD_NOTES[index]
  const now = ctx.currentTime

  // Drum hit
  const drumOsc = ctx.createOscillator()
  drumOsc.type = drum.type
  drumOsc.frequency.setValueAtTime(drum.freq, now)
  drumOsc.frequency.exponentialRampToValueAtTime(drum.freq * 0.5, now + drum.decay)
  const drumGainNode = ctx.createGain()
  drumGainNode.gain.setValueAtTime(0.15, now)
  drumGainNode.gain.exponentialRampToValueAtTime(0.001, now + drum.decay)
  drumOsc.connect(drumGainNode)
  drumGainNode.connect(sfxGain)
  drumOsc.start(now)
  drumOsc.stop(now + drum.decay + 0.05)

  // Melodic tone
  const toneOsc = ctx.createOscillator()
  toneOsc.type = 'sine'
  toneOsc.frequency.value = note
  const toneGainNode = ctx.createGain()
  toneGainNode.gain.setValueAtTime(0.08, now)
  toneGainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
  toneOsc.connect(toneGainNode)
  toneGainNode.connect(sfxGain)
  toneOsc.start(now)
  toneOsc.stop(now + 0.5)
}

let _fs_BeatPads = 0
function BeatPad({ position, color, index, onHit }: {
  position: [number, number, number]
  color: number
  index: number
  onHit: (index: number) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef(0)

  useFrame(() => {
    if ((_fs_BeatPads = (_fs_BeatPads + 1) % 2) !== 0) return
    if (meshRef.current && glowRef.current > 0) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = glowRef.current
      glowRef.current *= 0.9
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        glowRef.current = 1.5
        onHit(index)
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      <boxGeometry args={[3.5, 0.3, 3.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0}
      />
    </mesh>
  )
}

/**
 * Interactive beat pads in the Music Studio.
 * Click/tap pads to trigger drum + tone sounds.
 * Positioned at the Music Studio's location.
 */
export function BeatPads() {
  const [lastHit, setLastHit] = useState<number | null>(null)

  const handleHit = useCallback((index: number) => {
    audioManager.init()
    playPadSound(index)
    setLastHit(index)
    setTimeout(() => setLastHit(null), 300)
  }, [])

  // Music Studio is at x:110, z:50 — place pads on the desk
  return (
    <group position={[110, 3.2, 44]}>
      {/* 2x2 pad grid */}
      {[
        [-2.2, 0, -2.2],
        [2.2, 0, -2.2],
        [-2.2, 0, 2.2],
        [2.2, 0, 2.2],
      ].map((pos, i) => (
        <BeatPad
          key={i}
          position={pos as [number, number, number]}
          color={PAD_COLORS[i]}
          index={i}
          onHit={handleHit}
        />
      ))}

      {/* Label */}
      <Html position={[0, 2, 0]} center distanceFactor={20}>
        <div style={{
          color: '#f0c674',
          fontSize: '10px',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          opacity: 0.6,
          pointerEvents: 'none',
          textShadow: '0 0 8px rgba(240,198,116,0.3)',
        }}>
          tap to play
        </div>
      </Html>

      {/* Visual feedback — flash ring on hit */}
      {lastHit !== null && (
        <pointLight
          position={[
            lastHit % 2 === 0 ? -2.2 : 2.2,
            1,
            lastHit < 2 ? -2.2 : 2.2,
          ]}
          color={PAD_COLORS[lastHit]}
          intensity={2}
          distance={10}
          decay={2}
        />
      )}
    </group>
  )
}

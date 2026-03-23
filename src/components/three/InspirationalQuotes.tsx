'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Inspirational quotes floating around the warehouse.
 * Slowly rotate and bob. Creates an atmosphere of intention
 * and purpose. These are the values the space embodies.
 */

const QUOTES = [
  { text: 'The world is always under construction — just like us', x: -60, z: 20, y: 8 },
  { text: 'Everything is energy. Everything is movement.', x: 40, z: -50, y: 10 },
  { text: 'We grow best when we grow together', x: -30, z: -80, y: 7 },
  { text: 'Dream anyway. Build anyway.', x: 70, z: 10, y: 12 },
  { text: 'A new renaissance', x: 0, z: -120, y: 9 },
  { text: 'Freedom through expression', x: -80, z: -30, y: 11 },
  { text: 'The room is about to get a lot bigger', x: 50, z: -90, y: 8 },
]

function FloatingQuote({ text, position }: { text: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + position[0] * 0.1) * 0.5
  })

  return (
    <group ref={ref} position={position}>
      <Html center distanceFactor={50} occlude={false}>
        <div style={{
          color: 'rgba(240,198,116,0.12)',
          fontSize: '11px',
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 0 20px rgba(240,198,116,0.05)',
        }}>
          {text}
        </div>
      </Html>
    </group>
  )
}

export function InspirationalQuotes() {
  return (
    <group>
      {QUOTES.map((q, i) => (
        <FloatingQuote key={i} text={q.text} position={[q.x, q.y, q.z]} />
      ))}
    </group>
  )
}

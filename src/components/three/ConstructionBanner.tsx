'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Large construction banner across the warehouse.
 * "FUTURE HOME OF WAVMVMT" — visible from the entrance,
 * sets the tone for the entire experience.
 */
let _fs_Construc = 0
export function ConstructionBanner() {
  const bannerRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if ((_fs_Construc = (_fs_Construc + 1) % 3) !== 0) return
    if (!bannerRef.current) return
    // Gentle sway
    const t = state.clock.elapsedTime
    bannerRef.current.rotation.z = Math.sin(t * 0.3) * 0.008
    bannerRef.current.position.y = 30 + Math.sin(t * 0.4) * 0.15
  })

  return (
    <group ref={bannerRef} position={[0, 30, -30]}>
      {/* Banner fabric */}
      <mesh>
        <planeGeometry args={[80, 8]} />
        <meshStandardMaterial
          color={0x1a1520}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          roughness={0.95}
        />
      </mesh>

      {/* Gold border */}
      <lineSegments position={[0, 0, 0.05]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(80, 8)]} />
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.4} />
      </lineSegments>

      {/* Inner border */}
      <lineSegments position={[0, 0, 0.06]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(76, 6)]} />
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.15} />
      </lineSegments>

      {/* Main text */}
      <Html position={[0, 1, 0.1]} center distanceFactor={40}>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            color: 'rgba(255,220,180,0.25)',
            fontSize: '10px',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.6em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}>
            Future Home of
          </div>
          <div style={{
            color: '#f0c674',
            fontSize: '36px',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            letterSpacing: '0.25em',
            textShadow: '0 0 30px rgba(240,198,116,0.3)',
          }}>
            WAVMVMT
          </div>
          <div style={{
            color: 'rgba(255,220,180,0.2)',
            fontSize: '8px',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.4em',
            marginTop: '6px',
          }}>
            WELLNESS · FITNESS · MUSIC · TECH · EDUCATION
          </div>
        </div>
      </Html>

      {/* Support cables to ceiling */}
      {[-35, -15, 15, 35].map((x, i) => (
        <mesh key={i} position={[x, 7, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 14, 4]} />
          <meshBasicMaterial color={COLORS.steel} transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  )
}

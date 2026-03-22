'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/** Hanging banner from ceiling — sways gently */
function HangingBanner({ position, text, color, width = 3 }: {
  position: [number, number, number]; text: string; color: number; width?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const phaseRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (groupRef.current) {
      phaseRef.current += delta * 0.5
      groupRef.current.rotation.z = Math.sin(phaseRef.current) * 0.02
      groupRef.current.rotation.y = Math.sin(phaseRef.current * 0.7) * 0.01
    }
  })

  const hexColor = `#${color.toString(16).padStart(6, '0')}`

  return (
    <group ref={groupRef} position={position}>
      {/* Support wire */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 3, 4]} />
        <meshBasicMaterial color={COLORS.steel} />
      </mesh>

      {/* Banner fabric */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, 1.2]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      {/* Banner border */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, 1.2)]} />
        <lineBasicMaterial color={0xffffff} transparent opacity={0.15} />
      </lineSegments>

      {/* Text on banner */}
      <Html position={[0, 0, 0.02]} center distanceFactor={15} transform>
        <div style={{
          color: '#fff',
          fontSize: '14px',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textShadow: `0 0 10px ${hexColor}60`,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          opacity: 0.9,
        }}>
          {text}
        </div>
      </Html>

      {/* Bottom fringe */}
      {Array.from({ length: Math.floor(width * 4) }, (_, i) => (
        <mesh key={i} position={[(i / (width * 4 - 1) - 0.5) * width, -0.65, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.1, 3]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/** Large wall-mounted sign */
function WallSign({ position, rotation = [0, 0, 0] }: {
  position: [number, number, number]; rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Sign board */}
      <mesh>
        <boxGeometry args={[6, 1.5, 0.1]} />
        <meshStandardMaterial color={0x2a2030} roughness={0.8} />
      </mesh>
      {/* Border glow */}
      <lineSegments position={[0, 0, 0.06]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(6, 1.5)]} />
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.4} />
      </lineSegments>
      {/* Text */}
      <Html position={[0, 0, 0.1]} center distanceFactor={18}>
        <div style={{
          color: '#f0c674',
          fontSize: '16px',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          letterSpacing: '0.4em',
          textShadow: '0 0 15px rgba(240,198,116,0.3)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          ~ WAVMVMT ~
        </div>
      </Html>
    </group>
  )
}

export function Signage() {
  return (
    <group>
      {/* Hanging banners from ceiling */}
      <HangingBanner position={[-20, 14, 0]} text="Building the Future" color={COLORS.gold} width={4} />
      <HangingBanner position={[20, 14, -15]} text="Music · Wellness · Community" color={COLORS.rose} width={5} />
      <HangingBanner position={[0, 14, 30]} text="Under Construction" color={COLORS.sage} width={3.5} />
      <HangingBanner position={[-50, 14, -20]} text="Parkour Training Zone" color={COLORS.lavender} width={4} />
      <HangingBanner position={[50, 14, 10]} text="Creative Studios" color={COLORS.sky} width={3.5} />

      {/* Wall-mounted signs */}
      <WallSign position={[0, 10, -59]} />
      <WallSign position={[-99, 10, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WallSign position={[99, 10, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  )
}

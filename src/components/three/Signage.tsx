'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, TOTAL_SQFT } from '@/lib/roomConfig'

let _fs_Signage_ = 0
function HangingBanner({ position, text, color, width = 5 }: {
  position: [number, number, number]; text: string; color: number; width?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const phaseRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if ((_fs_Signage_ = (_fs_Signage_ + 1) % 4) !== 0) return
    if (groupRef.current) {
      phaseRef.current += delta * 0.5
      groupRef.current.rotation.z = Math.sin(phaseRef.current) * 0.015
      groupRef.current.rotation.y = Math.sin(phaseRef.current * 0.7) * 0.008
    }
  })

  const hexColor = `#${color.toString(16).padStart(6, '0')}`

  return (
    <group ref={groupRef} position={position}>
      {/* Support wire */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 6, 4]} />
        <meshBasicMaterial color={COLORS.steel} />
      </mesh>
      {/* Banner fabric */}
      <mesh>
        <planeGeometry args={[width, 2]} />
        <meshLambertMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Border */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, 2)]} />
        <lineBasicMaterial color={0xffffff} transparent opacity={0.12} />
      </lineSegments>
      {/* Text */}
      <Html position={[0, 0, 0.02]} center distanceFactor={20} transform>
        <div style={{
          color: '#fff',
          fontSize: '16px',
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
      {Array.from({ length: Math.floor(width * 3) }, (_, i) => (
        <mesh key={i} position={[(i / (width * 3 - 1) - 0.5) * width, -1.05, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 3]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function WallSign({ position, rotation = [0, 0, 0] }: {
  position: [number, number, number]; rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[10, 2.5, 0.15]} />
        <meshLambertMaterial color={0x2a2030} />
      </mesh>
      <lineSegments position={[0, 0, 0.08]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(10, 2.5)]} />
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.4} />
      </lineSegments>
      <Html position={[0, 0, 0.12]} center distanceFactor={25}>
        <div style={{
          color: '#f0c674',
          fontSize: '20px',
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
      {/* Hanging banners — spread across massive warehouse */}
      <HangingBanner position={[-50, 36, 0]} text="Building the Future" color={COLORS.gold} width={6} />
      <HangingBanner position={[50, 36, -40]} text="Music · Wellness · Community" color={COLORS.rose} width={7} />
      <HangingBanner position={[0, 36, 80]} text="Under Construction" color={COLORS.sage} width={5} />
      <HangingBanner position={[-120, 36, -50]} text="Parkour Training Zone" color={COLORS.lavender} width={6} />
      <HangingBanner position={[130, 36, 25]} text="Creative Studios" color={COLORS.sky} width={5.5} />
      <HangingBanner position={[0, 36, -80]} text="Performance Space" color={COLORS.rose} width={5.5} />
      <HangingBanner position={[-100, 36, -160]} text="Recovery & Restoration" color={COLORS.sky} width={6} />
      <HangingBanner position={[100, 36, -160]} text="Spa & Wellness" color={COLORS.gold} width={5} />

      {/* Facility stats banner — center of warehouse */}
      <HangingBanner
        position={[0, 38, 0]}
        text={`${(TOTAL_SQFT / 1000).toFixed(1)}K SQ FT · 13 ROOMS · $100M+ VISION`}
        color={COLORS.gold}
        width={10}
      />

      {/* Wall-mounted signs — scaled for bigger walls */}
      <WallSign position={[0, 22, -228]} />
      <WallSign position={[-248, 22, -30]} rotation={[0, Math.PI / 2, 0]} />
      <WallSign position={[248, 22, -30]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  )
}

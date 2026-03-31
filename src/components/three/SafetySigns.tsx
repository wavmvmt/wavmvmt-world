'use client'

import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

interface SignDef {
  text: string
  subtext?: string
  position: [number, number, number]
  rotation: number
  color: string
  bgColor: string
}

const SIGNS: SignDef[] = [
  {
    text: '⚠ HARD HAT AREA',
    subtext: 'PPE Required Beyond This Point',
    position: [-248, 8, -150],
    rotation: Math.PI / 2,
    color: '#1a1015',
    bgColor: '#f0c674',
  },
  {
    text: '🏗️ ACTIVE CONSTRUCTION',
    subtext: 'Authorized Personnel Only',
    position: [248, 8, -60],
    rotation: -Math.PI / 2,
    color: '#ffffff',
    bgColor: '#cc4422',
  },
  {
    text: 'WAVMVMT CENTER',
    subtext: 'Est. 2026 · Toronto, ON',
    position: [0, 10, -228],
    rotation: 0,
    color: '#f0c674',
    bgColor: '#1a1520',
  },
  {
    text: '← PARKOUR GYM',
    position: [-50, 6, -30],
    rotation: 0,
    color: '#b48ead',
    bgColor: '#1a1520',
  },
  {
    text: 'MUSIC STUDIO →',
    position: [50, 6, 20],
    rotation: 0,
    color: '#e8a0bf',
    bgColor: '#1a1520',
  },
  {
    text: 'FRONT DESK ↑',
    position: [0, 6, 90],
    rotation: 0,
    color: '#80d4a8',
    bgColor: '#1a1520',
  },
  {
    text: '⬇ AMPHITHEATRE',
    position: [0, 6, -60],
    rotation: 0,
    color: '#e8a0bf',
    bgColor: '#1a1520',
  },
]

function SafetySign({ sign }: { sign: SignDef }) {
  return (
    <group position={sign.position} rotation={[0, sign.rotation, 0]}>
      {/* Sign backing */}
      <mesh>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshLambertMaterial color={sign.bgColor} />
      </mesh>
      {/* Content */}
      <Html position={[0, 0, 0.06]} center distanceFactor={15}>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            color: sign.color,
            fontSize: '11px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.15em',
          }}>
            {sign.text}
          </div>
          {sign.subtext && (
            <div style={{
              color: sign.color,
              fontSize: '7px',
              fontFamily: "'DM Sans', sans-serif",
              opacity: 0.6,
              marginTop: '2px',
              letterSpacing: '0.1em',
            }}>
              {sign.subtext}
            </div>
          )}
        </div>
      </Html>
      {/* Post */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 4]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
    </group>
  )
}

export function SafetySigns() {
  return (
    <group>
      {SIGNS.map((sign, i) => (
        <SafetySign key={i} sign={sign} />
      ))}
    </group>
  )
}

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, ROOMS } from '@/lib/roomConfig'

interface DemoScreen {
  roomName: string
  position: [number, number, number]
  rotation: number
  label: string
}

const SCREENS: DemoScreen[] = [
  { roomName: 'Parkour Gym', position: [-140, 8, -80], rotation: Math.PI / 2, label: 'Parkour Gym Preview' },
  { roomName: 'Sound Bath', position: [145, 8, -90], rotation: -Math.PI / 2, label: 'Sound Bath Preview' },
  { roomName: 'Music Studio', position: [145, 8, 50], rotation: -Math.PI / 2, label: 'Studio Preview' },
  { roomName: 'Amphitheatre', position: [0, 12, -135], rotation: 0, label: 'Performance Space' },
  { roomName: 'Recovery Suite', position: [-140, 8, -190], rotation: Math.PI / 2, label: 'Recovery Preview' },
]

function DemoScreenPanel({ screen }: { screen: DemoScreen }) {
  const glowRef = useRef<THREE.PointLight>(null)
  const scanRef = useRef<THREE.Mesh>(null)
  const room = ROOMS.find(r => r.name === screen.roomName)
  const color = room?.color || COLORS.gold
  const hexColor = `#${color.toString(16).padStart(6, '0')}`

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.intensity = 0.25 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    }
    // Animated scan line
    if (scanRef.current) {
      const y = ((state.clock.elapsedTime * 0.4) % 1) * 4.5 - 2.25
      scanRef.current.position.y = y
    }
  })

  return (
    <group position={screen.position} rotation={[0, screen.rotation, 0]}>
      {/* Screen frame */}
      <mesh>
        <boxGeometry args={[8, 5, 0.2]} />
        <meshStandardMaterial color={0x1a1015} roughness={0.5} />
      </mesh>
      {/* Screen surface — emissive glow */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[7.5, 4.5]} />
        <meshStandardMaterial
          color={0x0a0510}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.3}
        />
      </mesh>
      {/* Animated scan line */}
      <mesh ref={scanRef} position={[0, 0, 0.12]}>
        <planeGeometry args={[7.5, 0.06]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Screen glow */}
      <pointLight ref={glowRef} position={[0, 0, 1.5]} color={color} intensity={0.25} distance={12} decay={2} />

      {/* Content */}
      <Html position={[0, 0, 0.15]} center distanceFactor={15}>
        <div style={{
          width: '200px',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          {/* Room name */}
          <div style={{
            color: hexColor,
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: '0.1em',
            marginBottom: '4px',
          }}>
            {screen.roomName}
          </div>
          {/* Vision */}
          {room && (
            <div style={{
              color: 'rgba(255,220,180,0.4)',
              fontSize: '8px',
              fontStyle: 'italic',
              marginBottom: '8px',
            }}>
              {room.vision}
            </div>
          )}
          {/* Stats */}
          {room && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: hexColor, fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>
                  {room.sqft.toLocaleString()}
                </div>
                <div style={{ color: 'rgba(255,220,180,0.2)', fontSize: '6px', letterSpacing: '0.15em' }}>SQ FT</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: hexColor, fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>
                  ${(room.buildCost / 1_000_000).toFixed(1)}M
                </div>
                <div style={{ color: 'rgba(255,220,180,0.2)', fontSize: '6px', letterSpacing: '0.15em' }}>COST</div>
              </div>
            </div>
          )}
          {/* Feature list */}
          {room && (
            <div style={{ textAlign: 'left', paddingLeft: '20px', marginBottom: '6px' }}>
              {room.features.slice(0, 3).map((f, i) => (
                <div key={i} style={{
                  color: 'rgba(255,220,180,0.35)',
                  fontSize: '7px',
                  marginBottom: '2px',
                }}>
                  <span style={{ color: hexColor, marginRight: '4px' }}>›</span> {f}
                </div>
              ))}
            </div>
          )}
          {/* Build progress bar */}
          {room && (
            <div style={{ padding: '0 20px' }}>
              <div style={{
                height: '2px',
                borderRadius: '1px',
                background: 'rgba(255,220,180,0.08)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${room.buildPct}%`,
                  background: `linear-gradient(90deg, ${hexColor}, ${hexColor}80)`,
                  borderRadius: '1px',
                }} />
              </div>
              <div style={{
                color: 'rgba(255,220,180,0.2)',
                fontSize: '6px',
                letterSpacing: '0.15em',
                marginTop: '2px',
                textAlign: 'center',
              }}>
                {room.buildPct}% COMPLETE
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

export function DemoScreens() {
  return (
    <group>
      {SCREENS.map(screen => (
        <DemoScreenPanel key={screen.roomName} screen={screen} />
      ))}
    </group>
  )
}

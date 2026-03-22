'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Photo Studio — flash effect when player is nearby and presses E.
 * Photo Studio is at x:190, z:70
 */
function PhotoStudioFlash() {
  const flashRef = useRef<THREE.PointLight>(null)
  const playerNear = useRef(false)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerNear.current = Math.abs(x - 190) < 35 && Math.abs(z - 70) < 30
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'e' && playerNear.current && flashRef.current) {
        flashRef.current.intensity = 8
      }
    }
    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useFrame(() => {
    if (flashRef.current && flashRef.current.intensity > 0) {
      flashRef.current.intensity *= 0.85
      if (flashRef.current.intensity < 0.05) flashRef.current.intensity = 0
    }
  })

  return (
    <group position={[190, 4, 70]}>
      <pointLight ref={flashRef} intensity={0} color={0xffffff} distance={40} decay={2} />
      {/* Camera on tripod */}
      <mesh position={[0, -1, 8]}>
        <boxGeometry args={[0.8, 0.6, 0.6]} />
        <meshStandardMaterial color={0x2a2030} roughness={0.7} />
      </mesh>
      {/* Tripod legs */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, -2.5, 8]} rotation={[0, 0, [0.05, 0, -0.05][i]]}>
          <cylinderGeometry args={[0.03, 0.03, 3, 4]} />
          <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
        </mesh>
      ))}
      {/* Lens */}
      <mesh position={[0, -1, 8.35]}>
        <cylinderGeometry args={[0.15, 0.12, 0.15, 8]} />
        <meshStandardMaterial color={0x1a1520} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  )
}

/**
 * Weight Training — barbell that bounces when player is nearby.
 * Weight Training is at x:190, z:-35
 */
function WeightTrainingBarbell() {
  const barRef = useRef<THREE.Group>(null)
  const playerNear = useRef(false)
  const bouncePhase = useRef(0)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerNear.current = Math.abs(x - 190) < 40 && Math.abs(z + 35) < 35
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [])

  useFrame((_, delta) => {
    if (!barRef.current) return
    if (playerNear.current) {
      bouncePhase.current += delta * 3
      barRef.current.position.y = 5 + Math.abs(Math.sin(bouncePhase.current)) * 0.3
      barRef.current.rotation.z = Math.sin(bouncePhase.current * 0.5) * 0.02
    }
  })

  return (
    <group ref={barRef} position={[190, 5, -35]}>
      {/* Bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 8, 8]} />
        <meshStandardMaterial color={COLORS.steel} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Plates left */}
      {[-3.2, -3.5].map((x, i) => (
        <mesh key={`l-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6 - i * 0.1, 0.6 - i * 0.1, 0.12, 12]} />
          <meshStandardMaterial color={0x2a2030} roughness={0.8} />
        </mesh>
      ))}
      {/* Plates right */}
      {[3.2, 3.5].map((x, i) => (
        <mesh key={`r-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6 - i * 0.1, 0.6 - i * 0.1, 0.12, 12]} />
          <meshStandardMaterial color={0x2a2030} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Cafe menu board — readable text display.
 * Cafe is at x:-105, z:55
 */
function CafeMenuBoard() {
  return (
    <group position={[-105, 4, 55 - 30]}>
      {/* Board */}
      <mesh>
        <boxGeometry args={[5, 3.5, 0.2]} />
        <meshStandardMaterial color={0x1a1520} roughness={0.9} />
      </mesh>
      {/* Frame */}
      <lineSegments position={[0, 0, 0.11]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5, 3.5)]} />
        <lineBasicMaterial color={COLORS.copper} transparent opacity={0.5} />
      </lineSegments>
      {/* Menu content */}
      <Html position={[0, 0, 0.15]} center distanceFactor={12}>
        <div style={{
          width: '160px',
          padding: '8px',
          color: 'rgba(255,240,220,0.7)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '8px',
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '6px', color: '#f0c674' }}>
            WAVMVMT CAFE
          </div>
          <div style={{ borderTop: '1px solid rgba(240,198,116,0.15)', paddingTop: '4px' }}>
            {[
              ['Espresso', '$4'],
              ['Matcha Latte', '$6'],
              ['Cold Brew', '$5'],
              ['Smoothie Bowl', '$12'],
              ['Protein Shake', '$8'],
              ['Recovery Juice', '$7'],
            ].map(([item, price]) => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0', color: 'rgba(255,220,180,0.5)' }}>
                <span>{item}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: 'rgba(240,198,116,0.5)' }}>{price}</span>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  )
}

/**
 * Video Studio — "RECORDING" indicator light that toggles.
 * Video Studio is at x:-190, z:70
 */
function VideoStudioRecording() {
  const [recording, setRecording] = useState(false)
  const lightRef = useRef<THREE.PointLight>(null)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const near = Math.abs(x + 190) < 35 && Math.abs(z - 70) < 30
      if (near && !recording) setRecording(true)
      if (!near && recording) setRecording(false)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [recording])

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = recording ? (Math.sin(state.clock.elapsedTime * 3) > 0 ? 0.8 : 0.2) : 0
    }
  })

  return (
    <group position={[-190, 6, 70]}>
      {/* Recording light */}
      <mesh position={[0, 2, -20]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={recording ? 0xff2222 : 0x330000} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 2, -20]} color={0xff0000} intensity={0} distance={10} decay={2} />
      {/* "REC" label */}
      {recording && (
        <Html position={[0, 3.5, -20]} center distanceFactor={15}>
          <div style={{
            color: '#ff4444',
            fontSize: '10px',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 700,
            letterSpacing: '0.3em',
            animation: 'blink 1s step-end infinite',
            pointerEvents: 'none',
          }}>
            ● REC
          </div>
        </Html>
      )}
    </group>
  )
}

export function RoomInteractions() {
  return (
    <group>
      <PhotoStudioFlash />
      <WeightTrainingBarbell />
      <CafeMenuBoard />
      <VideoStudioRecording />
    </group>
  )
}

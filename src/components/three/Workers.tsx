'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, SKIN_TONES, WORKER_DATA, WORKER_POSITIONS } from '@/lib/roomConfig'

const SPEECH_LINES = [
  'Building the future!',
  'Almost got this wall up',
  'Hand me that wrench',
  'Looking good so far',
  'This is gonna be epic',
  'One brick at a time',
  'Need more nails over here',
  'The vision is real',
  'Watch your step!',
  'Coffee break soon?',
  'Check these blueprints',
  'Measure twice, cut once',
  'We\'re making history',
  'The community needs this',
  'Music + wellness + movement',
]

// Create a 3-step gradient texture for toon shading
function useToonGradient() {
  return useMemo(() => {
    const colors = new Uint8Array(4)
    colors[0] = 80   // darkest
    colors[1] = 160  // mid
    colors[2] = 220  // light
    colors[3] = 255  // lightest
    const tex = new THREE.DataTexture(colors, 4, 1, THREE.RedFormat)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    tex.needsUpdate = true
    return tex
  }, [])
}

function Worker({ position, index }: { position: [number, number]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)

  const info = WORKER_DATA[index % WORKER_DATA.length]
  const skin = SKIN_TONES[index % SKIN_TONES.length]
  const phase = useRef(Math.random() * Math.PI * 2)
  const type = ['hammer', 'measure', 'walk', 'dance', 'hammer', 'walk', 'weld', 'carry', 'idle', 'dance'][index % 10]
  const toonGradient = useToonGradient()
  const [speech, setSpeech] = useState<string | null>(null)
  const nextSpeechRef = useRef(5 + Math.random() * 15)

  useFrame((state, delta) => {
    const t = phase.current
    phase.current += delta * 3

    // Speech bubble timing
    if (state.clock.elapsedTime > nextSpeechRef.current) {
      setSpeech(SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)])
      nextSpeechRef.current = state.clock.elapsedTime + 10 + Math.random() * 20
      setTimeout(() => setSpeech(null), 3000 + Math.random() * 2000)
    }

    if (leftArmRef.current && rightArmRef.current && headRef.current) {
      // Gentle idle breathing on all workers
      if (groupRef.current) {
        groupRef.current.scale.y = 1 + Math.sin(t * 0.8) * 0.008
      }

      switch (type) {
        case 'hammer':
          rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 2) * 0.8
          leftArmRef.current.rotation.z = 0.3
          if (groupRef.current) {
            groupRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.03
          }
          break
        case 'measure':
          leftArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.5) * 0.15
          rightArmRef.current.rotation.z = -0.8
          headRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
          headRef.current.rotation.x = Math.sin(t * 0.2) * 0.15
          break
        case 'walk':
          leftArmRef.current.rotation.z = 0.3 + Math.sin(t) * 0.25
          rightArmRef.current.rotation.z = -0.3 - Math.sin(t) * 0.25
          if (groupRef.current) {
            groupRef.current.position.x = position[0] + Math.sin(t * 0.3) * 4
            groupRef.current.position.z = position[1] + Math.cos(t * 0.2) * 2
            groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
            groupRef.current.position.y = Math.abs(Math.sin(t * 1.2)) * 0.06
          }
          break
        case 'dance':
          leftArmRef.current.rotation.z = 0.5 + Math.sin(t * 1.5) * 0.6
          rightArmRef.current.rotation.z = -0.5 - Math.sin(t * 1.5 + 1) * 0.6
          leftArmRef.current.rotation.x = Math.sin(t * 3) * 0.3
          rightArmRef.current.rotation.x = Math.cos(t * 3) * 0.3
          headRef.current.rotation.z = Math.sin(t * 1.5) * 0.15
          if (groupRef.current) {
            groupRef.current.position.y = Math.abs(Math.sin(t * 3)) * 0.08
            groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.4
          }
          break
        case 'weld':
          rightArmRef.current.rotation.z = -0.7 + Math.sin(t * 8) * 0.03
          rightArmRef.current.rotation.x = -0.5
          leftArmRef.current.rotation.z = 0.2
          leftArmRef.current.rotation.x = -0.3
          headRef.current.rotation.x = 0.2
          break
        case 'carry':
          leftArmRef.current.rotation.z = 0.1
          leftArmRef.current.rotation.x = -0.8
          rightArmRef.current.rotation.z = -0.1
          rightArmRef.current.rotation.x = -0.8
          if (groupRef.current) {
            groupRef.current.position.x = position[0] + Math.sin(t * 0.15) * 5
            groupRef.current.rotation.y = Math.sin(t * 0.15) > 0 ? 0 : Math.PI
            groupRef.current.position.y = Math.abs(Math.sin(t * 0.8)) * 0.03
          }
          break
        case 'idle':
          headRef.current.rotation.y = Math.sin(t * 0.2) * 0.5
          rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 0.4) * 0.1
          leftArmRef.current.rotation.z = 0.3
          break
      }
    }
  })

  // Toon materials — the key to looking Ghibli
  const bodyMat = <meshToonMaterial color={0x3a5080} gradientMap={toonGradient} />
  const pantsMat = <meshToonMaterial color={0x2a3548} gradientMap={toonGradient} />
  const skinMat = <meshToonMaterial color={skin} gradientMap={toonGradient} />
  const outlineMat = <meshBasicMaterial color={COLORS.outline} side={THREE.BackSide} />
  const hatMat = <meshToonMaterial color={info.hat} gradientMap={toonGradient} />

  // Scale factor for anime proportions — bigger head, shorter legs
  // Varied sizes for visual interest (1.8-2.6x)
  const workerScale = 1.8 + (index % 5) * 0.2
  return (
    <group ref={groupRef} position={[position[0], 0, position[1]]} scale={workerScale} castShadow>
      {/* === TORSO === */}
      {/* Main torso — rounder, chubbier */}
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 8, 12]} />
        {bodyMat}
      </mesh>
      {/* Torso outline */}
      <mesh position={[0, 1.05, 0]} scale={[1.06, 1.06, 1.06]}>
        <capsuleGeometry args={[0.22, 0.5, 8, 12]} />
        {outlineMat}
      </mesh>

      {/* Collar / shirt detail */}
      <mesh position={[0, 1.32, 0.05]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 6, 12, Math.PI]} />
        <meshToonMaterial color={0x4a6090} gradientMap={toonGradient} />
      </mesh>

      {/* === HEAD === bigger for anime proportions */}
      <mesh ref={headRef} position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        {skinMat}
      </mesh>
      {/* Head outline */}
      <mesh position={[0, 1.72, 0]} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        {outlineMat}
      </mesh>

      {/* === FACE === */}
      {/* Big anime eyes — expressive, with colored iris */}
      {[-1, 1].map(s => (
        <group key={`eye-${s}`}>
          {/* Eye white — large oval */}
          <mesh position={[s * 0.1, 1.74, 0.22]}>
            <sphereGeometry args={[0.075, 10, 10]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          {/* Iris — colored per worker */}
          <mesh position={[s * 0.1, 1.74, 0.28]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color={info.hat} />
          </mesh>
          {/* Pupil */}
          <mesh position={[s * 0.1, 1.74, 0.3]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={0x0a0a15} />
          </mesh>
          {/* Primary sparkle — top right */}
          <mesh position={[s * 0.075, 1.77, 0.3]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          {/* Secondary sparkle — bottom left (smaller) */}
          <mesh position={[s * 0.12, 1.71, 0.29]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          {/* Eyelid line */}
          <mesh position={[s * 0.1, 1.79, 0.24]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.12, 0.008, 0.01]} />
            <meshBasicMaterial color={COLORS.outline} />
          </mesh>
        </group>
      ))}

      {/* Nose — tiny bump */}
      <mesh position={[0, 1.68, 0.27]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        {skinMat}
      </mesh>

      {/* Mouth — small curved line (happy) */}
      <mesh position={[0, 1.63, 0.25]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.04, 0.006, 4, 8, Math.PI]} />
        <meshBasicMaterial color={COLORS.outline} />
      </mesh>

      {/* Blush marks — Ghibli signature */}
      {[-1, 1].map(s => (
        <mesh key={`blush-${s}`} position={[s * 0.16, 1.66, 0.2]}>
          <circleGeometry args={[0.04, 8]} />
          <meshBasicMaterial color={0xe8a0a0} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* === HARD HAT === rounder, more detailed */}
      <mesh position={[0, 1.96, 0]}>
        <sphereGeometry args={[0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {hatMat}
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, 1.96, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.035, 16]} />
        {hatMat}
      </mesh>
      {/* Hat band */}
      <mesh position={[0, 1.97, 0]}>
        <torusGeometry args={[0.29, 0.015, 6, 16]} />
        <meshToonMaterial color={0xffffff} gradientMap={toonGradient} />
      </mesh>
      {/* Hat outline */}
      <mesh position={[0, 1.96, 0]} scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {outlineMat}
      </mesh>

      {/* === ARMS === thicker, more defined */}
      {/* Left arm — upper */}
      <mesh ref={leftArmRef} position={[-0.32, 1.15, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.06, 0.4, 6, 8]} />
        {bodyMat}
      </mesh>
      {/* Right arm — upper */}
      <mesh ref={rightArmRef} position={[0.32, 1.15, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.06, 0.4, 6, 8]} />
        {bodyMat}
      </mesh>

      {/* Hands — round and cartoony */}
      <mesh position={[-0.42, 0.88, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshToonMaterial color={0xd4a060} gradientMap={toonGradient} />
      </mesh>
      <mesh position={[0.42, 0.88, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshToonMaterial color={0xd4a060} gradientMap={toonGradient} />
      </mesh>

      {/* === TOOL BELT === */}
      <mesh position={[0, 0.78, 0]}>
        <torusGeometry args={[0.23, 0.03, 6, 16]} />
        <meshToonMaterial color={0x6a4a28} gradientMap={toonGradient} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 0.78, 0.23]}>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color={COLORS.copper} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tool pouch — side */}
      <mesh position={[0.22, 0.74, 0.05]}>
        <boxGeometry args={[0.06, 0.1, 0.08]} />
        <meshToonMaterial color={0x5a3a18} gradientMap={toonGradient} />
      </mesh>

      {/* === LEGS === shorter (anime proportions) */}
      <mesh position={[-0.1, 0.42, 0]}>
        <capsuleGeometry args={[0.07, 0.35, 6, 8]} />
        {pantsMat}
      </mesh>
      <mesh position={[0.1, 0.42, 0]}>
        <capsuleGeometry args={[0.07, 0.35, 6, 8]} />
        {pantsMat}
      </mesh>

      {/* === BOOTS === chunky and round (Ghibli style) */}
      <mesh position={[-0.1, 0.1, 0.02]}>
        <capsuleGeometry args={[0.065, 0.08, 6, 8]} />
        <meshToonMaterial color={0x3a2a1a} gradientMap={toonGradient} />
      </mesh>
      <mesh position={[0.1, 0.1, 0.02]}>
        <capsuleGeometry args={[0.065, 0.08, 6, 8]} />
        <meshToonMaterial color={0x3a2a1a} gradientMap={toonGradient} />
      </mesh>
      {/* Boot soles — thick rubber */}
      <mesh position={[-0.1, 0.03, 0.02]}>
        <boxGeometry args={[0.14, 0.03, 0.18]} />
        <meshBasicMaterial color={0x1a1010} />
      </mesh>
      <mesh position={[0.1, 0.03, 0.02]}>
        <boxGeometry args={[0.14, 0.03, 0.18]} />
        <meshBasicMaterial color={0x1a1010} />
      </mesh>

      {/* Name tag — always visible */}
      <Html position={[0, 2.2, 0]} center distanceFactor={10}>
        <div style={{
          color: `#${info.hat.toString(16).padStart(6, '0')}`,
          fontSize: '7px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0.5,
        }}>
          {info.name}
        </div>
      </Html>

      {/* Speech bubble */}
      {speech && (
        <Html position={[0, 2.7, 0]} center distanceFactor={12}>
          <div style={{
            background: 'rgba(26,21,32,0.85)',
            border: '1px solid rgba(240,198,116,0.2)',
            borderRadius: '12px',
            padding: '4px 10px',
            color: 'rgba(255,220,180,0.7)',
            fontSize: '9px',
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {speech}
          </div>
        </Html>
      )}
    </group>
  )
}

export function Workers() {
  return (
    <group>
      {WORKER_POSITIONS.map((pos, i) => (
        <Worker key={i} position={pos} index={i} />
      ))}
    </group>
  )
}

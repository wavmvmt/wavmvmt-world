'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, SKIN_TONES } from '@/lib/roomConfig'

interface Coach {
  name: string
  title: string
  room: string
  position: [number, number, number]
  color: number
  skinTone: number
  greeting: string
  facts: string[]
}

const COACHES: Coach[] = [
  {
    name: 'Maya', title: 'Yoga Instructor', room: 'Yoga Room',
    position: [-190, 0, -25], color: COLORS.gold, skinTone: SKIN_TONES[0],
    greeting: 'Welcome to the Yoga Room! Ready to find your center?',
    facts: [
      'This room will have heated bamboo floors for hot yoga',
      'We\'re installing aerial silks rigging for suspended yoga',
      '30 premium mats with personal cubbies',
      'Natural light panels simulate outdoor practice',
    ],
  },
  {
    name: 'Kai', title: 'Parkour Coach', room: 'Parkour Gym',
    position: [-80, 0, -60], color: COLORS.lavender, skinTone: SKIN_TONES[1],
    greeting: 'Ready to move? This gym is going to be MASSIVE!',
    facts: [
      '8,000 sq ft — the largest urban parkour facility in Canada',
      'Multi-level obstacle courses designed by pro traceurs',
      'Olympic foam pit for safe training',
      'Wall-run zones up to 20 feet high',
    ],
  },
  {
    name: 'Zara', title: 'Sound Therapist', room: 'Sound Bath',
    position: [100, 0, -75], color: COLORS.gold, skinTone: SKIN_TONES[2],
    greeting: 'Feel those vibrations? Every frequency heals differently.',
    facts: [
      '12 crystal singing bowls tuned to healing frequencies',
      'Acoustic treatment rated NRC 0.95 — near-perfect absorption',
      'Chromotherapy lighting shifts with the session',
      'Binaural beat system for deep meditation states',
    ],
  },
  {
    name: 'Dex', title: 'Studio Engineer', room: 'Music Studio',
    position: [100, 0, 40], color: COLORS.rose, skinTone: SKIN_TONES[3],
    greeting: 'This studio is going to change the game for creators.',
    facts: [
      '48-channel mixing console with Dolby Atmos monitoring',
      '3 isolation booths + dedicated vocal booth',
      'AI-assisted mastering suite — studio quality for everyone',
      'Beat lab with MPC, Push, and every plugin you need',
    ],
  },
  {
    name: 'Nia', title: 'Fitness Trainer', room: 'Weight Training',
    position: [175, 0, -25], color: COLORS.sage, skinTone: SKIN_TONES[4],
    greeting: 'Welcome to the iron paradise! 4,000 sq ft of gains.',
    facts: [
      '8 squat racks with Olympic lifting platforms',
      'Full dumbbell wall from 5 to 150 lbs',
      'Dedicated cardio deck with treads, bikes, and rowers',
      'Stretching & mobility zone with foam rollers',
    ],
  },
  {
    name: 'Remi', title: 'Recovery Specialist', room: 'Recovery Suite',
    position: [-90, 0, -175], color: COLORS.sky, skinTone: SKIN_TONES[5],
    greeting: 'Recovery is where the real growth happens.',
    facts: [
      'Finnish sauna at 180°F — traditional wood-fired feel',
      'Cold plunge pool at 39°F — pure ice therapy',
      'Infrared sauna pods for targeted deep heat',
      'Full contrast therapy circuit: hot → cold → hot',
    ],
  },
]

function CoachNPC({ coach }: { coach: Coach }) {
  const groupRef = useRef<THREE.Group>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [factIdx, setFactIdx] = useState(0)
  const playerNear = useRef(false)
  const phase = useRef(Math.random() * Math.PI * 2)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const dist = Math.sqrt((x - coach.position[0]) ** 2 + (z - coach.position[2]) ** 2)
      playerNear.current = dist < 8
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'e' && playerNear.current) {
        setShowDialog(prev => {
          if (prev) {
            // Cycle through facts
            setFactIdx(i => (i + 1) % (coach.facts.length + 1))
          }
          return true
        })
      }
    }
    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('keydown', onKey)
    }
  }, [coach])

  const distRef = useRef(999)
  const skipFrame = useRef(0)
  useFrame((state, delta) => {
    skipFrame.current = (skipFrame.current + 1) % 3
    const px = state.camera.position
    distRef.current = Math.sqrt((px.x - coach.position[0])**2 + (px.z - coach.position[2])**2)
    if (distRef.current > 50 && skipFrame.current !== 0) return
    if (!groupRef.current) return
    phase.current += delta * 0.5
    // Gentle idle sway
    groupRef.current.rotation.y = Math.sin(phase.current) * 0.05
    groupRef.current.scale.y = 1 + Math.sin(phase.current * 1.5) * 0.005
  })

  const hexColor = `#${coach.color.toString(16).padStart(6, '0')}`

  return (
    <group ref={groupRef} position={coach.position} scale={2.2}>
      {/* Body — distinct from workers (vest instead of uniform) */}
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 8, 12]} />
        <meshStandardMaterial color={coach.color} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color={coach.skinTone} roughness={0.8} />
      </mesh>
      {/* Eyes */}
      {[-1, 1].map(s => (
        <group key={s}>
          <mesh position={[s * 0.1, 1.74, 0.22]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          <mesh position={[s * 0.1, 1.74, 0.27]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={coach.color} />
          </mesh>
        </group>
      ))}
      {/* Clipboard */}
      <mesh position={[0.3, 0.9, 0.15]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.25, 0.35, 0.02]} />
        <meshStandardMaterial color={0xf0e8d0} roughness={0.9} />
      </mesh>

      {/* Name tag */}
      {distRef.current < 20 && (
        <Html position={[0, 2.2, 0]} center distanceFactor={10}>
          <div style={{
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ color: hexColor, fontSize: '9px', fontWeight: 700 }}>{coach.name}</div>
            <div style={{ color: 'rgba(255,220,180,0.35)', fontSize: '6px', letterSpacing: '0.1em' }}>{coach.title}</div>
          </div>
        </Html>
      )}

      {/* Interact prompt */}
      {playerNear.current && !showDialog && (
        <Html position={[0, 2.8, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(26,21,32,0.85)',
            border: `1px solid ${hexColor}40`,
            borderRadius: '10px',
            padding: '4px 10px',
            color: hexColor,
            fontSize: '9px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            Press E to talk
          </div>
        </Html>
      )}

      {/* Dialog */}
      {showDialog && (
        <Html position={[0, 3.2, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(26,21,32,0.92)',
            border: `1px solid ${hexColor}30`,
            borderRadius: '14px',
            padding: '10px 14px',
            maxWidth: '220px',
            pointerEvents: 'auto',
          }}>
            <div style={{ color: hexColor, fontSize: '9px', fontWeight: 700, marginBottom: '4px' }}>
              {coach.name} — {coach.title}
            </div>
            <div style={{ color: 'rgba(255,220,180,0.7)', fontSize: '8px', lineHeight: 1.4, marginBottom: '6px' }}>
              {factIdx === 0 ? coach.greeting : coach.facts[(factIdx - 1) % coach.facts.length]}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,220,180,0.2)', fontSize: '6px' }}>
                {factIdx}/{coach.facts.length}
              </span>
              <button
                onClick={() => {
                  if (factIdx >= coach.facts.length) {
                    setShowDialog(false)
                    setFactIdx(0)
                  } else {
                    setFactIdx(i => i + 1)
                  }
                }}
                style={{
                  background: `${hexColor}15`,
                  border: `1px solid ${hexColor}30`,
                  borderRadius: '6px',
                  padding: '2px 8px',
                  color: hexColor,
                  fontSize: '7px',
                  cursor: 'pointer',
                }}
              >
                {factIdx >= coach.facts.length ? 'Close' : 'Next →'}
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export function NPCCoaches() {
  return (
    <group>
      {COACHES.map(coach => (
        <CoachNPC key={coach.name} coach={coach} />
      ))}
    </group>
  )
}

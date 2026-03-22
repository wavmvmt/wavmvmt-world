'use client'

import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/** Equipment that appears inside rooms based on build % — scaled to match 2.5x rooms */

function ParkourGymInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 10) return null
  const opacity = Math.min(1, buildPct / 100)
  const mat = <meshStandardMaterial color={COLORS.lavender} transparent opacity={opacity * 0.3} roughness={0.8} />

  return (
    <group>
      {/* Vault boxes — various heights */}
      {[[-20, 7, -12], [-8, 5, -20], [12, 10, -8], [25, 6, 12], [-12, 4, 20]].map(([x, h, z], i) => (
        <mesh key={`vb-${i}`} position={[x, h / 2, z]} castShadow>
          <boxGeometry args={[6, h, 5]} />
          {mat}
        </mesh>
      ))}
      {/* Wall-run surfaces */}
      {buildPct > 20 && (
        <>
          <mesh position={[-45, 12, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[50, 25, 1]} />
            <meshStandardMaterial color={COLORS.lavender} transparent opacity={opacity * 0.15} roughness={0.9} />
          </mesh>
          {/* Rails */}
          {[-15, -5, 5, 15].map((z, i) => (
            <mesh key={`rail-${i}`} position={[0, 3, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.15, 0.15, 38, 8]} />
              <meshStandardMaterial color={COLORS.steel} metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </>
      )}
      {/* Platform levels */}
      {buildPct > 25 && [7, 14, 21].map((h, i) => (
        <mesh key={`plat-${i}`} position={[20 - i * 12, h, -25]}>
          <boxGeometry args={[10, 0.6, 10]} />
          <meshStandardMaterial color={COLORS.woodLt} roughness={0.85} transparent opacity={opacity * 0.5} />
        </mesh>
      ))}
    </group>
  )
}

function SoundBathInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 5) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Singing bowls — arranged in circle */}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (i / 9) * Math.PI * 2
        const r = 15
        return (
          <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[1.2, 0.7, 0.5, 16]} />
              <meshStandardMaterial color={COLORS.gold} metalness={0.7} roughness={0.3} transparent opacity={opacity * 0.6} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.3, 12]} />
              <meshStandardMaterial color={COLORS.rose} transparent opacity={opacity * 0.4} roughness={0.9} />
            </mesh>
          </group>
        )
      })}
      {/* Floor cushions for sitting */}
      {buildPct > 8 && Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2 + 0.3
        return (
          <mesh key={`cush-${i}`} position={[Math.cos(angle) * 8, 0.2, Math.sin(angle) * 8]}>
            <cylinderGeometry args={[2, 2, 0.4, 10]} />
            <meshStandardMaterial color={COLORS.gold} transparent opacity={opacity * 0.25} roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function MusicStudioInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 3) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Desk / console */}
      <mesh position={[0, 2.8, -10]}>
        <boxGeometry args={[20, 0.4, 6]} />
        <meshStandardMaterial color={0x2a2030} transparent opacity={opacity * 0.5} roughness={0.7} />
      </mesh>
      {/* Desk legs */}
      {[[-8, 0], [8, 0], [-8, -5], [8, -5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.3, -10 + z * 0.5]}>
          <cylinderGeometry args={[0.1, 0.1, 2.6, 6]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.5} transparent opacity={opacity * 0.5} />
        </mesh>
      ))}
      {/* Monitor screens */}
      {[-5, 0, 5].map((x, i) => (
        <mesh key={`mon-${i}`} position={[x, 5, -12]}>
          <boxGeometry args={[3.5, 2.2, 0.2]} />
          <meshStandardMaterial color={0x1a1520} emissive={COLORS.sky} emissiveIntensity={0.05} transparent opacity={opacity * 0.5} />
        </mesh>
      ))}
      {/* Speaker towers */}
      {[-12, 12].map((x, i) => (
        <mesh key={`spk-${i}`} position={[x, 3.5, -12]}>
          <boxGeometry args={[2.5, 7, 2.5]} />
          <meshStandardMaterial color={0x1a1015} transparent opacity={opacity * 0.4} roughness={0.9} />
        </mesh>
      ))}
      {/* Beat pad grid (4x4) */}
      {buildPct > 4 && Array.from({ length: 16 }, (_, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        return (
          <mesh key={`pad-${i}`} position={[-3.5 + col * 2.5, 3.1, -7 + row * 2.5]}>
            <boxGeometry args={[2, 0.1, 2]} />
            <meshStandardMaterial
              color={[COLORS.rose, COLORS.lavender, COLORS.gold, COLORS.sage][col]}
              emissive={[COLORS.rose, COLORS.lavender, COLORS.gold, COLORS.sage][col]}
              emissiveIntensity={0.1}
              transparent opacity={opacity * 0.4}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function FrontDeskInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 30) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Reception desk — curved */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[10, 10, 2.8, 20, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.5} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.5, 10.5, 20, 1, 0, Math.PI]} />
        <meshStandardMaterial color={COLORS.copper} metalness={0.5} roughness={0.4} transparent opacity={opacity * 0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Directory screen */}
      {buildPct > 50 && (
        <mesh position={[0, 6, -7]}>
          <boxGeometry args={[10, 6, 0.3]} />
          <meshStandardMaterial color={0x1a1520} emissive={COLORS.sage} emissiveIntensity={0.08} transparent opacity={opacity * 0.5} />
        </mesh>
      )}
    </group>
  )
}

function WeightTrainingInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 5) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Squat racks */}
      {[-15, 0, 15].map((x, i) => (
        <group key={i}>
          {[-2, 2].map((dx, j) => (
            <mesh key={j} position={[x + dx, 3.5, 0]}>
              <boxGeometry args={[0.3, 7, 0.3]} />
              <meshStandardMaterial color={COLORS.steel} metalness={0.6} roughness={0.4} transparent opacity={opacity * 0.5} />
            </mesh>
          ))}
          <mesh position={[x, 4.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 6, 8]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.7} roughness={0.3} transparent opacity={opacity * 0.5} />
          </mesh>
        </group>
      ))}
      {/* Dumbbells on rack */}
      {buildPct > 6 && (
        <mesh position={[0, 2, 15]}>
          <boxGeometry args={[20, 4, 2.5]} />
          <meshStandardMaterial color={COLORS.steel} transparent opacity={opacity * 0.2} metalness={0.5} />
        </mesh>
      )}
    </group>
  )
}

function AmphitheatreInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 2) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Tiered seating — 6 rows rising back */}
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <mesh key={row} position={[0, row * 2 + 1, 12 + row * 5]}>
          <boxGeometry args={[50, 0.6, 4]} />
          <meshStandardMaterial color={COLORS.woodLt} transparent opacity={opacity * 0.3} roughness={0.85} />
        </mesh>
      ))}
      {/* Stage platform */}
      <mesh position={[0, 0.6, -12]}>
        <boxGeometry args={[35, 1.2, 14]} />
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.4} roughness={0.8} />
      </mesh>
    </group>
  )
}

export function RoomInteriors() {
  return (
    <group>
      {ROOMS.map((room) => {
        const Interior = {
          'Parkour Gym': ParkourGymInterior,
          'Sound Bath': SoundBathInterior,
          'Music Studio': MusicStudioInterior,
          'Front Desk': FrontDeskInterior,
          'Weight Training': WeightTrainingInterior,
          'Amphitheatre': AmphitheatreInterior,
        }[room.name]

        if (!Interior) return null

        return (
          <group key={room.name} position={[room.x, 0, room.z]}>
            <Interior buildPct={room.buildPct} />
          </group>
        )
      })}
    </group>
  )
}

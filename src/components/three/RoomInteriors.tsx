'use client'

import * as THREE from 'three'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/** Equipment that appears inside rooms based on build % — scaled to match 2.5x rooms */

function ParkourGymInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 10) return null
  const opacity = Math.min(1, buildPct / 100)
  const mat = <meshStandardMaterial color={COLORS.lavender} transparent opacity={opacity * 0.85} roughness={0.8} />

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
            <meshStandardMaterial color={COLORS.lavender} transparent opacity={opacity * 0.7} roughness={0.9} />
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
          <meshStandardMaterial color={COLORS.woodLt} roughness={0.85} transparent opacity={opacity * 0.8} />
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
              <cylinderGeometry args={[1.2, 0.7, 0.5, 8]} />
              <meshStandardMaterial color={COLORS.gold} metalness={0.7} roughness={0.3} transparent opacity={opacity * 0.85} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.3, 8]} />
              <meshStandardMaterial color={COLORS.rose} transparent opacity={opacity * 0.7} roughness={0.9} />
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
            <meshStandardMaterial color={COLORS.gold} transparent opacity={opacity * 0.55} roughness={0.95} />
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
        <meshStandardMaterial color={0x2a2030} transparent opacity={opacity * 0.8} roughness={0.7} />
      </mesh>
      {/* Desk legs */}
      {[[-8, 0], [8, 0], [-8, -5], [8, -5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.3, -10 + z * 0.5]}>
          <cylinderGeometry args={[0.1, 0.1, 2.6, 6]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.5} transparent opacity={opacity * 0.8} />
        </mesh>
      ))}
      {/* Monitor screens */}
      {[-5, 0, 5].map((x, i) => (
        <mesh key={`mon-${i}`} position={[x, 5, -12]}>
          <boxGeometry args={[3.5, 2.2, 0.2]} />
          <meshStandardMaterial color={0x1a1520} emissive={COLORS.sky} emissiveIntensity={0.25} transparent opacity={opacity * 0.8} />
        </mesh>
      ))}
      {/* Speaker towers */}
      {[-12, 12].map((x, i) => (
        <mesh key={`spk-${i}`} position={[x, 3.5, -12]}>
          <boxGeometry args={[2.5, 7, 2.5]} />
          <meshStandardMaterial color={0x1a1015} transparent opacity={opacity * 0.7} roughness={0.9} />
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
              emissiveIntensity={0.35}
              transparent opacity={opacity * 0.7}
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
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.8} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.5, 10.5, 20, 1, 0, Math.PI]} />
        <meshStandardMaterial color={COLORS.copper} metalness={0.5} roughness={0.4} transparent opacity={opacity * 0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Directory screen */}
      {buildPct > 50 && (
        <mesh position={[0, 6, -7]}>
          <boxGeometry args={[10, 6, 0.3]} />
          <meshStandardMaterial color={0x1a1520} emissive={COLORS.sage} emissiveIntensity={0.3} transparent opacity={opacity * 0.8} />
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
              <meshStandardMaterial color={COLORS.steel} metalness={0.6} roughness={0.4} transparent opacity={opacity * 0.8} />
            </mesh>
          ))}
          <mesh position={[x, 4.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 6, 8]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.7} roughness={0.3} transparent opacity={opacity * 0.8} />
          </mesh>
        </group>
      ))}
      {/* Dumbbells on rack */}
      {buildPct > 6 && (
        <mesh position={[0, 2, 15]}>
          <boxGeometry args={[20, 4, 2.5]} />
          <meshStandardMaterial color={COLORS.steel} transparent opacity={opacity * 0.8} metalness={0.5} />
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
          <meshStandardMaterial color={COLORS.woodLt} transparent opacity={opacity * 0.85} roughness={0.85} />
        </mesh>
      ))}
      {/* Stage platform */}
      <mesh position={[0, 0.6, -12]}>
        <boxGeometry args={[35, 1.2, 14]} />
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.7} roughness={0.8} />
      </mesh>
    </group>
  )
}

function EducationWingInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Classroom desks — 2 rows of 5 */}
      {Array.from({ length: 10 }, (_, i) => {
        const row = Math.floor(i / 5)
        const col = i % 5
        return (
          <group key={`desk-${i}`} position={[-20 + col * 10, 0, -10 + row * 12]}>
            {/* Desk surface */}
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[4, 0.15, 2.5]} />
              <meshStandardMaterial color={COLORS.woodLt} transparent opacity={opacity * 0.7} roughness={0.8} />
            </mesh>
            {/* Chair */}
            <mesh position={[0, 1, 1.5]}>
              <boxGeometry args={[1.5, 0.15, 1.5]} />
              <meshStandardMaterial color={COLORS.steel} transparent opacity={opacity * 0.85} />
            </mesh>
          </group>
        )
      })}
      {/* Whiteboard / smart board */}
      <mesh position={[0, 5, -18]}>
        <boxGeometry args={[16, 6, 0.3]} />
        <meshStandardMaterial color={0xf0f0f0} emissive={COLORS.sky} emissiveIntensity={0.15} transparent opacity={opacity * 0.8} />
      </mesh>
      {/* Computer lab stations (back wall) */}
      {buildPct > 2 && Array.from({ length: 6 }, (_, i) => (
        <group key={`pc-${i}`} position={[-25 + i * 10, 0, 20]}>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[3, 0.1, 2]} />
            <meshStandardMaterial color={0x2a2030} transparent opacity={opacity * 0.7} />
          </mesh>
          {/* Monitor */}
          <mesh position={[0, 3, -0.5]}>
            <boxGeometry args={[2, 1.5, 0.1]} />
            <meshStandardMaterial color={0x1a1520} emissive={COLORS.sage} emissiveIntensity={0.25} transparent opacity={opacity * 0.7} />
          </mesh>
        </group>
      ))}
      {/* Schedule board — rotating class listings */}
      <mesh position={[30, 4, 0]}>
        <boxGeometry args={[0.3, 8, 12]} />
        <meshStandardMaterial color={0x1a1520} emissive={COLORS.gold} emissiveIntensity={0.25} transparent opacity={opacity * 0.8} />
      </mesh>
    </group>
  )
}

function PhotoStudioInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Cyclorama wall — curved backdrop */}
      <mesh position={[0, 5, -14]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[16, 16, 10, 16, 1, true, -Math.PI * 0.4, Math.PI * 0.8]} />
        <meshStandardMaterial color={0xf0f0f0} transparent opacity={opacity * 0.8} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Lighting stands — 3 point setup */}
      {[[-8, 5], [8, 5], [0, -8]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Stand pole */}
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 6, 6]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.5} transparent opacity={opacity * 0.7} />
          </mesh>
          {/* Light head */}
          <mesh position={[0, 5.5, 0]}>
            <cylinderGeometry args={[0.8, 0.3, 0.5, 8]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.6} transparent opacity={opacity * 0.7} />
          </mesh>
          {/* Softbox */}
          <mesh position={[0, 5.5, 0.5]}>
            <boxGeometry args={[2.5, 2.5, 0.3]} />
            <meshStandardMaterial color={0xf0f0f0} transparent opacity={opacity * 0.7} />
          </mesh>
        </group>
      ))}

      {/* Tethered shooting station — desk + monitor */}
      <mesh position={[12, 1.5, 5]}>
        <boxGeometry args={[4, 0.15, 2]} />
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.7} />
      </mesh>
      <mesh position={[12, 2.8, 4.5]}>
        <boxGeometry args={[2.5, 1.8, 0.1]} />
        <meshStandardMaterial color={0x1a1520} emissive={COLORS.sky} emissiveIntensity={0.2} transparent opacity={opacity * 0.7} />
      </mesh>
    </group>
  )
}

function VideoStudioInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Green screen wall */}
      <mesh position={[0, 4, -14]}>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color={0x00b140} transparent opacity={opacity * 0.8} roughness={0.95} />
      </mesh>

      {/* Camera on tripod — center */}
      <group position={[0, 0, 5]}>
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 5, 6]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.5} transparent opacity={opacity * 0.7} />
        </mesh>
        {/* Camera body */}
        <mesh position={[0, 4.8, 0]}>
          <boxGeometry args={[1, 0.7, 1.2]} />
          <meshStandardMaterial color={0x1a1015} transparent opacity={opacity * 0.8} />
        </mesh>
      </group>

      {/* Editing suite — 3 workstations */}
      {[-8, 0, 8].map((x, i) => (
        <group key={i} position={[x, 0, 12]}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[4, 0.12, 2]} />
            <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.7} />
          </mesh>
          {/* Dual monitors */}
          {[-0.9, 0.9].map((dx, j) => (
            <mesh key={j} position={[dx, 2.8, -0.5]}>
              <boxGeometry args={[1.5, 1.2, 0.08]} />
              <meshStandardMaterial color={0x1a1520} emissive={COLORS.rose} emissiveIntensity={0.15} transparent opacity={opacity * 0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Teleprompter */}
      {buildPct > 3 && (
        <mesh position={[0, 3.5, 3]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[2, 1.5, 0.08]} />
          <meshStandardMaterial color={0x1a1520} emissive={COLORS.gold} emissiveIntensity={0.15} transparent opacity={opacity * 0.85} />
        </mesh>
      )}
    </group>
  )
}

function RecoverySuiteInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Finnish sauna — wooden room */}
      <group position={[-20, 0, -15]}>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[12, 6, 10]} />
          <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.7} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* Sauna benches — 2 tiers */}
        {[1.5, 3.5].map((h, i) => (
          <mesh key={i} position={[0, h, -2]}>
            <boxGeometry args={[8, 0.3, 3]} />
            <meshStandardMaterial color={COLORS.woodLt} transparent opacity={opacity * 0.7} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Cold plunge pools — 3 tubs */}
      {[0, 8, 16].map((x, i) => (
        <group key={i} position={[x, 0, 10]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[3, 3, 1.6, 12, 1, true]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.4} transparent opacity={opacity * 0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Water surface */}
          <mesh position={[0, 1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.8, 12]} />
            <meshStandardMaterial color={COLORS.sky} transparent opacity={opacity * 0.8} roughness={0.1} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Steam room */}
      <mesh position={[25, 3, -15]}>
        <boxGeometry args={[10, 6, 10]} />
        <meshStandardMaterial color={COLORS.steel} transparent opacity={opacity * 0.55} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function SpaWellnessInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Massage tables — 4 stations */}
      {[-12, -4, 4, 12].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[3, 0.3, 6]} />
            <meshStandardMaterial color={COLORS.cream} transparent opacity={opacity * 0.7} roughness={0.9} />
          </mesh>
          {/* Legs */}
          {[[-1, -2], [1, -2], [-1, 2], [1, 2]].map(([dx, dz], j) => (
            <mesh key={j} position={[dx, 0.55, dz]}>
              <cylinderGeometry args={[0.06, 0.06, 1.1, 6]} />
              <meshStandardMaterial color={COLORS.steel} transparent opacity={opacity * 0.85} />
            </mesh>
          ))}
          {/* Head rest */}
          <mesh position={[0, 1.4, -3.2]}>
            <cylinderGeometry args={[0.5, 0.5, 0.15, 8]} />
            <meshStandardMaterial color={COLORS.cream} transparent opacity={opacity * 0.85} />
          </mesh>
        </group>
      ))}

      {/* Cryotherapy chamber */}
      {buildPct > 3 && (
        <mesh position={[0, 2.5, -15]}>
          <cylinderGeometry args={[2, 2, 5, 8]} />
          <meshStandardMaterial color={COLORS.sky} transparent opacity={opacity * 0.7} metalness={0.6} roughness={0.3} />
        </mesh>
      )}
    </group>
  )
}

function CafeLoungeInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Espresso bar counter */}
      <mesh position={[0, 1.4, -20]}>
        <boxGeometry args={[20, 2.8, 2]} />
        <meshStandardMaterial color={COLORS.woodDk} transparent opacity={opacity * 0.7} roughness={0.8} />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 2.85, -20]}>
        <boxGeometry args={[20.5, 0.15, 2.2]} />
        <meshStandardMaterial color={COLORS.copper} metalness={0.4} roughness={0.5} transparent opacity={opacity * 0.7} />
      </mesh>

      {/* Seating area — 6 round tables */}
      {[[-15, 5], [-5, 10], [5, 5], [15, 10], [-8, -5], [8, -5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Table */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[2, 2, 0.12, 10]} />
            <meshStandardMaterial color={COLORS.woodLt} transparent opacity={opacity * 0.85} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 6]} />
            <meshStandardMaterial color={COLORS.steel} transparent opacity={opacity * 0.85} />
          </mesh>
          {/* 3 chairs around */}
          {[0, 2.1, 4.2].map((angle, j) => (
            <mesh key={j} position={[Math.cos(angle) * 2.8, 0.8, Math.sin(angle) * 2.8]}>
              <boxGeometry args={[1, 0.1, 1]} />
              <meshStandardMaterial color={COLORS.sage} transparent opacity={opacity * 0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Menu board */}
      <mesh position={[0, 5, -21.5]}>
        <boxGeometry args={[8, 4, 0.2]} />
        <meshStandardMaterial color={0x1a1520} emissive={COLORS.gold} emissiveIntensity={0.2} transparent opacity={opacity * 0.7} />
      </mesh>
    </group>
  )
}

function YogaRoomInterior({ buildPct }: { buildPct: number }) {
  if (buildPct < 1) return null
  const opacity = Math.min(1, buildPct / 100)

  return (
    <group>
      {/* Yoga mats — 5x3 grid */}
      {Array.from({ length: 15 }, (_, i) => {
        const row = Math.floor(i / 5)
        const col = i % 5
        return (
          <mesh key={i} position={[-12 + col * 6, 0.05, -8 + row * 8]}>
            <boxGeometry args={[2.5, 0.08, 5.5]} />
            <meshStandardMaterial
              color={[COLORS.sage, COLORS.lavender, COLORS.rose, COLORS.sky, COLORS.gold][col]}
              transparent opacity={opacity * 0.55}
              roughness={0.95}
            />
          </mesh>
        )
      })}

      {/* Mirror wall */}
      <mesh position={[-15, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color={0xffffff} metalness={0.9} roughness={0.05} transparent opacity={opacity * 0.7} />
      </mesh>

      {/* Aerial silk rigging points */}
      {buildPct > 5 && [-5, 5].map((x, i) => (
        <mesh key={i} position={[x, 5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 10, 4]} />
          <meshStandardMaterial color={COLORS.rose} transparent opacity={opacity * 0.85} />
        </mesh>
      ))}
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
          'Education Wing': EducationWingInterior,
          'Recovery Suite': RecoverySuiteInterior,
          'Spa & Wellness': SpaWellnessInterior,
          'Cafe & Lounge': CafeLoungeInterior,
          'Yoga Room': YogaRoomInterior,
          'Photo Studio': PhotoStudioInterior,
          'Video Studio': VideoStudioInterior,
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

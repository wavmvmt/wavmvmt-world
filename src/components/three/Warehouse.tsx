'use client'

import { type ReactNode, useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS, ROOMS, SCAFFOLD_POSITIONS } from '@/lib/roomConfig'

function Wall({ width, height, position, rotationY = 0 }: {
  width: number; height: number; position: [number, number, number]; rotationY?: number
}) {
  return (
    <group>
      <mesh position={position} rotation={[0, rotationY, 0]} receiveShadow>
        <planeGeometry args={[width, height, Math.floor(width / 4), Math.floor(height / 4)]} />
        <meshStandardMaterial
          color={COLORS.concrete}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
          envMapIntensity={0.2}
        />
      </mesh>
      {/* Wall base trim */}
      <mesh position={[
        position[0] + (rotationY ? 0 : 0),
        0.15,
        position[2]
      ]} rotation={[0, rotationY, 0]}>
        <boxGeometry args={[width, 0.3, 0.15]} />
        <meshStandardMaterial color={COLORS.copper} roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  )
}

function WireframeRoom({ name, x, z, w, d, h, color, buildPct, sqft, vision, features, buildCost }: {
  name: string; x: number; z: number; w: number; d: number; h: number; color: number; buildPct: number; sqft: number; vision: string; features: string[]; buildCost: number
}) {
  const hexColor = `#${color.toString(16).padStart(6, '0')}`
  const glowRef = useRef<THREE.PointLight>(null)
  const outlineRef = useRef<THREE.LineSegments>(null)
  const proximityRef = useRef(0)

  // Listen for player position and calculate proximity
  useFrame(() => {
    const handler = (e: Event) => {
      const { x: px, z: pz } = (e as CustomEvent).detail
      const dist = Math.sqrt((px - x) ** 2 + (pz - z) ** 2)
      const maxDist = Math.max(w, d) * 0.8
      proximityRef.current = Math.max(0, 1 - dist / maxDist)
    }
    window.addEventListener('playerMove', handler as EventListener)

    // Apply proximity glow
    if (glowRef.current) {
      glowRef.current.intensity = proximityRef.current * 0.8
    }
    if (outlineRef.current) {
      const mat = outlineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.5 + proximityRef.current * 0.5
    }

    return () => window.removeEventListener('playerMove', handler as EventListener)
  })

  return (
    <group position={[x, 0, z]}>
      {/* Proximity glow light */}
      <pointLight ref={glowRef} position={[0, h / 2, 0]} color={color} intensity={0} distance={Math.max(w, d)} decay={2} />

      {/* Main wireframe outline — glowing */}
      <lineSegments ref={outlineRef} position={[0, h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color={color} transparent opacity={0.7} />
      </lineSegments>

      {/* Inner structure lines for depth */}
      <lineSegments position={[0, h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w - 1, h - 0.5, d - 1)]} />
        <lineBasicMaterial color={color} transparent opacity={0.15} />
      </lineSegments>

      {/* Corner pillars — gives rooms physical presence */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cz], i) => (
        <mesh key={i} position={[cx * (w / 2 - 0.15), h / 2, cz * (d / 2 - 0.15)]}>
          <boxGeometry args={[0.3, h, 0.3]} />
          <meshStandardMaterial color={color} transparent opacity={0.2} roughness={0.8} />
        </mesh>
      ))}

      {/* Build fill (rising from floor) */}
      {buildPct > 0 && (
        <>
          <mesh position={[0, (h * buildPct / 100) / 2, 0]}>
            <boxGeometry args={[w - 0.5, h * buildPct / 100, d - 0.5]} />
            <meshStandardMaterial
              color={color} transparent
              opacity={0.03 + (buildPct / 100) * 0.08}
              roughness={0.9}
              emissive={color}
              emissiveIntensity={0.02 + (buildPct / 100) * 0.03}
            />
          </mesh>
          {/* Top cap glow */}
          <mesh position={[0, h * buildPct / 100, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w - 1, d - 1]} />
            <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Interior glow light */}
          <pointLight
            position={[0, h * buildPct / 100 * 0.5, 0]}
            intensity={buildPct / 100 * 0.3}
            color={color}
            distance={Math.max(w, d) * 0.8}
            decay={2}
          />
        </>
      )}

      {/* Floor grid — finer detail */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.5, d - 0.5, Math.floor(w / 2), Math.floor(d / 2)]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
      </mesh>

      {/* Floor fill — subtle colored ground */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.5, d - 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.02} />
      </mesh>

      {/* Door appears at 60%+ build */}
      {buildPct >= 60 && (
        <group position={[0, 0, d / 2 + 0.1]}>
          {/* Door frame */}
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[2.5, 4, 0.3]} />
            <meshStandardMaterial color={COLORS.woodDk} roughness={0.8} />
          </mesh>
          {/* Door panel */}
          <mesh position={[0, 2, 0.2]}>
            <boxGeometry args={[2, 3.6, 0.1]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.6 + (buildPct / 100) * 0.4}
              roughness={0.7}
            />
          </mesh>
          {/* Handle */}
          <mesh position={[0.7, 1.8, 0.35]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={COLORS.copper} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* "Coming Soon" or "Open" label */}
          <Html position={[0, 4.5, 0]} center distanceFactor={15}>
            <div style={{
              color: buildPct >= 100 ? '#80d4a8' : hexColor,
              fontSize: '8px',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.6,
              pointerEvents: 'none',
            }}>
              {buildPct >= 100 ? 'ENTER' : `${buildPct}% COMPLETE`}
            </div>
          </Html>
        </group>
      )}

      {/* Floating room label + info card */}
      <Html position={[0, h + 3, 0]} center distanceFactor={35}>
        <div style={{
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {/* Room name */}
          <div style={{
            color: hexColor,
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: `0 0 12px ${hexColor}40, 0 0 4px rgba(0,0,0,0.8)`,
          }}>
            {name}
          </div>
          {/* Sq ft + build % + cost */}
          <div style={{
            color: 'rgba(255,220,180,0.5)',
            fontSize: '10px',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.15em',
            marginTop: '2px',
          }}>
            {sqft.toLocaleString()} sq ft · ${(buildCost / 1_000_000).toFixed(1)}M · {buildPct}%
          </div>
          {/* Vision statement */}
          <div style={{
            color: 'rgba(255,220,180,0.3)',
            fontSize: '9px',
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            marginTop: '4px',
            maxWidth: '200px',
          }}>
            {vision}
          </div>
          {/* Feature list — shows on closer approach */}
          <div style={{
            marginTop: '6px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '3px',
            justifyContent: 'center',
            maxWidth: '220px',
          }}>
            {features.slice(0, 4).map((f, i) => (
              <span key={i} style={{
                fontSize: '7px',
                padding: '2px 6px',
                borderRadius: '8px',
                background: `${hexColor}15`,
                border: `1px solid ${hexColor}25`,
                color: `${hexColor}aa`,
                whiteSpace: 'nowrap',
              }}>
                {f}
              </span>
            ))}
            {features.length > 4 && (
              <span style={{
                fontSize: '7px',
                padding: '2px 6px',
                color: 'rgba(255,220,180,0.25)',
              }}>
                +{features.length - 4} more
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  )
}

function Scaffolding({ x, z, levels }: { x: number; z: number; levels: number }) {
  const pipes: ReactNode[] = []
  const planks: ReactNode[] = []

  for (let l = 0; l < levels; l++) {
    const y = l * 2.5
    for (const dx of [-1, 1]) {
      for (const dz of [-0.5, 0.5]) {
        pipes.push(
          <mesh key={`p-${l}-${dx}-${dz}`} position={[dx * 1.5, y + 1.25, dz * 1.5]}>
            <cylinderGeometry args={[0.04, 0.04, 2.5, 6]} />
            <meshStandardMaterial color={COLORS.copper} metalness={0.5} roughness={0.5} />
          </mesh>
        )
      }
    }
    if (l > 0) {
      planks.push(
        <mesh key={`b-${l}`} position={[0, y, 0]}>
          <boxGeometry args={[3, 0.07, 1.5]} />
          <meshStandardMaterial color={COLORS.woodLt} roughness={0.9} />
        </mesh>
      )
    }
  }

  return <group position={[x, 0, z]}>{pipes}{planks}</group>
}

function PracticalLight({ position }: { position: [number, number, number] }) {
  return (
    <group>
      <pointLight position={position} intensity={0.8} color={0xffe0b0} distance={60} decay={2} />
      <mesh position={position}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={0xffeebb} />
      </mesh>
      {/* Volumetric cone */}
      <mesh position={[position[0], position[1] - 8, position[2]]}>
        <cylinderGeometry args={[0.15, 5, 16, 12, 1, true]} />
        <meshBasicMaterial color={0xffe8c0} transparent opacity={0.012} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

function MaterialPile({ position, type }: { position: [number, number, number]; type: 'beams' | 'crates' }) {
  if (type === 'beams') {
    return (
      <group position={position}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[Math.random() * 0.3, i * 0.15, Math.random() * 0.3]}>
            <boxGeometry args={[4, 0.14, 0.14]} />
            <meshStandardMaterial color={COLORS.steel} metalness={0.4} />
          </mesh>
        ))}
      </group>
    )
  }
  return (
    <group position={position}>
      {Array.from({ length: 3 }, (_, i) => {
        const h = 0.6 + Math.random() * 0.3
        return (
          <mesh key={i} position={[i * 0.9 - 0.9, h / 2, Math.random() * 0.3]}>
            <boxGeometry args={[0.8 + Math.random() * 0.4, h, 0.8]} />
            <meshStandardMaterial color={COLORS.woodLt} roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

export function Warehouse() {
  return (
    <group>
      {/* Floor — polished concrete warehouse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 450, 50, 45]} />
        <meshStandardMaterial
          color={COLORS.floor}
          roughness={0.75}
          metalness={0.08}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Subtle floor grid — construction site markings */}
      <gridHelper args={[500, 80, 0x2a2535, 0x201a2a]} position={[0, 0.02, 0]}>
        <meshBasicMaterial transparent opacity={0.1} />
      </gridHelper>

      {/* Floor detail lines — construction zone tape markers */}
      {[-100, -50, 0, 50, 100].map(x => (
        <mesh key={`fl-${x}`} position={[x, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 300]} />
          <meshBasicMaterial color={COLORS.amber} transparent opacity={0.06} />
        </mesh>
      ))}
      {[-75, 0, 75].map(z => (
        <mesh key={`fl2-${z}`} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.2, 450]} />
          <meshBasicMaterial color={COLORS.amber} transparent opacity={0.04} />
        </mesh>
      ))}

      {/* Walls — massive warehouse */}
      <Wall width={500} height={45} position={[0, 22.5, -230]} />
      <Wall width={450} height={45} position={[-250, 22.5, -30]} rotationY={Math.PI / 2} />
      <Wall width={450} height={45} position={[250, 22.5, -30]} rotationY={Math.PI / 2} />

      {/* Ceiling beams — spanning the warehouse */}
      {Array.from({ length: 22 }, (_, i) => {
        const z = -160 + i * 16
        return (
          <mesh key={`cb-${i}`} position={[0, 43, z]} castShadow>
            <boxGeometry args={[500, 1, 1.2]} />
            <meshStandardMaterial color={COLORS.woodDk} roughness={0.85} />
          </mesh>
        )
      })}
      {Array.from({ length: 30 }, (_, i) => {
        const x = -225 + i * 16
        return (
          <mesh key={`cb2-${i}`} position={[x, 42, 0]}>
            <boxGeometry args={[1, 0.8, 350]} />
            <meshStandardMaterial color={COLORS.woodDk} roughness={0.85} />
          </mesh>
        )
      })}

      {/* Columns — reduced grid (every other column removed for perf) */}
      {[-200, -100, 0, 100, 200].flatMap(x =>
        [-120, -30, 60, 120].map(z => (
          <group key={`col-${x}-${z}`}>
            <mesh position={[x, 22, z]}>
              <cylinderGeometry args={[0.7, 0.85, 44, 6]} />
              <meshStandardMaterial color={COLORS.steel} metalness={0.4} roughness={0.6} />
            </mesh>
          </group>
        ))
      )}

      {/* Practical lights — reduced to 9 for performance */}
      {([
        [-120, 38, -60], [0, 38, 0], [120, 38, -60],
        [-120, 38, 60], [120, 38, 60], [0, 38, -120],
        [0, 38, 80], [-180, 38, 0], [180, 38, 0],
      ] as [number, number, number][]).map((p, i) => (
        <PracticalLight key={i} position={p} />
      ))}

      {/* Wireframe rooms */}
      {ROOMS.map((room) => (
        <WireframeRoom key={room.name} {...room} />
      ))}

      {/* Scaffolding */}
      {SCAFFOLD_POSITIONS.map((s, i) => (
        <Scaffolding key={i} x={s.x} z={s.z} levels={s.levels} />
      ))}

      {/* Material piles — scattered across the warehouse */}
      <MaterialPile position={[12, 0, -40]} type="beams" />
      <MaterialPile position={[-20, 0, 30]} type="crates" />
      <MaterialPile position={[50, 0, 12]} type="beams" />
      <MaterialPile position={[-50, 0, 20]} type="crates" />
      <MaterialPile position={[-80, 0, -60]} type="beams" />
      <MaterialPile position={[80, 0, -60]} type="crates" />
      <MaterialPile position={[0, 0, 80]} type="beams" />
      <MaterialPile position={[-120, 0, 0]} type="crates" />
    </group>
  )
}

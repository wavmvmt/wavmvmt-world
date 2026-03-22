'use client'

import { type ReactNode } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS, ROOMS, SCAFFOLD_POSITIONS } from '@/lib/roomConfig'

function Wall({ width, height, position, rotationY = 0 }: {
  width: number; height: number; position: [number, number, number]; rotationY?: number
}) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={COLORS.concrete} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  )
}

function WireframeRoom({ name, x, z, w, d, h, color, buildPct }: {
  name: string; x: number; z: number; w: number; d: number; h: number; color: number; buildPct: number
}) {
  return (
    <group position={[x, 0, z]}>
      {/* Wireframe outline */}
      <lineSegments position={[0, h / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>

      {/* Build fill (rising from floor) */}
      {buildPct > 0 && (
        <>
          <mesh position={[0, (h * buildPct / 100) / 2, 0]}>
            <boxGeometry args={[w - 0.1, h * buildPct / 100, d - 0.1]} />
            <meshStandardMaterial
              color={color} transparent
              opacity={0.04 + (buildPct / 100) * 0.06}
              roughness={1}
            />
          </mesh>
          {/* Top cap glow */}
          <mesh position={[0, h * buildPct / 100, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w, d]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* Floor grid */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d, Math.floor(w), Math.floor(d)]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.06} />
      </mesh>

      {/* Floating room label */}
      <Html position={[0, h + 0.5, 0]} center distanceFactor={20}>
        <div style={{
          color: `#${color.toString(16).padStart(6, '0')}`,
          fontSize: '11px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          opacity: 0.6,
          textShadow: '0 0 8px rgba(0,0,0,0.5)',
          userSelect: 'none',
        }}>
          {name} · {buildPct}%
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
      <pointLight position={position} intensity={0.5} color={0xffe0b0} distance={25} decay={2} />
      <mesh position={position}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={0xffeebb} />
      </mesh>
      {/* Volumetric cone */}
      <mesh position={[position[0], position[1] - 4, position[2]]}>
        <cylinderGeometry args={[0.1, 2.5, 8, 12, 1, true]} />
        <meshBasicMaterial color={0xffe8c0} transparent opacity={0.015} side={THREE.DoubleSide} depthWrite={false} />
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
      {/* Floor — massive warehouse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 140]} />
        <meshStandardMaterial color={COLORS.floor} roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Grid overlay */}
      <gridHelper args={[200, 50, 0x2a2535, 0x201a2a]} position={[0, 0.01, 0]}>
        <meshBasicMaterial transparent opacity={0.15} />
      </gridHelper>

      {/* Walls — expanded warehouse */}
      <Wall width={200} height={18} position={[0, 9, -60]} />
      <Wall width={140} height={18} position={[-100, 9, 0]} rotationY={Math.PI / 2} />
      <Wall width={140} height={18} position={[100, 9, 0]} rotationY={Math.PI / 2} />

      {/* Ceiling beams — spanning the warehouse */}
      {Array.from({ length: 15 }, (_, i) => {
        const z = -60 + i * 9
        return (
          <mesh key={`cb-${i}`} position={[0, 17, z]} castShadow>
            <boxGeometry args={[200, 0.6, 0.8]} />
            <meshStandardMaterial color={COLORS.woodDk} roughness={0.85} />
          </mesh>
        )
      })}
      {Array.from({ length: 20 }, (_, i) => {
        const x = -90 + i * 10
        return (
          <mesh key={`cb2-${i}`} position={[x, 16.5, 0]}>
            <boxGeometry args={[0.6, 0.5, 140]} />
            <meshStandardMaterial color={COLORS.woodDk} roughness={0.85} />
          </mesh>
        )
      })}

      {/* Columns with copper bands — grid across warehouse */}
      {[-80, -60, -40, -20, 0, 20, 40, 60, 80].flatMap(x =>
        [-50, -30, -10, 10, 30, 50].map(z => (
          <group key={`col-${x}-${z}`}>
            <mesh position={[x, 9, z]} castShadow>
              <cylinderGeometry args={[0.35, 0.45, 18, 8]} />
              <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[x, 3, z]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.48, 0.06, 8, 16]} />
              <meshStandardMaterial color={COLORS.copper} metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        ))
      )}

      {/* Practical lights — spread across warehouse */}
      {([
        [-40, 15, -20], [0, 15, 0], [40, 15, -20], [-40, 15, 20], [40, 15, 20],
        [-70, 15, 0], [70, 15, 0], [0, 15, -40], [0, 15, 40],
        [-30, 15, -40], [30, 15, -40], [-30, 15, 40], [30, 15, 40],
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

      {/* Material piles */}
      <MaterialPile position={[5, 0, -17]} type="beams" />
      <MaterialPile position={[-8, 0, 13]} type="crates" />
      <MaterialPile position={[20, 0, 5]} type="beams" />
      <MaterialPile position={[-20, 0, 9]} type="crates" />
    </group>
  )
}

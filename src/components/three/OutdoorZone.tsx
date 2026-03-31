'use client'

import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { OUTDOOR_ZONES } from '@/lib/roomConfig'
import { COLORS } from '@/lib/roomConfig'

/** Wireframe outlines of the outdoor campus — visible beyond the warehouse walls */
function FieldOutline({ x, z, w, d, name, color }: { x: number; z: number; w: number; d: number; name: string; color: number }) {
  const hexColor = `#${color.toString(16).padStart(6, '0')}`

  return (
    <group position={[x, 0, z]}>
      {/* Ground outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial color={color} transparent opacity={0.15} />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color={color} transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* Corner posts */}
      {[[-w/2, -d/2], [w/2, -d/2], [-w/2, d/2], [w/2, d/2]].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, 1.5, cz]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 4]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Label */}
      <Html position={[0, 4, 0]} center distanceFactor={80}>
        <div style={{
          color: hexColor,
          fontSize: '11px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textShadow: `0 0 10px ${hexColor}40`,
          whiteSpace: 'nowrap',
          opacity: 0.5,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {name}
        </div>
        <div style={{
          color: 'rgba(255,220,180,0.25)',
          fontSize: '8px',
          textAlign: 'center',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          PHASE 3 · OUTDOOR CAMPUS
        </div>
      </Html>
    </group>
  )
}

/** Parking garage wireframe — multi-level structure */
function GarageOutline({ x, z, w, d, h }: { x: number; z: number; w: number; d: number; h: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Floor plates — 3 levels */}
      {[0, 10, 20].map((y, i) => (
        <group key={i}>
          <lineSegments position={[0, y, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(w, 0.3, d)]} />
            <lineBasicMaterial color={COLORS.steel} transparent opacity={0.12} />
          </lineSegments>
          {/* Columns */}
          {[[-w/2 + 5, -d/2 + 5], [w/2 - 5, -d/2 + 5], [-w/2 + 5, d/2 - 5], [w/2 - 5, d/2 - 5]].map(([cx, cz], j) => (
            <mesh key={j} position={[cx, y + 5, cz]}>
              <boxGeometry args={[0.5, 10, 0.5]} />
              <meshBasicMaterial color={COLORS.steel} transparent opacity={0.08} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Rooftop terrace railing */}
      <lineSegments position={[0, h, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, 2, d)]} />
        <lineBasicMaterial color={COLORS.gold} transparent opacity={0.1} />
      </lineSegments>

      <Html position={[0, h + 3, 0]} center distanceFactor={80}>
        <div style={{
          color: '#f0c674',
          fontSize: '10px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.4,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          Parking Garage + Rooftop Terrace
        </div>
      </Html>
    </group>
  )
}

/** Skatepark bowl outline */
function SkateparkOutline({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Bowl — half-sphere depression */}
      <mesh position={[0, -2, -10]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={COLORS.lavender} transparent opacity={0.05} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Street section — rails and ledges */}
      {[-15, -8, 0, 8, 15].map((rx, i) => (
        <mesh key={i} position={[rx, 0.4, 15]}>
          <boxGeometry args={[0.1, 0.8, 12]} />
          <meshBasicMaterial color={COLORS.lavender} transparent opacity={0.1} />
        </mesh>
      ))}

      {/* Quarter pipe */}
      <mesh position={[0, 2, 25]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshBasicMaterial color={COLORS.lavender} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Soccer field markings — center circle, penalty boxes, goal posts */
function SoccerMarkings({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  const lineColor = COLORS.cream
  const lineOpacity = 0.08
  const mat = <meshBasicMaterial color={lineColor} transparent opacity={lineOpacity} side={THREE.DoubleSide} />

  return (
    <group position={[x, 0.06, z]}>
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[14, 14.3, 32]} />
        {mat}
      </mesh>
      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 8]} />
        {mat}
      </mesh>
      {/* Halfway line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, d]} />
        {mat}
      </mesh>

      {/* Penalty boxes — both ends */}
      {[-1, 1].map((side, i) => (
        <group key={i}>
          {/* Penalty area (large box) */}
          <lineSegments position={[side * (w / 2 - 16), 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(32, 55)]} />
            <lineBasicMaterial color={lineColor} transparent opacity={lineOpacity} />
          </lineSegments>
          {/* Goal area (small box) */}
          <lineSegments position={[side * (w / 2 - 6), 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(12, 22)]} />
            <lineBasicMaterial color={lineColor} transparent opacity={lineOpacity} />
          </lineSegments>
          {/* Penalty spot */}
          <mesh position={[side * (w / 2 - 18), 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 6]} />
            {mat}
          </mesh>
          {/* Goal posts */}
          <group position={[side * w / 2, 0, 0]}>
            {/* Crossbar */}
            <mesh position={[0, 3.5, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 11, 6]} />
              <meshLambertMaterial color={0xffffff} transparent opacity={0.25} />
            </mesh>
            {/* Posts */}
            {[-5.5, 5.5].map((pz, j) => (
              <mesh key={j} position={[0, 1.75, pz]}>
                <cylinderGeometry args={[0.1, 0.1, 3.5, 6]} />
                <meshLambertMaterial color={0xffffff} transparent opacity={0.25} />
              </mesh>
            ))}
            {/* Net (wireframe plane behind goal) */}
            <mesh position={[side * -2, 1.75, 0]}>
              <boxGeometry args={[3, 3.5, 11]} />
              <meshBasicMaterial color={0xffffff} transparent opacity={0.02} wireframe />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

/** Retractable tent/roof structure over the sports field */
function RetractableRoof({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  const archCount = 6
  const roofH = 25

  return (
    <group position={[x, 0, z]}>
      {/* Arched steel trusses */}
      {Array.from({ length: archCount }, (_, i) => {
        const zPos = -d / 2 + (i / (archCount - 1)) * d
        return (
          <group key={i}>
            {/* Arch — approximated with 8 segments */}
            {Array.from({ length: 9 }, (_, j) => {
              const t0 = (j / 8) * Math.PI
              const t1 = ((j + 1) / 8) * Math.PI
              const x0 = Math.cos(t0) * w / 2
              const y0 = Math.sin(t0) * roofH
              const x1 = Math.cos(t1) * w / 2
              const y1 = Math.sin(t1) * roofH
              const midX = (x0 + x1) / 2
              const midY = (y0 + y1) / 2
              const len = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
              const angle = Math.atan2(y1 - y0, x1 - x0)

              return (
                <mesh key={j} position={[midX, midY, zPos]} rotation={[0, 0, angle]}>
                  <cylinderGeometry args={[0.15, 0.15, len, 4]} />
                  <meshBasicMaterial color={COLORS.steel} transparent opacity={0.08} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* Fabric panels between arches (the retractable part) */}
      {Array.from({ length: archCount - 1 }, (_, i) => {
        const zPos = -d / 2 + ((i + 0.5) / (archCount - 1)) * d
        return (
          <mesh key={`fabric-${i}`} position={[0, roofH * 0.85, zPos]}>
            <planeGeometry args={[w * 0.9, d / archCount * 0.8]} />
            <meshBasicMaterial color={COLORS.cream} transparent opacity={0.03} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Label */}
      <Html position={[0, roofH + 3, 0]} center distanceFactor={100}>
        <div style={{
          color: 'rgba(255,220,180,0.3)',
          fontSize: '9px',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          RETRACTABLE ROOF · YEAR-ROUND PLAY
        </div>
      </Html>
    </group>
  )
}

export function OutdoorZone() {
  return (
    <group>
      {/* Sports field */}
      <FieldOutline x={0} z={-320} w={160} d={100} name="Sports Field" color={COLORS.sage} />

      {/* Soccer markings on the field */}
      <SoccerMarkings x={0} z={-320} w={140} d={80} />

      {/* Retractable roof over the field */}
      <RetractableRoof x={0} z={-320} w={160} d={100} />

      {/* Skatepark */}
      <SkateparkOutline x={-140} z={-320} />

      {/* Parking Garage */}
      <GarageOutline x={160} z={-320} w={70} d={80} h={30} />

      {/* Outdoor Training */}
      <FieldOutline x={140} z={-280} w={60} d={50} name="Outdoor Training" color={COLORS.amber} />

      {/* Sprint track lines */}
      {[-2, -1, 0, 1, 2].map((lane, i) => (
        <mesh key={i} position={[140 + lane * 3, 0.02, -280]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 40]} />
          <meshBasicMaterial color={COLORS.amber} transparent opacity={0.08} />
        </mesh>
      ))}

      {/* Connecting path from warehouse to outdoor */}
      <mesh position={[0, 0.02, -240]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 50]} />
        <meshBasicMaterial color={COLORS.gold} transparent opacity={0.04} />
      </mesh>
    </group>
  )
}

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

interface CityPin {
  name: string
  lat: number
  lon: number
  status: 'active' | 'planning' | 'coming_soon'
  country: string
}

const CITIES: CityPin[] = [
  { name: 'Toronto', lat: 43.65, lon: -79.38, status: 'active', country: 'Canada' },
  { name: 'New York', lat: 40.71, lon: -74.01, status: 'planning', country: 'USA' },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24, status: 'coming_soon', country: 'USA' },
  { name: 'London', lat: 51.51, lon: -0.13, status: 'coming_soon', country: 'UK' },
  { name: 'Dubai', lat: 25.20, lon: 55.27, status: 'coming_soon', country: 'UAE' },
  { name: 'Tokyo', lat: 35.68, lon: 139.69, status: 'coming_soon', country: 'Japan' },
  { name: 'Sydney', lat: -33.87, lon: 151.21, status: 'coming_soon', country: 'Australia' },
  { name: 'Miami', lat: 25.76, lon: -80.19, status: 'coming_soon', country: 'USA' },
  { name: 'Berlin', lat: 52.52, lon: 13.41, status: 'coming_soon', country: 'Germany' },
  { name: 'Seoul', lat: 37.57, lon: 126.98, status: 'coming_soon', country: 'South Korea' },
  { name: 'Lagos', lat: 6.52, lon: 3.38, status: 'coming_soon', country: 'Nigeria' },
  { name: 'Mumbai', lat: 19.08, lon: 72.88, status: 'coming_soon', country: 'India' },
]

function latLonToXYZ(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

const STATUS_COLORS = {
  active: COLORS.gold,
  planning: COLORS.sage,
  coming_soon: COLORS.steel,
}

/**
 * Giant rotating globe outside the warehouse showing WAVMVMT's
 * global expansion plan. Toronto pulses as the active location.
 * Future cities shown as dim pins.
 */
let _fs_GlobalEx = 0
export function GlobalExpansionGlobe() {
  const globeRef = useRef<THREE.Group>(null)
  const torontoPinRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if ((_fs_GlobalEx = (_fs_GlobalEx + 1) % 4) !== 0) return
    const t = state.clock.elapsedTime
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.05 // slow rotation
    }
    if (torontoPinRef.current) {
      // Pulse the Toronto pin
      const scale = 1 + Math.sin(t * 3) * 0.3
      torontoPinRef.current.scale.set(scale, scale, scale)
    }
  })

  const GLOBE_RADIUS = 12
  const GLOBE_POS: [number, number, number] = [80, 18, -350]

  return (
    <group position={GLOBE_POS}>
      {/* Pedestal */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[3, 4, 4, 8]} />
        <meshLambertMaterial color={COLORS.concrete} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 3, 1, 8]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>

      {/* Globe group — rotates */}
      <group ref={globeRef}>
        {/* Wireframe sphere — landmass hint */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 24, 16]} />
          <meshBasicMaterial color={COLORS.sage} wireframe transparent opacity={0.08} />
        </mesh>

        {/* Solid inner sphere — dark */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS - 0.1, 24, 16]} />
          <meshLambertMaterial color={0x1a1520} transparent opacity={0.6} />
        </mesh>

        {/* Latitude lines */}
        {[-60, -30, 0, 30, 60].map((lat, i) => {
          const r = GLOBE_RADIUS * Math.cos(lat * Math.PI / 180)
          const y = GLOBE_RADIUS * Math.sin(lat * Math.PI / 180)
          return (
            <mesh key={`lat-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[r - 0.02, r + 0.02, 32]} />
              <meshBasicMaterial color={COLORS.sage} transparent opacity={0.06} side={THREE.DoubleSide} />
            </mesh>
          )
        })}

        {/* City pins */}
        {CITIES.map((city, i) => {
          const [x, y, z] = latLonToXYZ(city.lat, city.lon, GLOBE_RADIUS + 0.3)
          const color = STATUS_COLORS[city.status]
          const isActive = city.status === 'active'

          return (
            <group key={city.name} position={[x, y, z]}>
              {/* Pin sphere */}
              <mesh ref={isActive ? torontoPinRef : undefined}>
                <sphereGeometry args={[isActive ? 0.5 : 0.25, 8, 8]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={isActive ? 0.9 : 0.3}
                />
              </mesh>

              {/* Glow for active */}
              {isActive && (
                <pointLight color={COLORS.gold} intensity={0.5} distance={5} decay={2} />
              )}

              {/* Pin stem */}
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.8, 4]} />
                <meshBasicMaterial color={color} transparent opacity={isActive ? 0.7 : 0.15} />
              </mesh>

              {/* Label */}
              <Html position={[0, 1.2, 0]} center distanceFactor={40}>
                <div style={{
                  fontSize: isActive ? '10px' : '7px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#f0c674' : 'rgba(255,220,180,0.25)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  textShadow: isActive ? '0 0 8px rgba(240,198,116,0.4)' : 'none',
                }}>
                  {city.name}
                  {isActive && (
                    <span style={{ fontSize: '7px', color: '#80d4a8', marginLeft: '4px' }}>ACTIVE</span>
                  )}
                  {city.status === 'planning' && (
                    <span style={{ fontSize: '6px', color: 'rgba(128,212,168,0.4)', marginLeft: '3px' }}>PLANNING</span>
                  )}
                </div>
              </Html>
            </group>
          )
        })}
      </group>

      {/* Inner glow */}
      <pointLight color={COLORS.sage} intensity={0.3} distance={GLOBE_RADIUS * 2} decay={2} />

      {/* Title above globe */}
      <Html position={[0, GLOBE_RADIUS + 5, 0]} center distanceFactor={60}>
        <div style={{ textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{
            fontSize: '14px',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#f0c674',
            letterSpacing: '0.2em',
            textShadow: '0 0 12px rgba(240,198,116,0.3)',
          }}>
            WAVMVMT WORLDWIDE
          </div>
          <div style={{
            fontSize: '9px',
            color: 'rgba(255,220,180,0.3)',
            letterSpacing: '0.15em',
            marginTop: '4px',
          }}>
            A CENTER IN EVERY MAJOR CITY
          </div>
          <div style={{
            fontSize: '8px',
            color: 'rgba(128,212,168,0.3)',
            marginTop: '2px',
          }}>
            1 Active · {CITIES.filter(c => c.status === 'planning').length} Planning · {CITIES.filter(c => c.status === 'coming_soon').length} Coming Soon
          </div>
        </div>
      </Html>
    </group>
  )
}

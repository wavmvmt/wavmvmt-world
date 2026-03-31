import { detectPerformanceLevel } from '@/lib/performanceMode'
const _dLevel = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/** Tower crane — rotates slowly, cable swings */
let _fs_Construc = 0
function TowerCrane({ position }: { position: [number, number, number] }) {
  const boomRef = useRef<THREE.Group>(null)
  const cableRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if ((_fs_Construc = (_fs_Construc + 1) % 3) !== 0) return
    const t = state.clock.elapsedTime
    if (boomRef.current) {
      boomRef.current.rotation.y = Math.sin(t * 0.08) * 0.6
    }
    if (cableRef.current) {
      cableRef.current.rotation.z = Math.sin(t * 0.3) * 0.05
      cableRef.current.rotation.x = Math.cos(t * 0.25) * 0.03
    }
  })

  const craneMat = <meshLambertMaterial color={COLORS.amber} />
  const steelMat = <meshLambertMaterial color={COLORS.steel} />

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 4]} />
        <meshLambertMaterial color={0x3a3030} />
      </mesh>

      {/* Tower — vertical mast */}
      <mesh position={[0, 22, 0]}>
        <boxGeometry args={[1.2, 40, 1.2]} />
        {craneMat}
      </mesh>

      {/* Cross bracing on tower */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, 5 + i * 5, 0]} rotation={[0, i % 2 ? 0.785 : -0.785, 0]}>
          <boxGeometry args={[0.1, 0.1, 2]} />
          {steelMat}
        </mesh>
      ))}

      {/* Boom arm — rotates */}
      <group ref={boomRef} position={[0, 42, 0]}>
        {/* Main boom */}
        <mesh position={[12, 0, 0]}>
          <boxGeometry args={[28, 0.8, 0.8]} />
          {craneMat}
        </mesh>
        {/* Counter-boom */}
        <mesh position={[-6, 0, 0]}>
          <boxGeometry args={[10, 0.6, 0.6]} />
          {craneMat}
        </mesh>
        {/* Counterweight */}
        <mesh position={[-10, -0.5, 0]}>
          <boxGeometry args={[3, 2, 2]} />
          <meshLambertMaterial color={0x3a3030} />
        </mesh>

        {/* Cable and hook */}
        <group ref={cableRef} position={[18, 0, 0]}>
          <mesh position={[0, -8, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 16, 4]} />
            {steelMat}
          </mesh>
          {/* Hook */}
          <mesh position={[0, -16.5, 0]}>
            <torusGeometry args={[0.4, 0.08, 6, 12, Math.PI * 1.5]} />
            {steelMat}
          </mesh>
        </group>

        {/* Trolley on boom */}
        <mesh position={[18, -0.6, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          {steelMat}
        </mesh>
      </group>

      {/* Top cap */}
      <mesh position={[0, 43, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        {craneMat}
      </mesh>

      {/* Warning light */}
      <mesh position={[0, 43.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={0xff4444} />
      </mesh>
      <pointLight position={[0, 43.5, 0]} intensity={0.3} color={0xff4444} distance={8} decay={2} />
    </group>
  )
}

/** Forklift — small, drives back and forth */
function Forklift({ position, route }: { position: [number, number, number]; route: [number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime * 0.3
    const progress = (Math.sin(t) + 1) / 2
    groupRef.current.position.x = position[0] + (route[0] - position[0]) * progress
    groupRef.current.position.z = position[2] + (route[1] - position[2]) * progress
    groupRef.current.rotation.y = Math.sin(t) > 0 ? 0 : Math.PI
  })

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.8, 2]} />
        <meshLambertMaterial color={COLORS.amber} />
      </mesh>
      {/* Cab */}
      <mesh position={[0, 1.1, -0.3]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshLambertMaterial color={COLORS.amber} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.55, -0.3]}>
        <boxGeometry args={[1.2, 0.08, 1.2]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
      {/* Forks */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 1.2]}>
          <boxGeometry args={[0.12, 0.06, 1.2]} />
          <meshLambertMaterial color={COLORS.steel} />
        </mesh>
      ))}
      {/* Mast */}
      <mesh position={[0, 0.8, 0.7]}>
        <boxGeometry args={[0.8, 1.4, 0.1]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
      {/* Wheels */}
      {[[-0.5, -0.7], [0.5, -0.7], [-0.5, 0.5], [0.5, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 8]} />
          <meshLambertMaterial color={0x1a1015} />
        </mesh>
      ))}
    </group>
  )
}

/** Concrete mixer — parked near construction */
function ConcreteMixer({ position }: { position: [number, number, number] }) {
  const drumRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (drumRef.current) {
      drumRef.current.rotation.x = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group position={position}>
      {/* Truck body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.5, 1.2, 5]} />
        <meshLambertMaterial color={0x4a4040} />
      </mesh>
      {/* Cab */}
      <mesh position={[0, 1.3, 2.5]}>
        <boxGeometry args={[2.2, 1.2, 1.5]} />
        <meshLambertMaterial color={COLORS.amber} />
      </mesh>
      {/* Drum — rotating */}
      <mesh ref={drumRef} position={[0, 2.2, -0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[1.2, 0.8, 3.5, 10]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>
      {/* Wheels */}
      {[-1, 1].flatMap(x =>
        [-1.5, 0, 1.5].map((z, i) => (
          <mesh key={`${x}-${i}`} position={[x * 1.1, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
            <meshLambertMaterial color={0x1a1015} />
          </mesh>
        ))
      )}
    </group>
  )
}

function ConstructionEquipmentInner() {
  return (
    <group>
      {/* Tower cranes — visible from everywhere */}
      <TowerCrane position={[-160, 0, -100]} />
      <TowerCrane position={[170, 0, -60]} />

      {/* Forklifts — moving around */}
      <Forklift position={[-30, 0, 30]} route={[30, 30]} />
      <Forklift position={[60, 0, -40]} route={[60, -80]} />
      <Forklift position={[-80, 0, -120]} route={[-80, -160]} />

      {/* Concrete mixer — parked near Parkour Gym */}
      <ConcreteMixer position={[-50, 0, -40]} />
    </group>
  )
}

import * as _React from 'react'
// Distance-culled export
export function ConstructionEquipment() {
  const [visible, setVisible] = _React.useState(false)
  _React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800)
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const inRange = x > -270 && x < 270 && z > -270 && z < 270
      setVisible(inRange)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => { clearTimeout(t); window.removeEventListener('playerMove', onMove as EventListener) }
  }, [])
  return visible ? <ConstructionEquipmentInner /> : null
}

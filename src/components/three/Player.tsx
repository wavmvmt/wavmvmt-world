'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const SPEED = 5.5
const JUMP_FORCE = 7.5
const GRAVITY = -20
const GROUND_Y = 0

export function Player() {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  const { camera } = useThree()

  const state = useRef({
    velocity: new THREE.Vector3(),
    onGround: true,
    yaw: 0,
    pitch: 0,
    keys: new Set<string>(),
    locked: false,
    walkPhase: 0,
  })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    state.current.keys.add(e.key.toLowerCase())
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    state.current.keys.delete(e.key.toLowerCase())
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!state.current.locked) return
    state.current.yaw -= e.movementX * 0.002
    state.current.pitch -= e.movementY * 0.002
    state.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, state.current.pitch))
  }, [])

  const handleClick = useCallback(() => {
    document.body.requestPointerLock()
  }, [])

  const handleLockChange = useCallback(() => {
    state.current.locked = document.pointerLockElement === document.body
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    document.addEventListener('pointerlockchange', handleLockChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handleLockChange)
    }
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handleClick, handleLockChange])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const s = state.current
    const pos = groupRef.current.position

    // Movement direction
    const forward = new THREE.Vector3(-Math.sin(s.yaw), 0, -Math.cos(s.yaw))
    const right = new THREE.Vector3(Math.cos(s.yaw), 0, -Math.sin(s.yaw))

    const moveDir = new THREE.Vector3()
    if (s.keys.has('w')) moveDir.add(forward)
    if (s.keys.has('s')) moveDir.sub(forward)
    if (s.keys.has('a')) moveDir.sub(right)
    if (s.keys.has('d')) moveDir.add(right)

    if (moveDir.length() > 0) {
      moveDir.normalize()
      pos.x += moveDir.x * SPEED * delta
      pos.z += moveDir.z * SPEED * delta
      s.walkPhase += delta * 8
    }

    // Jump
    if ((s.keys.has(' ') || s.keys.has('space')) && s.onGround) {
      s.velocity.y = JUMP_FORCE
      s.onGround = false
    }

    // Gravity
    s.velocity.y += GRAVITY * delta
    pos.y += s.velocity.y * delta

    if (pos.y <= GROUND_Y) {
      pos.y = GROUND_Y
      s.velocity.y = 0
      s.onGround = true
    }

    // Bounds
    pos.x = Math.max(-28, Math.min(28, pos.x))
    pos.z = Math.max(-18, Math.min(18, pos.z))

    // Rotate player to face movement direction
    if (moveDir.length() > 0) {
      groupRef.current.rotation.y = Math.atan2(moveDir.x, moveDir.z)
    }

    // Leg animation
    if (leftLegRef.current && rightLegRef.current) {
      const legSwing = moveDir.length() > 0 ? Math.sin(s.walkPhase) * 0.4 : 0
      leftLegRef.current.rotation.x = legSwing
      rightLegRef.current.rotation.x = -legSwing
    }

    // Camera follows player (third person)
    const camOffset = new THREE.Vector3(
      Math.sin(s.yaw) * 6,
      3.5 + Math.sin(s.pitch) * 2,
      Math.cos(s.yaw) * 6
    )
    camera.position.lerp(pos.clone().add(camOffset), 0.08)
    camera.lookAt(pos.x, pos.y + 1.5, pos.z)
  })

  const outlineMat = <meshBasicMaterial color={COLORS.outline} side={THREE.BackSide} />

  return (
    <group ref={groupRef} position={[0, 0, 12]}>
      {/* Body */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.85, 10]} />
        <meshStandardMaterial color={0x3a7a7a} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.1, 0]} scale={[1.08, 1.08, 1.08]}>
        <cylinderGeometry args={[0.18, 0.24, 0.85, 10]} />
        {outlineMat}
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color={0xf0c898} roughness={0.8} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.92, -0.02]} scale={[1, 0.65, 1.1]}>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color={0x1a1015} roughness={0.9} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.09, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.6, 6]} />
        <meshStandardMaterial color={0x2a2535} roughness={0.9} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.09, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.6, 6]} />
        <meshStandardMaterial color={0x2a2535} roughness={0.9} />
      </mesh>
    </group>
  )
}

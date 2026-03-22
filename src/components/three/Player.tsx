'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS, ROOMS } from '@/lib/roomConfig'

const WALK_SPEED = 18
const SPRINT_SPEED = 32
const JUMP_FORCE = 7.5
const GRAVITY = -20
const GROUND_Y = 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function playFootstep(s: any, impact = false) {
  if (!s.audioCtx) {
    try { s.audioCtx = new AudioContext() } catch { return }
  }
  const ctx = s.audioCtx as AudioContext
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = impact ? 50 + Math.random() * 30 : 100 + Math.random() * 60
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(impact ? 0.04 : 0.015, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + (impact ? 0.15 : 0.08))
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = impact ? 200 : 400
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + (impact ? 0.2 : 0.1))
}

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
    cameraShake: 0,
    lastFootstep: 0,
    audioCtx: null as AudioContext | null,
    speedOverride: 0, // 0 means no override
  })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    state.current.keys.add(e.key.toLowerCase())
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    state.current.keys.delete(e.key.toLowerCase())
  }, [])

  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // On mobile, accept mouse events from touch controls (no pointer lock needed)
    if (!state.current.locked && !isMobile) return
    state.current.yaw -= e.movementX * 0.002
    state.current.pitch -= e.movementY * 0.002
    state.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, state.current.pitch))
  }, [isMobile])

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

    // Vehicle speed override
    const handleSpeedOverride = (e: Event) => {
      state.current.speedOverride = (e as CustomEvent).detail.speed
    }
    window.addEventListener('speedOverride', handleSpeedOverride as EventListener)

    // Trampoline boost jump
    const handleBoost = (e: Event) => {
      const { force } = (e as CustomEvent).detail
      state.current.velocity.y = force
      state.current.onGround = false
    }
    window.addEventListener('boostJump', handleBoost as EventListener)

    return () => {
      window.removeEventListener('speedOverride', handleSpeedOverride as EventListener)
      window.removeEventListener('boostJump', handleBoost as EventListener)
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

    const sprinting = s.keys.has('shift')
    const speed = s.speedOverride > 0 ? s.speedOverride : (sprinting ? SPRINT_SPEED : WALK_SPEED)

    if (moveDir.length() > 0) {
      moveDir.normalize()
      const newX = pos.x + moveDir.x * speed * delta
      const newZ = pos.z + moveDir.z * speed * delta

      // Wall collision — slide along room walls instead of passing through
      let blockedX = false
      let blockedZ = false
      const PLAYER_R = 1.5

      for (const room of ROOMS) {
        const left = room.x - room.w / 2 - PLAYER_R
        const right = room.x + room.w / 2 + PLAYER_R
        const front = room.z - room.d / 2 - PLAYER_R
        const back = room.z + room.d / 2 + PLAYER_R

        // Check if new position is inside room wall band (2 units thick)
        const inXBand = newX > left && newX < right
        const inZBand = newZ > front && newZ < back
        const wasInXBand = pos.x > left && pos.x < right
        const wasInZBand = pos.z > front && pos.z < back

        if (inXBand && inZBand) {
          // Inside room bounds — only block if near a wall edge (not deep inside)
          const distToLeft = Math.abs(newX - left)
          const distToRight = Math.abs(newX - right)
          const distToFront = Math.abs(newZ - front)
          const distToBack = Math.abs(newZ - back)
          const minDist = Math.min(distToLeft, distToRight, distToFront, distToBack)

          if (minDist < 3) {
            // Near a wall — block the axis that crossed
            if (!wasInXBand && inXBand) blockedX = true
            if (!wasInZBand && inZBand) blockedZ = true
            if (wasInXBand && wasInZBand) {
              // Already inside, let them out
            } else if (!blockedX && !blockedZ) {
              // Block whichever axis has smaller penetration
              if (distToLeft < distToRight && distToLeft < distToFront && distToLeft < distToBack) blockedX = true
              else if (distToRight < distToFront && distToRight < distToBack) blockedX = true
              else blockedZ = true
            }
          }
        }
      }

      if (!blockedX) pos.x = newX
      if (!blockedZ) pos.z = newZ
      s.walkPhase += delta * (sprinting ? 12 : 8)

      // Footstep sounds — dispatch to AmbientAudio system
      if (s.onGround && s.walkPhase - s.lastFootstep > (sprinting ? 1.5 : 2.2)) {
        s.lastFootstep = s.walkPhase
        window.dispatchEvent(new CustomEvent('playFootstep'))
      }
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
      // Camera shake on hard landing
      if (!s.onGround && s.velocity.y < -5) {
        s.cameraShake = Math.min(0.15, Math.abs(s.velocity.y) * 0.015)
        window.dispatchEvent(new CustomEvent('playFootstep')) // impact sound
      }
      pos.y = GROUND_Y
      s.velocity.y = 0
      s.onGround = true
    }

    // Decay camera shake
    if (s.cameraShake > 0) s.cameraShake *= 0.85

    // Bounds — massive warehouse with recovery wing
    pos.x = Math.max(-240, Math.min(240, pos.x))
    pos.z = Math.max(-220, Math.min(160, pos.z))

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

    // Dispatch position for minimap
    window.dispatchEvent(new CustomEvent('playerMove', { detail: { x: pos.x, z: pos.z } }))

    // Camera follows player (third person — pulled back for scale)
    const shake = s.cameraShake
    const camOffset = new THREE.Vector3(
      Math.sin(s.yaw) * 10 + (shake > 0.001 ? (Math.random() - 0.5) * shake * 2 : 0),
      5 + Math.sin(s.pitch) * 3 + (shake > 0.001 ? (Math.random() - 0.5) * shake : 0),
      Math.cos(s.yaw) * 10
    )
    camera.position.lerp(pos.clone().add(camOffset), 0.07)
    camera.lookAt(pos.x, pos.y + 2, pos.z)
  })

  const outlineMat = <meshBasicMaterial color={COLORS.outline} side={THREE.BackSide} />

  return (
    <group ref={groupRef} position={[0, 0, 12]}>
      {/* Shadow blob under player */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 12]} />
        <meshBasicMaterial color={0x000000} transparent opacity={0.15} depthWrite={false} />
      </mesh>

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

      {/* Eyes */}
      {[-1, 1].map(s => (
        <group key={`eye-${s}`}>
          <mesh position={[s * 0.07, 1.84, 0.16]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          <mesh position={[s * 0.07, 1.84, 0.19]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={0x1a1520} />
          </mesh>
          <mesh position={[s * 0.055, 1.86, 0.2]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
        </group>
      ))}

      {/* Scarf / bandana — flowing teal accent */}
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[0.2, 0.035, 6, 12]} />
        <meshStandardMaterial color={0x3a7a7a} roughness={0.7} />
      </mesh>
      {/* Scarf tail */}
      <mesh position={[0.15, 1.45, -0.12]} rotation={[0.3, 0.2, -0.5]}>
        <boxGeometry args={[0.06, 0.2, 0.03]} />
        <meshStandardMaterial color={0x3a7a7a} roughness={0.7} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.27, 1.15, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.04, 0.045, 0.55, 6]} />
        <meshStandardMaterial color={0x3a7a7a} roughness={0.85} />
      </mesh>
      <mesh position={[0.27, 1.15, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.04, 0.045, 0.55, 6]} />
        <meshStandardMaterial color={0x3a7a7a} roughness={0.85} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.09, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.065, 0.55, 6]} />
        <meshStandardMaterial color={0x2a2535} roughness={0.9} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.09, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.065, 0.55, 6]} />
        <meshStandardMaterial color={0x2a2535} roughness={0.9} />
      </mesh>

      {/* Boots */}
      <mesh position={[-0.09, 0.06, 0.03]}>
        <boxGeometry args={[0.1, 0.1, 0.16]} />
        <meshStandardMaterial color={0x3a2a1a} roughness={0.85} />
      </mesh>
      <mesh position={[0.09, 0.06, 0.03]}>
        <boxGeometry args={[0.1, 0.1, 0.16]} />
        <meshStandardMaterial color={0x3a2a1a} roughness={0.85} />
      </mesh>

      {/* Outline shell */}
      <mesh position={[0, 1.1, 0]} scale={[1.1, 1.1, 1.1]}>
        <cylinderGeometry args={[0.18, 0.24, 0.85, 10]} />
        {outlineMat}
      </mesh>
    </group>
  )
}

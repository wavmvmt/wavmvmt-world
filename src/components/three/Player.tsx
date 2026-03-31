'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS, ROOMS } from '@/lib/roomConfig'

const WALK_SPEED = 12
const SPRINT_SPEED = 22
const JUMP_FORCE = 7.5
const GRAVITY = -20
const GROUND_Y = 0
const EYE_LEVEL = 8
const BASE_FOV = 55
const SPRINT_FOV = 62
const MOUSE_SENSITIVITY = 0.002
const ACCEL_FACTOR = 8
const CAM_LERP = 0.18
const BOB_AMPLITUDE = 0.08
const BOB_FREQUENCY = 6

export function Player() {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Mesh>(null)
  const rightLegRef = useRef<THREE.Mesh>(null)

  const { camera } = useThree()

  const state = useRef({
    velocity: new THREE.Vector3(),
    smoothVel: new THREE.Vector3(),
    onGround: true,
    yaw: 0,
    pitch: 0,
    keys: new Set<string>(),
    locked: false,
    walkPhase: 0,
    cameraShake: 0,
    lastFootstep: 0,
    speedOverride: 0,
    currentFov: BASE_FOV,
    currentRoom: '',
  })

  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    state.current.keys.add(e.key.toLowerCase())
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    state.current.keys.delete(e.key.toLowerCase())
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!state.current.locked && !isMobile) return
    const sensitivity = isMobile ? 0.005 : MOUSE_SENSITIVITY
    const mx = e.movementX || 0
    const my = e.movementY || 0
    state.current.yaw -= mx * sensitivity
    state.current.pitch -= my * sensitivity
    state.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, state.current.pitch))
  }, [isMobile])

  const handleClick = useCallback(() => {
    try {
      document.body.requestPointerLock()
    } catch {
      // Pointer lock not supported or denied
    }
  }, [])

  const handleLockChange = useCallback(() => {
    state.current.locked = document.pointerLockElement === document.body
  }, [])

  useEffect(() => {
    const handleTouchLook = (e: Event) => {
      const { dx, dy } = (e as CustomEvent).detail
      state.current.yaw -= dx * 0.006
      state.current.pitch -= dy * 0.004
      state.current.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, state.current.pitch))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchLook', handleTouchLook)
    window.addEventListener('click', handleClick)
    document.addEventListener('pointerlockchange', handleLockChange)

    const handleSpeedOverride = (e: Event) => {
      state.current.speedOverride = (e as CustomEvent).detail.speed
    }
    window.addEventListener('speedOverride', handleSpeedOverride as EventListener)

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
      window.removeEventListener('touchLook', handleTouchLook)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('pointerlockchange', handleLockChange)
    }
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handleClick, handleLockChange])

  // Pre-allocated vectors — reused every frame, zero GC pressure
  const _forward = useRef(new THREE.Vector3()).current
  const _right = useRef(new THREE.Vector3()).current
  const _moveDir = useRef(new THREE.Vector3()).current
  const _targetVel = useRef(new THREE.Vector3()).current

  useFrame((threeState, delta) => {
    if (!groupRef.current) return
    const s = state.current
    const pos = groupRef.current.position
    const clampedDelta = Math.min(delta, 0.05) // prevent huge jumps on tab-switch

    // Movement direction — reuse pre-allocated vectors (no GC)
    _forward.set(-Math.sin(s.yaw), 0, -Math.cos(s.yaw))
    _right.set(Math.cos(s.yaw), 0, -Math.sin(s.yaw))
    _moveDir.set(0, 0, 0)

    const moveDir = _moveDir
    if (s.keys.has('w')) moveDir.add(_forward)
    if (s.keys.has('s')) moveDir.sub(_forward)
    if (s.keys.has('a')) moveDir.sub(_right)
    if (s.keys.has('d')) moveDir.add(_right)

    const sprinting = s.keys.has('shift')
    const speed = s.speedOverride > 0 ? s.speedOverride : (sprinting ? SPRINT_SPEED : WALK_SPEED)
    const isMoving = moveDir.length() > 0

    // Smooth acceleration / deceleration via lerp
    _targetVel.set(0, 0, 0)
    if (isMoving) {
      moveDir.normalize()
      _targetVel.copy(moveDir).multiplyScalar(speed)
    }
    s.smoothVel.lerp(_targetVel, clampedDelta * ACCEL_FACTOR)

    // Apply smoothed velocity
    const newX = pos.x + s.smoothVel.x * clampedDelta
    const newZ = pos.z + s.smoothVel.z * clampedDelta

    // Wall collision — slide along room walls
    let blockedX = false
    let blockedZ = false
    const PLAYER_R = 1.5

    for (const room of ROOMS) {
      const left = room.x - room.w / 2 - PLAYER_R
      const rRight = room.x + room.w / 2 + PLAYER_R
      const front = room.z - room.d / 2 - PLAYER_R
      const back = room.z + room.d / 2 + PLAYER_R

      const inXBand = newX > left && newX < rRight
      const inZBand = newZ > front && newZ < back
      const wasInXBand = pos.x > left && pos.x < rRight
      const wasInZBand = pos.z > front && pos.z < back

      if (inXBand && inZBand) {
        const distToLeft = Math.abs(newX - left)
        const distToRight = Math.abs(newX - rRight)
        const distToFront = Math.abs(newZ - front)
        const distToBack = Math.abs(newZ - back)
        const minDist = Math.min(distToLeft, distToRight, distToFront, distToBack)

        if (minDist < 3) {
          if (!wasInXBand && inXBand) blockedX = true
          if (!wasInZBand && inZBand) blockedZ = true
          if (wasInXBand && wasInZBand) {
            // Already inside, let them out
          } else if (!blockedX && !blockedZ) {
            if (distToLeft < distToRight && distToLeft < distToFront && distToLeft < distToBack) blockedX = true
            else if (distToRight < distToFront && distToRight < distToBack) blockedX = true
            else blockedZ = true
          }
        }
      }
    }

    if (!blockedX) pos.x = newX
    if (!blockedZ) pos.z = newZ

    // Walk phase for animations
    const currentSpeed = s.smoothVel.length()
    if (currentSpeed > 0.5) {
      s.walkPhase += clampedDelta * (sprinting ? 12 : 8)

      // Footstep sounds
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
    s.velocity.y += GRAVITY * clampedDelta
    pos.y += s.velocity.y * clampedDelta

    if (pos.y <= GROUND_Y) {
      if (!s.onGround && s.velocity.y < -5) {
        s.cameraShake = Math.min(0.15, Math.abs(s.velocity.y) * 0.015)
        window.dispatchEvent(new CustomEvent('playFootstep'))
      }
      pos.y = GROUND_Y
      s.velocity.y = 0
      s.onGround = true
    }

    // Decay camera shake
    if (s.cameraShake > 0) s.cameraShake *= 0.85

    // Bounds
    pos.x = Math.max(-270, Math.min(270, pos.x))
    pos.z = Math.max(-400, Math.min(240, pos.z))

    // Rotate player model
    if (isMoving) {
      groupRef.current.rotation.y = Math.atan2(moveDir.x, moveDir.z)
    }

    // Leg animation
    if (leftLegRef.current && rightLegRef.current) {
      const legSwing = currentSpeed > 0.5 ? Math.sin(s.walkPhase) * 0.4 : 0
      leftLegRef.current.rotation.x = legSwing
      rightLegRef.current.rotation.x = -legSwing
    }

    // Detect current room for events
    let nearestRoom = ''
    for (const room of ROOMS) {
      const dx = pos.x - room.x
      const dz = pos.z - room.z
      if (Math.abs(dx) < room.w / 2 + 15 && Math.abs(dz) < room.d / 2 + 15) {
        nearestRoom = room.name
        break
      }
    }
    if (nearestRoom !== s.currentRoom) {
      s.currentRoom = nearestRoom
    }

    // Dispatch position + room for minimap and UI
    window.dispatchEvent(new CustomEvent('playerMove', {
      detail: { x: pos.x, z: pos.z, room: s.currentRoom },
    }))

    // Camera bob while walking
    const bobOffset = currentSpeed > 1
      ? Math.sin(s.walkPhase * BOB_FREQUENCY) * BOB_AMPLITUDE * Math.min(currentSpeed / WALK_SPEED, 1)
      : 0

    // Sprint FOV — smooth lerp
    const targetFov = sprinting && currentSpeed > 5 ? SPRINT_FOV : BASE_FOV
    s.currentFov += (targetFov - s.currentFov) * clampedDelta * 6
    const cam = threeState.camera as THREE.PerspectiveCamera
    if (cam.fov !== undefined) {
      cam.fov = s.currentFov
      cam.updateProjectionMatrix()
    }

    // Camera follows player
    const shake = s.cameraShake
    const camDist = 8
    const camHeight = EYE_LEVEL - 4 + Math.sin(s.pitch) * 3
    const camOffset = new THREE.Vector3(
      Math.sin(s.yaw) * camDist + (shake > 0.001 ? (Math.random() - 0.5) * shake * 2 : 0),
      camHeight + bobOffset + (shake > 0.001 ? (Math.random() - 0.5) * shake : 0),
      Math.cos(s.yaw) * camDist,
    )
    camera.position.lerp(pos.clone().add(camOffset), CAM_LERP)
    camera.lookAt(pos.x, pos.y + 2.2 + bobOffset * 0.3, pos.z)
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

      {/* Scarf / bandana */}
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[0.2, 0.035, 6, 12]} />
        <meshStandardMaterial color={0x3a7a7a} roughness={0.7} />
      </mesh>
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

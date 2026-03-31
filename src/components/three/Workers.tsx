'use client'

/**
 * Workers — OPTIMIZED LOD VERSION
 *
 * PERFORMANCE FIX: The original Worker component used 26 geometries + 24 unique materials
 * per worker = ~300 draw calls for 12 workers on medium.
 *
 * This version uses LOD (Level of Detail) based on perf level:
 *   LOW:    Skip workers entirely
 *   MEDIUM: SimplWorker — 5 boxes + 1 sphere = 6 draw calls, shared materials, no Html
 *   HIGH:   DetailedWorker — Full original with all geometry (only max 18 workers)
 *
 * Draw call budget:
 *   Medium: 12 workers × 6 meshes = 72 draw calls (was ~300)
 *   High:   18 workers × 26 meshes = 468 (was 696 at 24 workers — reduced count too)
 */

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, SKIN_TONES, WORKER_DATA, WORKER_POSITIONS } from '@/lib/roomConfig'
import { detectPerformanceLevel, getPerfSettings } from '@/lib/performanceMode'

const _perfLevel = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'
const _perf = typeof window !== 'undefined' ? getPerfSettings(_perfLevel) : getPerfSettings('medium')

const HTML_SHOW_DIST = 16
const ANIM_SKIP_DIST = 40

const SPEECH_LINES = [
  'Building the future!', 'Almost got this wall up', 'Hand me that wrench',
  'Looking good so far', 'This is gonna be epic', 'One brick at a time',
  'Need more nails over here', 'The vision is real', 'Watch your step!',
  'Coffee break soon?', 'Check these blueprints', 'Measure twice, cut once',
]

// ─── SHARED MATERIALS (created once, shared across all workers) ───────────────
// This is the #1 draw call reducer — unique materials = unique draw calls
const _materials: Record<string, THREE.MeshBasicMaterial> = {}
function getSharedMat(colorHex: number, opacity = 1): THREE.MeshBasicMaterial {
  const key = `${colorHex}_${opacity}`
  if (!_materials[key]) {
    _materials[key] = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: opacity < 1,
      opacity,
    })
  }
  return _materials[key]
}

// ─── SHARED GEOMETRIES (created once, reused) ─────────────────────────────────
let _headGeo: THREE.BoxGeometry | null = null
let _torsoGeo: THREE.BoxGeometry | null = null
let _limbGeo: THREE.BoxGeometry | null = null
let _legGeo: THREE.BoxGeometry | null = null
let _hatGeo: THREE.BoxGeometry | null = null

function getHeadGeo() { return _headGeo ?? (_headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55)) }
function getTorsoGeo() { return _torsoGeo ?? (_torsoGeo = new THREE.BoxGeometry(0.6, 0.8, 0.35)) }
function getLimbGeo() { return _limbGeo ?? (_limbGeo = new THREE.BoxGeometry(0.18, 0.55, 0.18)) }
function getLegGeo() { return _legGeo ?? (_legGeo = new THREE.BoxGeometry(0.22, 0.65, 0.22)) }
function getHatGeo() { return _hatGeo ?? (_hatGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6)) }

// ─── INSTANCED WORKERS (medium quality — 4 draw calls for ALL workers) ────────
// THREE.InstancedMesh: 1 DC per geometry type regardless of worker count
// 72 DC (8 workers × 9 meshes) → 4 DC total

const _iDummy = new THREE.Object3D()
const _iColor = new THREE.Color()

function InstancedWorkers({ positions }: { positions: [number, number][] }) {
  const n = positions.length
  const headMRef = useRef<THREE.InstancedMesh>(null)
  const hatMRef  = useRef<THREE.InstancedMesh>(null)
  const torsoMRef= useRef<THREE.InstancedMesh>(null)
  const legMRef  = useRef<THREE.InstancedMesh>(null)
  const phases   = useRef(positions.map(() => Math.random() * Math.PI * 2))
  const fskip    = useRef(0)

  const torsoColors = [0x2a4a8a, 0x1a4a2a, 0x4a2a1a, 0x2a1a4a, 0x3a3a1a, 0x4a1a2a]
  const pantsColors = [0x1a2a4a, 0x2a1a1a, 0x1a2a1a, 0x2a2a1a, 0x1a1a2a, 0x2a1a2a]

  // Set initial matrices + per-instance colors
  useEffect(() => {
    const initMesh = (ref: React.RefObject<THREE.InstancedMesh | null>, colorFn: (i: number) => number, getY: (i: number) => number) => {
      if (!ref.current) return
      ref.current.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3)
      positions.forEach((pos, i) => {
        _iDummy.position.set(pos[0], getY(i), pos[1])
        _iDummy.updateMatrix()
        ref.current!.setMatrixAt(i, _iDummy.matrix)
        _iColor.setHex(colorFn(i))
        ref.current!.setColorAt(i, _iColor)
      })
      ref.current.instanceMatrix.needsUpdate = true
      ref.current.instanceColor!.needsUpdate = true
    }

    initMesh(headMRef,  i => SKIN_TONES[i % SKIN_TONES.length],                       _ => 2.15)
    initMesh(hatMRef,   i => WORKER_DATA[i % WORKER_DATA.length].hat,                  _ => 2.55)
    initMesh(torsoMRef, i => torsoColors[i % torsoColors.length],                      _ => 1.4)
    initMesh(legMRef,   i => pantsColors[Math.floor(i/2) % pantsColors.length],        i => 0.55)
  }, [n])

  // Animate — update head + hat Y for idle bob (throttled)
  useFrame((_, delta) => {
    fskip.current = (fskip.current + 1) % 3
    if (fskip.current !== 0) return
    phases.current.forEach((_, i) => { phases.current[i] += delta * 2 })
    
    positions.forEach((pos, i) => {
      const bob = Math.abs(Math.sin(phases.current[i] * 0.8)) * 0.006
      _iDummy.position.set(pos[0], 2.15 + bob, pos[1])
      _iDummy.updateMatrix()
      headMRef.current?.setMatrixAt(i, _iDummy.matrix)
      _iDummy.position.set(pos[0], 2.55 + bob, pos[1])
      _iDummy.updateMatrix()
      hatMRef.current?.setMatrixAt(i, _iDummy.matrix)
    })
    if (headMRef.current) headMRef.current.instanceMatrix.needsUpdate = true
    if (hatMRef.current)  hatMRef.current.instanceMatrix.needsUpdate  = true
  })

  const sharedLambertMat = useMemo(() => new THREE.MeshLambertMaterial({ vertexColors: true }), [])

  return (
    <>
      <instancedMesh ref={headMRef}  args={[getHeadGeo(),  sharedLambertMat, n]} />
      <instancedMesh ref={hatMRef}   args={[getHatGeo(),   sharedLambertMat, n]} />
      <instancedMesh ref={torsoMRef} args={[getTorsoGeo(), sharedLambertMat, n]} />
      <instancedMesh ref={legMRef}   args={[getLegGeo(),   sharedLambertMat, n * 2]} />
    </>
  )
}

// ─── SIMPLE WORKER (medium quality — 6 meshes, shared geo/mat) ───────────────
function SimpleWorker({ position, index }: { position: [number, number]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Mesh>(null)
  const phase = useRef(Math.random() * Math.PI * 2)
  const distRef = useRef(999)
  const skipFrame = useRef(0)

  const info = WORKER_DATA[index % WORKER_DATA.length]
  const skin = SKIN_TONES[index % SKIN_TONES.length]
  const animType = ['hammer', 'idle', 'walk', 'hammer', 'idle'][index % 5]

  // Pre-resolve materials at mount (not per-frame)
  const skinMat = useMemo(() => getSharedMat(skin), [skin])
  const torsoColors = [0x2a4a8a, 0x1a4a2a, 0x4a2a1a, 0x2a1a4a, 0x3a3a1a, 0x4a1a2a]
  const torsoMat = useMemo(() => getSharedMat(torsoColors[index % torsoColors.length]), [index])
  const pantsColors = [0x1a2a4a, 0x2a1a1a, 0x1a2a1a, 0x2a2a1a, 0x1a1a2a, 0x2a1a2a]
  const pantsMat = useMemo(() => getSharedMat(pantsColors[index % pantsColors.length]), [index])
  const hatMat = useMemo(() => getSharedMat(info.hat ?? 0xf0c674), [info.hat])
  const shoesMat = useMemo(() => getSharedMat(0x1a1010), [])

  useFrame((state, delta) => {
    skipFrame.current = (skipFrame.current + 1) % 3
    const cam = state.camera.position
    distRef.current = Math.sqrt((cam.x - position[0]) ** 2 + (cam.z - position[1]) ** 2)
    if (distRef.current > ANIM_SKIP_DIST && skipFrame.current !== 0) return

    phase.current += delta * 2.5
    const t = phase.current

    if (!groupRef.current) return
    // Breathing
    groupRef.current.scale.y = 1 + Math.sin(t * 0.8) * 0.008

    if (armRef.current) {
      if (animType === 'hammer') {
        armRef.current.rotation.z = -0.4 + Math.sin(t * 2) * 0.9
      } else if (animType === 'walk') {
        armRef.current.rotation.z = Math.sin(t * 1.2) * 0.4
        groupRef.current.position.x = position[0] + Math.sin(t * 0.25) * 3.5
        groupRef.current.position.z = position[1] + Math.cos(t * 0.18) * 2
        groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.4
      } else {
        armRef.current.rotation.z = Math.sin(t * 0.6) * 0.15
      }
    }
  })

  return (
    <group ref={groupRef} position={[position[0], 0, position[1]]}>
      {/* Head */}
      <mesh geometry={getHeadGeo()} material={skinMat} position={[0, 2.15, 0]} />
      {/* Hard hat */}
      <mesh geometry={getHatGeo()} material={hatMat} position={[0, 2.55, 0]} />
      {/* Torso */}
      <mesh geometry={getTorsoGeo()} material={torsoMat} position={[0, 1.4, 0]} />
      {/* Right arm (animated) */}
      <mesh ref={armRef} geometry={getLimbGeo()} material={skinMat} position={[0.4, 1.35, 0]} />
      {/* Left arm */}
      <mesh geometry={getLimbGeo()} material={skinMat} position={[-0.4, 1.35, 0]} />
      {/* Legs */}
      <mesh geometry={getLegGeo()} material={pantsMat} position={[-0.14, 0.55, 0]} />
      <mesh geometry={getLegGeo()} material={pantsMat} position={[0.14, 0.55, 0]} />
      {/* Shoes */}
      <mesh geometry={getHatGeo()} material={shoesMat} position={[-0.14, 0.08, 0.05]} />
      <mesh geometry={getHatGeo()} material={shoesMat} position={[0.14, 0.08, 0.05]} />
    </group>
  )
}

// ─── DETAILED WORKER (high quality — original full geometry) ─────────────────
// Toon gradient — singleton, shared by ALL DetailedWorker instances
let _toonGradient: THREE.DataTexture | null = null
function getToonGradient(): THREE.DataTexture {
  if (_toonGradient) return _toonGradient
  const colors = new Uint8Array(4)
  colors[0] = 80; colors[1] = 160; colors[2] = 220; colors[3] = 255
  _toonGradient = new THREE.DataTexture(colors, 4, 1, THREE.RedFormat)
  _toonGradient.minFilter = THREE.NearestFilter
  _toonGradient.magFilter = THREE.NearestFilter
  _toonGradient.needsUpdate = true
  return _toonGradient
}

function DetailedWorker({ position, index }: { position: [number, number]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)

  const info = WORKER_DATA[index % WORKER_DATA.length]
  const skin = SKIN_TONES[index % SKIN_TONES.length]
  const phase = useRef(Math.random() * Math.PI * 2)
  const type = ['hammer', 'measure', 'walk', 'dance', 'hammer', 'walk', 'weld', 'carry', 'idle', 'dance'][index % 10]
  const toonGradient = getToonGradient()
  const [speech, setSpeech] = useState<string | null>(null)
  const nextSpeechRef = useRef(5 + Math.random() * 15)
  const distRef = useRef(999)
  const skipFrame = useRef(0)

  useFrame((state, delta) => {
    skipFrame.current = (skipFrame.current + 1) % 2
    const px = state.camera.position
    distRef.current = Math.sqrt((px.x - position[0]) ** 2 + (px.z - position[1]) ** 2)
    if (distRef.current > ANIM_SKIP_DIST && skipFrame.current !== 0) return

    const t = phase.current
    phase.current += delta * 3

    if (state.clock.elapsedTime > nextSpeechRef.current) {
      setSpeech(SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)])
      nextSpeechRef.current = state.clock.elapsedTime + 12 + Math.random() * 20
      setTimeout(() => setSpeech(null), 3000 + Math.random() * 2000)
    }

    if (!leftArmRef.current || !rightArmRef.current || !headRef.current) return
    if (groupRef.current) groupRef.current.scale.y = 1 + Math.sin(t * 0.8) * 0.008

    switch (type) {
      case 'hammer':
        rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 2) * 0.8
        leftArmRef.current.rotation.z = 0.3
        if (groupRef.current) groupRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.03
        break
      case 'measure':
        leftArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.5) * 0.15
        rightArmRef.current.rotation.z = -0.8
        headRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
        break
      case 'walk':
        leftArmRef.current.rotation.z = 0.3 + Math.sin(t) * 0.25
        rightArmRef.current.rotation.z = -0.3 - Math.sin(t) * 0.25
        if (groupRef.current) {
          groupRef.current.position.x = position[0] + Math.sin(t * 0.3) * 4
          groupRef.current.position.z = position[1] + Math.cos(t * 0.2) * 2
          groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.3
        }
        break
      case 'dance':
        leftArmRef.current.rotation.z = 0.5 + Math.sin(t * 1.5) * 0.6
        rightArmRef.current.rotation.z = -0.5 - Math.sin(t * 1.5 + 1) * 0.6
        headRef.current.rotation.z = Math.sin(t * 1.5) * 0.15
        if (groupRef.current) {
          groupRef.current.position.y = Math.abs(Math.sin(t * 3)) * 0.08
          groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.4
        }
        break
      default:
        leftArmRef.current.rotation.z = Math.sin(t * 0.5) * 0.1
        rightArmRef.current.rotation.z = -Math.sin(t * 0.5) * 0.1
    }
  })

  const hatColor = `#${info.hat.toString(16).padStart(6, '0')}`
  const torsoColors = [0x2a4a8a, 0x1a4a2a, 0x4a2a1a, 0x2a1a4a, 0x3a3a1a, 0x4a1a2a]
  const pantsColors = [0x1a2a4a, 0x2a1a1a, 0x1a2a1a, 0x2a2a1a, 0x1a1a2a, 0x2a1a2a]
  const shirtColor = torsoColors[index % torsoColors.length]
  const pantsColor = pantsColors[index % pantsColors.length]

  return (
    <group ref={groupRef} position={[position[0], 0, position[1]]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.28, 12, 8]} />
        <meshToonMaterial color={skin} gradientMap={toonGradient} />
      </mesh>
      {/* Hard hat */}
      <mesh position={[0, 2.55, 0]}>
        <sphereGeometry args={[0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshToonMaterial color={info.hat} gradientMap={toonGradient} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.4, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 6, 10]} />
        <meshToonMaterial color={shirtColor} gradientMap={toonGradient} />
      </mesh>
      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.38, 1.35, 0]}>
        <capsuleGeometry args={[0.06, 0.4, 4, 6]} />
        <meshToonMaterial color={skin} gradientMap={toonGradient} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.38, 1.35, 0]}>
        <capsuleGeometry args={[0.06, 0.4, 4, 6]} />
        <meshToonMaterial color={skin} gradientMap={toonGradient} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.13, 0.55, 0]}>
        <capsuleGeometry args={[0.07, 0.35, 4, 6]} />
        <meshToonMaterial color={pantsColor} gradientMap={toonGradient} />
      </mesh>
      <mesh position={[0.13, 0.55, 0]}>
        <capsuleGeometry args={[0.07, 0.35, 4, 6]} />
        <meshToonMaterial color={pantsColor} gradientMap={toonGradient} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.13, 0.1, 0.02]}>
        <capsuleGeometry args={[0.065, 0.06, 4, 6]} />
        <meshToonMaterial color={0x3a2a1a} gradientMap={toonGradient} />
      </mesh>
      <mesh position={[0.13, 0.1, 0.02]}>
        <capsuleGeometry args={[0.065, 0.06, 4, 6]} />
        <meshToonMaterial color={0x3a2a1a} gradientMap={toonGradient} />
      </mesh>

      {/* Name + speech — proximity gated */}
      {distRef.current < HTML_SHOW_DIST && (
        <Html position={[0, 2.5, 0]} center distanceFactor={10}>
          <div style={{ color: hatColor, fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            {info.name}
          </div>
        </Html>
      )}
      {speech && distRef.current < HTML_SHOW_DIST && (
        <Html position={[0, 2.9, 0]} center distanceFactor={12}>
          <div style={{ background: 'rgba(26,21,32,0.9)', border: '1px solid rgba(240,198,116,0.2)', borderRadius: '10px', padding: '4px 10px', color: 'rgba(255,220,180,0.85)', fontSize: '9px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            {speech}
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── WORKERS EXPORT ────────────────────────────────────────────────────────────
// Cull workers beyond this distance entirely — unmounts component
const WORKER_MOUNT_DIST = _perfLevel === 'medium' ? 120 : 200

function WorkerSlot({ position, index }: { position: [number, number]; index: number }) {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const dx = x - position[0], dz = z - position[1]
      setMounted(dx * dx + dz * dz < WORKER_MOUNT_DIST * WORKER_MOUNT_DIST)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [position])

  if (!mounted) return null

  return _perfLevel === 'medium'
    ? <SimpleWorker position={position} index={index} />
    : <DetailedWorker position={position} index={index} />
}

export function Workers() {
  const positions = WORKER_POSITIONS.slice(0, _perf.maxWorkers)

  // Medium: InstancedMesh = 4 draw calls for all workers (vs 72)
  if (_perfLevel === 'medium') {
    return <InstancedWorkers positions={positions} />
  }

  // High: full detailed workers with individuality
  return (
    <group>
      {positions.map((pos, i) => (
        <WorkerSlot key={i} position={pos} index={i} />
      ))}
    </group>
  )
}

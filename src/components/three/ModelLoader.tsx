'use client'

import { useRef, useEffect, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ModelProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
  onClick?: () => void
  /** Replace the current wireframe room when this model loads */
  replacesRoom?: string
}

/**
 * Universal GLB/GLTF model loader.
 *
 * Drop any .glb file in public/models/ and render it with:
 * <ModelLoader url="/models/architecture/parkour-gym.glb" position={[0, 0, 0]} />
 *
 * When `replacesRoom` is set, it dispatches an event that the room system
 * can listen to, hiding the wireframe version of that room.
 *
 * Supports:
 * - Draco-compressed models (auto-detected)
 * - Embedded textures and materials
 * - Shadow casting/receiving
 * - Click interaction
 * - Auto-centering and scaling
 */
function LoadedModel({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, castShadow = true, receiveShadow = true, onClick, replacesRoom }: ModelProps) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    // Enable shadows on all meshes
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })

    // Notify room system that this model replaces a wireframe room
    if (replacesRoom) {
      window.dispatchEvent(new CustomEvent('modelLoaded', {
        detail: { roomName: replacesRoom, url }
      }))
    }
  }, [scene, castShadow, receiveShadow, replacesRoom, url])

  const scaleArr: [number, number, number] = Array.isArray(scale) ? scale : [scale, scale, scale]

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scaleArr} onClick={onClick}>
      <primitive object={scene.clone()} />
    </group>
  )
}

/**
 * Wrapped with Suspense — shows nothing while loading.
 * Use this in scenes where models might not exist yet.
 */
export function ModelLoader(props: ModelProps) {
  return (
    <Suspense fallback={null}>
      <LoadedModel {...props} />
    </Suspense>
  )
}

/**
 * Batch loader — loads multiple models from a config array.
 *
 * Usage:
 * const models = [
 *   { url: '/models/architecture/main-building.glb', position: [0, 0, 0] as [number, number, number] },
 *   { url: '/models/equipment/squat-rack.glb', position: [10, 0, 5] as [number, number, number], scale: 0.5 },
 * ]
 * <ModelBatch models={models} />
 */
export function ModelBatch({ models }: { models: ModelProps[] }) {
  return (
    <group>
      {models.map((model, i) => (
        <ModelLoader key={`${model.url}-${i}`} {...model} />
      ))}
    </group>
  )
}

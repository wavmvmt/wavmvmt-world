'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { COLORS } from '@/lib/roomConfig'
import { Warehouse } from './three/Warehouse'
import { Workers } from './three/Workers'
import { DustMotes } from './three/DustMotes'
import { Sparks } from './three/Sparks'
import { Player } from './three/Player'
import { HUD } from './HUD'
import * as THREE from 'three'

export default function World3D() {
  return (
    <div className="w-screen h-screen relative">
      <Canvas
        shadows
        camera={{ fov: 55, near: 0.1, far: 200, position: [0, 4, 18] }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fogExp2 attach="fog" args={[0x1e1828, 0.016]} />

        {/* Ghibli lighting */}
        <ambientLight intensity={0.5} color={0x3a2850} />
        <hemisphereLight args={[0xf0d8b0, 0x2a2040, 0.4]} />
        <directionalLight
          position={[15, 20, 10]}
          intensity={0.8}
          color={0xffe0a0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {/* Accent lights */}
        <pointLight position={[-18, 4, -8]} intensity={0.2} color={COLORS.lavender} distance={18} />
        <pointLight position={[18, 4, 8]} intensity={0.15} color={COLORS.sage} distance={18} />

        <Suspense fallback={null}>
          <Warehouse />
          <Workers />
          <DustMotes />
          <Sparks />
          <Player />
        </Suspense>
      </Canvas>
      <HUD />
    </div>
  )
}

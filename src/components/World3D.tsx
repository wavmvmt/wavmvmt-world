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
        camera={{ fov: 55, near: 0.1, far: 500, position: [0, 6, 60] }}
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
        <fogExp2 attach="fog" args={[0x1e1828, 0.006]} />

        {/* Ghibli lighting */}
        <ambientLight intensity={0.5} color={0x3a2850} />
        <hemisphereLight args={[0xf0d8b0, 0x2a2040, 0.4]} />
        <directionalLight
          position={[40, 30, 25]}
          intensity={0.8}
          color={0xffe0a0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />

        {/* Accent lights — spread wide */}
        <pointLight position={[-60, 8, -25]} intensity={0.3} color={COLORS.lavender} distance={50} />
        <pointLight position={[60, 8, 25]} intensity={0.25} color={COLORS.sage} distance={50} />
        <pointLight position={[0, 8, -45]} intensity={0.2} color={COLORS.rose} distance={40} />
        <pointLight position={[0, 8, 45]} intensity={0.2} color={COLORS.sky} distance={40} />

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

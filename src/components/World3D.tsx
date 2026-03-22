'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, SMAA } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Environment } from '@react-three/drei'
import { COLORS } from '@/lib/roomConfig'
import { Warehouse } from './three/Warehouse'
import { Workers } from './three/Workers'
import { DustMotes } from './three/DustMotes'
import { Sparks } from './three/Sparks'
import { LightShafts } from './three/LightShafts'
import { Signage } from './three/Signage'
import { RoomInteriors } from './three/RoomInteriors'
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
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fogExp2 attach="fog" args={[0x1e1828, 0.005]} />

        {/* Ghibli lighting — warm and cinematic */}
        <ambientLight intensity={0.4} color={0x3a2850} />
        <hemisphereLight args={[0xf0d8b0, 0x2a2040, 0.5]} />

        {/* Main sun — golden hour */}
        <directionalLight
          position={[40, 35, 25]}
          intensity={1.0}
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
          shadow-bias={-0.0001}
        />

        {/* Secondary fill light — cooler, from opposite side */}
        <directionalLight
          position={[-30, 20, -15]}
          intensity={0.25}
          color={0xb0c8e8}
        />

        {/* Accent lights — color wash across the space */}
        <pointLight position={[-60, 10, -25]} intensity={0.4} color={COLORS.lavender} distance={60} decay={1.5} />
        <pointLight position={[60, 10, 25]} intensity={0.35} color={COLORS.sage} distance={60} decay={1.5} />
        <pointLight position={[0, 10, -45]} intensity={0.3} color={COLORS.rose} distance={50} decay={1.5} />
        <pointLight position={[0, 10, 45]} intensity={0.3} color={COLORS.sky} distance={50} decay={1.5} />
        <pointLight position={[-35, 6, -20]} intensity={0.5} color={COLORS.gold} distance={40} decay={2} />
        <pointLight position={[35, 6, -28]} intensity={0.4} color={COLORS.amber} distance={40} decay={2} />

        <Suspense fallback={null}>
          {/* Environment map for metallic reflections */}
          <Environment preset="warehouse" environmentIntensity={0.15} />

          <Warehouse />
          <Workers />
          <DustMotes />
          <Sparks />
          <LightShafts />
          <Signage />
          <RoomInteriors />
          <Player />
        </Suspense>

        {/* Post-processing — cinematic Ghibli feel */}
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette
            offset={0.3}
            darkness={0.6}
            blendFunction={BlendFunction.NORMAL}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0005, 0.0005)}
            blendFunction={BlendFunction.NORMAL}
          />
          <SMAA />
        </EffectComposer>
      </Canvas>
      <HUD />
    </div>
  )
}

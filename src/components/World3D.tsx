'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { COLORS } from '@/lib/roomConfig'
import { Warehouse } from './three/Warehouse'
import { Workers } from './three/Workers'
import { DustMotes } from './three/DustMotes'
import { Sparks } from './three/Sparks'
import { LightShafts } from './three/LightShafts'
import { Signage } from './three/Signage'
import { RoomInteriors } from './three/RoomInteriors'
import { Player } from './three/Player'
import { ConstructionEquipment } from './three/ConstructionEquipment'
import { AmbientAudio } from './three/AmbientAudio'
import { HUD } from './HUD'
import { Minimap } from './Minimap'
import * as THREE from 'three'

export default function World3D() {
  return (
    <div className="w-screen h-screen relative">
      <Canvas
        shadows
        camera={{ fov: 55, near: 0.5, far: 600, position: [0, 8, 80] }}
        gl={{
          antialias: false, // SMAA handles this cheaper
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Cap at 1.5x for perf
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fogExp2 attach="fog" args={[0x1e1828, 0.003]} /> {/* Slightly denser fog hides far objects */}

        {/* Ghibli lighting — simplified for performance */}
        <ambientLight intensity={0.5} color={0x3a2850} />
        <hemisphereLight args={[0xf0d8b0, 0x2a2040, 0.6]} />

        {/* Main sun — golden hour (only shadow caster) */}
        <directionalLight
          position={[100, 80, 60]}
          intensity={1.0}
          color={0xffe0a0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={10}
          shadow-camera-far={300}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-bias={-0.001}
        />

        {/* Fill light — no shadows */}
        <directionalLight position={[-60, 30, -30]} intensity={0.2} color={0xb0c8e8} />

        {/* Just 3 accent lights instead of 6 — enough for color wash */}
        <pointLight position={[-120, 18, -50]} intensity={0.5} color={COLORS.lavender} distance={150} decay={2} />
        <pointLight position={[120, 18, 40]} intensity={0.4} color={COLORS.sage} distance={150} decay={2} />
        <pointLight position={[0, 18, -80]} intensity={0.4} color={COLORS.rose} distance={120} decay={2} />

        <Suspense fallback={null}>
          <Warehouse />
          <Workers />
          <DustMotes />
          <Sparks />
          <LightShafts />
          <Signage />
          <RoomInteriors />
          <Player />
          <ConstructionEquipment />
          <AmbientAudio />
        </Suspense>

        {/* Post-processing — just bloom + vignette (dropped chromatic aberration + SMAA) */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette
            offset={0.3}
            darkness={0.5}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
      <HUD />
      <Minimap />
    </div>
  )
}

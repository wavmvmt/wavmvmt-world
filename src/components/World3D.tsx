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
import { ConstructionProps } from './three/ConstructionProps'
import { AmbientAudio } from './three/AmbientAudio'
import { BeatPads } from './three/BeatPads'
import { SoundBathBowls } from './three/SoundBathBowls'
import { PhaseProps } from './three/PhaseProps'
import { Skateboards } from './three/Skateboard'
import { StageSpotlight } from './three/StageSpotlight'
import { DayNightCycle } from './three/DayNightCycle'
import { NightSky } from './three/NightSky'
import { HUD } from './HUD'
import { Minimap } from './Minimap'
import { FPSCounter } from './FPSCounter'
import { SettingsPanel } from './SettingsPanel'
import { TimelapseMode } from './TimelapsMode'
import { Fireflies } from './three/Fireflies'
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
          const isMobile = window.innerWidth < 768
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fogExp2 attach="fog" args={[0x1e1828, 0.003]} /> {/* Slightly denser fog hides far objects */}

        {/* Dynamic day/night cycle — replaces static sun/ambient/hemisphere */}
        <DayNightCycle />

        {/* Fill light — no shadows */}
        <directionalLight position={[-60, 30, -30]} intensity={0.2} color={0xb0c8e8} />

        {/* Just 3 accent lights instead of 6 — enough for color wash */}
        <pointLight position={[-120, 18, -50]} intensity={0.5} color={COLORS.lavender} distance={150} decay={2} />
        <pointLight position={[120, 18, 40]} intensity={0.4} color={COLORS.sage} distance={150} decay={2} />
        <pointLight position={[0, 18, -80]} intensity={0.4} color={COLORS.rose} distance={120} decay={2} />

        <Suspense fallback={null}>
          <NightSky />
          <Fireflies />
          <Warehouse />
          <Workers />
          <DustMotes />
          <Sparks />
          <LightShafts />
          <Signage />
          <RoomInteriors />
          <Player />
          <ConstructionEquipment />
          <ConstructionProps />
          <AmbientAudio />
          <BeatPads />
          <SoundBathBowls />
          <PhaseProps />
          <Skateboards />
          <StageSpotlight />
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
      <FPSCounter />
      <SettingsPanel />
      <TimelapseMode />
    </div>
  )
}

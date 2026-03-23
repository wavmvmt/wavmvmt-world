'use client'

import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { COLORS } from '@/lib/roomConfig'
import { detectPerformanceLevel, getPerfSettings } from '@/lib/performanceMode'
import { DayNightCycle } from './three/DayNightCycle'
import { SceneContent } from './three/SceneContent'
import { UIOverlay } from './UIOverlay'
import * as THREE from 'three'

export default function World3D() {
  const perf = useMemo(() => getPerfSettings(detectPerformanceLevel()), [])

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        shadows={perf.enableShadows}
        camera={{ fov: 55, near: 0.5, far: 600, position: [0, 8, 80] }}
        gl={{
          antialias: typeof window !== 'undefined' && window.innerWidth >= 768,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          const level = detectPerformanceLevel()
          const isMobile = window.innerWidth < 768
          // Desktop gets full pixel ratio, mobile gets capped
          gl.setPixelRatio(Math.min(
            window.devicePixelRatio,
            isMobile ? (level === 'low' ? 0.75 : 1) : (level === 'low' ? 1 : 2)
          ))
          // Higher shadow quality on desktop
          if (!isMobile && gl.shadowMap) {
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fogExp2 attach="fog" args={[0x1e1828, 0.003]} />

        <DayNightCycle />
        <directionalLight position={[-60, 30, -30]} intensity={0.2} color={0xb0c8e8} />
        <pointLight position={[-120, 18, -50]} intensity={0.5} color={COLORS.lavender} distance={150} decay={2} />
        <pointLight position={[120, 18, 40]} intensity={0.4} color={COLORS.sage} distance={150} decay={2} />
        <pointLight position={[0, 18, -80]} intensity={0.4} color={COLORS.rose} distance={120} decay={2} />

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>

        {perf.enablePostProcessing && (
          <EffectComposer multisampling={typeof window !== 'undefined' && window.innerWidth >= 768 ? 8 : 4}>
            <Bloom intensity={0.35} luminanceThreshold={0.65} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette offset={0.25} darkness={0.55} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Canvas>
      <UIOverlay />
    </div>
  )
}

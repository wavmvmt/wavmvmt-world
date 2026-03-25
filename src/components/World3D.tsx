'use client'

import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  HueSaturation,
  BrightnessContrast,
  N8AO,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { COLORS } from '@/lib/roomConfig'
import { detectPerformanceLevel, getPerfSettings } from '@/lib/performanceMode'
import { DayNightCycle } from './three/DayNightCycle'
import { SceneContent } from './three/SceneContent'
import { UIOverlay } from './UIOverlay'
import * as THREE from 'three'

export default function World3D() {
  const perf = useMemo(() => getPerfSettings(detectPerformanceLevel()), [])
  const level = useMemo(() => detectPerformanceLevel(), [])
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        shadows={perf.enableShadows}
        camera={{ fov: 55, near: 0.5, far: 600, position: [0, 8, 80] }}
        gl={{
          antialias: isDesktop,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          const isMobile = window.innerWidth < 768
          gl.setPixelRatio(Math.min(
            window.devicePixelRatio,
            isMobile ? (level === 'low' ? 0.75 : 1) : (level === 'low' ? 1 : 2)
          ))
          if (!isMobile && gl.shadowMap) {
            gl.shadowMap.type = THREE.VSMShadowMap
          }

          const emitStats = () => {
            const info = gl.info
            window.dispatchEvent(new CustomEvent('rendererStats', {
              detail: {
                drawCalls: info.render?.calls || 0,
                triangles: info.render?.triangles || 0,
                points: info.render?.points || 0,
                lines: info.render?.lines || 0,
                geometries: info.memory?.geometries || 0,
                textures: info.memory?.textures || 0,
              }
            }))
          }
          window.addEventListener('requestRendererStats', emitStats)

          const takeScreenshot = () => {
            gl.domElement.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `wavmvmt-world-${Date.now()}.png`
                a.click()
                URL.revokeObjectURL(url)
              }
            })
          }
          window.addEventListener('takeScreenshot', takeScreenshot)
        }}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fogExp2 attach="fog" args={[0x1e1828, 0.0022]} />

        <DayNightCycle />

        {/* Key lights — warm fill across the warehouse */}
        <directionalLight position={[-60, 30, -30]} intensity={0.3} color={0xb0c8e8} />
        <pointLight position={[-120, 18, -50]} intensity={0.6} color={COLORS.lavender} distance={180} decay={2} />
        <pointLight position={[120, 18, 40]} intensity={0.5} color={COLORS.sage} distance={180} decay={2} />
        <pointLight position={[0, 18, -80]} intensity={0.5} color={COLORS.rose} distance={150} decay={2} />

        {/* Additional fill lights for room visibility — MEDIUM+ only */}
        {level !== 'low' && (
          <>
            <pointLight position={[-100, 12, -80]} intensity={0.3} color={COLORS.lavender} distance={100} decay={2} />
            <pointLight position={[110, 12, -90]} intensity={0.3} color={COLORS.gold} distance={100} decay={2} />
            <pointLight position={[-105, 12, 55]} intensity={0.3} color={COLORS.sky} distance={100} decay={2} />
            <pointLight position={[190, 12, -35]} intensity={0.3} color={COLORS.sage} distance={100} decay={2} />
            <pointLight position={[0, 12, -105]} intensity={0.3} color={COLORS.rose} distance={100} decay={2} />
            <pointLight position={[0, 10, 130]} intensity={0.25} color={COLORS.sage} distance={80} decay={2} />
          </>
        )}

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>

        {perf.enablePostProcessing && level === 'high' && (
          <EffectComposer multisampling={0}>
            <N8AO aoRadius={2} intensity={1.5} distanceFalloff={0.5} quality="medium" />
            <Bloom intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
            <BrightnessContrast brightness={0.02} contrast={0.08} />
            <HueSaturation hue={0} saturation={0.12} />
            <ChromaticAberration offset={new THREE.Vector2(0.0004, 0.0004)} radialModulation modulationOffset={0.5} />
            <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.15} />
            <Vignette offset={0.3} darkness={0.55} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
        {perf.enablePostProcessing && level === 'medium' && (
          <EffectComposer multisampling={isDesktop ? 4 : 0}>
            <Bloom intensity={0.35} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
            <BrightnessContrast brightness={0.02} contrast={0.06} />
            <Vignette offset={0.25} darkness={0.5} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Canvas>
      <UIOverlay />
    </div>
  )
}

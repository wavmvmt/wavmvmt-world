'use client'

import { useMemo, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { COLORS } from '@/lib/roomConfig'
import {
  detectPerformanceLevel,
  getPerfSettings,
  setPerformanceLevel,
  type PerfLevel,
} from '@/lib/performanceMode'
import { DayNightCycle } from './three/DayNightCycle'
import { SceneContent } from './three/SceneContent'
import { UIOverlay } from './UIOverlay'
import * as THREE from 'three'

export default function World3D() {
  const initialLevel = useMemo(() => detectPerformanceLevel(), [])
  const [level, setLevel] = useState<PerfLevel>(initialLevel)
  const perf = useMemo(() => getPerfSettings(level), [level])

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  // PerformanceMonitor callbacks — auto-downgrade if FPS tanks
  const onDecline = useCallback(() => {
    setLevel(prev => {
      if (prev === 'high') { setPerformanceLevel('medium'); return 'medium' }
      if (prev === 'medium') { setPerformanceLevel('low'); return 'low' }
      return prev
    })
  }, [])

  const onIncline = useCallback(() => {
    // Only upgrade if we've been stable for a while — don't upgrade on mobile
    if (!isDesktop) return
    setLevel(prev => {
      if (prev === 'low') { setPerformanceLevel('medium'); return 'medium' }
      return prev
    })
  }, [isDesktop])

  return (
    <div
      id="world-canvas"
      role="main"
      aria-label="WAVMVMT World 3D construction site"
      className="w-screen h-screen relative"
    >
      <Canvas
        shadows={perf.enableShadows}
        camera={{ fov: 55, near: 0.5, far: level === 'low' ? 200 : 350, position: [0, 8, 80] }}
        frameloop="always"
        performance={{ min: 0.5 }}
        gl={{
          antialias: isDesktop && level !== 'low',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          const isMobile = window.innerWidth < 768
          // Base pixel ratio — AdaptiveDpr handles runtime adjustments
          gl.setPixelRatio(Math.min(
            window.devicePixelRatio,
            isMobile ? 1 : (level === 'low' ? 1 : 1.5)
          ))

          // Only enable shadow maps when needed
          if (perf.enableShadows && gl.shadowMap) {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.BasicShadowMap // cheaper than VSM
          }

          const emitStats = () => {
            const info = gl.info
            window.dispatchEvent(new CustomEvent('rendererStats', {
              detail: {
                drawCalls: info.render?.calls || 0,
                triangles: info.render?.triangles || 0,
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

          // FPS cap — render at max 30fps on medium, 24fps on low (still smooth, half GPU cost)
          if (level !== 'high') {
            const targetMs = level === 'low' ? 1000 / 24 : 1000 / 30
            let lastTime = 0
            gl.setAnimationLoop((time) => {
              if (time - lastTime >= targetMs) {
                lastTime = time
                gl.render(gl.domElement as unknown as THREE.Scene, gl.domElement as unknown as THREE.Camera)
              }
            })
          }
        }}
      >
        {/* Auto-adjust pixel ratio at runtime to hit target FPS */}
        <AdaptiveDpr pixelated />

        {/* Monitor FPS — auto-downgrade if below threshold */}
        <PerformanceMonitor
          onDecline={onDecline}
          onIncline={onIncline}
          flipflops={3}
          threshold={0.9}
          bounds={(refreshRate) => [refreshRate * 0.5, refreshRate * 0.9]}
        />

        <color attach="background" args={[COLORS.bg]} />
        {/* Denser fog = shorter draw distance = fewer objects rendered */}
        {level !== 'low' && <fogExp2 attach="fog" args={[0x1e1828, level === 'medium' ? 0.004 : 0.0028]} />}

        <DayNightCycle />

        {/* Core lights — skipped on low (PotatoWarehouse has its own) */}
        {level !== 'low' && (
          <>
            <directionalLight position={[-60, 30, -30]} intensity={0.3} color={0xb0c8e8} />
            <pointLight position={[-120, 18, -50]} intensity={0.6} color={COLORS.lavender} distance={160} decay={2} />
            <pointLight position={[120, 18, 40]} intensity={0.5} color={COLORS.sage} distance={160} decay={2} />
            <pointLight position={[0, 18, -80]} intensity={0.5} color={COLORS.rose} distance={140} decay={2} />
          </>
        )}

        {/* Extra fill lights — medium+ only, reduced count */}
        {level !== 'low' && (
          <>
            <pointLight position={[-100, 12, -80]} intensity={0.3} color={COLORS.lavender} distance={90} decay={2} />
            <pointLight position={[110, 12, -90]} intensity={0.3} color={COLORS.gold} distance={90} decay={2} />
            <pointLight position={[190, 12, -35]} intensity={0.3} color={COLORS.sage} distance={90} decay={2} />
          </>
        )}

        {/* High-only extra fill */}
        {level === 'high' && (
          <>
            <pointLight position={[-105, 12, 55]} intensity={0.3} color={COLORS.sky} distance={90} decay={2} />
            <pointLight position={[0, 12, -105]} intensity={0.3} color={COLORS.rose} distance={90} decay={2} />
            <pointLight position={[0, 10, 130]} intensity={0.25} color={COLORS.sage} distance={70} decay={2} />
          </>
        )}

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>

        {/* HIGH post-processing — full pipeline */}
        {perf.enablePostProcessing && level === 'high' && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
            <BrightnessContrast brightness={0.02} contrast={0.08} />
            <Vignette offset={0.3} darkness={0.55} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}

        {/* MEDIUM post-processing — lightweight bloom only, no multisampling */}
        {perf.enablePostProcessing && level === 'medium' && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.3} luminanceThreshold={0.65} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette offset={0.25} darkness={0.45} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Canvas>
      <UIOverlay />
    </div>
  )
}

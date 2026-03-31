'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Slow day/night cycle — shifts lighting color temperature and intensity
 * over a 5-minute real-time cycle (1 in-world day = 5 min).
 *
 * Golden hour → dusk → night → dawn → golden hour
 */
export function DayNightCycle() {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const { scene } = useThree()

  // Color palettes for different times
  const sunColors = {
    golden: new THREE.Color(0xffe0a0),
    dusk: new THREE.Color(0xff9060),
    night: new THREE.Color(0x4060a0),
    dawn: new THREE.Color(0xffc080),
  }

  const fogColors = {
    golden: new THREE.Color(0x1e1828),
    dusk: new THREE.Color(0x1a1525),
    night: new THREE.Color(0x0a0815),
    dawn: new THREE.Color(0x1c1620),
  }

  const bgColors = {
    golden: new THREE.Color(0x1a1520),
    dusk: new THREE.Color(0x151018),
    night: new THREE.Color(0x080510),
    dawn: new THREE.Color(0x161220),
  }

  const tempColor = new THREE.Color()
  const tempFog = new THREE.Color()
  const tempBg = new THREE.Color()

  const frameSkip = useRef(0)
  useFrame((state) => {
    frameSkip.current = (frameSkip.current + 1) % 6
    if (frameSkip.current !== 0) return  // 10fps update — day/night is very slow
    const t = state.clock.elapsedTime
    // 5-minute cycle: 0-75s golden, 75-150s dusk, 150-225s night, 225-300s dawn
    const cycle = (t % 300) / 300 // 0 to 1 over 5 minutes

    let sunIntensity: number
    let ambientIntensity: number

    if (cycle < 0.25) {
      // Golden hour (0-25%)
      const p = cycle / 0.25
      tempColor.lerpColors(sunColors.dawn, sunColors.golden, p)
      tempFog.lerpColors(fogColors.dawn, fogColors.golden, p)
      tempBg.lerpColors(bgColors.dawn, bgColors.golden, p)
      sunIntensity = 0.8 + p * 0.2
      ambientIntensity = 0.4 + p * 0.1
    } else if (cycle < 0.5) {
      // Dusk (25-50%)
      const p = (cycle - 0.25) / 0.25
      tempColor.lerpColors(sunColors.golden, sunColors.dusk, p)
      tempFog.lerpColors(fogColors.golden, fogColors.dusk, p)
      tempBg.lerpColors(bgColors.golden, bgColors.dusk, p)
      sunIntensity = 1.0 - p * 0.4
      ambientIntensity = 0.5 - p * 0.15
    } else if (cycle < 0.75) {
      // Night (50-75%)
      const p = (cycle - 0.5) / 0.25
      tempColor.lerpColors(sunColors.dusk, sunColors.night, p)
      tempFog.lerpColors(fogColors.dusk, fogColors.night, p)
      tempBg.lerpColors(bgColors.dusk, bgColors.night, p)
      sunIntensity = 0.6 - p * 0.35
      ambientIntensity = 0.35 - p * 0.15
    } else {
      // Dawn (75-100%)
      const p = (cycle - 0.75) / 0.25
      tempColor.lerpColors(sunColors.night, sunColors.dawn, p)
      tempFog.lerpColors(fogColors.night, fogColors.dawn, p)
      tempBg.lerpColors(bgColors.night, bgColors.dawn, p)
      sunIntensity = 0.25 + p * 0.55
      ambientIntensity = 0.2 + p * 0.2
    }

    if (sunRef.current) {
      sunRef.current.color.copy(tempColor)
      sunRef.current.intensity = sunIntensity

      // Sun position rotates slightly
      const angle = cycle * Math.PI * 2
      sunRef.current.position.set(
        100 * Math.cos(angle * 0.3),
        60 + 30 * Math.sin(angle * 0.5),
        60 * Math.sin(angle * 0.3)
      )
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = ambientIntensity
    }

    if (hemiRef.current) {
      hemiRef.current.intensity = ambientIntensity + 0.1
    }

    // Update fog and background
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      (scene.fog as THREE.FogExp2).color.copy(tempFog)
    }
    scene.background = tempBg
  })

  return (
    <>
      <directionalLight
        ref={sunRef}
        position={[100, 80, 60]}
        intensity={1.0}
        color={0xffe0a0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.001}
      />
      <ambientLight ref={ambientRef} intensity={0.55} color={0x3a2850} />
      <hemisphereLight ref={hemiRef} args={[0xf0d8b0, 0x2a2040, 0.65]} />
      {/* Ground bounce — warm fill from below */}
      <directionalLight position={[0, -10, 0]} intensity={0.08} color={0xffe0a0} />
    </>
  )
}

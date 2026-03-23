'use client'

import { useRef, useEffect, useCallback } from 'react'
import { AudioAnalyzer, type BandData } from '@/lib/audioAnalyzer'

interface Props {
  analyzer: AudioAnalyzer
  isPlaying: boolean
}

/**
 * Full-screen synesthesia canvas.
 *
 * Renders 7 frequency bands as breathing, organic blobs of color.
 * Each band maps to a vertical position (gut → head → air) and
 * a color family. Amplitude controls brightness/opacity.
 * Density controls spread.
 *
 * The result is a living abstract painting that reacts to sound.
 */
export function SynesthesiaCanvas({ analyzer, isPlaying }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  // Persistent blob state for organic movement
  const blobsRef = useRef(
    Array.from({ length: 7 }, (_, i) => ({
      x: 0.5,
      y: 0,
      targetX: 0.5,
      phase: Math.random() * Math.PI * 2,
      breathPhase: Math.random() * Math.PI * 2,
      trailAmplitude: 0,
    }))
  )

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    timeRef.current += 0.016

    // Get frequency data
    const bands = analyzer.analyze()

    // Fade previous frame (creates trail effect)
    ctx.fillStyle = 'rgba(10, 8, 16, 0.12)'
    ctx.fillRect(0, 0, w, h)

    // Render each band as an organic blob
    bands.forEach((data: BandData, i: number) => {
      const blob = blobsRef.current[i]
      const { band, amplitude, density, isPeak } = data

      if (amplitude < 0.005) return // skip silent bands

      // Update blob position with organic drift
      blob.phase += 0.008 + amplitude * 0.02
      blob.breathPhase += 0.005 + density * 0.01

      // Horizontal drift — organic sine wave movement
      blob.targetX = 0.5 + Math.sin(blob.phase) * 0.2 + Math.cos(blob.phase * 0.7) * 0.1
      blob.x += (blob.targetX - blob.x) * 0.03

      // Vertical position from config
      blob.y = band.yPosition

      // Smooth amplitude trail
      blob.trailAmplitude += (amplitude - blob.trailAmplitude) * 0.08

      const cx = blob.x * w
      const cy = (1 - blob.y) * h // flip Y (0 = bottom)

      // Base radius — bigger for lower frequencies
      const baseRadius = (40 + (1 - band.yPosition) * 80) * (w / 1920)
      const radius = baseRadius * (1 + blob.trailAmplitude * band.spreadFactor * 2)

      // Breathing scale
      const breathScale = 1 + Math.sin(blob.breathPhase) * 0.15 * amplitude

      // Draw the blob — multiple layered radial gradients for softness
      const [r, g, b] = band.rgb
      const alpha = amplitude * 0.7

      // Outer glow
      const outerR = radius * breathScale * 2.5
      const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR)
      outerGrad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.3})`)
      outerGrad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.1})`)
      outerGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = outerGrad
      ctx.fillRect(cx - outerR, cy - outerR, outerR * 2, outerR * 2)

      // Core blob
      const coreR = radius * breathScale
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      coreGrad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.8})`)
      coreGrad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.4})`)
      coreGrad.addColorStop(0.7, `rgba(${r},${g},${b},${alpha * 0.1})`)
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.fill()

      // Hot center on peaks
      if (isPeak || amplitude > 0.6) {
        const hotR = radius * 0.3 * breathScale
        const hotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hotR)
        const brightness = Math.min(255, r + 80)
        hotGrad.addColorStop(0, `rgba(${brightness},${Math.min(255, g + 60)},${Math.min(255, b + 60)},${amplitude * 0.9})`)
        hotGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = hotGrad
        ctx.beginPath()
        ctx.arc(cx, cy, hotR, 0, Math.PI * 2)
        ctx.fill()
      }

      // Density particles — scattered dots when frequency is dense
      if (density > 0.3) {
        const particleCount = Math.floor(density * 8)
        for (let p = 0; p < particleCount; p++) {
          const angle = blob.phase * 2 + p * (Math.PI * 2 / particleCount)
          const dist = radius * (0.5 + Math.random() * 0.8) * breathScale
          const px = cx + Math.cos(angle) * dist
          const py = cy + Math.sin(angle) * dist
          const ps = 1 + amplitude * 3

          ctx.fillStyle = `rgba(${r},${g},${b},${amplitude * density * 0.5})`
          ctx.beginPath()
          ctx.arc(px, py, ps, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    })

    // Continue animation
    animRef.current = requestAnimationFrame(render)
  }, [analyzer])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

    // Start render loop
    animRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#0a0810' }}
    />
  )
}

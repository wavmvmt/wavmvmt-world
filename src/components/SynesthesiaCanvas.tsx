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
 * Renders 7 frequency bands as smooth, blended color gradients
 * that flow vertically (bass at bottom, brilliance at top).
 * No orbs or blobs — just clean color washes that breathe
 * and shift like a living aurora.
 *
 * Amplitude = brightness/opacity. Silence = darkness.
 */
export function SynesthesiaCanvas({ analyzer, isPlaying }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  // Smoothed values for organic breathing
  const smoothRef = useRef(new Array(7).fill(0))
  const phaseRef = useRef(new Array(7).fill(0).map(() => Math.random() * Math.PI * 2))

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    // Get frequency data
    const bands = analyzer.analyze()

    // Clear to black
    ctx.fillStyle = '#0a0810'
    ctx.fillRect(0, 0, w, h)

    // Band colors (RGB) and vertical positions
    const bandColors: [number, number, number][] = [
      [180, 20, 20],     // Sub-bass — deep red
      [220, 120, 20],    // Bass — amber
      [230, 190, 50],    // Low-mid — gold
      [40, 180, 140],    // Mid — teal
      [50, 150, 210],    // Upper-mid — cyan
      [120, 60, 200],    // Presence — violet
      [210, 210, 235],   // Brilliance — silver/white
    ]

    // Smooth the amplitudes for organic feel
    bands.forEach((data: BandData, i: number) => {
      smoothRef.current[i] += (data.amplitude - smoothRef.current[i]) * 0.08
      phaseRef.current[i] += 0.003 + data.amplitude * 0.01
    })

    // Render each band as a full-width horizontal gradient wash
    // Bands overlap and blend together for seamless look
    bands.forEach((_data: BandData, i: number) => {
      const amp = smoothRef.current[i]
      if (amp < 0.005) return

      const [r, g, b] = bandColors[i]
      const phase = phaseRef.current[i]

      // Vertical center for this band (0 = bottom, 1 = top)
      const yCenter = 1 - (i / 6) // flip: index 0 (sub-bass) at bottom
      const cy = yCenter * h

      // Band height — wider for lower frequencies, narrower for higher
      const bandHeight = h * (0.35 - i * 0.02)

      // Amplitude controls opacity
      const alpha = amp * 0.6

      // Gentle horizontal drift
      const xOffset = Math.sin(phase) * w * 0.05

      // Create a tall vertical gradient for this band
      const grad = ctx.createRadialGradient(
        w / 2 + xOffset, cy, 0,
        w / 2 + xOffset, cy, bandHeight
      )
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.6})`)
      grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.2})`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)

      // Draw full-width wash
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Add a secondary wash slightly offset for depth
      const grad2 = ctx.createRadialGradient(
        w * 0.3 - xOffset * 0.5, cy + Math.cos(phase * 0.7) * 20, 0,
        w * 0.3 - xOffset * 0.5, cy, bandHeight * 0.7
      )
      grad2.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.3})`)
      grad2.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.1})`)
      grad2.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = grad2
      ctx.fillRect(0, 0, w, h)

      // Third wash on the right side for fullness
      const grad3 = ctx.createRadialGradient(
        w * 0.7 + xOffset * 0.3, cy - Math.sin(phase * 0.5) * 15, 0,
        w * 0.7 + xOffset * 0.3, cy, bandHeight * 0.5
      )
      grad3.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.2})`)
      grad3.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.05})`)
      grad3.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = grad3
      ctx.fillRect(0, 0, w, h)
    })

    // Soft vignette overlay for depth
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.8)
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(10,8,16,0.4)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, w, h)

    animRef.current = requestAnimationFrame(render)
  }, [analyzer])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

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

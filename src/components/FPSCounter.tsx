'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface DevMetrics {
  fps: number
  frameTime: number
  drawCalls: number
  triangles: number
  points: number
  lines: number
  geometries: number
  textures: number
}

/** Dev Mode panel — press F to toggle. Shows FPS, draw calls, polygon count, frame time.
 *  Jake Lately's recommendation: build dev mode toggles for QA screenshots and performance tuning. */
export function FPSCounter() {
  const [visible, setVisible] = useState(false)
  const [metrics, setMetrics] = useState<DevMetrics>({
    fps: 0, frameTime: 0, drawCalls: 0, triangles: 0,
    points: 0, lines: 0, geometries: 0, textures: 0,
  })
  const [fpsHistory, setFpsHistory] = useState<number[]>([])
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const frameStart = useRef(performance.now())

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Listen for renderer stats from Three.js
  useEffect(() => {
    if (!visible) return

    const onStats = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail) {
        setMetrics(m => ({
          ...m,
          drawCalls: detail.drawCalls || 0,
          triangles: detail.triangles || 0,
          points: detail.points || 0,
          lines: detail.lines || 0,
          geometries: detail.geometries || 0,
          textures: detail.textures || 0,
        }))
      }
    }
    window.addEventListener('rendererStats', onStats as EventListener)
    // Request stats emission
    window.dispatchEvent(new CustomEvent('requestRendererStats'))

    return () => window.removeEventListener('rendererStats', onStats as EventListener)
  }, [visible])

  useEffect(() => {
    if (!visible) return
    let animId: number

    const tick = () => {
      frameCount.current++
      const now = performance.now()
      const ft = now - frameStart.current
      frameStart.current = now

      if (now - lastTime.current >= 1000) {
        const currentFps = frameCount.current
        setMetrics(m => ({ ...m, fps: currentFps, frameTime: ft }))
        setFpsHistory(h => [...h.slice(-59), currentFps])
        frameCount.current = 0
        lastTime.current = now
        // Request fresh renderer stats
        window.dispatchEvent(new CustomEvent('requestRendererStats'))
      }
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [visible])

  // Screenshot function
  const takeScreenshot = useCallback(() => {
    window.dispatchEvent(new CustomEvent('takeScreenshot'))
  }, [])

  if (!visible) return null

  const fpsColor = metrics.fps > 50 ? '#80d4a8' : metrics.fps > 30 ? '#f0c674' : '#e8a0bf'
  const borderColor = metrics.fps > 50 ? 'rgba(128,212,168,0.3)' : metrics.fps > 30 ? 'rgba(240,198,116,0.3)' : 'rgba(232,160,191,0.3)'

  return (
    <div className="fixed top-14 right-5 z-30 p-3 rounded-xl pointer-events-auto"
      style={{
        background: 'rgba(26,21,32,0.9)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${borderColor}`,
        minWidth: '180px',
      }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[0.5rem] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Dev Mode
        </span>
        <span className="text-[0.45rem] font-mono px-1.5 py-0.5 rounded" style={{
          background: 'rgba(128,212,168,0.1)',
          color: '#80d4a8',
        }}>
          F to close
        </span>
      </div>

      {/* FPS — large */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold font-mono" style={{ color: fpsColor }}>
          {metrics.fps}
        </span>
        <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>FPS</span>
        <span className="text-[0.5rem] font-mono ml-auto" style={{ color: 'rgba(255,220,180,0.3)' }}>
          {metrics.frameTime.toFixed(1)}ms
        </span>
      </div>

      {/* FPS sparkline */}
      <div className="h-6 mb-2 flex items-end gap-px" style={{ borderBottom: '1px solid rgba(255,200,120,0.06)' }}>
        {fpsHistory.map((f, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{
            height: `${Math.min(100, (f / 60) * 100)}%`,
            background: f > 50 ? 'rgba(128,212,168,0.4)' : f > 30 ? 'rgba(240,198,116,0.4)' : 'rgba(232,160,191,0.4)',
            minWidth: '1px',
          }} />
        ))}
      </div>

      {/* Render stats */}
      <div className="space-y-1">
        {[
          { label: 'Draw Calls', value: metrics.drawCalls, warn: 200 },
          { label: 'Triangles', value: metrics.triangles, warn: 500000 },
          { label: 'Points', value: metrics.points, warn: 100000 },
          { label: 'Geometries', value: metrics.geometries, warn: 500 },
          { label: 'Textures', value: metrics.textures, warn: 100 },
        ].map(({ label, value, warn }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.35)' }}>{label}</span>
            <span className="text-[0.55rem] font-mono font-semibold" style={{
              color: value > warn ? '#e8a0bf' : 'rgba(255,220,180,0.6)',
            }}>
              {value > 1000 ? `${(value / 1000).toFixed(1)}K` : value}
            </span>
          </div>
        ))}
      </div>

      {/* Screenshot button */}
      <button
        onClick={takeScreenshot}
        className="mt-2 w-full py-1.5 rounded-lg text-[0.55rem] tracking-wider uppercase cursor-pointer transition-all"
        style={{
          background: 'rgba(240,198,116,0.06)',
          border: '1px solid rgba(240,198,116,0.15)',
          color: 'rgba(255,220,180,0.5)',
        }}
      >
        📸 Screenshot (P)
      </button>
    </div>
  )
}

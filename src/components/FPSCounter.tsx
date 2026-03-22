'use client'

import { useState, useEffect, useRef } from 'react'

/** FPS counter — press F to toggle. Shows in top-right corner. */
export function FPSCounter() {
  const [visible, setVisible] = useState(false)
  const [fps, setFps] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!visible) return
    let animId: number

    const tick = () => {
      frameCount.current++
      const now = performance.now()
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current)
        frameCount.current = 0
        lastTime.current = now
      }
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed top-14 right-5 z-30 px-2 py-1 rounded-lg text-xs font-mono"
      style={{
        background: 'rgba(26,21,32,0.8)',
        border: `1px solid ${fps > 50 ? 'rgba(128,212,168,0.3)' : fps > 30 ? 'rgba(240,198,116,0.3)' : 'rgba(232,160,191,0.3)'}`,
        color: fps > 50 ? '#80d4a8' : fps > 30 ? '#f0c674' : '#e8a0bf',
      }}>
      {fps} FPS
    </div>
  )
}

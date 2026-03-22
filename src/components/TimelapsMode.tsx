'use client'

import { useState, useEffect, useRef } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * Timelapse mode — animates build percentages from 0 to current values.
 * Creates a "watch the world being built" experience.
 *
 * Dispatches 'timelapseProgress' events that room components can listen to
 * for overriding their buildPct during the timelapse.
 */
export function TimelapseMode() {
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0) // 0-100
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)
  const DURATION = 30000 // 30 seconds

  function startTimelapse() {
    setActive(true)
    setProgress(0)
    startTimeRef.current = performance.now()

    // Dispatch start event — cinematic camera could hook into this
    window.dispatchEvent(new CustomEvent('timelapseStart'))

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current
      const pct = Math.min(100, (elapsed / DURATION) * 100)
      setProgress(pct)

      // Dispatch progress for rooms to animate their build percentages
      window.dispatchEvent(new CustomEvent('timelapseProgress', { detail: { progress: pct / 100 } }))

      if (pct < 100) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setActive(false)
        window.dispatchEvent(new CustomEvent('timelapseEnd'))
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  function stopTimelapse() {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setActive(false)
    setProgress(0)
    window.dispatchEvent(new CustomEvent('timelapseEnd'))
    // Reset to actual values
    window.dispatchEvent(new CustomEvent('timelapseProgress', { detail: { progress: -1 } }))
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <>
      {/* Trigger button */}
      {!active && (
        <button
          onClick={startTimelapse}
          className="fixed bottom-8 md:bottom-24 left-3 md:left-5 pointer-events-auto px-4 py-2 rounded-xl text-[0.6rem] tracking-[0.15em] uppercase cursor-pointer z-10 transition-all hover:border-[rgba(240,198,116,0.4)]"
          style={{ ...panelStyle, color: '#f0c674' }}
        >
          Watch the Build
        </button>
      )}

      {/* Active timelapse overlay */}
      {active && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-30 px-6 py-3 rounded-2xl" style={panelStyle}>
          <div className="flex items-center gap-4">
            <span className="text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.5)' }}>
              Building...
            </span>
            <div className="w-40 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #f0c674, #80d4a8)',
                }}
              />
            </div>
            <span className="text-[0.55rem] font-mono" style={{ color: '#f0c674' }}>
              {Math.floor(progress)}%
            </span>
            <button
              onClick={stopTimelapse}
              className="text-[0.55rem] cursor-pointer px-2 py-1 rounded"
              style={{ color: 'rgba(255,220,180,0.4)', border: '1px solid rgba(255,200,120,0.1)' }}
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </>
  )
}

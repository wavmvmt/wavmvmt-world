'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Time-Lapse Construction Replay
 *
 * A timeline slider that lets visitors scrub through the entire
 * construction process — watching rooms fill in, equipment appear,
 * workers move in, and the facility come alive.
 *
 * Dispatches a 'timeLapseProgress' event that room components
 * listen to, overriding their buildPct temporarily.
 *
 * Press T to toggle time-lapse mode.
 */
export function TimeLapseMode() {
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0) // 0-100
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Toggle with T key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 't' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setActive(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Dispatch progress to 3D scene
  useEffect(() => {
    if (active) {
      window.dispatchEvent(new CustomEvent('timeLapseProgress', {
        detail: { progress, active: true }
      }))
    } else {
      window.dispatchEvent(new CustomEvent('timeLapseProgress', {
        detail: { progress: -1, active: false }
      }))
    }
  }, [progress, active])

  // Auto-play animation
  useEffect(() => {
    if (playing && active) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPlaying(false)
            return 100
          }
          return p + 0.3
        })
      }, 50)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, active])

  if (!active) return null

  // Construction phase labels
  const phases = [
    { at: 0, label: 'Empty Lot' },
    { at: 8, label: 'Foundation' },
    { at: 18, label: 'Framing' },
    { at: 30, label: 'Walls Up' },
    { at: 45, label: 'Interior' },
    { at: 60, label: 'Equipment' },
    { at: 75, label: 'Finishing' },
    { at: 90, label: 'Final Details' },
    { at: 100, label: 'Grand Opening' },
  ]

  const currentPhase = phases.reduce((prev, phase) =>
    progress >= phase.at ? phase : prev, phases[0])

  return (
    <div className="fixed bottom-32 md:bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[90vw] max-w-xl">
      <div className="px-5 py-4 rounded-2xl"
        style={{
          background: 'rgba(26,21,32,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(240,198,116,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(240,198,116,0.4)' }}>
              Time-Lapse Construction
            </div>
            <div className="text-sm font-bold mt-0.5" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
              {currentPhase.label}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold" style={{ color: '#f0c674' }}>
              {Math.round(progress)}%
            </span>
            <button onClick={() => setActive(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: 'rgba(255,220,180,0.05)', color: 'rgba(255,220,180,0.3)', fontSize: '0.7rem' }}>
              ✕
            </button>
          </div>
        </div>

        {/* Phase markers */}
        <div className="relative h-3 mb-1">
          {phases.map((phase) => (
            <div key={phase.at} className="absolute top-0 w-px h-3"
              style={{
                left: `${phase.at}%`,
                background: progress >= phase.at ? 'rgba(240,198,116,0.4)' : 'rgba(255,220,180,0.1)',
              }}
            />
          ))}
        </div>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={progress}
          onChange={(e) => { setProgress(Number(e.target.value)); setPlaying(false) }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f0c674 0%, #f0c674 ${progress}%, rgba(255,220,180,0.1) ${progress}%, rgba(255,220,180,0.1) 100%)`,
            outline: 'none',
          }}
        />

        {/* Phase labels under slider */}
        <div className="flex justify-between mt-1 px-0.5">
          <span className="text-[0.4rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>Empty</span>
          <span className="text-[0.4rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>Grand Opening</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-3">
          <button onClick={() => { setProgress(0); setPlaying(false) }}
            className="px-3 py-1 rounded-lg text-[0.55rem] cursor-pointer"
            style={{ border: '1px solid rgba(255,220,180,0.1)', color: 'rgba(255,220,180,0.3)' }}>
            ⏮ Reset
          </button>
          <button onClick={() => setPlaying(!playing)}
            className="px-5 py-1.5 rounded-lg text-[0.6rem] font-bold cursor-pointer"
            style={{
              background: playing ? 'rgba(225,48,108,0.1)' : 'rgba(240,198,116,0.1)',
              border: `1px solid ${playing ? 'rgba(225,48,108,0.3)' : 'rgba(240,198,116,0.3)'}`,
              color: playing ? '#e1306c' : '#f0c674',
            }}>
            {playing ? '⏸ Pause' : '▶ Play Build'}
          </button>
          <button onClick={() => { setProgress(100); setPlaying(false) }}
            className="px-3 py-1 rounded-lg text-[0.55rem] cursor-pointer"
            style={{ border: '1px solid rgba(255,220,180,0.1)', color: 'rgba(255,220,180,0.3)' }}>
            ⏭ End
          </button>
        </div>

        <p className="text-center mt-2 text-[0.4rem]" style={{ color: 'rgba(255,220,180,0.15)' }}>
          Press T to exit · Scrub the timeline to watch the build
        </p>
      </div>
    </div>
  )
}

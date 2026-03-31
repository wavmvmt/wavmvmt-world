'use client'

import { useState, useEffect } from 'react'
import { detectPerformanceLevel, setPerformanceLevel, resetPerformanceLevel, type PerfLevel } from '@/lib/performanceMode'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/** Settings panel — gear icon in top bar area */
export function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [quality, setQuality] = useState<PerfLevel>(() =>
    typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'
  )

  // Check system preference on mount
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      window.dispatchEvent(new CustomEvent('settingsChange', { detail: { reducedMotion: true } }))
    }
  }, [])

  function toggleReducedMotion() {
    const next = !reducedMotion
    setReducedMotion(next)
    window.dispatchEvent(new CustomEvent('settingsChange', { detail: { reducedMotion: next } }))
  }

  function toggleLabels() {
    const next = !showLabels
    setShowLabels(next)
    window.dispatchEvent(new CustomEvent('settingsChange', { detail: { showLabels: next } }))
  }

  function changeQuality(q: PerfLevel) {
    setQuality(q)
    setPerformanceLevel(q)
    // Reload the page so Three.js re-initialises with new settings
    window.location.reload()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 md:top-5 right-3 md:right-5 pointer-events-auto z-20 px-2.5 py-1.5 rounded-xl text-[0.6rem] cursor-pointer"
        style={{ ...panelStyle, color: 'rgba(255,220,180,0.4)' }}
      >
        Settings
      </button>
    )
  }

  return (
    <div className="fixed top-3 md:top-5 right-3 md:right-5 pointer-events-auto z-20 p-4 rounded-2xl min-w-[200px]" style={panelStyle}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>Settings</span>
        <button onClick={() => setOpen(false)} className="text-[0.6rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
      </div>

      {/* Reduced motion */}
      <label className="flex items-center gap-3 my-2 cursor-pointer">
        <input type="checkbox" checked={reducedMotion} onChange={toggleReducedMotion}
          className="w-3.5 h-3.5 rounded accent-[#f0c674]" />
        <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.6)' }}>Reduced motion</span>
      </label>

      {/* Show room labels */}
      <label className="flex items-center gap-3 my-2 cursor-pointer">
        <input type="checkbox" checked={showLabels} onChange={toggleLabels}
          className="w-3.5 h-3.5 rounded accent-[#f0c674]" />
        <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.6)' }}>Room labels</span>
      </label>

      {/* Quality selector */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,200,120,0.08)' }}>
        <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(255,220,180,0.25)' }}>Graphics quality</div>
        <div className="flex gap-1.5">
          {(['low', 'medium', 'high'] as PerfLevel[]).map(q => (
            <button
              key={q}
              onClick={() => changeQuality(q)}
              className="flex-1 py-1 rounded-lg text-[0.55rem] uppercase tracking-wider cursor-pointer transition-all"
              style={{
                background: quality === q ? 'rgba(240,198,116,0.2)' : 'rgba(255,255,255,0.04)',
                color: quality === q ? 'rgba(240,198,116,0.9)' : 'rgba(255,220,180,0.35)',
                border: quality === q ? '1px solid rgba(240,198,116,0.3)' : '1px solid rgba(255,200,120,0.08)',
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="text-[0.48rem] mt-1.5" style={{ color: 'rgba(255,220,180,0.2)' }}>
          Applies on reload
        </div>
      </div>

      {/* Controls reference */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,200,120,0.08)' }}>
        {/* Share URL with quality lock */}
        <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,200,120,0.08)' }}>
          <div className="text-[0.48rem] mb-1.5" style={{ color: 'rgba(255,220,180,0.2)' }}>
            Share with quality locked:
          </div>
          <button
            onClick={() => {
              const url = `${window.location.origin}/world?q=${quality}`
              navigator.clipboard?.writeText(url).catch(() => {})
              const el = document.createElement('textarea')
              el.value = url; document.body.appendChild(el); el.select()
              document.execCommand('copy'); document.body.removeChild(el)
            }}
            className="text-[0.48rem] cursor-pointer w-full text-left px-2 py-1 rounded"
            style={{ background: 'rgba(240,198,116,0.06)', color: 'rgba(240,198,116,0.4)', border: '1px solid rgba(240,198,116,0.1)' }}
          >
            /world?q={quality} — tap to copy
          </button>
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,200,120,0.08)' }}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'rgba(255,220,180,0.25)' }}>Controls</div>
          {[
            ['WASD', 'Move'],
            ['Shift', 'Sprint'],
            ['Space', 'Jump'],
            ['E', 'Interact'],
            ['F', 'FPS counter'],
            ['Mouse', 'Look around'],
          ].map(([key, action]) => (
            <div key={key} className="flex justify-between my-0.5">
              <span className="text-[0.5rem] font-mono" style={{ color: 'rgba(240,198,116,0.4)' }}>{key}</span>
              <span className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

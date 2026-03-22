'use client'

import { useState, useEffect } from 'react'

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

      {/* Controls reference */}
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
  )
}

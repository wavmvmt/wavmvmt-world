'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.92)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,200,120,0.15)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

const SHORTCUTS = [
  { section: 'Movement' },
  { key: 'W A S D', action: 'Move around' },
  { key: 'Shift', action: 'Sprint (1.8x speed)' },
  { key: 'Space', action: 'Jump' },
  { key: 'Mouse', action: 'Look around' },
  { section: 'Interaction' },
  { key: 'E', action: 'Interact / mount vehicle' },
  { key: 'Click', action: 'Play beat pads & bowls' },
  { section: 'Features' },
  { key: 'X', action: 'Share & Win (contest)' },
  { key: 'B', action: 'Progress badge (screenshot it!)' },
  { key: 'T', action: 'Time-lapse construction replay' },
  { key: 'N', action: 'What\'s new changelog' },
  { section: 'Camera & Tools' },
  { key: 'C', action: 'Toggle drone camera' },
  { key: 'P', action: 'Photo mode' },
  { key: 'F', action: 'FPS counter' },
  { key: 'H', action: 'Heatmap (where you\'ve walked)' },
  { key: '?', action: 'This help screen' },
]

export function KeyboardHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '?' || e.key === '/') && !e.ctrlKey && !e.metaKey) setOpen(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-auto"
      onClick={() => setOpen(false)}>
      <div className="max-w-xs w-full mx-4 p-5 rounded-2xl" style={panelStyle}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[0.65rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Keyboard Shortcuts
          </span>
          <button onClick={() => setOpen(false)} className="text-sm cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
        </div>

        {SHORTCUTS.map((item, i) => (
          'section' in item && item.section ? (
            <div key={i} className="text-[0.5rem] tracking-[0.2em] uppercase mt-3 mb-1.5 pt-2"
              style={{ color: 'rgba(255,220,180,0.25)', borderTop: i > 0 ? '1px solid rgba(255,200,120,0.06)' : 'none' }}>
              {item.section}
            </div>
          ) : (
            <div key={i} className="flex justify-between items-center my-1">
              <span className="px-2 py-0.5 rounded text-[0.6rem] font-mono"
                style={{ background: 'rgba(240,198,116,0.08)', border: '1px solid rgba(240,198,116,0.15)', color: '#f0c674' }}>
                {'key' in item ? item.key : ''}
              </span>
              <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>
                {'action' in item ? item.action : ''}
              </span>
            </div>
          )
        ))}

        <p className="text-[0.45rem] text-center mt-4" style={{ color: 'rgba(255,220,180,0.15)' }}>
          Press ? to close
        </p>
      </div>
    </div>
  )
}

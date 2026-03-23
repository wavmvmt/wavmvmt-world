'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.92)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,200,120,0.15)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

// Main controls shown in the compact bar
const MAIN_CONTROLS = [
  { key: 'WASD', action: 'Move' },
  { key: 'Mouse', action: 'Look' },
  { key: 'Space', action: 'Jump' },
  { key: 'Shift', action: 'Sprint' },
]

// Full shortcut list shown when expanded
const ALL_SHORTCUTS = [
  { section: 'Movement' },
  { key: 'W A S D', action: 'Move around' },
  { key: 'Shift', action: 'Sprint (1.8x speed)' },
  { key: 'Space', action: 'Jump' },
  { key: 'Mouse', action: 'Look around' },
  { section: 'Features' },
  { key: 'E', action: 'Interact / mount vehicle' },
  { key: 'X', action: 'Share & Win (contest)' },
  { key: 'B', action: 'Progress badge (screenshot it!)' },
  { key: 'T', action: 'Time-lapse construction replay' },
  { key: 'N', action: "What's new changelog" },
  { key: 'G', action: 'View room render (near rooms)' },
  { section: 'Camera & Tools' },
  { key: 'C', action: 'Toggle drone camera' },
  { key: 'P', action: 'Photo mode' },
  { key: 'F', action: 'FPS counter' },
  { key: 'H', action: "Heatmap (where you've walked)" },
  { key: '?', action: 'Toggle this panel' },
]

export function KeyboardHelp() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '?' || e.key === '/') && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setExpanded(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  if (isMobile) return null // mobile has its own controls

  return (
    <>
      {/* Compact control bar — always visible at bottom */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl cursor-pointer"
          style={{
            background: 'rgba(26,21,32,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(240,198,116,0.08)',
          }}
          onClick={() => setExpanded(v => !v)}
        >
          {MAIN_CONTROLS.map((c) => (
            <div key={c.key} className="flex items-center gap-1 mr-2">
              <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-mono"
                style={{ background: 'rgba(240,198,116,0.08)', border: '1px solid rgba(240,198,116,0.12)', color: '#f0c674' }}>
                {c.key}
              </span>
              <span className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.25)' }}>{c.action}</span>
            </div>
          ))}
          <span className="text-[0.45rem] ml-1" style={{ color: 'rgba(240,198,116,0.3)' }}>
            {expanded ? '▾ less' : '▸ more'}
          </span>
        </div>
      </div>

      {/* Expanded shortcuts panel */}
      {expanded && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="max-w-xs w-72 p-4 rounded-2xl" style={panelStyle}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>
                All Shortcuts
              </span>
              <button onClick={() => setExpanded(false)} className="text-xs cursor-pointer"
                style={{ color: 'rgba(255,220,180,0.2)' }}>✕</button>
            </div>

            {ALL_SHORTCUTS.map((item, i) => (
              'section' in item && item.section ? (
                <div key={i} className="text-[0.45rem] tracking-[0.15em] uppercase mt-2.5 mb-1 pt-2"
                  style={{ color: 'rgba(255,220,180,0.2)', borderTop: i > 0 ? '1px solid rgba(255,200,120,0.05)' : 'none' }}>
                  {item.section}
                </div>
              ) : (
                <div key={i} className="flex justify-between items-center my-0.5">
                  <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-mono"
                    style={{ background: 'rgba(240,198,116,0.06)', border: '1px solid rgba(240,198,116,0.1)', color: '#f0c674' }}>
                    {'key' in item ? item.key : ''}
                  </span>
                  <span className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>
                    {'action' in item ? item.action : ''}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </>
  )
}

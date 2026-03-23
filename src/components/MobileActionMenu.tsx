'use client'

import { useState } from 'react'

/**
 * Mobile floating action button that opens a radial menu
 * of all features that would be keyboard shortcuts on desktop.
 */

const ACTIONS = [
  { icon: '📤', label: 'Share', action: () => window.dispatchEvent(new CustomEvent('openShare')) },
  { icon: '🏆', label: 'Badge', action: () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' })) },
  { icon: '⏱️', label: 'Time-lapse', action: () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 't' })) },
  { icon: '🆕', label: "What's New", action: () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' })) },
  { icon: '🖼️', label: 'Gallery', action: () => window.location.href = '/gallery' },
  { icon: '🎨', label: 'Synesthesia', action: () => window.location.href = '/visualizer' },
  { icon: '👤', label: 'Founder', action: () => window.location.href = '/founder' },
  { icon: '📋', label: 'Pitch', action: () => window.location.href = '/pitch' },
  { icon: '🎟️', label: 'Membership', action: () => window.location.href = '/membership' },
  { icon: '🗓️', label: 'Book Tour', action: () => window.location.href = '/tour' },
]

export function MobileActionMenu() {
  const [open, setOpen] = useState(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  if (!isMobile) return null

  return (
    <>
      {/* Overlay when open */}
      {open && (
        <div className="fixed inset-0 z-35 pointer-events-auto" onClick={() => setOpen(false)} />
      )}

      {/* Action buttons — fan out from bottom-left */}
      {open && (
        <div className="fixed bottom-24 left-4 z-40 pointer-events-auto flex flex-col-reverse gap-2"
          style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {ACTIONS.map((action, i) => (
            <button key={i}
              onClick={() => { action.action(); setOpen(false) }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
              style={{
                background: 'rgba(26,21,32,0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(240,198,116,0.15)',
                animation: `slideUp 0.15s ease-out ${i * 0.03}s both`,
              }}>
              <span className="text-sm">{action.icon}</span>
              <span className="text-[0.55rem] tracking-wider" style={{ color: 'rgba(255,220,180,0.5)' }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-28 left-4 z-40 w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer transition-all"
        style={{
          background: open ? 'rgba(225,48,108,0.2)' : 'rgba(240,198,116,0.1)',
          border: `1px solid ${open ? 'rgba(225,48,108,0.3)' : 'rgba(240,198,116,0.25)'}`,
          color: open ? '#e1306c' : '#f0c674',
          fontSize: '1.2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>
        {open ? '✕' : '☰'}
      </button>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.92)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(240,198,116,0.2)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

/**
 * Session summary — shows after 5+ minutes of exploring.
 * Displays personalized stats about their visit.
 */
export function SessionSummary() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [stats, setStats] = useState({ quests: 0, time: 0 })

  useEffect(() => {
    if (dismissed) return

    // Show after 5 minutes
    const timer = setTimeout(() => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      setStats({ quests: quests.length, time: 300 })
      if (quests.length > 5) setShow(true) // Only show if they've been active
    }, 300000) // 5 minutes

    return () => clearTimeout(timer)
  }, [dismissed])

  if (!show || dismissed) return null

  const minutes = Math.floor(stats.time / 60)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 pointer-events-auto">
      <div className="max-w-sm mx-4 p-6 rounded-2xl text-center" style={panelStyle}>
        <div className="text-4xl mb-3">⏱️</div>
        <h3 className="text-lg font-bold mb-1" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
          {minutes} Minutes on Site!
        </h3>
        <p className="text-[0.65rem] mb-4" style={{ color: 'rgba(255,220,180,0.5)' }}>
          You&apos;ve completed {stats.quests}/100 quests. Keep exploring or share your visit!
        </p>

        <div className="flex gap-2 mb-3">
          <button onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }))
            setDismissed(true)
          }}
            className="flex-1 py-2 rounded-xl text-[0.65rem] tracking-wider uppercase cursor-pointer"
            style={{ border: '1px solid rgba(128,212,168,0.3)', color: '#80d4a8', background: 'rgba(128,212,168,0.08)' }}>
            Share Visit
          </button>
          <button onClick={() => setDismissed(true)}
            className="flex-1 py-2 rounded-xl text-[0.65rem] tracking-wider uppercase cursor-pointer"
            style={{ border: '1px solid rgba(240,198,116,0.2)', color: '#f0c674', background: 'rgba(240,198,116,0.05)' }}>
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Progress Badge — a shareable visual card showing the visitor's
 * quest progress, rooms explored, and time spent.
 *
 * Designed to be screenshot-worthy for social media.
 * Press B to toggle.
 */
export function ProgressBadge() {
  const [visible, setVisible] = useState(false)
  const [stats, setStats] = useState({
    quests: 0,
    rooms: 0,
    time: 0,
  })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'b' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handler)

    // Update stats
    const interval = setInterval(() => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      setStats(s => ({
        quests: quests.length,
        rooms: s.rooms, // updated by playerMove
        time: s.time + 1,
      }))
    }, 60000) // every minute

    // Track rooms from quest data
    const saved = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
    setStats(s => ({ ...s, quests: saved.length }))

    return () => {
      window.removeEventListener('keydown', handler)
      clearInterval(interval)
    }
  }, [])

  if (!visible) return null

  const minutes = Math.max(1, Math.round(stats.time))
  const pct = Math.round((stats.quests / 100) * 100)

  // Rank based on quests
  let rank = 'Visitor'
  let rankColor = 'rgba(255,220,180,0.4)'
  if (stats.quests >= 80) { rank = 'Legend'; rankColor = '#f0c674' }
  else if (stats.quests >= 50) { rank = 'Builder'; rankColor = '#80d4a8' }
  else if (stats.quests >= 25) { rank = 'Explorer'; rankColor = '#7eb8da' }
  else if (stats.quests >= 10) { rank = 'Pioneer'; rankColor = '#b48eab' }
  else if (stats.quests >= 3) { rank = 'Wanderer'; rankColor = 'rgba(255,220,180,0.5)' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      onClick={() => setVisible(false)}>
      <div className="absolute inset-0 bg-black/50" />

      {/* Badge card — designed for screenshots */}
      <div className="relative w-[340px] p-6 rounded-2xl" onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 50%, #1f2a3a 100%)',
          border: '1px solid rgba(240,198,116,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-3xl mb-1" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~W</div>
          <div className="text-[0.5rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,220,180,0.3)' }}>
            WAVMVMT WORLD
          </div>
        </div>

        {/* Rank */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold tracking-[0.1em]"
            style={{ color: rankColor, fontFamily: "'Playfair Display', serif" }}>
            {rank}
          </div>
          <div className="text-[0.45rem] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(255,220,180,0.2)' }}>
            Site Access Badge
          </div>
        </div>

        {/* Progress ring */}
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,220,180,0.06)" strokeWidth="4" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f0c674" strokeWidth="4"
                strokeDasharray={`${pct * 2.64} ${264 - pct * 2.64}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold font-mono" style={{ color: '#f0c674' }}>{pct}%</div>
                <div className="text-[0.35rem] uppercase tracking-wider" style={{ color: 'rgba(255,220,180,0.2)' }}>complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-mono font-bold" style={{ color: '#f0c674' }}>{stats.quests}</div>
            <div className="text-[0.4rem] tracking-wider uppercase" style={{ color: 'rgba(255,220,180,0.2)' }}>Quests</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold" style={{ color: '#80d4a8' }}>100</div>
            <div className="text-[0.4rem] tracking-wider uppercase" style={{ color: 'rgba(255,220,180,0.2)' }}>Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold" style={{ color: '#7eb8da' }}>{minutes}m</div>
            <div className="text-[0.4rem] tracking-wider uppercase" style={{ color: 'rgba(255,220,180,0.2)' }}>Time</div>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center pt-3" style={{ borderTop: '1px solid rgba(240,198,116,0.08)' }}>
          <div className="text-[0.45rem] tracking-[0.1em]" style={{ color: 'rgba(255,220,180,0.2)' }}>
            wavmvmt-world.vercel.app
          </div>
          <div className="text-[0.4rem] mt-1" style={{ color: 'rgba(255,220,180,0.1)' }}>
            A New Renaissance · Toronto
          </div>
        </div>

        {/* Screenshot hint */}
        <div className="text-center mt-3">
          <div className="text-[0.4rem]" style={{ color: 'rgba(255,220,180,0.12)' }}>
            Screenshot this badge and share · Press B to close
          </div>
        </div>
      </div>
    </div>
  )
}

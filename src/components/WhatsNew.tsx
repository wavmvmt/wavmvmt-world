'use client'

import { useState, useEffect } from 'react'

/**
 * "What's New" floating notification that shows recent updates.
 * Since people are watching the site being built in real time,
 * they should see what just changed.
 *
 * Auto-shows for new visitors, dismissable.
 */

const UPDATES = [
  { date: 'Mar 23', text: 'Video splash screen added', icon: '🎬' },
  { date: 'Mar 23', text: 'Synesthesia visualizer live', icon: '🎨' },
  { date: 'Mar 23', text: 'Tower cranes on the skyline', icon: '🏗️' },
  { date: 'Mar 23', text: 'Global expansion globe', icon: '🌍' },
  { date: 'Mar 23', text: 'Founder story + team page', icon: '👤' },
  { date: 'Mar 23', text: 'Financial projections page', icon: '💰' },
  { date: 'Mar 23', text: 'Soccer field + retractable roof', icon: '⚽' },
  { date: 'Mar 22', text: 'Quest system — 100 quests', icon: '🎮' },
  { date: 'Mar 22', text: 'Contest + share system', icon: '📤' },
  { date: 'Mar 22', text: 'NPC coaches in every room', icon: '🧑‍🏫' },
]

export function WhatsNew() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Show after 10 seconds if not dismissed this session
    if (sessionStorage.getItem('wavmvmt_whatsnew_dismissed')) return
    const timer = setTimeout(() => setVisible(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  // Also toggle with N key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function dismiss() {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('wavmvmt_whatsnew_dismissed', 'true')
  }

  if (!visible || dismissed) return null

  return (
    <div className="fixed top-16 md:top-20 right-4 z-30 w-64 pointer-events-auto rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(26,21,32,0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(240,198,116,0.15)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        animation: 'slideInRight 0.4s ease-out',
      }}>
      <div className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid rgba(240,198,116,0.08)' }}>
        <span className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(240,198,116,0.5)' }}>
          What&apos;s New
        </span>
        <button onClick={dismiss} className="text-[0.6rem] cursor-pointer px-1"
          style={{ color: 'rgba(255,220,180,0.2)' }}>✕</button>
      </div>
      <div className="max-h-48 overflow-y-auto p-2">
        {UPDATES.slice(0, 6).map((u, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 px-1">
            <span className="text-xs">{u.icon}</span>
            <div>
              <span className="text-[0.55rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>{u.text}</span>
              <span className="text-[0.4rem] ml-1.5" style={{ color: 'rgba(255,220,180,0.15)' }}>{u.date}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-1.5 text-center" style={{ borderTop: '1px solid rgba(240,198,116,0.05)' }}>
        <span className="text-[0.4rem]" style={{ color: 'rgba(255,220,180,0.12)' }}>
          Press N to toggle · Building in real time
        </span>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

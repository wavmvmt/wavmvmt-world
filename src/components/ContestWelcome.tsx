'use client'

import { useState, useEffect } from 'react'

/**
 * First-visit popup that introduces the contest + sharing mechanic.
 * Shows once per session, 5 seconds after entering the world.
 */
export function ContestWelcome() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('wavmvmt_contest_seen')) return

    const timer = setTimeout(() => {
      setShow(true)
      sessionStorage.setItem('wavmvmt_contest_seen', 'true')
    }, 6000) // 6s after world loads

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 pointer-events-auto"
      onClick={() => setShow(false)}>
      <div className="max-w-xs mx-4 p-5 rounded-2xl" onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(26,21,32,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(240,198,116,0.25)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>

        <div className="text-center mb-3">
          <span className="text-3xl">🏗️</span>
        </div>

        <h3 className="text-sm font-bold text-center mb-2" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
          Welcome to the Construction Site!
        </h3>

        <p className="text-[0.6rem] text-center mb-3 leading-relaxed" style={{ color: 'rgba(255,220,180,0.5)' }}>
          Follow the golden path and your guide dog to explore 13 rooms being built for a $100M+ wellness campus in Toronto.
        </p>

        {/* Contest info */}
        <div className="p-2.5 rounded-xl mb-3" style={{
          background: 'linear-gradient(135deg, rgba(240,198,116,0.08), rgba(128,212,168,0.08))',
          border: '1px solid rgba(240,198,116,0.15)',
        }}>
          <div className="text-[0.6rem] font-bold text-center mb-1" style={{ color: '#f0c674' }}>
            WIN CASH PRIZES
          </div>
          <div className="text-[0.5rem] text-center" style={{ color: 'rgba(255,220,180,0.45)' }}>
            Complete quests + share on social media to enter our cash prize giveaway. Press <strong style={{ color: '#f0c674' }}>X</strong> anytime to share.
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-2 text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>
          <span>🐕 Dog = guide</span>
          <span>✨ Gold path = way</span>
          <span>X = share</span>
        </div>

        <button
          onClick={() => setShow(false)}
          className="w-full py-2.5 rounded-xl text-[0.7rem] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all"
          style={{
            background: 'rgba(240,198,116,0.1)',
            border: '1px solid rgba(240,198,116,0.3)',
            color: '#f0c674',
          }}
        >
          Let&apos;s Explore
        </button>
      </div>
    </div>
  )
}

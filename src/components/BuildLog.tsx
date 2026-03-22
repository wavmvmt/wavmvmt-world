'use client'

import { useState } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

// Recent build updates — manually updated as we build
const BUILD_LOG = [
  { date: 'Mar 22', title: '100 Quests System', desc: 'Full gamified quest system with 6 categories' },
  { date: 'Mar 22', title: 'Multiplayer', desc: 'See other visitors in real-time via Supabase' },
  { date: 'Mar 22', title: '12 Interactive Rooms', desc: 'Beat pads, singing bowls, trampolines, stage spotlight' },
  { date: 'Mar 22', title: 'Membership Roulette', desc: '200 prizes for 100% quest completion' },
  { date: 'Mar 22', title: 'Day/Night Cycle', desc: 'Dynamic lighting with stars, fireflies, and rain' },
  { date: 'Mar 22', title: 'Construction Audio', desc: '17 real .ogg sound effects + ambient loops' },
  { date: 'Mar 22', title: 'Phase-Specific Props', desc: 'Cement trucks, excavators, survey stakes based on IRL phase' },
  { date: 'Mar 22', title: 'Skateboards & Vehicles', desc: '4 rideable skateboards, 3 forklifts, 2 cranes' },
  { date: 'Mar 22', title: '$20M Fundraising Tracker', desc: 'Real-world build progress with Phase 2 vision' },
  { date: 'Mar 22', title: 'Project Founded', desc: 'WAVMVMT World development begins' },
]

/**
 * Build log — shows recent development updates.
 * Like a construction site bulletin board.
 */
export function BuildLog() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-8 md:bottom-56 left-3 md:left-5 pointer-events-auto px-3 py-2 rounded-xl text-[0.55rem] tracking-wider uppercase cursor-pointer z-10"
        style={{ ...panelStyle, color: 'rgba(255,220,180,0.35)' }}>
        Build Log
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 md:bottom-56 left-3 md:left-5 right-3 md:right-auto md:w-72 pointer-events-auto z-30 p-4 rounded-2xl max-h-[50vh] overflow-y-auto" style={panelStyle}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Build Log
        </span>
        <button onClick={() => setOpen(false)} className="text-[0.55rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
      </div>

      {BUILD_LOG.map((entry, i) => (
        <div key={i} className="mb-2.5 pb-2" style={{ borderBottom: '1px solid rgba(255,200,120,0.05)' }}>
          <div className="flex justify-between items-baseline">
            <span className="text-[0.6rem] font-bold" style={{ color: '#f0c674' }}>{entry.title}</span>
            <span className="text-[0.45rem] font-mono" style={{ color: 'rgba(255,220,180,0.2)' }}>{entry.date}</span>
          </div>
          <p className="text-[0.5rem] mt-0.5" style={{ color: 'rgba(255,220,180,0.35)' }}>{entry.desc}</p>
        </div>
      ))}

      <p className="text-[0.45rem] text-center mt-2" style={{ color: 'rgba(255,220,180,0.15)' }}>
        50+ commits · Built in one session · Powered by Claude
      </p>
    </div>
  )
}

'use client'

import { ROOMS } from '@/lib/roomConfig'
import { FUNDRAISING, formatCurrency } from '@/lib/fundraisingConfig'

function colorToHex(n: number): string {
  return '#' + n.toString(16).padStart(6, '0')
}

const panelStyle = {
  background: 'rgba(26,21,32,0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

export function HUD() {
  const raisedPct = Math.min(100, (FUNDRAISING.raised / FUNDRAISING.goal) * 100)

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2.5 rounded-2xl" style={panelStyle}>
        <span className="text-lg font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~W</span>
        <span className="text-[0.65rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,220,180,0.5)' }}>
          WAVMVMT Center · {FUNDRAISING.location} · Building in Progress
        </span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#80d4a8', boxShadow: '0 0 8px #80d4a8' }} />
      </div>

      {/* Right panel — Build progress */}
      <div className="absolute top-5 right-5 p-3.5 rounded-2xl min-w-[200px] max-h-[45vh] overflow-y-auto" style={panelStyle}>
        <div className="text-[0.6rem] tracking-[0.25em] uppercase mb-2.5" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Digital Construction
        </div>
        {ROOMS.map((room) => (
          <div key={room.name} className="flex items-center gap-2 my-1.5">
            <span className="text-[0.62rem] min-w-[75px]" style={{ color: 'rgba(255,220,180,0.45)' }}>
              {room.name}
            </span>
            <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div
                className="h-full rounded-full transition-all duration-[2s]"
                style={{ width: `${room.buildPct}%`, background: colorToHex(room.color) }}
              />
            </div>
            <span className="text-[0.62rem] min-w-[28px] text-right font-mono" style={{ color: 'rgba(255,220,180,0.7)' }}>
              {room.buildPct}%
            </span>
          </div>
        ))}
      </div>

      {/* Left panel — Real-world fundraising + construction */}
      <div className="absolute top-5 left-5 p-3.5 rounded-2xl min-w-[210px]" style={panelStyle}>
        <div className="text-[0.6rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Real-World Build
        </div>

        {/* Capital raised */}
        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[0.58rem] uppercase tracking-wider" style={{ color: 'rgba(255,220,180,0.35)' }}>Capital Raised</span>
            <span className="text-sm font-bold font-mono" style={{ color: '#f0c674' }}>
              {formatCurrency(FUNDRAISING.raised)}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-[3s]"
              style={{
                width: `${Math.max(raisedPct, 1)}%`,
                background: 'linear-gradient(90deg, #f0c674, #e8a050)',
                boxShadow: raisedPct > 0 ? '0 0 8px rgba(240,198,116,0.4)' : 'none',
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[0.55rem] font-mono" style={{ color: 'rgba(255,220,180,0.3)' }}>$0</span>
            <span className="text-[0.55rem] font-mono" style={{ color: 'rgba(255,220,180,0.3)' }}>
              {formatCurrency(FUNDRAISING.goal)}
            </span>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-3">
          {FUNDRAISING.milestones.map((ms, i) => (
            <div key={i} className="flex items-center gap-2 my-1">
              <span className="text-[0.55rem]" style={{
                color: ms.reached ? '#80d4a8' : 'rgba(255,220,180,0.2)',
              }}>
                {ms.reached ? '◆' : '◇'}
              </span>
              <span className="text-[0.58rem] flex-1" style={{
                color: ms.reached ? 'rgba(255,220,180,0.7)' : 'rgba(255,220,180,0.25)',
              }}>
                {ms.label}
              </span>
              <span className="text-[0.55rem] font-mono" style={{
                color: ms.reached ? '#f0c674' : 'rgba(255,220,180,0.2)',
              }}>
                {formatCurrency(ms.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Real-world phases */}
        <div className="text-[0.55rem] tracking-[0.2em] uppercase mb-1.5 mt-2 pt-2"
          style={{ color: 'rgba(255,220,180,0.3)', borderTop: '1px solid rgba(255,200,120,0.08)' }}>
          IRL Construction
        </div>
        {FUNDRAISING.phases.map((phase, i) => (
          <div key={i} className="flex items-center gap-2 my-1">
            <span className="text-[0.5rem]" style={{
              color: phase.status === 'completed' ? '#80d4a8'
                : phase.status === 'active' ? '#f0c674'
                : 'rgba(255,220,180,0.15)',
            }}>
              {phase.status === 'completed' ? '●' : phase.status === 'active' ? '◐' : '○'}
            </span>
            <span className="text-[0.58rem] flex-1" style={{
              color: phase.status === 'active' ? 'rgba(255,220,180,0.7)'
                : phase.status === 'completed' ? 'rgba(128,212,168,0.7)'
                : 'rgba(255,220,180,0.2)',
            }}>
              {phase.name}
            </span>
            {phase.status === 'active' && (
              <span className="text-[0.55rem] font-mono" style={{ color: '#f0c674' }}>{phase.pct}%</span>
            )}
          </div>
        ))}
      </div>

      {/* Main site link */}
      <a href="https://wav-mvmt.vercel.app" target="_blank" rel="noopener noreferrer"
        className="absolute bottom-24 right-5 px-4 py-2 rounded-xl pointer-events-auto text-[0.65rem] tracking-[0.15em] uppercase transition-all hover:border-[rgba(240,198,116,0.4)]"
        style={{
          ...panelStyle,
          color: '#f0c674',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>
        View Full Pitch →
      </a>

      {/* Controls hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center px-7 py-3.5 rounded-2xl pointer-events-auto" style={panelStyle}>
        <div className="flex gap-2 justify-center mb-2">
          {['W', 'A', 'S', 'D', 'SPACE', 'MOUSE'].map(k => (
            <span key={k} className="px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold font-mono"
              style={{
                background: 'rgba(240,198,116,0.08)',
                border: '1px solid rgba(240,198,116,0.2)',
                color: '#f0c674',
              }}>
              {k}
            </span>
          ))}
        </div>
        <p className="text-[0.68rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Click to look around · Move with WASD · Jump with Space
        </p>
      </div>
    </div>
  )
}

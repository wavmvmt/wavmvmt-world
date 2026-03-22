'use client'

import { ROOMS } from '@/lib/roomConfig'

function colorToHex(n: number): string {
  return '#' + n.toString(16).padStart(6, '0')
}

export function HUD() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2.5 rounded-2xl"
        style={{
          background: 'rgba(26,21,32,0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,200,120,0.12)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}>
        <span className="text-lg font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~W</span>
        <span className="text-[0.65rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,220,180,0.5)' }}>
          WAVMVMT Center · Toronto · Building in Progress
        </span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#80d4a8', boxShadow: '0 0 8px #80d4a8' }} />
      </div>

      {/* Build progress panel */}
      <div className="absolute top-5 right-5 p-3.5 rounded-2xl min-w-[190px] max-h-[55vh] overflow-y-auto"
        style={{
          background: 'rgba(26,21,32,0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,200,120,0.1)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}>
        <div className="text-[0.6rem] tracking-[0.25em] uppercase mb-2.5" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Construction Progress
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

      {/* Controls hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center px-7 py-3.5 rounded-2xl pointer-events-auto"
        style={{
          background: 'rgba(26,21,32,0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,200,120,0.1)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}>
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

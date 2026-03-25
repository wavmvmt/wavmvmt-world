'use client'

import { useState, useEffect } from 'react'
import { ROOMS } from '@/lib/roomConfig'
import { FUNDRAISING, PHASE_2, formatCurrency } from '@/lib/fundraisingConfig'

function colorToHex(n: number): string {
  return '#' + n.toString(16).padStart(6, '0')
}

const panelStyle = {
  background: 'rgba(26,21,32,0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

/** Minimizable panel wrapper */
function Panel({ title, icon, children, defaultOpen, position }: {
  title: string
  icon: string
  children: React.ReactNode
  defaultOpen: boolean
  position: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false) // ALWAYS start closed

  // Only auto-open on desktop after mount (ensures mobile check is accurate)
  useEffect(() => {
    if (!defaultOpen) return
    // Wait for layout to settle, then check if truly desktop
    const timer = setTimeout(() => {
      if (window.innerWidth >= 768) setOpen(true)
    }, 1200) // longer delay ensures mobile detection is solid
    return () => clearTimeout(timer)
  }, [defaultOpen])

  const isMobile = useIsMobile()

  // Minimized button
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label={`Open ${title} panel`}
        className={`absolute pointer-events-auto flex items-center gap-1.5 rounded-xl cursor-pointer transition-all hover:border-[rgba(240,198,116,0.3)] ${
          isMobile
            ? `top-2 ${position === 'left' ? 'left-3' : 'right-16'} px-2 py-1 text-[0.5rem] tracking-wider uppercase`
            : `${position === 'left' ? 'top-5 left-5' : 'top-5 right-5'} px-3 py-2 text-[0.6rem] tracking-wider uppercase`
        }`}
        style={{
          ...panelStyle,
          color: 'rgba(255,220,180,0.5)',
        }}
      >
        <span>{icon}</span>
        <span>{title}</span>
      </button>
    )
  }

  return (
    <div
      className={`absolute p-3 md:p-3.5 rounded-2xl pointer-events-auto ${
        isMobile
          ? 'top-10 left-2 right-2 max-h-[50vh] overflow-y-auto'
          : position === 'left'
            ? 'top-5 left-5 min-w-[240px] lg:min-w-[280px] xl:min-w-[320px] max-h-[70vh] overflow-y-auto'
            : 'top-5 right-5 min-w-[220px] lg:min-w-[260px] xl:min-w-[300px] max-h-[55vh] overflow-y-auto'
      }`}
      style={panelStyle}
    >
      {/* Header with minimize button */}
      <div className="flex items-center justify-between mb-2 md:mb-2.5">
        <div className="text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>
          {title}
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label={`Minimize ${title} panel`}
          className="w-5 h-5 flex items-center justify-center rounded-md cursor-pointer transition-all"
          style={{
            background: 'rgba(240,198,116,0.06)',
            border: '1px solid rgba(240,198,116,0.15)',
            color: 'rgba(255,220,180,0.4)',
            fontSize: '0.6rem',
          }}
          title="Minimize"
        >
          −
        </button>
      </div>
      {children}
    </div>
  )
}

function SoundToggle() {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      setMuted((e as CustomEvent).detail.muted)
    }
    window.addEventListener('audioState', handler as EventListener)
    return () => window.removeEventListener('audioState', handler as EventListener)
  }, [])

  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('toggleAudio'))}
      className="pointer-events-auto px-1.5 py-0.5 rounded text-[0.6rem] cursor-pointer transition-all"
      style={{
        color: muted ? 'rgba(255,220,180,0.25)' : 'rgba(255,220,180,0.5)',
        background: 'rgba(240,198,116,0.05)',
      }}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}

export function HUD() {
  const raisedPct = Math.min(100, (FUNDRAISING.raised / FUNDRAISING.goal) * 100)
  const isMobile = useIsMobile()
  const [showHint, setShowHint] = useState(true)
  const [visitorCount, setVisitorCount] = useState(1)
  // Mobile UI mode: 'explore' = clean controls only, 'info' = show panels
  const [mobileMode, setMobileMode] = useState<'explore' | 'info'>('explore')

  useEffect(() => {
    const handler = (e: Event) => setVisitorCount((e as CustomEvent).detail.count)
    window.addEventListener('visitorCount', handler as EventListener)
    return () => window.removeEventListener('visitorCount', handler as EventListener)
  }, [])

  // Auto-hide the hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  const showPanels = !isMobile || mobileMode === 'info'

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div className="absolute top-3 md:top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl" style={panelStyle}>
        <span className="text-base md:text-lg font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~W</span>
        <span className="text-[0.55rem] md:text-[0.65rem] lg:text-[0.75rem] tracking-[0.1em] md:tracking-[0.15em] uppercase" style={{ color: 'rgba(255,220,180,0.5)' }}>
          {isMobile ? 'WAVMVMT · Building' : `WAVMVMT Center · ${FUNDRAISING.location} · Building in Progress`}
        </span>
        <span className="text-[0.5rem] font-mono" style={{ color: 'rgba(128,212,168,0.5)' }}>
          {visitorCount} {visitorCount === 1 ? 'visitor' : 'visitors'}
        </span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#80d4a8', boxShadow: '0 0 8px #80d4a8' }} />
        <SoundToggle />
      </div>

      {/* Mobile mode toggle */}
      {isMobile && (
        <button
          onClick={() => setMobileMode(m => m === 'explore' ? 'info' : 'explore')}
          className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-auto px-4 py-1.5 rounded-xl text-[0.55rem] tracking-[0.15em] uppercase cursor-pointer z-30 transition-all"
          style={{
            ...panelStyle,
            color: mobileMode === 'info' ? '#f0c674' : 'rgba(255,220,180,0.5)',
            borderColor: mobileMode === 'info' ? 'rgba(240,198,116,0.3)' : 'rgba(255,200,120,0.12)',
          }}
        >
          {mobileMode === 'explore' ? '◧ View Info' : '✕ Back to Explore'}
        </button>
      )}

      {/* Right panel — Build progress (hidden in mobile explore mode) */}
      {showPanels && (
        <Panel title="Digital Construction" icon="◧" defaultOpen={!isMobile} position="right">
          {ROOMS.map((room) => (
            <div key={room.name} className="flex items-center gap-2 my-1 md:my-1.5 lg:my-2">
              <span className="text-[0.55rem] md:text-[0.62rem] lg:text-[0.7rem] min-w-[65px] md:min-w-[75px] lg:min-w-[90px]" style={{ color: 'rgba(255,220,180,0.45)' }}>
                {room.name}
              </span>
              <div className="flex-1 h-0.5 lg:h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div
                  className="h-full rounded-full transition-all duration-[2s]"
                  style={{ width: `${room.buildPct}%`, background: colorToHex(room.color) }}
                />
              </div>
              <span className="text-[0.55rem] md:text-[0.62rem] lg:text-[0.7rem] min-w-[24px] md:min-w-[28px] text-right font-mono" style={{ color: 'rgba(255,220,180,0.7)' }}>
                {room.buildPct}%
              </span>
            </div>
          ))}
        </Panel>
      )}

      {/* Left panel — Real-world fundraising + construction (hidden in mobile explore mode) */}
      {showPanels && (
        <Panel title="Real-World Build" icon="◨" defaultOpen={!isMobile} position="left">
        {/* Capital raised */}
        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[0.55rem] uppercase tracking-wider" style={{ color: 'rgba(255,220,180,0.35)' }}>Capital Raised</span>
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
            <span className="text-[0.5rem] font-mono" style={{ color: 'rgba(255,220,180,0.3)' }}>$0</span>
            <span className="text-[0.5rem] font-mono" style={{ color: 'rgba(255,220,180,0.3)' }}>
              {formatCurrency(FUNDRAISING.goal)}
            </span>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-3">
          {FUNDRAISING.milestones.map((ms, i) => (
            <div key={i} className="flex items-center gap-2 my-1">
              <span className="text-[0.5rem]" style={{
                color: ms.reached ? '#80d4a8' : 'rgba(255,220,180,0.2)',
              }}>
                {ms.reached ? '◆' : '◇'}
              </span>
              <span className="text-[0.52rem] md:text-[0.58rem] flex-1" style={{
                color: ms.reached ? 'rgba(255,220,180,0.7)' : 'rgba(255,220,180,0.25)',
              }}>
                {ms.label}
              </span>
              <span className="text-[0.5rem] font-mono" style={{
                color: ms.reached ? '#f0c674' : 'rgba(255,220,180,0.2)',
              }}>
                {formatCurrency(ms.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Real-world phases */}
        <div className="text-[0.5rem] tracking-[0.2em] uppercase mb-1.5 mt-2 pt-2"
          style={{ color: 'rgba(255,220,180,0.3)', borderTop: '1px solid rgba(255,200,120,0.08)' }}>
          IRL Construction
        </div>
        {FUNDRAISING.phases.map((phase, i) => (
          <div key={i} className="flex items-center gap-2 my-1">
            <span className="text-[0.45rem] md:text-[0.5rem]" style={{
              color: phase.status === 'completed' ? '#80d4a8'
                : phase.status === 'active' ? '#f0c674'
                : 'rgba(255,220,180,0.15)',
            }}>
              {phase.status === 'completed' ? '●' : phase.status === 'active' ? '◐' : '○'}
            </span>
            <span className="text-[0.52rem] md:text-[0.58rem] flex-1" style={{
              color: phase.status === 'active' ? 'rgba(255,220,180,0.7)'
                : phase.status === 'completed' ? 'rgba(128,212,168,0.7)'
                : 'rgba(255,220,180,0.2)',
            }}>
              {phase.name}
            </span>
            {phase.status === 'active' && (
              <span className="text-[0.5rem] font-mono" style={{ color: '#f0c674' }}>{phase.pct}%</span>
            )}
          </div>
        ))}

        {/* Phase 2 expansion teaser */}
        <div className="text-[0.5rem] tracking-[0.2em] uppercase mb-1.5 mt-2 pt-2"
          style={{ color: 'rgba(136,192,208,0.4)', borderTop: '1px solid rgba(136,192,208,0.08)' }}>
          Phase 2 Vision · Upper Floors
        </div>
        <div className="text-[0.52rem] mb-1.5" style={{ color: 'rgba(255,220,180,0.25)', fontStyle: 'italic' }}>
          {PHASE_2.description}
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-[0.5rem]" style={{ color: 'rgba(136,192,208,0.35)' }}>Add&apos;l investment</span>
          <span className="text-[0.55rem] font-mono font-bold" style={{ color: 'rgba(136,192,208,0.5)' }}>
            {formatCurrency(PHASE_2.additionalCost)}
          </span>
        </div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[0.5rem]" style={{ color: 'rgba(136,192,208,0.35)' }}>Projected revenue</span>
          <span className="text-[0.55rem] font-mono" style={{ color: 'rgba(128,212,168,0.5)' }}>
            {formatCurrency(PHASE_2.projectedAnnualRevenue)}/yr
          </span>
        </div>
        <div className="text-[0.5rem] mb-1" style={{ color: 'rgba(136,192,208,0.3)' }}>
          {PHASE_2.units.filter(u => u.type !== 'Shared amenities').map(u => (
            <div key={u.type} className="flex justify-between my-0.5">
              <span>{u.type} ({u.count})</span>
              <span className="font-mono" style={{ color: 'rgba(128,212,168,0.35)' }}>{u.revenue}</span>
            </div>
          ))}
        </div>
        <div className="text-[0.48rem] mt-1.5 p-1.5 rounded-lg" style={{
          background: 'rgba(136,192,208,0.05)',
          border: '1px solid rgba(136,192,208,0.08)',
          color: 'rgba(255,220,180,0.2)',
        }}>
          Tenant perks: discounted center access, priority booking, wellness credits, community events
        </div>
        <div className="text-[0.45rem] mt-1 text-center" style={{ color: 'rgba(136,192,208,0.2)' }}>
          Status: {PHASE_2.status.toUpperCase()} · Requires rezoning
        </div>
      </Panel>
      )}

      {/* SHARE BUTTON — always visible, prominent */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('openShare'))}
        className={`absolute pointer-events-auto rounded-xl cursor-pointer transition-all z-20 ${
          isMobile
            ? 'bottom-28 right-4 px-4 py-2.5'
            : 'bottom-24 right-5 px-5 py-2.5'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(240,198,116,0.12), rgba(128,212,168,0.12))',
          border: '1px solid rgba(240,198,116,0.3)',
          color: '#f0c674',
          fontSize: isMobile ? '0.65rem' : '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          boxShadow: '0 0 20px rgba(240,198,116,0.08)',
        }}
      >
        📤 Share & Win
      </button>

      {/* Pitch link — below share on desktop, hidden on mobile explore */}
      {showPanels && !isMobile && (
        <a href="/pitch" target="_blank" rel="noopener noreferrer"
          className="absolute bottom-14 right-5 px-4 py-2 rounded-xl pointer-events-auto text-[0.6rem] tracking-[0.15em] uppercase transition-all hover:border-[rgba(240,198,116,0.4)]"
          style={{
            ...panelStyle,
            color: 'rgba(255,220,180,0.4)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
          View Pitch →
        </a>
      )}

      {/* Controls — different for mobile vs desktop */}
      {isMobile ? (
        <MobileControls />
      ) : (
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
          {/* ESC / Exit button */}
          <button
            onClick={() => {
              document.exitPointerLock?.()
              window.location.href = '/'
            }}
            className="mt-2 px-4 py-1.5 rounded-lg text-[0.6rem] tracking-[0.12em] uppercase cursor-pointer transition-all hover:border-[rgba(232,160,191,0.4)]"
            style={{
              background: 'rgba(232,160,191,0.06)',
              border: '1px solid rgba(232,160,191,0.15)',
              color: 'rgba(232,160,191,0.5)',
            }}
          >
            ESC · Exit World
          </button>
        </div>
      )}

      {/* Mobile ESC/Exit button */}
      {isMobile && (
        <button
          onClick={() => {
            document.exitPointerLock?.()
            window.location.href = '/'
          }}
          className="fixed top-2 left-3 pointer-events-auto z-20 px-2.5 py-1 rounded-lg text-[0.5rem] tracking-wider uppercase cursor-pointer"
          style={{
            background: 'rgba(232,160,191,0.06)',
            border: '1px solid rgba(232,160,191,0.15)',
            color: 'rgba(232,160,191,0.4)',
          }}
        >
          ← Exit
        </button>
      )}

      {/* First-time hint overlay — fades after 8s */}
      {showHint && (
        <div
          className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-opacity duration-[2s]"
          style={{ opacity: showHint ? 0.6 : 0 }}
        >
          <p className="text-xs md:text-sm mb-1" style={{ color: '#f0c674' }}>
            {isMobile ? 'Use the joystick to explore' : 'Click anywhere to start exploring'}
          </p>
          <p className="text-[0.55rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>
            {isMobile ? 'Tap ◧ ◨ buttons to show info panels' : 'Click − to minimize info panels'}
          </p>
        </div>
      )}
    </div>
  )
}

/** Mobile virtual joystick + look controls */
function MobileControls() {
  useEffect(() => {
    const dispatch = (key: string, type: 'keydown' | 'keyup') => {
      window.dispatchEvent(new KeyboardEvent(type, { key }))
    }

    let activeKeys = new Set<string>()
    let joystickActive = false
    let lookActive = false
    let lastTouch = { x: 0, y: 0 }

    const joystick = document.getElementById('mobile-joystick')
    const lookArea = document.getElementById('mobile-look')
    const jumpBtn = document.getElementById('mobile-jump')

    if (!joystick || !lookArea || !jumpBtn) return

    function handleJoystickMove(cx: number, cy: number, rect: DOMRect) {
      const dx = ((cx - rect.left) / rect.width - 0.5) * 2
      const dy = ((cy - rect.top) / rect.height - 0.5) * 2

      // Always move forward when joystick is active, camera turns with left/right
      const newKeys = new Set<string>()
      if (dy < -0.2) newKeys.add('w') // push up = move forward
      if (dy > 0.4) newKeys.add('s') // push down = move back (harder to trigger)

      // Left/right on joystick TURNS the camera instead of strafing
      // This makes mobile movement intuitive — push where you want to go
      if (Math.abs(dx) > 0.2) {
        window.dispatchEvent(new CustomEvent('touchLook', {
          detail: { dx: dx * 3, dy: 0 } // smooth camera rotation
        }))
        // Also move forward slightly when turning
        if (Math.abs(dy) < 0.3) newKeys.add('w')
      }

      for (const k of activeKeys) {
        if (!newKeys.has(k)) dispatch(k, 'keyup')
      }
      for (const k of newKeys) {
        if (!activeKeys.has(k)) dispatch(k, 'keydown')
      }
      activeKeys = newKeys
    }

    const onJoystickStart = (e: TouchEvent) => {
      e.preventDefault()
      joystickActive = true
      const t = e.touches[0]
      handleJoystickMove(t.clientX, t.clientY, joystick.getBoundingClientRect())
    }
    const onJoystickMove = (e: TouchEvent) => {
      if (!joystickActive) return
      e.preventDefault()
      const t = e.touches[0]
      handleJoystickMove(t.clientX, t.clientY, joystick.getBoundingClientRect())
    }
    const onJoystickEnd = () => {
      joystickActive = false
      for (const k of activeKeys) dispatch(k, 'keyup')
      activeKeys = new Set()
    }

    const onLookStart = (e: TouchEvent) => {
      // Only activate if touch is on the right half of screen
      const touch = e.touches[0]
      if (touch.clientX < window.innerWidth * 0.4) return // ignore left 40%
      lookActive = true
      lastTouch = { x: touch.clientX, y: touch.clientY }
    }
    const onLookMove = (e: TouchEvent) => {
      if (!lookActive) return
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - lastTouch.x
      const dy = t.clientY - lastTouch.y
      lastTouch = { x: t.clientX, y: t.clientY }
      // Higher sensitivity multiplier for responsive camera
      window.dispatchEvent(new CustomEvent('touchLook', { detail: { dx: dx * 1.5, dy: dy * 1.5 } }))
    }
    const onLookEnd = () => { lookActive = false }

    const onJump = (e: TouchEvent) => {
      e.preventDefault()
      dispatch(' ', 'keydown')
      setTimeout(() => dispatch(' ', 'keyup'), 100)
    }

    joystick.addEventListener('touchstart', onJoystickStart, { passive: false })
    joystick.addEventListener('touchmove', onJoystickMove, { passive: false })
    joystick.addEventListener('touchend', onJoystickEnd)

    lookArea.addEventListener('touchstart', onLookStart, { passive: false })
    lookArea.addEventListener('touchmove', onLookMove, { passive: false })
    lookArea.addEventListener('touchend', onLookEnd)

    jumpBtn.addEventListener('touchstart', onJump, { passive: false })

    return () => {
      joystick.removeEventListener('touchstart', onJoystickStart)
      joystick.removeEventListener('touchmove', onJoystickMove)
      joystick.removeEventListener('touchend', onJoystickEnd)
      lookArea.removeEventListener('touchstart', onLookStart)
      lookArea.removeEventListener('touchmove', onLookMove)
      lookArea.removeEventListener('touchend', onLookEnd)
      jumpBtn.removeEventListener('touchstart', onJump)
    }
  }, [])

  const touchBtnStyle = {
    background: 'rgba(240,198,116,0.08)',
    border: '1px solid rgba(240,198,116,0.25)',
    color: '#f0c674',
  }

  return (
    <>
      {/* Look area — covers right 60% of screen, below all UI */}
      <div
        id="mobile-look"
        className="fixed top-0 right-0 w-[60%] h-full pointer-events-auto z-[3]"
        style={{ touchAction: 'none' }}
      />

      {/* Left side — joystick */}
      <div
        id="mobile-joystick"
        className="fixed bottom-6 left-4 w-28 h-28 rounded-full pointer-events-auto z-20 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(26,21,32,0.7) 0%, rgba(26,21,32,0.4) 100%)',
          border: '2px solid rgba(240,198,116,0.15)',
          boxShadow: '0 0 20px rgba(240,198,116,0.05), inset 0 0 15px rgba(0,0,0,0.3)',
          touchAction: 'none',
        }}
      >
        <div className="w-11 h-11 rounded-full" style={{
          background: 'radial-gradient(circle, rgba(240,198,116,0.25) 0%, rgba(240,198,116,0.1) 100%)',
          border: '1px solid rgba(240,198,116,0.35)',
          boxShadow: '0 0 10px rgba(240,198,116,0.1)',
        }} />
        <span className="absolute top-2 text-[0.5rem] font-mono" style={{ color: 'rgba(240,198,116,0.4)' }}>W</span>
        <span className="absolute bottom-2 text-[0.5rem] font-mono" style={{ color: 'rgba(240,198,116,0.4)' }}>S</span>
        <span className="absolute left-3 text-[0.5rem] font-mono" style={{ color: 'rgba(240,198,116,0.4)' }}>A</span>
        <span className="absolute right-3 text-[0.5rem] font-mono" style={{ color: 'rgba(240,198,116,0.4)' }}>D</span>
      </div>

      {/* Jump button */}
      <button
        id="mobile-jump"
        className="fixed bottom-8 right-6 w-16 h-16 rounded-full pointer-events-auto z-20 text-sm font-mono font-bold"
        style={{
          background: 'radial-gradient(circle, rgba(240,198,116,0.15) 0%, rgba(240,198,116,0.05) 100%)',
          border: '2px solid rgba(240,198,116,0.3)',
          color: '#f0c674',
          boxShadow: '0 0 15px rgba(240,198,116,0.08)',
        }}
      >
        JUMP
      </button>

      {/* Interact button */}
      <button
        id="mobile-interact"
        className="fixed bottom-8 right-24 w-12 h-12 rounded-full pointer-events-auto z-20 text-[0.6rem] font-mono font-bold"
        style={{
          background: 'radial-gradient(circle, rgba(128,212,168,0.15) 0%, rgba(128,212,168,0.05) 100%)',
          border: '2px solid rgba(128,212,168,0.3)',
          color: '#80d4a8',
          boxShadow: '0 0 15px rgba(128,212,168,0.08)',
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }))
          setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e' })), 100)
        }}
      >
        E
      </button>

      {/* Hint */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-20">
        <p className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.25)' }}>
          Left: move · Right: look · Button: jump
        </p>
      </div>
    </>
  )
}

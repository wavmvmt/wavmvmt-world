'use client'

import { useState, useEffect, useRef } from 'react'
import { QUESTS, CATEGORY_COLORS, type Quest } from '@/lib/quests'
import { ROOMS } from '@/lib/roomConfig'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(240,198,116,0.15)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * 100-quest tracker. Auto-completes quests based on player activity.
 * Shows current quest with clear instructions + progress.
 */
export function QuestTracker() {
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [minimized, setMinimized] = useState(false)
  const [showList, setShowList] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Track player stats for auto-completion
  const stats = useRef({
    roomsVisited: new Set<string>(),
    jumps: 0,
    sprintDist: 0,
    beats: 0,
    bowls: new Set<number>(),
    bounces: 0,
    skateRides: 0,
    photos: 0,
    droneUsed: false,
    settingsOpened: false,
    suggestions: 0,
    timeSpent: 0,
    sprinting: false,
  })

  useEffect(() => {
    // Load saved progress
    const saved = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]') as number[]
    setCompleted(new Set(saved))

    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      for (const room of ROOMS) {
        if (Math.abs(x - room.x) < room.w / 2 + 5 && Math.abs(z - room.z) < room.d / 2 + 5) {
          stats.current.roomsVisited.add(room.name)
        }
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') stats.current.jumps++
      if (e.key === 'Shift') stats.current.sprinting = true
      if (e.key === 'c') stats.current.droneUsed = true
      if (e.key === 'p') stats.current.photos++
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') stats.current.sprinting = false
    }

    const onCelebrate = () => { stats.current.bounces++ }

    const timeInterval = setInterval(() => {
      stats.current.timeSpent++
      if (stats.current.sprinting) stats.current.sprintDist += 0.5 // rough estimate
    }, 1000)

    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('celebrate', onCelebrate)

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('celebrate', onCelebrate)
      clearInterval(timeInterval)
    }
  }, [])

  // Check quest completion every 2 seconds
  useEffect(() => {
    const check = setInterval(() => {
      const s = stats.current
      const newCompleted = new Set(completed)
      let changed = false

      for (const quest of QUESTS) {
        if (newCompleted.has(quest.id)) continue

        let done = false
        switch (quest.id) {
          case 1: done = s.roomsVisited.size >= 1; break
          case 2: done = s.roomsVisited.has('Parkour Gym'); break
          case 3: done = s.roomsVisited.has('Sound Bath'); break
          case 4: done = s.roomsVisited.has('Music Studio'); break
          case 5: done = s.roomsVisited.has('Cafe & Lounge'); break
          case 6: done = s.roomsVisited.has('Front Desk'); break
          case 7: done = s.roomsVisited.has('Yoga Room'); break
          case 8: done = s.roomsVisited.has('Weight Training'); break
          case 9: done = s.roomsVisited.has('Amphitheatre'); break
          case 10: done = s.roomsVisited.has('Photo Studio'); break
          case 11: done = s.roomsVisited.has('Video Studio'); break
          case 12: done = s.roomsVisited.has('Recovery Suite'); break
          case 13: done = s.roomsVisited.has('Spa & Wellness'); break
          case 14: case 15: case 16: case 17: case 18: case 19: done = s.roomsVisited.size >= 3; break
          case 20: done = s.roomsVisited.size >= 6; break
          case 21: done = s.beats >= 1; break
          case 22: done = s.beats >= 5; break
          case 23: done = s.beats >= 10; break
          case 24: done = s.beats >= 10; break // simplified
          case 25: done = s.bowls.size >= 1; break
          case 26: done = s.bowls.size >= 3; break
          case 27: done = s.bowls.size >= 7; break
          case 28: done = s.roomsVisited.has('Amphitheatre') && s.timeSpent > 30; break
          case 29: done = s.roomsVisited.has('Cafe & Lounge'); break
          case 30: done = s.roomsVisited.has('Photo Studio') && s.timeSpent > 20; break
          case 31: done = s.roomsVisited.has('Video Studio'); break
          case 32: done = s.roomsVisited.has('Weight Training'); break
          case 33: done = s.roomsVisited.has('Yoga Room'); break
          case 34: done = s.roomsVisited.has('Recovery Suite'); break
          case 35: done = s.roomsVisited.has('Spa & Wellness'); break
          case 36: case 37: case 38: case 39: case 40: done = s.timeSpent > 15; break
          case 41: done = s.jumps >= 1; break
          case 42: done = s.jumps >= 10; break
          case 43: done = s.jumps >= 25; break
          case 44: done = s.jumps >= 50; break
          case 45: done = s.sprintDist >= 5; break
          case 46: done = s.sprintDist >= 100; break
          case 47: done = s.sprintDist >= 250; break
          case 48: done = s.sprintDist >= 500; break
          case 49: done = s.bounces >= 1; break
          case 50: done = s.bounces >= 3; break
          case 51: done = s.skateRides >= 1; break
          case 52: case 53: case 54: done = s.skateRides >= 1 && s.sprintDist > 50; break
          case 55: done = s.jumps >= 5 && s.sprintDist >= 20; break
          case 56: case 57: done = s.timeSpent > 20; break
          case 58: done = s.roomsVisited.size >= 2; break
          case 59: done = s.sprintDist >= 100; break
          case 60: done = s.bounces >= 2; break
          case 61: done = s.suggestions >= 1; break
          case 62: done = s.photos >= 1; break
          case 63: done = s.photos >= 1; break
          case 64: done = s.timeSpent > 60; break
          case 65: case 66: done = s.timeSpent > 30; break
          case 67: case 68: done = s.timeSpent > 10; break
          case 69: done = s.roomsVisited.size >= 8; break
          case 70: done = s.roomsVisited.has('Parkour Gym'); break
          case 71: case 72: done = s.timeSpent > 20; break
          case 73: done = s.roomsVisited.size >= 3; break
          case 74: done = s.roomsVisited.has('Parkour Gym'); break
          case 75: done = s.roomsVisited.has('Front Desk'); break
          case 76: done = s.droneUsed; break
          case 77: done = s.timeSpent >= 120; break
          case 78: done = s.timeSpent >= 150; break
          case 79: done = s.timeSpent >= 160; break
          case 80: done = s.roomsVisited.has('Parkour Gym') || s.roomsVisited.has('Weight Training'); break
          case 81: case 82: case 83: case 84: case 85: case 86: case 87: done = s.roomsVisited.size >= 4; break
          case 88: done = s.timeSpent > 30; break
          case 89: done = s.roomsVisited.has('Front Desk'); break
          case 90: done = s.timeSpent > 45; break
          case 91: done = s.sprintDist >= 200 && s.roomsVisited.has('Amphitheatre'); break
          case 92: done = s.bounces >= 4; break
          case 93: done = s.bowls.size >= 7; break
          case 94: done = s.beats >= 12; break
          case 95: done = s.photos >= 1 && s.timeSpent >= 150; break
          case 96: done = s.droneUsed && s.timeSpent >= 200; break
          case 97: done = s.roomsVisited.size >= 12 && s.sprintDist >= 300; break
          case 98: done = s.skateRides >= 1 && s.sprintDist >= 400; break
          case 99: done = s.jumps >= 100; break
          case 100: done = newCompleted.size >= 99; break
        }

        if (done) {
          newCompleted.add(quest.id)
          changed = true
          setToast(quest.title)
          setTimeout(() => setToast(null), 2500)
        }
      }

      if (changed) {
        setCompleted(newCompleted)
        sessionStorage.setItem('wavmvmt_quests', JSON.stringify([...newCompleted]))

        // Auto-advance to next incomplete
        const next = QUESTS.findIndex(q => !newCompleted.has(q.id))
        if (next >= 0) setCurrentIdx(next)

        // Check for 100% completion
        if (newCompleted.size >= 100) {
          window.dispatchEvent(new CustomEvent('celebrate'))
          setTimeout(() => window.dispatchEvent(new CustomEvent('celebrate')), 500)
          setTimeout(() => window.dispatchEvent(new CustomEvent('celebrate')), 1000)
        }
      }
    }, 2000)

    return () => clearInterval(check)
  }, [completed])

  // Listen for beat pad clicks
  useEffect(() => {
    const onClick = () => { stats.current.beats++ }
    const onSkate = () => { stats.current.skateRides++ }
    const onSuggest = () => { stats.current.suggestions++ }

    // These are approximate — beat pad clicks fire on the canvas
    document.addEventListener('click', onClick)
    window.addEventListener('rideChange', onSkate as EventListener)

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('rideChange', onSkate as EventListener)
    }
  }, [])

  const quest = QUESTS[currentIdx]
  const pct = Math.round((completed.size / QUESTS.length) * 100)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Mobile: always show minimized compact pill, tap to expand briefly
  if (minimized || (isMobile && !showList)) {
    return (
      <>
        {toast && (
          <div className="fixed top-28 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl pointer-events-none"
            style={{ ...panelStyle, border: '1px solid rgba(128,212,168,0.3)' }}>
            <span className="text-[0.6rem]" style={{ color: '#80d4a8' }}>Quest complete: {toast}</span>
          </div>
        )}
        <button onClick={() => { if (isMobile) setShowList(true); else setMinimized(false) }}
          className={`fixed pointer-events-auto z-15 px-3 py-1.5 rounded-xl text-[0.55rem] tracking-wider cursor-pointer ${
            isMobile ? 'top-14 left-3' : 'top-[70px] right-5'
          }`}
          style={{ ...panelStyle, color: 'rgba(255,220,180,0.4)' }}>
          {isMobile
            ? `🐕 ${quest?.title || 'Quest'} · ${pct}%`
            : `Quest ${completed.size}/100 (${pct}%)`
          }
        </button>
      </>
    )
  }

  return (
    <>
      {/* Quest toast */}
      {toast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl pointer-events-none"
          style={{ ...panelStyle, border: '1px solid rgba(128,212,168,0.3)' }}>
          <span className="text-[0.6rem]" style={{ color: '#80d4a8' }}>Quest complete: {toast}</span>
        </div>
      )}

      {/* Main quest panel — compact on mobile */}
      <div className="fixed top-14 left-3 right-3 md:top-[70px] md:left-auto md:right-5 md:w-[280px] lg:w-[320px] xl:w-[360px] pointer-events-auto z-15 p-2.5 md:p-3 lg:p-4 rounded-2xl" style={panelStyle}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Quests {completed.size}/100
          </span>
          <div className="flex gap-2">
            <button onClick={() => setShowList(!showList)} className="text-[0.5rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>
              {showList ? 'Current' : 'All'}
            </button>
            <button onClick={() => setMinimized(true)} className="text-[0.5rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>−</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #f0c674, #80d4a8)',
          }} />
        </div>
        <div className="text-[0.45rem] text-right mb-2 font-mono" style={{ color: 'rgba(255,220,180,0.3)' }}>{pct}%</div>

        {showList ? (
          // All quests list
          <div className="max-h-[40vh] overflow-y-auto">
            {QUESTS.map(q => (
              <div key={q.id} className="flex items-center gap-2 my-0.5" style={{ opacity: completed.has(q.id) ? 0.4 : 1 }}>
                <span className="text-[0.45rem] w-4" style={{ color: completed.has(q.id) ? '#80d4a8' : 'rgba(255,220,180,0.2)' }}>
                  {completed.has(q.id) ? '✓' : q.id}
                </span>
                <span className="text-[0.5rem] flex-1" style={{ color: CATEGORY_COLORS[q.category] + (completed.has(q.id) ? '60' : '') }}>
                  {q.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Current quest
          quest && !completed.has(quest.id) ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[0.4rem] tracking-wider uppercase"
                  style={{ background: CATEGORY_COLORS[quest.category] + '20', color: CATEGORY_COLORS[quest.category] }}>
                  {quest.category}
                </span>
                <span className="text-[0.45rem] font-mono" style={{ color: 'rgba(255,220,180,0.3)' }}>#{quest.id}</span>
              </div>
              <div className="text-[0.65rem] lg:text-[0.8rem] font-bold mb-1" style={{ color: '#f0c674' }}>
                {quest.title}
              </div>
              <div className="text-[0.55rem] lg:text-[0.65rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.5)' }}>
                {quest.instruction}
              </div>
            </>
          ) : (
            <div className="text-[0.6rem] text-center py-2" style={{ color: '#80d4a8' }}>
              All 100 quests complete! You are a WAVMVMT Champion!
            </div>
          )
        )}
      </div>
    </>
  )
}

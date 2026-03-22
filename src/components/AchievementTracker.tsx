'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ACHIEVEMENTS, createInitialStats, type PlayerStats } from '@/lib/achievements'
import { ROOMS } from '@/lib/roomConfig'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * Tracks player stats and unlocks achievements.
 * Shows toast notifications when achievements unlock.
 */
export function AchievementTracker() {
  const stats = useRef<PlayerStats>(createInitialStats())
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ name: string; icon: string } | null>(null)
  const [showPanel, setShowPanel] = useState(false)

  const checkAchievements = useCallback(() => {
    for (const ach of ACHIEVEMENTS) {
      if (!unlocked.has(ach.id) && ach.check(stats.current)) {
        setUnlocked(prev => new Set([...prev, ach.id]))
        setToast({ name: ach.name, icon: ach.icon })
        setTimeout(() => setToast(null), 4000)
        // Save to localStorage
        const saved = JSON.parse(sessionStorage.getItem('wavmvmt_achievements') || '[]')
        if (!saved.includes(ach.id)) {
          saved.push(ach.id)
          sessionStorage.setItem('wavmvmt_achievements', JSON.stringify(saved))
        }
      }
    }
  }, [unlocked])

  useEffect(() => {
    // Load saved achievements
    const saved = JSON.parse(sessionStorage.getItem('wavmvmt_achievements') || '[]') as string[]
    setUnlocked(new Set(saved))

    // Track player movement → room discovery
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      for (const room of ROOMS) {
        const inRoom = Math.abs(x - room.x) < room.w / 2 + 5 && Math.abs(z - room.z) < room.d / 2 + 5
        if (inRoom) stats.current.roomsVisited.add(room.name)
      }
      checkAchievements()
    }

    // Track jumps
    const onJump = () => { stats.current.totalJumps++; checkAchievements() }

    // Track time
    const timeInterval = setInterval(() => {
      stats.current.timeSpent++
      if (stats.current.timeSpent % 30 === 0) checkAchievements()
    }, 1000)

    // Track various events
    const onBeat = () => { stats.current.beatsPlayed++; checkAchievements() }
    const onBowl = () => { stats.current.bowlsPlayed++; checkAchievements() }
    const onBounce = () => { stats.current.trampolineBounces++; checkAchievements() }
    const onSkate = () => { stats.current.skateboardRides++; checkAchievements() }
    const onSuggest = () => { stats.current.suggestionsSubmitted++; checkAchievements() }
    const onDrone = (e: KeyboardEvent) => {
      if (e.key === 'c') { stats.current.droneModeUsed = true; checkAchievements() }
      if (e.key === ' ') onJump()
    }

    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('keydown', onDrone)
    window.addEventListener('celebrate', onBounce) // trampolines fire celebrate

    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('keydown', onDrone)
      window.removeEventListener('celebrate', onBounce)
      clearInterval(timeInterval)
    }
  }, [checkAchievements])

  return (
    <>
      {/* Achievement toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl pointer-events-none animate-bounce"
          style={{ ...panelStyle, border: '1px solid rgba(240,198,116,0.3)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{toast.icon}</span>
            <div>
              <div className="text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>Achievement Unlocked</div>
              <div className="text-sm font-bold" style={{ color: '#f0c674' }}>{toast.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement counter button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed top-3 md:top-5 left-3 md:left-5 pointer-events-auto z-20 px-3 py-1.5 rounded-xl text-[0.6rem] cursor-pointer"
        style={{ ...panelStyle, color: 'rgba(255,220,180,0.5)' }}
      >
        {unlocked.size}/{ACHIEVEMENTS.length}
      </button>

      {/* Achievement panel */}
      {showPanel && (
        <div className="fixed top-12 md:top-14 left-3 md:left-5 pointer-events-auto z-20 p-3 rounded-2xl max-h-[60vh] overflow-y-auto w-64" style={panelStyle}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>Achievements</span>
            <button onClick={() => setShowPanel(false)} className="text-[0.55rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
          </div>
          {ACHIEVEMENTS.map(ach => {
            const done = unlocked.has(ach.id)
            return (
              <div key={ach.id} className="flex items-center gap-2 my-1.5" style={{ opacity: done ? 1 : 0.35 }}>
                <span className="text-sm">{ach.icon}</span>
                <div className="flex-1">
                  <div className="text-[0.58rem] font-medium" style={{ color: done ? '#f0c674' : 'rgba(255,220,180,0.4)' }}>{ach.name}</div>
                  <div className="text-[0.48rem]" style={{ color: 'rgba(255,220,180,0.25)' }}>{ach.description}</div>
                </div>
                {done && <span className="text-[0.5rem]" style={{ color: '#80d4a8' }}>✓</span>}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

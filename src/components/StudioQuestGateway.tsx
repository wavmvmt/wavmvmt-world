'use client'

import { useEffect, useState } from 'react'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Optional alpha bridge only. It stays separate from the 3D renderer and works
 * in low/medium/high quality modes because all use Player's playerMove event.
 * Progress lives solely in same-origin localStorage, never in public analytics.
 */
const MUSIC_STUDIO = ROOMS.find(room => room.name === 'Music Studio')
const QUEST_URL = '/alpha/music-quest.html?from=world'
const STORAGE_KEY = 'wavmvmt-world-alpha-v1'

function completedLocally(): boolean {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return false
    const parsed: unknown = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object') return false
    return 'version' in parsed && parsed.version === 1 &&
      'completed' in parsed && parsed.completed === true
  } catch {
    return false
  }
}

export function StudioQuestGateway() {
  const [nearStudio, setNearStudio] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    setCompleted(completedLocally())

    function onMove(event: Event) {
      if (!MUSIC_STUDIO) return
      const detail = (event as CustomEvent<{ x: number; z: number }>).detail
      if (!detail || !Number.isFinite(detail.x) || !Number.isFinite(detail.z)) return

      // A little room-edge allowance makes this usable with collision boundaries.
      const near =
        Math.abs(detail.x - MUSIC_STUDIO.x) <= MUSIC_STUDIO.w / 2 + 6 &&
        Math.abs(detail.z - MUSIC_STUDIO.z) <= MUSIC_STUDIO.d / 2 + 6
      setNearStudio(previous => previous === near ? previous : near)
    }

    function checkProgress() {
      setCompleted(completedLocally())
    }

    window.addEventListener('playerMove', onMove)
    window.addEventListener('focus', checkProgress)
    return () => {
      window.removeEventListener('playerMove', onMove)
      window.removeEventListener('focus', checkProgress)
    }
  }, [])

  if (!nearStudio) return null

  return (
    <aside
      className="fixed z-30 pointer-events-auto top-24 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[380px] rounded-xl p-3 md:p-4"
      style={{
        background: 'rgba(25, 20, 30, 0.96)',
        border: '1px solid rgba(240,198,116,0.55)',
        color: '#fff0d8',
        boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
      }}
      aria-label="Music Studio interactive quest"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-widest uppercase" style={{ color: '#f0c674' }}>
            ♪ Music Studio · Playable Alpha
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: '#fff0d8' }}>
            {completed
              ? 'Your first music quest is complete. Revisit the beat lab or your Mind Palace.'
              : 'You found the Studio. Build an eight-step beat and unlock your Mind Palace.'}
          </p>
        </div>
        <a
          href={QUEST_URL}
          onClick={event => {
            event.stopPropagation()
            if (document.pointerLockElement) document.exitPointerLock()
          }}
          className="shrink-0 rounded-lg px-3 py-3 text-xs font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ background: '#f0c674', color: '#241a1e', textDecoration: 'none' }}
          aria-label={completed ? 'Reopen playable music quest' : 'Open playable music quest'}
        >
          {completed ? 'Revisit ↗' : 'Play ↗'}
        </a>
      </div>
      <p className="text-[0.6rem] mt-2" style={{ color: '#cab4a1' }}>
        Separate local demo · No login or game purchases
      </p>
    </aside>
  )
}

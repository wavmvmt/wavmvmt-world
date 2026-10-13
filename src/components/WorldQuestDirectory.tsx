'use client'

import { useEffect, useState } from 'react'

/**
 * A universal 2D quest directory over the existing 3D scene.
 * The public 3D app retains its own navigation, performance levels and graphics.
 * These four alpha quests are local-browser practice, not real credentials.
 */
const STORAGE_KEY = 'wavmvmt-world-progress-v2'
const LEGACY_KEY = 'wavmvmt-world-alpha-v1'

const QUESTS = [
  {
    id: 'music_producer_001',
    label: 'Music Studio',
    caption: 'Make an eight-step beat',
    url: '/alpha/music-quest.html?from=world',
    symbol: '♫',
  },
  {
    id: 'photo_composition_001',
    label: 'Photo Studio',
    caption: 'Practice composition and light',
    url: '/alpha/photo-quest.html',
    symbol: '◉',
  },
  {
    id: 'movement_pathfinder_001',
    label: 'Movement Lab',
    caption: 'Plan an accessible virtual route',
    url: '/alpha/movement-quest.html',
    symbol: '↗',
  },
  {
    id: 'energy_balancer_001',
    label: 'Energy Workshop',
    caption: 'Balance imaginary power resources',
    url: '/alpha/energy-quest.html',
    symbol: '☀',
  },
] as const

function readCompleted(): Set<string> {
  try {
    const json = window.localStorage.getItem(STORAGE_KEY)
    if (json !== null) {
      const parsed: unknown = JSON.parse(json)
      if (!parsed || typeof parsed !== 'object' || !('version' in parsed) ||
          parsed.version !== 2 || !('completions' in parsed) ||
          !Array.isArray(parsed.completions)) return new Set()
      const completions: unknown[] = parsed.completions
      return new Set(completions
        .filter((item): item is { questId: string } =>
          !!item && typeof item === 'object' && 'questId' in item &&
          typeof item.questId === 'string')
        .map(item => item.questId)
        .filter(id => QUESTS.some(quest => quest.id === id)))
    }
    const legacyJson = window.localStorage.getItem(LEGACY_KEY)
    if (!legacyJson) return new Set()
    const old: unknown = JSON.parse(legacyJson)
    if (old && typeof old === 'object' && 'version' in old &&
        old.version === 1 && 'completed' in old && old.completed === true) {
      return new Set(['music_producer_001'])
    }
  } catch {
    // Browser storage can be unavailable; do not block navigation.
  }
  return new Set()
}

function releasePointerLock() {
  if (document.pointerLockElement) document.exitPointerLock()
}

export function WorldQuestDirectory() {
  const [open, setOpen] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const refresh = () => setCompleted(readCompleted())
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <section className="fixed right-3 top-[90px] z-[55] pointer-events-auto max-w-[calc(100vw-24px)]"
      aria-label="World learning quests">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          releasePointerLock()
          setCompleted(readCompleted())
          setOpen(previous => !previous)
        }}
        aria-controls="world-quest-menu"
        aria-expanded={open}
        className="rounded-xl border px-4 py-3 text-xs font-bold tracking-wide cursor-pointer shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ background: '#f0c674', borderColor: '#cc9e59', color: '#241a1e' }}
      >
        {open ? 'Close quests ×' : 'Explore 4 quests ◈'}
      </button>
      {open && (
        <nav id="world-quest-menu" aria-label="Explore playable world quests"
          className="mt-2 w-[340px] max-w-[calc(100vw-24px)] max-h-[68vh] overflow-y-auto rounded-2xl border p-4 shadow-2xl"
          style={{
            background: 'rgba(26,21,32,.97)', color: '#fff0d8',
            borderColor: 'rgba(240,198,116,.4)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <h2 className="text-base font-extrabold" style={{ color: '#f0c674' }}>
            Playable Alpha · Learning Center
          </h2>
          <p className="text-xs mt-1 mb-4" style={{ color: '#dec6b2' }}>
            {completed.size} of {QUESTS.length} local practice quests completed.
            Your progress stays in this browser.
          </p>
          <div className="grid gap-2">
            {QUESTS.map(quest => (
              <a key={quest.id} href={quest.url}
                onClick={(event) => { event.stopPropagation(); releasePointerLock() }}
                className="block rounded-xl border p-3 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  color: '#fff0d8',
                  background: 'rgba(240,198,116,.06)',
                  borderColor: 'rgba(240,198,116,.18)',
                }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{quest.symbol} {quest.label}</span>
                  <span className="text-[10px]" style={{ color: completed.has(quest.id) ? '#80d4a8' : '#f0c674' }}>
                    {completed.has(quest.id) ? 'Completed ✓' : 'Try ↗'}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#d8c0ae' }}>{quest.caption}</p>
              </a>
            ))}
          </div>
          <a href="/alpha/passport.html"
            onClick={(event) => { event.stopPropagation(); releasePointerLock() }}
            className="block rounded-xl mt-3 px-3 py-3 text-center text-xs font-bold no-underline"
            style={{ background: '#f0c674', color: '#241a1e' }}>
            Open your Player Passport ↗
          </a>
          <p className="text-[10px] mt-3" style={{ color: '#bdab9e' }}>
            These are educational local demos, not accounts, investment products or professional certifications.
          </p>
        </nav>
      )}
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Three optional playable-alpha entry points for the existing 3D Center.
 * Independent of graphics quality: subscribes to Player's playerMove event.
 * Progress is a browser-local demonstration, NOT an authenticated credential.
 */
const MUSIC_STUDIO = ROOMS.find(room => room.name === 'Music Studio')
const PHOTO_STUDIO = ROOMS.find(room => room.name === 'Photo Studio')
const MOVEMENT_LAB = ROOMS.find(room => room.name === 'Parkour Gym')
const QUEST_URL = '/alpha/music-quest.html?from=world'
const PHOTO_URL = '/alpha/photo-quest.html'
const MOVEMENT_URL = '/alpha/movement-quest.html'
const PROGRESS_KEY = 'wavmvmt-world-progress-v2'
const LEGACY_KEY = 'wavmvmt-world-alpha-v1'

type QuestLane = 'music' | 'photo' | 'movement'
type CompletionStatus = { music: boolean; photo: boolean; movement: boolean }

function completedLocally(): CompletionStatus {
  const empty = { music: false, photo: false, movement: false }
  try {
    const current = window.localStorage.getItem(PROGRESS_KEY)
    if (current !== null) {
      // V2 must supersede V1, even when corrupted, to prevent stale import.
      const parsed: unknown = JSON.parse(current)
      if (!parsed || typeof parsed !== 'object' || !('version' in parsed) ||
          parsed.version !== 2 || !('completions' in parsed) ||
          !Array.isArray(parsed.completions)) return empty
      const completions: unknown[] = parsed.completions
      const hasQuest = (questId: string) => completions.some((item: unknown) =>
        !!item && typeof item === 'object' && 'questId' in item &&
        item.questId === questId)
      return {
        music: hasQuest('music_producer_001'),
        photo: hasQuest('photo_composition_001'),
        movement: hasQuest('movement_pathfinder_001'),
      }
    }

    const legacy = window.localStorage.getItem(LEGACY_KEY)
    if (!legacy) return empty
    const parsed: unknown = JSON.parse(legacy)
    return {
      music: !!parsed && typeof parsed === 'object' && 'version' in parsed &&
        parsed.version === 1 && 'completed' in parsed && parsed.completed === true,
      photo: false,
      movement: false,
    }
  } catch {
    return empty
  }
}

export function StudioQuestGateway() {
  const [near, setNear] = useState<QuestLane | null>(null)
  const [completed, setCompleted] = useState<CompletionStatus>({ music: false, photo: false, movement: false })

  useEffect(() => {
    setCompleted(completedLocally())

    function onMove(event: Event) {
      const detail = (event as CustomEvent<{ x: number; z: number }>).detail
      if (!detail || !Number.isFinite(detail.x) || !Number.isFinite(detail.z)) return

      // Use canonical room coordinates and a small allowance near walls.
      const musicNear = !!MUSIC_STUDIO &&
        Math.abs(detail.x - MUSIC_STUDIO.x) <= MUSIC_STUDIO.w / 2 + 6 &&
        Math.abs(detail.z - MUSIC_STUDIO.z) <= MUSIC_STUDIO.d / 2 + 6
      const photoNear = !!PHOTO_STUDIO &&
        Math.abs(detail.x - PHOTO_STUDIO.x) <= PHOTO_STUDIO.w / 2 + 6 &&
        Math.abs(detail.z - PHOTO_STUDIO.z) <= PHOTO_STUDIO.d / 2 + 6
      const movementNear = !!MOVEMENT_LAB &&
        Math.abs(detail.x - MOVEMENT_LAB.x) <= MOVEMENT_LAB.w / 2 + 6 &&
        Math.abs(detail.z - MOVEMENT_LAB.z) <= MOVEMENT_LAB.d / 2 + 6
      const next: QuestLane | null = musicNear ? 'music' : photoNear ? 'photo' : movementNear ? 'movement' : null
      setNear(previous => previous === next ? previous : next)
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

  if (!near) return null

  const isMusic = near === 'music'
  const isDone = completed[near]
  const isMovement = near === 'movement'
  const name = isMusic ? 'Music Studio' : isMovement ? 'Movement Lab' : 'Photo Studio'
  const url = isMusic ? QUEST_URL : isMovement ? MOVEMENT_URL : PHOTO_URL
  const description = isDone
    ? 'Your local practice quest is complete. Revisit it or explore your Mind Palace.'
    : isMusic
      ? 'Build an eight-step beat to practice rhythm and sequencing.'
      : isMovement
        ? 'Navigate a safe virtual route and visit three learning stations.'
        : 'Practice portrait composition and side lighting in a short illustrated exercise.'

  return (
    <aside
      className="fixed z-30 pointer-events-auto top-24 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[380px] rounded-xl p-3 md:p-4"
      style={{
        background: 'rgba(25,20,30,0.96)',
        border: '1px solid rgba(240,198,116,0.55)',
        color: '#fff0d8',
        boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
      }}
      aria-label={name + ' interactive practice quest'}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-widest uppercase" style={{ color: '#f0c674' }}>
            {isMusic ? '♪' : isMovement ? '↗' : '◉'} {name} · Playable Alpha
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: '#fff0d8' }}>
            {description}
          </p>
        </div>
        <a
          href={url}
          onClick={event => {
            event.stopPropagation()
            if (document.pointerLockElement) document.exitPointerLock()
          }}
          className="shrink-0 rounded-lg px-3 py-3 text-xs font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ background: '#f0c674', color: '#241a1e', textDecoration: 'none' }}
          aria-label={isDone ? 'Reopen ' + name + ' quest' : 'Open ' + name + ' quest'}
        >
          {isDone ? 'Revisit ↗' : 'Play ↗'}
        </a>
      </div>
      <p className="text-[0.6rem] mt-2" style={{ color: '#cab4a1' }}>
        Separate local practice demo · No login or purchases
      </p>
    </aside>
  )
}

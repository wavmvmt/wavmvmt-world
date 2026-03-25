'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { trackEvent } from '@/lib/analytics'

/**
 * Logs each visitor session to Supabase.
 * Runs once on mount, invisible component.
 */
export function VisitorLogger() {
  const logged = useRef(false)

  useEffect(() => {
    if (logged.current) return
    logged.current = true

    const sessionId = `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    sessionStorage.setItem('wavmvmt_session_id', sessionId)

    const supabase = createClient()
    supabase.from('visitor_log').insert({
      session_id: sessionId,
      user_agent: navigator.userAgent,
      quests_completed: 0,
    }).then(() => {})

    // Track rooms visited during session
    const roomsVisited = new Set<string>()
    const onRoomVisit = (e: Event) => {
      const room = (e as CustomEvent).detail?.room
      if (room && !roomsVisited.has(room)) {
        roomsVisited.add(room)
      }
    }
    window.addEventListener('roomInteract', onRoomVisit as EventListener)

    // Update quests_completed + session stats when leaving
    const updateOnLeave = () => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      const duration = Math.floor((Date.now() - startTime) / 1000)
      navigator.sendBeacon?.(`/api/visitor-update?sid=${sessionId}&quests=${quests.length}`)
      trackEvent('session_duration', { duration, room: `${roomsVisited.size} rooms` })
    }
    const startTime = Date.now()
    window.addEventListener('beforeunload', updateOnLeave)
    return () => {
      window.removeEventListener('beforeunload', updateOnLeave)
      window.removeEventListener('roomInteract', onRoomVisit as EventListener)
    }
  }, [])

  return null
}

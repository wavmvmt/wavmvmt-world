'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

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

    // Update quests_completed when leaving
    const updateOnLeave = () => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      navigator.sendBeacon?.(`/api/visitor-update?sid=${sessionId}&quests=${quests.length}`)
    }
    window.addEventListener('beforeunload', updateOnLeave)
    return () => window.removeEventListener('beforeunload', updateOnLeave)
  }, [])

  return null
}

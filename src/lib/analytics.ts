/**
 * Lightweight analytics events — fires to Vercel Analytics custom events.
 * Also logs to console in dev mode for debugging.
 */

type EventName =
  | 'world_enter'
  | 'room_visit'
  | 'room_interact'
  | 'screenshot_taken'
  | 'share_opened'
  | 'share_completed'
  | 'sprint_used'
  | 'session_duration'

interface EventData {
  room?: string
  platform?: string
  duration?: number
  [key: string]: string | number | undefined
}

const isDev = process.env.NODE_ENV === 'development'

export function trackEvent(name: EventName, data?: EventData): void {
  if (isDev) {
    console.log(`[analytics] ${name}`, data || '')
  }

  // Fire to Vercel Analytics (if va is loaded)
  try {
    if (typeof window !== 'undefined' && 'va' in window) {
      const va = (window as unknown as Record<string, unknown>).va as (event: string, data?: Record<string, string | number>) => void
      const cleanData: Record<string, string | number> = {}
      if (data) {
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) cleanData[k] = v
        }
      }
      va('event', { name, ...cleanData })
    }
  } catch {
    // Analytics not critical
  }
}

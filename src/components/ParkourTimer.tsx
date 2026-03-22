'use client'

import { useState, useEffect, useRef } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(180,142,173,0.3)',
  boxShadow: '0 4px 20px rgba(180,142,173,0.1)',
}

/**
 * Parkour Gym timer — shows when player is in the Parkour Gym area.
 * Tracks time spent, shows bounce count.
 * Parkour Gym at x:-100, z:-80
 */
export function ParkourTimer() {
  const [inGym, setInGym] = useState(false)
  const [time, setTime] = useState(0)
  const [bounces, setBounces] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const inside = Math.abs(x + 100) < 70 && Math.abs(z + 80) < 55
      setInGym(prev => {
        if (!prev && inside) {
          // Entered gym — start timer
          setTime(0)
          setBounces(0)
          return true
        }
        if (prev && !inside) {
          // Left gym — save best
          return false
        }
        return prev
      })
    }

    const onBounce = () => {
      setBounces(b => b + 1)
    }

    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('celebrate', onBounce)
    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('celebrate', onBounce)
    }
  }, [])

  useEffect(() => {
    if (inGym) {
      intervalRef.current = setInterval(() => setTime(t => t + 0.1), 100)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (time > 5 && (bestTime === null || time < bestTime)) {
        setBestTime(time)
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGym])

  if (!inGym) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-6 py-2 rounded-xl" style={panelStyle}>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-[0.45rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(180,142,173,0.5)' }}>Parkour Gym</div>
          <div className="text-lg font-mono font-bold" style={{ color: '#b48ead' }}>
            {time.toFixed(1)}s
          </div>
        </div>
        <div className="text-center">
          <div className="text-[0.45rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(240,198,116,0.5)' }}>Bounces</div>
          <div className="text-lg font-mono font-bold" style={{ color: '#f0c674' }}>
            {bounces}
          </div>
        </div>
        {bestTime && (
          <div className="text-center">
            <div className="text-[0.45rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(128,212,168,0.5)' }}>Best</div>
            <div className="text-sm font-mono" style={{ color: '#80d4a8' }}>
              {bestTime.toFixed(1)}s
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

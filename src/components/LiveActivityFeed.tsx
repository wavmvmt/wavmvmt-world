'use client'

import { useState, useEffect } from 'react'

/**
 * Subtle live activity notifications that slide in from the bottom-left.
 * Shows fake-but-realistic activity to create social proof.
 * "Someone from Toronto just explored the Parkour Gym"
 *
 * In the future, connect to real Supabase events.
 */

const CITIES = ['Toronto', 'New York', 'London', 'Vancouver', 'Montreal', 'LA', 'Dubai', 'Berlin', 'Miami', 'Chicago', 'Seoul', 'Tokyo', 'Sydney']
const ACTIONS = [
  'just entered the world',
  'explored the Parkour Gym',
  'visited the Sound Bath',
  'checked out the Music Studio',
  'shared on Twitter',
  'registered for the contest',
  'viewed the Gallery',
  'listened on Beat Radio',
  'registered membership interest',
  'explored the Weight Training room',
  'viewed the Founder page',
  'walked through the Amphitheatre',
  'booked a virtual tour',
  'opened the Synesthesia visualizer',
]

const NAMES = [
  'Someone', 'A visitor', 'An explorer', 'A builder', 'A pioneer',
]

function getRandomActivity() {
  const city = CITIES[Math.floor(Math.random() * CITIES.length)]
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]
  const mins = Math.floor(Math.random() * 5) + 1
  return { city, action, name, mins }
}

export function LiveActivityFeed() {
  const [notification, setNotification] = useState<{ city: string; action: string; name: string; mins: number } | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show first notification after 15 seconds
    const firstTimer = setTimeout(() => {
      showNotification()
    }, 15000)

    return () => clearTimeout(firstTimer)
  }, [])

  function showNotification() {
    const activity = getRandomActivity()
    setNotification(activity)
    setVisible(true)

    // Hide after 4 seconds
    setTimeout(() => setVisible(false), 4000)

    // Schedule next one (30-90 seconds)
    const nextDelay = 30000 + Math.random() * 60000
    setTimeout(() => showNotification(), nextDelay)
  }

  if (!notification || !visible) return null

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 z-20 pointer-events-none"
      style={{ animation: 'slideInUp 0.4s ease-out' }}
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl max-w-[260px]"
        style={{
          background: 'rgba(26,21,32,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(240,198,116,0.1)',
        }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#80d4a8' }} />
        <div>
          <p className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>
            {notification.name} from {notification.city}
          </p>
          <p className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.25)' }}>
            {notification.action} · {notification.mins}m ago
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

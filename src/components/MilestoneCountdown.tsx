'use client'

import { useState, useEffect } from 'react'
import { FUNDRAISING, formatCurrency } from '@/lib/fundraisingConfig'

/**
 * Shows days since project started and next milestone target.
 * Appears subtly in the top bar area.
 */
export function MilestoneCountdown() {
  const [daysSinceStart, setDaysSinceStart] = useState(0)

  useEffect(() => {
    const startDate = new Date('2026-03-22')
    const now = new Date()
    const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    setDaysSinceStart(Math.max(0, diff))
  }, [])

  const nextMilestone = FUNDRAISING.milestones.find(m => !m.reached)

  return (
    <div className="fixed top-12 md:top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="flex items-center gap-3 text-[0.45rem] tracking-wider">
        <span style={{ color: 'rgba(255,220,180,0.2)' }}>
          Day {daysSinceStart}
        </span>
        {nextMilestone && (
          <>
            <span style={{ color: 'rgba(255,200,120,0.1)' }}>·</span>
            <span style={{ color: 'rgba(255,220,180,0.15)' }}>
              Next: {nextMilestone.label} ({formatCurrency(nextMilestone.amount)})
            </span>
          </>
        )}
      </div>
    </div>
  )
}

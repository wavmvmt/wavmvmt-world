'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(240,198,116,0.15)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

interface Quest {
  id: string
  title: string
  instruction: string
  achievementId: string // links to achievement
}

const QUESTS: Quest[] = [
  { id: 'q1', title: 'Take Your First Steps', instruction: 'Walk to any room using WASD. Look for the glowing wireframes!', achievementId: 'first-steps' },
  { id: 'q2', title: 'Make Some Music', instruction: 'Find the Music Studio (pink glow, east side). Click the colored pads to play beats!', achievementId: 'beat-maker' },
  { id: 'q3', title: 'Find Your Zen', instruction: 'Walk to the Sound Bath (gold glow, northeast). Tap all 7 singing bowls for a sound journey.', achievementId: 'sound-healer' },
  { id: 'q4', title: 'Get Air Time', instruction: 'Head to the Parkour Gym (purple glow, west). Walk onto the trampolines to super-bounce!', achievementId: 'parkour-pro' },
  { id: 'q5', title: 'Catch a Ride', instruction: 'Find a skateboard on the ground (4 around the warehouse). Walk near it and press E to ride!', achievementId: 'skater' },
  { id: 'q6', title: 'Bird\'s Eye View', instruction: 'Press C to activate the drone camera. See the whole warehouse from above!', achievementId: 'bird-eye' },
  { id: 'q7', title: 'Leave Your Mark', instruction: 'Click "Leave a Suggestion" and tell us what you\'d want in the WAVMVMT Center.', achievementId: 'builder' },
  { id: 'q8', title: 'Explore Everything', instruction: 'Visit all 12 rooms. Check your map (bottom-left) to see which ones you\'ve found!', achievementId: 'explorer' },
  { id: 'q9', title: 'Bounce Champion', instruction: 'Jump 50 times! Sprint around and jump everywhere — Space or the JUMP button.', achievementId: 'jumper' },
  { id: 'q10', title: 'Speed Run', instruction: 'Hold Shift to sprint. Cover 500 meters across the warehouse. Go go go!', achievementId: 'sprinter' },
  { id: 'q11', title: 'Night Explorer', instruction: 'Wait for the night cycle (the lights will dim). Look up through the skylights to see stars!', achievementId: 'night-owl' },
  { id: 'q12', title: 'Capture the Moment', instruction: 'Press P to take a screenshot. Download it or share it with friends!', achievementId: 'beat-maker' }, // bonus quest
]

/**
 * Quest tracker — shows current quest with clear instructions.
 * Automatically advances when achievement is unlocked.
 */
export function QuestTracker() {
  const [currentQuest, setCurrentQuest] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    const check = () => {
      const achievements = JSON.parse(sessionStorage.getItem('wavmvmt_achievements') || '[]') as string[]
      const newCompleted = new Set<string>()
      for (const q of QUESTS) {
        if (achievements.includes(q.achievementId)) newCompleted.add(q.id)
      }
      setCompleted(newCompleted)

      // Auto-advance to next incomplete quest
      const nextIncomplete = QUESTS.findIndex(q => !newCompleted.has(q.id))
      if (nextIncomplete >= 0 && nextIncomplete !== currentQuest) {
        setCurrentQuest(nextIncomplete)
      }
    }

    const interval = setInterval(check, 2000)
    return () => clearInterval(interval)
  }, [currentQuest])

  const quest = QUESTS[currentQuest]
  const completedCount = completed.size
  const totalQuests = QUESTS.length

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed top-14 left-1/2 -translate-x-1/2 md:top-5 md:left-auto md:right-[220px] pointer-events-auto z-15 px-3 py-1.5 rounded-xl text-[0.55rem] tracking-wider uppercase cursor-pointer"
        style={{ ...panelStyle, color: 'rgba(255,220,180,0.4)' }}
      >
        Quest {completedCount}/{totalQuests}
      </button>
    )
  }

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 md:top-[70px] md:left-auto md:right-5 md:translate-x-0 pointer-events-auto z-15 p-3 rounded-2xl max-w-[280px]" style={panelStyle}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(240,198,116,0.5)' }}>
          Quest {completedCount + 1}/{totalQuests}
        </span>
        <button onClick={() => setMinimized(true)} className="text-[0.5rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>−</button>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full" style={{
          width: `${(completedCount / totalQuests) * 100}%`,
          background: 'linear-gradient(90deg, #f0c674, #80d4a8)',
        }} />
      </div>

      {quest && !completed.has(quest.id) ? (
        <>
          <div className="text-[0.65rem] font-bold mb-1" style={{ color: '#f0c674' }}>
            {quest.title}
          </div>
          <div className="text-[0.55rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.5)' }}>
            {quest.instruction}
          </div>
        </>
      ) : (
        <div className="text-[0.6rem] text-center py-2" style={{ color: '#80d4a8' }}>
          All quests complete! Check your prizes!
        </div>
      )}
    </div>
  )
}

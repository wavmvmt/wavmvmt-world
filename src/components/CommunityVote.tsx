'use client'

import { useState } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.92)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,200,120,0.15)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

interface VoteQuestion {
  id: string
  question: string
  options: string[]
}

const QUESTIONS: VoteQuestion[] = [
  { id: 'rooftop', question: 'Should the center have a rooftop terrace?', options: ['Absolutely!', 'Nice to have', 'Focus on indoor first'] },
  { id: 'cafe-alcohol', question: 'Should the cafe serve alcohol?', options: ['Yes, craft cocktails', 'Beer & wine only', 'Keep it alcohol-free'] },
  { id: 'music-genre', question: 'What genre should dominate the Music Studio?', options: ['Hip-hop/R&B', 'Electronic/EDM', 'All genres equally'] },
  { id: 'open-hours', question: 'Should the center be open 24/7?', options: ['Yes, 24/7', '5am-midnight', 'Standard hours (6am-10pm)'] },
  { id: 'kids-area', question: 'Should there be a dedicated kids zone?', options: ['Yes, family-friendly', 'Adults only (18+)', 'Separate kids hours'] },
]

/**
 * Community vote board — visitors vote on real decisions
 * that shape the WAVMVMT Center. Results stored in sessionStorage
 * and submitted to Supabase.
 */
export function CommunityVote() {
  const [open, setOpen] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  function vote(option: string) {
    const q = QUESTIONS[currentQ]
    const newVotes = { ...votes, [q.id]: option }
    setVotes(newVotes)

    // Save to Supabase
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient().from('suggestions').insert({
        text: `[VOTE] ${q.question} → ${option}`,
        name: 'Voter',
      })
    })

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setDone(true)
      sessionStorage.setItem('wavmvmt_votes', JSON.stringify(newVotes))
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-8 md:bottom-[340px] left-3 md:left-5 pointer-events-auto px-3 py-2 rounded-xl text-[0.55rem] tracking-wider uppercase cursor-pointer z-10"
        style={{
          background: 'rgba(26,21,32,0.75)',
          border: '1px solid rgba(128,212,168,0.15)',
          color: 'rgba(128,212,168,0.4)',
        }}>
        Vote
      </button>
    )
  }

  const q = QUESTIONS[currentQ]

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-auto"
      onClick={() => setOpen(false)}>
      <div className="max-w-sm mx-4 p-6 rounded-2xl" style={panelStyle}
        onClick={e => e.stopPropagation()}>

        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">🗳️</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#80d4a8', fontFamily: "'Playfair Display', serif" }}>
              Thanks for Voting!
            </h3>
            <p className="text-[0.65rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>
              Your voice shapes the WAVMVMT Center. These votes directly influence real design decisions.
            </p>
            <button onClick={() => setOpen(false)}
              className="mt-4 px-6 py-2 rounded-full text-[0.65rem] tracking-wider uppercase cursor-pointer"
              style={{ border: '1px solid rgba(128,212,168,0.3)', color: '#80d4a8' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(128,212,168,0.5)' }}>
                Community Vote {currentQ + 1}/{QUESTIONS.length}
              </span>
              <button onClick={() => setOpen(false)} className="text-sm cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
            </div>

            <h3 className="text-sm font-bold mb-4" style={{ color: 'rgba(255,240,220,0.85)' }}>
              {q.question}
            </h3>

            <div className="space-y-2">
              {q.options.map(option => (
                <button key={option} onClick={() => vote(option)}
                  className="w-full py-3 px-4 rounded-xl text-[0.7rem] text-left cursor-pointer transition-all hover:border-[rgba(128,212,168,0.4)]"
                  style={{
                    background: 'rgba(128,212,168,0.05)',
                    border: '1px solid rgba(128,212,168,0.15)',
                    color: 'rgba(255,220,180,0.7)',
                  }}>
                  {option}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="h-1 rounded-full overflow-hidden mt-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{
                width: `${((currentQ) / QUESTIONS.length) * 100}%`,
                background: 'linear-gradient(90deg, #80d4a8, #f0c674)',
              }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

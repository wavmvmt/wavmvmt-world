'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.92)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.15)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

const STEPS = [
  {
    title: 'Welcome to WAVMVMT World',
    text: 'A digital construction site for a $100M+ wellness campus in Toronto. Walk around and explore 13 rooms being built.',
    hint: 'WASD to move · Mouse to look',
  },
  {
    title: '13 Rooms to Discover',
    text: 'Each glowing wireframe is a room. Walk near it to see specs. Press E to interact.',
    hint: 'Walk toward the nearest glow',
  },
  {
    title: 'Interactive Spaces',
    text: 'Tap beat pads, play singing bowls, ride skateboards. Take screenshots with P, share with X.',
    hint: 'Press E near objects',
  },
  {
    title: 'You\'re Part of This',
    text: 'Leave suggestions, check the build progress, and share to enter cash prize draws.',
    hint: 'Open panels at the screen edges',
  },
]

/**
 * Welcome tour — compact bottom-left toast, doesn't block the 3D scene.
 * Shows 4 steps. Only shows once (saved to localStorage).
 */
export function WelcomeTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('wavmvmt_tour_seen')
    if (!seen) {
      setTimeout(() => setVisible(true), 2500)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem('wavmvmt_tour_seen', 'true')
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else dismiss()
  }

  if (!visible) return null

  const s = STEPS[step]

  return (
    <div
      className="fixed bottom-20 left-4 z-30 pointer-events-auto max-w-xs rounded-2xl p-4 transition-all duration-500"
      style={{
        ...panelStyle,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Step dots */}
      <div className="flex gap-1 mb-3">
        {STEPS.map((_, i) => (
          <div key={i} className="h-0.5 rounded-full flex-1" style={{
            background: i <= step ? '#f0c674' : 'rgba(255,200,120,0.1)',
          }} />
        ))}
      </div>

      <h3 className="text-xs font-bold mb-1" style={{ color: 'rgba(255,240,220,0.9)', fontFamily: "'Playfair Display', serif" }}>
        {s.title}
      </h3>
      <p className="text-[0.6rem] leading-relaxed mb-1.5" style={{ color: 'rgba(255,220,180,0.5)' }}>
        {s.text}
      </p>
      <p className="text-[0.5rem] tracking-[0.1em] mb-3" style={{ color: 'rgba(240,198,116,0.35)' }}>
        {s.hint}
      </p>

      <div className="flex justify-between items-center">
        <button onClick={dismiss} className="text-[0.5rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.25)' }}>
          Skip
        </button>
        <button
          onClick={next}
          className="px-4 py-1.5 rounded-full text-[0.55rem] font-medium tracking-wider uppercase cursor-pointer"
          style={{
            border: '1px solid rgba(240,198,116,0.3)',
            color: '#f0c674',
            background: 'rgba(240,198,116,0.08)',
          }}
        >
          {step < STEPS.length - 1 ? 'Next' : 'Got it'}
        </button>
      </div>
    </div>
  )
}

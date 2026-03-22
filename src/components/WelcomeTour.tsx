'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.9)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.15)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

const STEPS = [
  {
    title: 'Welcome to WAVMVMT World',
    text: 'You\'re standing in the digital construction site of a $20M flagship wellness center in Toronto. Everything you see is being built — virtually and in real life.',
    hint: 'Use WASD to move, mouse/touch to look around',
  },
  {
    title: '12 Rooms Under Construction',
    text: 'Each glowing wireframe is a room. Walk up to see its specs — square footage, cost, features. The colored fill shows how far along the build is.',
    hint: 'Walk toward the nearest glowing room',
  },
  {
    title: 'Interactive Experiences',
    text: 'Tap the beat pads in the Music Studio. Play the singing bowls in the Sound Bath. Bounce on trampolines in the Parkour Gym. Ride skateboards around the site.',
    hint: 'Press E near objects to interact',
  },
  {
    title: 'You\'re Part of This',
    text: 'Leave a suggestion for what you\'d want in the space. Check the Real-World Build panel for fundraising progress. This world grows as the real project grows.',
    hint: 'Open panels with the buttons at the top. Press C for drone camera.',
  },
]

/**
 * Welcome tour for first-time visitors.
 * Shows 4 steps explaining the world.
 * Only shows once (saved to localStorage).
 */
export function WelcomeTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('wavmvmt_tour_seen')
    if (!seen) {
      setTimeout(() => setVisible(true), 2000) // Show after loading
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
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-sm mx-4 p-6 rounded-2xl" style={panelStyle}>
        {/* Step indicator */}
        <div className="flex gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 rounded-full flex-1" style={{
              background: i <= step ? '#f0c674' : 'rgba(255,200,120,0.1)',
            }} />
          ))}
        </div>

        <h3 className="text-sm font-bold mb-2" style={{ color: 'rgba(255,240,220,0.9)', fontFamily: "'Playfair Display', serif" }}>
          {s.title}
        </h3>
        <p className="text-[0.7rem] leading-relaxed mb-3" style={{ color: 'rgba(255,220,180,0.6)' }}>
          {s.text}
        </p>
        <p className="text-[0.55rem] tracking-[0.1em] mb-4" style={{ color: 'rgba(240,198,116,0.4)' }}>
          {s.hint}
        </p>

        <div className="flex justify-between items-center">
          <button onClick={dismiss} className="text-[0.6rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>
            Skip tour
          </button>
          <button
            onClick={next}
            className="px-5 py-2 rounded-full text-[0.65rem] font-medium tracking-wider uppercase cursor-pointer"
            style={{
              border: '1px solid rgba(240,198,116,0.3)',
              color: '#f0c674',
              background: 'rgba(240,198,116,0.08)',
            }}
          >
            {step < STEPS.length - 1 ? 'Next' : 'Start Exploring'}
          </button>
        </div>
      </div>
    </div>
  )
}

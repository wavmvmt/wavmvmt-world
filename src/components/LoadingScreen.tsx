'use client'

import { useState, useEffect } from 'react'

const STAGES = [
  { label: 'Pouring the foundation...', weight: 15 },
  { label: 'Building the warehouse shell...', weight: 20 },
  { label: 'Placing rooms & workers...', weight: 20 },
  { label: 'Tuning the singing bowls...', weight: 15 },
  { label: 'Setting up lighting & effects...', weight: 15 },
  { label: 'Connecting the frequencies...', weight: 15 },
]

/** Loading screen with staged progress while 3D scene loads */
export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0)
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    let p = 0
    let stage = 0
    let accumulated = 0

    const interval = setInterval(() => {
      const stageEnd = STAGES.slice(0, stage + 1).reduce((s, st) => s + st.weight, 0)
      const increment = 1.5 + Math.random() * 3

      p = Math.min(p + increment, 100)

      // Advance stage when progress crosses threshold
      if (p >= stageEnd && stage < STAGES.length - 1) {
        stage++
        setStageIdx(stage)
      }

      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(onLoaded, 400)
      }

      setProgress(p)
    }, 80)

    // Preload critical audio during loading
    const preloads = [
      '/audio/construction_loop.ogg',
      '/audio/footstep_01.ogg',
      '/audio/footstep_02.ogg',
    ]
    preloads.forEach(url => {
      fetch(url).catch(() => { /* non-critical */ })
    })

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#1a1520' }}>
      {/* Wave */}
      <div className="text-5xl mb-6" style={{
        color: '#f0c674',
        opacity: 0.3,
        fontFamily: "'Playfair Display', serif",
        animation: 'gentle-float 3s ease-in-out infinite',
      }}>~</div>

      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f0c674, #80d4a8)',
          }}
        />
      </div>

      {/* Percentage */}
      <div className="text-xs font-mono mb-2" style={{ color: '#f0c674' }}>
        {Math.floor(progress)}%
      </div>

      {/* Loading stage */}
      <div className="text-[0.6rem] tracking-[0.15em] transition-opacity duration-300" style={{ color: 'rgba(255,200,150,0.3)' }}>
        {STAGES[stageIdx]?.label}
      </div>

      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

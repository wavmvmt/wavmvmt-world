'use client'

import { useState, useEffect } from 'react'

/** Loading screen with animated progress while 3D scene loads */
export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0)
  const [tip, setTip] = useState('')

  const tips = [
    'Loading construction site...',
    'Hiring anime workers...',
    'Pouring foundation...',
    'Tuning singing bowls...',
    'Calibrating beat pads...',
    'Parking the forklifts...',
    'Hanging banners...',
    'Warming up the sauna...',
  ]

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)])

    // Simulated progress (real asset loading is hard to track with R3F)
    let p = 0
    const interval = setInterval(() => {
      p += 2 + Math.random() * 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(onLoaded, 500)
      }
      setProgress(Math.min(100, p))
    }, 100)

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

      {/* Loading tip */}
      <div className="text-[0.6rem] tracking-[0.15em]" style={{ color: 'rgba(255,200,150,0.3)' }}>
        {tip}
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

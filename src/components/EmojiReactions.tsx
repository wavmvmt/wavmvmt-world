'use client'

import { useState, useEffect, useCallback } from 'react'

const EMOJIS = ['🔥', '💪', '🎵', '🧘', '🏗️', '❤️', '👏', '🚀']

/**
 * Floating emoji reactions — click an emoji and it floats up from the screen.
 * Fun social engagement feature.
 */
export function EmojiReactions() {
  const [floating, setFloating] = useState<{ id: number; emoji: string; x: number }[]>([])
  const [open, setOpen] = useState(false)

  const addEmoji = useCallback((emoji: string) => {
    const id = Date.now()
    const x = 30 + Math.random() * 40 // random horizontal position %
    setFloating(prev => [...prev, { id, emoji, x }])
    setTimeout(() => {
      setFloating(prev => prev.filter(e => e.id !== id))
    }, 3000)
  }, [])

  return (
    <>
      {/* Floating emojis */}
      {floating.map(f => (
        <div key={f.id} className="fixed z-30 text-3xl pointer-events-none"
          style={{
            left: `${f.x}%`,
            bottom: '20%',
            animation: 'emoji-float 3s ease-out forwards',
          }}>
          {f.emoji}
        </div>
      ))}

      {/* Emoji picker button */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-3 md:right-[100px] pointer-events-auto z-10 w-10 h-10 rounded-full text-lg cursor-pointer flex items-center justify-center"
          style={{
            background: 'rgba(26,21,32,0.75)',
            border: '1px solid rgba(255,200,120,0.12)',
          }}
        >
          😊
        </button>
      ) : (
        <div className="fixed bottom-20 md:bottom-8 right-3 md:right-[100px] pointer-events-auto z-10 p-2 rounded-2xl flex gap-1 flex-wrap max-w-[180px]"
          style={{
            background: 'rgba(26,21,32,0.85)',
            border: '1px solid rgba(255,200,120,0.12)',
          }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => { addEmoji(e); setOpen(false) }}
              className="w-9 h-9 rounded-lg text-xl cursor-pointer hover:bg-white/5 flex items-center justify-center">
              {e}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes emoji-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  )
}

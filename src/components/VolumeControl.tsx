'use client'

import { useState, useEffect } from 'react'

/**
 * Floating volume control pill — minimizable.
 * Shows current volume + mute toggle.
 * Can be collapsed to just a speaker icon.
 */
export function VolumeControl() {
  const [volume, setVolume] = useState(0.3)
  const [muted, setMuted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      setMuted((e as CustomEvent).detail.muted)
    }
    window.addEventListener('audioState', handler as EventListener)
    return () => window.removeEventListener('audioState', handler as EventListener)
  }, [])

  function toggleMute() {
    window.dispatchEvent(new CustomEvent('toggleAudio'))
    setMuted(m => !m)
  }

  function changeVolume(v: number) {
    setVolume(v)
    window.dispatchEvent(new CustomEvent('setVolume', { detail: { volume: v } }))
    if (v === 0 && !muted) {
      setMuted(true)
      window.dispatchEvent(new CustomEvent('audioState', { detail: { muted: true } }))
    } else if (v > 0 && muted) {
      setMuted(false)
      window.dispatchEvent(new CustomEvent('audioState', { detail: { muted: false } }))
    }
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full pointer-events-auto cursor-pointer transition-all hover:border-[rgba(240,198,116,0.3)]"
        style={{
          background: 'rgba(26,21,32,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,220,180,0.08)',
          color: muted ? 'rgba(255,220,180,0.2)' : 'rgba(255,220,180,0.5)',
          fontSize: '0.75rem',
        }}
        title="Show volume"
      >
        {muted ? '🔇' : '🔊'}
      </button>
    )
  }

  return (
    <div className="fixed top-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full pointer-events-auto"
      style={{
        background: 'rgba(26,21,32,0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,220,180,0.08)',
      }}>
      <button onClick={toggleMute} className="cursor-pointer text-sm"
        style={{ color: muted ? 'rgba(255,220,180,0.2)' : 'rgba(255,220,180,0.5)' }}>
        {muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={muted ? 0 : volume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        className="w-16 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, rgba(240,198,116,0.4) 0%, rgba(240,198,116,0.4) ${(muted ? 0 : volume) * 100}%, rgba(255,220,180,0.08) ${(muted ? 0 : volume) * 100}%, rgba(255,220,180,0.08) 100%)`,
        }}
      />
      <button
        onClick={() => setCollapsed(true)}
        className="w-4 h-4 flex items-center justify-center rounded cursor-pointer text-[0.5rem] transition-all"
        style={{ color: 'rgba(255,220,180,0.25)' }}
        title="Minimize volume"
      >
        −
      </button>
    </div>
  )
}

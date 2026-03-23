'use client'

import { useState, useEffect } from 'react'

/**
 * Share card — shows personalized stats when player wants to share.
 * Generates a text summary they can copy/paste to social media.
 */
export function ShareCard() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [questCount, setQuestCount] = useState(0)

  useEffect(() => {
    const check = setInterval(() => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      setQuestCount(quests.length)
    }, 3000)
    return () => clearInterval(check)
  }, [])

  const shareText = `I just explored WAVMVMT World — a 3D construction site for a $40M wellness + fitness + arts + tech campus in Toronto!\n\n🏗️ ${questCount}/100 quests completed\n🎵 Music studio, sound bath, amphitheatre\n🏋️ Parkour gym, weight training, recovery suite\n📚 Education wing: business, coding, AI classes\n🛹 Skatepark, sports field, rooftop terrace\n\n12 rooms + outdoor campus + upper floor practitioner offices\n\nWalk through it yourself: https://wavmvmt-world.vercel.app\n\n#WAVMVMT #BuildInPublic #WellnessTech`

  function copyToClipboard() {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'x' && !e.ctrlKey && !e.metaKey) setOpen(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-auto"
      onClick={() => setOpen(false)}>
      <div className="max-w-sm mx-4 p-5 rounded-2xl" onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(26,21,32,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(240,198,116,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
          Share Your Visit
        </h3>

        {/* Preview card */}
        <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.1)' }}>
          <pre className="text-[0.55rem] whitespace-pre-wrap" style={{ color: 'rgba(255,220,180,0.6)', fontFamily: "'DM Sans', sans-serif" }}>
            {shareText}
          </pre>
        </div>

        {/* Direct social media buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noopener noreferrer"
            className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase text-center no-underline cursor-pointer"
            style={{ border: '1px solid rgba(29,155,240,0.3)', color: '#1d9bf0', background: 'rgba(29,155,240,0.08)' }}>
            Post to X
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://wavmvmt-world.vercel.app')}`}
            target="_blank" rel="noopener noreferrer"
            className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase text-center no-underline cursor-pointer"
            style={{ border: '1px solid rgba(10,102,194,0.3)', color: '#0a66c2', background: 'rgba(10,102,194,0.08)' }}>
            LinkedIn
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wavmvmt-world.vercel.app')}&quote=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noopener noreferrer"
            className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase text-center no-underline cursor-pointer"
            style={{ border: '1px solid rgba(24,119,242,0.3)', color: '#1877f2', background: 'rgba(24,119,242,0.08)' }}>
            Facebook
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noopener noreferrer"
            className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase text-center no-underline cursor-pointer"
            style={{ border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', background: 'rgba(37,211,102,0.08)' }}>
            WhatsApp
          </a>
        </div>

        <div className="flex gap-2">
          <button onClick={copyToClipboard}
            className="flex-1 py-2 rounded-xl text-[0.65rem] font-medium tracking-wider uppercase cursor-pointer"
            style={{
              border: '1px solid rgba(240,198,116,0.3)',
              color: copied ? '#80d4a8' : '#f0c674',
              background: 'rgba(240,198,116,0.08)',
            }}>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'WAVMVMT World', text: shareText, url: 'https://wavmvmt-world.vercel.app' })
            }
          }}
            className="flex-1 py-2 rounded-xl text-[0.65rem] font-medium tracking-wider uppercase cursor-pointer"
            style={{ border: '1px solid rgba(128,212,168,0.3)', color: '#80d4a8', background: 'rgba(128,212,168,0.08)' }}>
            Share (Native)
          </button>
        </div>

        {/* Contest banner */}
        <div className="mt-3 p-2.5 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(240,198,116,0.08), rgba(128,212,168,0.08))',
          border: '1px solid rgba(240,198,116,0.15)',
        }}>
          <div className="text-[0.55rem] font-bold mb-1" style={{ color: '#f0c674' }}>
            WIN CASH PRIZES
          </div>
          <div className="text-[0.48rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Early visitors who explore + share on social media are automatically entered into our cash prize giveaway. Prizes awarded at first successful funding round and at grand opening. The earlier you share, the more entries you earn.
          </div>
        </div>

        <p className="text-[0.45rem] text-center mt-3" style={{ color: 'rgba(255,220,180,0.2)' }}>
          Press X to close
        </p>
      </div>
    </div>
  )
}

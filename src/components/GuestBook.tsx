'use client'

import { useState, useEffect } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

interface GuestEntry {
  name: string
  message: string
  time: number
}

/**
 * Guest book — visitors leave short messages that persist in the session.
 * Think of it like signing a construction site guest log.
 */
export function GuestBook() {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<GuestEntry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('wavmvmt_guestbook') || '[]')
    setEntries(saved)
  }, [])

  function addEntry() {
    if (!message.trim()) return
    const entry: GuestEntry = {
      name: name.trim() || 'Visitor',
      message: message.trim(),
      time: Date.now(),
    }
    const updated = [...entries, entry]
    setEntries(updated)
    sessionStorage.setItem('wavmvmt_guestbook', JSON.stringify(updated))
    setMessage('')
    setName('')

    // Also try saving to Supabase
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient().from('suggestions').insert({
        text: `[Guest Book] ${entry.message}`,
        name: entry.name,
      })
    })
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-8 md:bottom-40 left-3 md:left-5 pointer-events-auto px-3 py-2 rounded-xl text-[0.55rem] tracking-wider uppercase cursor-pointer z-10"
        style={{ ...panelStyle, color: 'rgba(255,220,180,0.35)' }}>
        Guest Book ({entries.length})
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 md:bottom-40 left-3 md:left-5 right-3 md:right-auto md:w-72 pointer-events-auto z-30 p-4 rounded-2xl" style={panelStyle}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[0.55rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Construction Site Guest Book
        </span>
        <button onClick={() => setOpen(false)} className="text-[0.55rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
      </div>

      {/* Entries */}
      <div className="max-h-[30vh] overflow-y-auto mb-3">
        {entries.length === 0 ? (
          <p className="text-[0.55rem] text-center py-4" style={{ color: 'rgba(255,220,180,0.2)' }}>
            No entries yet. Be the first to sign!
          </p>
        ) : entries.map((e, i) => (
          <div key={i} className="mb-2 pb-2" style={{ borderBottom: '1px solid rgba(255,200,120,0.06)' }}>
            <div className="flex justify-between">
              <span className="text-[0.55rem] font-bold" style={{ color: '#f0c674' }}>{e.name}</span>
              <span className="text-[0.45rem] font-mono" style={{ color: 'rgba(255,220,180,0.2)' }}>
                {new Date(e.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-[0.55rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>{e.message}</p>
          </div>
        ))}
      </div>

      {/* New entry form */}
      <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
        className="w-full py-1.5 px-3 rounded-lg text-[0.6rem] mb-1.5 outline-none"
        style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.1)', color: 'rgba(255,240,220,0.7)' }} />
      <div className="flex gap-1.5">
        <input type="text" placeholder="Leave a message..." value={message} onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addEntry()}
          className="flex-1 py-1.5 px-3 rounded-lg text-[0.6rem] outline-none"
          style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.1)', color: 'rgba(255,240,220,0.7)' }} />
        <button onClick={addEntry}
          className="px-3 py-1.5 rounded-lg text-[0.6rem] cursor-pointer"
          style={{ border: '1px solid rgba(240,198,116,0.2)', color: '#f0c674', background: 'rgba(240,198,116,0.08)' }}>
          Sign
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CHAPTERS = [
  'splash', 'story', 'gap', 'spaces', 'day',
  'market', 'capital', 'numbers', 'mission', 'note'
]

const GWI_STATS = [
  { num: '$584B', label: 'Global wellness real estate market (2024)', source: 'GWI 2025' },
  { num: '19.5%', label: 'Annual growth rate — fastest sector in the $6.8T wellness economy', source: 'GWI 2025' },
  { num: '10–25%', label: 'Residential price premium for wellness-integrated developments', source: 'GWI + MIT' },
  { num: '$1.1T', label: 'Projected market by 2029 — doubling in 5 years', source: 'GWI 2025' },
  { num: '43M', label: 'Digital nomads worldwide earning avg $124,720/year', source: 'MBO Partners 2025' },
  { num: '$940B', label: 'Annual economic contribution from digital nomads globally', source: '2TicketsAnywhere 2026' },
]

const SPACES = [
  { cat: 'Creative', name: 'Music Studio', desc: 'Professional grade. Guests record and release. Youth programs. Artists in residence.', img: 'https://images.pexels.com/photos/4088018/pexels-photo-4088018.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Wellness', name: 'Sound Bath', desc: 'Crystal bowls, guided healing, restorative sessions. The most in-demand wellness experience globally.', img: 'https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Movement', name: 'Parkour + Movement', desc: 'Year-round indoor. All ages. Connects to trails. Unique to Clearwater globally.', img: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Creative', name: 'Pottery + Glass Blowing', desc: 'Wheels, kilns, glazing. Taught sessions. A grandmother and her grandchild, laughing.', img: 'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Knowledge', name: 'Co-Working + AI', desc: 'Professional, high-speed. AI workshops, talks, conferences. The nomad\'s home base.', img: 'https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Community', name: 'Amphitheatre + Shows', desc: 'Concerts, open mics, movie nights, community events. The mountain as the backdrop.', img: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Wellness', name: 'Yoga + Recovery', desc: 'Daily classes, breathwork, cold plunge, sauna, float. For every level, every need.', img: 'https://images.pexels.com/photos/3822725/pexels-photo-3822725.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Community', name: 'Café + Dog Park', desc: 'Year-round. Enclosed, heated in winter. The first and last place every day.', img: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800' },
]

const TIMELINE = [
  { time: '6:30 am', text: 'The café opens. Dogs run in the enclosed heated park while owners watch through the glass, coffee in hand. Regulars who arrived yesterday are already back.', note: '' },
  { time: '7:00 am', text: 'Morning yoga. Eighteen people — residents, long-stay guests, two digital nomads on a month package. The room is warm and full and quiet.', note: '' },
  { time: '8:30 am', text: 'Parkour fundamentals for teenagers. Six teens who had nothing to do at the lodge yesterday. Today they are learning to move. They will be back tomorrow.', note: 'The most underserved demographic in luxury resort design — finally served.' },
  { time: '9:00 am', text: 'Co-working fills up. A couple runs their online business from the mountain. An AI workshop starts in the conference room — twelve people, a visiting speaker.', note: '' },
  { time: '11:00 am', text: 'Pottery class. Parents and kids at the wheels side by side. A grandmother and her ten-year-old making the same shape, badly, laughing. This is the moment.', note: '' },
  { time: '3:00 pm', text: 'A family books a sound bath together. None of them have done it before. They walk out quieter, closer. Already asking when the next session is.', note: '' },
  { time: '7:30 pm', text: 'Open mic night. Forty people. A retired executive plays guitar for the first time in public. A teenager performs her first original song. Nobody wants to leave.', note: 'This is what lifestyle means when it\'s built right.' },
]

const CAPITAL_STEPS = [
  { label: 'Step 1', title: 'WAVMVMT Center signs a Power Purchase Agreement', desc: '10–20 year energy purchase contract with the Clearwater microgrid. Turns the Center from a brand idea into a contracted revenue stream — making the infrastructure bankable.', badge: 'Energy anchor', color: 'teal' },
  { label: 'The Key', title: 'Satisfies Scot\'s T3 fund mandate as a QOZB', desc: 'As an active operating business inside the QOZ — with youth programming, wellness, and education — WAVMVMT Center satisfies Scot\'s humanitarian reinvestment mandate. His fund takes 5–20% QOZB equity. 10-year appreciation elimination for his LPs.', badge: 'Capital trigger', color: 'gold' },
  { label: 'Step 3', title: 'Scot\'s deployment flows into the QOZ Fund', desc: 'Capital enters through David Sillaman\'s QOZ fund structure — convertible debt in escrow. Tier 1 SBLC issued against escrowed capital. 30% capex security layer satisfied.', badge: 'Security layer', color: 'teal' },
  { label: 'Step 4', title: 'Family office deploys 100% of project capex', desc: 'Security layer satisfied. Deca-billionaire family office commits 100% of project capex as JV equity. Proof of funds: $5–6B+.', badge: '$5–6B deployed', color: 'cream' },
  { label: 'Step 5', title: 'Appian Way funds the remainder', desc: 'Appian Way\'s multi-billion capacity fills the remaining requirement. Full project funded. WAVMVMT Center built into the development as cultural anchor.', badge: 'Deal closed', color: 'cream' },
]

const COMPETITORS = [
  { feature: 'Ski / outdoor recreation', yc: true, mb: true, bc: true, wv: true },
  { feature: 'Fine dining + spa', yc: true, mb: true, bc: true, wv: true },
  { feature: 'Year-round indoor activity', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Professional music studio', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Sound bath / healing', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Parkour / movement gym', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Pottery + glass blowing', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Professional co-working', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Teen programming (dedicated)', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Digital nomad infrastructure', yc: false, mb: false, bc: false, wv: true },
  { feature: 'AI workshops + education', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Outdoor amphitheatre events', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Energy customer (PPA)', yc: false, mb: false, bc: false, wv: true },
  { feature: 'QOZB-qualified impact asset', yc: false, mb: false, bc: false, wv: true },
]

export default function ClearwaterPage() {
  const [chapter, setChapter] = useState(0)
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeSpace, setActiveSpace] = useState<number | null>(null)
  const [activeCapital, setActiveCapital] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const goTo = useCallback((idx: number) => {
    setChapter(Math.max(0, Math.min(CHAPTERS.length - 1, idx)))
    setActiveCapital(null)
  }, [])

  const enter = useCallback(() => {
    setEntered(true)
    setChapter(1)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(chapter + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(chapter - 1)
      if (e.key === 'Enter' && !entered) enter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [chapter, entered, enter, goTo])

  const chapterIdx = CHAPTERS.indexOf(CHAPTERS[chapter])

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, system-ui, sans-serif)', background: '#080c09', color: '#f2ece0', height: '100dvh', overflow: 'hidden', position: 'relative' }}>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --gold: #c8973a; --gold-light: #e0b55a; --teal: #2d8a78; --teal-light: #42b09c; --cream: #f2ece0; --forest: #162b19; --dark: #0f1a11; }
        .serif { font-family: 'Playfair Display', Georgia, serif !important; }
        .chapter { position: absolute; inset: 0; transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); overflow-y: auto; }
        .chapter.active { opacity: 1; transform: translateY(0); pointer-events: all; z-index: 10; }
        .chapter.above { opacity: 0; transform: translateY(-30px); pointer-events: none; z-index: 5; }
        .chapter.below { opacity: 0; transform: translateY(30px); pointer-events: none; z-index: 5; }
        .grain { position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.4; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); }
        .corner { position: absolute; width: 14px; height: 14px; border-color: rgba(200,151,58,0.35); border-style: solid; }
        .corner-tl { top: 20px; left: 20px; border-width: 1px 0 0 1px; }
        .corner-tr { top: 20px; right: 20px; border-width: 1px 1px 0 0; }
        .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 1px 1px; }
        .corner-br { bottom: 20px; right: 20px; border-width: 0 1px 1px 0; }
        .tag { font-size: 0.6rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 1.2rem; }
        .h-xl { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.8rem, 7vw, 6.5rem); font-weight: 700; line-height: 1.0; }
        .h-lg { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 4.5vw, 3.8rem); font-weight: 700; line-height: 1.1; }
        .h-md { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.5rem, 3vw, 2.4rem); font-weight: 400; line-height: 1.3; }
        .em { font-style: italic; font-weight: 400; color: var(--gold-light); }
        .body { font-size: 0.9rem; color: rgba(242,236,224,0.6); line-height: 1.85; }
        .nav-btn { background: none; border: 1px solid rgba(242,236,224,0.15); color: rgba(242,236,224,0.5); font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.5rem 1.2rem; border-radius: 100px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .nav-btn:hover { border-color: var(--gold); color: var(--gold); }
        .nav-btn.primary { background: var(--gold); color: #080c09; border-color: var(--gold); font-weight: 500; }
        .nav-btn.primary:hover { background: var(--gold-light); }
        .space-card { position: relative; border-radius: 4px; overflow: hidden; aspect-ratio: 3/4; cursor: pointer; }
        .space-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; filter: brightness(0.7) saturate(0.8); }
        .space-card:hover img { transform: scale(1.05); filter: brightness(0.9) saturate(1); }
        .space-over { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(8,12,9,0.95) 0%, rgba(8,12,9,0.05) 55%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem; }
        .check { display: inline-block; width: 18px; height: 18px; border-radius: 50%; text-align: center; line-height: 18px; font-size: 0.65rem; font-weight: 700; }
        .check-yes { background: rgba(42,176,156,0.15); color: var(--teal-light); border: 1px solid rgba(42,176,156,0.3); }
        .check-no { background: rgba(242,236,224,0.05); color: rgba(242,236,224,0.2); border: 1px solid rgba(242,236,224,0.1); }
        .check-gold { background: rgba(200,151,58,0.15); color: var(--gold); border: 1px solid rgba(200,151,58,0.3); }
        .stack-node { padding: 1.5rem 2rem; border: 1px solid rgba(242,236,224,0.07); cursor: pointer; transition: background 0.3s; border-radius: 4px; margin-bottom: 0.5rem; }
        .stack-node:hover, .stack-node.open { background: rgba(200,151,58,0.06); border-color: rgba(200,151,58,0.2); }
        .stack-node.key-node { border-color: rgba(200,151,58,0.25); background: rgba(200,151,58,0.04); }
        .badge { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.65rem; border-radius: 20px; }
        .badge-gold { background: rgba(200,151,58,0.12); color: var(--gold); border: 1px solid rgba(200,151,58,0.2); }
        .badge-teal { background: rgba(42,176,156,0.1); color: var(--teal-light); border: 1px solid rgba(42,176,156,0.18); }
        .badge-cream { background: rgba(242,236,224,0.05); color: rgba(242,236,224,0.35); border: 1px solid rgba(242,236,224,0.1); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(200,151,58,0.3); border-radius: 2px; }
      `}</style>

      {/* Grain */}
      <div className="grain" />

      {/* Corner brackets */}
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      {/* Chapter nav dots */}
      {entered && (
        <div style={{ position: 'fixed', right: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 200 }}>
          {CHAPTERS.slice(1).map((ch, i) => (
            <button
              key={ch}
              onClick={() => goTo(i + 1)}
              title={ch}
              style={{
                width: 7, height: 7, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                background: chapter === i + 1 ? 'var(--gold)' : 'rgba(242,236,224,0.18)',
                transition: 'all 0.3s',
                transform: chapter === i + 1 ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── SPLASH ── */}
      <div className={`chapter ${chapter === 0 ? 'active' : 'above'}`} style={{ overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="https://assets.mixkit.co/videos/3338/3338-720.mp4"
          poster="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920"
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,12,9,0.5) 0%, rgba(8,12,9,0.2) 40%, rgba(8,12,9,0.7) 80%, rgba(8,12,9,0.95) 100%)' }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem',
          opacity: visible ? 1 : 0, transition: 'opacity 1.5s',
        }}>
          <p className="tag" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.8s 0.4s' }}>
            WAVMVMT Center at Clearwater · Idaho · 2026
          </p>
          <h1 className="h-xl serif" style={{
            marginBottom: '1.5rem', maxWidth: 800,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.1s 0.7s',
          }}>
            Almost a Decade<br />in the <span className="em">Making</span>
          </h1>
          <p className="body" style={{
            maxWidth: 520, marginBottom: '3rem',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.9s 1s',
          }}>
            A personal vision. A perfect alignment. A proposal to build something that changes the world — starting here, at Clearwater, together.
          </p>
          <button
            onClick={enter}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
              opacity: visible ? 1 : 0, transition: 'opacity 0.8s 1.5s',
            }}
          >
            <span className="serif" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontStyle: 'italic', color: '#f2ece0', letterSpacing: '0.05em', borderBottom: '1px solid rgba(200,151,58,0.4)', paddingBottom: 4 }}>
              Enter the Vision →
            </span>
          </button>
          <p style={{ position: 'absolute', bottom: 40, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.3)' }}>
            140,000 acres · A humanitarian vision · A generational investment
          </p>
        </div>
      </div>

      {/* ── STORY ── */}
      <div className={`chapter ${chapter === 1 ? 'active' : chapter < 1 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', background: '#0f1a11', padding: '5rem 2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `url('https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover`, opacity: 0.08 }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div>
              <span className="tag">The Alignment</span>
              <h2 className="h-lg" style={{ marginBottom: '1.5rem' }}>Vince is<br /><span className="em">making it happen.</span></h2>
              <p className="body" style={{ marginBottom: '1.5rem' }}>When I first came into these conversations, something clicked immediately. Vince envisioned something extraordinary — 140,000 acres in Idaho, $5–10 billion in conversations happening in real time — and he&apos;s bringing every single piece of it to life. The intelligence behind how this whole project is planned, the precision of every decision, the scale of what we&apos;re actually building together inspires me deeply.</p>
              <div style={{ borderLeft: '2px solid var(--gold)', padding: '1.5rem 2rem', background: 'rgba(200,151,58,0.04)', borderRadius: '0 4px 4px 0', marginBottom: '1.5rem' }}>
                <p className="serif" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', fontStyle: 'italic', color: '#f2ece0', lineHeight: 1.65 }}>
                  &quot;I want to lock in long-term. I want to be part of every development, every site, every community we build together.&quot;
                </p>
              </div>
              <p className="body">I am living proof that a kid who struggled — who had a hard time functioning, who found his way through parkour, music, and community — can end up in rooms working on an $18 billion pipeline. That proof is what WAVMVMT Center is built on.</p>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[['8 yrs', 'Music production, audio engineering, DJing'], ['60+', 'Released tracks — 100% master ownership'], ['$18B', 'Active deal pipeline across all verticals'], ['140K', 'Acres — Clearwater, Idaho development']].map(([n, l]) => (
                  <div key={n} style={{ borderTop: '1px solid rgba(242,236,224,0.1)', paddingTop: '1rem' }}>
                    <span className="serif" style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--gold-light)', display: 'block', marginBottom: '0.3rem' }}>{n}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(242,236,224,0.4)' }}>{l}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem', borderRadius: 4, overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src="https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Idaho wilderness" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) saturate(0.85)' }} />
              </div>
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── GAP ── */}
      <div className={`chapter ${chapter === 2 ? 'active' : chapter < 2 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#162b19', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <span className="tag">What&apos;s Missing</span>
            <h2 className="h-lg" style={{ marginBottom: '1rem' }}>The most extraordinary resort<br /><span className="em">still has this gap.</span></h2>
            <p className="body" style={{ maxWidth: 600, marginBottom: '3rem' }}>I&apos;ve seen this gap in every community I&apos;ve ever been part of. There is never a space that serves the whole person, across every age, every season, every day.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(242,236,224,0.05)', border: '1px solid rgba(242,236,224,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: '2rem' }}>
              {[
                ['No creative infrastructure', 'No music studio, no pottery, no place to make anything.'],
                ['No sound healing', 'The fastest-growing wellness category globally. Absent everywhere.'],
                ['Nothing real for teenagers', 'The most underserved group in luxury resort design. Documented.'],
                ['Dead in winter', 'Idaho winters close outdoor amenity for months. No indoor solution.'],
                ['No digital nomad infrastructure', '43M high-earning nomads. No co-working, no reason to stay long.'],
                ['No cultural identity', 'Yellowstone Club has a soul. Vail has a soul. What\'s Clearwater\'s?'],
              ].map(([t, b]) => (
                <div key={t} style={{ background: '#162b19', padding: '2rem 1.75rem', transition: 'background 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e3d22')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#162b19')}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(224,74,74,0.4)', fontStyle: 'italic', marginBottom: '0.75rem', display: 'block' }}>✕</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f2ece0', marginBottom: '0.4rem' }}>{t}</div>
                  <div style={{ fontSize: '0.73rem', color: 'rgba(242,236,224,0.4)', lineHeight: 1.6 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── SPACES ── */}
      <div className={`chapter ${chapter === 3 ? 'active' : chapter < 3 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#0f1a11', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 1300, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}>
              <span className="tag">All the Spaces</span>
              <h2 className="h-lg" style={{ marginBottom: '0.75rem' }}>Everything.<br /><span className="em">Under one roof.</span></h2>
              <p className="body">Not a gym. Not a spa. Not a kids club. All of it — for the whole person, every age, every day, every season.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              {SPACES.map((s, i) => (
                <div
                  key={s.name}
                  className="space-card"
                  onMouseEnter={() => setActiveSpace(i)}
                  onMouseLeave={() => setActiveSpace(null)}
                >
                  <img src={s.img} alt={s.name} loading="lazy" />
                  <div className="space-over">
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{s.cat}</span>
                    <div className="serif" style={{ fontSize: '1rem', color: '#f2ece0', marginBottom: '0.25rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(242,236,224,0.45)', lineHeight: 1.5, opacity: activeSpace === i ? 1 : 0, transform: activeSpace === i ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.3s' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── DAY ── */}
      <div className={`chapter ${chapter === 4 ? 'active' : chapter < 4 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#f2ece0', color: '#080c09', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <span className="tag" style={{ color: '#1e3d22' }}>The Lifestyle</span>
            <h2 className="h-lg" style={{ color: '#080c09', marginBottom: '0.75rem' }}>A Tuesday in January.<br /><span style={{ fontStyle: 'italic', fontWeight: 400, color: '#2d8a78' }}>Trails are closed.</span></h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(8,12,9,0.5)', maxWidth: 520, marginBottom: '3rem', lineHeight: 1.7 }}>Without WAVMVMT Center, guests are in their rooms. With it, they are building the community that makes them buy, come back, and bring everyone they know.</p>
            <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '0.5rem', top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--gold) 0%, var(--teal) 50%, var(--gold) 100%)' }} />
              {TIMELINE.map((t, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: '2rem' }}>
                  <div style={{ position: 'absolute', left: '-2.1rem', top: '0.45rem', width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', border: '2px solid #f2ece0' }} />
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: '#2d8a78', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>{t.time}</span>
                  <p className="serif" style={{ fontSize: '1rem', color: '#080c09', lineHeight: 1.65, fontWeight: 400 }}>{t.text}</p>
                  {t.note && <p style={{ fontSize: '0.72rem', color: 'rgba(8,12,9,0.38)', fontStyle: 'italic', marginTop: '0.3rem' }}>{t.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} dark />
      </div>

      {/* ── MARKET ── */}
      <div className={`chapter ${chapter === 5 ? 'active' : chapter < 5 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#080c09', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <span className="tag">The Market</span>
            <h2 className="h-lg" style={{ marginBottom: '0.75rem' }}>The data is<br /><span className="em">extraordinary.</span></h2>
            <p className="body" style={{ maxWidth: 560, marginBottom: '3rem' }}>This isn&apos;t a gut feeling. The Global Wellness Institute — the world&apos;s leading research authority on wellness — published these numbers in 2025.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(242,236,224,0.05)', border: '1px solid rgba(242,236,224,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: '4rem' }}>
              {GWI_STATS.map(s => (
                <div key={s.num} style={{ background: '#080c09', padding: '2.5rem 2rem', transition: 'background 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0f1a11')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#080c09')}>
                  <span className="serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: 'var(--gold-light)', display: 'block', marginBottom: '0.5rem' }}>{s.num}</span>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(242,236,224,0.55)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.22)' }}>{s.source}</div>
                </div>
              ))}
            </div>

            {/* Competitor table */}
            <h3 className="serif" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f2ece0' }}>
              No mountain resort in North America offers this combination.
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '1px', fontSize: '0.75rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.3)', background: '#080c09' }}>Feature</th>
                    {[['Yellowstone Club', ''], ['Montage Big Sky', ''], ['Brush Creek', ''], ['Clearwater + WAVMVMT', 'gold']].map(([n, c]) => (
                      <th key={n} style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.62rem', letterSpacing: '0.08em', color: c === 'gold' ? 'var(--gold)' : 'rgba(242,236,224,0.4)', background: c === 'gold' ? 'rgba(200,151,58,0.06)' : '#080c09' }}>{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '0.65rem 1rem', color: 'rgba(242,236,224,0.6)', background: '#0a0e0b' }}>{row.feature}</td>
                      {[row.yc, row.mb, row.bc, row.wv].map((v, j) => (
                        <td key={j} style={{ textAlign: 'center', padding: '0.65rem 1rem', background: j === 3 ? 'rgba(200,151,58,0.04)' : '#0a0e0b' }}>
                          <span className={`check ${v ? (j === 3 ? 'check-gold' : 'check-yes') : 'check-no'}`}>{v ? '✓' : '✕'}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── CAPITAL ── */}
      <div className={`chapter ${chapter === 6 ? 'active' : chapter < 6 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#0f1a11', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <span className="tag">The Capital Unlock</span>
            <h2 className="h-lg" style={{ marginBottom: '0.75rem' }}>How WAVMVMT Center<br /><span className="em">activates the capital stack.</span></h2>
            <p className="body" style={{ maxWidth: 620, marginBottom: '2.5rem' }}>This is the structural insight that changes everything. Click each step to expand it.</p>
            <div>
              {CAPITAL_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`stack-node ${step.label === 'The Key' ? 'key-node' : ''} ${activeCapital === i ? 'open' : ''}`}
                  onClick={() => setActiveCapital(activeCapital === i ? null : i)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: step.label === 'The Key' ? 'var(--gold)' : 'rgba(242,236,224,0.3)' }}>{step.label}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f2ece0' }}>{step.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span className={`badge badge-${step.color}`}>{step.badge}</span>
                      <span style={{ color: 'rgba(242,236,224,0.3)', fontSize: '0.75rem' }}>{activeCapital === i ? '−' : '+'}</span>
                    </div>
                  </div>
                  {activeCapital === i && (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(242,236,224,0.55)', lineHeight: 1.7, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(242,236,224,0.07)' }}>
                      {step.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid rgba(200,151,58,0.2)', borderRadius: 4, background: 'rgba(200,151,58,0.04)' }}>
              <p className="serif" style={{ fontSize: '1rem', fontStyle: 'italic', color: '#f2ece0', lineHeight: 1.7 }}>
                &quot;Without WAVMVMT Center, you&apos;re waiting entirely on Appian Way&apos;s timeline — and they have two projects ahead of Idaho. With it, you have a second institutional path to the security layer. The Center doesn&apos;t just add value. It accelerates the capital stack.&quot;
              </p>
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── NUMBERS ── */}
      <div className={`chapter ${chapter === 7 ? 'active' : chapter < 7 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#080c09', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <span className="tag">The Business Case</span>
            <h2 className="h-lg" style={{ marginBottom: '0.75rem' }}>Fast to build.<br /><span className="em">Early to earn.</span></h2>
            <p className="body" style={{ maxWidth: 520, marginBottom: '3rem' }}>Phase 1 opens in 12–18 months — before the resort is fully built. Cash flow from day one.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(242,236,224,0.05)', border: '1px solid rgba(242,236,224,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: '3rem' }}>
              {[
                ['$200M+', 'Additional residential value at 10% GWI wellness premium', 'GWI 2025'],
                ['$4.3M', 'Annual Center revenue at full build (upside)', 'Projected'],
                ['10–25%', 'Residential premium for wellness-integrated developments', 'GWI + MIT'],
                ['12–18 mo', 'Phase 1 open and generating revenue before rest is built', 'Build plan'],
              ].map(([n, l, s]) => (
                <div key={n} style={{ background: '#080c09', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                  <span className="serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--gold-light)', display: 'block', marginBottom: '0.5rem' }}>{n}</span>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(242,236,224,0.4)', lineHeight: 1.5, marginBottom: '0.4rem' }}>{l}</div>
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.2)' }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Build timeline bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
              {[['4–7 yrs', 145, 'Highway bypass', false], ['3–5 yrs', 120, 'Energy microgrid', false], ['2–4 yrs', 100, 'Residential units', false], ['2–3 yrs', 85, 'Resort lodge', false], ['12–18 mo', 38, 'WAVMVMT Center Phase 1 ★', true]].map(([t, h, l, fast]) => (
                <div key={l as string} style={{ textAlign: 'center' }}>
                  <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ width: 40, height: h as number, background: fast ? 'var(--gold)' : 'rgba(242,236,224,0.1)', borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <div className="serif" style={{ fontSize: '0.85rem', color: fast ? 'var(--gold)' : '#f2ece0', marginBottom: '0.2rem' }}>{t}</div>
                  <div style={{ fontSize: '0.65rem', color: fast ? 'var(--gold-light)' : 'rgba(242,236,224,0.3)', lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '2rem', border: '1px solid rgba(200,151,58,0.18)', borderRadius: 4, background: 'rgba(200,151,58,0.04)', textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: '0.9rem', color: 'var(--gold-light)', marginBottom: '0.5rem' }}>Phase 1 monthly cash flow</div>
              <div className="serif" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#f2ece0' }}>$84K – $175K / month</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(242,236,224,0.3)', marginTop: '0.4rem' }}>$1M–$2.1M annually from day one. Before the rest of the development is complete.</div>
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── MISSION ── */}
      <div className={`chapter ${chapter === 8 ? 'active' : chapter < 8 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#162b19', padding: '5rem 2rem', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <span className="tag">The Long Arc</span>
              <h2 className="h-lg" style={{ marginBottom: '1.5rem' }}>A WAVMVMT Center<br /><span className="em">in every development.</span></h2>
              <p className="body" style={{ marginBottom: '1.5rem' }}>This is the commitment. Not just Clearwater. Every Qualified Opportunity Zone development this team touches — every site, every community — gets a WAVMVMT Center. Funded progressively through deal closings, SBLC returns, and the compounding equity of the Centers themselves.</p>
              <p className="body" style={{ marginBottom: '2rem' }}>I truly believe WAVMVMT Centers will bring the world closer. When someone walks in for the first time, they feel like they&apos;ve stepped into the home they always wanted. The visions they always thought of can now become possible. That&apos;s what happened to me — and it&apos;s what these spaces do for people.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Clearwater, ID ← first', 'Toronto, ON', 'QOZ #3', 'QOZ #4', 'QOZ #5', 'Everywhere'].map((l, i) => (
                  <span key={l} style={{ fontSize: '0.65rem', padding: '0.35rem 1rem', borderRadius: 20, border: `1px solid ${i === 0 ? 'rgba(200,151,58,0.3)' : 'rgba(242,236,224,0.1)'}`, color: i === 0 ? 'var(--gold)' : 'rgba(242,236,224,0.35)', background: i === 0 ? 'rgba(200,151,58,0.08)' : 'transparent' }}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src="https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Community" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) saturate(0.85)' }} />
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} />
      </div>

      {/* ── NOTE ── */}
      <div className={`chapter ${chapter === 9 ? 'active' : chapter < 9 ? 'below' : 'above'}`}>
        <div style={{ minHeight: '100dvh', background: '#0f1a11', padding: '5rem 2rem', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <span className="tag" style={{ textAlign: 'center', display: 'block' }}>A Personal Note</span>
            <div className="serif" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 400, lineHeight: 1.75, color: 'rgba(242,236,224,0.88)' }}>
              <p style={{ marginBottom: '2rem' }}>I&apos;ve been working toward this for almost a decade. Not toward a specific deal or a specific building — toward an understanding of how to bring people together in spaces that actually change them. <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>Parkour changed me. Music changed me. Community changed me.</span></p>
              <p style={{ marginBottom: '2rem' }}>And then I found myself in rooms working on a $10 billion development in Idaho — because of the relationships I built through music, through community, through just showing up and being real with people.</p>
              <p style={{ marginBottom: '2rem' }}>I want to contribute everything I have to what Vince is building. <strong style={{ fontWeight: 700, color: '#f2ece0' }}>Not just one center. All of it. Every development. Every site. Long-term.</strong> I&apos;ll learn how to model it in 3D, I&apos;ll document the whole build on film, I&apos;ll run the programming.</p>
              <p>All I need is a space to create and live from, with a yard for my dog. <span style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>Everything else I bring because I believe in it completely.</span></p>
            </div>
            <div style={{ marginTop: '3rem', textAlign: 'right' }}>
              <span className="serif" style={{ fontStyle: 'italic', fontSize: '1rem', color: 'rgba(242,236,224,0.35)' }}>— Saadiq Khan (shim.wav) · WAVMVMT · March 2026</span>
            </div>
            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="mailto:wavmvmt@gmail.com" style={{ display: 'inline-block', padding: '0.85rem 2rem', borderRadius: 100, background: 'var(--gold)', color: '#080c09', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}>wavmvmt@gmail.com</a>
              <a href="https://wavmvmt-world.vercel.app/world" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.85rem 2rem', borderRadius: 100, border: '1px solid rgba(242,236,224,0.15)', color: 'rgba(242,236,224,0.55)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>WAVMVMT World →</a>
            </div>
          </div>
        </div>
        <NavBar chapter={chapter} total={CHAPTERS.length} onPrev={() => goTo(chapter - 1)} onNext={() => goTo(chapter + 1)} isLast />
      </div>

    </div>
  )
}

function NavBar({ chapter, total, onPrev, onNext, dark = false, isLast = false }: {
  chapter: number; total: number; onPrev: () => void; onNext: () => void; dark?: boolean; isLast?: boolean
}) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0,
      padding: '1.25rem 2rem',
      background: dark ? 'rgba(242,236,224,0.9)' : 'rgba(8,12,9,0.85)',
      backdropFilter: 'blur(12px)',
      borderTop: dark ? '1px solid rgba(8,12,9,0.1)' : '1px solid rgba(242,236,224,0.07)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 50,
    }}>
      <button onClick={onPrev} className="nav-btn" style={{ color: dark ? 'rgba(8,12,9,0.5)' : undefined, borderColor: dark ? 'rgba(8,12,9,0.15)' : undefined }}>← Previous</button>
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: dark ? 'rgba(8,12,9,0.3)' : 'rgba(242,236,224,0.25)' }}>
        {chapter} / {total - 1}
      </span>
      {!isLast
        ? <button onClick={onNext} className="nav-btn primary">Continue →</button>
        : <a href="mailto:wavmvmt@gmail.com" className="nav-btn primary" style={{ textDecoration: 'none' }}>Get in touch →</a>
      }
    </div>
  )
}

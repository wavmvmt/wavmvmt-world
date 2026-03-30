'use client'

import { useState, useEffect, useRef } from 'react'

// ── PRO FORMA DATA (from Legacy Club actual document, March 2026) ──
const PROFORMA = {
  residentialSales: 7200000000,
  hotelUnits: 2000,
  hotelADR: 500,
  existingWellnessRev: 36000000,
  totalExistingRev: 9838000000,
  totalSalesRev: 11020000000,
  totalUnits: 8095,
  membershipUnits: 3000,
  geothermalRev: 20000000,
  biomassRev: 20000000,
  shoreLodge: 75000000,
  skiResort: 100000000,
}

const fmt = (n: number, decimals = 0) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(decimals === 0 ? 1 : decimals)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

const SPACES = [
  { cat: 'Creative', name: 'Music Studio', desc: 'Professional grade. Guests record and release. Youth programs. Artists in residence.', color: '#c8973a', img: 'https://images.pexels.com/photos/4088018/pexels-photo-4088018.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Wellness', name: 'Sound Bath', desc: 'Crystal bowls, guided healing. Most in-demand wellness experience globally.', color: '#2d8a78', img: 'https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Movement', name: 'Parkour + Movement', desc: 'Year-round indoor. All ages. Connects to trails. Unique to Clearwater globally.', color: '#8a5a2d', img: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Creative', name: 'Pottery + Glass Blowing', desc: 'Wheels, kilns, glazing. A grandmother and her grandchild, laughing.', color: '#c8973a', img: 'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Knowledge', name: 'Co-Working + AI', desc: 'Professional, high-speed. AI workshops, talks, conferences.', color: '#2d8a78', img: 'https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Community', name: 'Concerts + Shows', desc: 'Established artists, sold-out events. Shim performs as opener/co-headliner.', color: '#c8973a', img: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Wellness', name: 'Yoga + Recovery', desc: 'Daily classes, cold plunge, sauna, float. For every level, every need.', color: '#2d8a78', img: 'https://images.pexels.com/photos/3822725/pexels-photo-3822725.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { cat: 'Community', name: 'Café + Dog Park', desc: 'Year-round. Enclosed, heated in winter. First and last place every day.', color: '#8a5a2d', img: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800' },
]

const CAPITAL_STEPS = [
  { num: '01', title: 'WAVMVMT Center signs PPA', short: 'Power Purchase Agreement with Clearwater microgrid', body: `WAVMVMT Center commits to buying power from the Clearwater geothermal/biomass/hydro system on a 10–20 year contract. The pro forma shows ${fmt(PROFORMA.geothermalRev)} in geothermal revenues + ${fmt(PROFORMA.biomassRev)} in biomass. A contracted anchor customer strengthens the underwriting for both plants — and removes timeline dependency on Appian Way.`, badge: 'Energy anchor', gold: false },
  { num: '02', title: "Satisfies Scot's T3 mandate", short: 'WAVMVMT Center as QOZB equity entry', body: `Scot Bryson's Impactful Capital has a humanitarian reinvestment mandate. Youth programming + wellness + education + community = mandate fulfilled. His fund takes 5–20% QOZB equity in WAVMVMT Center. Investors receive 10-year capital gains elimination (IRC §1400Z-2). Reportable to Climate Bonds Initiative and NASA. This is a better use of his impact capital than any other line in the pro forma.`, badge: 'Capital trigger', gold: true },
  { num: '03', title: 'QOZ Fund escrow creates SBLC', short: "Scot's capital → escrow → Tier 1 SBLC", body: `Scot's deployment flows into David Sillaman's QOZ fund as convertible debt — the exact structure already scoped with KPMG and Goldman Sachs. That escrowed capital becomes the basis for a Tier 1 SBLC. The ~30% capex security requirement the family office demands is now satisfied without drawing the capital.`, badge: 'Security layer', gold: false },
  { num: '04', title: 'Family office deploys capex', short: '100% project capex unlocked', body: `Security condition met. The deca-billionaire family office commits 100% of project capex as JV equity, pari passu. Proof of funds: $5–6B+. The ${fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev)} total pro forma scope is now fundable.`, badge: fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev), gold: false },
  { num: '05', title: 'Appian Way closes the stack', short: 'Remainder funded', body: `Appian Way's multi-billion capacity fills the remaining requirement. Full capital stack closed. WAVMVMT Center is built first — opening 12–18 months ahead of the resort — generating cash flow while the rest is under construction.`, badge: 'Deal closed', gold: false },
]

export default function ClearwaterV3() {
  const [openCapital, setOpenCapital] = useState<number | null>(null)
  const [openProforma, setOpenProforma] = useState(false)
  const [activeSpace, setActiveSpace] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [navVisible, setNavVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
      setNavVisible(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, system-ui, sans-serif)', background: '#07100a', color: '#f0ebe0', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --gold: #c8973a; --gold-l: #e0b55a; --teal: #2d8a78; --teal-l: #42b09c; --ink: #07100a; --dark: #0d1a0f; --forest: #152a17; --cream: #f0ebe0; }
        .serif { font-family: 'Playfair Display', Georgia, serif !important; }
        .grain { position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.3; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); }
        .section { padding: 7rem 2rem; }
        .wrap { max-width: 1100px; margin: 0 auto; }
        .wrap-sm { max-width: 760px; margin: 0 auto; }
        .tag { display: block; font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem; }
        .h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(3rem, 8vw, 7rem); font-weight: 700; line-height: 1.0; }
        .h2 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 4.5vw, 3.6rem); font-weight: 700; line-height: 1.1; }
        .h3 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 400; line-height: 1.3; }
        .em { font-style: italic; font-weight: 400; color: var(--gold-l); }
        .body { font-size: 0.9rem; color: rgba(240,235,224,0.58); line-height: 1.88; }
        .divider { border: none; border-top: 1px solid rgba(240,235,224,0.07); margin: 4rem 0; }
        .pill { display: inline-block; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.22rem 0.7rem; border-radius: 20px; }
        .pill-gold { background: rgba(200,151,58,0.12); color: var(--gold); border: 1px solid rgba(200,151,58,0.22); }
        .pill-teal { background: rgba(42,176,156,0.1); color: var(--teal-l); border: 1px solid rgba(42,176,156,0.2); }
        .pill-cream { background: rgba(240,235,224,0.05); color: rgba(240,235,224,0.38); border: 1px solid rgba(240,235,224,0.1); }
        .expand-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: 1px solid rgba(240,235,224,0.12); color: rgba(240,235,224,0.45); font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.5rem 1rem; border-radius: 100px; cursor: pointer; transition: all 0.25s; font-family: inherit; }
        .expand-btn:hover { border-color: var(--gold); color: var(--gold); }
        .num-big { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 700; color: var(--gold-l); display: block; line-height: 1; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: rgba(200,151,58,0.25); border-radius: 2px; }
      `}</style>

      <div className="grain" />

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: navVisible ? 'rgba(7,16,10,0.94)' : 'transparent',
        backdropFilter: navVisible ? 'blur(16px)' : 'none',
        borderBottom: navVisible ? '1px solid rgba(240,235,224,0.06)' : 'none',
        transition: 'all 0.4s',
      }}>
        <span className="serif" style={{ fontSize: '0.95rem', letterSpacing: '0.15em', color: '#f0ebe0' }}>WAV<span style={{ color: 'var(--gold)' }}>MVMT</span></span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[['vision', 'Vision'], ['spaces', 'Spaces'], ['numbers', 'Numbers'], ['capital', 'Capital'], ['note', 'Personal Note']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.4)', fontFamily: 'inherit', padding: '0.3rem 0.5rem', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,235,224,0.4)')}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <video src="https://assets.mixkit.co/videos/3338/3338-720.mp4"
          poster="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920"
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `translateY(${scrollY * 0.25}px)` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,16,10,0.5) 0%, rgba(7,16,10,0.2) 40%, rgba(7,16,10,0.85) 80%, #07100a 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '8rem 2rem 5rem', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <p className="tag" style={{ marginBottom: '2rem', fontSize: '0.62rem' }}>WAVMVMT Center at Clearwater · Idaho · A Proposal by Saadiq Khan (shim.wav)</p>
          <h1 className="h1 serif" style={{ marginBottom: '2rem', maxWidth: 800 }}>
            Almost a Decade<br />in the <span className="em">Making.</span>
          </h1>
          <p className="body" style={{ maxWidth: 560, marginBottom: '3rem', fontSize: '1rem' }}>
            A personal vision. A perfect alignment. A proposal to build the cultural heart of Clearwater — and every development that follows.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => scrollTo('vision')} style={{ background: 'var(--gold)', color: '#07100a', border: 'none', padding: '0.9rem 2rem', borderRadius: 100, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>Read the vision ↓</button>
            <button onClick={() => scrollTo('capital')} style={{ background: 'none', border: '1px solid rgba(240,235,224,0.2)', color: 'rgba(240,235,224,0.6)', padding: '0.9rem 2rem', borderRadius: 100, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Capital structure ↓</button>
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section id="vision" style={{ background: '#0d1a0f', padding: '8rem 2rem', borderTop: '1px solid rgba(200,151,58,0.15)' }}>
        <div className="wrap-sm">
          <span className="tag">The Alignment</span>
          <div className="h3 serif" style={{ color: '#f0ebe0', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Vince is making it happen. He envisioned something extraordinary and is bringing every single piece of it to life. The intelligence behind this project — the precision, the scale — inspires me deeply.
          </div>
          <div style={{ borderLeft: '2px solid var(--gold)', padding: '1.5rem 2rem', background: 'rgba(200,151,58,0.04)', borderRadius: '0 4px 4px 0', marginBottom: '2.5rem' }}>
            <p className="serif" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', fontStyle: 'italic', color: '#f0ebe0', lineHeight: 1.7 }}>
              &quot;I want to lock in long-term. Every development, every site, every community we build together — WAVMVMT Center is there. This is not a one-deal proposal. It is the thing I have been building toward my whole life, finally meeting its perfect home.&quot;
            </p>
          </div>
          <p className="body" style={{ marginBottom: '1.5rem' }}>
            I am living proof that a kid who struggled — who found his way through parkour, music, and community — can end up in rooms working on a $20+ billion development. Every deal in the pipeline was originated through relationships built through music. The gold deal. Scot Bryson. The pension fund. All of it.
          </p>
          <p className="body">
            That is not coincidence. That is proof of concept. WAVMVMT Centers work — because I am the result of exactly what they build.
          </p>
        </div>
      </section>

      {/* ── PRO FORMA SNAPSHOT ── */}
      <section style={{ background: '#07100a', padding: '5rem 2rem', borderTop: '1px solid rgba(240,235,224,0.05)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <span className="tag">The Development — From the Actual Pro Forma</span>
              <h2 className="h2" style={{ marginBottom: '0.5rem' }}>The numbers<br /><span className="em">are already there.</span></h2>
            </div>
            <button className="expand-btn" onClick={() => setOpenProforma(!openProforma)}>
              {openProforma ? '− Hide pro forma detail' : '+ See full pro forma breakdown'}
            </button>
          </div>

          {/* Headline stats from pro forma */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(240,235,224,0.05)', border: '1px solid rgba(240,235,224,0.05)', borderRadius: 4, overflow: 'hidden', marginBottom: '1.5rem' }}>
            {[
              { n: fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev), l: 'Total pro forma scope (existing + remaining sales)', s: 'From actual pro forma document' },
              { n: fmt(PROFORMA.residentialSales), l: 'Residential custom home sales (3,000 units)', s: '→ GWI 10% premium = +$720M' },
              { n: `${PROFORMA.totalUnits.toLocaleString()}`, l: 'Total units / members across all categories', s: 'Hotels + homes + workforce + membership' },
              { n: fmt(PROFORMA.existingWellnessRev), l: 'Current spa/wellness line in pro forma', s: 'WAVMVMT Center expands this dramatically' },
            ].map(s => (
              <div key={s.n} style={{ background: '#07100a', padding: '2.5rem 1.75rem' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0d1a0f')} onMouseLeave={e => (e.currentTarget.style.background = '#07100a')}>
                <span className="num-big" style={{ marginBottom: '0.5rem' }}>{s.n}</span>
                <div style={{ fontSize: '0.72rem', color: 'rgba(240,235,224,0.5)', lineHeight: 1.55, marginBottom: '0.4rem' }}>{s.l}</div>
                <div style={{ fontSize: '0.56rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(200,151,58,0.5)' }}>{s.s}</div>
              </div>
            ))}
          </div>

          {/* Expandable pro forma detail */}
          {openProforma && (
            <div style={{ border: '1px solid rgba(200,151,58,0.18)', borderRadius: 4, overflow: 'hidden', background: 'rgba(200,151,58,0.02)' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(200,151,58,0.12)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,235,224,0.28)' }}>
                <span>Line Item (from pro forma)</span><span style={{ textAlign: 'right' }}>Units</span><span style={{ textAlign: 'right' }}>Sales Revenue</span><span style={{ textAlign: 'right' }}>WAVMVMT Impact</span>
              </div>
              {[
                { label: 'Hotels / Condo-Tel Villas', units: '2,000', rev: '$600M', impact: '+$33M/yr ADR premium (GWI wellness uplift)' },
                { label: 'Residential Custom Homes', units: '3,000', rev: '$7.2B', impact: '+$720M–$1.8B (10–25% GWI premium)', highlight: true },
                { label: 'Accessory Recreation / Spa / Wellness', units: '2', rev: '$36M', impact: 'Replaced by WAVMVMT Center — $1.7M–$4.3M/yr direct', highlight: true },
                { label: 'Membership (3,000 members)', units: '3,000', rev: '$6.3M', impact: 'Higher retention + renewal from year-round programming' },
                { label: 'Shore Lodge / Whitetail Resort', units: '1', rev: '+$50M', impact: 'Extended stays from nomads + families' },
                { label: 'Geothermal + Biomass (energy)', units: '3', rev: '$40M', impact: 'WAVMVMT Center as anchor PPA customer — bankable revenue' },
                { label: 'Ski Resort / Hot Springs expansion', units: '6', rev: '$15M', impact: 'Center extends the season, improves retention' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(240,235,224,0.04)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', background: row.highlight ? 'rgba(200,151,58,0.04)' : 'transparent' }}>
                  <span style={{ fontSize: '0.78rem', color: row.highlight ? '#f0ebe0' : 'rgba(240,235,224,0.55)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.73rem', color: 'rgba(240,235,224,0.38)', textAlign: 'right' }}>{row.units}</span>
                  <span style={{ fontSize: '0.73rem', color: 'var(--gold-l)', textAlign: 'right' }}>{row.rev}</span>
                  <span style={{ fontSize: '0.68rem', color: row.highlight ? 'var(--teal-l)' : 'rgba(240,235,224,0.35)', textAlign: 'right', lineHeight: 1.4 }}>{row.impact}</span>
                </div>
              ))}
              <div style={{ padding: '1rem 1.5rem', background: 'rgba(200,151,58,0.06)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(200,151,58,0.15)' }}>
                <span className="serif" style={{ fontStyle: 'italic', color: '#f0ebe0', fontSize: '0.82rem' }}>Total WAVMVMT impact (residential premium alone)</span>
                <span></span>
                <span></span>
                <span className="serif" style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: 700, textAlign: 'right' }}>+$720M – $1.8B</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── THE GAP ── */}
      <section style={{ background: '#152a17', padding: '7rem 2rem', borderTop: '1px solid rgba(240,235,224,0.04)' }}>
        <div className="wrap">
          <span className="tag">What's Missing</span>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>The plan is extraordinary.<br /><span className="em">One thing is absent.</span></h2>
          <p className="body" style={{ maxWidth: 620, marginBottom: '3rem' }}>The pro forma has every physical and financial asset mapped — land, energy, residential, hospitality. What it doesn&apos;t have yet is cultural identity. The reason people feel this place is theirs.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(240,235,224,0.05)', border: '1px solid rgba(240,235,224,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              ['No creative infrastructure', 'No music studio, no pottery, no glass blowing. Guests have nowhere to make anything.'],
              ['No sound healing', 'Fastest-growing wellness category globally. Absent from every mountain resort in North America.'],
              ['Nothing real for teenagers', 'The most underserved group in luxury resort design. Families don\'t extend stays when teens have nothing.'],
              ['Dead in winter', `Idaho winters close outdoor amenity for months. The pro forma's ${fmt(PROFORMA.hotelUnits)}-unit hotel block needs year-round reasons to stay.`],
              ['No digital nomad pull', '43 million high-earning nomads want co-working + community + outdoor access. Zero infrastructure for them.'],
              ['No cultural identity', 'Yellowstone Club has a soul. Vail has a soul. The pro forma builds the body — WAVMVMT Center gives it a heartbeat.'],
            ].map(([t, b]) => (
              <div key={t} style={{ background: '#152a17', padding: '2.5rem 2rem', transition: 'background 0.3s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1e3d22')} onMouseLeave={e => (e.currentTarget.style.background = '#152a17')}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(224,74,74,0.45)', fontStyle: 'italic', display: 'block', marginBottom: '0.75rem' }}>✕</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.4rem' }}>{t}</div>
                <div style={{ fontSize: '0.73rem', color: 'rgba(240,235,224,0.4)', lineHeight: 1.65 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPACES ── */}
      <section id="spaces" style={{ background: '#07100a', padding: '7rem 2rem', borderTop: '1px solid rgba(240,235,224,0.04)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem' }}>
            <span className="tag">All the Spaces</span>
            <h2 className="h2" style={{ marginBottom: '0.75rem' }}>Everything.<br /><span className="em">Under one roof.</span></h2>
            <p className="body">Not a gym, not a spa, not a kids club. All of it — for the whole person, every age, every season.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {SPACES.map((s, i) => (
              <div key={s.name} style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '3/4', cursor: 'default' }}
                onMouseEnter={() => setActiveSpace(i)} onMouseLeave={() => setActiveSpace(null)}>
                <img src={s.img} alt={s.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s, filter 0.4s', transform: activeSpace === i ? 'scale(1.05)' : 'scale(1)', filter: activeSpace === i ? 'brightness(0.9) saturate(1)' : 'brightness(0.7) saturate(0.75)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,16,10,0.95) 0%, rgba(7,16,10,0.05) 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: s.color, marginBottom: '0.3rem' }}>{s.cat}</span>
                  <div className="serif" style={{ fontSize: '1rem', color: '#f0ebe0', marginBottom: '0.25rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(240,235,224,0.45)', lineHeight: 1.5, opacity: activeSpace === i ? 1 : 0, transform: activeSpace === i ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.3s' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAY SECTION ── */}
      <section style={{ background: '#f0ebe0', color: '#07100a', padding: '7rem 2rem', borderTop: '2px solid rgba(200,151,58,0.2)' }}>
        <div className="wrap">
          <span className="tag" style={{ color: '#1e3d22' }}>The Lifestyle</span>
          <h2 className="h2" style={{ color: '#07100a', marginBottom: '0.75rem' }}>A Tuesday in January.<br /><span style={{ fontStyle: 'italic', fontWeight: 400, color: '#2d8a78' }}>Trails are closed.</span></h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(7,16,10,0.5)', maxWidth: 520, marginBottom: '3.5rem', lineHeight: 1.8 }}>
            The {fmt(PROFORMA.hotelUnits).replace('$', '')}-unit hotel block needs guests with reasons to stay. The {PROFORMA.membershipUnits.toLocaleString()} members need reasons to come back in February. This is that reason.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '0.5rem', top: 6, bottom: 6, width: 1, background: 'linear-gradient(180deg, var(--gold) 0%, var(--teal) 50%, var(--gold) 100%)' }} />
              {[
                ['6:30 am', 'The café opens. Dogs run in the heated park. Regulars who arrived yesterday are already back.'],
                ['7:00 am', 'Morning yoga. 18 people — residents, long-stay guests, two nomads on a month package.'],
                ['8:30 am', 'Parkour for teenagers. Six teens who had nothing yesterday. Today they\'re back.'],
                ['11:00 am', 'Pottery class. A grandmother and her ten-year-old, badly, laughing. This is the moment.'],
                ['3:00 pm', 'Family sound bath. They walk out quieter, closer. Already asking when the next one is.'],
                ['7:30 pm', 'Open mic. Forty people. A retired exec plays guitar in public for the first time. Nobody leaves.'],
              ].map(([time, text]) => (
                <div key={time} style={{ position: 'relative', paddingBottom: '2rem' }}>
                  <div style={{ position: 'absolute', left: '-2.1rem', top: '0.45rem', width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', border: '2px solid #f0ebe0' }} />
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#2d8a78', fontWeight: 500, display: 'block', marginBottom: '0.3rem' }}>{time}</span>
                  <p className="serif" style={{ fontSize: '0.95rem', color: '#07100a', lineHeight: 1.65, fontWeight: 400 }}>{text}</p>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: 'rgba(7,16,10,0.05)', borderRadius: 4, padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1e3d22', marginBottom: '1rem' }}>Why this matters to the pro forma</div>
                {[
                  [`${PROFORMA.hotelUnits.toLocaleString()} hotel units`, 'need year-round reasons to extend stays. Center creates them.'],
                  [`${PROFORMA.membershipUnits.toLocaleString()} members`, 'pay annual fees. Year-round programming = higher renewal rates.'],
                  ['43M digital nomads', 'are looking for exactly this. Each nomad stay = $3K–$6K/month in revenue.'],
                  ['Families with teens', 'are the highest-value buyers who previously walked away. Now they stay.'],
                ].map(([bold, text]) => (
                  <div key={bold} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2d8a78', flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: '0.8rem', color: 'rgba(7,16,10,0.7)', lineHeight: 1.65 }}><strong style={{ color: '#07100a', fontWeight: 600 }}>{bold}</strong> — {text}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(200,151,58,0.08)', border: '1px solid rgba(200,151,58,0.2)', borderRadius: 4, padding: '1.5rem' }}>
                <span style={{ fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '0.5rem' }}>Vince on this</span>
                <p className="serif" style={{ fontSize: '1.05rem', fontStyle: 'italic', color: '#07100a', lineHeight: 1.65 }}>&quot;I like it. Makes it more fun. Less dry.&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section id="numbers" style={{ background: '#07100a', padding: '7rem 2rem', borderTop: '1px solid rgba(240,235,224,0.05)' }}>
        <div className="wrap">
          <span className="tag">The Business Case — Grounded in the Pro Forma</span>
          <h2 className="h2" style={{ marginBottom: '0.75rem' }}>Fast to build.<br /><span className="em">Early to earn.</span></h2>
          <p className="body" style={{ maxWidth: 560, marginBottom: '3rem' }}>Every number below is derived directly from Vince&apos;s pro forma or from GWI/market data cited by source.</p>

          {/* Impact cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { num: '+$720M', sub: 'minimum', label: 'Added residential value', calc: `10% GWI wellness premium × ${fmt(PROFORMA.residentialSales)} residential sales line (pro forma)`, source: 'GWI Build Well to Live Well 2025' },
              { num: '+$33M', sub: '/year', label: 'Hotel revenue uplift', calc: `2,000 hotel units × $75 ADR premium × 60% occupancy × 365 days`, source: 'GWI + MIT commercial premium data' },
              { num: '$4.3M', sub: '/year', label: 'Direct Center revenue (full build)', calc: `8 revenue streams: memberships, classes, studio, events, retreats, nomad packages, practitioners, digital`, source: 'WAVMVMT internal projection' },
            ].map(c => (
              <div key={c.num} style={{ border: '1px solid rgba(240,235,224,0.07)', borderRadius: 4, padding: '2.5rem 2rem', transition: 'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,151,58,0.25)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(240,235,224,0.07)')}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span className="num-big">{c.num}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(240,235,224,0.4)' }}>{c.sub}</span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.75rem' }}>{c.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,224,0.4)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{c.calc}</div>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(200,151,58,0.45)' }}>{c.source}</div>
              </div>
            ))}
          </div>

          {/* Build timeline */}
          <div style={{ background: '#0d1a0f', border: '1px solid rgba(240,235,224,0.06)', borderRadius: 4, padding: '2.5rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '2rem' }}>Build timeline — Center opens first</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', alignItems: 'flex-end' }}>
              {[['4–7 yrs', 140, 'Highway bypass'], ['3–5 yrs', 115, 'Energy microgrid'], ['2–4 yrs', 96, 'Residential units'], ['2–3 yrs', 80, 'Resort lodge'], ['12–18 mo', 36, 'WAVMVMT Center Phase 1 ★']].map(([t, h, l], i) => (
                <div key={l as string} style={{ textAlign: 'center' }}>
                  <div style={{ height: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ width: 40, height: h as number, background: i === 4 ? 'var(--gold)' : 'rgba(240,235,224,0.09)', borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <div className="serif" style={{ fontSize: '0.85rem', color: i === 4 ? 'var(--gold)' : '#f0ebe0', marginBottom: '0.2rem' }}>{t}</div>
                  <div style={{ fontSize: '0.62rem', color: i === 4 ? 'var(--gold-l)' : 'rgba(240,235,224,0.3)', lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(240,235,224,0.06)', textAlign: 'center' }}>
              <span className="serif" style={{ fontSize: '0.9rem', color: 'var(--gold-l)', display: 'block', marginBottom: '0.4rem' }}>Phase 1 monthly cash flow</span>
              <span className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#f0ebe0' }}>$84K – $175K / month</span>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,224,0.3)', marginTop: '0.4rem' }}>Before the resort is built. From the first day the doors open.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPITAL STACK ── */}
      <section id="capital" style={{ background: '#0d1a0f', padding: '7rem 2rem', borderTop: '1px solid rgba(200,151,58,0.1)' }}>
        <div className="wrap">
          <span className="tag">The Capital Unlock</span>
          <h2 className="h2" style={{ marginBottom: '0.75rem' }}>How WAVMVMT Center<br /><span className="em">activates the full stack.</span></h2>
          <p className="body" style={{ maxWidth: 600, marginBottom: '3rem' }}>This is the structural insight. Each step below is clickable — expand to see the mechanics. The total pro forma scope of {fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev)} becomes fundable through this chain.</p>
          <div>
            {CAPITAL_STEPS.map((s, i) => (
              <div key={i} style={{ padding: '1.5rem 2rem', border: `1px solid ${s.gold ? 'rgba(200,151,58,0.25)' : 'rgba(240,235,224,0.07)'}`, borderRadius: 4, marginBottom: '0.6rem', cursor: 'pointer', transition: 'background 0.25s', background: openCapital === i ? (s.gold ? 'rgba(200,151,58,0.05)' : 'rgba(240,235,224,0.03)') : (s.gold ? 'rgba(200,151,58,0.03)' : 'transparent') }}
                onClick={() => setOpenCapital(openCapital === i ? null : i)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span className="serif" style={{ fontSize: '0.85rem', color: s.gold ? 'var(--gold)' : 'rgba(240,235,224,0.22)', fontStyle: 'italic', minWidth: '2rem' }}>{s.num}</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f0ebe0', marginBottom: '0.15rem' }}>{s.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(240,235,224,0.38)' }}>{s.short}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span className={`pill pill-${s.gold ? 'gold' : 'teal'}`}>{s.badge}</span>
                    <span style={{ color: 'rgba(240,235,224,0.25)', fontSize: '0.8rem' }}>{openCapital === i ? '−' : '+'}</span>
                  </div>
                </div>
                {openCapital === i && (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(240,235,224,0.55)', lineHeight: 1.78, marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(240,235,224,0.07)' }}>{s.body}</p>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid rgba(200,151,58,0.18)', borderRadius: 4, background: 'rgba(200,151,58,0.04)' }}>
            <p className="serif" style={{ fontSize: '1rem', fontStyle: 'italic', color: '#f0ebe0', lineHeight: 1.75 }}>
              &quot;Without WAVMVMT Center, this deal depends entirely on Appian Way&apos;s timeline — and they have two projects ahead of Idaho. With it, a second institutional path exists. The Center doesn&apos;t just add cultural value. <strong style={{ fontWeight: 700, fontStyle: 'normal' }}>It de-risks the capital stack.&quot;</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ background: '#152a17', padding: '7rem 2rem', borderTop: '1px solid rgba(240,235,224,0.04)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <span className="tag">The Long Arc</span>
              <h2 className="h2" style={{ marginBottom: '1.5rem' }}>A WAVMVMT Center<br /><span className="em">in every development.</span></h2>
              <p className="body" style={{ marginBottom: '1.5rem' }}>Not just Clearwater. Every Qualified Opportunity Zone development this team touches gets a WAVMVMT Center. Funded progressively through deal closings, SBLC returns, and the compounding equity of the Centers themselves.</p>
              <p className="body" style={{ marginBottom: '2.5rem' }}>I truly believe these Centers will bring the world closer. When someone walks in for the first time, they feel like they&apos;ve stepped into the home they always wanted. Everything they wanted to learn, try, experience is here. That&apos;s what happened to me — and that&apos;s what these spaces do for people everywhere.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Clearwater, ID ← first', 'Toronto, ON', 'QOZ #3', 'QOZ #4', 'QOZ #5', 'Everywhere'].map((l, i) => (
                  <span key={l} style={{ fontSize: '0.65rem', padding: '0.35rem 1rem', borderRadius: 20, border: `1px solid ${i === 0 ? 'rgba(200,151,58,0.35)' : 'rgba(240,235,224,0.1)'}`, color: i === 0 ? 'var(--gold)' : 'rgba(240,235,224,0.35)', background: i === 0 ? 'rgba(200,151,58,0.08)' : 'transparent' }}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src="https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Community" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) saturate(0.85)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── PERSONAL NOTE ── */}
      <section id="note" style={{ background: '#0d1a0f', padding: '8rem 2rem', borderTop: '1px solid rgba(200,151,58,0.15)' }}>
        <div className="wrap-sm">
          <span className="tag" style={{ display: 'block', textAlign: 'center' }}>A Personal Note</span>
          <div className="h3 serif" style={{ color: 'rgba(240,235,224,0.88)', marginBottom: '2rem' }}>
            I&apos;ve been working toward this for almost a decade. Not toward a specific deal or building — toward an understanding of how to bring people together in spaces that actually change them.
          </div>
          <div style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', lineHeight: 1.8, color: 'rgba(240,235,224,0.75)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}>
            <p style={{ marginBottom: '2rem' }}>Parkour changed me. Music changed me. Community changed me. <span style={{ fontStyle: 'italic', color: 'var(--gold-l)' }}>I am living proof that a kid who struggled can end up in rooms working on a $20 billion pipeline</span> — because of relationships built through art, community, and just showing up fully.</p>
            <p style={{ marginBottom: '2rem' }}>I want to contribute everything I have to what Vince is building. <strong style={{ fontWeight: 700, color: '#f0ebe0' }}>Not just one center. All of it. Every development. Every site. Long-term.</strong> I&apos;ll learn 3D modeling, I&apos;ll document the whole build on film, I&apos;ll run the programming, I&apos;ll keep bringing capital relationships and deal flow.</p>
            <p>All I need is a space to create and live from, with a yard for my dog. <span style={{ fontStyle: 'italic', color: 'var(--gold-l)' }}>Everything else I bring because I believe in it completely.</span></p>
          </div>
          <div style={{ marginTop: '3.5rem', textAlign: 'right' }}>
            <span className="serif" style={{ fontStyle: 'italic', fontSize: '1rem', color: 'rgba(240,235,224,0.35)' }}>— Saadiq Khan (shim.wav) · WAVMVMT · March 2026</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER / CTA ── */}
      <section style={{ background: '#07100a', padding: '5rem 2rem 3rem', borderTop: '1px solid rgba(240,235,224,0.05)' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3rem' }}>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>Let&apos;s build this<br /><span className="em">together.</span></h2>
          <p className="body" style={{ marginBottom: '2.5rem' }}>Clearwater. Idaho. A community built for the whole person.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:wavmvmt@gmail.com" style={{ display: 'inline-block', padding: '0.9rem 2.25rem', borderRadius: 100, background: 'var(--gold)', color: '#07100a', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}>wavmvmt@gmail.com</a>
            <a href="https://wavmvmt-world.vercel.app/world" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.9rem 2.25rem', borderRadius: 100, border: '1px solid rgba(240,235,224,0.15)', color: 'rgba(240,235,224,0.5)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>3D World →</a>
            <a href="/capital" style={{ display: 'inline-block', padding: '0.9rem 2.25rem', borderRadius: 100, border: '1px solid rgba(240,235,224,0.15)', color: 'rgba(240,235,224,0.5)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Capital version →</a>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(240,235,224,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', letterSpacing: '0.07em', color: 'rgba(240,235,224,0.18)' }}>
          <span>WAVMVMT Center × Clearwater · A Proposal by Saadiq Khan · March 2026</span>
          <span>Confidential — For authorized recipients only</span>
        </div>
      </section>
    </div>
  )
}

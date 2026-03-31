'use client'
import { useState, useEffect } from 'react'

const fmt = (n: number) => {
  if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n/1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

const PROFORMA = {
  residentialSales: 7200000000, hotelUnits: 2000, existingWellnessRev: 36000000,
  totalExistingRev: 9838000000, totalSalesRev: 11020000000,
  membershipUnits: 3000, geothermalRev: 20000000, biomassRev: 20000000,
}

const P = {
  studio:       '/shim-studio.jpg',
  parkour:      '/shim-parkour.jpg',
  nature:       '/shim-nature.jpg',
  thinking:     '/shim-thinking.jpg',
  gongbath:     '/shim-community-gongbath.jpg',
  parkourTrain: '/shim-parkour-training.jpg',
  portrait:     '/shim-artist-portrait.jpg',
  performing:   '/shim-performing.jpg',
  apolloCar:    '/shim-apollo-car.jpg',
  movement:     '/shim-movement-workshop.jpg',
  aerialSilks:  '/shim-aerial-silks.jpg',
  apollo:       '/apollo.jpg',
}

const REVENUE_STREAMS = [
  { stream: 'Sound bath — group sessions', detail: '15 people × $45 · 4 sessions/day · 25 days/mo', low: 33750, high: 67500 },
  { stream: 'Movement gym memberships', detail: '60–120 members × $150/month', low: 9000, high: 18000 },
  { stream: 'Music studio hourly bookings', detail: '$85/hr · 80–150 hrs/month', low: 6800, high: 12750 },
  { stream: 'Podcast room rentals', detail: '$40/hr · 60–100 hrs/month', low: 2400, high: 4000 },
  { stream: 'Private yoga + somatic sessions', detail: '$95/session · 80–130 sessions/month', low: 7600, high: 12350 },
  { stream: 'Pottery classes', detail: '$65/session · 60–100 sessions/month', low: 3900, high: 6500 },
  { stream: 'Digital nomad monthly packages', detail: '$2,800–$3,500/mo · 4–8 nomads', low: 11200, high: 28000 },
  { stream: 'Café daily revenue', detail: 'Est. $250–$450/day average', low: 7500, high: 13500 },
  { stream: 'Education day programs', detail: 'Per-student or family enrollment packages', low: 3000, high: 9000 },
  { stream: 'Practitioner desk rentals', detail: 'Healers, therapists, coaches · $600–$900/mo', low: 1800, high: 4500 },
]

const PHASES = [
  {
    phase: 'Phase 1', label: '12–18 months', color: 'var(--gold)',
    spaces: [
      { cat: 'Sound + Healing', name: 'Sound Bath Studio', desc: 'Professional acoustic healing space. Crystal bowls, tuning forks, guided sessions. Private and group. The most requested wellness experience at top global resorts.', img: P.gongbath },
      { cat: 'Movement', name: 'Parkour + Movement Gym', desc: 'Year-round indoor movement culture. All ages, all levels. The only parkour gym at any mountain resort on earth.', img: P.parkourTrain },
      { cat: 'Mind + Body', name: 'Yoga + Meditation Studio', desc: 'Multiple daily classes, silent hours, breathwork, somatic practices. Movement as medicine, stillness as power.', img: P.movement },
      { cat: 'Wellness', name: 'Recovery Suite', desc: 'Cold plunge, infrared sauna, float tank, contrast therapy. Full therapeutic protocol. The most in-demand luxury wellness amenity.', img: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Creative', name: 'Music Production Studio', desc: 'Professional grade. Acoustic treatment, monitoring, gear. Guests record, produce, release. Youth programs. Artists in residence.', img: P.studio },
      { cat: 'Media', name: 'Podcast Room', desc: 'Soundproofed, broadcast-ready. Investors, creators, entrepreneurs, kids — everyone has a story worth recording.', img: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Creative', name: 'Pottery Studio', desc: 'Wheels, kilns, glazing stations. Structured classes and open sessions. A grandmother and her grandchild at the same wheel.', img: 'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Education', name: 'Learning + Education Wing', desc: 'Forward-thinking day programs for families, travelers, and nomads. Visiting educators, workshops, integrated curriculum. If demand grows — a full private school model that travels with members from location to location.', img: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Knowledge', name: 'Co-Working + AI Hub', desc: 'High-speed, professional. Private booths, open floor, conference rooms. AI workshops, talks, keynotes.', img: 'https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Community', name: 'Café + Dog Park', desc: 'Year-round. Enclosed and heated in winter. First and last stop every day. Where the community forms — over coffee, every morning.', img: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ]
  },
  {
    phase: 'Phase 2', label: 'Year 2–3', color: 'var(--teal)',
    spaces: [
      { cat: 'Creative', name: 'Art Studio', desc: 'Painting, sculpture, drawing, mixed media. Natural light, high ceilings. Resident artist programs, open workshops, curated exhibitions.', img: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Media', name: 'Photo + Video Studio', desc: 'Professional lighting, backdrops, camera equipment, green screen. Creators, brands, families — everyone leaves with content.', img: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Creative', name: 'Glass Blowing Studio', desc: 'One of the most viscerally exciting creative experiences available. Proper furnaces, annealing ovens. Pure magic to watch.', img: 'https://images.pexels.com/photos/3030802/pexels-photo-3030802.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Creative', name: 'Textile + Fashion Studio', desc: 'Industrial sewing machines, looms, embroidery, screen printing. Fashion, upholstery, craft. Youth and adult workshops.', img: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Community', name: 'Screening Room', desc: '40-seat, professionally equipped. Film nights, documentary series, community screenings, private rentals.', img: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Community', name: 'Outdoor Amphitheatre + Aerial Arts', desc: 'Concerts, open mics, aerial silk performances, community events. The mountain as the backdrop.', img: P.aerialSilks },
    ]
  },
  {
    phase: 'Phase 3', label: 'Year 3+', color: '#c8a86e',
    spaces: [
      { cat: 'Maker', name: 'Maker Space', desc: 'CNC machines, laser cutters, 3D printers, woodworking, welding. A full fabrication lab. $2.5B market growing at 15%/year.', img: 'https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Tech', name: 'Electronics + Tech Lab', desc: 'Soldering, robotics, microcontrollers, PCB design, 3D modeling. For builders, tinkerers, engineers, and curious kids.', img: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Community', name: 'Teaching Kitchen', desc: 'Professional kitchen for cooking classes, fermentation, nutrition workshops, community dinners.', img: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ]
  }
]

const SCOT_STEPS = [
  { month: 'Now', title: 'NDA signed + deck delivered', body: 'NDA/NCNDA is resent and confirmed ready to sign. Upon signature, the updated deck is delivered and this conversation begins.', status: 'active' },
  { month: 'Week 2–3', title: 'WAVMVMT Center PPA letter of intent', body: 'A Power Purchase Agreement letter of intent is drafted between WAVMVMT Center and the Clearwater microgrid. This converts WAVMVMT from a "brand idea" into a contracted energy customer in writing — the document that makes it bankable. The pro forma shows $20M in geothermal + $20M in biomass revenues. WAVMVMT is the anchor demand customer that makes those projections creditworthy to lenders.', status: 'pending' },
  { month: 'Month 1–2', title: "Capital partner's fund term sheet for QOZB equity", body: 'WAVMVMT Center — active QOZB with contracted energy demand, youth programming, education, wellness, and community — satisfies the humanitarian reinvestment mandate. Fund issues a term sheet for 5–20% QOZB equity. Investors receive capital gains deferral and 10-year elimination (IRC §1400Z-2). Reportable to Climate Bonds Initiative. This mandate alignment does not exist anywhere else in the $20.86B pro forma.', status: 'pending' },
  { month: 'Month 2–3', title: 'QOZ Fund legal engagement — 60-day build', body: 'The QOZ fund architect builds the dual-purpose fund — convertible debt structure, investor capital as pledged security during development, converting to equity at commercial operation. Full PPM, Operating Agreement, Subscription Agreements, Form D filing, and QOZB certification.', status: 'pending' },
  { month: 'Month 3–4', title: 'SBLC issued against escrowed QOZ capital', body: 'Capital in QOZ fund escrow backs a Tier 1 SBLC covering ~30% of total capex. Passive security — not drawn, not spent — held through commercial operation. Two independent SBLC sources creates institutional-grade risk separation.', status: 'pending' },
  { month: 'Month 4–5', title: 'Family office LOI — conditional commitment', body: 'Security condition satisfied. Family office issues a Letter of Intent: conditional commitment to deploy 100% of project capex as JV equity, pari passu. Proof of funds: $5–6B+. This LOI is what Vince takes to Appian Way to accelerate Idaho\'s position in queue.', status: 'pending' },
  { month: 'Month 5–6', title: 'Land under contract', body: 'Vince puts the Wilkes\' land under contract. Stealthy aggregation across multiple properties in a small county. NDA/NCNCA maintained throughout. Existing revenue-producing businesses service costs from day one.', status: 'pending' },
  { month: 'Month 6–8', title: 'Full capital stack closes', body: `QOZ Fund (security) + SBLC (guarantee) + family office (100% capex JV equity) + Appian Way (remainder). Total pro forma scope of ${fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev)} fully funded and structured.`, status: 'pending' },
  { month: 'Month 6+', title: 'WAVMVMT Center Phase 1 construction begins', body: '10 core spaces — 12–18 months to completion. ~25 permanent local jobs created. QOZ active business test satisfied. Revenue generating from day one.', status: 'pending' },
  { month: 'Month 18–24', title: 'WAVMVMT Center Phase 1 opens', body: 'First WAVMVMT Center in a major US resort development. Revenue live. Energy PPA active. Programming running. Education wing open. The flywheel begins.', status: 'future' },
]

export default function ClearwaterV8() {
  const [openProforma, setOpenProforma] = useState(false)
  const [openRevenue, setOpenRevenue] = useState(false)
  const [activePhase, setActivePhase] = useState(0)
  const [openScot, setOpenScot] = useState<number|null>(null)
  const [activeSpace, setActiveSpace] = useState<number|null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const h = () => { setScrollY(window.scrollY); setNavSolid(window.scrollY > 80) }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const revenueTotal = (key: 'low' | 'high') => REVENUE_STREAMS.reduce((s, r) => s + r[key], 0)

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, system-ui, sans-serif)', background: '#07100a', color: '#f0ebe0', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--gold:#c8973a;--gold-l:#e0b55a;--teal:#2d8a78;--teal-l:#42b09c;--ink:#07100a;--cream:#f0ebe0}
        .serif{font-family:'Playfair Display',Georgia,serif!important}
        .grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.28;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}
        .tag{display:block;font-size:0.58rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem}
        .h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(3rem,8vw,7rem);font-weight:700;line-height:1.0}
        .h2{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2rem,4.5vw,3.6rem);font-weight:700;line-height:1.1}
        .h3{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.3rem,2.5vw,2rem);font-weight:400;line-height:1.4}
        .em{font-style:italic;font-weight:400;color:var(--gold-l)}
        .body{font-size:0.9rem;color:rgba(240,235,224,0.58);line-height:1.88}
        .wrap{max-width:1100px;margin:0 auto}
        .wrap-sm{max-width:760px;margin:0 auto}
        .pill{display:inline-block;font-size:0.56rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.2rem 0.65rem;border-radius:20px}
        .pill-gold{background:rgba(200,151,58,0.12);color:var(--gold);border:1px solid rgba(200,151,58,0.22)}
        .pill-teal{background:rgba(42,176,156,0.1);color:var(--teal-l);border:1px solid rgba(42,176,156,0.2)}
        .pill-cream{background:rgba(240,235,224,0.05);color:rgba(240,235,224,0.38);border:1px solid rgba(240,235,224,0.1)}
        .scot-step{padding:1.4rem 2rem;border:1px solid rgba(240,235,224,0.07);border-radius:4px;margin-bottom:0.5rem;cursor:pointer;transition:background 0.25s}
        .scot-step:hover,.scot-step.open{background:rgba(200,151,58,0.04);border-color:rgba(200,151,58,0.18)}
        .scot-step.active-step{border-color:rgba(42,176,156,0.3);background:rgba(42,176,156,0.04)}
        .scot-step.future-step{opacity:0.55}
        .phase-btn{background:none;border:1px solid rgba(240,235,224,0.12);color:rgba(240,235,224,0.45);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.55rem 1.25rem;border-radius:100px;cursor:pointer;transition:all 0.25s;font-family:inherit}
        .caption{font-size:0.62rem;letter-spacing:0.08em;color:rgba(240,235,224,0.28);text-align:center;margin-top:0.6rem;font-style:italic}
        .expand-btn{background:none;border:1px solid rgba(240,235,224,0.12);color:rgba(240,235,224,0.45);font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.55rem 1.1rem;border-radius:100px;cursor:pointer;font-family:inherit;transition:all 0.25s}
        .expand-btn:hover{border-color:var(--gold);color:var(--gold)}
        @media(max-width:768px){
          .grid-2{grid-template-columns:1fr!important}
          .grid-3{grid-template-columns:1fr 1fr!important}
          .grid-4{grid-template-columns:1fr 1fr!important}
          .sticky-col{position:static!important}
          .pad-section{padding:5rem 1.25rem!important}
          .nav-links{display:none!important}
        }
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(200,151,58,0.25);border-radius:2px}
      `}</style>
      <div className="grain"/>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',background:navSolid?'rgba(7,16,10,0.94)':'transparent',backdropFilter:navSolid?'blur(16px)':'none',borderBottom:navSolid?'1px solid rgba(240,235,224,0.06)':'none',transition:'all 0.4s'}}>
        <span className="serif" style={{fontSize:'0.95rem',letterSpacing:'0.15em',color:'#f0ebe0'}}>WAV<span style={{color:'var(--gold)'}}>MVMT</span></span>
        <div className="nav-links" style={{display:'flex',gap:'0.25rem',flexWrap:'wrap'}}>
          {[['vision','Vision'],['healing','Healing'],['proof','The Journey'],['field','Field Research'],['spaces','Spaces'],['scot','Capital Unlock'],['numbers','Numbers'],['arrangement','The Arrangement'],['note','Personal Note']].map(([id,label])=>(
            <button key={id} onClick={()=>go(id)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'0.62rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(240,235,224,0.38)',fontFamily:'inherit',padding:'0.3rem 0.5rem',transition:'color 0.2s'}}
              onMouseEnter={e=>(e.currentTarget.style.color='var(--gold)')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(240,235,224,0.38)')}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:'relative',minHeight:'100dvh',display:'flex',alignItems:'center',overflow:'hidden'}}>
        <video src="https://assets.mixkit.co/videos/3338/3338-720.mp4" poster="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920" autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:`translateY(${scrollY*0.25}px)`}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(7,16,10,0.5) 0%,rgba(7,16,10,0.15) 40%,rgba(7,16,10,0.85) 80%,#07100a 100%)'}}/>
        <div style={{position:'relative',zIndex:2,padding:'8rem 2rem 5rem',maxWidth:1100,margin:'0 auto',width:'100%'}}>
          <p className="tag" style={{marginBottom:'2rem',fontSize:'0.62rem'}}>WAVMVMT Center at Clearwater · Idaho · A Proposal by Saadiq Khan (shim.wav)</p>
          <h1 className="h1 serif" style={{marginBottom:'2rem',maxWidth:820}}>Almost a Decade<br/>in the <span className="em">Making.</span></h1>
          <p className="body" style={{maxWidth:560,marginBottom:'3rem',fontSize:'1rem'}}>A personal vision. A perfect alignment. A proposal to build the cultural heart of Clearwater — and every development that follows.</p>
          <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
            <button onClick={()=>go('vision')} style={{background:'var(--gold)',color:'#07100a',border:'none',padding:'0.9rem 2rem',borderRadius:100,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontWeight:500,fontFamily:'inherit'}}>Read the vision ↓</button>
            <button onClick={()=>go('scot')} style={{background:'none',border:'1px solid rgba(240,235,224,0.2)',color:'rgba(240,235,224,0.6)',padding:'0.9rem 2rem',borderRadius:100,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontFamily:'inherit'}}>Capital unlock ↓</button>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className="pad-section" style={{background:'#0d1a0f',padding:'8rem 2rem',borderTop:'1px solid rgba(200,151,58,0.15)'}}>
        <div className="wrap">
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
            <div>
              <span className="tag">The Alignment</span>
              <div className="h3 serif" style={{color:'#f0ebe0',marginBottom:'2.5rem',lineHeight:1.75}}>Vince is making it happen. He envisioned something extraordinary and is bringing every single piece of it to life. The intelligence behind this project — the precision, the scale — inspires me deeply.</div>
              <div style={{borderLeft:'2px solid var(--gold)',padding:'1.5rem 2rem',background:'rgba(200,151,58,0.04)',borderRadius:'0 4px 4px 0',marginBottom:'2.5rem'}}>
                <p className="serif" style={{fontSize:'clamp(1rem,2vw,1.3rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;I want to lock in long-term. Every development, every site, every community we build together — WAVMVMT Center is there. This is not a one-deal proposal. It is the thing I have been building toward my whole life, finally meeting its perfect home.&quot;</p>
              </div>
              <p className="body" style={{marginBottom:'1.5rem'}}>I am living proof that a kid who struggled — who found his way through parkour, music, community, and healing — can end up in rooms working on a $20+ billion development. Through effort, showing up fully, and a deep commitment to bringing the right people together, I have been able to play a role in setting this up — alongside an incredible team including Sarah, Nick, and everyone who has been part of building what this pipeline has become.</p>
              <p className="body">That is not coincidence. That is proof of concept. WAVMVMT Centers work because I am the result of exactly what they build.</p>
            </div>
            <div className="sticky-col" style={{position:'sticky',top:'7rem'}}>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4',marginBottom:'1rem'}}>
                <img src={P.portrait} alt="Saadiq Khan" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
              </div>
              <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'1/1'}}>
                  <img src={P.nature} alt="Saadiq outdoors" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                </div>
                <div style={{display:'grid',gap:'0.75rem'}}>
                  {[['8 yrs','Music + engineering'],['$20B+','Active pipeline'],['60+','Released tracks']].map(([n,l])=>(
                    <div key={n} style={{border:'1px solid rgba(240,235,224,0.08)',borderRadius:4,padding:'0.75rem',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                      <span className="serif" style={{fontSize:'1.2rem',fontWeight:700,color:'var(--gold-l)'}}>{n}</span>
                      <span style={{fontSize:'0.62rem',color:'rgba(240,235,224,0.35)',marginTop:'0.15rem'}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEALING */}
      <section id="healing" className="pad-section" style={{background:'#07100a',padding:'8rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
            <div>
              <span className="tag">Why This Matters — Personally</span>
              <h2 className="h2" style={{marginBottom:'1.5rem'}}>The modalities that<br/><span className="em">changed everything.</span></h2>
              <p className="body" style={{marginBottom:'1.5rem'}}>I did not arrive at this vision from research. I arrived here from experience — lived, somatic, real. The healing modalities, the movement practices, the sound, the stillness — these things did not just improve my life. They fundamentally restructured how I relate to myself, to other people, and to the world.</p>
              <p className="body" style={{marginBottom:'1.5rem'}}>Parkour showed me what my body was capable of. Music production taught me to feel sound as a physical force and work with it as medicine. Meditation opened a layer of awareness I did not know existed. Sound healing — experienced in community with gifted practitioners — was like a reset button for my entire nervous system.</p>
              <p className="body" style={{marginBottom:'2rem'}}>Every single modality was only available to me because I found the right people and spaces. That access is not random. It is the result of community. WAVMVMT Center is about making that access universal — for the grandmother, the teenager, the burned-out founder, the kid who can&apos;t sit still.</p>
              <div style={{borderLeft:'2px solid var(--teal)',padding:'1.5rem 2rem',background:'rgba(42,176,156,0.04)',borderRadius:'0 4px 4px 0'}}>
                <p className="serif" style={{fontSize:'clamp(1rem,1.8vw,1.2rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;The psychological, emotional, and spiritual dimensions of health are not supplementary to physical wellness. They are the foundation.&quot;</p>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div>
                  <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                    <img src={P.studio} alt="In the studio" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <p className="caption">Sound as medicine</p>
                </div>
                <div>
                  <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                    <img src={P.parkourTrain} alt="Parkour training" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                  </div>
                  <p className="caption">Movement as liberation</p>
                </div>
              </div>
              <div style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,padding:'1.25rem'}}>
                <div className="tag" style={{marginBottom:'0.75rem'}}>Mental wellness market — GWI 2025</div>
                {[['12.4%/yr','#2 fastest growing sector in the $6.8T wellness economy'],['$159B','Global mental wellness — projected $355B by 2034'],['18.9%/yr','Meditation + mindfulness — fastest subsector'],['1 in 8','People globally living with mental health issues (WHO 2024)']].map(([n,l])=>(
                  <div key={n} style={{display:'flex',gap:'1rem',padding:'0.6rem 0',borderBottom:'1px solid rgba(240,235,224,0.05)',alignItems:'center'}}>
                    <span className="serif" style={{fontSize:'1rem',fontWeight:700,color:'var(--gold-l)',minWidth:'5.5rem',flexShrink:0}}>{n}</span>
                    <span style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.45)',lineHeight:1.5}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPIRAL — Two Centers */}
      <section className="pad-section" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <span className="tag">Two Centers. One Moment.</span>
              <h2 className="h2" style={{marginBottom:'1.5rem'}}>It&apos;s already<br/><span className="em">being built.</span></h2>
              <p className="body" style={{marginBottom:'1.5rem'}}>Right now, as this proposal is being written, my partner Madizon is building a pottery studio and free art school for children in San Marcos La Laguna, Guatemala. It is called Espiral.</p>
              <p className="body" style={{marginBottom:'1.5rem'}}>Espiral is the exact same philosophy as WAVMVMT Center — applied to a lakeside village in the highlands of Guatemala. Art as healing. Community as infrastructure. Creative space as the center of a town&apos;s cultural life. A place where a child can make something for the first time and understand that they are capable of anything.</p>
              <p className="body" style={{marginBottom:'2rem'}}>We are not waiting for a deal to close to start building this vision. We are building it simultaneously — one in the mountains of Guatemala, one in the mountains of Idaho. These two Centers will inform each other. They will be sister locations.</p>
              <div style={{borderLeft:'2px solid var(--gold)',padding:'1.5rem 2rem',background:'rgba(200,151,58,0.04)',borderRadius:'0 4px 4px 0'}}>
                <p className="serif" style={{fontSize:'clamp(1rem,1.8vw,1.2rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;Two people. Two communities. One vision. The model is not hypothetical. It is happening right now on two different continents.&quot;</p>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'4/3'}}>
                <img src={P.apolloCar} alt="Shim and Apollo" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 30%'}}/>
              </div>
              <p className="caption">WAVMVMT is a life being built — not just a proposal being written</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                {[
                  {loc:'San Marcos La Laguna, Guatemala',name:'Espiral',status:'Building now',color:'var(--teal-l)'},
                  {loc:'Clearwater, Idaho, USA',name:'WAVMVMT Center',status:'This proposal',color:'var(--gold)'},
                ].map(c=>(
                  <div key={c.loc} style={{border:`1px solid ${c.color==='var(--gold)'?'rgba(200,151,58,0.25)':'rgba(42,176,156,0.25)'}`,borderRadius:4,padding:'1.25rem',background:c.color==='var(--gold)'?'rgba(200,151,58,0.04)':'rgba(42,176,156,0.04)'}}>
                    <div style={{fontSize:'0.56rem',letterSpacing:'0.2em',textTransform:'uppercase',color:c.color,marginBottom:'0.5rem'}}>{c.status}</div>
                    <div className="serif" style={{fontSize:'1rem',color:'#f0ebe0',marginBottom:'0.25rem'}}>{c.name}</div>
                    <div style={{fontSize:'0.68rem',color:'rgba(240,235,224,0.4)'}}>{c.loc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF — The Journey (rewritten with real origin story) */}
      <section id="proof" className="pad-section" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Journey — How This All Began</span>
          <h2 className="h2" style={{marginBottom:'3rem'}}>Follow the passion.<br/><span className="em">Watch what happens.</span></h2>

          {/* Gong bath photo — corrected caption */}
          <div style={{position:'relative',borderRadius:4,overflow:'hidden',marginBottom:'1.5rem'}}>
            <img src={P.gongbath} alt="Sound healing community gathering" style={{width:'100%',height:'480px',objectFit:'cover',objectPosition:'center 40%'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(7,16,10,0.88) 0%,rgba(7,16,10,0.05) 50%)'}}/>
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'2.5rem 3rem'}}>
              <span className="tag" style={{marginBottom:'0.5rem'}}>Community — sound healing gathering</span>
              <p className="serif" style={{fontSize:'clamp(1.1rem,2.5vw,1.8rem)',fontStyle:'italic',color:'#f0ebe0',maxWidth:700,lineHeight:1.5}}>The healing community Saadiq has built deep relationships with — sound healers, practitioners, teachers. The energy of what WAVMVMT Center becomes, already alive.</p>
            </div>
          </div>

          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'2rem'}}>
            {/* Origin story */}
            <div>
              <div style={{border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,padding:'2rem',background:'rgba(200,151,58,0.03)',marginBottom:'1rem'}}>
                <div className="tag" style={{marginBottom:'1rem'}}>The origin story — how this pipeline was born</div>
                <p className="body" style={{marginBottom:'1rem'}}>It started with a decision to follow the feeling. Saadiq packed a car in Toronto and drove to California — training parkour along the way, connecting with artists and creatives, running on music and movement and the belief that showing up fully leads somewhere worth going.</p>
                <p className="body" style={{marginBottom:'1rem'}}>He had met his travel companion through Twist&apos;s community activation event back home — a connection made over art and music and shared vision. In California, at a house in Beverly Hills, he met <strong style={{color:'#f0ebe0',fontWeight:600}}>Sarah R. Adams</strong>. They drove to Joshua Tree. They talked about what was possible. That conversation changed the trajectory of everything.</p>
                <p className="body" style={{marginBottom:'1rem'}}>Back in Toronto, Saadiq started helping Sarah with the business side — building systems, a website, learning the capital markets world from the inside out. Sarah introduced him to <strong style={{color:'#f0ebe0',fontWeight:600}}>Nick Patterson</strong>. Nick and Sarah introduced him to <strong style={{color:'#f0ebe0',fontWeight:600}}>Vince Scott</strong>.</p>
                <p className="body" style={{marginBottom:'1rem'}}>Separately, his friend <strong style={{color:'#f0ebe0',fontWeight:600}}>Darren</strong> — connected through music, events, life, and culture (they even made songs together) — introduced him to <strong style={{color:'#f0ebe0',fontWeight:600}}>Boardy AI</strong>, which became a key tool for building capital relationships across the pipeline. Darren had been teaching him how the capital-raising world works through his work on artist showcases, DJ events, fashion shows, and brand activations.</p>
                <p className="body">This is the WAVMVMT model in action: <em style={{color:'var(--gold-l)'}}>community creates capital. Culture creates opportunity. Following your passion with full commitment opens doors that no strategy alone can find.</em></p>
              </div>
            </div>

            {/* Performing + pipeline table */}
            <div>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'4/3',marginBottom:'1rem'}}>
                <img src={P.performing} alt="Shim performing live" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
              </div>
              <p className="caption" style={{color:'rgba(240,235,224,0.28)',marginBottom:'1rem'}}>Performing live — the same person proposing to run WAVMVMT Center</p>
              {/* Pipeline — vague */}
              <div style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,overflow:'hidden',marginBottom:'1rem'}}>
                <div style={{padding:'0.65rem 1.25rem',borderBottom:'1px solid rgba(240,235,224,0.06)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:'0.52rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(240,235,224,0.22)',background:'rgba(240,235,224,0.02)'}}>
                  <span>Active Pipeline</span><span>How It Originated</span>
                </div>
                {[
                  {deal:'Clearwater, Idaho — large-scale QOZ development',origin:'Music community → Sarah → Nick → Vince'},
                  {deal:'Capital markets — commodities sector (active)',origin:'Music relationships → business crossover'},
                  {deal:'Capital partner introductions (multiple)',origin:'Darren + Boardy AI → capital network'},
                  {deal:'Tech / AI company investment',origin:'Music industry relationships — sector crossover'},
                  {deal:'Film production project',origin:'Entertainment + music industry relationships'},
                ].map((row,i)=>(
                  <div key={i} style={{padding:'0.85rem 1.25rem',borderBottom:'1px solid rgba(240,235,224,0.04)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',background:i%2===0?'transparent':'rgba(240,235,224,0.015)'}}>
                    <div style={{fontSize:'0.75rem',fontWeight:500,color:'#f0ebe0'}}>{row.deal}</div>
                    <div style={{fontSize:'0.68rem',color:'var(--teal-l)',lineHeight:1.55}}>{row.origin}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:'1.25rem',border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,background:'rgba(200,151,58,0.04)'}}>
                <div className="tag" style={{marginBottom:'0.5rem'}}>Also: free marketing</div>
                <p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.6)',lineHeight:1.7}}>Every sound bath, open mic, and community event generates organic social content that markets Clearwater to exactly the right audience — at zero cost to the development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIELD RESEARCH — what the world told me */}
      <section id="field" className="pad-section" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Field Research — Lived, Not Read</span>
          <h2 className="h2" style={{marginBottom:'1rem'}}>I spent years talking to<br/><span className="em">the exact people.</span></h2>
          <p className="body" style={{maxWidth:680,marginBottom:'3rem'}}>This is not a market analysis. This is what I heard — directly, in person, across five countries — from expats, digital nomads, families, healers, elderly people, young entrepreneurs, artists, and wellness seekers. The same gaps came up everywhere. The same hunger. The same thing missing.</p>

          {/* Countries / locations */}
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'3rem'}}>
            {[
              {place:'Guatemala',detail:'San Marcos La Laguna · Lake Atitlán · expat healing communities, wellness retreats, artists building new lives, families educating children on the road. The most common ask: a space that holds all of it without fragmenting.'},
              {place:'Tulum, Mexico',detail:'The most concentrated digital nomad and wellness hub in the world. Creators, healers, investors, founders — all living parallel lives without a common space that truly integrates them. Incredible energy, no unified home.'},
              {place:'Colombia',detail:'Medellín and beyond. Growing expat creative scene, young entrepreneurs, a culture of reinvention. People building new lives and new businesses who need community infrastructure to do it sustainably.'},
              {place:'Guyana',detail:'A different lens entirely — grounded community needs, the importance of local culture, how people thrive when creative and educational infrastructure is present. The gap is universal, not just a wealthy expat problem.'},
              {place:'Across the US',detail:'Urban and rural. Creative communities, healing circles, maker spaces, co-working hubs — everywhere people are trying to build the same thing separately. The WAVMVMT model is what they\'re reaching for.'},
              {place:'The pattern everywhere',detail:'In every place, across every demographic — expat or local, young or elderly, healer or founder — the same gap: no space that serves the whole person across all their needs simultaneously.'},
            ].map(s=>(
              <div key={s.place} style={{background:'#152a17',padding:'2.5rem 2rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#1e3d22')} onMouseLeave={e=>(e.currentTarget.style.background='#152a17')}>
                <div className="serif" style={{fontSize:'1.1rem',fontWeight:700,color:'#f0ebe0',marginBottom:'0.5rem'}}>{s.place}</div>
                <div style={{fontSize:'0.73rem',color:'rgba(240,235,224,0.45)',lineHeight:1.7}}>{s.detail}</div>
              </div>
            ))}
          </div>

          {/* What they told me */}
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'2rem'}}>
            <div style={{border:'1px solid rgba(200,151,58,0.2)',borderRadius:4,padding:'2rem',background:'rgba(200,151,58,0.03)'}}>
              <div className="tag" style={{marginBottom:'1rem'}}>What every demographic said they needed</div>
              {[
                ['Expats + digital nomads','A home base. Professional infrastructure. Community with people building real things. Not just a co-working desk — a whole ecosystem they can anchor to.'],
                ['Families on the road','Quality education that travels with them. Creative and movement programming for their children. A sense of belonging that doesn\'t require stopping.'],
                ['Healers + wellness practitioners','A space to practice and teach that isn\'t fragmentary. Community with other practitioners. An audience of people who are genuinely ready.'],
                ['The elderly','Dignity and activity. Creative engagement. Community that values their wisdom and keeps them learning. Movement that doesn\'t feel like medicine.'],
                ['Young entrepreneurs + founders','Inspiration from cross-pollination. People from different fields working in proximity. Programming that feeds both the work and the person.'],
                ['Artists + musicians','Infrastructure to create professionally, not just casually. Community that takes the work seriously. Access to audiences and collaborators.'],
              ].map(([t,b])=>(
                <div key={t} style={{display:'flex',gap:'0.75rem',marginBottom:'1rem',alignItems:'flex-start'}}>
                  <div style={{width:5,height:5,borderRadius:'50%',background:'var(--gold)',flexShrink:0,marginTop:5}}/>
                  <div>
                    <div style={{fontSize:'0.78rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.2rem'}}>{t}</div>
                    <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.45)',lineHeight:1.6}}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              <div style={{border:'1px solid rgba(42,176,156,0.2)',borderRadius:4,padding:'2rem',background:'rgba(42,176,156,0.03)'}}>
                <div className="tag" style={{marginBottom:'0.75rem',color:'var(--teal-l)'}}>The insight that kept recurring</div>
                <p className="serif" style={{fontSize:'clamp(1rem,1.8vw,1.25rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.75}}>&quot;When there is a hub with programming — when the space holds music AND movement AND healing AND education AND community AND creative work — people don&apos;t just use it. They build their whole life around it. They stay longer. They bring others. They come back.&quot;</p>
              </div>
              <div style={{border:'1px solid rgba(240,235,224,0.08)',borderRadius:4,padding:'2rem'}}>
                <div className="tag" style={{marginBottom:'0.75rem'}}>What this means for Clearwater</div>
                <p style={{fontSize:'0.82rem',color:'rgba(240,235,224,0.6)',lineHeight:1.78}}>The global nomad + expat community is not niche anymore — it is 43 million people earning an average of $124,720 per year, actively searching for communities that can hold their whole life. Tulum is proof of concept at scale: the most in-demand locations are the ones with the richest programming ecosystems. <strong style={{color:'#f0ebe0',fontWeight:500}}>Clearwater with WAVMVMT Center is that for the mountain world — the first of its kind at this scale.</strong></p>
              </div>
              <div style={{border:'1px solid rgba(200,151,58,0.15)',borderRadius:4,padding:'2rem',background:'rgba(200,151,58,0.03)'}}>
                <div className="tag" style={{marginBottom:'0.5rem'}}>Why the research is the qualification</div>
                <p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',lineHeight:1.75}}>Saadiq did not read about what people need. He sat with them — in living rooms, on mountain paths, at markets, in healing circles, at music events — across five countries over several years. That direct knowledge of what the global community actually wants is what makes the programming design for WAVMVMT Center so specific and so right.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAP */}
      <section className="pad-section" style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">What&apos;s Missing — With a Dollar Figure</span>
          <h2 className="h2" style={{marginBottom:'1rem'}}>The plan is extraordinary.<br/><span className="em">One gap costs millions.</span></h2>
          <p className="body" style={{maxWidth:620,marginBottom:'3rem'}}>Idaho winters close outdoor amenity for roughly 6 months. Here is what that costs the pro forma — and why WAVMVMT Center is the structural answer.</p>
          <div style={{border:'1px solid rgba(200,151,58,0.25)',borderRadius:4,padding:'2rem',background:'rgba(200,151,58,0.04)',marginBottom:'2rem'}}>
            <div style={{fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>The winter gap — calculated from pro forma</div>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
              {[
                {n:'$219M/yr',l:'Hotel ADR revenue at full run rate',s:'2,000 units × $500 × 60% occ × 365 days'},
                {n:'~$87M/yr',l:'Unrealized revenue from 6-month off-season',s:'40% revenue drop during indoor-only months (est.)'},
                {n:'$0',l:'Current infrastructure addressing this gap',s:'No year-round indoor programming exists in the plan'},
              ].map(s=>(
                <div key={s.n}>
                  <span className="serif" style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:700,color:'var(--gold-l)',display:'block',marginBottom:'0.3rem'}}>{s.n}</span>
                  <div style={{fontSize:'0.75rem',color:'#f0ebe0',marginBottom:'0.25rem'}}>{s.l}</div>
                  <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.38)'}}>{s.s}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid rgba(200,151,58,0.15)'}}>
              <p className="serif" style={{fontStyle:'italic',color:'var(--gold-l)',fontSize:'0.95rem'}}>WAVMVMT Center operates identically in January and July. It is the only line in the entire pro forma that does not require snow.</p>
            </div>
          </div>

          {/* Toronto winter expertise */}
          <div style={{border:'1px solid rgba(42,176,156,0.2)',borderRadius:4,padding:'2rem',background:'rgba(42,176,156,0.03)',marginBottom:'2rem'}}>
            <div style={{display:'flex',gap:'3rem',alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:300}}>
                <div className="tag" style={{marginBottom:'0.75rem',color:'var(--teal-l)'}}>The answer — I grew up watching it work</div>
                <p style={{fontSize:'0.85rem',color:'rgba(240,235,224,0.68)',lineHeight:1.85,marginBottom:'1rem'}}>Toronto gets brutally cold for five months of the year. And yet the city never stops. As someone who grew up there — as a creative, a fitness person, a wellness seeker, someone who lives on the more eccentric side of things — I watched Toronto solve this problem over and over, year after year. Arts events. Activations. Workshops. Indoor festivals. Community programming. Music showcases. Pop-up markets. Cultural gatherings that made winter feel intentional rather than something to survive.</p>
                <p style={{fontSize:'0.85rem',color:'rgba(240,235,224,0.68)',lineHeight:1.85}}>That is not theory. That is twenty-plus years of observation, participation, and facilitation in one of the harshest-winter, most culturally vibrant cities in North America. <strong style={{color:'#f0ebe0',fontWeight:500}}>Toronto taught me that the indoor programming season is not the off-season. It is its own season — with its own energy, its own audience, its own economic force.</strong> That knowledge is exactly what WAVMVMT Center brings to Clearwater.</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',minWidth:220}}>
                <div style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--teal-l)',marginBottom:'0.25rem'}}>What Toronto does in winter</div>
                {[
                  ['Arts + culture events','Galleries, showcases, performance nights — packed even in February'],
                  ['Community activations','Pop-ups, markets, workshops — built around indoor gathering'],
                  ['Music + DJ showcases','Live performance culture that thrives specifically in the cold months'],
                  ['Wellness programming','Sound baths, yoga series, somatic workshops — winter demand is real'],
                  ['Youth programming','Schools, after-school, creative workshops — year-round by design'],
                ].map(([t,d])=>(
                  <div key={t} style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:'var(--teal-l)',flexShrink:0,marginTop:5}}/>
                    <div>
                      <div style={{fontSize:'0.72rem',fontWeight:500,color:'#f0ebe0'}}>{t}</div>
                      <div style={{fontSize:'0.62rem',color:'rgba(240,235,224,0.38)',lineHeight:1.5}}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden'}}>
            {[
              ['No healing infrastructure','No sound bath, no somatic practices. The fastest-growing wellness segment — completely absent.'],
              ['No creative expression','No music studio, no art space. Guests are passive consumers. Nobody makes anything, nobody leaves changed.'],
              ['No education programming','Families who travel long-term need quality education. Currently zero integrated learning infrastructure.'],
              ['Dead in winter','6 months of reduced outdoor revenue. No year-round indoor answer currently exists.'],
              ['No digital nomad pull','43 million high-earning nomads want co-working, community, and outdoor access.'],
              ['No cultural identity','The pro forma builds the body. WAVMVMT Center gives it a heartbeat.'],
            ].map(([t,b])=>(
              <div key={t} style={{background:'#07100a',padding:'2.5rem 2rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#152a17')} onMouseLeave={e=>(e.currentTarget.style.background='#07100a')}>
                <span style={{fontSize:'0.78rem',color:'rgba(224,74,74,0.45)',display:'block',marginBottom:'0.75rem'}}>✕</span>
                <div style={{fontSize:'0.85rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.4rem'}}>{t}</div>
                <div style={{fontSize:'0.73rem',color:'rgba(240,235,224,0.4)',lineHeight:1.65}}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARABLE RESORTS */}
      <section className="pad-section" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">Comparable Resorts</span>
          <h2 className="h2" style={{marginBottom:'1rem'}}>The best in the world<br/><span className="em">still don&apos;t have this.</span></h2>
          <p className="body" style={{maxWidth:620,marginBottom:'3rem'}}>Each commands premiums specifically because of cultural identity and wellness positioning. None have the WAVMVMT full stack. Clearwater would be the first mountain resort on earth with all of it.</p>
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom:'2rem'}}>
            {[
              {name:'Soho House',type:'Private members club',stat:'~$3B valuation',detail:'Cultural programming, community identity, creative members. No outdoor. No sound healing. No education wing. No maker space.',color:'var(--gold)'},
              {name:'1 Hotel',type:'Wellness + sustainability',stat:'20–40% room rate premium',detail:'Nature-integrated, wellness-forward. No music studio. No creative arts. No dedicated teen or family education programming.',color:'var(--teal-l)'},
              {name:'Equinox Hotels',type:'Fitness + performance',stat:'$1,500+/night',detail:'Fitness-led luxury. No sound healing. No music studio. No maker space. No education. No youth programs.',color:'var(--gold-l)'},
            ].map(c=>(
              <div key={c.name} style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,padding:'2.5rem 2rem',transition:'border-color 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(200,151,58,0.25)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(240,235,224,0.07)')}>
                <div style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:c.color,marginBottom:'0.5rem'}}>{c.type}</div>
                <div className="serif" style={{fontSize:'1.4rem',fontWeight:700,color:'#f0ebe0',marginBottom:'0.4rem'}}>{c.name}</div>
                <div style={{fontSize:'1rem',fontWeight:700,color:c.color,marginBottom:'1rem'}}>{c.stat}</div>
                <div style={{fontSize:'0.73rem',color:'rgba(240,235,224,0.42)',lineHeight:1.65}}>{c.detail}</div>
              </div>
            ))}
          </div>
          <div style={{padding:'2rem',border:'1px solid rgba(42,176,156,0.2)',borderRadius:4,background:'rgba(42,176,156,0.04)'}}>
            <div style={{display:'flex',gap:'3rem',alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:280}}>
                <div className="tag" style={{marginBottom:'0.5rem',color:'var(--teal-l)'}}>Unlocked: Corporate Retreats</div>
                <p style={{fontSize:'0.8rem',color:'rgba(240,235,224,0.6)',lineHeight:1.75}}>Co-working + sound bath + movement gym + catered spaces = a perfect corporate wellness retreat venue. High-spending groups of 10–30, full ADR for every room, in exactly the shoulder seasons the resort needs most. No competitor within 300 miles can offer this combination.</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',minWidth:200}}>
                <div style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--teal-l)',marginBottom:'0.25rem'}}>Corporate retreat market</div>
                {[['$68B','Corporate retreat + team offsite market (2024)'],['Q1+Q4','The shoulder seasons WAVMVMT fills'],['$8K–$25K','Typical 2-day group booking value']].map(([n,l])=>(
                  <div key={n} style={{display:'flex',gap:'1rem',alignItems:'center'}}>
                    <span className="serif" style={{fontSize:'1.2rem',fontWeight:700,color:'var(--teal-l)',minWidth:'4rem',flexShrink:0}}>{n}</span>
                    <span style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.4)',lineHeight:1.4}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPACES — with education added */}
      <section id="spaces" className="pad-section" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div style={{maxWidth:1300,margin:'0 auto'}}>
          <div style={{textAlign:'center',maxWidth:800,margin:'0 auto 2.5rem'}}>
            <span className="tag">All the Spaces — Three Phases</span>
            <h2 className="h2" style={{marginBottom:'0.75rem'}}>Everything.<br/><span className="em">Built in stages.</span></h2>
            <p className="body">Phase 1 opens 12–18 months before the rest of the resort. Each phase funded by revenue from the last. Education is built in from day one — not added on.</p>
          </div>

          {/* Education callout before phase selector */}
          <div style={{padding:'1.5rem 2rem',border:'1px solid rgba(200,151,58,0.2)',borderRadius:4,background:'rgba(200,151,58,0.04)',marginBottom:'2rem',display:'flex',gap:'2rem',alignItems:'flex-start',flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:280}}>
              <div className="tag" style={{marginBottom:'0.5rem'}}>The Education Layer — Built Into Every Phase</div>
              <p style={{fontSize:'0.82rem',color:'rgba(240,235,224,0.65)',lineHeight:1.78}}>Families and nomads who travel to Clearwater don&apos;t want to pause their children&apos;s education. WAVMVMT Center offers forward-thinking day programs — integrated learning, visiting educators, workshops, cultural immersion — that complement any schooling model. If demand grows, this becomes a full private school offering. <strong style={{color:'#f0ebe0',fontWeight:600}}>Members who hold multi-location access always find the same quality programming at every WAVMVMT Center they visit.</strong> The education follows the family, not the other way around.</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',minWidth:200}}>
              {[['Day programs','Integrated learning for traveling families'],['Visiting educators','Specialists, artists, scientists, makers'],['Location-to-location','Same programming across all WAVMVMT Centers'],['Scale model','High demand → full private school curriculum']].map(([t,d])=>(
                <div key={t} style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
                  <div style={{width:5,height:5,borderRadius:'50%',background:'var(--gold)',flexShrink:0,marginTop:5}}/>
                  <div>
                    <div style={{fontSize:'0.72rem',fontWeight:500,color:'#f0ebe0'}}>{t}</div>
                    <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.4)'}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',gap:'0.75rem',justifyContent:'center',marginBottom:'2.5rem',flexWrap:'wrap'}}>
            {PHASES.map((p,i)=>(
              <button key={i} className="phase-btn" onClick={()=>{setActivePhase(i);setActiveSpace(null)}} style={activePhase===i?{borderColor:p.color,color:p.color,background:`${p.color}15`}:{}}>
                {p.phase} — {p.label}
              </button>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:`repeat(${PHASES[activePhase].spaces.length<=6?3:4},1fr)`,gap:'1.25rem'}}>
            {PHASES[activePhase].spaces.map((s,i)=>(
              <div key={s.name} style={{position:'relative',borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}} onMouseEnter={()=>setActiveSpace(i)} onMouseLeave={()=>setActiveSpace(null)}>
                <img src={s.img} alt={s.name} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',transition:'transform 0.7s,filter 0.4s',transform:activeSpace===i?'scale(1.05)':'scale(1)',filter:activeSpace===i?'brightness(0.9) saturate(1)':'brightness(0.7) saturate(0.75)'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(7,16,10,0.95) 0%,rgba(7,16,10,0.05) 55%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'1.25rem'}}>
                  <span style={{fontSize:'0.56rem',letterSpacing:'0.2em',textTransform:'uppercase',color:PHASES[activePhase].color,marginBottom:'0.3rem'}}>{s.cat}</span>
                  <div className="serif" style={{fontSize:'1rem',color:'#f0ebe0',marginBottom:'0.25rem'}}>{s.name}</div>
                  <div style={{fontSize:'0.68rem',color:'rgba(240,235,224,0.45)',lineHeight:1.5,opacity:activeSpace===i?1:0,transform:activeSpace===i?'translateY(0)':'translateY(6px)',transition:'all 0.3s'}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCOT BRYSON */}
      <section id="scot" className="pad-section" style={{background:'#07100a',padding:'8rem 2rem',borderTop:'1px solid rgba(200,151,58,0.1)'}}>
        <div className="wrap">
          <span className="tag">The Capital Unlock — Full Mechanics</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>How WAVMVMT Center unlocks<br/><span className="em">the capital stack.</span></h2>
          <p className="body" style={{maxWidth:680,marginBottom:'1rem'}}>WAVMVMT Center is the specific instrument that gives the capital fund a mandate-aligned, QOZB-qualified entry point — accelerating deployment of the entire {fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev)} pro forma.</p>
          <div style={{padding:'1.25rem 2rem',border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,background:'rgba(200,151,58,0.04)',marginBottom:'2.5rem'}}>
            <p style={{fontSize:'0.82rem',color:'rgba(240,235,224,0.7)',lineHeight:1.75}}><strong style={{color:'#f0ebe0'}}>The core insight:</strong> Without WAVMVMT Center, this deal depends entirely on Appian Way&apos;s timeline — and they have two projects ahead of Idaho. With it, a second institutional path exists. <em style={{color:'var(--gold-l)'}}>The Center structurally de-risks the capital stack.</em></p>
          </div>
          {SCOT_STEPS.map((s,i)=>(
            <div key={i} className={`scot-step${s.status==='active'?' active-step':s.status==='future'?' future-step':''}${openScot===i?' open':''}`} onClick={()=>setOpenScot(openScot===i?null:i)}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
                  <span style={{fontSize:'0.6rem',letterSpacing:'0.1em',textTransform:'uppercase',color:s.status==='active'?'var(--teal-l)':s.status==='future'?'rgba(240,235,224,0.2)':'rgba(240,235,224,0.28)',minWidth:'6rem',flexShrink:0}}>{s.month}</span>
                  <div style={{fontSize:'0.88rem',fontWeight:500,color:s.status==='future'?'rgba(240,235,224,0.4)':'#f0ebe0'}}>{s.title}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
                  {s.status==='active'&&<span className="pill pill-teal">Now</span>}
                  {s.status==='future'&&<span className="pill pill-cream">Future</span>}
                  <span style={{color:'rgba(240,235,224,0.25)',fontSize:'0.8rem'}}>{openScot===i?'−':'+'}</span>
                </div>
              </div>
              {openScot===i&&<p style={{fontSize:'0.8rem',color:'rgba(240,235,224,0.58)',lineHeight:1.8,marginTop:'1.25rem',paddingTop:'1.25rem',borderTop:'1px solid rgba(240,235,224,0.07)'}}>{s.body}</p>}
            </div>
          ))}
          <div style={{marginTop:'2rem',padding:'1.75rem 2rem',border:'1px solid rgba(42,176,156,0.18)',borderRadius:4,background:'rgba(42,176,156,0.04)',display:'flex',gap:'3rem',flexWrap:'wrap',alignItems:'center'}}>
            <div>
              <span className="serif" style={{fontSize:'2.5rem',fontWeight:700,color:'var(--teal-l)',display:'block'}}>~25</span>
              <span style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.45)'}}>Permanent local jobs created at Phase 1</span>
            </div>
            <div style={{flex:1,minWidth:280}}>
              <div className="tag" style={{marginBottom:'0.5rem',color:'var(--teal-l)'}}>QOZ active business test satisfied</div>
              <p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',lineHeight:1.7}}>Sound practitioners, movement coaches, café staff, education program coordinators, studio engineers, pottery instructors, co-working support — all local, all permanent. WAVMVMT Center is a civic asset, not just a resort amenity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section id="numbers" className="pad-section" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.05)'}}>
        <div className="wrap">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem',marginBottom:'2.5rem'}}>
            <div>
              <span className="tag">From the Actual Pro Forma</span>
              <h2 className="h2">The numbers are<br/><span className="em">already there.</span></h2>
            </div>
            <div style={{display:'flex',gap:'0.75rem'}}>
              <button className="expand-btn" onClick={()=>setOpenRevenue(!openRevenue)}>{openRevenue?'− Hide revenue math':'+ Show revenue breakdown'}</button>
              <button className="expand-btn" onClick={()=>setOpenProforma(!openProforma)}>{openProforma?'− Hide':'+ Pro forma'}</button>
            </div>
          </div>
          <div className="grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'2rem'}}>
            {[
              {n:fmt(PROFORMA.totalExistingRev+PROFORMA.totalSalesRev),l:'Total pro forma scope',s:'From actual document'},
              {n:fmt(PROFORMA.residentialSales),l:'Residential sales (3,000 homes)',s:'10% GWI premium = +$720M'},
              {n:'+$33M/yr',l:'Hotel revenue uplift',s:'2,000 units × $75 ADR wellness premium'},
              {n:fmt(PROFORMA.existingWellnessRev),l:'Current wellness line',s:'WAVMVMT expands dramatically'},
            ].map(s=>(
              <div key={s.n} style={{background:'#0d1a0f',padding:'2.5rem 1.75rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#152a17')} onMouseLeave={e=>(e.currentTarget.style.background='#0d1a0f')}>
                <span className="serif" style={{fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:700,color:'var(--gold-l)',display:'block',marginBottom:'0.4rem'}}>{s.n}</span>
                <div style={{fontSize:'0.72rem',color:'rgba(240,235,224,0.5)',lineHeight:1.55,marginBottom:'0.35rem'}}>{s.l}</div>
                <div style={{fontSize:'0.55rem',letterSpacing:'0.07em',textTransform:'uppercase',color:'rgba(200,151,58,0.4)'}}>{s.s}</div>
              </div>
            ))}
          </div>

          {openRevenue&&(
            <div style={{border:'1px solid rgba(200,151,58,0.22)',borderRadius:4,overflow:'hidden',marginBottom:'2rem',background:'rgba(200,151,58,0.02)'}}>
              <div style={{padding:'1.25rem 1.5rem',borderBottom:'1px solid rgba(200,151,58,0.12)',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'1rem',fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(240,235,224,0.25)',background:'rgba(200,151,58,0.04)'}}>
                <span>Revenue Stream</span><span>How</span><span style={{textAlign:'right'}}>Low / mo</span><span style={{textAlign:'right'}}>High / mo</span>
              </div>
              {REVENUE_STREAMS.map((r,i)=>(
                <div key={i} style={{padding:'0.85rem 1.5rem',borderBottom:'1px solid rgba(240,235,224,0.04)',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'1rem',alignItems:'center'}}>
                  <div style={{fontSize:'0.78rem',fontWeight:500,color:'#f0ebe0'}}>{r.stream}</div>
                  <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.35)',lineHeight:1.4}}>{r.detail}</div>
                  <div style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',textAlign:'right'}}>${r.low.toLocaleString()}</div>
                  <div style={{fontSize:'0.78rem',color:'var(--gold-l)',textAlign:'right'}}>${r.high.toLocaleString()}</div>
                </div>
              ))}
              <div style={{padding:'1.25rem 1.5rem',background:'rgba(200,151,58,0.08)',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'1rem',borderTop:'1px solid rgba(200,151,58,0.18)'}}>
                <span className="serif" style={{fontStyle:'italic',color:'#f0ebe0',fontSize:'0.88rem',alignSelf:'center'}}>Phase 1 monthly total (10 streams)</span>
                <span/>
                <span className="serif" style={{fontSize:'1.1rem',fontWeight:700,color:'rgba(240,235,224,0.65)',textAlign:'right'}}>${revenueTotal('low').toLocaleString()}</span>
                <span className="serif" style={{fontSize:'1.1rem',fontWeight:700,color:'var(--gold)',textAlign:'right'}}>${revenueTotal('high').toLocaleString()}</span>
              </div>
              <div style={{padding:'0.75rem 1.5rem',background:'rgba(200,151,58,0.04)',textAlign:'center'}}>
                <p style={{fontSize:'0.68rem',color:'rgba(240,235,224,0.35)',fontStyle:'italic'}}>Conservative range at 60–80% occupancy. Excludes event ticket revenue, corporate retreat packages, and artist-in-residence fees.</p>
              </div>
            </div>
          )}

          {openProforma&&(
            <div style={{border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,overflow:'hidden',marginBottom:'2rem'}}>
              <div style={{padding:'0.9rem 1.5rem',borderBottom:'1px solid rgba(200,151,58,0.1)',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'1rem',fontSize:'0.55rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(240,235,224,0.25)',background:'rgba(200,151,58,0.03)'}}>
                <span>Line Item</span><span style={{textAlign:'right'}}>Units</span><span style={{textAlign:'right'}}>Revenue</span><span style={{textAlign:'right'}}>WAVMVMT Impact</span>
              </div>
              {[
                {l:'Hotels / Condo-Tel Villas',u:'2,000',r:'$600M sales',i:'+$33M/yr ADR uplift',h:false},
                {l:'Residential Custom Homes',u:'3,000',r:'$7.2B sales',i:'+$720M–$1.8B (GWI premium)',h:true},
                {l:'Accessory Recreation / Wellness',u:'2',r:'$36M sales',i:'Replaced + expanded by Center',h:true},
                {l:'Membership (3,000)',u:'3,000',r:'$2.1M/yr',i:'Higher retention year-round',h:false},
                {l:'Shore Lodge / Whitetail',u:'1',r:'$75M existing',i:'Extended stays, nomad + education revenue',h:false},
                {l:'Geothermal + Biomass',u:'3 plants',r:'$40M existing',i:'WAVMVMT as anchor PPA customer',h:false},
              ].map((row,i)=>(
                <div key={i} style={{padding:'0.85rem 1.5rem',borderBottom:'1px solid rgba(240,235,224,0.04)',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'1rem',alignItems:'center',background:row.h?'rgba(200,151,58,0.04)':'transparent'}}>
                  <span style={{fontSize:'0.78rem',color:row.h?'#f0ebe0':'rgba(240,235,224,0.55)'}}>{row.l}</span>
                  <span style={{fontSize:'0.72rem',color:'rgba(240,235,224,0.35)',textAlign:'right'}}>{row.u}</span>
                  <span style={{fontSize:'0.72rem',color:'var(--gold-l)',textAlign:'right'}}>{row.r}</span>
                  <span style={{fontSize:'0.68rem',color:row.h?'var(--teal-l)':'rgba(240,235,224,0.32)',textAlign:'right',lineHeight:1.4}}>{row.i}</span>
                </div>
              ))}
              <div style={{padding:'1rem 1.5rem',background:'rgba(200,151,58,0.06)',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'1rem',borderTop:'1px solid rgba(200,151,58,0.15)'}}>
                <span className="serif" style={{fontStyle:'italic',color:'#f0ebe0',fontSize:'0.82rem'}}>Total WAVMVMT impact (residential premium alone)</span>
                <span/><span/>
                <span className="serif" style={{color:'var(--gold)',fontSize:'1rem',fontWeight:700,textAlign:'right'}}>+$720M – $1.8B</span>
              </div>
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.5rem'}}>
            <div style={{background:'#152a17',border:'1px solid rgba(240,235,224,0.06)',borderRadius:4,padding:'2.5rem'}}>
              <div style={{fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1.5rem'}}>Center opens first</div>
              <div style={{display:'flex',gap:'1.5rem',alignItems:'flex-end'}}>
                {[['4–7yr',140,'Highway',false],['3–5yr',115,'Microgrid',false],['2–4yr',96,'Residential',false],['2–3yr',80,'Lodge',false],['12–18mo',36,'WAVMVMT ★',true]].map(([t,h,l,fast])=>(
                  <div key={l as string} style={{textAlign:'center',flex:1}}>
                    <div style={{height:140,display:'flex',alignItems:'flex-end',justifyContent:'center',marginBottom:'0.5rem'}}>
                      <div style={{width:'100%',maxWidth:40,height:h as number,background:fast?'var(--gold)':'rgba(240,235,224,0.08)',borderRadius:'2px 2px 0 0'}}/>
                    </div>
                    <div style={{fontSize:'0.7rem',color:fast?'var(--gold)':'#f0ebe0',marginBottom:'0.15rem',lineHeight:1.2}}>{t}</div>
                    <div style={{fontSize:'0.58rem',color:fast?'var(--gold-l)':'rgba(240,235,224,0.28)',lineHeight:1.3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,padding:'2rem',flex:1,textAlign:'center'}}>
                <div className="serif" style={{fontSize:'0.82rem',color:'var(--gold-l)',marginBottom:'0.5rem'}}>Phase 1 monthly</div>
                <div className="serif" style={{fontSize:'1.8rem',fontWeight:700,color:'#f0ebe0'}}>$84K–$175K</div>
                <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.3)',marginTop:'0.4rem'}}>10 streams, from day one</div>
              </div>
              <div style={{border:'1px solid rgba(42,176,156,0.18)',borderRadius:4,padding:'2rem',flex:1,textAlign:'center'}}>
                <div className="serif" style={{fontSize:'0.82rem',color:'var(--teal-l)',marginBottom:'0.5rem'}}>Full build annual</div>
                <div className="serif" style={{fontSize:'1.8rem',fontWeight:700,color:'#f0ebe0'}}>$4.3M</div>
                <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.3)',marginTop:'0.4rem'}}>from 10+ streams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET */}
      <section className="pad-section" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Global Market — GWI 2025</span>
          <h2 className="h2" style={{marginBottom:'3rem'}}>Every space in WAVMVMT Center<br/><span className="em">is in a booming market.</span></h2>
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden'}}>
            {[
              {n:'$584B',g:'+19.5%/yr',l:'Wellness real estate',s:'#1 fastest in $6.8T wellness economy',src:'GWI 2025'},
              {n:'$159B',g:'+12.4%/yr',l:'Mental wellness',s:'Meditation growing at 18.9% annually',src:'GWI 2025'},
              {n:'$940B',g:'43M users',l:'Digital nomads',s:'$124,720 avg income · co-working + community',src:'MBO Partners 2025'},
              {n:'$68B',g:'Growing',l:'Corporate retreat market',s:'High-spend groups in shoulder seasons',src:'Market estimate 2024'},
              {n:'$2.5B',g:'+15%/yr',l:'Makerspace services',s:'Projected $8B by 2033',src:'Datainsightsmarket 2025'},
              {n:'10–25%',g:'Documented',l:'Residential wellness premium',s:'On $7.2B: +$720M to +$1.8B',src:'GWI + MIT 2025'},
            ].map(s=>(
              <div key={s.n} style={{background:'#152a17',padding:'2.5rem 2rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#1e3d22')} onMouseLeave={e=>(e.currentTarget.style.background='#152a17')}>
                <div style={{display:'flex',alignItems:'baseline',gap:'0.75rem',marginBottom:'0.4rem'}}>
                  <span className="serif" style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:700,color:'var(--gold-l)'}}>{s.n}</span>
                  <span style={{fontSize:'0.65rem',color:'var(--teal-l)'}}>{s.g}</span>
                </div>
                <div style={{fontSize:'0.82rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.35rem'}}>{s.l}</div>
                <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.42)',lineHeight:1.55,marginBottom:'0.35rem'}}>{s.s}</div>
                <div style={{fontSize:'0.52rem',letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(200,151,58,0.38)'}}>{s.src}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="pad-section" style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <span className="tag">The Long Arc</span>
              <h2 className="h2" style={{marginBottom:'1.5rem'}}>A WAVMVMT Center<br/><span className="em">in every development.</span></h2>
              <p className="body" style={{marginBottom:'1.5rem'}}>Every Qualified Opportunity Zone development this team touches gets a WAVMVMT Center. Funded progressively through deal closings, SBLC returns, and the compounding equity of the Centers themselves.</p>
              <p className="body" style={{marginBottom:'2.5rem'}}>I truly believe these Centers will bring the world closer. When someone walks in for the first time, they feel like they&apos;ve stepped into the home they always wanted. The visions they always thought about can now become possible. That&apos;s what happened to me.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {['Clearwater, ID ← first','Toronto, ON','Guatemala ← already building','QOZ #3','QOZ #4','Everywhere'].map((l,i)=>(
                  <span key={l} style={{fontSize:'0.65rem',padding:'0.35rem 1rem',borderRadius:20,border:`1px solid ${i===0||i===2?'rgba(200,151,58,0.35)':'rgba(240,235,224,0.1)'}`,color:i===0||i===2?'var(--gold)':'rgba(240,235,224,0.35)',background:i===0||i===2?'rgba(200,151,58,0.08)':'transparent'}}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'4/3'}}>
              <img src={P.movement} alt="Community movement workshop" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.85) saturate(0.9)'}}/>
            </div>
          </div>
        </div>
      </section>

      {/* THE ARRANGEMENT */}
      <section id="arrangement" className="pad-section" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(200,151,58,0.15)'}}>
        <div className="wrap-sm">
          <span className="tag">The Arrangement</span>
          <h2 className="h2" style={{marginBottom:'2rem'}}>What I bring.<br/><span className="em">What I need.</span></h2>
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'2rem'}}>
            <div style={{border:'1px solid rgba(42,176,156,0.25)',borderRadius:4,padding:'2rem',background:'rgba(42,176,156,0.04)'}}>
              <div className="tag" style={{marginBottom:'1rem',color:'var(--teal-l)'}}>What I bring</div>
              {[
                ['Full-time operations','I run WAVMVMT Center day-to-day. Programming, scheduling, community, staff coordination.'],
                ['Deal origination + relationship building','Through effort and genuine connection, I have been able to help bring people and opportunities together across this pipeline — alongside the team. That continues.'],
                ['Marketing + documentation','Events, content, film documentation of the entire build.'],
                ['Creative direction','Music, sound, movement, healing, education — 8 years of professional practice.'],
                ['No salary from the development','Revenue share negotiable. I run on the Center\'s own revenue.'],
              ].map(([t,b])=>(
                <div key={t} style={{display:'flex',gap:'0.75rem',marginBottom:'1rem',alignItems:'flex-start'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:'var(--teal-l)',flexShrink:0,marginTop:5}}/>
                  <div>
                    <div style={{fontSize:'0.8rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.2rem'}}>{t}</div>
                    <div style={{fontSize:'0.72rem',color:'rgba(240,235,224,0.45)',lineHeight:1.55}}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{border:'1px solid rgba(200,151,58,0.25)',borderRadius:4,padding:'2rem',background:'rgba(200,151,58,0.04)'}}>
              <div className="tag" style={{marginBottom:'1rem'}}>What I need</div>
              {[
                ['A home with outdoor space','A place to live and create from. With a yard for Apollo. That\'s it.'],
                ['Operational freedom','To run WAVMVMT Center community-first, program-led, authentically.'],
                ['Partnership, not employment','I am not applying for a job. I am proposing a long-term creative and business partnership.'],
                ['Trust','Everything in this pipeline exists because of trust. Same model applies here.'],
              ].map(([t,b])=>(
                <div key={t} style={{display:'flex',gap:'0.75rem',marginBottom:'1rem',alignItems:'flex-start'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:'var(--gold)',flexShrink:0,marginTop:5}}/>
                  <div>
                    <div style={{fontSize:'0.8rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.2rem'}}>{t}</div>
                    <div style={{fontSize:'0.72rem',color:'rgba(240,235,224,0.45)',lineHeight:1.55}}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:'2rem',border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,background:'rgba(200,151,58,0.04)',textAlign:'center'}}>
            <p className="serif" style={{fontSize:'clamp(1rem,2vw,1.3rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;This is not a favor and it is not a gift. It is an exchange of value. I bring the operating force, the relationships, and the cultural identity of Clearwater. In return: a place to build from. That is the whole arrangement.&quot;</p>
          </div>
        </div>
      </section>

      {/* PERSONAL NOTE */}
      <section id="note" className="pad-section" style={{background:'#152a17',padding:'8rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'5rem',alignItems:'start'}}>
            <div className="sticky-col" style={{position:'sticky',top:'7rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                <img src={P.thinking} alt="Saadiq Khan" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
              </div>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'4/3',position:'relative'}}>
                <img src={P.apollo} alt="Apollo" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(7,16,10,0.7) 0%,transparent 50%)'}}/>
                <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem'}}>
                  <span className="serif" style={{fontStyle:'italic',fontSize:'0.9rem',color:'rgba(240,235,224,0.75)'}}>Apollo — the one I&apos;m building a yard for.</span>
                </div>
              </div>
              <div style={{fontSize:'0.62rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(240,235,224,0.22)',textAlign:'center'}}>Saadiq Khan · shim.wav · WAVMVMT</div>
            </div>
            <div>
              <span className="tag">A Personal Note</span>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(1rem,2vw,1.5rem)',fontWeight:400,lineHeight:1.85,color:'rgba(240,235,224,0.88)'}}>
                <p style={{marginBottom:'2rem'}}>I packed a car in Toronto and drove to California. I didn&apos;t have a plan. I had music, movement, and the belief that showing up fully — following the feeling — leads somewhere real.</p>
                <p style={{marginBottom:'2rem'}}>I was training parkour the whole way. Making music. Connecting with people. Running on conviction. At a house in Beverly Hills, I met Sarah. We drove to Joshua Tree. We talked about what was possible. That conversation changed everything.</p>
                <p style={{marginBottom:'2rem'}}>Sarah introduced me to Nick. Nick and Sarah introduced me to Vince. My friend Darren — who I met through music, events, and life — introduced me to tools and relationships that accelerated the capital side of this journey. <span style={{fontStyle:'italic',color:'var(--gold-l)'}}>Every single connection traced back to art, community, and the willingness to follow the dream without waiting for permission.</span></p>
                <p style={{marginBottom:'2rem'}}>And I am now — because of all of that — in rooms working on a <strong style={{fontWeight:700,color:'#f0ebe0'}}>$20+ billion development</strong>. Through effort, genuine connection, and a commitment to bringing the right people together, I have been able to play a meaningful role in helping set this up — alongside an incredible team. Right now, Madizon is simultaneously building Espiral in Guatemala. Two WAVMVMT Centers being born at the same moment.</p>
                <p style={{marginBottom:'2rem'}}>This space will teach others to do the same. Coming together to bring a vision to life — following passion in all directions — is what makes extraordinary things happen. WAVMVMT Center is the proof, and the invitation.</p>
                <p style={{marginBottom:'2rem'}}>I want to contribute everything I have to what Vince, Sarah, and Nick are building. <strong style={{fontWeight:700,color:'#f0ebe0'}}>Not just one center. All of it. Every development. Every site. Long-term.</strong></p>
                <p><span style={{fontStyle:'italic',color:'var(--gold-l)'}}>All I need is a space to create and live from, with a yard for my dog. Everything else I bring because I believe in it completely.</span></p>
              </div>
              <div style={{marginTop:'3rem',paddingTop:'2rem',borderTop:'1px solid rgba(240,235,224,0.07)',textAlign:'right'}}>
                <span className="serif" style={{fontStyle:'italic',fontSize:'1rem',color:'rgba(240,235,224,0.35)'}}>— Saadiq Khan (shim.wav) · WAVMVMT · March 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="pad-section" style={{background:'#07100a',padding:'5rem 2rem 3rem',borderTop:'1px solid rgba(240,235,224,0.05)'}}>
        <div style={{textAlign:'center',maxWidth:560,margin:'0 auto 3rem'}}>
          <h2 className="h2" style={{marginBottom:'1rem'}}>Let&apos;s build this<br/><span className="em">together.</span></h2>
          <p className="body" style={{marginBottom:'2.5rem'}}>Clearwater. Idaho. A community built for the whole person.</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="mailto:wavmvmt@gmail.com" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,background:'var(--gold)',color:'#07100a',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',fontWeight:500}}>wavmvmt@gmail.com</a>
            <a href="https://wavmvmt-world.vercel.app/world" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>3D World →</a>
            <a href="/capital" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>Capital version →</a>
            <a href="/summary" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>Summary →</a>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:'0 auto',paddingTop:'2rem',borderTop:'1px solid rgba(240,235,224,0.05)',display:'flex',justifyContent:'space-between',fontSize:'0.62rem',letterSpacing:'0.07em',color:'rgba(240,235,224,0.18)',flexWrap:'wrap',gap:'0.5rem'}}>
          <span>WAVMVMT Center × Clearwater · A Proposal by Saadiq Khan · March 2026</span>
          <span>Confidential — For authorized recipients only</span>
        </div>
      </section>
    </div>
  )
}

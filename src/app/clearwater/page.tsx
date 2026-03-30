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

// All real photos
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
      { cat: 'Community', name: 'Outdoor Amphitheatre + Aerial Arts', desc: 'Concerts, open mics, aerial silk performances, community events. The mountain as the backdrop. Artists from around the world, first-timers on stage.', img: P.aerialSilks },
    ]
  },
  {
    phase: 'Phase 3', label: 'Year 3+', color: '#c8a86e',
    spaces: [
      { cat: 'Maker', name: 'Maker Space', desc: 'CNC machines, laser cutters, 3D printers, woodworking, welding. A full fabrication lab. $2.5B market growing at 15%/year.', img: 'https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Tech', name: 'Electronics + Tech Lab', desc: 'Soldering, robotics, microcontrollers, PCB design, 3D modeling. For builders, tinkerers, engineers, and curious kids who want to understand how the world works.', img: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Community', name: 'Teaching Kitchen', desc: 'Professional kitchen for cooking classes, fermentation, nutrition workshops, community dinners. Food is culture. Culture is community.', img: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { cat: 'Education', name: 'Youth Wing', desc: 'Dedicated development space for children and teens. After-school, workshops, performance programs, STEM + arts integration.', img: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ]
  }
]

const SCOT_STEPS = [
  { month: 'Now', title: 'NDA signed + deck delivered', body: 'Scot\'s NDA/NCNDA is resent — original landed in spam. Confirmed ready to sign. Upon signature, the updated deck is delivered. This conversation begins.', status: 'active' },
  { month: 'Week 2–3', title: 'WAVMVMT Center PPA letter of intent', body: 'A Power Purchase Agreement letter of intent is drafted between WAVMVMT Center and the Clearwater microgrid. This converts WAVMVMT from a "brand idea" into a contracted energy customer in writing — the document that makes it bankable. The pro forma already shows $20M in geothermal + $20M in biomass revenues. WAVMVMT is the anchor demand customer that makes those projections creditworthy to lenders.', status: 'pending' },
  { month: 'Month 1–2', title: "Scot's T3 fund term sheet for QOZB equity", body: 'WAVMVMT Center — active QOZB with contracted energy demand, youth programming, wellness, and education — satisfies Scot\'s humanitarian reinvestment mandate. His fund offers a term sheet for 5–20% QOZB equity. Investors receive capital gains deferral and 10-year elimination (IRC §1400Z-2). Reportable to Climate Bonds Initiative and his NASA advisory engagements. This mandate alignment does not exist anywhere else in the $20.86B pro forma.', status: 'pending' },
  { month: 'Month 2–3', title: 'QOZ Fund legal engagement — 60-day build', body: 'David Sillaman builds the dual-purpose QOZ fund — convertible debt structure, investor capital as pledged security during development, converting to equity at commercial operation. He has structured approximately one-sixth of all OZ funds in America. Full PPM, Operating Agreement, Subscription Agreements, Form D filing (within 15 days of first sale per SEC), and QOZB certification.', status: 'pending' },
  { month: 'Month 3–4', title: 'SBLC issued against escrowed QOZ capital', body: 'Scot\'s capital in QOZ fund escrow backs a Tier 1 SBLC covering ~30% of total capex. Passive security — not drawn, not spent — held against fraud and abandonment through commercial operation. Appian Way is primary source (Vince\'s relationship). Phil Taylor\'s BeMotion Solutions is the independent backup. Two sources = institutional-grade risk separation.', status: 'pending' },
  { month: 'Month 4–5', title: 'Family office LOI — conditional commitment', body: 'Security condition satisfied. Family office issues a Letter of Intent: conditional commitment to deploy 100% of project capex as JV equity, pari passu. Proof of funds: $5–6B+. This LOI is what Vince takes to Appian Way to accelerate Idaho\'s position in queue ahead of Tahoe and Dana Point.', status: 'pending' },
  { month: 'Month 5–6', title: 'Land under contract', body: 'Vince puts the Wilkes\' land under contract. Stealthy aggregation across multiple properties in a small county. NDA/NCNCA maintained. Existing revenue — timber $12–14M/year, mining $500K+/year, Shore Lodge, White Tail Resort — services costs from day one.', status: 'pending' },
  { month: 'Month 6–8', title: 'Full capital stack closes', body: `QOZ Fund (security) + SBLC (guarantee) + family office (100% capex JV equity) + Appian Way (remainder). Total pro forma scope of ${fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev)} fully funded and structured.`, status: 'pending' },
  { month: 'Month 6+', title: 'WAVMVMT Center Phase 1 construction begins', body: '9 core spaces — 12–18 months to completion. Generating $84K–$175K/month from day one.', status: 'pending' },
  { month: 'Month 18–24', title: 'WAVMVMT Center Phase 1 opens', body: 'First WAVMVMT Center in a major US resort development. Revenue live. Energy PPA active. Programming running. The flywheel begins — each closing seeds the next Center in the next development.', status: 'future' },
]

const PIPELINE = [
  { deal: 'Clearwater Idaho — $20B QOZ', origin: 'Music community → Nick Patterson → Vince Scott', role: 'Deal origination, capital introductions, investor materials' },
  { deal: '10 tonne/week gold deal', origin: 'Music relationships → cross-network introduction', role: 'Originator — connected parties with no prior relationship' },
  { deal: 'Scot Bryson / Impactful Capital', origin: 'Network of trust built through music + community', role: 'Capital introduction co-introduced to Clearwater' },
  { deal: 'Scott Kidd pension fund ($1B+)', origin: 'Capital markets network via Varunex relationship', role: 'Capital introduction via Varunex advisory' },
  { deal: 'blawk.ai', origin: 'Music industry relationships — AI sector crossover', role: 'Deal origination through entertainment contacts' },
  { deal: "Patrick Peach's film Reaper", origin: 'Entertainment + music industry relationships', role: 'Capital raise facilitation → producer credit' },
]

export default function ClearwaterV6() {
  const [openProforma, setOpenProforma] = useState(false)
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
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(200,151,58,0.25);border-radius:2px}
      `}</style>
      <div className="grain"/>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',background:navSolid?'rgba(7,16,10,0.94)':'transparent',backdropFilter:navSolid?'blur(16px)':'none',borderBottom:navSolid?'1px solid rgba(240,235,224,0.06)':'none',transition:'all 0.4s'}}>
        <span className="serif" style={{fontSize:'0.95rem',letterSpacing:'0.15em',color:'#f0ebe0'}}>WAV<span style={{color:'var(--gold)'}}>MVMT</span></span>
        <div style={{display:'flex',gap:'0.25rem',flexWrap:'wrap'}}>
          {[['vision','Vision'],['healing','Healing'],['proof','Proof'],['spaces','Spaces'],['scot','Capital Unlock'],['numbers','Numbers'],['note','Personal Note']].map(([id,label])=>(
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

      {/* VISION — artist portrait + outdoors */}
      <section id="vision" style={{background:'#0d1a0f',padding:'8rem 2rem',borderTop:'1px solid rgba(200,151,58,0.15)'}}>
        <div className="wrap">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
            <div>
              <span className="tag">The Alignment</span>
              <div className="h3 serif" style={{color:'#f0ebe0',marginBottom:'2.5rem',lineHeight:1.75}}>Vince is making it happen. He envisioned something extraordinary and is bringing every single piece of it to life. The intelligence behind this project — the precision, the scale — inspires me deeply.</div>
              <div style={{borderLeft:'2px solid var(--gold)',padding:'1.5rem 2rem',background:'rgba(200,151,58,0.04)',borderRadius:'0 4px 4px 0',marginBottom:'2.5rem'}}>
                <p className="serif" style={{fontSize:'clamp(1rem,2vw,1.3rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;I want to lock in long-term. Every development, every site, every community we build together — WAVMVMT Center is there. This is not a one-deal proposal. It is the thing I have been building toward my whole life, finally meeting its perfect home.&quot;</p>
              </div>
              <p className="body" style={{marginBottom:'1.5rem'}}>I am living proof that a kid who struggled — who found his way through parkour, music, community, and healing — can end up in rooms working on a $20+ billion development. Every deal in the pipeline was originated through relationships built through art and human connection.</p>
              <p className="body">That is not coincidence. That is proof of concept. WAVMVMT Centers work because I am the result of exactly what they build.</p>
            </div>
            <div style={{position:'sticky',top:'7rem'}}>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4',marginBottom:'1rem'}}>
                <img src={P.portrait} alt="Saadiq Khan" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
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

      {/* HEALING — studio + parkour photos */}
      <section id="healing" style={{background:'#07100a',padding:'8rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
            <div>
              <span className="tag">Why This Matters — Personally</span>
              <h2 className="h2" style={{marginBottom:'1.5rem'}}>The modalities that<br/><span className="em">changed everything.</span></h2>
              <p className="body" style={{marginBottom:'1.5rem'}}>I did not arrive at this vision from research. I arrived here from experience — lived, somatic, real. The healing modalities, the movement practices, the sound, the stillness — these things did not just improve my life. They fundamentally restructured how I relate to myself, to other people, and to the world.</p>
              <p className="body" style={{marginBottom:'1.5rem'}}>Parkour was the first thing that showed me what my body was capable of. Music production taught me to feel sound as a physical force and work with it as medicine. Meditation opened a layer of awareness I did not know existed. Sound healing was like a reset button for my entire nervous system.</p>
              <p className="body" style={{marginBottom:'2rem'}}>Every single modality was only available to me because I found the right people and spaces. That access is not random. It is the result of community. WAVMVMT Center is about making that access universal — for everyone who walks through the door.</p>
              <div style={{borderLeft:'2px solid var(--teal)',padding:'1.5rem 2rem',background:'rgba(42,176,156,0.04)',borderRadius:'0 4px 4px 0'}}>
                <p className="serif" style={{fontSize:'clamp(1rem,1.8vw,1.2rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;The psychological, emotional, and spiritual dimensions of health are not supplementary to physical wellness. They are the foundation.&quot;</p>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div>
                  <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                    <img src={P.studio} alt="In the studio" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <p className="caption">In the studio — sound as medicine</p>
                </div>
                <div>
                  <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                    <img src={P.parkourTrain} alt="Parkour training" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                  </div>
                  <p className="caption">Training — movement as liberation</p>
                </div>
              </div>
              <div style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,padding:'1.25rem'}}>
                <div className="tag" style={{marginBottom:'0.75rem'}}>Mental wellness market — GWI 2025</div>
                {[['12.4%/yr','#2 fastest growing sector in the $6.8T wellness economy'],['$159B','Global mental wellness (→ $355B by 2034)'],['18.9%/yr','Meditation + mindfulness — fastest subsector'],['1 in 8','People globally living with mental health issues (WHO 2024)']].map(([n,l])=>(
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

      {/* PROOF OF CONCEPT */}
      <section id="proof" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">Proof of Concept — Already Happening</span>
          <h2 className="h2" style={{marginBottom:'3rem'}}>The WAVMVMT community<br/><span className="em">exists. Right now.</span></h2>
          {/* The gong bath photo — full width feature */}
          <div style={{position:'relative',borderRadius:4,overflow:'hidden',marginBottom:'1.5rem'}}>
            <img src={P.gongbath} alt="WAVMVMT outdoor sound healing event" style={{width:'100%',height:'480px',objectFit:'cover',objectPosition:'center 40%'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(7,16,10,0.85) 0%,rgba(7,16,10,0.1) 50%)'}}/>
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'2.5rem 3rem'}}>
              <span className="tag" style={{marginBottom:'0.5rem'}}>Real event — already ran</span>
              <p className="serif" style={{fontSize:'clamp(1.1rem,2.5vw,1.8rem)',fontStyle:'italic',color:'#f0ebe0',maxWidth:700,lineHeight:1.5}}>An outdoor sound healing session — dozens of people, gongs, community, a dog. WAVMVMT already runs this. At Clearwater, this happens every week.</p>
            </div>
          </div>
          {/* Performing photo + pipeline table */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',marginBottom:'2rem'}}>
            <div>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                <img src={P.performing} alt="Shim performing live" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
              </div>
              <p className="caption" style={{color:'rgba(240,235,224,0.28)'}}>Performing live — the same person proposing to run WAVMVMT Center</p>
            </div>
            <div>
              <p className="body" style={{marginBottom:'1.5rem'}}>This is not a theory. The WAVMVMT model — community creates capital access — is already operating. Every major deal in the current pipeline was originated through relationships built through music, creative community, and genuine human connection.</p>
              <div style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,overflow:'hidden'}}>
                <div style={{padding:'0.65rem 1.25rem',borderBottom:'1px solid rgba(240,235,224,0.06)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',fontSize:'0.52rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(240,235,224,0.22)',background:'rgba(240,235,224,0.02)'}}>
                  <span>Active Deal</span><span>How It Originated</span>
                </div>
                {PIPELINE.map((row,i)=>(
                  <div key={i} style={{padding:'0.85rem 1.25rem',borderBottom:'1px solid rgba(240,235,224,0.04)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',background:i%2===0?'transparent':'rgba(240,235,224,0.015)'}}>
                    <div>
                      <div style={{fontSize:'0.75rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.15rem'}}>{row.deal}</div>
                      <div style={{fontSize:'0.62rem',color:'rgba(240,235,224,0.28)',lineHeight:1.4}}>{row.role}</div>
                    </div>
                    <div style={{fontSize:'0.68rem',color:'var(--teal-l)',lineHeight:1.55}}>{row.origin}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'1rem',padding:'1.25rem',border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,background:'rgba(200,151,58,0.04)'}}>
                <p className="serif" style={{fontSize:'0.95rem',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;I am the guinea pig. A kid who struggled, found himself through movement and music and community, and is now working on an $18 billion pipeline. The Center accelerates that path for everyone who walks through the door.&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAP */}
      <section style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">What&apos;s Missing</span>
          <h2 className="h2" style={{marginBottom:'1rem'}}>The plan is extraordinary.<br/><span className="em">One thing is absent.</span></h2>
          <p className="body" style={{maxWidth:620,marginBottom:'3rem'}}>Every physical and financial asset is mapped. What doesn&apos;t exist yet is the cultural identity — the full-spectrum wellness and creative infrastructure that makes people feel this place is truly theirs.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden'}}>
            {[
              ['No healing infrastructure','No sound bath, no somatic practices, no mental wellness programming. The fastest-growing wellness segment — completely absent.'],
              ['No creative expression','No music studio, no art space, no pottery. Guests are passive consumers. Nobody makes anything, nobody leaves changed.'],
              ['Nothing real for teenagers','The most underserved demographic in luxury resort design. Families don\'t extend stays when teens have nothing.'],
              ['Dead in winter','Idaho winters close outdoor amenity for months. 2,000 hotel units and 3,000 members need year-round reasons.'],
              ['No digital nomad pull','43 million high-earning nomads want co-working, community, and outdoor access. Zero infrastructure for them currently.'],
              ['No cultural identity','The pro forma builds the body. WAVMVMT Center gives it a heartbeat — the thing that makes this place different.'],
            ].map(([t,b])=>(
              <div key={t} style={{background:'#0d1a0f',padding:'2.5rem 2rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#152a17')} onMouseLeave={e=>(e.currentTarget.style.background='#0d1a0f')}>
                <span style={{fontSize:'0.78rem',color:'rgba(224,74,74,0.45)',display:'block',marginBottom:'0.75rem'}}>✕</span>
                <div style={{fontSize:'0.85rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.4rem'}}>{t}</div>
                <div style={{fontSize:'0.73rem',color:'rgba(240,235,224,0.4)',lineHeight:1.65}}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARABLE RESORTS */}
      <section style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">Comparable Resorts</span>
          <h2 className="h2" style={{marginBottom:'1rem'}}>The best in the world<br/><span className="em">still don&apos;t have this.</span></h2>
          <p className="body" style={{maxWidth:620,marginBottom:'3rem'}}>Soho House, 1 Hotel, and Equinox Hotels each command significant premiums specifically because of cultural identity and wellness positioning. None of them have the full WAVMVMT stack. Clearwater would be the first mountain resort community on earth with all of it.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom:'3rem'}}>
            {[
              {name:'Soho House',type:'Private members club',stat:'~$3B valuation',detail:'Cultural programming, community identity, creative members. No outdoor/nature. No sound healing. No parkour. No maker space.',color:'var(--gold)'},
              {name:'1 Hotel',type:'Wellness + sustainability',stat:'20–40% room rate premium',detail:'Nature-integrated, wellness-forward. No professional music studio. No co-working. No creative arts. No dedicated teen programming.',color:'var(--teal-l)'},
              {name:'Equinox Hotels',type:'Fitness + performance',stat:'$1,500+/night',detail:'Fitness-led luxury. Strong wellness. No sound healing. No music studio. No maker space. No youth programs. No community creative programming.',color:'var(--gold-l)'},
            ].map(c=>(
              <div key={c.name} style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,padding:'2.5rem 2rem',transition:'border-color 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(200,151,58,0.25)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(240,235,224,0.07)')}>
                <div style={{fontSize:'0.58rem',letterSpacing:'0.18em',textTransform:'uppercase',color:c.color,marginBottom:'0.5rem'}}>{c.type}</div>
                <div className="serif" style={{fontSize:'1.4rem',fontWeight:700,color:'#f0ebe0',marginBottom:'0.4rem'}}>{c.name}</div>
                <div style={{fontSize:'1rem',fontWeight:700,color:c.color,marginBottom:'1rem'}}>{c.stat}</div>
                <div style={{fontSize:'0.73rem',color:'rgba(240,235,224,0.42)',lineHeight:1.65}}>{c.detail}</div>
              </div>
            ))}
          </div>
          <div style={{padding:'2rem',border:'1px solid rgba(200,151,58,0.2)',borderRadius:4,background:'rgba(200,151,58,0.04)',textAlign:'center'}}>
            <p className="serif" style={{fontSize:'clamp(1rem,2vw,1.3rem)',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>&quot;Clearwater with WAVMVMT Center is the first mountain outdoor resort community to combine nature, recreation, professional creative infrastructure, full-spectrum healing, digital nomad facilities, and year-round community programming. That is not a feature set. That is a category.&quot;</p>
          </div>
        </div>
      </section>

      {/* SPACES */}
      <section id="spaces" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div style={{maxWidth:1300,margin:'0 auto'}}>
          <div style={{textAlign:'center',maxWidth:700,margin:'0 auto 2.5rem'}}>
            <span className="tag">All the Spaces — Three Phases</span>
            <h2 className="h2" style={{marginBottom:'0.75rem'}}>Everything.<br/><span className="em">Built in stages.</span></h2>
            <p className="body">Phase 1 opens 12–18 months before the rest of the resort. Each phase funded by revenue from the last.</p>
          </div>
          <div style={{display:'flex',gap:'0.75rem',justifyContent:'center',marginBottom:'2.5rem',flexWrap:'wrap'}}>
            {PHASES.map((p,i)=>(
              <button key={i} className="phase-btn" onClick={()=>{setActivePhase(i);setActiveSpace(null)}} style={activePhase===i?{borderColor:p.color,color:p.color,background:`${p.color}15`}:{}}>
                {p.phase} — {p.label}
              </button>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:`repeat(${PHASES[activePhase].spaces.length <= 6 ? 3 : 4},1fr)`,gap:'1.25rem'}}>
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
      <section id="scot" style={{background:'#07100a',padding:'8rem 2rem',borderTop:'1px solid rgba(200,151,58,0.1)'}}>
        <div className="wrap">
          <span className="tag">The Capital Unlock — Full Mechanics</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>How WAVMVMT Center unlocks<br/><span className="em">Scot Bryson&apos;s capital.</span></h2>
          <p className="body" style={{maxWidth:680,marginBottom:'1rem'}}>WAVMVMT Center is the specific instrument that gives Scot&apos;s T3 fund a mandate-aligned, QOZB-qualified entry point — accelerating deployment of the entire {fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev)} pro forma.</p>
          <div style={{padding:'1.25rem 2rem',border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,background:'rgba(200,151,58,0.04)',marginBottom:'2.5rem'}}>
            <p style={{fontSize:'0.82rem',color:'rgba(240,235,224,0.7)',lineHeight:1.75}}><strong style={{color:'#f0ebe0'}}>The core insight:</strong> Without WAVMVMT Center, this deal depends entirely on Appian Way&apos;s timeline — and they have two projects ahead of Idaho. With it, a second institutional path exists through Scot&apos;s fund. <em style={{color:'var(--gold-l)'}}>The Center structurally de-risks the capital stack.</em></p>
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
        </div>
      </section>

      {/* NUMBERS */}
      <section id="numbers" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.05)'}}>
        <div className="wrap">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'2rem',marginBottom:'2.5rem'}}>
            <div>
              <span className="tag">From the Actual Pro Forma</span>
              <h2 className="h2">The numbers are<br/><span className="em">already there.</span></h2>
            </div>
            <button onClick={()=>setOpenProforma(!openProforma)} style={{background:'none',border:'1px solid rgba(240,235,224,0.12)',color:'rgba(240,235,224,0.45)',fontSize:'0.65rem',letterSpacing:'0.12em',textTransform:'uppercase',padding:'0.55rem 1.1rem',borderRadius:100,cursor:'pointer',fontFamily:'inherit'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(240,235,224,0.12)';e.currentTarget.style.color='rgba(240,235,224,0.45)'}}>
              {openProforma?'− Hide':'+ Full breakdown'}
            </button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'2rem'}}>
            {[
              {n:fmt(PROFORMA.totalExistingRev+PROFORMA.totalSalesRev),l:'Total pro forma scope',s:'Existing revenues + remaining sales — actual document'},
              {n:fmt(PROFORMA.residentialSales),l:'Residential sales (3,000 homes)',s:'10% GWI premium = +$720M · 25% = +$1.8B'},
              {n:'+$33M/yr',l:'Hotel revenue uplift',s:'2,000 units × $75 ADR wellness premium × 60% occ'},
              {n:fmt(PROFORMA.existingWellnessRev),l:'Current wellness line',s:'WAVMVMT Center replaces + massively expands this'},
            ].map(s=>(
              <div key={s.n} style={{background:'#0d1a0f',padding:'2.5rem 1.75rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#152a17')} onMouseLeave={e=>(e.currentTarget.style.background='#0d1a0f')}>
                <span className="serif" style={{fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:700,color:'var(--gold-l)',display:'block',marginBottom:'0.4rem'}}>{s.n}</span>
                <div style={{fontSize:'0.72rem',color:'rgba(240,235,224,0.5)',lineHeight:1.55,marginBottom:'0.35rem'}}>{s.l}</div>
                <div style={{fontSize:'0.55rem',letterSpacing:'0.07em',textTransform:'uppercase',color:'rgba(200,151,58,0.4)'}}>{s.s}</div>
              </div>
            ))}
          </div>
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
                {l:'Shore Lodge / Whitetail',u:'1',r:'$75M existing',i:'Extended stays, nomad revenue',h:false},
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
                <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.3)',marginTop:'0.4rem'}}>from day one</div>
              </div>
              <div style={{border:'1px solid rgba(42,176,156,0.18)',borderRadius:4,padding:'2rem',flex:1,textAlign:'center'}}>
                <div className="serif" style={{fontSize:'0.82rem',color:'var(--teal-l)',marginBottom:'0.5rem'}}>Full build annual</div>
                <div className="serif" style={{fontSize:'1.8rem',fontWeight:700,color:'#f0ebe0'}}>$4.3M</div>
                <div style={{fontSize:'0.65rem',color:'rgba(240,235,224,0.3)',marginTop:'0.4rem'}}>from 8+ streams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET */}
      <section style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Global Market — GWI 2025</span>
          <h2 className="h2" style={{marginBottom:'3rem'}}>Every space in WAVMVMT Center<br/><span className="em">is in a booming market.</span></h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden'}}>
            {[
              {n:'$584B',g:'+19.5%/yr',l:'Wellness real estate',s:'#1 fastest in $6.8T wellness economy',src:'GWI 2025'},
              {n:'$159B',g:'+12.4%/yr',l:'Mental wellness',s:'Meditation growing at 18.9% annually',src:'GWI 2025'},
              {n:'$940B',g:'43M users',l:'Digital nomads',s:'$124,720 avg income. Co-working + community + outdoor',src:'MBO Partners 2025'},
              {n:'$10.6B',g:'+10.5%/yr',l:'Global meditation market',s:'Expected $29.7B by 2035',src:'Business Research Insights 2025'},
              {n:'$2.5B',g:'+15%/yr',l:'Makerspace services',s:'Projected $8B by 2033 — CNC, 3D printing, fabrication',src:'Datainsightsmarket 2025'},
              {n:'10–25%',g:'Documented',l:'Residential wellness premium',s:'On $7.2B residential line: +$720M to +$1.8B',src:'GWI + MIT 2025'},
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
      <section style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <span className="tag">The Long Arc</span>
              <h2 className="h2" style={{marginBottom:'1.5rem'}}>A WAVMVMT Center<br/><span className="em">in every development.</span></h2>
              <p className="body" style={{marginBottom:'1.5rem'}}>Every Qualified Opportunity Zone development this team touches gets a WAVMVMT Center. Funded progressively through deal closings, SBLC returns, and the compounding equity of the Centers themselves.</p>
              <p className="body" style={{marginBottom:'2.5rem'}}>I truly believe these Centers will bring the world closer. When someone walks in for the first time, they feel like they&apos;ve stepped into the home they always wanted. The visions they always thought about can now become possible. That&apos;s what happened to me.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {['Clearwater, ID ← first','Toronto, ON','QOZ #3','QOZ #4','QOZ #5','Everywhere'].map((l,i)=>(
                  <span key={l} style={{fontSize:'0.65rem',padding:'0.35rem 1rem',borderRadius:20,border:`1px solid ${i===0?'rgba(200,151,58,0.35)':'rgba(240,235,224,0.1)'}`,color:i===0?'var(--gold)':'rgba(240,235,224,0.35)',background:i===0?'rgba(200,151,58,0.08)':'transparent'}}>{l}</span>
                ))}
              </div>
            </div>
            {/* Movement workshop photo */}
            <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'4/3'}}>
              <img src={P.movement} alt="Community movement workshop" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.85) saturate(0.9)'}}/>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL NOTE — thinking + apollo */}
      <section id="note" style={{background:'#0d1a0f',padding:'8rem 2rem',borderTop:'1px solid rgba(200,151,58,0.15)'}}>
        <div className="wrap">
          <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'5rem',alignItems:'start'}}>
            <div style={{position:'sticky',top:'7rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'3/4'}}>
                <img src={P.thinking} alt="Saadiq Khan" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
              </div>
              {/* Apollo */}
              <div style={{borderRadius:4,overflow:'hidden',aspectRatio:'4/3',position:'relative'}}>
                <img src={P.apollo} alt="Apollo" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(7,16,10,0.7) 0%,transparent 50%)'}}/>
                <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1rem'}}>
                  <span className="serif" style={{fontStyle:'italic',fontSize:'0.9rem',color:'rgba(240,235,224,0.7)'}}>Apollo — the one I&apos;m building a yard for.</span>
                </div>
              </div>
              <div style={{fontSize:'0.62rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(240,235,224,0.22)',textAlign:'center'}}>Saadiq Khan · shim.wav · WAVMVMT</div>
            </div>
            <div>
              <span className="tag">A Personal Note</span>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(1rem,2vw,1.5rem)',fontWeight:400,lineHeight:1.85,color:'rgba(240,235,224,0.88)'}}>
                <p style={{marginBottom:'2rem'}}>I&apos;ve been working toward this for almost a decade. Not toward a specific deal or building — toward an understanding of how to bring people together in spaces that actually change them.</p>
                <p style={{marginBottom:'2rem'}}>Parkour showed me what my body was capable of. Music production taught me to work with sound as medicine. Meditation opened a layer of awareness I didn&apos;t know existed. Sound healing reset my nervous system. Community gave me the mirror to understand who I was becoming. <span style={{fontStyle:'italic',color:'var(--gold-l)'}}>These modalities did not improve my life. They restructured it.</span></p>
                <p style={{marginBottom:'2rem'}}>And I am now — because of all of that — in rooms working on a <strong style={{fontWeight:700,color:'#f0ebe0'}}>$20+ billion development</strong> in Idaho. Every deal in the pipeline was originated through relationships built through music and community. That is proof of concept.</p>
                <p style={{marginBottom:'2rem'}}>I want to contribute everything I have to what Vince is building. <strong style={{fontWeight:700,color:'#f0ebe0'}}>Not just one center. All of it. Every development. Every site. Long-term.</strong> I&apos;ll learn 3D modeling, document the whole build on film, run the programming, keep bringing capital and deal flow.</p>
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
      <section style={{background:'#07100a',padding:'5rem 2rem 3rem',borderTop:'1px solid rgba(240,235,224,0.05)'}}>
        <div style={{textAlign:'center',maxWidth:560,margin:'0 auto 3rem'}}>
          <h2 className="h2" style={{marginBottom:'1rem'}}>Let&apos;s build this<br/><span className="em">together.</span></h2>
          <p className="body" style={{marginBottom:'2.5rem'}}>Clearwater. Idaho. A community built for the whole person.</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="mailto:wavmvmt@gmail.com" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,background:'var(--gold)',color:'#07100a',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',fontWeight:500}}>wavmvmt@gmail.com</a>
            <a href="https://wavmvmt-world.vercel.app/world" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>3D World →</a>
            <a href="/capital" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>Capital version →</a>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:'0 auto',paddingTop:'2rem',borderTop:'1px solid rgba(240,235,224,0.05)',display:'flex',justifyContent:'space-between',fontSize:'0.62rem',letterSpacing:'0.07em',color:'rgba(240,235,224,0.18)'}}>
          <span>WAVMVMT Center × Clearwater · A Proposal by Saadiq Khan · March 2026</span>
          <span>Confidential — For authorized recipients only</span>
        </div>
      </section>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'

const fmt = (n: number) => {
  if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n/1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

const PROFORMA = {
  residentialSales: 7200000000, hotelUnits: 2000,
  totalExistingRev: 9838000000, totalSalesRev: 11020000000,
  membershipUnits: 3000, geothermalRev: 20000000, biomassRev: 20000000,
}

const CAPITAL_STEPS = [
  { n: '01', title: 'WAVMVMT Center signs Power Purchase Agreement', badge: 'Energy anchor', badgeColor: 'teal',
    body: '10–20 year energy purchase contract with the Clearwater geothermal/biomass/hydro microgrid. The pro forma already shows $20M in geothermal + $20M in biomass revenues. WAVMVMT Center as a contracted anchor customer makes those projections creditworthy to lenders — and converts WAVMVMT from a brand concept into a bankable commercial tenant.' },
  { n: '02', title: "Satisfies Scot's T3 fund humanitarian mandate as QOZB", badge: 'Capital trigger', badgeColor: 'gold',
    body: 'Youth programming + wellness + education + community infrastructure = humanitarian reinvestment mandate fulfilled. Scot\'s fund issues a term sheet for 5–20% QOZB equity in WAVMVMT Center. Investors receive capital gains deferral and 10-year elimination (IRC §1400Z-2). Reportable to Climate Bonds Initiative and Scot\'s NASA consulting engagements. This mandate alignment does not exist anywhere else in the $20.86B pro forma.' },
  { n: '03', title: "Scot's capital → QOZ fund escrow → Tier 1 SBLC", badge: 'Security layer', badgeColor: 'teal',
    body: 'Scot\'s capital flows into David Sillaman\'s QOZ fund structure as convertible debt in escrow. Sillaman has structured approximately one-sixth of all opportunity zone funds in America. The escrowed capital backs a Tier 1 SBLC covering ~30% of total capex — passive security, not drawn, not spent, held against fraud and abandonment through commercial operation. Two SBLC sources: Appian Way (primary, Vince\'s relationship) + Phil Taylor / BeMotion Solutions (independent backup). Dual-source = institutional-grade risk separation.' },
  { n: '04', title: 'Family office deploys 100% of project capex', badge: fmt(PROFORMA.totalExistingRev + PROFORMA.totalSalesRev), badgeColor: 'cream',
    body: 'Security condition satisfied. The deca-billionaire family office (via Scot) issues a Letter of Intent: conditional commitment to deploy 100% of project capex as JV equity, pari passu. Proof of funds: $5–6B+. This LOI is what Vince takes to Appian Way to accelerate Idaho\'s position in queue ahead of Tahoe and Dana Point.' },
  { n: '05', title: 'Appian Way funds the remainder', badge: 'Deal closed', badgeColor: 'cream',
    body: 'Appian Way\'s multi-billion capacity fills the remaining requirement. Full capital stack: QOZ Fund (security) + SBLC (guarantee) + family office (100% capex JV equity) + Appian Way (remainder). Total pro forma scope of $20.86B fully funded and structured. WAVMVMT Center Phase 1 construction begins.' },
]

const COMPETITORS = [
  { feature: 'Ski / outdoor recreation', yc: true, mb: true, bc: true, wv: true },
  { feature: 'Fine dining + spa', yc: true, mb: true, bc: true, wv: true },
  { feature: 'Year-round indoor programming', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Professional music studio', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Sound bath / healing', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Parkour + movement gym', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Pottery + glass blowing', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Professional co-working', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Dedicated teen programming', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Digital nomad infrastructure', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Corporate retreat venue', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Outdoor amphitheatre events', yc: false, mb: false, bc: false, wv: true },
  { feature: 'Energy customer (PPA)', yc: false, mb: false, bc: false, wv: true },
  { feature: 'QOZB-qualified impact asset', yc: false, mb: false, bc: false, wv: true },
]

const PROBLEMS = [
  { p: 'Appian Way has 2 projects ahead of Idaho', s: 'WAVMVMT Center creates a second institutional capital path through Scot\'s T3 fund — removing timeline dependency.' },
  { p: 'Family office requires security layer before deploying', s: 'WAVMVMT PPA → QOZB → QOZ fund escrow → SBLC satisfies the ~30% capex security requirement without drawing capital.' },
  { p: 'No revenue until development completes (years away)', s: 'Phase 1 opens in 12–18 months. $84K–$175K/month from day one — before the resort is built.' },
  { p: 'Idaho winters kill ~6 months of outdoor amenity', s: 'Center operates identically in January and July. The only line in the pro forma that does not require snow.' },
  { p: 'Families with teenagers may not extend stays', s: 'Dedicated teen programming — parkour, music, creative arts — the gap every competitor ignores.' },
  { p: 'Fractional buyers need year-round lifestyle answer', s: 'Center answers "what do we do in February?" — the hardest fractional objection, fully solved.' },
  { p: 'Digital nomads have no infrastructure for long stays', s: 'Co-working + AI + community = 1–3 month packages at highest margin occupancy.' },
  { p: 'No cultural identity vs. Yellowstone Club', s: 'WAVMVMT Center becomes the soul of Clearwater — the thing that makes people say "this place is different."' },
  { p: '~$87M/year in unrealized off-season hotel revenue', s: 'Center fills the shoulder season with programming, corporate retreats, and nomad packages.' },
]

const ENTITY = [
  { entity: 'WAVMVMT Inc. (Ontario)', type: 'Operating entity', role: 'Receives all advisory + origination fees. Holds music IP. W-8BEN-E filed — zero US withholding on US deal income.' },
  { entity: 'WAVMVMT Center QOZB', type: 'Active OZ business', role: 'Operates inside each QOZ development. Energy customer via PPA. Youth programming + wellness + education. Scot\'s fund equity entry point.' },
  { entity: 'WAVMVMT USA LLC (Delaware)', type: 'US subsidiary', role: 'US operations, contracts, film investments. Wholly owned by WAVMVMT Inc.' },
  { entity: 'WAVMVMT Fund I LP (Delaware)', type: 'Investment vehicle (future)', role: 'Raises capital under Reg D 506(b). Deploys into QOZ real estate. GP: WAVMVMT Inc.' },
]

export default function CapitalPage() {
  const [openStep, setOpenStep] = useState<number|null>(null)
  const [openProblem, setOpenProblem] = useState<number|null>(null)
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
        :root{--gold:#c8973a;--gold-l:#e0b55a;--teal:#2d8a78;--teal-l:#42b09c;--ink:#07100a}
        .serif{font-family:'Playfair Display',Georgia,serif!important}
        .grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.28;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}
        .tag{display:block;font-size:0.58rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem}
        .h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.8rem,7vw,6rem);font-weight:700;line-height:1.0}
        .h2{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.8rem,4vw,3.2rem);font-weight:700;line-height:1.1}
        .em{font-style:italic;font-weight:400;color:var(--gold-l)}
        .body{font-size:0.9rem;color:rgba(240,235,224,0.58);line-height:1.88}
        .wrap{max-width:1100px;margin:0 auto}
        .pill{display:inline-block;font-size:0.56rem;letter-spacing:0.1em;text-transform:uppercase;padding:0.2rem 0.65rem;border-radius:20px}
        .pill-gold{background:rgba(200,151,58,0.12);color:var(--gold);border:1px solid rgba(200,151,58,0.22)}
        .pill-teal{background:rgba(42,176,156,0.1);color:var(--teal-l);border:1px solid rgba(42,176,156,0.2)}
        .pill-cream{background:rgba(240,235,224,0.05);color:rgba(240,235,224,0.38);border:1px solid rgba(240,235,224,0.1)}
        .acc{padding:1.4rem 2rem;border:1px solid rgba(240,235,224,0.07);border-radius:4px;margin-bottom:0.5rem;cursor:pointer;transition:background 0.25s}
        .acc:hover,.acc.open{background:rgba(200,151,58,0.04);border-color:rgba(200,151,58,0.18)}
        .ch{display:inline-block;width:18px;height:18px;border-radius:50%;text-align:center;line-height:18px;font-size:0.6rem;font-weight:700}
        .ch-yes{background:rgba(42,176,156,0.12);color:var(--teal-l);border:1px solid rgba(42,176,156,0.2)}
        .ch-no{background:rgba(240,235,224,0.04);color:rgba(240,235,224,0.18);border:1px solid rgba(240,235,224,0.08)}
        .ch-gold{background:rgba(200,151,58,0.14);color:var(--gold);border:1px solid rgba(200,151,58,0.25)}
        @media(max-width:768px){
          .grid-2{grid-template-columns:1fr!important}
          .grid-3{grid-template-columns:1fr 1fr!important}
          .pad{padding:5rem 1.25rem!important}
          .nav-links{display:none!important}
        }
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(200,151,58,0.25);border-radius:2px}
      `}</style>
      <div className="grain"/>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',background:navSolid?'rgba(7,16,10,0.94)':'transparent',backdropFilter:navSolid?'blur(16px)':'none',borderBottom:navSolid?'1px solid rgba(240,235,224,0.06)':'none',transition:'all 0.4s'}}>
        <span className="serif" style={{fontSize:'0.95rem',letterSpacing:'0.15em',color:'#f0ebe0'}}>WAV<span style={{color:'var(--gold)'}}>MVMT</span> <span style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.35)',letterSpacing:'0.05em'}}>/ Capital</span></span>
        <div className="nav-links" style={{display:'flex',gap:'0.25rem'}}>
          {[['market','Market'],['mechanism','Mechanism'],['problems','Problems Solved'],['competitors','Competitors'],['numbers','Numbers'],['entity','Structure']].map(([id,label])=>(
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
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(7,16,10,0.6) 0%,rgba(7,16,10,0.2) 40%,rgba(7,16,10,0.88) 80%,#07100a 100%)'}}/>
        <div style={{position:'relative',zIndex:2,padding:'8rem 2rem 5rem',maxWidth:1100,margin:'0 auto',width:'100%'}}>
          <p className="tag" style={{marginBottom:'2rem',fontSize:'0.62rem'}}>WAVMVMT Center at Clearwater · Capital + Structure · For Authorized Recipients Only</p>
          <h1 className="h1 serif" style={{marginBottom:'2rem',maxWidth:820}}>The Investment Case<br />for <span className="em">WAVMVMT Center</span></h1>
          <p className="body" style={{maxWidth:560,marginBottom:'2rem',fontSize:'1rem'}}>Market data. Capital structure. Competitive positioning. Problem-solution analysis. How WAVMVMT Center unlocks the {fmt(PROFORMA.totalExistingRev+PROFORMA.totalSalesRev)} Clearwater pro forma and generates returns across every stakeholder.</p>
          <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
            <button onClick={()=>go('mechanism')} style={{background:'var(--gold)',color:'#07100a',border:'none',padding:'0.9rem 2rem',borderRadius:100,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontWeight:500,fontFamily:'inherit'}}>Capital mechanism ↓</button>
            <a href="/clearwater" style={{display:'inline-block',padding:'0.9rem 2rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.2)',color:'rgba(240,235,224,0.6)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>Vision version →</a>
            <a href="/summary" style={{display:'inline-block',padding:'0.9rem 2rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.45)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>One-page summary →</a>
          </div>
          <p style={{position:'absolute',bottom:36,fontSize:'0.56rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(240,235,224,0.25)'}}>Confidential — For authorized recipients only</p>
        </div>
      </section>

      {/* MARKET DATA */}
      <section id="market" className="pad" style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(200,151,58,0.12)'}}>
        <div className="wrap">
          <span className="tag">The Market</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>Wellness real estate is the fastest<br/><span className="em">growing sector in the global economy.</span></h2>
          <p className="body" style={{maxWidth:580,marginBottom:'3rem'}}>Data from the Global Wellness Institute — the world&apos;s leading research authority. Published 2025.</p>
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'2.5rem'}}>
            {[
              {n:'$584B',g:'+19.5%/yr',l:'Wellness real estate market (2024)',src:'GWI 2025'},
              {n:'$159B',g:'+12.4%/yr',l:'Mental wellness — #2 fastest growing sector',src:'GWI 2025'},
              {n:'10–25%',g:'Documented',l:'Residential price premium for wellness developments',src:'GWI + MIT'},
              {n:'$940B',g:'43M users',l:'Digital nomads — avg income $124,720/yr',src:'MBO Partners 2025'},
              {n:'$68B',g:'Growing',l:'Corporate retreat + team offsite market',src:'Market estimate 2024'},
              {n:'$2.5B',g:'+15%/yr',l:'Makerspace services — projected $8B by 2033',src:'Datainsightsmarket 2025'},
            ].map(s=>(
              <div key={s.n} style={{background:'#07100a',padding:'2.5rem 2rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#0d1a0f')} onMouseLeave={e=>(e.currentTarget.style.background='#07100a')}>
                <div style={{display:'flex',alignItems:'baseline',gap:'0.75rem',marginBottom:'0.4rem'}}>
                  <span className="serif" style={{fontSize:'clamp(1.8rem,3vw,2.6rem)',fontWeight:700,color:'var(--gold-l)'}}>{s.n}</span>
                  <span style={{fontSize:'0.65rem',color:'var(--teal-l)'}}>{s.g}</span>
                </div>
                <div style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',lineHeight:1.55,marginBottom:'0.3rem'}}>{s.l}</div>
                <div style={{fontSize:'0.52rem',letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(200,151,58,0.38)'}}>{s.src}</div>
              </div>
            ))}
          </div>
          {/* Residential premium callout */}
          <div style={{padding:'2rem 2.5rem',border:'1px solid rgba(200,151,58,0.2)',borderRadius:4,background:'rgba(200,151,58,0.04)'}}>
            <p style={{fontSize:'0.85rem',color:'rgba(240,235,224,0.7)',lineHeight:1.8}}>
              <strong style={{color:'#f0ebe0'}}>Applied to Clearwater:</strong> The pro forma carries $7.2B in residential custom home sales. A 10% GWI wellness premium adds <strong style={{color:'var(--gold-l)'}}>+$720M</strong>. A 25% premium adds <strong style={{color:'var(--gold-l)'}}>+$1.8B</strong>. WAVMVMT Center is the specific infrastructure that creates and sustains that premium — no other line in the pro forma addresses it.
            </p>
          </div>
        </div>
      </section>

      {/* CAPITAL MECHANISM */}
      <section id="mechanism" className="pad" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Capital Mechanism</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>How WAVMVMT Center unlocks<br/><span className="em">the full capital stack.</span></h2>
          <p className="body" style={{maxWidth:680,marginBottom:'1rem'}}>Sequential. Each step enables the next. Click to expand. Total scope: {fmt(PROFORMA.totalExistingRev+PROFORMA.totalSalesRev)}.</p>
          <div style={{padding:'1.25rem 2rem',border:'1px solid rgba(200,151,58,0.18)',borderRadius:4,background:'rgba(200,151,58,0.04)',marginBottom:'2rem'}}>
            <p style={{fontSize:'0.82rem',color:'rgba(240,235,224,0.7)',lineHeight:1.75}}>
              <strong style={{color:'#f0ebe0'}}>Core insight:</strong> Without WAVMVMT Center, this deal depends entirely on Appian Way&apos;s timeline — they have two projects ahead of Idaho. With it, a second institutional path exists through Scot&apos;s T3 fund. <em style={{color:'var(--gold-l)'}}>WAVMVMT Center structurally de-risks the capital stack.</em>
            </p>
          </div>
          {CAPITAL_STEPS.map((s,i)=>(
            <div key={i} className={`acc${openStep===i?' open':''}`} onClick={()=>setOpenStep(openStep===i?null:i)}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
                  <span className="serif" style={{fontSize:'0.85rem',color:'rgba(240,235,224,0.22)',fontStyle:'italic',minWidth:'2rem',flexShrink:0}}>{s.n}</span>
                  <div style={{fontSize:'0.88rem',fontWeight:500,color:'#f0ebe0'}}>{s.title}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
                  <span className={`pill pill-${s.badgeColor}`}>{s.badge}</span>
                  <span style={{color:'rgba(240,235,224,0.25)',fontSize:'0.8rem'}}>{openStep===i?'−':'+'}</span>
                </div>
              </div>
              {openStep===i&&<p style={{fontSize:'0.8rem',color:'rgba(240,235,224,0.58)',lineHeight:1.8,marginTop:'1.25rem',paddingTop:'1.25rem',borderTop:'1px solid rgba(240,235,224,0.07)'}}>{s.body}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMS SOLVED */}
      <section id="problems" className="pad" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">Problems Solved</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>9 real development problems.<br/><span className="em">1 solution.</span></h2>
          <p className="body" style={{maxWidth:560,marginBottom:'2.5rem'}}>Click each to expand. Every problem below is a documented, quantifiable challenge to the development&apos;s returns.</p>
          {PROBLEMS.map((p,i)=>(
            <div key={i} style={{padding:'1rem 1.5rem',border:'1px solid rgba(240,235,224,0.06)',borderRadius:4,marginBottom:'0.4rem',cursor:'pointer',transition:'background 0.25s',background:openProblem===i?'rgba(200,151,58,0.04)':'transparent'}}
              onClick={()=>setOpenProblem(openProblem===i?null:i)}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <span style={{fontSize:'0.6rem',color:'rgba(224,74,74,0.5)',flexShrink:0}}>Problem</span>
                  <span style={{fontSize:'0.83rem',color:'#f0ebe0'}}>{p.p}</span>
                </div>
                <span style={{color:'rgba(240,235,224,0.25)',fontSize:'0.75rem',flexShrink:0}}>{openProblem===i?'−':'+'}</span>
              </div>
              {openProblem===i&&(
                <div style={{marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(240,235,224,0.06)',display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
                  <span style={{fontSize:'0.6rem',color:'var(--teal-l)',flexShrink:0,marginTop:2}}>Solved</span>
                  <p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',lineHeight:1.7}}>{p.s}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* COMPETITORS */}
      <section id="competitors" className="pad" style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">Competitive Positioning</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>No mountain resort in North America<br/><span className="em">offers this combination.</span></h2>
          <p className="body" style={{maxWidth:600,marginBottom:'2.5rem'}}>Verified against publicly documented amenities for Yellowstone Club, Montage Big Sky, and Brush Creek Ranch.</p>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'separate',borderSpacing:'1px',fontSize:'0.75rem'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left',padding:'0.75rem 1rem',fontSize:'0.58rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(240,235,224,0.28)',background:'#07100a'}}>Feature</th>
                  {[['Yellowstone Club',''],['Montage Big Sky',''],['Brush Creek',''],['Clearwater + WAVMVMT','gold']].map(([n,c])=>(
                    <th key={n} style={{textAlign:'center',padding:'0.75rem 0.75rem',fontSize:'0.6rem',letterSpacing:'0.07em',color:c==='gold'?'var(--gold)':'rgba(240,235,224,0.38)',background:c==='gold'?'rgba(200,151,58,0.06)':'#07100a',whiteSpace:'nowrap'}}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((row,i)=>(
                  <tr key={i}>
                    <td style={{padding:'0.6rem 1rem',color:'rgba(240,235,224,0.58)',background:'#090f0a'}}>{row.feature}</td>
                    {[row.yc,row.mb,row.bc,row.wv].map((v,j)=>(
                      <td key={j} style={{textAlign:'center',padding:'0.6rem 0.75rem',background:j===3?'rgba(200,151,58,0.03)':'#090f0a'}}>
                        <span className={`ch ${v?(j===3?'ch-gold':'ch-yes'):'ch-no'}`}>{v?'✓':'✕'}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section id="numbers" className="pad" style={{background:'#0d1a0f',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Business Case — From the Actual Pro Forma</span>
          <h2 className="h2" style={{marginBottom:'3rem'}}>Fast to build.<br/><span className="em">Early to earn.</span></h2>
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom:'3rem'}}>
            {[
              {n:'+$720M',sub:'minimum',l:'Added residential value',c:'10% GWI wellness premium × $7.2B residential sales line',src:'GWI Build Well to Live Well 2025'},
              {n:'+$33M',sub:'/year',l:'Hotel revenue uplift',c:'2,000 hotel units × $75 ADR premium × 60% occupancy × 365',src:'GWI + MIT commercial premium data'},
              {n:'$4.3M',sub:'/year',l:'Direct Center revenue (full build)',c:'8 streams: memberships, classes, studio, events, retreats, nomad packages, practitioners, digital',src:'WAVMVMT internal projection'},
            ].map(c=>(
              <div key={c.n} style={{border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,padding:'2.5rem 2rem',transition:'border-color 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(200,151,58,0.25)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(240,235,224,0.07)')}>
                <div style={{display:'flex',alignItems:'baseline',gap:'0.4rem',marginBottom:'0.4rem'}}>
                  <span className="serif" style={{fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,color:'var(--gold-l)'}}>{c.n}</span>
                  <span style={{fontSize:'0.75rem',color:'rgba(240,235,224,0.4)'}}>{c.sub}</span>
                </div>
                <div style={{fontSize:'0.82rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.75rem'}}>{c.l}</div>
                <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.4)',lineHeight:1.6,marginBottom:'0.5rem'}}>{c.c}</div>
                <div style={{fontSize:'0.55rem',letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(200,151,58,0.4)'}}>{c.src}</div>
              </div>
            ))}
          </div>
          {/* Build timeline */}
          <div style={{background:'#152a17',border:'1px solid rgba(240,235,224,0.06)',borderRadius:4,padding:'2.5rem',marginBottom:'2rem'}}>
            <div style={{fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1.5rem'}}>Center opens first — before everything else</div>
            <div style={{display:'flex',gap:'1.5rem',alignItems:'flex-end',marginBottom:'1.5rem'}}>
              {[['4–7yr',140,'Highway bypass',false],['3–5yr',115,'Energy microgrid',false],['2–4yr',96,'Residential units',false],['2–3yr',80,'Resort lodge',false],['12–18mo',36,'WAVMVMT Center ★',true]].map(([t,h,l,fast])=>(
                <div key={l as string} style={{textAlign:'center',flex:1}}>
                  <div style={{height:140,display:'flex',alignItems:'flex-end',justifyContent:'center',marginBottom:'0.5rem'}}>
                    <div style={{width:'100%',maxWidth:40,height:h as number,background:fast?'var(--gold)':'rgba(240,235,224,0.08)',borderRadius:'2px 2px 0 0'}}/>
                  </div>
                  <div style={{fontSize:'0.7rem',color:fast?'var(--gold)':'#f0ebe0',marginBottom:'0.15rem',lineHeight:1.2}}>{t}</div>
                  <div style={{fontSize:'0.58rem',color:fast?'var(--gold-l)':'rgba(240,235,224,0.28)',lineHeight:1.3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{paddingTop:'1.5rem',borderTop:'1px solid rgba(240,235,224,0.07)',textAlign:'center'}}>
              <span className="serif" style={{fontSize:'0.88rem',color:'var(--gold-l)',display:'block',marginBottom:'0.35rem'}}>Phase 1 monthly cash flow</span>
              <span className="serif" style={{fontSize:'2rem',fontWeight:700,color:'#f0ebe0'}}>$84K – $175K / month</span>
              <div style={{fontSize:'0.68rem',color:'rgba(240,235,224,0.3)',marginTop:'0.3rem'}}>From day one. Before the resort is complete.</div>
            </div>
          </div>
          {/* Jobs + QOZ */}
          <div style={{padding:'1.75rem 2rem',border:'1px solid rgba(42,176,156,0.18)',borderRadius:4,background:'rgba(42,176,156,0.04)',display:'flex',gap:'2rem',flexWrap:'wrap',alignItems:'center'}}>
            <div style={{textAlign:'center',minWidth:120}}>
              <span className="serif" style={{fontSize:'2.5rem',fontWeight:700,color:'var(--teal-l)',display:'block'}}>~25</span>
              <span style={{fontSize:'0.68rem',color:'rgba(240,235,224,0.45)'}}>Permanent local jobs</span>
            </div>
            <div style={{flex:1,minWidth:260}}>
              <div className="tag" style={{marginBottom:'0.5rem',color:'var(--teal-l)'}}>QOZ active business test satisfied</div>
              <p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',lineHeight:1.7}}>Sound practitioners, movement coaches, café staff, youth program coordinators, studio engineers, pottery instructors, co-working support — all local, all permanent. Satisfies the QOZ &quot;substantial improvement&quot; + &quot;active business&quot; requirements. WAVMVMT Center is a civic asset, not just a resort amenity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ENTITY STRUCTURE */}
      <section id="entity" className="pad" style={{background:'#152a17',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">Entity Structure + Tax Position</span>
          <h2 className="h2" style={{marginBottom:'0.75rem'}}>Clean. Compliant.<br/><span className="em">Cross-border ready.</span></h2>
          <p className="body" style={{maxWidth:580,marginBottom:'3rem'}}>Canadian operator, US deals. W-8BEN-E eliminates US withholding. CRA corporate rate 12.2–26.5% vs personal 53.5%. Every entity has a specific function.</p>
          {ENTITY.map((e,i)=>(
            <div key={i} style={{padding:'1.75rem 2rem',border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,marginBottom:'0.75rem',display:'grid',gridTemplateColumns:'1fr 1fr 2fr',gap:'1.5rem',alignItems:'start',transition:'background 0.25s'}} onMouseEnter={e2=>(e2.currentTarget.style.background='rgba(200,151,58,0.03)')} onMouseLeave={e2=>(e2.currentTarget.style.background='transparent')}>
              <div style={{fontSize:'0.82rem',fontWeight:500,color:'#f0ebe0'}}>{e.entity}</div>
              <div style={{fontSize:'0.62rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--gold)',paddingTop:3}}>{e.type}</div>
              <div style={{fontSize:'0.75rem',color:'rgba(240,235,224,0.48)',lineHeight:1.65}}>{e.role}</div>
            </div>
          ))}
          <div style={{marginTop:'2rem',padding:'1.75rem',border:'1px solid rgba(42,176,156,0.15)',borderRadius:4,background:'rgba(42,176,156,0.04)'}}>
            <div style={{fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--teal-l)',marginBottom:'0.75rem'}}>Tax position</div>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
              {[
                ['QOZ gains elimination','10-year hold → 100% elimination on QOZB appreciation (IRC §1400Z-2)'],
                ['Zero US withholding','Canada–US Tax Treaty Art. VII + W-8BEN-E filed with each US payer'],
                ['Canadian corp advantage','12.2–26.5% effective rate vs 53.5% personal'],
              ].map(([t,d])=>(
                <div key={t}>
                  <div style={{fontSize:'0.75rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.3rem'}}>{t}</div>
                  <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.4)',lineHeight:1.6}}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPOUNDING FLYWHEEL */}
      <section className="pad" style={{background:'#07100a',padding:'7rem 2rem',borderTop:'1px solid rgba(240,235,224,0.04)'}}>
        <div className="wrap">
          <span className="tag">The Compounding System</span>
          <h2 className="h2" style={{marginBottom:'1.5rem'}}>Every deal seeds<br/><span className="em">the next one.</span></h2>
          <div className="grid-3" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'2.5rem'}}>
            {[
              ['Deal closes','Advisory fees generated across all pipeline deals'],
              ['WAVMVMT Inc. deploys','Fee income → SBLC pool contribution + operations'],
              ['SBLC pool activates','Pooled instrument enables next family office deployment'],
              ['Next Center funded','Each closing builds the next WAVMVMT Center in the next OZ development'],
            ].map(([t,d],i)=>(
              <div key={i} style={{background:'#07100a',padding:'2rem 1.5rem'}}>
                <span className="serif" style={{fontSize:'1.8rem',fontWeight:700,color:'rgba(200,151,58,0.18)',display:'block',marginBottom:'0.75rem'}}>{`0${i+1}`}</span>
                <div style={{fontSize:'0.82rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.4rem'}}>{t}</div>
                <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.38)',lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <p className="serif" style={{fontSize:'clamp(1rem,2vw,1.4rem)',fontStyle:'italic',color:'rgba(240,235,224,0.8)',lineHeight:1.7,maxWidth:700,margin:'0 auto'}}>&quot;The same person who originated the Clearwater deal is proposing to build its heart. Every WAVMVMT Center that opens seeds the next development. The system compounds with every closing.&quot;</p>
          </div>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="mailto:wavmvmt@gmail.com" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,background:'var(--gold)',color:'#07100a',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',fontWeight:500}}>wavmvmt@gmail.com</a>
            <a href="/clearwater" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>← Vision version</a>
            <a href="/summary" style={{display:'inline-block',padding:'0.9rem 2.25rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.15)',color:'rgba(240,235,224,0.5)',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>One-page summary →</a>
          </div>
        </div>
      </section>
    </div>
  )
}

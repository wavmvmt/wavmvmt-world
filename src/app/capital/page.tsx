'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const CHAPTERS = ['splash','market','competitors','capital','numbers','structure','mission']

const GWI = [
  { num: '$584B', label: 'Global wellness real estate market (2024)', source: 'GWI 2025' },
  { num: '19.5%', label: 'Annual growth — fastest sector in $6.8T wellness economy', source: 'GWI 2025' },
  { num: '10–25%', label: 'Residential price premium for wellness-integrated developments', source: 'GWI + MIT' },
  { num: '$1.1T', label: 'Projected market by 2029 — doubling in 5 years', source: 'GWI 2025' },
  { num: '43M', label: 'Digital nomads worldwide, avg income $124,720/year', source: 'MBO Partners 2025' },
  { num: '$940B', label: 'Annual economic contribution from digital nomads globally', source: '2TicketsAnywhere 2026' },
]

const PROBLEMS = [
  { problem: 'Appian Way has 2 projects ahead of Idaho', solution: 'WAVMVMT Center creates a second institutional capital path through Scot\'s T3 fund — no longer solely dependent on Appian Way\'s timeline.' },
  { problem: 'Family office needs security layer before deploying', solution: 'WAVMVMT Center as energy customer + QOZB gives Scot a mandate-aligned vehicle. His deployment contributes to the 30% capex security requirement via QOZ fund escrow + SBLC.' },
  { problem: 'No revenue until construction completes (years away)', solution: 'Center Phase 1 opens in 12–18 months. $84K–$175K/month from day one — before the resort is built.' },
  { problem: 'Idaho winters kill occupancy and revenue', solution: 'Center operates identically January and July. Year-round programming, year-round income.' },
  { problem: 'Families with teenagers may not extend stays', solution: 'Dedicated teen programming — parkour, music, creative arts. The gap every competitor ignores.' },
  { problem: 'Fractional buyers need year-round lifestyle answer', solution: 'Center answers "what do we do in February?" — the hardest fractional objection, fully solved.' },
  { problem: 'Digital nomads have no reason for long stays', solution: 'Co-working + AI workshops + community = 1–3 month packages. Highest-margin occupancy, highest fractional conversion rate.' },
  { problem: 'Development lacks cultural identity vs Yellowstone Club', solution: 'WAVMVMT Center becomes the soul of Clearwater — the thing that makes people say "this place is different."' },
  { problem: 'No established comparable — hard to sell to buyers', solution: 'First of its kind in North American mountain resort. Clearwater doesn\'t compete with Yellowstone Club — it leads a new category.' },
]

const CAPITAL_STEPS = [
  { step: '01', title: 'WAVMVMT Center signs a Power Purchase Agreement (PPA)', detail: '10–20 year energy purchase contract with the Clearwater microgrid. Creates contracted revenue for the energy system — making the infrastructure bankable independent of Appian Way timeline.', badge: 'Energy anchor', gold: false },
  { step: '02', title: 'WAVMVMT Center qualifies as a QOZB + satisfies Scot\'s T3 fund mandate', detail: 'Youth programming, wellness, education, community infrastructure = humanitarian mandate fulfilled. Scot\'s fund takes 5–20% QOZB equity. Investors get 10-year capital gains elimination. Reportable to Climate Bonds Initiative + NASA.', badge: 'Capital trigger', gold: true },
  { step: '03', title: 'Scot\'s capital flows into QOZ Fund as convertible debt', detail: 'Enters through David Sillaman\'s QOZ fund structure — convertible debt in escrow for ~2 years. Tier 1 SBLC issued against escrowed capital. 30% capex security layer satisfied without drawing capital.', badge: 'Security layer', gold: false },
  { step: '04', title: 'Family office deploys 100% of project capex', detail: 'Security condition met. Deca-billionaire family office commits 100% of project capex as JV equity pari passu. Proof of funds: $5–6B+.', badge: '$5–6B deployed', gold: false },
  { step: '05', title: 'Appian Way funds the remainder', detail: 'Appian Way\'s multi-billion capacity fills remaining requirements. Full capital stack closed. WAVMVMT Center built as cultural and community anchor.', badge: 'Deal closed', gold: false },
]

const STRUCT = [
  { entity: 'WAVMVMT Inc. (Ontario)', type: 'Operating entity', role: 'Receives all advisory and origination fees. Holds music IP. Issues equity to Canadian investors (NI 45-106). Files W-8BEN-E — zero US withholding.' },
  { entity: 'WAVMVMT USA LLC (Delaware)', type: 'US subsidiary', role: 'US operations, film investments, US contracts. Wholly owned by WAVMVMT Inc.' },
  { entity: 'WAVMVMT Fund I LP (Delaware)', type: 'Investment vehicle', role: 'Raises capital under Reg D 506(b). Deploys into QOZ real estate. GP: WAVMVMT Inc. LPs: accredited investors (US + Canadian).' },
  { entity: 'WAVMVMT Center QOZB', type: 'Operating business', role: 'Qualified Opportunity Zone Business inside each development. Energy customer via PPA. Generates revenue. Scot\'s fund equity entry point.' },
]

export default function CapitalPage() {
  const [ch, setCh] = useState(0)
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [openStep, setOpenStep] = useState<number|null>(null)
  const [openProblem, setOpenProblem] = useState<number|null>(null)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])
  const go = useCallback((i: number) => { setCh(Math.max(0,Math.min(CHAPTERS.length-1,i))); setOpenStep(null); setOpenProblem(null) }, [])
  const enter = useCallback(() => { setEntered(true); setCh(1) }, [])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==='ArrowRight'||e.key==='ArrowDown') go(ch+1)
      if (e.key==='ArrowLeft'||e.key==='ArrowUp') go(ch-1)
      if (e.key==='Enter'&&!entered) enter()
    }
    window.addEventListener('keydown',h)
    return () => window.removeEventListener('keydown',h)
  },[ch,entered,enter,go])

  return (
    <div style={{fontFamily:'var(--font-dm-sans,DM Sans,system-ui,sans-serif)',background:'#07100a',color:'#f0ebe0',height:'100dvh',overflow:'hidden',position:'relative'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .ch{position:absolute;inset:0;transition:opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1);overflow-y:auto}
        .ch.on{opacity:1;transform:translateY(0);pointer-events:all;z-index:10}
        .ch.up{opacity:0;transform:translateY(-28px);pointer-events:none;z-index:5}
        .ch.dn{opacity:0;transform:translateY(28px);pointer-events:none;z-index:5}
        .serif{font-family:'Playfair Display',Georgia,serif!important}
        .grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.35;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")}
        .corner{position:absolute;width:12px;height:12px;border-color:rgba(196,154,58,0.3);border-style:solid}
        .tl{top:18px;left:18px;border-width:1px 0 0 1px}.tr{top:18px;right:18px;border-width:1px 1px 0 0}
        .bl{bottom:18px;left:18px;border-width:0 0 1px 1px}.br{bottom:18px;right:18px;border-width:0 1px 1px 0}
        .tag{font-size:0.58rem;letter-spacing:0.28em;text-transform:uppercase;color:#c8973a;display:block;margin-bottom:1.2rem}
        .hxl{font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.4rem,6vw,5.5rem);font-weight:700;line-height:1.05}
        .hlg{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.8rem,4vw,3.2rem);font-weight:700;line-height:1.1}
        .em{font-style:italic;font-weight:400;color:#e0b55a}
        .body{font-size:0.88rem;color:rgba(240,235,224,0.58);line-height:1.85}
        .nb{position:sticky;bottom:0;padding:1.1rem 2rem;background:rgba(7,16,10,0.92);backdrop-filter:blur(12px);border-top:1px solid rgba(240,235,224,0.07);display:flex;justify-content:space-between;align-items:center;z-index:50}
        .btn{background:none;border:1px solid rgba(240,235,224,0.14);color:rgba(240,235,224,0.45);font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.5rem 1.1rem;border-radius:100px;cursor:pointer;transition:all 0.2s;font-family:inherit}
        .btn:hover{border-color:#c8973a;color:#c8973a}
        .btn.p{background:#c8973a;color:#07100a;border-color:#c8973a;font-weight:500}
        .btn.p:hover{background:#e0b55a}
        .acc{padding:1.25rem 1.75rem;border:1px solid rgba(240,235,224,0.07);border-radius:4px;margin-bottom:0.5rem;cursor:pointer;transition:background 0.25s}
        .acc:hover,.acc.open{background:rgba(196,154,58,0.05);border-color:rgba(196,154,58,0.18)}
        .acc.key{border-color:rgba(196,154,58,0.22);background:rgba(196,154,58,0.04)}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(196,154,58,0.25);border-radius:2px}
      `}</style>
      <div className="grain"/>
      <div className="corner tl"/><div className="corner tr"/>
      <div className="corner bl"/><div className="corner br"/>

      {/* Nav dots */}
      {entered && (
        <div style={{position:'fixed',right:24,top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',gap:9,zIndex:200}}>
          {CHAPTERS.slice(1).map((_,i) => (
            <button key={i} onClick={()=>go(i+1)} style={{width:6,height:6,borderRadius:'50%',border:'none',cursor:'pointer',padding:0,background:ch===i+1?'#c8973a':'rgba(240,235,224,0.18)',transition:'all 0.3s',transform:ch===i+1?'scale(1.5)':'scale(1)'}}/>
          ))}
        </div>
      )}

      {/* SPLASH */}
      <div className={`ch ${ch===0?'on':'up'}`} style={{overflow:'hidden'}}>
        <video src="https://assets.mixkit.co/videos/3338/3338-720.mp4" poster="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920" autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(7,16,10,0.6) 0%,rgba(7,16,10,0.2) 40%,rgba(7,16,10,0.85) 80%,#07100a 100%)'}}/>
        <div style={{position:'relative',zIndex:2,height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem',opacity:visible?1:0,transition:'opacity 1.5s'}}>
          <p className="tag" style={{opacity:visible?1:0,transform:visible?'none':'translateY(10px)',transition:'all 0.8s 0.4s'}}>WAVMVMT Center at Clearwater · Capital & Structure Overview · March 2026</p>
          <h1 className="hxl serif" style={{marginBottom:'1.5rem',maxWidth:800,opacity:visible?1:0,transform:visible?'none':'translateY(20px)',transition:'all 1.1s 0.7s'}}>
            The Investment<br/>Case for <span className="em">WAVMVMT Center</span>
          </h1>
          <p className="body" style={{maxWidth:520,marginBottom:'3rem',opacity:visible?1:0,transition:'all 0.9s 1s'}}>Market data. Capital structure. Competitive positioning. How WAVMVMT Center unlocks the Clearwater capital stack and generates returns across every stakeholder.</p>
          <button onClick={enter} style={{background:'none',border:'none',cursor:'pointer',padding:'0.5rem',opacity:visible?1:0,transition:'opacity 0.8s 1.5s'}}>
            <span className="serif" style={{fontSize:'clamp(1rem,2vw,1.5rem)',fontStyle:'italic',color:'#f0ebe0',borderBottom:'1px solid rgba(196,154,58,0.4)',paddingBottom:3}}>View the Case →</span>
          </button>
          <p style={{position:'absolute',bottom:36,fontSize:'0.56rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'rgba(240,235,224,0.28)'}}>Confidential — For authorized recipients only</p>
        </div>
      </div>

      {/* MARKET DATA */}
      <div className={`ch ${ch===1?'on':ch<1?'dn':'up'}`}>
        <div style={{minHeight:'100dvh',background:'#07100a',padding:'5rem 2rem'}}>
          <div style={{maxWidth:1080,margin:'0 auto'}}>
            <span className="tag">The Market</span>
            <h2 className="hlg" style={{marginBottom:'0.75rem'}}>Wellness real estate is the fastest<br/><span className="em">growing sector in the global economy.</span></h2>
            <p className="body" style={{maxWidth:580,marginBottom:'3rem'}}>These numbers are from the Global Wellness Institute — the world&apos;s leading research authority. Published June 2025.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'3rem'}}>
              {GWI.map(s=>(
                <div key={s.num} style={{background:'#07100a',padding:'2.5rem 2rem',transition:'background 0.3s'}} onMouseEnter={e=>(e.currentTarget.style.background='#0d1a0f')} onMouseLeave={e=>(e.currentTarget.style.background='#07100a')}>
                  <span className="serif" style={{fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:700,color:'#e0b55a',display:'block',marginBottom:'0.4rem'}}>{s.num}</span>
                  <div style={{fontSize:'0.73rem',color:'rgba(240,235,224,0.52)',lineHeight:1.6,marginBottom:'0.4rem'}}>{s.label}</div>
                  <div style={{fontSize:'0.55rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(240,235,224,0.2)'}}>{s.source}</div>
                </div>
              ))}
            </div>
            <div style={{padding:'2rem',background:'rgba(196,154,58,0.04)',border:'1px solid rgba(196,154,58,0.15)',borderRadius:4}}>
              <p className="serif" style={{fontSize:'1.1rem',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>
                &quot;At Clearwater&apos;s $2B residential target, a 10% wellness premium = <strong style={{fontWeight:700,fontStyle:'normal'}}>$200M additional value.</strong> At 25% = <strong style={{fontWeight:700,fontStyle:'normal'}}>$500M.</strong> WAVMVMT Center is what creates that premium.&quot;
              </p>
            </div>
          </div>
        </div>
        <NavB ch={ch} total={CHAPTERS.length} prev={()=>go(ch-1)} next={()=>go(ch+1)}/>
      </div>

      {/* COMPETITIVE GAP */}
      <div className={`ch ${ch===2?'on':ch<2?'dn':'up'}`}>
        <div style={{minHeight:'100dvh',background:'#0d1a0f',padding:'5rem 2rem'}}>
          <div style={{maxWidth:1080,margin:'0 auto'}}>
            <span className="tag">Competitive Positioning</span>
            <h2 className="hlg" style={{marginBottom:'0.75rem'}}>No mountain resort in North America<br/><span className="em">offers this combination.</span></h2>
            <p className="body" style={{maxWidth:600,marginBottom:'2.5rem'}}>Verified against publicly documented amenities for Yellowstone Club, Montage Big Sky, and Brush Creek Ranch.</p>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'separate',borderSpacing:'1px',fontSize:'0.73rem'}}>
                <thead><tr>
                  <th style={{textAlign:'left',padding:'0.7rem 1rem',fontSize:'0.58rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(240,235,224,0.28)',background:'#07100a'}}>Feature</th>
                  {[['Yellowstone Club',''],['Montage Big Sky',''],['Brush Creek Ranch',''],['Clearwater + WAVMVMT','gold']].map(([n,c])=>(
                    <th key={n} style={{textAlign:'center',padding:'0.7rem 0.75rem',fontSize:'0.6rem',letterSpacing:'0.07em',color:c==='gold'?'#c8973a':'rgba(240,235,224,0.38)',background:c==='gold'?'rgba(196,154,58,0.06)':'#07100a',whiteSpace:'nowrap'}}>{n}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    ['Ski + outdoor recreation',true,true,true,true],
                    ['Fine dining + basic spa',true,true,true,true],
                    ['Year-round indoor programming',false,false,false,true],
                    ['Professional music studio',false,false,false,true],
                    ['Sound bath / healing space',false,false,false,true],
                    ['Parkour + movement gym',false,false,false,true],
                    ['Pottery + glass blowing',false,false,false,true],
                    ['Professional co-working',false,false,false,true],
                    ['Dedicated teen programming',false,false,false,true],
                    ['Digital nomad infrastructure',false,false,false,true],
                    ['AI workshops + education',false,false,false,true],
                    ['Outdoor amphitheatre events',false,false,false,true],
                    ['Energy customer (PPA)',false,false,false,true],
                    ['QOZB-qualified impact asset',false,false,false,true],
                  ].map((row,i)=>(
                    <tr key={i}>
                      <td style={{padding:'0.55rem 1rem',color:'rgba(240,235,224,0.58)',background:'#090f0a'}}>{row[0]}</td>
                      {[row[1],row[2],row[3],row[4]].map((v,j)=>(
                        <td key={j} style={{textAlign:'center',padding:'0.55rem 0.75rem',background:j===3?'rgba(196,154,58,0.03)':'#090f0a'}}>
                          <span style={{display:'inline-block',width:17,height:17,borderRadius:'50%',textAlign:'center',lineHeight:'17px',fontSize:'0.6rem',fontWeight:700,background:v?(j===3?'rgba(196,154,58,0.15)':'rgba(42,176,156,0.12)'):'rgba(240,235,224,0.04)',color:v?(j===3?'#c8973a':'#42b09c'):'rgba(240,235,224,0.18)',border:`1px solid ${v?(j===3?'rgba(196,154,58,0.25)':'rgba(42,176,156,0.2)'):'rgba(240,235,224,0.08)'}`}}>
                            {v?'✓':'✕'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <NavB ch={ch} total={CHAPTERS.length} prev={()=>go(ch-1)} next={()=>go(ch+1)}/>
      </div>

      {/* CAPITAL STACK */}
      <div className={`ch ${ch===3?'on':ch<3?'dn':'up'}`}>
        <div style={{minHeight:'100dvh',background:'#07100a',padding:'5rem 2rem'}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <span className="tag">The Capital Unlock</span>
            <h2 className="hlg" style={{marginBottom:'0.75rem'}}>How WAVMVMT Center<br/><span className="em">activates the full capital stack.</span></h2>
            <p className="body" style={{maxWidth:580,marginBottom:'2rem'}}>Click each step to expand. The mechanism is sequential — each step enables the next.</p>
            {CAPITAL_STEPS.map((s,i)=>(
              <div key={i} className={`acc ${s.gold?'key':''} ${openStep===i?'open':''}`} onClick={()=>setOpenStep(openStep===i?null:i)}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                    <span className="serif" style={{fontSize:'0.8rem',color:s.gold?'#c8973a':'rgba(240,235,224,0.25)',fontStyle:'italic',minWidth:'2rem'}}>{s.step}</span>
                    <span style={{fontSize:'0.86rem',fontWeight:500,color:'#f0ebe0'}}>{s.title}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
                    <span style={{fontSize:'0.57rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',borderRadius:20,background:s.gold?'rgba(196,154,58,0.12)':'rgba(240,235,224,0.05)',color:s.gold?'#c8973a':'rgba(240,235,224,0.3)',border:`1px solid ${s.gold?'rgba(196,154,58,0.2)':'rgba(240,235,224,0.08)'}`}}>{s.badge}</span>
                    <span style={{color:'rgba(240,235,224,0.25)',fontSize:'0.75rem'}}>{openStep===i?'−':'+'}</span>
                  </div>
                </div>
                {openStep===i&&<p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.52)',lineHeight:1.75,marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid rgba(240,235,224,0.07)'}}>{s.detail}</p>}
              </div>
            ))}
            <div style={{marginTop:'1.5rem',padding:'1.75rem',border:'1px solid rgba(196,154,58,0.18)',borderRadius:4,background:'rgba(196,154,58,0.04)'}}>
              <p className="serif" style={{fontSize:'0.95rem',fontStyle:'italic',color:'#f0ebe0',lineHeight:1.7}}>
                &quot;Without WAVMVMT Center, the deal depends entirely on Appian Way&apos;s timeline — and they have two projects ahead of Idaho. With it, a second institutional capital path exists through Scot&apos;s T3 fund. <strong style={{fontWeight:700,fontStyle:'normal'}}>The Center doesn&apos;t just add value. It de-risks the capital stack.&quot;</strong>
              </p>
            </div>
          </div>
        </div>
        <NavB ch={ch} total={CHAPTERS.length} prev={()=>go(ch-1)} next={()=>go(ch+1)}/>
      </div>

      {/* NUMBERS */}
      <div className={`ch ${ch===4?'on':ch<4?'dn':'up'}`}>
        <div style={{minHeight:'100dvh',background:'#0d1a0f',padding:'5rem 2rem'}}>
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <span className="tag">The Business Case</span>
            <h2 className="hlg" style={{marginBottom:'0.75rem'}}>9 problems solved.<br/><span className="em">Revenue from month one.</span></h2>
            <p className="body" style={{maxWidth:560,marginBottom:'2.5rem'}}>Each of the following is a real development problem WAVMVMT Center directly solves. Click to expand.</p>
            {PROBLEMS.map((p,i)=>(
              <div key={i} style={{padding:'1rem 1.5rem',border:'1px solid rgba(240,235,224,0.06)',borderRadius:4,marginBottom:'0.4rem',cursor:'pointer',transition:'background 0.25s',background:openProblem===i?'rgba(196,154,58,0.04)':'transparent'}}
                onClick={()=>setOpenProblem(openProblem===i?null:i)}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                    <span style={{fontSize:'0.6rem',color:'rgba(224,74,74,0.5)',fontStyle:'italic'}}>Problem</span>
                    <span style={{fontSize:'0.83rem',color:'#f0ebe0'}}>{p.problem}</span>
                  </div>
                  <span style={{color:'rgba(240,235,224,0.25)',fontSize:'0.75rem',flexShrink:0}}>{openProblem===i?'−':'+'}</span>
                </div>
                {openProblem===i&&(
                  <div style={{marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(240,235,224,0.06)',display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
                    <span style={{fontSize:'0.6rem',color:'#42b09c',fontStyle:'italic',flexShrink:0,marginTop:2}}>Solved</span>
                    <p style={{fontSize:'0.78rem',color:'rgba(240,235,224,0.55)',lineHeight:1.7}}>{p.solution}</p>
                  </div>
                )}
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginTop:'2rem'}}>
              {[['12–18 mo','Phase 1 open before the resort'],['$175K/mo','Phase 1 peak monthly cash flow'],['$4.3M/yr','Annual revenue at full build']].map(([n,l])=>(
                <div key={n} style={{background:'#0d1a0f',padding:'2rem',textAlign:'center'}}>
                  <span className="serif" style={{fontSize:'clamp(1.5rem,3vw,2.4rem)',fontWeight:700,color:'#e0b55a',display:'block',marginBottom:'0.4rem'}}>{n}</span>
                  <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.38)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <NavB ch={ch} total={CHAPTERS.length} prev={()=>go(ch-1)} next={()=>go(ch+1)}/>
      </div>

      {/* ENTITY STRUCTURE */}
      <div className={`ch ${ch===5?'on':ch<5?'dn':'up'}`}>
        <div style={{minHeight:'100dvh',background:'#07100a',padding:'5rem 2rem'}}>
          <div style={{maxWidth:960,margin:'0 auto'}}>
            <span className="tag">Entity Structure</span>
            <h2 className="hlg" style={{marginBottom:'0.75rem'}}>Clean, compliant,<br/><span className="em">cross-border ready.</span></h2>
            <p className="body" style={{maxWidth:580,marginBottom:'3rem'}}>Canadian operator, US deals. W-8BEN-E eliminates US withholding. CRA corporate rate 12.2–26.5% vs personal 53.5%. Every entity has a specific function.</p>
            {STRUCT.map((s,i)=>(
              <div key={i} style={{padding:'1.75rem 2rem',border:'1px solid rgba(240,235,224,0.07)',borderRadius:4,marginBottom:'0.75rem',display:'grid',gridTemplateColumns:'1fr 1fr 2fr',gap:'1.5rem',alignItems:'start',transition:'background 0.25s'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(196,154,58,0.03)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <div>
                  <div style={{fontSize:'0.82rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.25rem'}}>{s.entity}</div>
                </div>
                <div style={{fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'#c8973a',paddingTop:3}}>{s.type}</div>
                <div style={{fontSize:'0.75rem',color:'rgba(240,235,224,0.48)',lineHeight:1.65}}>{s.role}</div>
              </div>
            ))}
            <div style={{marginTop:'2rem',padding:'1.75rem',border:'1px solid rgba(42,176,156,0.15)',borderRadius:4,background:'rgba(42,176,156,0.04)'}}>
              <div style={{fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:'#42b09c',marginBottom:'0.75rem'}}>Tax position</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1.5rem'}}>
                {[['QOZ capital gains elimination','10-year hold → 100% elimination on QOZB appreciation (IRC §1400Z-2)'],['Zero US withholding','Canada–US Tax Treaty Art. VII + W-8BEN-E filed with each US payer'],['Canadian corp advantage','12.2–26.5% effective rate vs 53.5% personal — saving ~$4.2M on $12.5M fee']].map(([t,d])=>(
                  <div key={t}>
                    <div style={{fontSize:'0.72rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.3rem'}}>{t}</div>
                    <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.4)',lineHeight:1.6}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <NavB ch={ch} total={CHAPTERS.length} prev={()=>go(ch-1)} next={()=>go(ch+1)}/>
      </div>

      {/* MISSION / CLOSE */}
      <div className={`ch ${ch===6?'on':ch<6?'dn':'up'}`}>
        <div style={{minHeight:'100dvh',background:'#0d1a0f',padding:'5rem 2rem',display:'flex',alignItems:'center'}}>
          <div style={{maxWidth:860,margin:'0 auto',width:'100%'}}>
            <span className="tag" style={{textAlign:'center',display:'block'}}>The Compounding System</span>
            <h2 className="hlg" style={{textAlign:'center',marginBottom:'1.5rem'}}>Every deal seeds<br/><span className="em">the next one.</span></h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'rgba(240,235,224,0.05)',border:'1px solid rgba(240,235,224,0.05)',borderRadius:4,overflow:'hidden',marginBottom:'2.5rem'}}>
              {[['Deal closes','Advisory fee generated across all pipeline deals'],['WAVMVMT Inc. deploys','40% artist dev expenses / 30% Fund I / 15% SBLC pool / 15% ops'],['SBLC pool activates','Nick + Sarah + Shim pool enables institutional capital deployment'],['Next Center funded','Each closing builds the next WAVMVMT Center in the next OZ development']].map(([t,d],i)=>(
                <div key={i} style={{background:'#0d1a0f',padding:'2rem 1.5rem'}}>
                  <span className="serif" style={{fontSize:'1.8rem',fontWeight:700,color:'rgba(196,154,58,0.2)',display:'block',marginBottom:'0.75rem'}}>{`0${i+1}`}</span>
                  <div style={{fontSize:'0.82rem',fontWeight:500,color:'#f0ebe0',marginBottom:'0.4rem'}}>{t}</div>
                  <div style={{fontSize:'0.7rem',color:'rgba(240,235,224,0.38)',lineHeight:1.6}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
              <p className="serif" style={{fontSize:'clamp(1rem,2vw,1.4rem)',fontStyle:'italic',color:'rgba(240,235,224,0.8)',lineHeight:1.7,maxWidth:700,margin:'0 auto'}}>
                &quot;The same person who originated the Clearwater deal is proposing to build its heart. Every WAVMVMT Center that opens seeds the next development. The system compounds with every closing.&quot;
              </p>
            </div>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>
              <a href="mailto:wavmvmt@gmail.com" style={{display:'inline-block',padding:'0.85rem 2rem',borderRadius:100,background:'#c8973a',color:'#07100a',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',fontWeight:500}}>wavmvmt@gmail.com</a>
              <a href="/clearwater" style={{display:'inline-block',padding:'0.85rem 2rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.14)',color:'rgba(240,235,224,0.5)',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>← Vision version</a>
              <a href="https://wavmvmt-world.vercel.app/world" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'0.85rem 2rem',borderRadius:100,border:'1px solid rgba(240,235,224,0.14)',color:'rgba(240,235,224,0.5)',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none'}}>3D World →</a>
            </div>
          </div>
        </div>
        <NavB ch={ch} total={CHAPTERS.length} prev={()=>go(ch-1)} next={()=>go(ch+1)} isLast/>
      </div>
    </div>
  )
}

function NavB({ch,total,prev,next,isLast=false}:{ch:number,total:number,prev:()=>void,next:()=>void,isLast?:boolean}) {
  return (
    <div className="nb">
      <button onClick={prev} className="btn">← Previous</button>
      <span style={{fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(240,235,224,0.22)'}}>{ch} / {total-1}</span>
      {!isLast?<button onClick={next} className="btn p">Continue →</button>:<a href="mailto:wavmvmt@gmail.com" className="btn p" style={{textDecoration:'none'}}>Get in touch →</a>}
    </div>
  )
}

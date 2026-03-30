'use client'

export default function SummaryPage() {
  return (
    <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, system-ui, sans-serif)', background: '#f0ebe0', color: '#07100a', minHeight: '100dvh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --gold: #c8973a; --teal: #2d8a78; --ink: #07100a; }
        .serif { font-family: 'Playfair Display', Georgia, serif !important; }
        body { background: #f0ebe0; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr !important; }
          .page { padding: 3rem 1.5rem !important; }
        }
      `}</style>

      <div className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '2px solid #07100a' }}>
          <div>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
              WAVMVMT Center at Clearwater · Idaho · Executive Summary
            </div>
            <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, lineHeight: 1.1, color: '#07100a' }}>
              WAVMVMT Center<br /><span style={{ fontStyle: 'italic', fontWeight: 400 }}>× Clearwater, Idaho</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(7,16,10,0.4)', marginBottom: '0.25rem' }}>Proposal by</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#07100a' }}>Saadiq Khan (shim.wav)</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(7,16,10,0.45)' }}>WAVMVMT · March 2026</div>
          </div>
        </div>

        {/* One-line thesis */}
        <div style={{ background: '#07100a', color: '#f0ebe0', borderRadius: 4, padding: '2rem 2.5rem', marginBottom: '2.5rem' }}>
          <p className="serif" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontStyle: 'italic', lineHeight: 1.65 }}>
            WAVMVMT Center is the cultural and community infrastructure that unlocks the Clearwater capital stack, solves the winter revenue problem, activates Scot Bryson&apos;s T3 fund mandate, and creates a year-round destination that no mountain resort in North America currently offers.
          </p>
        </div>

        {/* 5 key points */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>Five things to know</div>
          {[
            {
              n: '01',
              title: 'It opens first — and generates revenue before the resort does',
              body: 'Phase 1 (9 core spaces) opens in 12–18 months — before the lodge, before the residential build. Monthly cash flow from day one: $84K–$175K across sound bath sessions, movement gym memberships, music studio bookings, nomad packages, pottery classes, podcast room rentals, café, and practitioner desk rentals.',
            },
            {
              n: '02',
              title: 'It unlocks Scot Bryson\'s T3 fund — the second institutional path',
              body: 'Without WAVMVMT Center, this deal depends entirely on Appian Way\'s timeline (two projects ahead of Idaho). With it, WAVMVMT qualifies as a QOZB through youth programming, wellness, and education — satisfying Scot\'s humanitarian reinvestment mandate. His fund takes 5–20% QOZB equity. That capital, escrowed, backs the SBLC that satisfies the family office security requirement and closes the full $20.86B stack.',
            },
            {
              n: '03',
              title: 'It solves an $87M/year problem already in the pro forma',
              body: 'Idaho winters reduce outdoor amenity for ~6 months. At 2,000 hotel units × $500 ADR × 60% occupancy, an estimated ~$87M/year in hotel revenue is unrealized during the off-season. WAVMVMT Center operates identically in January and July. It is the only proposed line in the development that does not require snow.',
            },
            {
              n: '04',
              title: 'It adds $720M–$1.8B in residential value — calculated from the actual pro forma',
              body: 'The Global Wellness Institute documents a 10–25% residential price premium for wellness-integrated developments. Applied to the pro forma\'s $7.2B residential sales line: a 10% premium adds $720M. A 25% premium adds $1.8B. WAVMVMT Center is the specific infrastructure that creates and sustains that premium.',
            },
            {
              n: '05',
              title: 'It\'s already being built — twice',
              body: 'This is not a future vision. WAVMVMT already runs outdoor sound healing events and community programming. Simultaneously, Madizon (Saadiq\'s partner) is building Espiral — a pottery studio and free art school in Guatemala — applying the identical model in a different community. Two WAVMVMT Centers being built at the same time, on two continents.',
            },
          ].map((p) => (
            <div key={p.n} style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(7,16,10,0.1)', alignItems: 'flex-start' }}>
              <span className="serif" style={{ fontSize: '1.1rem', color: 'rgba(7,16,10,0.2)', fontStyle: 'italic', minWidth: '2rem', flexShrink: 0, marginTop: 3 }}>{p.n}</span>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#07100a', marginBottom: '0.35rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(7,16,10,0.58)', lineHeight: 1.75 }}>{p.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Capital mechanism — one paragraph */}
        <div style={{ background: 'rgba(7,16,10,0.04)', border: '1px solid rgba(7,16,10,0.12)', borderRadius: 4, padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>The capital mechanism — in one paragraph</div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(7,16,10,0.7)', lineHeight: 1.85 }}>
            WAVMVMT Center signs a Power Purchase Agreement with the Clearwater microgrid — making it a bankable contracted energy customer. This qualifies it as a Qualified Opportunity Zone Business (QOZB), which satisfies Scot Bryson&apos;s T3 fund&apos;s humanitarian reinvestment mandate. His fund takes 5–20% QOZB equity, deploying capital into David Sillaman&apos;s QOZ fund structure as convertible debt in escrow. A Tier 1 SBLC is issued against that escrowed capital, covering ~30% of total capex — the security condition the family office requires before deploying 100% of project capex as JV equity. Appian Way funds the remainder. Total pro forma scope of <strong style={{ fontWeight: 600 }}>$20.86B</strong> fully funded. WAVMVMT Center is not an amenity add-on. It is the instrument that completes the capital stack.
          </p>
        </div>

        {/* Numbers grid */}
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(7,16,10,0.1)', border: '1px solid rgba(7,16,10,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: '2.5rem' }}>
          {[
            { n: '$20.86B', l: 'Total pro forma scope', s: 'Existing revenues + remaining sales' },
            { n: '+$720M–$1.8B', l: 'Residential value uplift', s: 'GWI 10–25% wellness premium on $7.2B residential line' },
            { n: '+$33M/yr', l: 'Hotel ADR revenue uplift', s: '2,000 units × $75 ADR premium × 60% occ × 365 days' },
            { n: '$84K–$175K/mo', l: 'Center Phase 1 revenue', s: '9 streams from day one — before the resort is complete' },
            { n: '~$87M/yr', l: 'Winter revenue gap solved', s: 'Estimated unrealized hotel revenue during 6-month off-season' },
            { n: '~25', l: 'Permanent local jobs created', s: 'Phase 1 — satisfies QOZ active business test' },
          ].map(s => (
            <div key={s.n} style={{ background: '#f0ebe0', padding: '1.75rem' }}>
              <span className="serif" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#07100a', display: 'block', marginBottom: '0.25rem' }}>{s.n}</span>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(7,16,10,0.7)', marginBottom: '0.2rem' }}>{s.l}</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(7,16,10,0.38)' }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Phase 1 spaces */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Phase 1 spaces — open in 12–18 months</div>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              ['Sound Bath Studio', 'Sound + Healing'],
              ['Parkour + Movement Gym', 'Movement'],
              ['Yoga + Meditation Studio', 'Mind + Body'],
              ['Recovery Suite', 'Wellness'],
              ['Music Production Studio', 'Creative'],
              ['Podcast Room', 'Media'],
              ['Pottery Studio', 'Creative'],
              ['Co-Working + AI Hub', 'Knowledge'],
              ['Café + Dog Park', 'Community'],
            ].map(([name, cat]) => (
              <div key={name} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(7,16,10,0.07)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#07100a' }}>{name}</span>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(7,16,10,0.35)', marginLeft: 'auto', flexShrink: 0 }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The arrangement */}
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ border: '1px solid rgba(45,138,120,0.35)', borderRadius: 4, padding: '1.5rem', background: 'rgba(45,138,120,0.04)' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.75rem' }}>What I bring</div>
            {['Full-time Center operations — day one', 'Deal origination + capital network (ongoing)', 'Marketing, content, film documentation', 'Creative direction across all programming', 'No salary required from the development'].map(t => (
              <div key={t} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, marginTop: 4 }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(7,16,10,0.65)' }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid rgba(200,151,58,0.35)', borderRadius: 4, padding: '1.5rem', background: 'rgba(200,151,58,0.04)' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>What I need</div>
            {['A home with outdoor space for my dog Apollo', 'Operational freedom to run the Center well', 'Partnership — not employment', 'Trust'].map(t => (
              <div key={t} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: 4 }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(7,16,10,0.65)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next 5 actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>If you say yes — first five actions</div>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            <div style={{ position: 'absolute', left: '0.4rem', top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--gold) 0%, var(--teal) 100%)' }} />
            {[
              ['48 hours', 'Intro call between Vince, Shim, and David Sillaman — QOZ fund structure briefing'],
              ['Week 1', 'Power Purchase Agreement letter of intent drafted — WAVMVMT Center as contracted energy customer'],
              ['Week 2–3', 'Scot Bryson NDA signed — deck delivered — T3 fund mandate conversation begins'],
              ['Month 1–2', 'Scot\'s T3 fund term sheet issued for WAVMVMT QOZB equity — QOZ fund legal engagement starts'],
              ['Month 3–4', 'SBLC issued against escrowed QOZ capital — family office security condition satisfied — LOI issued'],
            ].map(([t, b], i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: '1.25rem' }}>
                <div style={{ position: 'absolute', left: '-1.6rem', top: '0.35rem', width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', border: '2px solid #f0ebe0' }} />
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', display: 'block', marginBottom: '0.2rem' }}>{t}</span>
                <p style={{ fontSize: '0.8rem', color: 'rgba(7,16,10,0.68)', lineHeight: 1.6 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ borderTop: '2px solid #07100a', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#07100a', marginBottom: '0.2rem' }}>Saadiq Khan (shim.wav)</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(7,16,10,0.45)' }}>wavmvmt@gmail.com · WAVMVMT</div>
          </div>
          <div className="no-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/clearwater" style={{ display: 'inline-block', padding: '0.75rem 1.75rem', borderRadius: 100, background: '#07100a', color: '#f0ebe0', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}>Full vision →</a>
            <a href="/capital" style={{ display: 'inline-block', padding: '0.75rem 1.75rem', borderRadius: 100, border: '1px solid rgba(7,16,10,0.2)', color: 'rgba(7,16,10,0.55)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Capital version →</a>
            <a href="mailto:wavmvmt@gmail.com" style={{ display: 'inline-block', padding: '0.75rem 1.75rem', borderRadius: 100, background: 'var(--gold)', color: '#07100a', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}>Get in touch →</a>
          </div>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.07em', color: 'rgba(7,16,10,0.28)', width: '100%', textAlign: 'right' }}>Confidential — For authorized recipients only · March 2026</div>
        </div>

      </div>
    </div>
  )
}

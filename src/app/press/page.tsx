import Link from 'next/link'
import { PageNav } from '@/components/PageNav'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

export default function PressPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Press Kit
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,200,150,0.3)' }}>
            Media Resources
          </p>
        </div>

        {/* One-liner */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(240,198,116,0.4)' }}>
            One-Liner
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,220,180,0.6)' }}>
            WAVMVMT is building a $100M+ wellness, fitness, music, technology, and education
            campus in Toronto — and you can walk through the construction site in 3D right now.
          </p>
        </section>

        {/* Short bio */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Short Description (50 words)
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,220,180,0.6)' }}>
            WAVMVMT is a global wellness ecosystem combining parkour gyms, sound baths,
            music studios, recovery suites, education wings, and community spaces under one roof.
            Founded by Saadiq Khan (Shim) in Toronto, the project features a 3D walkable
            construction site, synesthesia music visualizer, and $100M+ development vision.
          </p>
        </section>

        {/* Founder bio */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Founder Bio
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,220,180,0.6)' }}>
            Saadiq Khan (Shim) is a Toronto-based artist, ecosystem builder, and systems
            architect. A former nursing student turned parkour practitioner turned music
            producer, he brings a multidisciplinary approach to building spaces where
            wellness, creativity, and technology converge. He also serves as VP of
            Origination at SET Ventures and Creative Director for Contraband Beauty.
          </p>
        </section>

        {/* Key facts */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Key Facts
          </div>
          <div className="space-y-2">
            {[
              { label: 'Project', value: 'WAVMVMT World' },
              { label: 'Type', value: 'Wellness, Fitness, Music, Tech & Education Campus' },
              { label: 'Location', value: 'Toronto, ON, Canada' },
              { label: 'Total Vision', value: '$100M+ across 3 phases' },
              { label: 'Phase 1', value: '$35M — 46,500 sqft wellness center, 13+ rooms' },
              { label: 'Phase 2', value: '$46M — Residential condos + practitioner offices' },
              { label: 'Phase 3', value: '$21M — Outdoor campus, retractable-roof field, skatepark' },
              { label: 'Founder', value: 'Saadiq Khan (Shim)' },
              { label: 'Founded', value: '2024, Toronto' },
              { label: 'Website', value: 'wavmvmt-world.vercel.app' },
              { label: 'Contact', value: 'wavmvmt@gmail.com' },
              { label: 'Built With', value: 'Claude (Anthropic) + Arc.wav' },
            ].map((fact) => (
              <div key={fact.label} className="flex justify-between items-baseline">
                <span className="text-[0.55rem] font-bold" style={{ color: 'rgba(255,220,180,0.4)' }}>{fact.label}</span>
                <span className="text-[0.55rem] text-right" style={{ color: 'rgba(255,220,180,0.55)' }}>{fact.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Story angles */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Story Angles
          </div>
          <div className="space-y-3">
            {[
              { angle: 'The 3D Pitch Deck', desc: 'How a Toronto founder built a walkable 3D construction site as his investor pitch — and it went viral.' },
              { angle: 'AI-Powered Development', desc: 'Built entirely with Claude AI in overnight coding sessions — 168+ commits, 20K lines of code, 13 pages in one night.' },
              { angle: 'Synesthesia Visualizer', desc: 'A frequency-to-color music visualizer that maps sound to the body — patent-pending somatic visualization technology.' },
              { angle: 'The $100M+ Vision', desc: 'From nursing school dropout to building a global wellness ecosystem — condos, parkour gyms, and sound baths under one roof.' },
              { angle: 'Build in Public', desc: 'Inspired by stagehand work at Rogers Centre — making the construction process itself part of the experience.' },
            ].map((s) => (
              <div key={s.angle}>
                <div className="text-xs font-bold mb-0.5" style={{ color: '#f0c674' }}>{s.angle}</div>
                <p className="text-[0.55rem]" style={{ color: 'rgba(255,220,180,0.35)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assets */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Media Assets
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Vision Gallery (25 renders)', href: '/gallery' },
              { label: 'Founder Story', href: '/founder' },
              { label: 'Business Overview', href: '/pitch' },
              { label: 'Synesthesia Visualizer', href: '/visualizer' },
              { label: '3D Construction Site', href: '/world' },
              { label: 'Financial Projections', href: '/projections' },
            ].map((asset) => (
              <Link key={asset.label} href={asset.href}
                className="px-3 py-2 rounded-lg text-[0.55rem] text-center transition-all"
                style={{ background: 'rgba(240,198,116,0.04)', border: '1px solid rgba(240,198,116,0.08)', color: 'rgba(255,220,180,0.4)', textDecoration: 'none' }}>
                {asset.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* Contact for press */}
        <section className="p-5 md:p-6 text-center" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Press Contact
          </div>
          <div className="text-sm font-mono" style={{ color: '#f0c674' }}>wavmvmt@gmail.com</div>
          <div className="flex justify-center gap-3 mt-3">
            {[
              { label: 'Instagram', href: 'https://instagram.com/shim.wav' },
              { label: 'Twitter/X', href: 'https://x.com/shimwav' },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-[0.5rem] px-3 py-1 rounded-full"
                style={{ border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,220,180,0.3)', textDecoration: 'none' }}>
                {s.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

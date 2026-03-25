import Link from 'next/link'
import { PageNav } from '@/components/PageNav'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

const TIMELINE = [
  {
    phase: 'Now',
    status: 'active' as const,
    title: 'Foundation & Capital',
    period: '2026',
    items: [
      { text: '3D World live — walk the construction site', done: true },
      { text: 'Synesthesia visualizer launched', done: true },
      { text: 'Team assembled + partnerships active', done: true },
      { text: 'Investor conversations underway', done: true },
      { text: 'Site selection in progress', done: false },
      { text: 'Seed round ($500K - $1M)', done: false },
      { text: 'Architectural firm engaged', done: false },
      { text: 'Presale membership campaign', done: false },
    ],
  },
  {
    phase: 'Phase 1A',
    status: 'upcoming' as const,
    title: 'Site Acquisition & Design',
    period: '2026 - 2027',
    items: [
      { text: 'Site secured in Toronto', done: false },
      { text: 'Architectural plans finalized', done: false },
      { text: 'Permits and approvals', done: false },
      { text: 'Construction financing closed', done: false },
      { text: 'Founding member presale opens', done: false },
      { text: 'Groundbreaking ceremony', done: false },
    ],
  },
  {
    phase: 'Phase 1B',
    status: 'upcoming' as const,
    title: 'Construction & Build',
    period: '2027 - 2028',
    items: [
      { text: 'Foundation and structure', done: false },
      { text: 'Interior buildout — 13+ rooms', done: false },
      { text: 'Equipment and technology installation', done: false },
      { text: 'Staff hiring and training', done: false },
      { text: 'Soft launch with founding members', done: false },
      { text: 'Grand opening', done: false },
    ],
  },
  {
    phase: 'Phase 2',
    status: 'future' as const,
    title: 'Vertical Build',
    period: '2028 - 2029',
    items: [
      { text: 'Zoning approval for residential', done: false },
      { text: 'Condo presale campaign', done: false },
      { text: 'Upper floor construction', done: false },
      { text: 'Practitioner office build-out', done: false },
      { text: 'Residential unit delivery', done: false },
    ],
  },
  {
    phase: 'Phase 3',
    status: 'future' as const,
    title: 'Outdoor Campus',
    period: '2029 - 2030',
    items: [
      { text: 'Retractable-roof sports field', done: false },
      { text: 'Skatepark construction', done: false },
      { text: 'Parking garage + rooftop terrace', done: false },
      { text: 'Dog park and outdoor training', done: false },
      { text: 'Full campus operational', done: false },
    ],
  },
  {
    phase: 'Global',
    status: 'future' as const,
    title: 'Worldwide Expansion',
    period: '2030+',
    items: [
      { text: 'New York location planning', done: false },
      { text: 'Licensing model developed', done: false },
      { text: 'WAVMVMT OS app launch', done: false },
      { text: 'Multiple cities operational', done: false },
      { text: 'A center in every major city', done: false },
    ],
  },
]

const STATUS_COLORS = {
  active: '#f0c674',
  upcoming: '#80d4a8',
  future: 'rgba(255,220,180,0.2)',
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Roadmap
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,200,150,0.3)' }}>
            From Vision to Reality
          </p>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,220,180,0.35)' }}>
            The journey from a 3D construction site to a global wellness ecosystem.
            Every milestone tracked, every phase planned.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(240,198,116,0.3), rgba(240,198,116,0.05))' }} />

          {TIMELINE.map((phase, i) => {
            const color = STATUS_COLORS[phase.status]
            return (
              <div key={i} className="relative pl-16 md:pl-20 mb-8">
                {/* Dot on timeline */}
                <div className="absolute left-4 md:left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: color,
                    background: phase.status === 'active' ? color : 'transparent',
                  }}>
                  {phase.status === 'active' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1520]" />
                  )}
                </div>

                {/* Phase label */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[0.5rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                    style={{ border: `1px solid ${color}40`, color }}>
                    {phase.phase}
                  </span>
                  <span className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>
                    {phase.period}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold mb-2" style={{ color, fontFamily: "'Playfair Display', serif" }}>
                  {phase.title}
                </h3>

                {/* Items */}
                <div className="space-y-1.5">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <span className="text-[0.5rem]" style={{ color: item.done ? '#80d4a8' : 'rgba(255,220,180,0.15)' }}>
                        {item.done ? '◆' : '◇'}
                      </span>
                      <span className="text-[0.6rem]" style={{
                        color: item.done ? 'rgba(255,220,180,0.5)' : 'rgba(255,220,180,0.25)',
                        textDecoration: item.done ? 'none' : 'none',
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-6">
          <p className="text-[0.5rem] italic mb-4" style={{ color: 'rgba(255,200,150,0.15)' }}>
            Timeline estimates. Actual progress depends on capital, site, and approvals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tour" className="text-[0.55rem] px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(240,198,116,0.2)', color: '#f0c674', textDecoration: 'none' }}>
              Book a Tour →
            </Link>
            <Link href="/world" className="text-[0.55rem] px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(128,212,168,0.2)', color: '#80d4a8', textDecoration: 'none' }}>
              Explore the World →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

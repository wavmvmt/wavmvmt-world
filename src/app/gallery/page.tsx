'use client'

import Link from 'next/link'
import { PageNav } from '@/components/PageNav'

// Add renders here as they're placed in public/images/renders/
// Each render gets a label describing what it shows
const RENDERS = [
  // Exterior & Campus
  { src: '/images/renders/wellness-center.jpg', label: 'Wellness Center — Curved Glass Facade', category: 'Phase 1' },
  { src: '/images/renders/tower-flagship.jpg', label: 'Flagship Tower — Vertical Build Vision', category: 'Phase 2' },
  { src: '/images/renders/aerial-district.jpg', label: 'Aerial View — Full WAVMVMT District', category: 'Campus' },
  { src: '/images/renders/twin-towers.jpg', label: 'Twin Towers — Residential & Commercial', category: 'Phase 2' },
  { src: '/images/renders/towers-dusk.jpg', label: 'Towers at Dusk — Toronto Skyline', category: 'Vision' },
  { src: '/images/renders/public-plaza.jpg', label: 'Public Plaza & Community Space', category: 'Outdoor' },
  { src: '/images/renders/residential-midrise.jpg', label: 'Residential Midrise — Condo Living', category: 'Phase 2' },
  { src: '/images/renders/retail-promenade.jpg', label: 'Tree-Lined Retail Promenade', category: 'Outdoor' },
  { src: '/images/renders/retail-square.jpg', label: 'Retail Square — Shopping & Dining', category: 'Outdoor' },
  { src: '/images/renders/street-retail.jpg', label: 'Street-Level Retail & Cafés', category: 'Outdoor' },
  { src: '/images/renders/night-district.jpg', label: 'Night District — Evening Atmosphere', category: 'Vision' },
  { src: '/images/renders/pedestrian-paths.jpg', label: 'Pedestrian Pathways — Green Corridors', category: 'Outdoor' },
  { src: '/images/renders/amphitheater.jpg', label: 'Outdoor Amphitheatre — Events & Performance', category: 'Outdoor' },

  // Interior Rooms
  { src: '/images/renders/front-desk.png', label: 'WAVMVMT Reception & Lobby', category: 'Interior' },
  { src: '/images/renders/parkour-gym.png', label: 'Parkour Gym — Movement & Aerial Arts', category: 'Interior' },
  { src: '/images/renders/parkour-springboard.png', label: 'Parkour — Vault Boxes & Foam Pit', category: 'Interior' },
  { src: '/images/renders/weight-training.png', label: 'Weight Training — WAVMVMT Gym Floor', category: 'Interior' },
  { src: '/images/renders/sound-bath.png', label: 'Sound Bath — Crystal Bowls & Meditation', category: 'Interior' },
  { src: '/images/renders/yoga-meditation.png', label: 'Yoga & Meditation Studio', category: 'Interior' },
  { src: '/images/renders/ice-bath-sauna.png', label: 'Ice Baths, Sauna & Salt Room', category: 'Interior' },
  { src: '/images/renders/cafe-lounge.png', label: 'Café & Lounge — Espresso Bar', category: 'Interior' },
  { src: '/images/renders/creative-spaces.png', label: 'Creative Studios — Music, Photo & Video', category: 'Interior' },
  { src: '/images/renders/amphitheatre-interior.png', label: 'Amphitheatre — Stage & Performance', category: 'Interior' },
  { src: '/images/renders/extras.png', label: 'Additional Amenities — Barbershop, Fashion & More', category: 'Interior' },
  { src: '/images/renders/blueprint.png', label: 'Blueprint — Rough Floor Plan Concept', category: 'Planning' },
]

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Vision Gallery
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,200,150,0.3)' }}>
            Architectural Renders & Concept Art
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {RENDERS.map((render, i) => (
            <div key={i} className="rounded-2xl overflow-hidden group cursor-pointer" style={panelStyle}>
              <div className="relative aspect-[16/10] bg-[#1a1520] overflow-hidden">
                {/* Image with fallback */}
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(26,21,32,0.5)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={render.src}
                    alt={render.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  {/* Fallback placeholder (shows when image fails) */}
                  <div className="text-center z-0">
                    <div className="text-3xl mb-2" style={{ color: 'rgba(240,198,116,0.1)' }}>~</div>
                    <div className="text-[0.5rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,220,180,0.15)' }}>
                      Render coming soon
                    </div>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[0.45rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(26,21,32,0.8)', border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(240,198,116,0.5)' }}>
                    {render.category}
                  </span>
                </div>
              </div>

              {/* Label */}
              <div className="p-3 md:p-4">
                <p className="text-[0.65rem] md:text-xs" style={{ color: 'rgba(255,220,180,0.5)' }}>
                  {render.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center mt-10">
          <p className="text-[0.5rem] italic" style={{ color: 'rgba(255,200,150,0.15)' }}>
            Conceptual renders for inspiration. Final architecture will be determined by site, budget, and community input.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/pitch" className="text-[0.55rem] px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,220,180,0.3)', textDecoration: 'none' }}>
              Business Overview →
            </Link>
            <Link href="/world" className="text-[0.55rem] px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(128,212,168,0.15)', color: 'rgba(128,212,168,0.3)', textDecoration: 'none' }}>
              Explore 3D World →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

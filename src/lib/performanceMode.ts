/**
 * Performance mode detection and settings.
 * Multi-signal approach: CPU cores + device memory + connection + screen size.
 * Desktop defaults to "medium" unless device confirms high capability.
 */

export interface PerfSettings {
  particleMultiplier: number
  maxHtmlOverlays: number
  enableShadows: boolean
  enablePostProcessing: boolean
  enableTrail: boolean
  enableCeilingFans: boolean
  enableRoomIcons: boolean
  enableParticles: boolean
  enableDecorations: boolean
  enableOutdoor: boolean
  enableWeather: boolean
  maxLights: number
  maxWorkers: number
}

export type PerfLevel = 'low' | 'medium' | 'high'

function scoreDevice(): number {
  if (typeof window === 'undefined') return 5

  let score = 5

  // CPU cores
  const cores = navigator.hardwareConcurrency ?? 4
  if (cores <= 2) score -= 3
  else if (cores <= 4) score -= 1
  else if (cores >= 8) score += 2

  // Device memory (GB) - Chrome/Edge only
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (mem !== undefined) {
    if (mem <= 2) score -= 3
    else if (mem <= 4) score -= 1
    else if (mem >= 8) score += 1
  }

  // Screen size
  const w = window.innerWidth
  if (w < 500) score -= 2
  else if (w < 900) score -= 1

  // High DPI on small screen = mobile
  if ((window.devicePixelRatio ?? 1) >= 3 && w < 600) score -= 1

  // Network quality
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
  const etype = conn?.effectiveType
  if (etype === 'slow-2g' || etype === '2g') score -= 2
  else if (etype === '3g') score -= 1

  // Prefers reduced motion
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    score -= 2
  }

  return score
}

let _cachedLevel: PerfLevel | null = null

export function detectPerformanceLevel(): PerfLevel {
  if (typeof window !== 'undefined') {
    const manual = localStorage.getItem('wavmvmt_perf_level') as PerfLevel | null
    if (manual === 'low' || manual === 'medium' || manual === 'high') return manual
  }
  if (_cachedLevel) return _cachedLevel
  if (typeof window === 'undefined') return 'medium'

  const score = scoreDevice()
  let level: PerfLevel
  if (score <= 3) level = 'low'
  else if (score <= 6) level = 'medium'
  else level = 'high'

  _cachedLevel = level
  return level
}

export function setPerformanceLevel(level: PerfLevel) {
  _cachedLevel = level
  if (typeof window !== 'undefined') localStorage.setItem('wavmvmt_perf_level', level)
}

export function resetPerformanceLevel() {
  _cachedLevel = null
  if (typeof window !== 'undefined') localStorage.removeItem('wavmvmt_perf_level')
}

export function getPerfSettings(level: PerfLevel): PerfSettings {
  switch (level) {
    case 'low':
      return {
        particleMultiplier: 0.2,
        maxHtmlOverlays: 3,
        enableShadows: false,
        enablePostProcessing: false,
        enableTrail: false,
        enableCeilingFans: false,
        enableRoomIcons: false,
        enableParticles: false,
        enableDecorations: false,
        enableOutdoor: false,
        enableWeather: false,
        maxLights: 2,
        maxWorkers: 5,
      }
    case 'medium':
      return {
        particleMultiplier: 0.4,
        maxHtmlOverlays: 8,
        enableShadows: false,
        enablePostProcessing: true,
        enableTrail: false,
        enableCeilingFans: false,
        enableRoomIcons: true,
        enableParticles: true,
        enableDecorations: true,
        enableOutdoor: false,
        enableWeather: false,
        maxLights: 3,
        maxWorkers: 12,
      }
    case 'high':
      return {
        particleMultiplier: 1.0,
        maxHtmlOverlays: 20,
        enableShadows: true,
        enablePostProcessing: true,
        enableTrail: true,
        enableCeilingFans: true,
        enableRoomIcons: true,
        enableParticles: true,
        enableDecorations: true,
        enableOutdoor: true,
        enableWeather: true,
        maxLights: 8,
        maxWorkers: 24,
      }
  }
}

/**
 * Performance mode detection and settings.
 * Reduces scene complexity on low-end devices.
 */

export interface PerfSettings {
  particleMultiplier: number  // 0.3 (low) to 1.0 (high)
  maxHtmlOverlays: number     // limit Html3D elements
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

export function detectPerformanceLevel(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'medium'

  const isMobile = window.innerWidth < 768
  const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  const isSmallScreen = window.innerWidth < 500

  if (isMobile && (isLowEnd || isSmallScreen)) return 'low'
  if (isMobile) return 'medium'
  return 'high'
}

export function getPerfSettings(level: 'low' | 'medium' | 'high'): PerfSettings {
  switch (level) {
    case 'low':
      return {
        particleMultiplier: 0.3,
        maxHtmlOverlays: 5,
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
        maxWorkers: 10,
      }
    case 'medium':
      return {
        particleMultiplier: 0.5,
        maxHtmlOverlays: 10,
        enableShadows: true,
        enablePostProcessing: true,
        enableTrail: true,
        enableCeilingFans: false,
        enableRoomIcons: true,
        enableParticles: true,
        enableDecorations: true,
        enableOutdoor: false,
        enableWeather: false,
        maxLights: 4,
        maxWorkers: 18,
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
        maxWorkers: 29,
      }
  }
}

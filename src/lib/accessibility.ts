/**
 * Accessibility utilities — reduced motion, high contrast detection.
 * Used by particle/animation components to respect user preferences.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: more)').matches
}

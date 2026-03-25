/**
 * Input sanitization — strips HTML tags, limits length, trims whitespace.
 * Used before any user input is stored in Supabase.
 */

/** Strip HTML tags and trim whitespace */
export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/&[a-z]+;/gi, '') // strip HTML entities
    .trim()
    .slice(0, maxLength)
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

/** Simple rate limiter — returns true if action is allowed */
const rateLimits = new Map<string, number>()

export function rateLimit(key: string, cooldownMs = 5000): boolean {
  const now = Date.now()
  const last = rateLimits.get(key) || 0
  if (now - last < cooldownMs) return false
  rateLimits.set(key, now)
  return true
}

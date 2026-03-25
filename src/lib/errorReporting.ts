/**
 * Error reporting utility — logs errors with context.
 * In production: console.warn (non-intrusive).
 * In development: console.error (loud).
 */

const isDev = process.env.NODE_ENV === 'development'

export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  if (isDev) {
    console.error(`[${context}]`, message, error)
  } else {
    console.warn(`[${context}] ${message}`)
  }
}

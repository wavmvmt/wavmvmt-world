'use client'

import { useState, useEffect } from 'react'
import { worldState, type WorldState } from './worldState'

/**
 * React hook for subscribing to world state changes.
 * Re-renders when state changes (throttled to avoid per-frame rerenders).
 */
export function useWorldState(): Readonly<WorldState> {
  const [state, setState] = useState<WorldState>(worldState.getState())

  useEffect(() => {
    let frameId: number | null = null
    let dirty = false

    const unsubscribe = worldState.onChange((newState) => {
      dirty = true
      // Throttle to max once per frame
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          if (dirty) {
            setState({ ...newState })
            dirty = false
          }
          frameId = null
        })
      }
    })

    return () => {
      unsubscribe()
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return state
}

/**
 * Lightweight selector hook — only re-renders when selected value changes.
 */
export function useWorldSelector<T>(selector: (state: WorldState) => T): T {
  const [value, setValue] = useState<T>(() => selector(worldState.getState()))

  useEffect(() => {
    const unsubscribe = worldState.onChange((newState) => {
      const newValue = selector(newState)
      setValue(prev => {
        if (prev === newValue) return prev
        return newValue
      })
    })
    return unsubscribe
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return value
}

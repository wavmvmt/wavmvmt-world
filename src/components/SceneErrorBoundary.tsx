'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: string }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center"
          style={{ background: '#1a1520' }}>
          <div className="text-6xl mb-6" style={{ color: '#f0c674', opacity: 0.3 }}>~</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'rgba(255,240,220,0.8)' }}>
            Scene couldn&apos;t load
          </h2>
          <p className="text-sm mb-6 max-w-md text-center" style={{ color: 'rgba(255,200,150,0.4)' }}>
            Your browser might not support WebGL, or something went wrong. Try refreshing or using a different browser.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full text-sm tracking-widest uppercase"
            style={{
              border: '1px solid rgba(240,198,116,0.3)',
              color: '#f0c674',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
          <p className="mt-8 text-xs" style={{ color: 'rgba(255,200,150,0.15)' }}>
            Error: {this.state.error}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

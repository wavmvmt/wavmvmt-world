'use client'

import { Component, type ReactNode } from 'react'
import { logError } from '@/lib/errorReporting'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: string; isWebGLLost: boolean }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '', isWebGLLost: false }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const isWebGL = error.message.toLowerCase().includes('webgl') ||
      error.message.toLowerCase().includes('context') ||
      error.message.toLowerCase().includes('gpu')
    return { hasError: true, error: error.message, isWebGLLost: isWebGL }
  }

  componentDidCatch(error: Error) {
    logError('SceneErrorBoundary', error)
  }

  componentDidMount() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('webglcontextlost', this.handleContextLost)
      canvas.addEventListener('webglcontextrestored', this.handleContextRestored)
    }
  }

  componentWillUnmount() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.removeEventListener('webglcontextlost', this.handleContextLost)
      canvas.removeEventListener('webglcontextrestored', this.handleContextRestored)
    }
  }

  handleContextLost = (e: Event) => {
    e.preventDefault()
    logError('WebGL', 'Context lost')
    this.setState({ hasError: true, error: 'WebGL context lost', isWebGLLost: true })
  }

  handleContextRestored = () => {
    logError('WebGL', 'Context restored')
    this.setState({ hasError: false, error: '', isWebGLLost: false })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: '', isWebGLLost: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center"
          style={{ background: '#1a1520' }}>
          <div className="text-6xl mb-6" style={{ color: '#f0c674', opacity: 0.3 }}>~</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'rgba(255,240,220,0.8)' }}>
            {this.state.isWebGLLost ? 'Your device may not support 3D' : 'Scene couldn\'t load'}
          </h2>
          <p className="text-sm mb-6 max-w-md text-center" style={{ color: 'rgba(255,200,150,0.4)' }}>
            {this.state.isWebGLLost
              ? 'WebGL is required to render the 3D world. Try closing other tabs, updating your browser, or using a desktop device.'
              : 'Something went wrong. Try refreshing or using a different browser.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-8 py-3 rounded-full text-sm tracking-widest uppercase cursor-pointer"
              style={{
                border: '1px solid rgba(240,198,116,0.3)',
                color: '#f0c674',
                background: 'transparent',
              }}
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-full text-sm tracking-widest uppercase cursor-pointer"
              style={{
                border: '1px solid rgba(255,200,150,0.15)',
                color: 'rgba(255,200,150,0.5)',
                background: 'transparent',
              }}
            >
              Reload Page
            </button>
          </div>
          <p className="mt-8 text-xs" style={{ color: 'rgba(255,200,150,0.15)' }}>
            Error: {this.state.error}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

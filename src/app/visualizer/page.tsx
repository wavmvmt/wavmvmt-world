'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { SynesthesiaCanvas } from '@/components/SynesthesiaCanvas'
import { AudioAnalyzer } from '@/lib/audioAnalyzer'
import Link from 'next/link'

type AudioSource = 'file' | 'mic' | 'spotify'

const BEAT_TRACKS = [
  { name: 'june 12th beat 5', file: '/audio/beats/june-12th-beat-5.wav' },
  { name: 'june 22nd beat 1', file: '/audio/beats/june-22nd-beat-1.wav' },
  { name: 'june 21st beat 3', file: '/audio/beats/june-21st-beat-3.wav' },
  { name: 'june 19th beat 2', file: '/audio/beats/june-19th-beat-2.wav' },
  { name: 'clear 140', file: '/audio/beats/clear-140.wav' },
]

const SPOTIFY_ARTIST_ID = '4HHt60CmwO8nAS9RFBBO9u'

export default function VisualizerPage() {
  const [source, setSource] = useState<AudioSource>('file')
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackName, setTrackName] = useState('Drop a file or select a source')
  const [showControls, setShowControls] = useState(true)
  const [showSpotify, setShowSpotify] = useState(false)

  const analyzerRef = useRef(new AudioAnalyzer())
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hide controls after 3s of inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout
    const show = () => {
      setShowControls(true)
      clearTimeout(timer)
      timer = setTimeout(() => setShowControls(false), 4000)
    }
    window.addEventListener('mousemove', show)
    window.addEventListener('touchstart', show)
    show()
    return () => {
      window.removeEventListener('mousemove', show)
      window.removeEventListener('touchstart', show)
      clearTimeout(timer)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      analyzerRef.current.cleanup()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  const playFile = useCallback(async (url: string, name: string) => {
    // Create or reuse audio element
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.crossOrigin = 'anonymous'
    }

    audioRef.current.pause()
    analyzerRef.current.cleanup()

    audioRef.current.src = url
    audioRef.current.load()

    try {
      analyzerRef.current.connectElement(audioRef.current)
      await analyzerRef.current.resume()
      await audioRef.current.play()
      setIsPlaying(true)
      setTrackName(name)
      setSource('file')
    } catch (err) {
      console.error('Playback failed:', err)
    }

    audioRef.current.onended = () => setIsPlaying(false)
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    playFile(url, file.name.replace(/\.[^/.]+$/, ''))
  }, [playFile])

  const handleMic = useCallback(async () => {
    try {
      analyzerRef.current.cleanup()
      if (audioRef.current) audioRef.current.pause()
      await analyzerRef.current.connectMicrophone()
      setIsPlaying(true)
      setTrackName('Microphone Input')
      setSource('mic')
    } catch (err) {
      console.error('Mic access denied:', err)
    }
  }, [])

  const togglePause = useCallback(() => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play()
      analyzerRef.current.resume()
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0a0810' }}>
      {/* Canvas */}
      <SynesthesiaCanvas analyzer={analyzerRef.current} isPlaying={isPlaying} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Controls overlay — auto-hides */}
      <div
        className="fixed inset-0 z-10 transition-opacity duration-700"
        style={{
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link href="/" className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.3)', textDecoration: 'none' }}>
            ← WAVMVMT
          </Link>
          <div className="text-xs tracking-[0.15em]" style={{ color: 'rgba(255,220,180,0.2)' }}>
            SYNESTHESIA
          </div>
          <button
            onClick={() => setShowSpotify(!showSpotify)}
            className="text-xs px-3 py-1 rounded-full cursor-pointer"
            style={{ border: '1px solid rgba(30,215,96,0.2)', color: 'rgba(30,215,96,0.5)' }}
          >
            {showSpotify ? 'Hide Spotify' : '♫ Spotify'}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          {/* Track name */}
          <div className="text-center mb-4">
            <div className="text-sm font-medium" style={{ color: 'rgba(255,220,180,0.6)', fontFamily: "'Playfair Display', serif" }}>
              {trackName}
            </div>
            <div className="text-[0.5rem] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(255,220,180,0.2)' }}>
              {source === 'mic' ? 'Live Microphone' : source === 'spotify' ? 'Spotify' : 'Audio File'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            {/* Play/Pause */}
            {source === 'file' && audioRef.current && (
              <button onClick={togglePause}
                className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase cursor-pointer"
                style={{
                  background: 'rgba(240,198,116,0.1)',
                  border: '1px solid rgba(240,198,116,0.3)',
                  color: '#f0c674',
                }}>
                {isPlaying ? '❚❚ Pause' : '▶ Play'}
              </button>
            )}

            {/* Upload file */}
            <button onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-full text-xs tracking-wider uppercase cursor-pointer"
              style={{
                border: '1px solid rgba(255,220,180,0.15)',
                color: 'rgba(255,220,180,0.4)',
              }}>
              📁 Upload Audio
            </button>

            {/* Mic */}
            <button onClick={handleMic}
              className="px-4 py-2.5 rounded-full text-xs tracking-wider uppercase cursor-pointer"
              style={{
                border: `1px solid ${source === 'mic' ? 'rgba(225,48,108,0.4)' : 'rgba(255,220,180,0.15)'}`,
                color: source === 'mic' ? '#e1306c' : 'rgba(255,220,180,0.4)',
              }}>
              🎤 {source === 'mic' ? 'Mic Active' : 'Microphone'}
            </button>

            {/* Beat radio */}
            <div className="relative group">
              <button
                className="px-4 py-2.5 rounded-full text-xs tracking-wider uppercase cursor-pointer"
                style={{
                  border: '1px solid rgba(128,212,168,0.2)',
                  color: 'rgba(128,212,168,0.5)',
                }}>
                🎹 Beat Radio
              </button>
              {/* Dropdown */}
              <div className="absolute bottom-full left-0 mb-2 w-56 rounded-xl p-2 hidden group-hover:block"
                style={{
                  background: 'rgba(26,21,32,0.95)',
                  border: '1px solid rgba(240,198,116,0.15)',
                  backdropFilter: 'blur(12px)',
                }}>
                {BEAT_TRACKS.map((track) => (
                  <button key={track.name}
                    onClick={() => playFile(track.file, track.name)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs cursor-pointer transition-all hover:bg-[rgba(240,198,116,0.05)]"
                    style={{ color: 'rgba(255,220,180,0.5)' }}>
                    {track.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frequency legend */}
          <div className="flex justify-center gap-1 mt-4">
            {[
              { label: 'Sub', color: 'rgb(180,20,20)' },
              { label: 'Bass', color: 'rgb(220,120,20)' },
              { label: 'Low', color: 'rgb(230,190,50)' },
              { label: 'Mid', color: 'rgb(40,180,140)' },
              { label: 'High', color: 'rgb(50,150,210)' },
              { label: 'Air', color: 'rgb(120,60,200)' },
              { label: '✧', color: 'rgb(220,220,240)' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: f.color, opacity: 0.6 }} />
                <span className="text-[0.4rem] uppercase tracking-wider" style={{ color: 'rgba(255,220,180,0.2)' }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spotify embed — slides in from right */}
      {showSpotify && (
        <div className="fixed top-16 right-4 bottom-20 w-80 z-20 rounded-xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <iframe
            src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        </div>
      )}

      {/* Tap anywhere hint */}
      {!isPlaying && (
        <div className="fixed inset-0 z-5 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4" style={{ color: 'rgba(240,198,116,0.08)' }}>~</div>
            <div className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,220,180,0.15)' }}>
              Upload audio or enable microphone to begin
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

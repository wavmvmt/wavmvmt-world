'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { SynesthesiaCanvas } from '@/components/SynesthesiaCanvas'
import { AudioAnalyzer } from '@/lib/audioAnalyzer'
import Link from 'next/link'

type AudioSource = 'file' | 'mic' | 'spotify'

const BLOB_BASE = 'https://znhilrrgmxwedlqs.private.blob.vercel-storage.com/beats'

const BEAT_TRACKS = [
  { name: 'Grunge', file: `${BLOB_BASE}/Grunge.MP3` },
  { name: 'Clear 140', file: `${BLOB_BASE}/clear%20140.wav` },
  { name: 'SFTC', file: `${BLOB_BASE}/sftc_Current.wav` },
  { name: 'WYDG', file: `${BLOB_BASE}/wydg_Current.wav` },
  { name: 'This Far', file: `${BLOB_BASE}/this%20far_Current.wav` },
  { name: 'June 12th Beat 5', file: `${BLOB_BASE}/june%2012th%20beat%205.wav` },
  { name: 'June 12th Beat 3', file: `${BLOB_BASE}/june%2012th%20beat%203.wav` },
  { name: 'June 13th Beat 1', file: `${BLOB_BASE}/june%2013th%20beat%201.wav` },
  { name: 'June 19th Beat 1', file: `${BLOB_BASE}/june%2019th%20beat%201.wav` },
  { name: 'June 19th Beat 2 (135)', file: `${BLOB_BASE}/june%2019th%20beat%202%20135.wav` },
  { name: 'June 21st Beat 2 (145)', file: `${BLOB_BASE}/june%2021st%20beat%202%20145bpm.wav` },
  { name: 'June 21st Beat 3', file: `${BLOB_BASE}/june%2021st%20beat%203.wav` },
  { name: 'June 22nd Beat 1 (127)', file: `${BLOB_BASE}/june%2022nd%20beat%201%20127.wav` },
  { name: 'June 26th Beat 4 (136)', file: `${BLOB_BASE}/june%2026th%20beat%204%20136.wav` },
  { name: 'July 11th Beat 1', file: `${BLOB_BASE}/july%2011th%20beat%201.wav` },
  { name: 'July 12 Beat 1', file: `${BLOB_BASE}/july%2012%20beat%201.wav` },
  { name: 'July 14th Beat 1', file: `${BLOB_BASE}/July%2014th%20beat%201.wav` },
  { name: 'July 26th Beat 1 (155)', file: `${BLOB_BASE}/july%2026th%20beat%201%20155.mp3` },
  { name: 'July 27th Beat 1', file: `${BLOB_BASE}/july%2027th%20beat%201%207.mp3` },
  { name: 'August 13th Beat 1', file: `${BLOB_BASE}/august%2013th%20beat%201%202.mp3` },
  { name: 'August 13th Beat 2', file: `${BLOB_BASE}/august%2013th%20beat%202%201.mp3` },
  { name: 'Sept 17th Beat 1', file: `${BLOB_BASE}/sept%2017th%20beat%201%2022.mp3` },
  { name: 'Oct 14th Beat 5', file: `${BLOB_BASE}/oct%2014th%20beat%205.mp3` },
  { name: 'Nov 12 Beat 1', file: `${BLOB_BASE}/nov%2012%20beat%201.mp3` },
  { name: 'Nov 18th Beat 1 (127)', file: `${BLOB_BASE}/November%2018th%20beat%201%20%20127%20bpm.wav` },
  { name: 'Dec 31st Beat', file: `${BLOB_BASE}/dec%2031st%20beat%204%20or%205%20idk.mp3` },
  { name: 'Feb 12th Beat 3', file: `${BLOB_BASE}/feb%2012th%20beat%203%202.mp3` },
]

const SPOTIFY_ARTIST_ID = '4HHt60CmwO8nAS9RFBBO9u'

export default function VisualizerPage() {
  const [source, setSource] = useState<AudioSource>('file')
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackName, setTrackName] = useState('Drop a file or select a source')
  const [showControls, setShowControls] = useState(true)
  const [showSpotify, setShowSpotify] = useState(false)
  const [showBeats, setShowBeats] = useState(false)

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
    try {
      // Clean up previous
      analyzerRef.current.cleanup()

      // Create fresh audio element each time to avoid CORS/state issues
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      audio.preload = 'auto'
      audioRef.current = audio

      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve()
        audio.onerror = () => reject(new Error('Failed to load audio file'))
        audio.src = url
        audio.load()
        // Timeout after 10s
        setTimeout(() => resolve(), 10000)
      })

      // Connect analyzer and play
      analyzerRef.current.connectElement(audio)
      await analyzerRef.current.resume()
      await audio.play()

      setIsPlaying(true)
      setTrackName(name)
      setSource('file')

      audio.onended = () => setIsPlaying(false)
    } catch (err) {
      console.error('Playback failed:', err)
      alert('Could not play this file. Try a different audio file (MP3, WAV, OGG).')
    }
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    playFile(url, file.name.replace(/\.[^/.]+$/, ''))
  }, [playFile])

  const handleMic = useCallback(async () => {
    try {
      // Stop any current audio first
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      analyzerRef.current.cleanup()

      // Small delay to let cleanup finish
      await new Promise(r => setTimeout(r, 100))

      await analyzerRef.current.connectMicrophone()
      setIsPlaying(true)
      setTrackName('Microphone — play music nearby or speak')
      setSource('mic')
    } catch (err: unknown) {
      console.error('Mic error:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (msg.includes('NotAllowed') || msg.includes('Permission')) {
        alert('Microphone access was denied. Please allow microphone access in your browser settings, then try again.')
      } else if (msg.includes('NotFound')) {
        alert('No microphone found. Please connect a microphone and try again.')
      } else {
        alert(`Microphone error: ${msg}. Try using "Upload Audio" instead.`)
      }
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
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0a0810' }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('audio/')) {
          const url = URL.createObjectURL(file)
          playFile(url, file.name.replace(/\.[^/.]+$/, ''))
        }
      }}>
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
            onClick={async () => {
              const newState = !showSpotify
              setShowSpotify(newState)
              // Auto-enable mic when Spotify opens so visualizer reacts
              if (newState && source !== 'mic') {
                try {
                  if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current.src = ''
                  }
                  analyzerRef.current.cleanup()
                  await new Promise(r => setTimeout(r, 100))
                  await analyzerRef.current.connectMicrophone()
                  setIsPlaying(true)
                  setTrackName('Listening via microphone — play a track on Spotify')
                  setSource('mic')
                } catch {
                  // Mic failed — still show Spotify, just no visualization
                }
              }
            }}
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
            <button
              onClick={() => setShowBeats(v => !v)}
              className="px-4 py-2.5 rounded-full text-xs tracking-wider uppercase cursor-pointer"
              style={{
                border: `1px solid ${showBeats ? 'rgba(128,212,168,0.4)' : 'rgba(128,212,168,0.2)'}`,
                color: showBeats ? '#80d4a8' : 'rgba(128,212,168,0.5)',
                background: showBeats ? 'rgba(128,212,168,0.08)' : 'transparent',
              }}>
              🎹 Beat Radio ({BEAT_TRACKS.length})
            </button>
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

      {/* Beat Radio panel */}
      {showBeats && (
        <div className="fixed top-16 left-4 bottom-20 w-64 z-20 rounded-xl overflow-hidden"
          style={{ background: 'rgba(26,21,32,0.95)', border: '1px solid rgba(128,212,168,0.15)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(128,212,168,0.1)' }}>
            <span className="text-[0.5rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(128,212,168,0.5)' }}>
              Beat Radio · {BEAT_TRACKS.length} tracks
            </span>
            <button onClick={() => setShowBeats(false)} className="text-xs cursor-pointer" style={{ color: 'rgba(255,220,180,0.2)' }}>✕</button>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 36px)' }}>
            {BEAT_TRACKS.map((track, i) => (
              <button key={i}
                onClick={() => { playFile(track.file, `${track.name} — shim.wav`); setShowBeats(false) }}
                className="w-full text-left px-3 py-2.5 text-[0.6rem] cursor-pointer transition-all hover:bg-[rgba(128,212,168,0.05)]"
                style={{ color: 'rgba(255,220,180,0.5)', borderBottom: '1px solid rgba(255,220,180,0.03)' }}>
                <span className="text-[0.5rem] font-mono mr-2" style={{ color: 'rgba(128,212,168,0.3)' }}>{String(i + 1).padStart(2, '0')}</span>
                {track.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spotify embed — slides in from right */}
      {showSpotify && (
        <div className="fixed top-16 right-4 bottom-20 w-80 z-20 rounded-xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <div className="px-3 py-2 text-center" style={{ background: 'rgba(26,21,32,0.95)' }}>
            <p className="text-[0.45rem]" style={{ color: 'rgba(30,215,96,0.4)' }}>
              🎤 Mic active — play a track and watch the colors react
            </p>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="calc(100% - 32px)"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-b-xl"
          />
        </div>
      )}

      {/* Scientific brief — expandable */}
      <details className="fixed bottom-8 left-4 z-10 max-w-xs pointer-events-auto">
        <summary className="text-[0.45rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.15)' }}>
          How it works ⓘ
        </summary>
        <div className="mt-2 p-3 rounded-xl text-[0.5rem] leading-relaxed"
          style={{ background: 'rgba(26,21,32,0.92)', border: '1px solid rgba(240,198,116,0.1)', color: 'rgba(255,220,180,0.35)' }}>
          <p className="mb-2">
            <strong style={{ color: 'rgba(240,198,116,0.5)' }}>Synesthesia</strong> — the neurological phenomenon where one sense
            triggers another. This visualizer maps the audio spectrum to color using the somatic
            frequency model: where sound physically resonates in the human body.
          </p>
          <p className="mb-2">
            <strong style={{ color: 'rgba(240,198,116,0.5)' }}>7 frequency bands</strong> are analyzed 60 times per second via
            Web Audio API (FFT analysis). Each band maps to a color based on its
            position in the body&apos;s resonance field:
          </p>
          <p className="mb-2" style={{ fontSize: '0.42rem' }}>
            Sub-bass (20-60Hz) → red (gut) · Bass (60-250Hz) → amber (hips) ·
            Low-mid (250-500Hz) → gold (solar plexus) · Mid (500-2kHz) → teal (chest) ·
            Upper-mid (2-4kHz) → cyan (throat) · Presence (4-8kHz) → violet (crown) ·
            Brilliance (8-20kHz) → silver (above)
          </p>
          <p>
            <strong style={{ color: 'rgba(240,198,116,0.5)' }}>Amplitude = brightness.</strong> The louder a frequency band,
            the brighter its color. Silence produces darkness. The result is an accurate,
            real-time visual translation of sound into color — you literally see what you hear.
          </p>
        </div>
      </details>

      {/* Copyright notice */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="text-[0.4rem]" style={{ color: 'rgba(255,220,180,0.08)' }}>
          © 2026 WAVMVMT / Arc.wav. All rights reserved. Patent pending.
          Synesthesia frequency-to-somatic visualization technology by Shim.
        </p>
      </div>

      {/* Welcome state — show when no audio playing */}
      {!isPlaying && (
        <div className="fixed inset-0 z-5 flex items-center justify-center">
          <div className="text-center max-w-md mx-4">
            <div className="text-6xl mb-4" style={{ color: 'rgba(240,198,116,0.15)' }}>~</div>
            <h2 className="text-xl mb-1" style={{ color: 'rgba(255,220,180,0.4)', fontFamily: "'Playfair Display', serif" }}>
              See What Your Sound Is Saying
            </h2>
            <p className="text-[0.5rem] mb-3" style={{ color: 'rgba(255,220,180,0.12)' }}>
              styll 😂
            </p>
            <p className="text-[0.6rem] mb-6" style={{ color: 'rgba(255,220,180,0.2)' }}>
              Every frequency has a color. Every amplitude has a brightness.
              Upload audio or enable your microphone to begin.
            </p>
            <div className="flex flex-col gap-3 items-center">
              <button onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 rounded-full text-sm font-bold tracking-wider uppercase cursor-pointer pointer-events-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(240,198,116,0.12), rgba(128,212,168,0.12))',
                  border: '1px solid rgba(240,198,116,0.3)',
                  color: '#f0c674',
                }}>
                🎵 Upload Audio File
              </button>
              <button onClick={handleMic}
                className="px-6 py-2 rounded-full text-xs tracking-wider uppercase cursor-pointer pointer-events-auto"
                style={{
                  border: '1px solid rgba(255,220,180,0.15)',
                  color: 'rgba(255,220,180,0.4)',
                }}>
                🎤 Use Microphone
              </button>
              <p className="text-[0.45rem] mt-2" style={{ color: 'rgba(255,220,180,0.1)' }}>
                Drag & drop audio files also supported
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

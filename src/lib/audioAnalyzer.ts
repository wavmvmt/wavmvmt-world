/**
 * Web Audio API analyzer for the Synesthesia visualizer.
 *
 * Takes audio input (file, mic, or element) and outputs
 * per-band amplitude + density data at 60fps.
 */

import { FREQUENCY_BANDS, getBinRange, type FrequencyBand } from './frequencyColorMap'

export interface BandData {
  band: FrequencyBand
  /** Amplitude 0-1 (smoothed) */
  amplitude: number
  /** Raw amplitude 0-1 (unsmoothed, for transient detection) */
  rawAmplitude: number
  /** Density/energy spread 0-1 */
  density: number
  /** Peak detection — true on transient hits */
  isPeak: boolean
}

export class AudioAnalyzer {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null = null
  private dataArray: Uint8Array<ArrayBuffer> = new Uint8Array(0)
  private smoothed: number[] = new Array(7).fill(0)
  private prevAmplitudes: number[] = new Array(7).fill(0)
  private peakDecay: number[] = new Array(7).fill(0)

  /** Smoothing factor — lower = more responsive, higher = smoother */
  smoothingFactor = 0.15

  get isActive(): boolean {
    return this.ctx !== null && this.ctx.state === 'running'
  }

  get sampleRate(): number {
    return this.ctx?.sampleRate || 44100
  }

  get fftSize(): number {
    return this.analyser?.fftSize || 2048
  }

  /**
   * Connect to an HTML audio/video element.
   */
  connectElement(element: HTMLMediaElement): void {
    this.cleanup()
    this.ctx = new AudioContext()
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.3

    this.source = this.ctx.createMediaElementSource(element)
    this.source.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>
  }

  /**
   * Connect to microphone input.
   */
  async connectMicrophone(): Promise<void> {
    this.cleanup()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.ctx = new AudioContext()
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.3

    this.source = this.ctx.createMediaStreamSource(stream)
    this.source.connect(this.analyser)
    // Don't connect to destination (would cause feedback)

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>
  }

  /**
   * Get current frequency data for all 7 bands.
   * Call this every frame in requestAnimationFrame.
   */
  analyze(): BandData[] {
    if (!this.analyser) {
      return FREQUENCY_BANDS.map(band => ({
        band,
        amplitude: 0,
        rawAmplitude: 0,
        density: 0,
        isPeak: false,
      }))
    }

    this.analyser.getByteFrequencyData(this.dataArray)

    return FREQUENCY_BANDS.map((band, i) => {
      const [minBin, maxBin] = getBinRange(band, this.sampleRate, this.fftSize)
      const binCount = maxBin - minBin + 1

      if (binCount <= 0) {
        return { band, amplitude: 0, rawAmplitude: 0, density: 0, isPeak: false }
      }

      // Calculate amplitude (average energy in band)
      let sum = 0
      let activeBins = 0
      let peak = 0
      for (let bin = minBin; bin <= maxBin; bin++) {
        const val = this.dataArray[bin] / 255
        sum += val
        if (val > 0.1) activeBins++
        if (val > peak) peak = val
      }

      const rawAmplitude = sum / binCount
      // Density = what fraction of bins in this band are active
      const density = activeBins / binCount

      // Smooth the amplitude for organic breathing feel
      this.smoothed[i] += (rawAmplitude - this.smoothed[i]) * this.smoothingFactor
      const amplitude = this.smoothed[i]

      // Peak detection — compare to previous frame
      const isPeak = rawAmplitude > this.prevAmplitudes[i] * 1.5 && rawAmplitude > 0.15
      this.prevAmplitudes[i] = rawAmplitude

      // Decay peak indicator
      if (isPeak) this.peakDecay[i] = 1
      else this.peakDecay[i] *= 0.9

      return {
        band,
        amplitude: Math.min(1, amplitude),
        rawAmplitude: Math.min(1, rawAmplitude),
        density: Math.min(1, density),
        isPeak,
      }
    })
  }

  /**
   * Resume audio context (needed after user gesture).
   */
  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume()
    }
  }

  /**
   * Clean up all audio resources.
   */
  cleanup(): void {
    if (this.source) {
      this.source.disconnect()
      this.source = null
    }
    if (this.analyser) {
      this.analyser.disconnect()
      this.analyser = null
    }
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
    this.smoothed.fill(0)
    this.prevAmplitudes.fill(0)
  }
}

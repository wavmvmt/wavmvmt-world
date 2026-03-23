/**
 * Synesthesia frequency-to-color mapping.
 *
 * Based on the somatic experience of sound:
 * - Low frequencies felt in the gut/thighs → warm reds
 * - Mid frequencies felt in the chest/heart → greens/teals
 * - High frequencies felt above the head → cool violets/whites
 *
 * Each band maps to:
 * - A color (HSL for easy brightness manipulation)
 * - A vertical position (0 = bottom, 1 = top)
 * - A spread factor (how wide the blob gets)
 */

export interface FrequencyBand {
  name: string
  label: string
  bodyZone: string
  minHz: number
  maxHz: number
  /** HSL hue (0-360) */
  hue: number
  /** HSL saturation (0-100) */
  saturation: number
  /** Base lightness at full amplitude (0-100) */
  maxLightness: number
  /** Vertical position on canvas (0 = bottom, 1 = top) */
  yPosition: number
  /** How spread the blob is (1 = tight, 3 = wide wash) */
  spreadFactor: number
  /** RGB for canvas rendering */
  rgb: [number, number, number]
}

export const FREQUENCY_BANDS: FrequencyBand[] = [
  {
    name: 'sub_bass',
    label: 'Sub-Bass',
    bodyZone: 'Gut / Thighs',
    minHz: 20,
    maxHz: 60,
    hue: 0,
    saturation: 85,
    maxLightness: 45,
    yPosition: 0.0,
    spreadFactor: 2.5,
    rgb: [180, 20, 20],
  },
  {
    name: 'bass',
    label: 'Bass',
    bodyZone: 'Hips / Lower Torso',
    minHz: 60,
    maxHz: 250,
    hue: 25,
    saturation: 90,
    maxLightness: 55,
    yPosition: 0.14,
    spreadFactor: 2.0,
    rgb: [220, 120, 20],
  },
  {
    name: 'low_mid',
    label: 'Low-Mid',
    bodyZone: 'Solar Plexus',
    minHz: 250,
    maxHz: 500,
    hue: 45,
    saturation: 85,
    maxLightness: 60,
    yPosition: 0.28,
    spreadFactor: 1.8,
    rgb: [230, 190, 50],
  },
  {
    name: 'mid',
    label: 'Mid',
    bodyZone: 'Chest / Heart',
    minHz: 500,
    maxHz: 2000,
    hue: 165,
    saturation: 70,
    maxLightness: 50,
    yPosition: 0.43,
    spreadFactor: 1.5,
    rgb: [40, 180, 140],
  },
  {
    name: 'upper_mid',
    label: 'Upper-Mid',
    bodyZone: 'Throat / Face',
    minHz: 2000,
    maxHz: 4000,
    hue: 195,
    saturation: 75,
    maxLightness: 55,
    yPosition: 0.57,
    spreadFactor: 1.3,
    rgb: [50, 150, 210],
  },
  {
    name: 'presence',
    label: 'Presence',
    bodyZone: 'Forehead / Crown',
    minHz: 4000,
    maxHz: 8000,
    hue: 270,
    saturation: 65,
    maxLightness: 50,
    yPosition: 0.72,
    spreadFactor: 1.2,
    rgb: [120, 60, 200],
  },
  {
    name: 'brilliance',
    label: 'Brilliance',
    bodyZone: 'Above / Air',
    minHz: 8000,
    maxHz: 20000,
    hue: 0,
    saturation: 0,
    maxLightness: 85,
    yPosition: 0.88,
    spreadFactor: 1.0,
    rgb: [220, 220, 240],
  },
]

/**
 * Map FFT bin index to frequency.
 * bin_freq = bin_index * (sampleRate / fftSize)
 */
export function binToFrequency(binIndex: number, sampleRate: number, fftSize: number): number {
  return binIndex * (sampleRate / fftSize)
}

/**
 * Get the FFT bin range for a frequency band.
 */
export function getBinRange(band: FrequencyBand, sampleRate: number, fftSize: number): [number, number] {
  const minBin = Math.floor(band.minHz / (sampleRate / fftSize))
  const maxBin = Math.ceil(band.maxHz / (sampleRate / fftSize))
  return [minBin, Math.min(maxBin, fftSize / 2 - 1)]
}

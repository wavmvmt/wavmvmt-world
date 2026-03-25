/**
 * Beat Radio — shared track list from the Synesthesia visualizer.
 * Serves beats through /api/beats proxy (Vercel Blob private storage).
 * Used by both /visualizer and /world pages.
 */

const b = (name: string) => `/api/beats?file=${encodeURIComponent(name)}`

export interface BeatTrack {
  name: string
  file: string
}

export const BEAT_TRACKS: BeatTrack[] = [
  { name: 'Grunge', file: b('Grunge.MP3') },
  { name: 'Clear 140', file: b('clear 140.wav') },
  { name: 'SFTC', file: b('sftc_Current.wav') },
  { name: 'WYDG', file: b('wydg_Current.wav') },
  { name: 'This Far', file: b('this far_Current.wav') },
  { name: 'June 12th Beat 5', file: b('june 12th beat 5.wav') },
  { name: 'June 12th Beat 3', file: b('june 12th beat 3.wav') },
  { name: 'June 13th Beat 1', file: b('june 13th beat 1.wav') },
  { name: 'June 19th Beat 1', file: b('june 19th beat 1.wav') },
  { name: 'June 19th Beat 2 (135)', file: b('june 19th beat 2 135.wav') },
  { name: 'June 21st Beat 2 (145)', file: b('june 21st beat 2 145bpm.wav') },
  { name: 'June 21st Beat 3', file: b('june 21st beat 3.wav') },
  { name: 'June 22nd Beat 1 (127)', file: b('june 22nd beat 1 127.wav') },
  { name: 'June 26th Beat 4 (136)', file: b('june 26th beat 4 136.wav') },
  { name: 'July 11th Beat 1', file: b('july 11th beat 1.wav') },
  { name: 'July 12 Beat 1', file: b('july 12 beat 1.wav') },
  { name: 'July 14th Beat 1', file: b('July 14th beat 1.wav') },
  { name: 'July 26th Beat 1 (155)', file: b('july 26th beat 1 155.mp3') },
  { name: 'July 27th Beat 1', file: b('july 27th beat 1 7.mp3') },
  { name: 'August 13th Beat 1', file: b('august 13th beat 1 2.mp3') },
  { name: 'August 13th Beat 2', file: b('august 13th beat 2 1.mp3') },
  { name: 'Sept 17th Beat 1', file: b('sept 17th beat 1 22.mp3') },
  { name: 'Oct 14th Beat 5', file: b('oct 14th beat 5.mp3') },
  { name: 'Nov 12 Beat 1', file: b('nov 12 beat 1.mp3') },
  { name: 'Nov 18th Beat 1 (127)', file: b('November 18th beat 1  127 bpm.wav') },
  { name: 'Dec 31st Beat', file: b('dec 31st beat 4 or 5 idk.mp3') },
  { name: 'Feb 12th Beat 3', file: b('feb 12th beat 3 2.mp3') },
]

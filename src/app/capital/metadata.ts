import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WAVMVMT Center — The Investment Case | Clearwater, Idaho',
  description: 'Market data, capital structure, competitive positioning, and problem-solution analysis for WAVMVMT Center at Clearwater, Idaho. How one building unlocks a $20.86B QOZ development.',
  openGraph: {
    title: 'WAVMVMT Center — The Investment Case',
    description: '$584B wellness real estate market. 10–25% residential premium on $7.2B residential line. $87M/yr winter gap solved. The capital mechanism that completes the Clearwater stack.',
    url: 'https://wavmvmt-world.vercel.app/capital',
    siteName: 'WAVMVMT',
    images: [
      {
        url: 'https://wavmvmt-world.vercel.app/shim-artist-portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'WAVMVMT Center — Capital + Investment Case',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAVMVMT Center — The Investment Case',
    description: 'How WAVMVMT Center unlocks the $20.86B Clearwater, Idaho QOZ capital stack. Market data, mechanism, competitive positioning.',
    images: ['https://wavmvmt-world.vercel.app/shim-artist-portrait.jpg'],
    creator: '@shim_wav',
  },
  robots: { index: false, follow: false },
}

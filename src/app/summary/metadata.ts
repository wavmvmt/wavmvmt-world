import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WAVMVMT Center × Clearwater — Executive Summary',
  description: 'One page. The full case for WAVMVMT Center at Clearwater, Idaho. Five key points, the capital mechanism, the numbers, the arrangement.',
  openGraph: {
    title: 'WAVMVMT Center × Clearwater — Executive Summary',
    description: 'The complete case in one page. WAVMVMT Center unlocks the Clearwater capital stack, solves the winter revenue gap, and creates the cultural identity the development is missing.',
    url: 'https://wavmvmt-world.vercel.app/summary',
    siteName: 'WAVMVMT',
    images: [
      {
        url: 'https://wavmvmt-world.vercel.app/shim-community-gongbath.jpg',
        width: 1200,
        height: 630,
        alt: 'WAVMVMT Center × Clearwater — Executive Summary',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAVMVMT Center × Clearwater — Executive Summary',
    description: 'Five key points. The capital mechanism. The numbers. The arrangement. One page.',
    images: ['https://wavmvmt-world.vercel.app/shim-community-gongbath.jpg'],
    creator: '@shim_wav',
  },
  robots: { index: false, follow: false },
}

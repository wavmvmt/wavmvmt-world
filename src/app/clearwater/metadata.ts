import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WAVMVMT Center × Clearwater, Idaho — A Proposal by Saadiq Khan',
  description: 'A proposal to build the cultural heart of Clearwater, Idaho. Full-spectrum wellness, creative, education, and community infrastructure — the one piece the $20.86B development is missing.',
  openGraph: {
    title: 'WAVMVMT Center × Clearwater, Idaho',
    description: 'Sound bath. Parkour gym. Music studio. Education wing. Co-working. The cultural infrastructure that unlocks the full Clearwater capital stack — and solves the $87M winter revenue gap.',
    url: 'https://wavmvmt-world.vercel.app/clearwater',
    siteName: 'WAVMVMT',
    images: [
      {
        url: 'https://wavmvmt-world.vercel.app/shim-community-gongbath.jpg',
        width: 1200,
        height: 630,
        alt: 'WAVMVMT Center — Clearwater, Idaho',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAVMVMT Center × Clearwater, Idaho',
    description: 'A proposal to build the cultural heart of a $20.86B QOZ development in Idaho. Sound healing, movement, music, education, community — year-round.',
    images: ['https://wavmvmt-world.vercel.app/shim-community-gongbath.jpg'],
    creator: '@shim_wav',
  },
  robots: { index: false, follow: false },
}

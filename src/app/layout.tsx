import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import { VideoBackground } from '@/components/VideoBackground'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["700", "900"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "WAVMVMT — A New Renaissance",
  description: "Walk through the WAVMVMT construction site in 3D. A $100M+ wellness, fitness, music, tech & education campus being built in Toronto. 13+ rooms, outdoor sports field, skatepark, rooftop terrace. Experience the future being built.",
  keywords: ["WAVMVMT", "wellness center", "music studio", "parkour gym", "3D world", "construction", "Toronto", "education", "skatepark", "fitness", "synesthesia", "shim.wav"],
  openGraph: {
    title: "WAVMVMT — A New Renaissance",
    description: "Walk through a $100M+ wellness campus being built in real-time 3D. Parkour gym, music studio, sound bath, education wing, skatepark, rooftop terrace. Toronto, ON.",
    siteName: "WAVMVMT World",
    type: "website",
    locale: "en_US",
    url: "https://wavmvmt-world.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "WAVMVMT — A New Renaissance",
    description: "Walk through a $100M+ wellness & tech campus being built in real-time 3D. 13+ rooms, outdoor campus, 100 quests. Toronto.",
    creator: "@shim_wav",
    site: "@wavmvmt",
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'theme-color': '#f0c674',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'WAVMVMT',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <head>
        <link rel="preload" href="/audio/construction_loop.ogg" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/audio/footstep_01.ogg" as="fetch" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://znhilrrgmxwedlqs.private.blob.vercel-storage.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        {/* JSON-LD structured data for rich Google results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'WAVMVMT',
              url: 'https://wavmvmt-world.vercel.app',
              logo: 'https://wavmvmt-world.vercel.app/favicon.svg',
              description: 'A $100M+ wellness, fitness, music, technology and education campus being built in Toronto.',
              foundingDate: '2024',
              foundingLocation: { '@type': 'Place', name: 'Toronto, ON, Canada' },
              founder: { '@type': 'Person', name: 'Saadiq Khan', alternateName: 'Shim' },
              sameAs: [
                'https://instagram.com/shim.wav',
                'https://x.com/shimwav',
                'https://open.spotify.com/artist/4HHt60CmwO8nAS9RFBBO9u',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'wavmvmt@gmail.com',
                contactType: 'General Inquiry',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#1a1520] text-white antialiased" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {})
            })
          }
        `}} />
        <VideoBackground />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

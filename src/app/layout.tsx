import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["700", "900"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "WAVMVMT World — Under Construction",
  description: "Walk through the 42,500 sq ft WAVMVMT Center construction site. 12 rooms. $20M build. Music, wellness, fitness, technology — under one roof. Toronto, ON.",
  keywords: ["WAVMVMT", "wellness center", "music studio", "parkour gym", "3D world", "construction", "Toronto"],
  openGraph: {
    title: "WAVMVMT World · Walk the Construction Site",
    description: "42,500 sq ft. 12 rooms. Parkour gym, music studio, sound bath, recovery suite. Watch it being built in real-time 3D.",
    siteName: "WAVMVMT World",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WAVMVMT World · Walk the Construction Site",
    description: "42,500 sq ft flagship wellness center. Watch anime construction workers build it in real-time 3D.",
  },
  robots: { index: true, follow: true },
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
      <body className="min-h-screen bg-[#1a1520] text-white antialiased" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

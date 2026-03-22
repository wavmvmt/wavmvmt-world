import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://wavmvmt-world.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://wavmvmt-world.vercel.app/world', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]
}

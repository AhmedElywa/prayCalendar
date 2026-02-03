import type { MetadataRoute } from 'next';
import { cities } from '../constants/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pray.ahmedelywa.com';

  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/city/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pwa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...cityPages,
  ];
}

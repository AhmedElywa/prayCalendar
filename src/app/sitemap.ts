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
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Cities index page
    {
      url: `${baseUrl}/cities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // API documentation
    {
      url: `${baseUrl}/api-docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Widget generator
    {
      url: `${baseUrl}/widget/generator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Home Assistant integration
    {
      url: `${baseUrl}/integrations/home-assistant`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // PWA app
    {
      url: `${baseUrl}/pwa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Individual city pages
    ...cityPages,
  ];
}

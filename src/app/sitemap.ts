import type { MetadataRoute } from 'next';
import { LOCALE_METADATA, SUPPORTED_LOCALES } from '@/i18n/routing';

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://antarctica-atlas.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {
    'x-default': `${SITE_ORIGIN}/en`
  };
  for (const loc of SUPPORTED_LOCALES) {
    languages[LOCALE_METADATA[loc].htmlLang] = `${SITE_ORIGIN}/${loc}`;
  }

  return SUPPORTED_LOCALES.map((loc) => ({
    url: `${SITE_ORIGIN}/${loc}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: loc === 'en' ? 1.0 : 0.9,
    alternates: {
      languages
    }
  }));
}

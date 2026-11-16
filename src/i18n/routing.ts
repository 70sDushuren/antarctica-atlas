import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const SUPPORTED_LOCALES = [
  'en',
  'zh-CN',
  'zh-TW',
  'yue-Hant',
  'pt',
  'es'
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_METADATA: Record<
  SupportedLocale,
  { code: SupportedLocale; badge: string; nativeLabel: string; htmlLang: string }
> = {
  en: { code: 'en', badge: 'EN', nativeLabel: 'English', htmlLang: 'en' },
  'zh-CN': { code: 'zh-CN', badge: '简', nativeLabel: '简体中文', htmlLang: 'zh-Hans' },
  'zh-TW': { code: 'zh-TW', badge: '繁', nativeLabel: '繁體中文', htmlLang: 'zh-Hant' },
  'yue-Hant': { code: 'yue-Hant', badge: '粵', nativeLabel: '繁體粵語', htmlLang: 'yue-Hant' },
  pt: { code: 'pt', badge: 'PT', nativeLabel: 'Português', htmlLang: 'pt' },
  es: { code: 'es', badge: 'ES', nativeLabel: 'Español', htmlLang: 'es' }
};

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

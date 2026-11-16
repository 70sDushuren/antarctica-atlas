import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  LOCALE_METADATA,
  routing,
  SUPPORTED_LOCALES,
  type SupportedLocale
} from '@/i18n/routing';
import '../globals.css';

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://antarctica-atlas.vercel.app';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = routing.locales.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'brand' });

  const languages: Record<string, string> = {
    'x-default': '/en'
  };
  for (const loc of SUPPORTED_LOCALES) {
    languages[LOCALE_METADATA[loc].htmlLang] = `/${loc}`;
  }

  const fullTitle = `${t('title')} — ${t('subtitle')}`;

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: fullTitle,
    description: t('subtitle'),
    alternates: {
      canonical: `/${safeLocale}`,
      languages
    },
    openGraph: {
      title: fullTitle,
      description: t('subtitle'),
      url: `/${safeLocale}`,
      siteName: t('title'),
      locale: LOCALE_METADATA[safeLocale].htmlLang,
      type: 'website'
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as SupportedLocale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const htmlLang = LOCALE_METADATA[locale as SupportedLocale].htmlLang;

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body className="antialiased selection:bg-sky-500/30">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

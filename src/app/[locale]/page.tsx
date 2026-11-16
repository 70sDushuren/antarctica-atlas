import { setRequestLocale } from 'next-intl/server';
import { AtlasShell } from '@/components/layout-hud/AtlasShell';
import type { SupportedLocale } from '@/i18n/routing';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AtlasShell locale={locale as SupportedLocale} />;
}

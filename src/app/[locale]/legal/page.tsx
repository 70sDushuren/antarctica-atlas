import Link from 'next/link';
import { ArrowLeft, Compass, Lock, ShieldAlert } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SCIENTIFIC_DATA_SOURCES } from '@/data/heritage-and-corridors';

export default async function LegalAndPrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tLegal = await getTranslations({ locale, namespace: 'legal' });
  const tStatus = await getTranslations({ locale, namespace: 'status' });
  const tBrand = await getTranslations({ locale, namespace: 'brand' });

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            {tBrand('title')} · V2.0
          </span>
          <h1 className="mt-1 text-xl md:text-2xl font-bold text-white">
            {tLegal('legalPageTitle')}
          </h1>
        </div>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/35 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-sky-200 hover:border-sky-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{tStatus('backToAtlas')}</span>
        </Link>
      </div>

      <section className="cryo-card rounded-2xl p-5 space-y-2.5 border-amber-400/30">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <h2>{tLegal('liabilitySectionTitle')}</h2>
        </div>
        <p className="text-xs md:text-sm leading-relaxed text-slate-200">
          {tLegal('liabilitySectionBody')}
        </p>
      </section>

      <section className="cryo-card rounded-2xl p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
          <Lock className="h-4 w-4 shrink-0" />
          <h2>{tLegal('privacySectionTitle')}</h2>
        </div>
        <p className="text-xs md:text-sm leading-relaxed text-slate-200">
          {tLegal('privacySectionBody')}
        </p>
      </section>

      <section className="cryo-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
          <Compass className="h-4 w-4 shrink-0" />
          <h2>{tLegal('termsSectionTitle')}</h2>
        </div>
        <p className="text-xs md:text-sm leading-relaxed text-slate-200">
          {tLegal('termsSectionBody')}
        </p>
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800 text-xs">
          {SCIENTIFIC_DATA_SOURCES.map((src) => (
            <a
              key={src.id}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 hover:underline"
            >
              {src.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

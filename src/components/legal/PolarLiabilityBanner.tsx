'use client';

import Link from 'next/link';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';

export function PolarLiabilityBanner({ locale }: { locale: SupportedLocale }) {
  const tLegal = useTranslations('legal');

  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-100/95 space-y-1.5">
      <div className="flex items-center justify-between gap-2 font-semibold text-amber-300">
        <span className="inline-flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{tLegal('disclaimerTitle')}</span>
        </span>
        <Link
          href={`/${locale}/legal`}
          className="inline-flex items-center gap-1 text-[10px] text-sky-300 hover:underline shrink-0"
        >
          <ShieldCheck className="h-3 w-3" />
          <span>{tLegal('privacyLink')}</span>
        </Link>
      </div>
      <p className="text-slate-200/90">{tLegal('disclaimerBody')}</p>
    </div>
  );
}

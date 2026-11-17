'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('status');

  useEffect(() => {
    console.error('[Antarctica Atlas Runtime Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="cryo-card max-w-md rounded-2xl p-6 text-center space-y-4">
        <h2 className="text-lg font-semibold text-amber-300">{t('errorTitle')}</h2>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
        >
          {t('errorRetry')}
        </button>
      </div>
    </div>
  );
}

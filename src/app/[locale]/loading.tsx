import { useTranslations } from 'next-intl';

export default function LocaleLoading() {
  const t = useTranslations('status');
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="cryo-card rounded-2xl px-6 py-4 flex items-center gap-3 text-sm text-sky-300">
        <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-sky-400" />
        <span>{t('loading')}</span>
      </div>
    </div>
  );
}

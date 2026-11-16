import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function LocaleNotFound() {
  const t = useTranslations('status');

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="cryo-card max-w-md rounded-2xl p-6 text-center space-y-4">
        <div className="font-mono text-xs text-sky-400">404 · EPSG:3031</div>
        <h2 className="text-lg font-semibold text-white">{t('notFoundTitle')}</h2>
        <p className="text-xs leading-relaxed text-slate-300">{t('notFoundHint')}</p>
        <div>
          <Link
            href="/"
            className="inline-block rounded-xl bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
          >
            {t('backToAtlas')}
          </Link>
        </div>
      </div>
    </div>
  );
}

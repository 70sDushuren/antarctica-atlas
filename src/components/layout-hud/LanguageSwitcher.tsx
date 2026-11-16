'use client';

import { useSearchParams } from 'next/navigation';
import {
  LOCALE_METADATA,
  SUPPORTED_LOCALES,
  usePathname,
  useRouter,
  type SupportedLocale
} from '@/i18n/routing';

export function LanguageSwitcher({ currentLocale }: { currentLocale: SupportedLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleLocaleChange(nextLocale: SupportedLocale) {
    // Prefer live window.location.search so history.replaceState updates (camera/station/peel) are never lost
    const liveSearch =
      typeof window !== 'undefined'
        ? window.location.search.replace(/^\?/, '')
        : searchParams.toString();
    const href = liveSearch ? `${pathname}?${liveSearch}` : pathname;
    router.replace(href, { locale: nextLocale });
  }

  return (
    <div
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-sky-400/25 bg-slate-950/50 p-1"
      role="group"
      aria-label="Language Selector"
    >
      {SUPPORTED_LOCALES.map((loc) => {
        const meta = LOCALE_METADATA[loc];
        const active = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => handleLocaleChange(loc)}
            title={meta.nativeLabel}
            className={`min-w-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-sky-500/15 hover:text-white'
            }`}
          >
            <span className="font-semibold">{meta.badge}</span>
            <span className="ml-1 hidden xl:inline">{meta.nativeLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

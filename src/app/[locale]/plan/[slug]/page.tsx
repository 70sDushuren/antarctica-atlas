import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Compass, MapPin } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PolarLiabilityBanner } from '@/components/legal/PolarLiabilityBanner';
import type { SupportedLocale } from '@/i18n/routing';
import { atlasDbRepository } from '@/lib/db';

export default async function SharedItineraryPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as SupportedLocale;

  const plan = await atlasDbRepository.getPublicItineraryBySlug(slug);
  if (!plan) {
    notFound();
  }

  const tPlan = await getTranslations({ locale, namespace: 'planner' });
  const tAdv = await getTranslations({ locale, namespace: 'advisor' });
  const firstWp = plan.waypoints[0];
  const jumpHref = firstWp
    ? `/${locale}?tab=planner&lat=${firstWp.lat.toFixed(4)}&lon=${firstWp.lon.toFixed(4)}&zoom=4`
    : `/${locale}?tab=planner`;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-5">
      <header className="cryo-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-200">
            {tPlan('sharedReadOnlyBadge')}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-white">{plan.title}</h1>
          <div className="font-mono text-xs text-slate-300">
            {tAdv(`tier${plan.overallDifficulty}Label`)} · {plan.totalDistanceKm} km ·{' '}
            {plan.waypoints.length} pts
          </div>
        </div>

        <Link
          href={jumpHref}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-300"
        >
          <Compass className="h-4 w-4" />
          <span>{tPlan('openInInteractiveAtlas')}</span>
        </Link>
      </header>

      {plan.advisory && (
        <section className="cryo-card rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-sky-300">{tAdv('summaryTitle')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="rounded-xl bg-slate-950/65 p-3">
              <span className="block font-sans text-[10px] text-slate-400">
                {tAdv('totalDistance')}
              </span>
              <span className="text-sm font-bold text-sky-300">
                {plan.advisory.totalDistanceKm} km
              </span>
            </div>
            <div className="rounded-xl bg-slate-950/65 p-3">
              <span className="block font-sans text-[10px] text-slate-400">
                {tAdv('totalElevGain')}
              </span>
              <span className="text-sm font-bold text-emerald-300">
                +{plan.advisory.totalElevationGainM} m
              </span>
            </div>
            <div className="rounded-xl bg-slate-950/65 p-3">
              <span className="block font-sans text-[10px] text-slate-400">
                {tAdv('minWindChill')}
              </span>
              <span className="text-sm font-bold text-amber-200">
                {plan.advisory.minWindChillC} °C
              </span>
            </div>
            <div className="rounded-xl bg-slate-950/65 p-3">
              <span className="block font-sans text-[10px] text-slate-400">
                {tAdv('maxGust')}
              </span>
              <span className="text-sm font-bold text-orange-300">
                {plan.advisory.maxGustKmh} km/h
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {plan.advisory.segments.map((seg) => (
              <div
                key={seg.waypointId}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <span>
                    {seg.segmentIndex + 1}. {seg.title}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-300">
                  T{seg.hikingDifficultyTier} · {seg.plannedDate} · {seg.maxSlopeDeg}° · WC{' '}
                  {seg.expectedWindChillC}°C
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <PolarLiabilityBanner locale={typedLocale} />
    </div>
  );
}

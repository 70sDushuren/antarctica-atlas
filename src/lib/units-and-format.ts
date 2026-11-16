import type { SupportedLocale } from '@/i18n/routing';
import type { UnitSystem } from './types';

const INTL_LOCALE_MAP: Record<SupportedLocale, string> = {
  en: 'en-US',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'yue-Hant': 'zh-HK',
  pt: 'pt-BR',
  es: 'es-AR'
};

export function formatLocalizedNumber(
  value: number,
  locale: SupportedLocale,
  fractionDigits = 1
): string {
  return new Intl.NumberFormat(INTL_LOCALE_MAP[locale] ?? 'en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}

export function celsiusToFahrenheit(tempC: number): number {
  return (tempC * 9) / 5 + 32;
}

export function kmhToKnots(speedKmh: number): number {
  return speedKmh / 1.852;
}

export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

export function formatPolarTemperature(
  tempC: number,
  units: UnitSystem,
  locale: SupportedLocale
): string {
  if (units === 'imperial') {
    return `${formatLocalizedNumber(celsiusToFahrenheit(tempC), locale, 1)} °F`;
  }
  return `${formatLocalizedNumber(tempC, locale, 1)} °C`;
}

export function formatPolarWindSpeed(
  speedKmh: number,
  units: UnitSystem,
  locale: SupportedLocale
): string {
  if (units === 'nautical' || units === 'imperial') {
    return `${formatLocalizedNumber(kmhToKnots(speedKmh), locale, 1)} kt`;
  }
  return `${formatLocalizedNumber(speedKmh, locale, 1)} km/h`;
}

export function formatPolarLength(
  meters: number,
  units: UnitSystem,
  locale: SupportedLocale,
  fractionDigits = 1
): string {
  if (units === 'imperial') {
    return `${formatLocalizedNumber(metersToFeet(meters), locale, fractionDigits)} ft`;
  }
  return `${formatLocalizedNumber(meters, locale, fractionDigits)} m`;
}

export function formatPolarTimestamp(isoString: string, locale: SupportedLocale): string {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat(INTL_LOCALE_MAP[locale] ?? 'en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  }).format(parsed);
}

/**
 * Resolves the appropriate Open-Meteo Forecast or Marine endpoint URL.
 * - Personal / Non-commercial mode (default): routes to free public `api.open-meteo.com` / `marine-api.open-meteo.com`.
 * - Commercial mode (when `OPEN_METEO_API_KEY` is configured): routes to `customer-api.open-meteo.com`
 *   and `customer-marine-api.open-meteo.com` with `apikey=` attached.
 */
export function buildOpenMeteoUrl(
  kind: 'forecast' | 'marine',
  queryWithoutLeadingMark: string
): string {
  const apiKey = process.env.OPEN_METEO_API_KEY?.trim();
  if (apiKey) {
    const host =
      kind === 'marine'
        ? 'https://customer-marine-api.open-meteo.com/v1/marine'
        : 'https://customer-api.open-meteo.com/v1/forecast';
    return `${host}?${queryWithoutLeadingMark}&apikey=${encodeURIComponent(apiKey)}`;
  }

  const host =
    kind === 'marine'
      ? 'https://marine-api.open-meteo.com/v1/marine'
      : 'https://api.open-meteo.com/v1/forecast';
  return `${host}?${queryWithoutLeadingMark}`;
}

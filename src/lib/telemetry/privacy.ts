import crypto from 'node:crypto';

/**
 * Generates a daily-rotated, irreversible visitor hash (16 hex chars)
 * from client IP + User-Agent + daily UTC salt so UV analytics in
 * Metabase / Grafana never store raw tracking identifiers.
 */
export function anonymizeVisitorHash(
  rawIp: string | null | undefined,
  userAgent: string | null | undefined,
  dateUtc: Date = new Date()
): string {
  const dayKey = dateUtc.toISOString().slice(0, 10);
  const pepper = process.env.TELEMETRY_HASH_PEPPER || 'antarctica-cryo-telemetry-v2';
  const ip = (rawIp || '0.0.0.0').split(',')[0].trim();
  const ua = (userAgent || 'unknown').slice(0, 180);

  return crypto
    .createHash('sha256')
    .update(`${pepper}:${dayKey}:${ip}:${ua}`)
    .digest('hex')
    .slice(0, 20);
}

/**
 * Masks the final octet of IPv4 (/24) or trailing segments of IPv6 (/48)
 * to return a valid PostgreSQL `inet` CIDR string without storing personal IPs.
 */
export function maskClientIpSubnet(rawIp: string | null | undefined): string | null {
  if (!rawIp) return null;
  const first = rawIp.split(',')[0].trim();
  if (!first) return null;

  // Strip IPv4-mapped IPv6 prefix if present
  const cleaned = first.startsWith('::ffff:') ? first.slice(7) : first;

  // IPv4 check
  const v4Match = cleaned.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4Match) {
    const octets = v4Match.slice(1, 5).map(Number);
    if (octets.every((n) => n >= 0 && n <= 255)) {
      return `${octets[0]}.${octets[1]}.${octets[2]}.0/24`;
    }
    return null;
  }

  // Basic IPv6 check: keep up to first 3 hextets (/48)
  if (cleaned.includes(':')) {
    const parts = cleaned.split(':').filter((p) => p.length > 0);
    if (parts.length >= 2 && parts.every((p) => /^[0-9a-fA-F]{1,4}$/.test(p))) {
      const top3 = [parts[0] || '0', parts[1] || '0', parts[2] || '0'];
      return `${top3.join(':')}::/48`;
    }
  }

  return null;
}

export function parseUserAgentSummary(uaRaw: string | null | undefined): {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot';
  browserFamily: string;
  osFamily: string;
} {
  const ua = uaRaw || '';
  if (/bot|crawler|spider|headless|slurp/i.test(ua)) {
    return { deviceType: 'bot', browserFamily: 'Bot', osFamily: 'Bot' };
  }

  const deviceType: 'mobile' | 'tablet' | 'desktop' = /ipad|tablet/i.test(ua)
    ? 'tablet'
    : /mobi|android|iphone/i.test(ua)
      ? 'mobile'
      : 'desktop';

  const browserFamily = /edg\//i.test(ua)
    ? 'Edge'
    : /opr\/|opera/i.test(ua)
      ? 'Opera'
      : /chrome|crios/i.test(ua)
        ? 'Chrome'
        : /firefox|fxios/i.test(ua)
          ? 'Firefox'
          : /safari/i.test(ua)
            ? 'Safari'
            : 'Other';

  const osFamily = /windows/i.test(ua)
    ? 'Windows'
    : /iphone|ipad|ipod/i.test(ua)
      ? 'iOS'
      : /android/i.test(ua)
        ? 'Android'
        : /mac os x|macintosh/i.test(ua)
          ? 'macOS'
          : /linux/i.test(ua)
            ? 'Linux'
            : 'Other';

  return { deviceType, browserFamily, osFamily };
}

export function extractSafeReferrerHost(referer: string | null | undefined): string | null {
  if (!referer) return null;
  try {
    const u = new URL(referer);
    return u.hostname.slice(0, 250) || null;
  } catch {
    return null;
  }
}

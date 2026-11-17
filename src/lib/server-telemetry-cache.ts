import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

interface CachedTelemetryEnvelope<T> {
  payload: T;
  updatedAtMs: number;
  hasLiveSnapshot: boolean;
  cooldownUntilMs: number;
}

interface GlobalTelemetryCacheState {
  entries: Map<string, CachedTelemetryEnvelope<unknown>>;
  inFlight: Map<string, Promise<void>>;
  hydratedFromDisk: boolean;
}

const DISK_CACHE_FILE = path.join(
  os.tmpdir(),
  'antarctica-atlas-server-telemetry-lkg-v2.json'
);

const globalCacheHolder = globalThis as unknown as {
  __atlasServerTelemetrySWR?: GlobalTelemetryCacheState;
};

function getCacheStore(): GlobalTelemetryCacheState {
  if (!globalCacheHolder.__atlasServerTelemetrySWR) {
    globalCacheHolder.__atlasServerTelemetrySWR = {
      entries: new Map(),
      inFlight: new Map(),
      hydratedFromDisk: false
    };
  }
  const store = globalCacheHolder.__atlasServerTelemetrySWR;

  if (!store.hydratedFromDisk) {
    store.hydratedFromDisk = true;
    try {
      if (fs.existsSync(DISK_CACHE_FILE)) {
        const raw = JSON.parse(fs.readFileSync(DISK_CACHE_FILE, 'utf8')) as Record<
          string,
          CachedTelemetryEnvelope<unknown>
        >;
        for (const [k, v] of Object.entries(raw)) {
          if (v && typeof v.updatedAtMs === 'number' && v.payload !== undefined) {
            store.entries.set(k, v);
          }
        }
      }
    } catch {
      // Ignore corrupted /tmp cache file
    }
  }
  return store;
}

function persistCacheToDisk(store: GlobalTelemetryCacheState): void {
  try {
    const obj: Record<string, CachedTelemetryEnvelope<unknown>> = {};
    for (const [k, v] of store.entries.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(DISK_CACHE_FILE, JSON.stringify(obj), 'utf8');
  } catch {
    // Read-only / serverless ephemeral fs safe no-op
  }
}

/**
 * Baseline-First Stale-While-Revalidate (SWR) Server Telemetry Manager:
 * - Always returns immediately (< 1ms) using the previous valid full snapshot (or baseline on cold boot),
 *   so client requests NEVER block waiting on upstream Open-Meteo HTTP calls.
 * - Triggers at most ONE deduplicated asynchronous background refresh per `freshTtlMs` window,
 *   strictly protecting upstream sync rate limits even under 100+ concurrent connections.
 */
export async function getOrAsyncRefreshServerTelemetry<T>(options: {
  key: string;
  freshTtlMs: number;
  errorCooldownMs?: number;
  buildBaseline: () => T;
  fetchLive: () => Promise<T>;
}): Promise<{
  data: T;
  cacheState: 'fresh' | 'stale-revalidating' | 'baseline-revalidating' | 'cooldown-baseline';
  updatedAtIso: string;
}> {
  const store = getCacheStore();
  const now = Date.now();
  const cooldownMs = options.errorCooldownMs ?? 5 * 60_000;

  let current = store.entries.get(options.key) as CachedTelemetryEnvelope<T> | undefined;
  if (!current) {
    current = {
      payload: options.buildBaseline(),
      updatedAtMs: 0,
      hasLiveSnapshot: false,
      cooldownUntilMs: 0
    };
    store.entries.set(options.key, current);
  }

  const isFresh =
    current.hasLiveSnapshot && now - current.updatedAtMs < options.freshTtlMs;

  if (isFresh) {
    return {
      data: current.payload,
      cacheState: 'fresh',
      updatedAtIso: new Date(current.updatedAtMs).toISOString()
    };
  }

  if (now < current.cooldownUntilMs) {
    return {
      data: current.payload,
      cacheState: 'cooldown-baseline',
      updatedAtIso: new Date(current.updatedAtMs || now).toISOString()
    };
  }

  // Schedule single-flight non-blocking background upstream sync
  if (!store.inFlight.has(options.key)) {
    const job = options
      .fetchLive()
      .then((freshData) => {
        const nextEntry: CachedTelemetryEnvelope<T> = {
          payload: freshData,
          updatedAtMs: Date.now(),
          hasLiveSnapshot: true,
          cooldownUntilMs: 0
        };
        store.entries.set(options.key, nextEntry);
        persistCacheToDisk(store);
      })
      .catch(() => {
        const prev = store.entries.get(options.key) as
          | CachedTelemetryEnvelope<T>
          | undefined;
        if (prev) {
          prev.cooldownUntilMs = Date.now() + cooldownMs;
          store.entries.set(options.key, prev);
        }
      })
      .finally(() => {
        store.inFlight.delete(options.key);
      });

    store.inFlight.set(options.key, job);
  }

  return {
    data: current.payload,
    cacheState: current.hasLiveSnapshot
      ? 'stale-revalidating'
      : 'baseline-revalidating',
    updatedAtIso: new Date(current.updatedAtMs || now).toISOString()
  };
}

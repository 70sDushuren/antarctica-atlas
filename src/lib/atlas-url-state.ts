'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  clampPolarGlobeLatDeg,
  DEFAULT_ATLAS_URL_STATE,
  LAST_VIEW_SESSION_STORAGE_KEY,
  normalizeLongitudeDeg,
  parseAtlasUrlState,
  resolveInitialAtlasState,
  safeReplaceUrlQuery,
  serializeAtlasUrlState
} from './atlas-url-core.ts';
import type { AtlasUrlState } from './types.ts';

export {
  clampPolarGlobeLatDeg,
  DEFAULT_ATLAS_URL_STATE,
  LAST_VIEW_SESSION_STORAGE_KEY,
  normalizeLongitudeDeg,
  parseAtlasUrlState,
  resolveInitialAtlasState,
  safeReplaceUrlQuery,
  serializeAtlasUrlState
};

export function useAtlasUrlState() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<AtlasUrlState>(() => {
    if (typeof window === 'undefined') {
      return parseAtlasUrlState(searchParams);
    }
    let sessionSnap: string | null = null;
    try {
      sessionSnap = window.sessionStorage.getItem(LAST_VIEW_SESSION_STORAGE_KEY);
    } catch {
      sessionSnap = null;
    }
    return resolveInitialAtlasState(
      searchParams,
      window.location.search,
      sessionSnap
    );
  });

  const latestQueryRef = useRef<string>(serializeAtlasUrlState(state));
  const lastHistoryWriteMsRef = useRef<number>(0);

  const updateAtlasState = useCallback((patch: Partial<AtlasUrlState>) => {
    setState((prev) => {
      const nextLat =
        typeof patch.centerLat === 'number'
          ? Math.max(-90, Math.min(0, patch.centerLat))
          : prev.centerLat;
      const nextLon =
        typeof patch.centerLon === 'number'
          ? normalizeLongitudeDeg(patch.centerLon)
          : prev.centerLon;

      return {
        ...prev,
        ...patch,
        centerLat: nextLat,
        centerLon: nextLon
      };
    });
  }, []);

  useEffect(() => {
    const serialized = serializeAtlasUrlState(state);
    latestQueryRef.current = serialized;

    try {
      window.sessionStorage.setItem(LAST_VIEW_SESSION_STORAGE_KEY, serialized);
    } catch {
      // Ignore storage quota / private mode
    }

    const MIN_INTERVAL_MS = 240;
    const elapsed = Date.now() - lastHistoryWriteMsRef.current;

    if (elapsed >= MIN_INTERVAL_MS) {
      lastHistoryWriteMsRef.current = Date.now();
      safeReplaceUrlQuery(window.location.pathname, serialized);
      return;
    }

    const timer = setTimeout(() => {
      lastHistoryWriteMsRef.current = Date.now();
      safeReplaceUrlQuery(window.location.pathname, latestQueryRef.current);
    }, MIN_INTERVAL_MS - elapsed);

    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        safeReplaceUrlQuery(window.location.pathname, latestQueryRef.current);
      }
    };
  }, []);

  return { atlasState: state, updateAtlasState };
}

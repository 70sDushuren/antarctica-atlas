'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { SupportedLocale } from '@/i18n/routing';
import type { AtlasTabId, TelemetryEventInput } from '@/lib/types';

const SESSION_STORAGE_KEY = 'antarctica_atlas_session_key_v2';

function getOrCreateBrowserSessionKey(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const generated =
      Math.random().toString(36).slice(2, 12) + '-' + Date.now().toString(36);
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return 'ephemeral-' + Date.now().toString(36);
  }
}

/**
 * Lightweight buffered telemetry hook that batches spatial & UI drill-down events
 * and flushes via `navigator.sendBeacon` without impacting 2D/3D canvas frame rates.
 */
export function useAtlasTelemetry(locale: SupportedLocale, activeTab: AtlasTabId) {
  const queueRef = useRef<TelemetryEventInput[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabEnteredAtRef = useRef<number>(Date.now());
  const prevTabRef = useRef<AtlasTabId>(activeTab);

  const flushQueue = useCallback(() => {
    if (queueRef.current.length === 0 || typeof window === 'undefined') return;
    const batch = queueRef.current.splice(0, 25);
    const payload = JSON.stringify({ events: batch });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/telemetry/events', blob);
    } else {
      fetch('/api/telemetry/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  }, []);

  const trackEvent = useCallback(
    (
      event: Omit<TelemetryEventInput, 'sessionKey' | 'locale' | 'activeTab'> & {
        activeTab?: AtlasTabId;
      }
    ) => {
      if (typeof window === 'undefined') return;
      queueRef.current.push({
        sessionKey: getOrCreateBrowserSessionKey(),
        locale,
        activeTab: event.activeTab ?? activeTab,
        ...event
      });

      if (queueRef.current.length >= 10) {
        flushQueue();
        return;
      }

      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          flushQueue();
        }, 3000);
      }
    },
    [locale, activeTab, flushQueue]
  );

  // Track tab dwell time & activation automatically
  useEffect(() => {
    const now = Date.now();
    if (prevTabRef.current !== activeTab) {
      const dwellMs = Math.max(0, now - tabEnteredAtRef.current);
      trackEvent({
        eventCategory: 'navigation',
        eventName: 'tab_dwell_complete',
        activeTab: prevTabRef.current,
        dwellMs
      });
      trackEvent({
        eventCategory: 'navigation',
        eventName: 'tab_switch',
        activeTab
      });
      prevTabRef.current = activeTab;
      tabEnteredAtRef.current = now;
    }
  }, [activeTab, trackEvent]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushQueue();
      }
    };
    window.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      flushQueue();
    };
  }, [flushQueue]);

  return { trackEvent };
}

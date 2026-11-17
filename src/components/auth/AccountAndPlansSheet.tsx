'use client';

import { useState } from 'react';
import {
  Check,
  Copy,
  FolderOpen,
  Globe,
  Lock,
  LogOut,
  Trash2,
  UserCheck,
  X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import type {
  AuthenticatedUser,
  MapViewMode,
  SavedUserItinerary,
  UnitSystem
} from '@/lib/types';

export interface AccountAndPlansSheetProps {
  isOpen: boolean;
  locale: SupportedLocale;
  currentUnits: UnitSystem;
  currentMode: MapViewMode;
  user: AuthenticatedUser | null;
  oauthProviders: { github: boolean; google: boolean };
  savedPlans: SavedUserItinerary[];
  onClose: () => void;
  onAuthSuccess: (user: AuthenticatedUser) => void;
  onSignOut: () => Promise<void>;
  onLoadSavedPlan: (plan: SavedUserItinerary) => void;
  onDeleteSavedPlan: (planId: string) => Promise<void>;
  onAccountDeleted: () => void;
}

export function AccountAndPlansSheet({
  isOpen,
  locale,
  currentUnits,
  currentMode,
  user,
  oauthProviders,
  savedPlans,
  onClose,
  onAuthSuccess,
  onSignOut,
  onLoadSavedPlan,
  onDeleteSavedPlan,
  onAccountDeleted
}: AccountAndPlansSheetProps) {
  const tAuth = useTranslations('auth');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 8) {
      setErrorMsg(tAuth('errPasswordShort'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: authTab,
          email,
          password,
          displayName,
          preferredLocale: locale,
          preferredUnits: currentUnits,
          preferredMode: currentMode
        })
      });
      const data = (await res.json()) as {
        user?: AuthenticatedUser;
        error?: string;
      };
      if (!res.ok || !data.user) {
        if (data.error === 'EMAIL_ALREADY_EXISTS') {
          setErrorMsg(tAuth('errEmailExists'));
        } else if (data.error === 'INVALID_CREDENTIALS') {
          setErrorMsg(tAuth('errInvalidCredentials'));
        } else {
          setErrorMsg(tAuth('errGeneric'));
        }
        return;
      }

      setPassword('');
      onAuthSuccess(data.user);
    } catch {
      setErrorMsg(tAuth('errGeneric'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGdprDelete() {
    if (typeof window !== 'undefined' && !window.confirm(tAuth('gdprConfirmPrompt'))) {
      return;
    }
    const res = await fetch('/api/user/account', { method: 'DELETE' });
    if (res.ok) {
      onAccountDeleted();
      onClose();
    }
  }

  function copyShareUrl(plan: SavedUserItinerary) {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/${locale}/plan/${plan.shareSlug}`;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedId(plan.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm p-3 md:p-5">
      <div
        role="dialog"
        aria-label={tAuth('sheetTitle')}
        className="cryo-card w-full max-w-md rounded-2xl p-5 flex flex-col justify-between overflow-y-auto max-h-full space-y-5"
      >
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-sky-300">{tAuth('sheetTitle')}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!user ? (
            <>
              <div className="rounded-xl border border-sky-400/25 bg-sky-500/10 p-3 text-xs leading-relaxed text-slate-200">
                {tAuth('guestBanner')}
              </div>

              <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-700 bg-slate-950/70 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setErrorMsg(null);
                  }}
                  className={`rounded-lg py-1.5 font-semibold transition ${
                    authTab === 'login'
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tAuth('tabSignIn')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setErrorMsg(null);
                  }}
                  className={`rounded-lg py-1.5 font-semibold transition ${
                    authTab === 'register'
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tAuth('tabRegister')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {authTab === 'register' && (
                  <label className="block space-y-1 text-slate-300">
                    <span>{tAuth('displayNameLabel')}</span>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </label>
                )}

                <label className="block space-y-1 text-slate-300">
                  <span>{tAuth('emailLabel')}</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </label>

                <label className="block space-y-1 text-slate-300">
                  <span>{tAuth('passwordLabel')}</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </label>

                {errorMsg && (
                  <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-rose-200">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-sky-400 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-300 disabled:opacity-50 transition"
                >
                  {authTab === 'login'
                    ? tAuth('submitSignIn')
                    : tAuth('submitRegister')}
                </button>
              </form>

              {(oauthProviders.github || oauthProviders.google) && (
                <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                  {oauthProviders.github && (
                    <a
                      href={`/api/auth/oauth/github?locale=${locale}`}
                      className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 py-2 font-medium text-slate-200 hover:border-sky-400"
                    >
                      {tAuth('oauthGithub')}
                    </a>
                  )}
                  {oauthProviders.google && (
                    <a
                      href={`/api/auth/oauth/google?locale=${locale}`}
                      className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 py-2 font-medium text-slate-200 hover:border-sky-400"
                    >
                      {tAuth('oauthGoogle')}
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {/* Signed-In Badge */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                    <UserCheck className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {tAuth('signedInAs', { name: user.displayName })}
                    </span>
                  </div>
                  <div className="truncate text-[11px] text-slate-400">{user.email}</div>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-200 hover:text-white shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{tAuth('signOutBtn')}</span>
                </button>
              </div>

              {/* Saved Cloud Plans */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                  {tAuth('savedPlansTitle')} ({savedPlans.length})
                </h3>

                {savedPlans.length === 0 ? (
                  <p className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
                    {tAuth('noSavedPlans')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {savedPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-xl border border-slate-700/70 bg-slate-950/65 p-3 text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate">
                              {plan.title}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">
                              T{plan.overallDifficulty} · {plan.totalDistanceKm} km ·{' '}
                              {plan.waypoints.length} pts
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] shrink-0 ${
                              plan.isPublic
                                ? 'bg-sky-500/15 text-sky-200'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {plan.isPublic ? (
                              <Globe className="h-2.5 w-2.5" />
                            ) : (
                              <Lock className="h-2.5 w-2.5" />
                            )}
                            <span>
                              {plan.isPublic
                                ? tAuth('publicBadge')
                                : tAuth('privateBadge')}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onLoadSavedPlan(plan);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-sky-400 px-2.5 py-1 text-[11px] font-semibold text-slate-950 hover:bg-sky-300"
                          >
                            <FolderOpen className="h-3 w-3" />
                            <span>{tAuth('loadPlanBtn')}</span>
                          </button>

                          {plan.isPublic && (
                            <button
                              type="button"
                              onClick={() => copyShareUrl(plan)}
                              className="inline-flex items-center gap-1 rounded-lg border border-sky-400/35 bg-slate-900 px-2.5 py-1 text-[11px] text-sky-200 hover:border-sky-400"
                            >
                              {copiedId === plan.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              <span>
                                {copiedId === plan.id
                                  ? tAuth('copiedToast')
                                  : tAuth('copyShareLink')}
                              </span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDeleteSavedPlan(plan.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-200 hover:border-rose-400 ml-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{tAuth('deletePlanBtn')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* GDPR Account Erasure Footer */}
        {user && (
          <div className="border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={handleGdprDelete}
              className="w-full rounded-xl border border-rose-500/35 bg-rose-500/10 py-2 text-[11px] font-medium text-rose-200 hover:border-rose-400 transition"
            >
              {tAuth('gdprDeleteBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

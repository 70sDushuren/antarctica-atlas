---
name: multilingual-polar-qa
description: Validates 100% translation key parity, authentic Cantonese (yue-Hant) vs. written Traditional Chinese (zh-TW) linguistic distinction, Spanish/Portuguese UI layout resilience, and SEO hreflang metadata across all 6 locales (en, zh-CN, zh-TW, yue-Hant, pt, es). Load whenever adding or modifying UI text, data catalogs, or running QA.
---

# Multilingual Polar QA & Six-Locale Verification Skill

## 1. Automated Key-Parity Verification (`npm run validate:i18n`)
Before marking any UI or data milestone complete, execute `npm run validate:i18n`. The validator checks:
1. All 6 locale files (`messages/en.json`, `messages/zh-CN.json`, `messages/zh-TW.json`, `messages/yue-Hant.json`, `messages/pt.json`, `messages/es.json`) exist and parse as valid JSON.
2. Flattened dot-notation keys match `en.json` 1:1 (zero missing keys, zero orphan keys, zero empty/whitespace-only strings).
3. Every localized object in `src/data/` (`Record<SupportedLocale, string>`) provides non-empty strings for all 6 locales.
4. Linguistic sanity check: `yue-Hant.json` MUST NOT be byte-identical to `zh-TW.json` across narrative and UI guidance namespaces.

## 2. Authentic Cantonese (`yue-Hant`) Authoring Checklist
When authoring `yue-Hant` strings:
- Use authentic Cantonese particles, copulas, prepositions, and demonstratives in Traditional script:
  - `係` (is), `唔係` (is not), `喺` (at/in), `嘅` (possessive/attributive), `同埋` (and), `而家` (now/live), `睇下` / `透視` (view/inspect), `揀` (select), `呢度` / `呢條航線` (here / this route), `嗰陣時` (at that time).
- Keep formal scientific units, station names (`長城站`, `阿蒙森-斯科特南極點站`, `費拉斯司令站`), and treaty codes (`HSM-93`, `EPSG:3031`) precise and dignified.

## 3. Browser Visual & Overflow Inspection
When verifying UI components in [Google Antigravity](https://antigravity.google/docs/artifacts/):
- Test `/es` and `/pt` specifically on narrow viewports (`390px` mobile and `1280px` compact desktop) to verify navigation pills, corridor selectors, and telemetry badges wrap cleanly without overlapping map controls.
- Confirm switching locales in `LanguageSwitcher` preserves URL search params (`?mode=2d&corridor=peninsula-weddell&station=great-wall`) so zero user context is lost.

## 4. Mandatory 3D/2D Interactive UI Stress & Camera-Persistence Acceptance Tests
Before marking any release or UI change complete, execute both `npm test` (`tests/ui-globe-interaction.test.mts`) and live browser interaction checks:
1. **High-Frequency 3D Globe Multi-Turn Drag & Wheel Zoom**: Drag-rotate the 3D Polar Globe continuously for > 3 seconds across multiple 360° revolutions (`±180°` wrap) and scroll-zoom rapidly. Verify zero `SecurityError` (`history.replaceState` rate limit) or React Error Boundary (`error.tsx`) interruptions occur.
2. **High-Frequency Slider & Tab Switching**: Scrub the Bedmap3 Ice-Peel slider (`0% ↔ 100%`) rapidly while switching between 3D Globe and 2D `EPSG:3031` Map and across the 4 workspace tabs.
3. **Camera & Context Persistence on Reload / Recovery**: After rotating to a non-default coordinate (e.g., Ross Sea `-77.85°, 166.67°`), verify reloading, switching locales, or recovering state preserves the exact rotated `(lat, lon, zoom, tab, peel)` position rather than resetting to initial defaults.

# Six-Locale Internationalization (`i18n`) & Polar Terminology Rules

## 1. Mandatory Six Supported Locales
All routes, UI components, map legends, tooltips, station profiles, geological descriptions, and historical timelines in `Antarctica Atlas` MUST support all six BCP 47 locales via [next-intl](https://next-intl.dev/docs/getting-started/app-router) ([Next.js i18n Guide](https://nextjs.org/docs/app/guides/internationalization)):
1. `en` — **English** (Default fallback & international scientific baseline)
2. `zh-CN` — **简体中文** (Mainland China standard polar terminology)
3. `zh-TW` — **繁體中文** (Standard written Traditional Chinese / 現代書面語繁體)
4. `yue-Hant` — **繁體粵語** (Authentic written Cantonese vernacular / 地道粵文書面表達)
5. `pt` — **Português** (Portuguese — Lusophone & Brazilian Antarctic Program terminology)
6. `es` — **Español** (Spanish — Ushuaia / Punta Arenas gateway & Argentine/Chilean polar terminology)

## 2. Strict Distinction Between `zh-TW` and `yue-Hant`
- **NEVER** copy `zh-TW` strings verbatim into `yue-Hant` or rely on naive Simplified-to-Traditional character mapping for Cantonese.
- `zh-TW` MUST use formal standard written Chinese (e.g., `即時天氣與海冰監測`, `目前選擇的考察航線`, `冰蓋下方是什麼？`).
- `yue-Hant` MUST use natural, idiomatic Cantonese lexical and grammatical forms in Traditional characters (e.g., `實時天氣同海冰監測`, `而家揀緊嘅考察航線`, `揭開冰蓋睇下底層基岩係點`, `呢度係德雷克海峽風浪指數`), while keeping formal scientific terms, station names, and explorer names accurate in Traditional Chinese characters.

## 3. Polar Toponymy & Multilingual Gazetteer Fidelity
- Cross-reference multi-national place names against the [SCAR Composite Gazetteer of Antarctica (CGA)](https://placenames.aq/):
  - In `es`, include established Spanish polar place names where applicable (e.g., *Pasaje de Drake*, *Isla Decepción*, *Bahía Esperanza*, *Mar de Weddell*).
  - In `pt`, use established Portuguese equivalents (e.g., *Passagem de Drake*, *Ilha Decepção*, *Estação Antártica Comandante Ferraz*).
  - In `zh-CN`, `zh-TW`, and `yue-Hant`, use authoritative Chinese polar names (`德雷克海峡/德雷克海峽`, `威德尔海/威德爾海`, `长城站/長城站`, `中山站`, `秦岭站/秦嶺站`).

## 4. Layout Resilience & Stateful Switching
- Spanish (`es`) and Portuguese (`pt`) UI strings are typically 25%–35% longer than English or Chinese. Never hardcode narrow fixed widths (`w-24`, `h-8` with `overflow-hidden`) on buttons, tabs, or HUD badges; always use `min-w-0`, `flex-wrap`, and responsive padding.
- Switching locales in the top-bar selector MUST keep the user on the current view and preserve map coordinates, 2D/3D mode, unit preferences (`°C/°F`, `kt/km/h`), and active drawers.
- Every build MUST pass `npm run validate:i18n` with 100% key parity and zero empty strings across all 6 JSON files in `messages/`.

## Summary
<!-- Briefly describe the scope of changes and which roadmap phase/module this PR advances -->

## Antarctica Atlas Guardrail Checklist
- [ ] **Architecture (Option A Serverless)**: Zero stateful databases introduced; external meteorological/marine/sea-ice requests batched in Next.js Route Handlers with `revalidate` caching and offline fallback snapshots.
- [ ] **Polar Spatial Fidelity (`EPSG:3031` ⇄ `3D Globe`)**: Camera coordinates, active corridor, and selected station/HSM sync across 2D/3D switches; Ross Sea `±180°` anti-meridian paths render with zero horizontal seam artifacts.
- [ ] **Six-Locale Parity (`en`, `zh-CN`, `zh-TW`, `yue-Hant`, `pt`, `es`)**: `npm run validate:i18n` passes 100%; `yue-Hant` uses authentic Cantonese phrasing (not copied `zh-TW`); `es`/`pt` long strings wrap cleanly without clipping.
- [ ] **Authoritative Scientific Attribution**: Clickable source citations included (Open-Meteo ECMWF/Marine, UW-Madison AMRDC, NASA GIBS, NSIDC, BAS Bedmap3, SCAR GeoMAP/ADD/CGA, COMNAP, ATCM HSM, IAATO).

## Verification
- [ ] `npm run verify` passes locally with zero errors

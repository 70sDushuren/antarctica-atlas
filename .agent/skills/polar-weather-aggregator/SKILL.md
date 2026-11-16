---
name: polar-weather-aggregator
description: Guides server-side batch ingestion from Open-Meteo Weather and Marine APIs, extreme polar wind-chill computation, katabatic gust alerts, solar polar day/night geometry, and the 5-tier Drake Passage sea-state index. Load whenever building weather API routes, station cards, or expedition corridor briefings.
---

# Polar Weather, Katabatic Gust & Marine Sea-State Aggregator Skill

## 1. Multi-Coordinate Batch Fetching Pattern
Use [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs) and [Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api) batch syntax in Next.js server routes:
- Pass comma-separated arrays `latitude=-62.22,-77.85,-90.00,...&longitude=-58.96,166.67,0.00,...` in a **single** HTTP GET call (up to 50 locations per call).
- Required current & hourly/daily variables:
  - **Atmospheric**: `temperature_2m`, `apparent_temperature`, `surface_pressure`, `wind_speed_10m`, `wind_gusts_10m`, `wind_direction_10m`, `snowfall`, `cloud_cover`, `weather_code`.
  - **Marine (Drake Passage, Weddell Sea, Ross Sea)**: `wave_height`, `wave_direction`, `wave_period`, `swell_wave_height`, `sea_surface_temperature`.

## 2. Polar Wind-Chill & Katabatic Gust Classification
- Compute standard NWS/Environment Canada Wind Chill (`T_wc` in °C) when `T <= 10°C` and `V_kmh > 4.8 km/h`:
  `T_wc = 13.12 + 0.6215 * T - 11.37 * (V_kmh ^ 0.16) + 0.3965 * T * (V_kmh ^ 0.16)`
- **Katabatic / Gale Hazard Tiers**:
  - `Calm / Moderate`: Gusts `< 35 kt` (`< 65 km/h`)
  - `Katabatic Watch (Strong Gale)`: Gusts `35–55 kt` (`65–102 km/h`) — suspend zodiac operations
  - `Severe Blizzard / Hurricane-Force Katabatic`: Gusts `> 55 kt` (`> 102 km/h`) — Condition 1/2 shelter protocol

## 3. Five-Tier Drake Passage Sea-State Scale (`Drake Shake Index`)
Classify `significantWaveHeightM` (`Hs`) across the Drake Passage corridor (`56°S–62°S, 68°W–60°W`):
1. **Tier 1 — Drake Lake (`Hs < 2.0 m`)**: Calm swell, smooth crossing.
2. **Tier 2 — Gentle Southern Ocean (`2.0 m <= Hs < 3.5 m`)**: Moderate rolling motion, normal expedition cruising.
3. **Tier 3 — Classic Drake Roll (`3.5 m <= Hs < 5.5 m`)**: Fresh gale swell, active stabilizers engaged.
4. **Tier 4 — Drake Shake (`5.5 m <= Hs < 8.0 m`)**: Heavy Southern Ocean storm seas, outer decks restricted.
5. **Tier 5 — Extreme Drake Tempest (`Hs >= 8.0 m`)**: Severe cyclonic sea state, course/timing adjustment advised.

## 4. Solar Elevation & Polar Day / Polar Night Calculation
For any latitude `φ` (`-60°` to `-90°`) and day of year, compute solar declination `δ` to display:
- **24h Polar Day (Midnight Sun)**: `φ + δ <= -90°` (when `δ < 0` in austral summer, Oct–Mar).
- **24h Polar Night**: `φ - δ <= -90°` (when `δ > 0` in austral winter, Apr–Sep).
- **Twilight / Daylight Hours**: Exact daily sunlight duration and golden-hour photography window for peninsula latitudes (`62°S–68°S`).

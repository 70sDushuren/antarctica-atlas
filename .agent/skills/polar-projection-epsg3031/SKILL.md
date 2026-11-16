---
name: polar-projection-epsg3031
description: Enforces accurate WGS84 to EPSG:3031 Antarctic Polar Stereographic projection math, anti-meridian (±180° Ross Sea) seam prevention, Bedmap3 cross-section bilinear interpolation, and 2D/3D camera synchronization. Load whenever working on map components, coordinate transforms, NASA GIBS tiles, or elevation cross-sections.
---

# Polar Projection (`EPSG:3031`) & Subglacial Geometry Skill

## 1. Canonical `EPSG:3031` Definition
Always use the official [EPSG:3031 (WGS 84 / Antarctic Polar Stereographic)](https://spatialreference.org/ref/epsg/3031/) Proj4 string across Python data-prep scripts and TypeScript client code:
```text
+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs
```
- **Origin `(0, 0)`**: Geographic South Pole (`90°S`).
- ** orientation**: `0°` Prime Meridian points **up/north** (`+Y` axis in standard GIBS/ADD orientation: verify axis orientation with `lon=0 -> x=0, y>0`; `lon=90E -> x>0, y=0`; `lon=90W -> x<0, y=0`; `lon=180 -> x=0, y<0`).
- **Golden Control Points (Unit Test Benchmarks)**:
  1. Geographic South Pole (`lat: -90.0, lon: 0.0`) → `x = 0 m, y = 0 m`
  2. McMurdo Station (`lat: -77.8463, lon: 166.6682`) → `x ≈ +309,000 m, y ≈ -1,313,000 m`
  3. Great Wall Station (`lat: -62.2163, lon: -58.9622`) → `x ≈ -2,608,000 m, y ≈ +1,568,000 m`

## 2. NASA GIBS `EPSG:3031` WMTS Tile Alignment
When configuring [NASA GIBS EPSG:3031 WMTS](https://nasa-gibs.github.io/gibs-api-docs/access-basics/) in Leaflet (`L.Proj.CRS`), align strictly with the [GIBS Antarctic EPSG:3031 Leaflet specification](https://nasa-gibs.github.io/gibs-web-examples/examples/leaflet/antarctic-epsg3031.html):
- Tile Matrix Origin: `[-4194304, 4194304]`
- Resolutions (meters/pixel): `[8192, 4096, 2048, 1024, 512, 256]`
- Tile Size: `512` px

## 3. Anti-Meridian (`±180°`) Seam Safety
- The `180°` meridian bisects the Ross Sea, Ross Ice Shelf, and the historic Amundsen/Scott South Pole routes.
- **In 2D `EPSG:3031`**: Project `(lat, lon)` vertices to `(x, y)` meters FIRST or render via Leaflet's projected CRS so lines crossing `179.9°E → -179.9°W` connect smoothly across `x ≈ 0, y < 0` with zero horizontal wrap artifacts.
- **In 3D Globe**: Densify great-circle segments every `<= 1.5°` of arc and pass Cartesian 3D coordinates (`ECEF`) rather than linear Mercator longitude interpolation.

## 4. Subglacial Cross-Section Interpolation
- When sampling a user-drawn transect between Point A `(x1, y1)` and Point B `(x2, y2)` in `EPSG:3031` meter space, step uniformly in planar distance (`ds`, e.g., 150–250 sample points along Euclidean distance `sqrt((x2-x1)^2 + (y2-y1)^2)`), NOT linear `(lat, lon)` interpolation (which curves away from the true polar geodesic near 90°S).
- At each sample point, compute `surfaceElevationM`, `bedElevationM`, and `iceThicknessM = max(0, surfaceElevationM - bedElevationM)`, flagging `isMarineBasedIceSheet = bedElevationM < 0 && iceThicknessM > 0`.

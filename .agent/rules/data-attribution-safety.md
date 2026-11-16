# Scientific Data Attribution, Rate-Limit Etiquette & Grounding Rules

## 1. Upstream Public API Etiquette (Anti-Ban Guardrails)
- **Batch Server-Side Fetching Only**: Never loop client-side `fetch()` calls across 30+ Antarctic stations in the browser. Always batch station and corridor coordinates into a single comma-separated multi-location request inside Next.js Route Handlers against [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs) and [Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api).
- **Mandatory Edge / Revalidation Caching**: Every external data fetch MUST configure Next.js `next: { revalidate: 1800 }` (30 minutes for weather/waves) or `revalidate: 21600` (6 hours for sea ice), paired with graceful fallback to verified baseline data when upstream endpoints time out.

## 2. Verifiable Attribution & Clickable Source Links
Every dashboard module, data drawer, and footer credits panel MUST display clickable attribution links to the exact authoritative datasets powering that view:
- **Meteorology & Marine Waves**: [Open-Meteo Weather & ECMWF IFS API](https://open-meteo.com/en/docs/ecmwf-api), [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api), and [UW-Madison AMRDC Automatic Weather Stations](https://amrdc.ssec.wisc.edu/real-time-data/surface/aws-weather-maps-and-plots).
- **Satellite Imagery & Sea Ice**: [NASA Earthdata GIBS (EPSG:3031)](https://nasa-gibs.github.io/gibs-api-docs/access-basics/), [NSIDC Sea Ice Index v4](https://nsidc.org/data/g02135/versions/4), and [EUMETSAT OSI SAF Sea-Ice Index](https://osi-saf.eumetsat.int/sea-ice-index).
- **Subglacial Bedrock, Elevation & Geology**: [British Antarctic Survey Bedmap3](https://www.bas.ac.uk/project/bedmap3/) ([BAS Data Record](https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615)), [SCAR GeoMAP (GNS Science)](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/), and [PGC REMA](https://www.pgc.umn.edu/data/rema/).
- **Geography, Stations & Heritage**: [SCAR Antarctic Digital Database (ADD)](https://www.bas.ac.uk/project/add/), [COMNAP Antarctic Facilities](https://www.comnap.aq/antarctic-facilities-information), [SCAR Composite Gazetteer of Antarctica (CGA)](https://placenames.aq/), [Antarctic Treaty HSM List (45 CFR 670.29)](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29), and [IAATO Visitor Guidelines](https://iaato.org/visiting-antarctica/visitor-guidelines-library).

## 3. Zero Fabricated Scientific Claims
- Never invent fictional research stations, fake historical expedition dates, or unverified geological elevations. All coordinates, elevations, establishment years, and HSM numbers must match verified Antarctic records.

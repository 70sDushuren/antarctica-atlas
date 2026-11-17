# Legal Notices, Scientific Data Attribution & Third-Party Licenses

## 1. Project Source Code License
The original source code, UI architecture, and six-locale editorial translations of **Antarctica Atlas** are licensed under the **MIT License** (see [`LICENSE`](./LICENSE)).

---

## 2. Scientific Datasets, API Terms & CC BY 4.0 Attribution

Antarctica Atlas integrates and adapts open scientific datasets and public meteorological feeds. Nothing in this project implies endorsement by the original scientific institutions, treaty bodies, or data providers.

### 2.1 Creative Commons Attribution 4.0 International (`CC BY 4.0`) Datasets
License text: <https://creativecommons.org/licenses/by/4.0/>

1. **Open-Meteo Weather Forecast & Marine Weather API (with ECMWF IFS Open Data)**
   - **Portal**: <https://open-meteo.com/en/docs> · <https://open-meteo.com/en/docs/marine-weather-api>
   - **Data License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (*"Weather data by Open-Meteo.com"*; underlying numerical weather prediction includes open data from [ECMWF](https://www.ecmwf.int/) under CC BY 4.0).
   - **API Usage Notice (Non-Commercial Free Tier)**: Open-Meteo’s public free API endpoint (`api.open-meteo.com` / `marine-api.open-meteo.com`) is restricted to **non-commercial** personal, educational, academic, and open-source use. Any commercial deployment, ad-monetized portal, or paid product reusing this codebase **must** subscribe to an official [Open-Meteo Commercial API plan](https://open-meteo.com/en/pricing) and configure commercial endpoints.
   - **Adaptation**: Aggregated server-side with 30-minute edge caching (`revalidate = 1800`) and paired with polar wind-chill, Katabatic gust tiering, and 5-tier Drake Passage wave classification.

2. **British Antarctic Survey (BAS) — Bedmap3 Ice Thickness, Bed & Surface Elevation**
   - **Portal**: <https://www.bas.ac.uk/project/bedmap3/> · [BAS Data Catalogue](https://data.bas.ac.uk/full-record.php?id=GB/NERC/BAS/PDC/01615)
   - **Citation**: Frémand, A. C., Fretwell, P., Bodart, J. A., Pritchard, H. D., et al. (2023/2025). *Bedmap3 updated ice bed, surface and thickness gridded datasets for Antarctica*. British Antarctic Survey / NERC EDS UK Polar Data Centre.
   - **License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
   - **Modification / Adaptation Disclosure**: `public/geo-data/subglacial-bedmap-grid.json` is a simplified, lightweight `100 km` planar `EPSG:3031` web-resampled representation derived from Antarctic physiographic benchmarks for real-time browser cross-section profiling (`< 100 KB`), and is not a substitute for raw full-resolution BAS GIS rasters.

3. **SCAR GeoMAP — Geological Mapping of Antarctica (GNS Science)**
   - **Portal**: <https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/> · <https://scar.org/library-data/maps/geomap-geological-mapping>
   - **Citation**: Cox, S. C., Smith Lyttle, B., Elkind, S., et al. (2023). *A continent-wide detailed geological map dataset of Antarctica*. Scientific Data, 10, 250.
   - **License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
   - **Modification / Adaptation Disclosure**: Curated into multilingual (`en`, `zh-CN`, `zh-TW`, `yue-Hant`, `pt`, `es`) landmark profiles in `src/data/geology-and-gazetteer.ts`.

4. **SCAR Antarctic Digital Database (ADD) & SCAR Composite Gazetteer of Antarctica (CGA)**
   - **Portals**: <https://www.bas.ac.uk/project/add/> · <https://placenames.aq/>
   - **License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (Scientific Committee on Antarctic Research).
   - **Modification / Adaptation Disclosure**: `public/geo-data/antarctica-outline-epsg3031.json` provides simplified continental coastline and ice-shelf vector rings projected in `EPSG:3031` for lightweight web rendering; multilingual place-name etymologies in `src/data/geology-and-gazetteer.ts` synthesize historical SCAR CGA naming records across six languages.

5. **Council of Managers of National Antarctic Programs (COMNAP) — Antarctic Facilities**
   - **Portal**: <https://www.comnap.aq/antarctic-facilities-information>
   - **License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
   - **Modification / Adaptation Disclosure**: Selected station coordinates, elevations, capacities, and six-locale educational summaries compiled in `src/data/stations.ts`.

6. **EUMETSAT Ocean and Sea Ice Satellite Application Facility (OSI SAF)**
   - **Portal**: <https://osi-saf.eumetsat.int/sea-ice-index>
   - **License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (© EUMETSAT).

### 2.2 Open Government, Public Domain & Regulatory Reference Sources

7. **NASA Earthdata Global Imagery Browse Services (GIBS — `EPSG:3031` WMTS)**
   - **Portal**: <https://nasa-gibs.github.io/gibs-api-docs/access-basics/>
   - **Policy**: NASA Earth Science Data and Information Policy (free and unrestricted open data). Imagery courtesy of NASA EOSDIS GIBS.

8. **National Snow and Ice Data Center (NSIDC) — Sea Ice Index, Version 4 (`G02135`)**
   - **Portal**: <https://nsidc.org/data/g02135/versions/4>
   - **Citation**: Fetterer, F., Knowles, K., Meier, W. N., Savoie, M., & Windnagel, A. K. *Sea Ice Index, Version 4*. Boulder, Colorado USA. NSIDC: National Snow and Ice Data Center.

9. **UW-Madison Antarctic Meteorological Research and Data Center (AMRDC) & PGC REMA**
   - **Portals**: <https://amrdc.ssec.wisc.edu/> · <https://www.pgc.umn.edu/data/rema/>
   - **Acknowledgment**: Climatological extremes referenced from UW-Madison SSEC/AMRDC (NSF-supported); elevation benchmarks referenced from the Reference Elevation Model of Antarctica (REMA, Polar Geospatial Center, University of Minnesota).

10. **Antarctic Treaty Historic Sites & Monuments (ATCM HSM / `45 CFR 670.29`) & IAATO**
    - **Portals**: <https://www.ats.aq/> · <https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29> · <https://iaato.org/visiting-antarctica/visitor-guidelines-library>
    - **Notice**: HSM numbers, coordinates, and treaty designations derive from public Antarctic Treaty Consultative Meeting (ATCM) records; visitor safety notices link directly to official IAATO guidelines.

---

## 3. Third-Party Open-Source Software Components

All runtime and build-time NPM dependencies use permissive open-source licenses:

| Package | License | Upstream Repository / Vendor |
| :--- | :--- | :--- |
| `next`, `eslint-config-next` | MIT | Vercel, Inc. |
| `react`, `react-dom` | MIT | Meta Platforms, Inc. |
| `next-intl` | MIT | Jan Amann |
| `echarts` | Apache-2.0 | The Apache Software Foundation |
| `leaflet` | BSD-2-Clause | Volodymyr Agafonkin & Contributors |
| `proj4` | MIT | Proj4js Contributors |
| `proj4leaflet` | BSD-2-Clause | Kartena AB / Per Liedman |
| `lucide-react` | ISC | Lucide Contributors |
| `tailwindcss`, `@tailwindcss/postcss` | MIT | Tailwind Labs, Inc. |
| `typescript` | Apache-2.0 | Microsoft Corporation |
| `eslint`, `@eslint/eslintrc` | MIT | OpenJS Foundation |
| `@types/*` (`node`, `react`, `leaflet`, `proj4`) | MIT | DefinitelyTyped Contributors |

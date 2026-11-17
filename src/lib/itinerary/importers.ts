import {
  POLAR_GEOLOGICAL_SITES,
  SCAR_CGA_GAZETTEER
} from '../../data/geology-and-gazetteer.ts';
import { FEATURED_HISTORIC_MONUMENTS } from '../../data/heritage-and-corridors.ts';
import { POLAR_LANDING_HOTSPOTS } from '../../data/polar-landing-gazetteer.ts';
import { POLAR_STATIONS } from '../../data/stations.ts';
import { wgs84ToEpsg3031 } from '../polar-math.ts';
import type {
  ItineraryActivityType,
  LocalizedText,
  UserItineraryWaypoint
} from '../types.ts';

interface DictionaryPlaceNode {
  id: string;
  lat: number;
  lon: number;
  elevationM?: number;
  defaultActivity: ItineraryActivityType;
  canonicalName: string;
  searchTerms: string[];
}

const GATEWAY_NODES: DictionaryPlaceNode[] = [
  {
    id: 'gateway:ushuaia',
    lat: -54.8019,
    lon: -68.303,
    elevationM: 12,
    defaultActivity: 'cruise',
    canonicalName: 'Ushuaia Port (Tierra del Fuego)',
    searchTerms: ['ushuaia', '乌斯怀亚', '烏斯懷亞', 'tierra del fuego', '火地岛', '火地島']
  },
  {
    id: 'gateway:punta-arenas',
    lat: -53.1638,
    lon: -70.9171,
    elevationM: 18,
    defaultActivity: 'flight',
    canonicalName: 'Punta Arenas Gateway',
    searchTerms: ['punta arenas', '蓬塔阿雷纳斯', '蓬塔阿雷納斯']
  },
  {
    id: 'passage:drake',
    lat: -58.8,
    lon: -64.0,
    elevationM: 0,
    defaultActivity: 'cruise',
    canonicalName: 'Drake Passage Crossing',
    searchTerms: [
      'drake passage',
      'pasaje de drake',
      'passagem de drake',
      'mar de hoces',
      '德雷克海峡',
      '德雷克海峽'
    ]
  },
  {
    id: 'passage:king-george',
    lat: -62.198,
    lon: -58.96,
    elevationM: 25,
    defaultActivity: 'zodiac-landing',
    canonicalName: 'King George Island (South Shetlands)',
    searchTerms: [
      'king george island',
      'isla rey jorge',
      'ilha rei george',
      '乔治王岛',
      '喬治王島',
      'south shetland',
      '南设得兰',
      '南設得蘭'
    ]
  },
  {
    id: 'passage:antarctic-circle',
    lat: -66.563,
    lon: -66.2,
    elevationM: 0,
    defaultActivity: 'cruise',
    canonicalName: 'Antarctic Circle (66°33′S)',
    searchTerms: [
      'antarctic circle',
      'circulo polar antartico',
      '南极圈',
      '南極圈'
    ]
  },
  {
    id: 'landing:paulet-island',
    lat: -63.5833,
    lon: -55.7833,
    elevationM: 20,
    defaultActivity: 'zodiac-landing',
    canonicalName: 'Paulet Island (Weddell Sea HSM-41)',
    searchTerms: ['paulet island', 'isla paulet', 'ilha paulet', '保莱特岛', '保萊特島']
  },
  {
    id: 'landing:brown-bluff',
    lat: -63.5333,
    lon: -56.9167,
    elevationM: 45,
    defaultActivity: 'zodiac-landing',
    canonicalName: 'Brown Bluff (Antarctic Sound)',
    searchTerms: ['brown bluff', 'antarctic sound', '布朗断崖', '布朗斷崖', '南极海峡']
  }
];

function collectLocalizedTerms(loc: LocalizedText): string[] {
  return Object.values(loc)
    .map((v) => v.toLowerCase().trim())
    .filter(Boolean);
}

const UNIFIED_PLACE_DICTIONARY: DictionaryPlaceNode[] = [
  ...GATEWAY_NODES,
  ...POLAR_LANDING_HOTSPOTS.map((h) => ({
    id: `landing:${h.id}`,
    lat: h.lat,
    lon: h.lon,
    elevationM: h.typicalElevationGainM,
    defaultActivity: (h.typicalElevationGainM >= 80
      ? 'hiking'
      : h.typicalElevationGainM > 0
        ? 'zodiac-landing'
        : 'cruise') as ItineraryActivityType,
    canonicalName: h.name.en,
    searchTerms: [
      h.id.replace(/-/g, ' '),
      ...h.aliases.map((a) => a.toLowerCase()),
      ...collectLocalizedTerms(h.name)
    ]
  })),
  ...POLAR_STATIONS.map((s) => ({
    id: `station:${s.id}`,
    lat: s.lat,
    lon: s.lon,
    elevationM: s.elevationM,
    defaultActivity: (s.elevationM > 1500 ? 'hiking' : 'zodiac-landing') as ItineraryActivityType,
    canonicalName: s.name.en,
    searchTerms: [
      s.id.replace(/-/g, ' '),
      s.code.toLowerCase(),
      ...collectLocalizedTerms(s.name)
    ]
  })),
  ...POLAR_GEOLOGICAL_SITES.map((g) => ({
    id: `geology:${g.id}`,
    lat: g.lat,
    lon: g.lon,
    elevationM: Math.max(0, g.elevationOrDepthM),
    defaultActivity: 'hiking' as ItineraryActivityType,
    canonicalName: g.name.en,
    searchTerms: [g.id.replace(/-/g, ' '), ...collectLocalizedTerms(g.name)]
  })),
  ...FEATURED_HISTORIC_MONUMENTS.map((m) => ({
    id: `hsm:${m.id}`,
    lat: m.lat,
    lon: m.lon,
    elevationM: 15,
    defaultActivity: 'zodiac-landing' as ItineraryActivityType,
    canonicalName: `${m.hsmCode} ${m.title.en}`,
    searchTerms: [
      m.hsmCode.toLowerCase(),
      m.id.replace(/-/g, ' '),
      ...collectLocalizedTerms(m.title)
    ]
  })),
  ...SCAR_CGA_GAZETTEER.map((c) => ({
    id: `gazetteer:${c.id}`,
    lat: c.lat,
    lon: c.lon,
    elevationM: 30,
    defaultActivity: 'zodiac-landing' as ItineraryActivityType,
    canonicalName: c.names.en,
    searchTerms: [c.id.replace(/-/g, ' '), ...collectLocalizedTerms(c.names)]
  }))
];

export function matchPolarPlaceByName(query: string): DictionaryPlaceNode | null {
  const normalized = query.toLowerCase().trim();
  if (normalized.length < 2) return null;

  let best: { node: DictionaryPlaceNode; score: number } | null = null;
  for (const node of UNIFIED_PLACE_DICTIONARY) {
    for (const term of node.searchTerms) {
      if (!term || term.length < 2) continue;
      if (normalized === term) {
        return node;
      }
      if (normalized.includes(term) || (normalized.length >= 4 && term.includes(normalized))) {
        const score = Math.min(normalized.length, term.length);
        if (!best || score > best.score) {
          best = { node, score };
        }
      }
    }
  }
  return best ? best.node : null;
}

function inferActivityFromText(line: string, fallback: ItineraryActivityType): ItineraryActivityType {
  const lower = line.toLowerCase();
  if (/camp|bivouac|露营|露營|紮營|acampar|campamento/i.test(lower)) return 'camping';
  if (/fly|flight|runway|飞往|飛往|航班|包机|vuelo|voo/i.test(lower)) return 'flight';
  if (/hike|hiking|trek|climb|ridge|summit|snowshoe|徒步|登山|爬升|行山|攀登|caminata|senderismo|trilha/i.test(lower)) {
    return 'hiking';
  }
  if (/zodiac|landing|shore|rookery|冲锋舟|衝鋒舟|登陆|登陸|抢滩|desembarco|desembarque/i.test(lower)) {
    return 'zodiac-landing';
  }
  if (/cruise|crossing|sail|sea day|transit|航行|巡游|巡遊|穿越|navegaci/i.test(lower)) {
    return 'cruise';
  }
  return fallback;
}

/**
 * Simplifies dense GPS tracks in planar EPSG:3031 space using Ramer-Douglas-Peucker
 * so 5,000-point GPX uploads condense cleanly into <= maxPoints key waypoints.
 */
function simplifyTrackPoints(
  pts: UserItineraryWaypoint[],
  maxPoints = 24
): UserItineraryWaypoint[] {
  if (pts.length <= maxPoints) return pts;

  const projected = pts.map((p) => {
    if (p.lat <= -50) {
      return wgs84ToEpsg3031(p.lat, p.lon);
    }
    return { x: p.lon * 111_320, y: p.lat * 110_540 };
  });

  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;

  // Iteratively select points with greatest perpendicular offset until maxPoints
  while (keep.reduce((acc, v) => acc + v, 0) < maxPoints) {
    let bestIdx = -1;
    let bestDist = -1;

    let segStart = 0;
    for (let i = 1; i < pts.length; i++) {
      if (keep[i] === 1) {
        const a = projected[segStart];
        const b = projected[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const denom = Math.hypot(dx, dy) || 1;

        for (let k = segStart + 1; k < i; k++) {
          const pk = projected[k];
          const perp = Math.abs(dy * pk.x - dx * pk.y + b.x * a.y - b.y * a.x) / denom;
          if (perp > bestDist) {
            bestDist = perp;
            bestIdx = k;
          }
        }
        segStart = i;
      }
    }

    if (bestIdx === -1 || bestDist < 50) break;
    keep[bestIdx] = 1;
  }

  return pts.filter((_, idx) => keep[idx] === 1);
}

function extractXmlTagText(block: string, tag: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : undefined;
}

/**
 * 1. Parses standard GPX 1.0/1.1 XML (`<wpt>`, `<rtept>`, or `<trkpt>`).
 */
export function parseGpxToWaypoints(xmlText: string): UserItineraryWaypoint[] {
  const rawPts: UserItineraryWaypoint[] = [];
  const tagRegex = /<(wpt|rtept|trkpt)\b([^>]*)>([\s\S]*?)<\/\1>|<(wpt|rtept|trkpt)\b([^>]*)\/>/gi;

  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = tagRegex.exec(xmlText)) !== null) {
    const attrs = match[2] ?? match[5] ?? '';
    const inner = match[3] ?? '';
    const latM = attrs.match(/lat=["']([-+]?\d+(?:\.\d+)?)["']/i);
    const lonM = attrs.match(/lon=["']([-+]?\d+(?:\.\d+)?)["']/i);
    if (!latM || !lonM) continue;

    const lat = Number(latM[1]);
    const lon = Number(lonM[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90) continue;

    const eleStr = extractXmlTagText(inner, 'ele');
    const timeStr = extractXmlTagText(inner, 'time');
    const nameStr =
      extractXmlTagText(inner, 'name') ||
      extractXmlTagText(inner, 'desc') ||
      `GPX Point ${index + 1}`;
    const matched = matchPolarPlaceByName(nameStr);

    rawPts.push({
      id: `gpx-${index + 1}`,
      dayNumber: index + 1,
      plannedDate: timeStr && /^\d{4}-\d{2}-\d{2}/.test(timeStr) ? timeStr.slice(0, 10) : undefined,
      name: nameStr.slice(0, 100),
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      elevationM: eleStr && Number.isFinite(Number(eleStr)) ? Math.round(Number(eleStr)) : undefined,
      activityType: inferActivityFromText(nameStr, lat <= -61 ? 'hiking' : 'cruise'),
      matchedGazetteerId: matched?.id
    });
    index += 1;
  }

  return simplifyTrackPoints(rawPts, 24);
}

/**
 * 2. Parses GeoJSON (`FeatureCollection`, `Feature`, `LineString`, `MultiLineString`, `Point`).
 */
export function parseGeoJsonToWaypoints(jsonText: string): UserItineraryWaypoint[] {
  const parsed = JSON.parse(jsonText) as Record<string, unknown>;
  const rawPts: UserItineraryWaypoint[] = [];

  const visitGeometry = (
    geom: Record<string, unknown> | null | undefined,
    props: Record<string, unknown> = {}
  ) => {
    if (!geom || typeof geom.type !== 'string') return;
    const labelBase = String(
      props.name || props.title || props.label || `GeoJSON Stop ${rawPts.length + 1}`
    );
    const actRaw = String(props.activityType || props.activity || labelBase);

    if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
      const [lon, lat, ele] = geom.coordinates as number[];
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        rawPts.push({
          id: `gj-${rawPts.length + 1}`,
          name: labelBase,
          lat: Math.round(lat * 10000) / 10000,
          lon: Math.round(lon * 10000) / 10000,
          elevationM: Number.isFinite(ele) ? Math.round(ele) : undefined,
          plannedDate:
            typeof props.date === 'string' ? props.date.slice(0, 10) : undefined,
          activityType: inferActivityFromText(
            actRaw,
            lat <= -61 ? 'zodiac-landing' : 'cruise'
          )
        });
      }
    } else if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
      (geom.coordinates as number[][]).forEach((coord, idx) => {
        const [lon, lat, ele] = coord;
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          rawPts.push({
            id: `gj-${rawPts.length + 1}`,
            name: `${labelBase} #${idx + 1}`,
            lat: Math.round(lat * 10000) / 10000,
            lon: Math.round(lon * 10000) / 10000,
            elevationM: Number.isFinite(ele) ? Math.round(ele) : undefined,
            activityType: inferActivityFromText(actRaw, 'hiking')
          });
        }
      });
    } else if (geom.type === 'MultiLineString' && Array.isArray(geom.coordinates)) {
      for (const line of geom.coordinates as number[][][]) {
        visitGeometry({ type: 'LineString', coordinates: line }, props);
      }
    }
  };

  if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
    for (const f of parsed.features as Array<Record<string, unknown>>) {
      visitGeometry(
        f.geometry as Record<string, unknown>,
        (f.properties as Record<string, unknown>) || {}
      );
    }
  } else if (parsed.type === 'Feature') {
    visitGeometry(
      parsed.geometry as Record<string, unknown>,
      (parsed.properties as Record<string, unknown>) || {}
    );
  } else {
    visitGeometry(parsed);
  }

  return simplifyTrackPoints(rawPts, 24);
}

/**
 * 3. Parses KML XML (`<Placemark>` Point or LineString `<coordinates>`).
 */
export function parseKmlToWaypoints(kmlText: string): UserItineraryWaypoint[] {
  const rawPts: UserItineraryWaypoint[] = [];
  const pmRegex = /<Placemark\b[^>]*>([\s\S]*?)<\/Placemark>/gi;
  let pmMatch: RegExpExecArray | null;

  while ((pmMatch = pmRegex.exec(kmlText)) !== null) {
    const block = pmMatch[1];
    const name = extractXmlTagText(block, 'name') || `KML Stop ${rawPts.length + 1}`;
    const coordsText = extractXmlTagText(block, 'coordinates');
    if (!coordsText) continue;

    const tuples = coordsText
      .trim()
      .split(/\s+/)
      .map((t) => t.split(',').map(Number))
      .filter((arr) => arr.length >= 2 && Number.isFinite(arr[0]) && Number.isFinite(arr[1]));

    tuples.forEach((tuple, idx) => {
      const [lon, lat, ele] = tuple;
      rawPts.push({
        id: `kml-${rawPts.length + 1}`,
        name: tuples.length === 1 ? name : `${name} #${idx + 1}`,
        lat: Math.round(lat * 10000) / 10000,
        lon: Math.round(lon * 10000) / 10000,
        elevationM: Number.isFinite(ele) ? Math.round(ele) : undefined,
        activityType: inferActivityFromText(name, tuples.length > 1 ? 'hiking' : 'zodiac-landing')
      });
    });
  }

  return simplifyTrackPoints(rawPts, 24);
}

/**
 * 4. Parses CSV schedules (`Day,Date,Place,Lat,Lon,Activity,Hours`).
 * Automatically geocodes missing Lat/Lon via the 6-locale Polar Gazetteer!
 */
export function parseCsvToWaypoints(csvText: string): UserItineraryWaypoint[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));
  if (lines.length === 0) return [];

  const splitCsvRow = (row: string): string[] =>
    row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());

  const firstCells = splitCsvRow(lines[0]).map((c) => c.toLowerCase());
  const hasHeader = firstCells.some((c) =>
    /^(day|date|title|name|place|lat|latitude|lon|lng|longitude|activity)/.test(c)
  );

  const colIdx = {
    day: firstCells.findIndex((c) => /^day|天数|第几天/.test(c)),
    date: firstCells.findIndex((c) => /^date|日期/.test(c)),
    name: firstCells.findIndex((c) => /^(title|name|place|location|地点|名称)/.test(c)),
    lat: firstCells.findIndex((c) => /^(lat|latitude|纬度|緯度)/.test(c)),
    lon: firstCells.findIndex((c) => /^(lon|lng|longitude|经度|經度)/.test(c)),
    activity: firstCells.findIndex((c) => /^(activity|type|活动|活動)/.test(c)),
    hours: firstCells.findIndex((c) => /^(hours|duration|时长|時長)/.test(c))
  };

  const dataRows = hasHeader ? lines.slice(1) : lines;
  const result: UserItineraryWaypoint[] = [];

  dataRows.forEach((row, idx) => {
    const cells = splitCsvRow(row);
    const nameVal =
      (colIdx.name >= 0 ? cells[colIdx.name] : cells[0]) || `Waypoint ${idx + 1}`;
    const rawLat = Number(colIdx.lat >= 0 ? cells[colIdx.lat] : cells[1]);
    const rawLon = Number(colIdx.lon >= 0 ? cells[colIdx.lon] : cells[2]);

    const matched = matchPolarPlaceByName(nameVal);
    const lat = Number.isFinite(rawLat) && cells[colIdx.lat >= 0 ? colIdx.lat : 1] !== ''
      ? rawLat
      : matched?.lat;
    const lon = Number.isFinite(rawLon) && cells[colIdx.lon >= 0 ? colIdx.lon : 2] !== ''
      ? rawLon
      : matched?.lon;

    if (typeof lat !== 'number' || typeof lon !== 'number') return;

    const dateVal = colIdx.date >= 0 ? cells[colIdx.date] : undefined;
    const actVal = colIdx.activity >= 0 ? cells[colIdx.activity] : nameVal;
    const hoursVal = colIdx.hours >= 0 ? Number(cells[colIdx.hours]) : undefined;
    const dayVal = colIdx.day >= 0 ? Number(cells[colIdx.day]) : idx + 1;

    result.push({
      id: `csv-${idx + 1}`,
      dayNumber: Number.isFinite(dayVal) ? dayVal : idx + 1,
      plannedDate:
        dateVal && /^\d{4}-\d{2}-\d{2}$/.test(dateVal) ? dateVal : undefined,
      name: nameVal,
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      elevationM: matched?.elevationM,
      activityType: inferActivityFromText(
        actVal || nameVal,
        matched?.defaultActivity ?? 'zodiac-landing'
      ),
      plannedHours: Number.isFinite(hoursVal) ? hoursVal : undefined,
      matchedGazetteerId: matched?.id
    });
  });

  return result.slice(0, 30);
}

/**
 * 5. Zero-Key Multilingual Free-Text Itinerary Matcher:
 * Extracts polar waypoints, day numbers, dates, and activity types from pasted agency schedules.
 */
export function parseFreeTextItinerary(
  rawText: string,
  baseStartDate?: string
): UserItineraryWaypoint[] {
  const chunks = rawText
    .split(/\r?\n|；|;/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 2);

  const waypoints: UserItineraryWaypoint[] = [];
  let currentDay = 1;

  for (const line of chunks) {
    const dayMatch = line.match(
      /(?:day|d|día|dia)\s*(\d{1,2})|第\s*(\d{1,2})\s*[天日]/i
    );
    if (dayMatch) {
      currentDay = Number(dayMatch[1] || dayMatch[2]) || currentDay;
    }

    const isoDateMatch = line.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    let plannedDate = isoDateMatch ? isoDateMatch[1] : undefined;
    if (!plannedDate && baseStartDate && /^\d{4}-\d{2}-\d{2}$/.test(baseStartDate)) {
      const dt = new Date(`${baseStartDate}T00:00:00Z`);
      dt.setUTCDate(dt.getUTCDate() + Math.max(0, currentDay - 1));
      plannedDate = dt.toISOString().slice(0, 10);
    }

    // Check explicit coordinates in text e.g. (-64.84, -62.53)
    const explicitCoord = line.match(
      /(-?\d{2}(?:\.\d+)?)\s*°?\s*S?[,/\s]+(-?\d{1,3}(?:\.\d+)?)\s*°?\s*[WE]?/i
    );

    // Scan dictionary for all distinct place matches along this line in order of appearance
    const lower = line.toLowerCase();
    const hitsOnLine: Array<{ pos: number; node: DictionaryPlaceNode }> = [];

    for (const node of UNIFIED_PLACE_DICTIONARY) {
      let bestPos = Infinity;
      for (const term of node.searchTerms) {
        if (term.length < 2) continue;
        const idx = lower.indexOf(term);
        if (idx >= 0 && idx < bestPos) {
          bestPos = idx;
        }
      }
      if (bestPos < Infinity) {
        hitsOnLine.push({ pos: bestPos, node });
      }
    }

    hitsOnLine.sort((a, b) => a.pos - b.pos);

    if (hitsOnLine.length > 0) {
      for (const { node } of hitsOnLine) {
        // Avoid consecutive duplicate node
        if (
          waypoints.length > 0 &&
          waypoints[waypoints.length - 1].matchedGazetteerId === node.id
        ) {
          continue;
        }
        waypoints.push({
          id: `txt-${waypoints.length + 1}`,
          dayNumber: currentDay,
          plannedDate,
          name: node.canonicalName,
          lat: node.lat,
          lon: node.lon,
          elevationM: node.elevationM,
          activityType: inferActivityFromText(line, node.defaultActivity),
          notes: line.slice(0, 140),
          matchedGazetteerId: node.id
        });
      }
    } else if (explicitCoord) {
      let lat = Number(explicitCoord[1]);
      if (lat > 0 && /s/i.test(explicitCoord[0])) lat = -lat;
      let lon = Number(explicitCoord[2]);
      if (lon > 0 && /w/i.test(explicitCoord[0])) lon = -lon;
      if (lat <= -45 && lat >= -90 && lon >= -180 && lon <= 180) {
        waypoints.push({
          id: `txt-${waypoints.length + 1}`,
          dayNumber: currentDay,
          plannedDate,
          name: line.slice(0, 60),
          lat: Math.round(lat * 10000) / 10000,
          lon: Math.round(lon * 10000) / 10000,
          activityType: inferActivityFromText(line, 'hiking')
        });
      }
    }
  }

  return waypoints.slice(0, 28);
}

/**
 * Exports any custom user itinerary to GPX 1.1 XML for GPS watches & field navigation apps.
 */
export function exportWaypointsToGpx(
  title: string,
  waypoints: UserItineraryWaypoint[]
): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const safeTitle = esc(title || 'Antarctica Atlas Expedition Plan');
  const wptXml = waypoints
    .map(
      (w, idx) =>
        `  <wpt lat="${w.lat.toFixed(5)}" lon="${w.lon.toFixed(5)}">\n` +
        `    <name>${esc(`${idx + 1}. ${w.name}`)}</name>\n` +
        (typeof w.elevationM === 'number' ? `    <ele>${w.elevationM}</ele>\n` : '') +
        `    <type>${esc(w.activityType)}</type>\n` +
        `  </wpt>`
    )
    .join('\n');

  const trkPts = waypoints
    .map(
      (w) =>
        `      <trkpt lat="${w.lat.toFixed(5)}" lon="${w.lon.toFixed(5)}">` +
        (typeof w.elevationM === 'number' ? `<ele>${w.elevationM}</ele>` : '') +
        `</trkpt>`
    )
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<gpx version="1.1" creator="Antarctica Atlas V2.0" xmlns="http://www.topografix.com/GPX/1/1">\n` +
    `  <metadata><name>${safeTitle}</name></metadata>\n` +
    `${wptXml}\n` +
    `  <trk>\n    <name>${safeTitle}</name>\n    <trkseg>\n${trkPts}\n    </trkseg>\n  </trk>\n` +
    `</gpx>\n`
  );
}

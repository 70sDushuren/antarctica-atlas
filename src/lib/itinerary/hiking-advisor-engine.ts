import { POLAR_LANDING_HOTSPOTS } from '../../data/polar-landing-gazetteer.ts';
import {
  classifyDrakeSeaState,
  classifyKatabaticTier,
  computePolarSolarState,
  computeWindChillC,
  interpolateBedmapPoint,
  wgs84ToEpsg3031
} from '../polar-math.ts';
import type {
  HikingProfileSample,
  ItineraryEvaluationResult,
  NearbySpatialAnchor,
  PolarHikingDifficultyTier,
  SegmentAdvisoryReport,
  SubglacialBedmapGrid,
  UserItineraryWaypoint
} from '../types.ts';

export interface LiveWaypointWeatherInput {
  tempC: number;
  windSpeedKmh: number;
  gustKmh: number;
  waveHeightM?: number;
}

function greatCircleDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const r = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estimates seasonal baseline temperature, wind, gust, and Southern Ocean swell
 * for dates beyond the 16-day numerical weather forecast horizon.
 */
export function estimateClimatologyForWaypoint(
  lat: number,
  lon: number,
  elevationM: number,
  dateObj: Date
): LiveWaypointWeatherInput {
  const month = dateObj.getUTCMonth() + 1; // 1..12
  // Austral summer factor: +1 in Jan (1), -1 in Jul (7)
  const seasonalCos = Math.cos(((month - 1) / 12) * 2 * Math.PI);

  const isPeninsula = lat > -68 && lon >= -75 && lon <= -52;
  const isDrake = lat > -61.8 && lat <= -54.5 && lon >= -72 && lon <= -56;

  let baseSummerTempC = -2.0;
  let winterDropC = 14.0;
  let baseGustKmh = 46.0;

  if (isDrake) {
    baseSummerTempC = 3.5;
    winterDropC = 7.5;
    baseGustKmh = 58.0;
  } else if (isPeninsula) {
    baseSummerTempC = 0.8;
    winterDropC = 12.0;
    baseGustKmh = 44.0;
  } else if (lat <= -80 || elevationM >= 2200) {
    baseSummerTempC = -26.0;
    winterDropC = 32.0;
    baseGustKmh = 34.0;
  } else if (lat <= -72) {
    baseSummerTempC = -9.5;
    winterDropC = 22.0;
    baseGustKmh = 48.0;
  }

  // Dry adiabatic / polar ice sheet lapse rate ~ -6.8°C per 1000 m
  const elevCooling = (Math.max(0, elevationM) / 1000) * 6.8;
  const seasonFactor = (1 - seasonalCos) / 2; // 0 in Jan, 1 in Jul
  const tempC =
    Math.round((baseSummerTempC - seasonFactor * winterDropC - elevCooling) * 10) / 10;

  const gustKmh = Math.round((baseGustKmh + seasonFactor * 18) * 10) / 10;
  const windSpeedKmh = Math.round(gustKmh * 0.64 * 10) / 10;

  let waveHeightM: number | undefined;
  if (isDrake) {
    waveHeightM = Math.round((3.4 + seasonFactor * 2.1) * 10) / 10;
  } else if (elevationM <= 40 && lat > -78) {
    waveHeightM = Math.round((1.5 + seasonFactor * 1.2) * 10) / 10;
  }

  return { tempC, windSpeedKmh, gustKmh, waveHeightM };
}

export function computeSegmentDifficultyAndAdvice(params: {
  activityType: UserItineraryWaypoint['activityType'];
  lat: number;
  maxElevationM: number;
  elevationGainM: number;
  maxSlopeDeg: number;
  surfaceType: SegmentAdvisoryReport['surfaceType'];
  isCrevasseZone: boolean;
  month: number;
  windChillC: number;
  gustKmh: number;
  waveHeightM?: number;
  solarRegime: 'polar-day' | 'polar-night' | 'diurnal';
}): {
  tier: PolarHikingDifficultyTier;
  riskScore: number;
  gearKeys: string[];
  hackKeys: string[];
} {
  const katabatic = classifyKatabaticTier(params.gustKmh);
  const drake =
    typeof params.waveHeightM === 'number'
      ? classifyDrakeSeaState(params.waveHeightM)
      : undefined;

  const gear = new Set<string>(['parka_windproof_3l']);
  const hacks = new Set<string>();

  let score = 15;

  // Slope & elevation gain contribution
  score += Math.min(28, params.maxSlopeDeg * 1.15 + params.elevationGainM * 0.04);

  // High polar plateau hypoxia penalty (> 2000 m)
  if (params.maxElevationM >= 2000) {
    score += 22;
    gear.add('expedition_down_800fp');
    gear.add('goggles_cat4');
    hacks.add('high_plateau_acclimatize');
  }

  // Wind chill & katabatic gusts
  if (params.windChillC <= -35) {
    score += 26;
    gear.add('expedition_down_800fp');
    gear.add('goggles_cat4');
    gear.add('battery_body_warmer');
    hacks.add('lithium_chest_pocket');
  } else if (params.windChillC <= -18) {
    score += 14;
    gear.add('goggles_cat4');
    gear.add('battery_body_warmer');
    hacks.add('lithium_chest_pocket');
  }

  if (katabatic === 'severe') {
    score += 42;
    hacks.add('morning_katabatic_window');
  } else if (katabatic === 'watch') {
    score += 28;
    hacks.add('morning_katabatic_window');
  } else if (params.gustKmh >= 45) {
    score += 10;
    hacks.add('morning_katabatic_window');
  }

  // Marine wave state for cruise / zodiac operations
  if (drake && (params.activityType === 'cruise' || params.activityType === 'zodiac-landing')) {
    if (drake.tier >= 4) {
      score += 34;
      gear.add('seasickness_patch');
      hacks.add('drake_midship_cabin');
    } else if (drake.tier === 3) {
      score += 16;
      gear.add('seasickness_patch');
      hacks.add('drake_midship_cabin');
    }
  }

  // Activity & surface-specific gear + hacks
  if (params.activityType === 'zodiac-landing' || params.activityType === 'hiking') {
    gear.add('rubber_muck_boots');
    gear.add('dry_bag_ipx7');
    hacks.add('wet_landing_layering');
    hacks.add('biosecurity_boot_scrub');
    hacks.add('penguin_highway_5m');
  }

  if (params.maxSlopeDeg >= 8 || params.elevationGainM >= 60) {
    gear.add('trekking_poles');
    gear.add('microspikes');
  }
  if (params.maxSlopeDeg >= 14 || params.month === 10 || params.month === 11) {
    gear.add('snowshoes');
  }
  if (params.isCrevasseZone || params.maxSlopeDeg >= 24) {
    score += 18;
    gear.add('glacier_crampons_harness');
  }
  if (params.surfaceType === 'floating-ice-shelf' || params.surfaceType === 'grounded-ice-sheet') {
    gear.add('goggles_cat4');
    hacks.add('calving_surge_standoff');
  }
  if (params.month === 10 || params.month === 11) {
    hacks.add('november_pack_ice_buffer');
  }
  if (params.solarRegime === 'polar-day') {
    hacks.add('polar_day_sleep_mask');
  }
  if (
    params.solarRegime === 'polar-night' &&
    (params.activityType === 'hiking' || params.activityType === 'zodiac-landing')
  ) {
    score += 25;
  }

  const compositeRiskScore = Math.max(5, Math.min(100, Math.round(score)));

  // Determine T1..T5 tier with strict safety redlines
  let tier: PolarHikingDifficultyTier = 1;
  if (
    katabatic !== 'nominal' ||
    (drake && drake.tier >= 4 && params.activityType !== 'flight') ||
    params.windChillC <= -40 ||
    (params.solarRegime === 'polar-night' && params.activityType === 'hiking')
  ) {
    tier = 5;
  } else if (
    params.maxElevationM >= 2000 ||
    params.maxSlopeDeg >= 23 ||
    params.isCrevasseZone ||
    params.windChillC <= -25 ||
    compositeRiskScore >= 68
  ) {
    tier = 4;
  } else if (
    params.maxSlopeDeg >= 12 ||
    params.elevationGainM >= 130 ||
    params.surfaceType === 'floating-ice-shelf' ||
    (drake && drake.tier === 3) ||
    compositeRiskScore >= 46
  ) {
    tier = 3;
  } else if (
    params.maxSlopeDeg >= 5 ||
    params.elevationGainM >= 35 ||
    params.windChillC <= -10 ||
    compositeRiskScore >= 26
  ) {
    tier = 2;
  }

  return {
    tier,
    riskScore: compositeRiskScore,
    gearKeys: Array.from(gear),
    hackKeys: Array.from(hacks)
  };
}

/**
 * Full multi-dimensional itinerary evaluator combining EPSG:3031 Bedmap3 terrain,
 * hotspot slope/crevasse priors, live/climatological weather, and PostGIS nearby anchors.
 */
export function evaluateExpeditionItinerary(params: {
  waypoints: UserItineraryWaypoint[];
  bedmapGrid: SubglacialBedmapGrid | null;
  liveWeatherByIndex?: Record<number, LiveWaypointWeatherInput>;
  nearbyAnchorsByIndex?: Record<number, NearbySpatialAnchor[]>;
  simulateLiveNow?: boolean;
  referenceNow?: Date;
}): ItineraryEvaluationResult {
  const now = params.referenceNow ?? new Date();
  const simulateLiveNow = Boolean(params.simulateLiveNow);
  const segments: SegmentAdvisoryReport[] = [];
  const profileSamples: HikingProfileSample[] = [];

  let cumulativeKm = 0;
  let totalElevationGainM = 0;
  let minWindChillC = 99;
  let maxGustKmh = 0;
  let peakWaveM = 0;
  let totalDaylightH = 0;
  let overallTier: PolarHikingDifficultyTier = 1;

  const gearFrequency = new Map<string, number>();
  const hackFrequency = new Map<string, number>();

  params.waypoints.forEach((wp, idx) => {
    const prev = idx > 0 ? params.waypoints[idx - 1] : null;
    let legDistanceKm = 0;
    if (prev) {
      if (prev.lat <= -60 && wp.lat <= -60) {
        const pA = wgs84ToEpsg3031(prev.lat, prev.lon);
        const pB = wgs84ToEpsg3031(wp.lat, wp.lon);
        legDistanceKm = Math.round((Math.hypot(pB.x - pA.x, pB.y - pA.y) / 1000) * 10) / 10;
      } else {
        legDistanceKm =
          Math.round(greatCircleDistanceKm(prev.lat, prev.lon, wp.lat, wp.lon) * 10) / 10;
      }
    }
    cumulativeKm = Math.round((cumulativeKm + legDistanceKm) * 10) / 10;

    // Resolve planned date
    let targetDate = new Date(now.getTime() + idx * 86_400_000);
    if (!simulateLiveNow && wp.plannedDate && /^\d{4}-\d{2}-\d{2}$/.test(wp.plannedDate)) {
      const parsed = new Date(`${wp.plannedDate}T12:00:00Z`);
      if (!Number.isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }
    const plannedDateIso = targetDate.toISOString().slice(0, 10);

    // Match known landing hotspot metadata if applicable
    const hotspot = POLAR_LANDING_HOTSPOTS.find(
      (h) =>
        `landing:${h.id}` === wp.matchedGazetteerId ||
        greatCircleDistanceKm(wp.lat, wp.lon, h.lat, h.lon) <= 12
    );

    // Sample Bedmap3 subglacial grid if south of -58°S
    let bedSample = { surfaceElevationM: 0, bedElevationM: 0, iceThicknessM: 0 };
    if (params.bedmapGrid && wp.lat <= -58) {
      const xy = wgs84ToEpsg3031(wp.lat, wp.lon);
      bedSample = interpolateBedmapPoint(params.bedmapGrid, xy.x, xy.y);
    }

    const baseElevM =
      typeof wp.elevationM === 'number'
        ? wp.elevationM
        : Math.max(0, bedSample.surfaceElevationM);

    const prevElevM =
      prev && typeof prev.elevationM === 'number'
        ? prev.elevationM
        : prev && params.bedmapGrid && prev.lat <= -58
          ? Math.max(
              0,
              interpolateBedmapPoint(
                params.bedmapGrid,
                wgs84ToEpsg3031(prev.lat, prev.lon).x,
                wgs84ToEpsg3031(prev.lat, prev.lon).y
              ).surfaceElevationM
            )
          : baseElevM;

    const deltaElev = Math.max(0, baseElevM - prevElevM);
    const elevationGainM =
      wp.activityType === 'hiking' || wp.activityType === 'zodiac-landing'
        ? Math.max(deltaElev, hotspot?.typicalElevationGainM ?? 25)
        : deltaElev;

    totalElevationGainM += elevationGainM;
    const maxElevationM = Math.max(baseElevM, prevElevM + elevationGainM);

    let computedSlopeDeg =
      legDistanceKm > 0.05 && legDistanceKm < 40
        ? (Math.atan((elevationGainM / (legDistanceKm * 1000)) * 2.2) * 180) / Math.PI
        : 0;
    if (hotspot && (wp.activityType === 'hiking' || wp.activityType === 'zodiac-landing')) {
      computedSlopeDeg = Math.max(computedSlopeDeg, hotspot.typicalMaxSlopeDeg);
    } else if (wp.activityType === 'hiking' && computedSlopeDeg < 6) {
      computedSlopeDeg = 9.5;
    }
    const maxSlopeDeg = Math.round(Math.min(45, computedSlopeDeg) * 10) / 10;

    // Classify surface type
    let surfaceType: SegmentAdvisoryReport['surfaceType'] = 'coastal-rock-ash';
    if (wp.activityType === 'cruise') {
      surfaceType = 'open-water';
    } else if (bedSample.bedElevationM < 0 && bedSample.iceThicknessM > 80) {
      surfaceType = 'floating-ice-shelf';
    } else if (bedSample.iceThicknessM >= 120 || maxElevationM >= 600) {
      surfaceType = 'grounded-ice-sheet';
    }

    // Weather resolution: live Open-Meteo vs monthly climatology
    const liveWeather = params.liveWeatherByIndex?.[idx];
    const weatherSourceMode: SegmentAdvisoryReport['weatherSourceMode'] = liveWeather
      ? 'live-forecast'
      : 'seasonal-climatology';
    const met =
      liveWeather ?? estimateClimatologyForWaypoint(wp.lat, wp.lon, maxElevationM, targetDate);

    const windChillC = computeWindChillC(met.tempC, met.windSpeedKmh);
    const katabaticTier = classifyKatabaticTier(met.gustKmh);
    const drakeState =
      typeof met.waveHeightM === 'number'
        ? classifyDrakeSeaState(met.waveHeightM)
        : undefined;

    if (windChillC < minWindChillC) minWindChillC = windChillC;
    if (met.gustKmh > maxGustKmh) maxGustKmh = met.gustKmh;
    if (typeof met.waveHeightM === 'number' && met.waveHeightM > peakWaveM) {
      peakWaveM = met.waveHeightM;
    }

    const solar = computePolarSolarState(Math.max(-89.99, Math.min(-50, wp.lat)), targetDate);
    totalDaylightH += solar.daylightHours;

    const assessed = computeSegmentDifficultyAndAdvice({
      activityType: wp.activityType,
      lat: wp.lat,
      maxElevationM,
      elevationGainM,
      maxSlopeDeg,
      surfaceType,
      isCrevasseZone: hotspot?.terrainType === 'glacier-crevasse-zone',
      month: targetDate.getUTCMonth() + 1,
      windChillC,
      gustKmh: met.gustKmh,
      waveHeightM: met.waveHeightM,
      solarRegime: solar.regime
    });

    if (assessed.tier > overallTier) {
      overallTier = assessed.tier;
    }

    for (const gk of assessed.gearKeys) {
      gearFrequency.set(gk, (gearFrequency.get(gk) || 0) + 1);
    }
    for (const hk of assessed.hackKeys) {
      hackFrequency.set(hk, (hackFrequency.get(hk) || 0) + 1);
    }

    segments.push({
      segmentIndex: idx,
      waypointId: wp.id,
      title: wp.name,
      lat: wp.lat,
      lon: wp.lon,
      plannedDate: plannedDateIso,
      activityType: wp.activityType,
      legDistanceKm,
      elevationGainM,
      maxElevationM,
      maxSlopeDeg,
      surfaceType,
      weatherSourceMode,
      expectedTempC: met.tempC,
      expectedWindChillC: windChillC,
      expectedGustKmh: met.gustKmh,
      katabaticTier,
      waveHeightM: met.waveHeightM,
      drakeTier: drakeState?.tier,
      daylightHours: solar.daylightHours,
      solarRegime: solar.regime,
      hikingDifficultyTier: assessed.tier,
      compositeRiskScore: assessed.riskScore,
      gearKeys: assessed.gearKeys,
      hackKeys: assessed.hackKeys,
      nearbyAnchors: params.nearbyAnchorsByIndex?.[idx] ?? []
    });

    profileSamples.push({
      distanceKm: cumulativeKm,
      lat: wp.lat,
      lon: wp.lon,
      elevationM: maxElevationM,
      slopeDeg: maxSlopeDeg,
      windChillC,
      gustKmh: met.gustKmh,
      difficultyTier: assessed.tier
    });
  });

  const sortedGear = [...gearFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
  const sortedHacks = [...hackFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  return {
    evaluatedAtIso: now.toISOString(),
    simulateLiveNow,
    overallDifficultyTier: overallTier,
    totalDistanceKm: cumulativeKm,
    totalElevationGainM: Math.round(totalElevationGainM),
    minWindChillC: minWindChillC === 99 ? 0 : minWindChillC,
    maxGustKmh: Math.round(maxGustKmh * 10) / 10,
    peakWaveM: Math.round(peakWaveM * 10) / 10,
    meanDaylightHours:
      params.waypoints.length > 0
        ? Math.round((totalDaylightH / params.waypoints.length) * 10) / 10
        : 24,
    recommendedGearKeys: sortedGear,
    topPolarHackKeys: sortedHacks,
    segments,
    profileSamples
  };
}

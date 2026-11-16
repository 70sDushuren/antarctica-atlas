#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const MESSAGES_DIR = path.join(ROOT_DIR, 'messages');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const GEO_DATA_DIR = path.join(ROOT_DIR, 'public', 'geo-data');

const LOCALES = ['en', 'zh-CN', 'zh-TW', 'yue-Hant', 'pt', 'es'];
const MAX_GEODATA_BYTES = 5 * 1024 * 1024; // Strict < 5 MB static geo-data budget

function flattenKeys(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, nextKey));
    } else {
      result[nextKey] = value;
    }
  }
  return result;
}

function extractIcuPlaceholders(str) {
  const matches = [...str.matchAll(/\{([a-zA-Z0-9_]+)(?:,[^}]*)?\}/g)];
  return matches.map((m) => m[1]).sort();
}

function isLocalizedCandidate(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  const overlap = keys.filter((k) => LOCALES.includes(k));
  return overlap.length >= 2 && keys.every((k) => LOCALES.includes(k));
}

function walkDataCatalog(node, tracePath, issues, stats) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, idx) => walkDataCatalog(item, `${tracePath}[${idx}]`, issues, stats));
    return;
  }

  if (isLocalizedCandidate(node)) {
    stats.localizedObjects += 1;
    for (const loc of LOCALES) {
      if (!(loc in node) || typeof node[loc] !== 'string' || node[loc].trim().length === 0) {
        issues.push(`[data-i18n-error] Missing or empty "${loc}" in ${tracePath}`);
      }
    }
    if (
      typeof node['zh-TW'] === 'string' &&
      typeof node['yue-Hant'] === 'string' &&
      (tracePath.endsWith('.summary') || tracePath.endsWith('.highlight'))
    ) {
      stats.narrativePairs += 1;
      if (node['zh-TW'].trim() !== node['yue-Hant'].trim()) {
        stats.distinctNarrativePairs += 1;
      }
    }
    return;
  }

  for (const [k, v] of Object.entries(node)) {
    walkDataCatalog(v, `${tracePath}.${k}`, issues, stats);
  }
}

async function main() {
  let hasErrors = false;
  const parsedByLocale = {};

  // 1. Validate messages/*.json existence & JSON syntax
  for (const locale of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`[i18n-error] Missing locale dictionary: messages/${locale}.json`);
      hasErrors = true;
      continue;
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      parsedByLocale[locale] = flattenKeys(JSON.parse(raw));
    } catch (err) {
      console.error(`[i18n-error] Invalid JSON in messages/${locale}.json:`, err.message);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  // 2. Validate 1:1 key parity, non-empty strings, and ICU placeholder parity
  const baseKeys = Object.keys(parsedByLocale.en).sort();

  for (const locale of LOCALES) {
    const target = parsedByLocale[locale];
    const targetKeys = Object.keys(target).sort();

    for (const k of baseKeys) {
      if (!(k in target)) {
        console.error(`[i18n-error] [${locale}] Missing key: "${k}"`);
        hasErrors = true;
      } else if (typeof target[k] !== 'string' || target[k].trim().length === 0) {
        console.error(`[i18n-error] [${locale}] Empty or non-string value at key: "${k}"`);
        hasErrors = true;
      } else {
        const expectedPlaceholders = extractIcuPlaceholders(parsedByLocale.en[k]);
        const actualPlaceholders = extractIcuPlaceholders(target[k]);
        if (expectedPlaceholders.join(',') !== actualPlaceholders.join(',')) {
          console.error(
            `[i18n-error] [${locale}] ICU placeholder mismatch at "${k}": expected {${expectedPlaceholders.join(', ')}}, found {${actualPlaceholders.join(', ')}}`
          );
          hasErrors = true;
        }
      }
    }

    for (const k of targetKeys) {
      if (!(k in parsedByLocale.en)) {
        console.error(`[i18n-error] [${locale}] Orphan key not present in en.json: "${k}"`);
        hasErrors = true;
      }
    }
  }

  // 3. Verify authentic Cantonese distinction from written Traditional Chinese in UI messages
  const diffCount = baseKeys.filter((k) => parsedByLocale['zh-TW'][k] !== parsedByLocale['yue-Hant'][k]).length;
  const diffRatio = diffCount / baseKeys.length;

  if (diffRatio < 0.3) {
    console.error(
      `[i18n-error] yue-Hant.json is too similar to zh-TW.json (${(diffRatio * 100).toFixed(1)}% distinct). Authentic Cantonese phrasing required.`
    );
    hasErrors = true;
  }

  // 4. Verify structured domain catalogs in src/data/*.ts
  const dataStats = { localizedObjects: 0, narrativePairs: 0, distinctNarrativePairs: 0 };
  if (fs.existsSync(DATA_DIR)) {
    const dataFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts'));
    for (const file of dataFiles) {
      const fullPath = path.join(DATA_DIR, file);
      try {
        const mod = await import(pathToFileURL(fullPath).href);
        const issues = [];
        walkDataCatalog(mod, file, issues, dataStats);
        for (const issue of issues) {
          console.error(issue);
          hasErrors = true;
        }
      } catch (err) {
        // Fallback static check if running on a Node version without TS strip-types enabled
        const rawTs = fs.readFileSync(fullPath, 'utf8');
        for (const loc of LOCALES) {
          const keyPattern = loc.includes('-') ? `'${loc}':` : `${loc}:`;
          if (!rawTs.includes(keyPattern) && !rawTs.includes(`"${loc}":`)) {
            console.error(`[data-i18n-error] Locale "${loc}" missing in src/data/${file} (${err.message})`);
            hasErrors = true;
          }
        }
      }
    }

    if (dataStats.narrativePairs > 0) {
      const narrativeDiffRatio = dataStats.distinctNarrativePairs / dataStats.narrativePairs;
      if (narrativeDiffRatio < 0.7) {
        console.error(
          `[data-i18n-error] Domain narrative summaries/highlights in src/data/ lack authentic Cantonese distinction (${(narrativeDiffRatio * 100).toFixed(1)}%).`
        );
        hasErrors = true;
      }
    }
  }

  // 5. Verify pre-baked static geo-data pack exists and stays strictly < 5 MB
  let totalGeoBytes = 0;
  if (fs.existsSync(GEO_DATA_DIR)) {
    for (const entry of fs.readdirSync(GEO_DATA_DIR)) {
      const st = fs.statSync(path.join(GEO_DATA_DIR, entry));
      if (st.isFile()) totalGeoBytes += st.size;
    }
    if (totalGeoBytes >= MAX_GEODATA_BYTES) {
      console.error(
        `[geodata-error] public/geo-data payload (${(totalGeoBytes / 1024 / 1024).toFixed(2)} MB) exceeds 5 MB limit.`
      );
      hasErrors = true;
    }
  } else {
    console.error('[geodata-error] Missing public/geo-data directory. Run `npm run prep:geodata`.');
    hasErrors = true;
  }

  if (hasErrors) {
    process.exit(1);
  }

  const catalogNote =
    dataStats.localizedObjects > 0
      ? `, ${dataStats.localizedObjects} domain catalog entries`
      : '';

  console.log(
    `[i18n-ok] Verified ${LOCALES.length} locales (${LOCALES.join(', ')}) across ${baseKeys.length} UI keys${catalogNote}. Cantonese UI distinction: ${(diffRatio * 100).toFixed(1)}%. Static geo-data: ${(totalGeoBytes / 1024).toFixed(1)} KB / 5120 KB.`
  );
}

main();

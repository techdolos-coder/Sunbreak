import type { Forecast, POI, RankedSuggestion, WeatherPoint } from "./types";
import { sunPosition } from "./sun";
import { isSunVisible } from "./horizon";

const HORIZON_MIN = 90; // kurzer Prognosehorizont — das Produktversprechen
const STEP_MIN = 5;

// Absolute Uhrzeit in Europe/Berlin, "15:47". NIE relativ.
export function formatBerlin(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

// Tiefe/mittlere Wolken blocken die direkte Sonne stark, hohe (Zirren) kaum.
function effectiveCloud(w: WeatherPoint): number {
  return Math.min(100, w.cloudLow + 0.6 * w.cloudMid + 0.15 * w.cloudHigh);
}

function cloudAt(fc: Forecast, date: Date): WeatherPoint | null {
  if (fc.points.length === 0) return null;
  let best = fc.points[0];
  let bestDiff = Math.abs(best.time.getTime() - date.getTime());
  for (const p of fc.points) {
    const d = Math.abs(p.time.getTime() - date.getTime());
    if (d < bestDiff) {
      best = p;
      bestDiff = d;
    }
  }
  return best;
}

// Schwellen (Prozent effektiver Bewölkung).
const SICHER_MAX = 30; // darunter: klare Sonne
const SONNE_WEG = 55; // darüber: Fenster gilt als zu

// Rankt einen einzelnen POI. null = jetzt keine Sonne hier (Schatten/Nacht/zu bewölkt).
export function rankPOI(
  poi: POI,
  now: Date,
  fc: Forecast,
): RankedSuggestion | null {
  const sunNow = sunPosition(now, poi.lat, poi.lng);
  if (!isSunVisible(sunNow, poi.horizon)) return null; // POI liegt im Schatten

  const wNow = cloudAt(fc, now);
  if (!wNow) return null; // ohne Wetterdaten kein Versprechen
  const effNow = effectiveCloud(wNow);
  if (effNow > SONNE_WEG) return null; // gerade zu bewölkt

  // Geometrisches Ende: wann verschwindet die Sonne hinter Horizont/geht unter?
  let geomEnd = new Date(now.getTime() + HORIZON_MIN * 60_000);
  for (let m = STEP_MIN; m <= HORIZON_MIN; m += STEP_MIN) {
    const t = new Date(now.getTime() + m * 60_000);
    if (!isSunVisible(sunPosition(t, poi.lat, poi.lng), poi.horizon)) {
      geomEnd = t;
      break;
    }
  }

  // Wolken-Ende: wann zieht das Fenster wolkenbedingt zu?
  let cloudEnd: Date | null = null;
  let maxEff = effNow;
  for (let m = 0; m <= HORIZON_MIN; m += STEP_MIN) {
    const t = new Date(now.getTime() + m * 60_000);
    if (t > geomEnd) break;
    const w = cloudAt(fc, t);
    if (!w) continue;
    const eff = effectiveCloud(w);
    maxEff = Math.max(maxEff, eff);
    if (eff > SONNE_WEG) {
      cloudEnd = t;
      break;
    }
  }

  const end = cloudEnd && cloudEnd < geomEnd ? cloudEnd : geomEnd;
  const cloudsCutShort = cloudEnd !== null && cloudEnd < geomEnd;

  const sicher = effNow < SICHER_MAX && maxEff < 40 && !cloudsCutShort;
  const condition = sicher ? "sicher" : "wackelig";
  const wackeligGrund = sicher
    ? undefined
    : cloudsCutShort
      ? "Wolkenfeld zieht auf"
      : "Wechselnde Bewölkung";

  const sunMinutes = (end.getTime() - now.getTime()) / 60_000;
  const score = sunMinutes * (1 - maxEff / 100);

  return {
    id: poi.id,
    ort: poi.ort,
    bereich: poi.bereich,
    lat: poi.lat,
    lng: poi.lng,
    condition,
    sonneBisZeit: formatBerlin(end),
    wackeligGrund,
    score,
  };
}

// Rankt alle POIs, wirft die schattigen/bewölkten raus, sortiert nach Score.
export function rankAll(
  pois: POI[],
  now: Date,
  fc: Forecast,
): RankedSuggestion[] {
  return pois
    .map((p) => rankPOI(p, now, fc))
    .filter((s): s is RankedSuggestion => s !== null)
    .sort((a, b) => b.score - a.score);
}

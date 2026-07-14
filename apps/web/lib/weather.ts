import type { Forecast, WeatherPoint } from "./engine/types";

// Wetter-Ingest. Primärquelle laut Architektur: DWD ICON-D2; Open-Meteo ist der
// bequeme JSON-Layer über demselben ICON-Modell (gratis, kein Key). Der Server
// zieht EINEN Forecast für ganz Hamburg und schickt allen dasselbe Bundle —
// er erfährt nie, wo ein Nutzer ist.
//
// Produktions-Lücke: der Satelliten-Nowcast (EUMETSAT MSG, 0–90 Min) fehlt hier
// noch; er würde die kurzfristige Wolkenzug-Prognose deutlich schärfen.

const HAMBURG = { lat: 53.55, lng: 10.0 };
const TTL_MS = 15 * 60 * 1000;

let cache: { at: number; fc: Forecast } | null = null;

function buildUrl(): string {
  const p = new URLSearchParams({
    latitude: String(HAMBURG.lat),
    longitude: String(HAMBURG.lng),
    hourly:
      "cloud_cover_low,cloud_cover_mid,cloud_cover_high,direct_normal_irradiance",
    forecast_days: "1",
    timezone: "GMT",
  });
  return `https://api.open-meteo.com/v1/forecast?${p.toString()}`;
}

export async function getHamburgForecast(): Promise<Forecast> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.fc;

  const res = await fetch(buildUrl(), { next: { revalidate: 900 } });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const j = (await res.json()) as {
    hourly: {
      time: string[];
      cloud_cover_low: number[];
      cloud_cover_mid: number[];
      cloud_cover_high: number[];
      direct_normal_irradiance: number[];
    };
  };

  const h = j.hourly;
  const points: WeatherPoint[] = h.time.map((ts, i) => ({
    time: new Date(`${ts}:00Z`), // Open-Meteo liefert bei timezone=GMT UTC-Zeiten
    cloudLow: h.cloud_cover_low[i] ?? 0,
    cloudMid: h.cloud_cover_mid[i] ?? 0,
    cloudHigh: h.cloud_cover_high[i] ?? 0,
    dni: h.direct_normal_irradiance[i] ?? 0,
  }));

  const fc: Forecast = { points };
  cache = { at: Date.now(), fc };
  return fc;
}

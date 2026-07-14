import { NextResponse } from "next/server";
import { sunPosition } from "@/lib/engine/sun";
import { isSunVisible, horizonAt, OPEN_HORIZON } from "@/lib/engine/horizon";
import { rankPOI } from "@/lib/engine/ranking";
import type { Forecast, POI, WeatherPoint } from "@/lib/engine/types";

// Dev-Diagnose: prüft die Engine gegen bekannte Werte/Szenarien. Per curl abrufbar.
// Kein Produkt-Endpunkt.

function clear(time: Date): WeatherPoint {
  return { time, cloudLow: 0, cloudMid: 0, cloudHigh: 0, dni: 800 };
}
function overcast(time: Date): WeatherPoint {
  return { time, cloudLow: 95, cloudMid: 90, cloudHigh: 50, dni: 20 };
}

function forecastConst(now: Date, mk: (t: Date) => WeatherPoint): Forecast {
  const points: WeatherPoint[] = [];
  for (let m = -60; m <= 180; m += 15) {
    points.push(mk(new Date(now.getTime() + m * 60_000)));
  }
  return { points };
}

export async function GET() {
  const checks: { name: string; ok: boolean; detail: string }[] = [];
  const push = (name: string, ok: boolean, detail: string) =>
    checks.push({ name, ok, detail });

  // 1) Sonnenstand: Hamburg, Sommersonnenwende, nahe Sonnenhöchststand.
  // Max. Höhe = 90 - 53.55 + 23.44 ≈ 59.9°, Azimut ~ Süd (180°).
  const noon = new Date("2026-06-21T11:20:00Z");
  const sun = sunPosition(noon, 53.55, 10.0);
  push(
    "Sonnenhöhe Sommer-Mittag ~60°",
    Math.abs(sun.elevationDeg - 59.9) < 4,
    `elevation=${sun.elevationDeg.toFixed(1)}°`,
  );
  push(
    "Azimut Mittag ~Süd(180°)",
    Math.abs(sun.azimuthDeg - 180) < 12,
    `azimuth=${sun.azimuthDeg.toFixed(1)}°`,
  );

  // 2) Nacht: Sonne unter dem Horizont.
  const night = sunPosition(new Date("2026-06-21T00:00:00Z"), 53.55, 10.0);
  push("Mitternacht: Sonne unten", night.elevationDeg < 0, `elevation=${night.elevationDeg.toFixed(1)}°`);

  // 3) Horizont-Interpolation & Sichtbarkeit.
  push("horizonAt(open,123)=2", Math.abs(horizonAt(OPEN_HORIZON, 123) - 2) < 1e-6, "");
  push(
    "isSunVisible bei hoher Sonne",
    isSunVisible({ azimuthDeg: 180, elevationDeg: 40 }, OPEN_HORIZON),
    "",
  );

  // 4) Ranking: klare Sonne -> sicher; bedeckt -> null.
  const now = noon;
  const poi: POI = { id: "t", ort: "Test", bereich: "", lat: 53.55, lng: 10.0, horizon: OPEN_HORIZON };
  const rClear = rankPOI(poi, now, forecastConst(now, clear));
  push("klar -> sicher", rClear?.condition === "sicher", `=${rClear?.condition} bis ${rClear?.sonneBisZeit}`);
  const rOver = rankPOI(poi, now, forecastConst(now, overcast));
  push("bedeckt -> kein Vorschlag", rOver === null, `=${rOver === null ? "null" : rOver?.condition}`);

  // 5) Ranking: Sonne hinter hohem Horizont (Gebäude überall 70° > Mittagssonne) -> null.
  const walled: POI = { ...poi, horizon: new Array(360).fill(70) };
  const rWalled = rankPOI(walled, now, forecastConst(now, clear));
  push("verbaut -> kein Vorschlag", rWalled === null, `=${rWalled === null ? "null" : "sichtbar"}`);

  const ok = checks.every((c) => c.ok);
  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 500 });
}

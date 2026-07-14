import * as SunCalc from "suncalc";
import { sunPosition } from "./sun";
import { formatBerlin } from "./ranking";

// Hamburg-Mittelpunkt reicht für „ist es Nacht?" (stadtweit, kein Nutzerstandort).
const HAMBURG = { lat: 53.55, lng: 10.0 };

// Nacht = Sonne unter dem Horizont. Dann hat kein POI Sonne → Nacht-Zustand.
export function isNight(
  now: Date,
  lat = HAMBURG.lat,
  lng = HAMBURG.lng,
): boolean {
  return sunPosition(now, lat, lng).elevationDeg < 0;
}

// Nächster Sonnenaufgang als absolute Uhrzeit "05:12" (Europe/Berlin).
export function nextSunriseLabel(
  now: Date,
  lat = HAMBURG.lat,
  lng = HAMBURG.lng,
): string | undefined {
  const today = SunCalc.getTimes(now, lat, lng).sunrise;
  // früher Morgen (vor Sonnenaufgang) -> heute, sonst morgen.
  const sunrise =
    today && today > now
      ? today
      : SunCalc.getTimes(new Date(now.getTime() + 86_400_000), lat, lng).sunrise;
  // In Polarnächten kann sunrise fehlen (für Hamburg praktisch nie).
  return sunrise ? formatBerlin(sunrise) : undefined;
}

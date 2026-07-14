// suncalc v2 exportiert benannte Funktionen (getPosition ...) — Namespace-Import
// wie in der offiziellen README.
import * as SunCalc from "suncalc";

// Sonnenstand über SunCalc (in der Architektur so vorgesehen). Rein astronomisch:
// hängt nur von Ort + Zeit ab, nicht vom Nutzerstandort — der Server erfährt nie,
// wo jemand ist.
export interface SunPos {
  azimuthDeg: number; // 0 = Nord, 90 = Ost, 180 = Süd, 270 = West
  elevationDeg: number; // Höhe über dem mathematischen Horizont
}

export function sunPosition(date: Date, lat: number, lng: number): SunPos {
  const p = SunCalc.getPosition(date, lat, lng);
  // Dieser suncalc-Build liefert altitude/azimuth bereits in GRAD, azimuth als
  // Kompasswinkel (0 = Nord, 180 = Süd). Empirisch verifiziert in engine-check.
  const elevationDeg = p.altitude;
  const azimuthDeg = ((p.azimuth % 360) + 360) % 360;
  return { azimuthDeg, elevationDeg };
}

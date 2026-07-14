import type { HorizonProfile } from "./types";
import type { SunPos } from "./sun";

// Freies Feld: ~2° Resthorizont (Bäume/Gelände), kein Gebäude. Fallback, solange
// für einen POI noch kein echtes bDOM-Profil vorliegt.
export const OPEN_HORIZON: HorizonProfile = new Array(360).fill(2);

// Horizont-Höhenwinkel bei einem Azimut, linear zwischen den Grad-Stützpunkten
// interpoliert.
export function horizonAt(profile: HorizonProfile, azimuthDeg: number): number {
  const n = profile.length;
  if (n === 0) return 0;
  const a = ((azimuthDeg % 360) + 360) % 360;
  const i0 = Math.floor(a) % n;
  const i1 = (i0 + 1) % n;
  const frac = a - Math.floor(a);
  return profile[i0] * (1 - frac) + profile[i1] * frac;
}

// Die O(1)-Laufzeitprüfung: scheint die Sonne auf den POI? Sonne sichtbar ⟺
// Sonnenhöhe > Horizonthöhe in ihrer Richtung. Keine 3D-Rechnung zur Query-Zeit.
export function isSunVisible(sun: SunPos, profile: HorizonProfile): boolean {
  return sun.elevationDeg > horizonAt(profile, sun.azimuthDeg);
}

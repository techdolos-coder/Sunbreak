// Geo-Helfer für die Landingpage. Wichtig laut Brief: KEIN eigener Routing-Dienst,
// der Standort verlässt nie das Gerät. Wir zeigen nur "wo & wie weit"; das Lotsen
// übergeben wir an die Karten-App des Betriebssystems.

export interface Coords {
  lat: number;
  lng: number;
}

// Default = Hammer Park (passend zum sicher-Beispiel).
const DEFAULT_COORDS: Coords = { lat: 53.5556, lng: 10.0539 };

export function coordsFromParams(sp: URLSearchParams): Coords {
  const lat = Number.parseFloat(sp.get("lat") ?? "");
  const lng = Number.parseFloat(sp.get("lng") ?? "");
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return DEFAULT_COORDS;
}

// Optionale, vom Absender mitgegebene Gehzeit als fertiger Text ("6 Min").
export function gehzeitFromParams(sp: URLSearchParams): string | undefined {
  return sp.get("geh")?.trim() || undefined;
}

// Directions-Link: die OS-Karten-App übernimmt das Routing, nicht wir.
export function directionsUrl({ lat, lng }: Coords): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

// Luftlinie (Haversine) in Metern — nur für eine grobe Client-seitige
// Gehzeit-Schätzung, falls der Empfänger seinen Standort freigibt. Die
// Berechnung läuft im Browser; nichts wird an den Server gesendet.
export function haversineMeters(a: Coords, b: Coords): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Grobe Fuß-Gehzeit: Luftlinie × 1,3 (Umwegfaktor), ~4,8 km/h.
export function estimateWalkMinutes(from: Coords, to: Coords): number {
  const meters = haversineMeters(from, to) * 1.3;
  return Math.max(1, Math.round(meters / 80)); // 80 m/min ≈ 4,8 km/h
}

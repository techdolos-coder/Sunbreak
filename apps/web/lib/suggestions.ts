import type { CardData } from "./card";
import type { Coords } from "./geo";

// Ein Vorschlag = Kartendaten + Gehzeit + Koordinaten. Die App zeigt drei davon
// untereinander (Artefakt C). Erbt die Kartensprache (sicher/wackelig via Farbe).
export interface Suggestion extends CardData {
  id: string;
  gehzeit: string; // fertiger Text, z. B. "6 Min"
  coords: Coords;
}

// MVP: statische Mock-Vorschläge (echte Ranking-Engine läuft on-device, kommt
// als eigener Strang). Bewusst 3 Stück — nicht mehr, gegen das 15-Sek-Ziel.
export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "hammerpark",
    condition: "sicher",
    ort: "Hammer Park",
    bereich: "Nordwiese",
    sonneBisZeit: "15:47",
    gehzeit: "6 Min",
    coords: { lat: 53.5556, lng: 10.0539 },
  },
  {
    id: "stadtpark",
    condition: "sicher",
    ort: "Stadtpark",
    bereich: "Südwiese",
    sonneBisZeit: "16:20",
    gehzeit: "9 Min",
    coords: { lat: 53.5978, lng: 10.0182 },
  },
  {
    id: "elbwiese",
    condition: "wackelig",
    ort: "Elbwiese",
    bereich: "Övelgönne",
    sonneBisZeit: "17:10",
    wackeligGrund: "Wolkenfeld zieht von Westen",
    gehzeit: "12 Min",
    coords: { lat: 53.5443, lng: 9.8887 },
  },
];

// Query-String für den geteilten Link (/e) bzw. das og:image (/og). Kodiert
// Ort + absolute Endzeit + Zustand -> stabil cachebar.
export function suggestionQuery(s: Suggestion): string {
  const sp = new URLSearchParams();
  sp.set("ort", s.ort);
  sp.set("bereich", s.bereich);
  sp.set("bis", s.sonneBisZeit);
  sp.set("s", s.condition);
  if (s.wackeligGrund) sp.set("grund", s.wackeligGrund);
  sp.set("geh", s.gehzeit);
  sp.set("lat", String(s.coords.lat));
  sp.set("lng", String(s.coords.lng));
  return sp.toString();
}

import type { CardData } from "./card";
import { WEB_BASE_URL } from "../theme";

export interface Coords {
  lat: number;
  lng: number;
}

export interface Suggestion extends CardData {
  id: string;
  gehzeit: string;
  coords: Coords;
}

// MVP: statische Mock-Vorschläge (die On-Device-Ranking-Engine kommt später).
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

// Geteilter Link auf die Web-Landingpage (/e). WhatsApp baut daraus die
// Vorschaukarte (og:image). Kodiert Ort + absolute Endzeit + Zustand.
export function shareUrl(s: Suggestion): string {
  const q = new URLSearchParams({
    ort: s.ort,
    bereich: s.bereich,
    bis: s.sonneBisZeit,
    s: s.condition,
    geh: s.gehzeit,
    lat: String(s.coords.lat),
    lng: String(s.coords.lng),
  });
  if (s.wackeligGrund) q.set("grund", s.wackeligGrund);
  return `${WEB_BASE_URL}/e?${q.toString()}`;
}

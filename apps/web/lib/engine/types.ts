import type { Condition } from "../tokens";

// Horizontprofil: Höhenwinkel (Grad) je Azimut. Index 0..359 = Himmelsrichtung
// (0 = Nord, 90 = Ost, 180 = Süd, 270 = West). Kommt aus dem Schatten-Precompute
// (bDOM/LoD2) und ist pro POI statisch — die teure 3D-Rechnung passiert offline.
export type HorizonProfile = number[];

export interface POI {
  id: string;
  ort: string;
  bereich: string;
  lat: number;
  lng: number;
  horizon: HorizonProfile;
}

// Ein Wetter-Stützpunkt (15-Min-Raster) — Ausschnitt aus dem Open-Meteo/ICON-Bundle.
export interface WeatherPoint {
  time: Date;
  cloudLow: number; // %
  cloudMid: number; // %
  cloudHigh: number; // %
  dni: number; // direct normal irradiance, W/m²
}

export interface Forecast {
  points: WeatherPoint[];
}

// Ergebnis der Engine für einen POI.
export interface RankedSuggestion {
  id: string;
  ort: string;
  bereich: string;
  lat: number;
  lng: number;
  condition: Condition;
  sonneBisZeit: string; // absolute Uhrzeit "15:47"
  wackeligGrund?: string;
  score: number; // Rule-Score, höher = besser (zum Sortieren)
}

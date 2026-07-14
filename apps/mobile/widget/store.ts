import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Suggestion } from "../lib/suggestions";

// Persistenz des aktuellen Vorschlags, damit der headless Android-Task-Handler
// (OS-getriebene Updates ohne laufende App) rendern kann.
const KEY = "sunbreak.topSuggestion";

// App-Group-Suite für die iOS-WidgetKit-Extension (siehe SunbreakWidget.swift).
// Die JS->App-Group-Brücke auf iOS ist noch offen (README, Abschnitt „iOS").
export const APP_GROUP = "group.hamburg.sonnenfenster.sunbreak";

// Nur die fürs Widget nötigen, serialisierbaren Felder.
export interface WidgetSuggestion {
  condition: "sicher" | "wackelig";
  ort: string;
  bereich: string;
  sonneBisZeit: string;
  gehzeit: string;
  wackeligGrund?: string;
}

export function toWidgetSuggestion(s: Suggestion): WidgetSuggestion {
  return {
    condition: s.condition,
    ort: s.ort,
    bereich: s.bereich,
    sonneBisZeit: s.sonneBisZeit,
    gehzeit: s.gehzeit,
    wackeligGrund: s.wackeligGrund,
  };
}

const FALLBACK: WidgetSuggestion = {
  condition: "sicher",
  ort: "Hammer Park",
  bereich: "Nordwiese",
  sonneBisZeit: "15:47",
  gehzeit: "6 Min",
};

export async function saveTopSuggestion(s: WidgetSuggestion): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // requestWidgetUpdate rendert trotzdem mit den übergebenen Daten.
  }
}

export async function loadTopSuggestion(): Promise<WidgetSuggestion> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as WidgetSuggestion;
  } catch {
    // fällt auf Default zurück
  }
  return FALLBACK;
}

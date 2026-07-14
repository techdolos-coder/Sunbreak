// Zustände des App-Screens (Artefakt C). Der Normalfall ist die Liste der drei
// Vorschläge; die übrigen drei sind ehrliche Sonderfälle. Produktiv ergeben sie
// sich aus Daten/Uhrzeit/Standort — vorerst per ?state= vorschaubar.
export type AppState = "liste" | "heute-nicht" | "kein-standort" | "nacht";

const VALID: AppState[] = ["liste", "heute-nicht", "kein-standort", "nacht"];

export function appStateFromParams(sp: URLSearchParams): AppState {
  const s = sp.get("state");
  return (VALID as string[]).includes(s ?? "") ? (s as AppState) : "liste";
}

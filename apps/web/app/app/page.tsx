import type { Metadata } from "next";
import AppScreen from "./AppScreen";
import { appStateFromParams } from "@/lib/appState";
import { toSearchParams, type SearchParams } from "@/lib/params";
import type { Suggestion } from "@/lib/suggestions";
import { HAMBURG_POIS } from "@/data/pois";
import { getHamburgForecast } from "@/lib/weather";
import { rankAll } from "@/lib/engine/ranking";

export const metadata: Metadata = {
  title: "Sunbreak — Sonne in deiner Nähe",
};

// Berechnet die echten Vorschläge (Engine + Wetter). null = Datenfundament nicht
// erreichbar (dann greift die App auf Mock zurück).
async function computeSuggestions(): Promise<Suggestion[] | null> {
  try {
    const fc = await getHamburgForecast();
    return rankAll(HAMBURG_POIS, new Date(), fc)
      .slice(0, 3)
      .map((r) => ({
        id: r.id,
        condition: r.condition,
        ort: r.ort,
        bereich: r.bereich,
        sonneBisZeit: r.sonneBisZeit,
        wackeligGrund: r.wackeligGrund,
        gehzeit: "", // nutzerspezifisch -> clientseitig auf der Landingpage
        coords: { lat: r.lat, lng: r.lng },
      }));
  } catch {
    return null;
  }
}

// Artefakt C: der Ein-Screen des Absenders (PWA). ?state= schaltet die
// Sonderzustände frei (Vorschau); sonst echte Daten vom Datenfundament.
export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = toSearchParams(await searchParams);
  const state = appStateFromParams(sp);
  if (state !== "liste") return <AppScreen state={state} />;

  const suggestions = await computeSuggestions();
  if (suggestions === null) return <AppScreen />; // Fallback: Mock
  if (suggestions.length === 0) return <AppScreen state="heute-nicht" />;
  return <AppScreen suggestions={suggestions} />;
}

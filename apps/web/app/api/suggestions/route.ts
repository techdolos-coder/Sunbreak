import { NextResponse } from "next/server";
import { HAMBURG_POIS } from "@/data/pois";
import { getHamburgForecast } from "@/lib/weather";
import { rankAll } from "@/lib/engine/ranking";

// Bundle-/Suggestions-Endpunkt. Berechnet die gerankten Vorschläge für ganz
// Hamburg aus Sonnenstand (POI+Zeit) + Wolkenprognose — unabhängig vom
// Nutzerstandort. Alle bekommen dasselbe Ergebnis; der Server erfährt nie, wo
// jemand ist. In der Zielarchitektur ist das eine FastAPI + Redis-Cache; hier
// als Next-Route-Handler mit In-Memory-/Fetch-Cache.
export const revalidate = 300; // 5 Min

export async function GET() {
  try {
    const fc = await getHamburgForecast();
    const suggestions = rankAll(HAMBURG_POIS, new Date(), fc).slice(0, 3);
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      count: suggestions.length,
      suggestions,
    });
  } catch (err) {
    // Ehrlich scheitern: lieber leer als falsche Sicherheit.
    return NextResponse.json(
      { generatedAt: new Date().toISOString(), count: 0, suggestions: [], error: String(err) },
      { status: 200 },
    );
  }
}

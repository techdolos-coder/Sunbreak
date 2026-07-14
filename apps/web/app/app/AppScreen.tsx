"use client";

import { palette, radius, canvas } from "@/lib/tokens";
import {
  type Suggestion,
  MOCK_SUGGESTIONS,
  suggestionQuery,
} from "@/lib/suggestions";
import { kicker, ortZeile, shareText } from "@/lib/card";
import { shareInvite } from "@/lib/messenger";
import { SunGlyph, CloudSunGlyph, ShareGlyph } from "@/components/glyphs";
import type { AppState } from "@/lib/appState";
import { AppHeader, HeuteNicht, KeinStandort, Nacht } from "./states";

// Artefakt C — der Ein-Screen der App (Absender). Drei Vorschläge untereinander,
// erbt die Kartensprache. Ziel: App auf -> einen teilen, unter 15 Sekunden.
// Helles Thema, große Schrift, hoher Kontrast (wird draußen in der Sonne gelesen).

export default function AppScreen({
  state = "liste",
  suggestions,
  sunrise,
}: {
  state?: AppState;
  // Echte, gerankte Vorschläge (aus /api/suggestions). Fehlt der Prop, greifen
  // die Mock-Daten — z. B. wenn das Datenfundament nicht erreichbar ist.
  suggestions?: Suggestion[];
  // Nächster Sonnenaufgang (nur für den Nacht-Zustand).
  sunrise?: string;
}) {
  // Ehrliche Sonderzustände statt der Vorschlagsliste.
  if (state === "heute-nicht") return <HeuteNicht />;
  if (state === "kein-standort") return <KeinStandort />;
  if (state === "nacht") return <Nacht sunrise={sunrise} />;

  const list = suggestions ?? MOCK_SUGGESTIONS;

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: canvas.paper,
        display: "flex",
        justifyContent: "center",
        fontFamily: "var(--font-plex), system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440, padding: "22px 18px 32px" }}>
        <AppHeader subline="Sonne in deiner Nähe · jetzt" />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {list.map((s) => (
            <SuggestionCard key={s.id} s={s} />
          ))}
        </div>
      </div>
    </main>
  );
}

function SuggestionCard({ s }: { s: Suggestion }) {
  const c = palette[s.condition];
  const Glyph = s.condition === "sicher" ? SunGlyph : CloudSunGlyph;

  async function onShare() {
    const url = `${window.location.origin}/e?${suggestionQuery(s)}`;
    await shareInvite(shareText(s), url);
  }

  return (
    <article
      style={{ borderRadius: radius.card, overflow: "hidden", background: c.footer }}
    >
      {/* Hero — Signalblock */}
      <div style={{ background: c.hero, padding: "16px 18px 14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            color: c.inkStrong,
          }}
        >
          <Glyph width={16} height={16} />
          <span
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 3,
            }}
          >
            {/* Kicker ohne Emoji — den liefert der geteilte Text separat */}
            {kicker(s).replace(/^[^A-Za-zÄÖÜ]+/, "")}
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 900,
            fontSize: 60,
            lineHeight: 0.9,
            color: c.inkMax,
            marginTop: 4,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {s.sonneBisZeit}
        </div>

        <div
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: c.inkStrong,
            marginTop: 8,
          }}
        >
          {ortZeile(s)}
        </div>
        <div style={{ fontSize: 14, color: c.inkFooter, marginTop: 4 }}>
          {[
            s.gehzeit ? `${s.gehzeit} zu Fuß` : null,
            s.condition === "wackelig" ? s.wackeligGrund : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>

      {/* Fußzeile = Teilen (großes Tap-Ziel, ≥44px) */}
      <button
        type="button"
        onClick={onShare}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          padding: "14px 18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: c.inkFooter,
          fontFamily: "var(--font-plex), sans-serif",
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        <ShareGlyph width={18} height={18} />
        Teilen
      </button>
    </article>
  );
}

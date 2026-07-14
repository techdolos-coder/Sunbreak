"use client";

import type { ReactNode } from "react";
import { palette, canvas } from "@/lib/tokens";
import { CloudSunGlyph, MoonGlyph, PinGlyph, SunGlyph } from "@/components/glyphs";

// Ehrliche Sonderzustände des App-Screens. Ton laut Brief: ruhig, ehrlich, keine
// Alarmfarben — „lieber ein ehrliches ‚heute nicht' als eine falsche Sicherheit".

export function AppHeader({
  subline,
  light = false,
}: {
  subline?: string;
  light?: boolean;
}) {
  return (
    <header style={{ marginBottom: 16 }}>
      <p
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: 0.5,
          color: light ? "#F3E8CE" : "#20180A",
          margin: 0,
        }}
      >
        Sunbreak
      </p>
      {subline && (
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 14,
            color: light ? "#C8B489" : "#6b5a34",
          }}
        >
          {subline}
        </p>
      )}
    </header>
  );
}

function Shell({
  children,
  background,
  light = false,
}: {
  children: ReactNode;
  background: string;
  light?: boolean;
}) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background,
        display: "flex",
        justifyContent: "center",
        fontFamily: "var(--font-plex), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "22px 18px 32px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppHeader
          subline={light ? undefined : "Sonne in deiner Nähe · jetzt"}
          light={light}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 14,
            paddingBottom: 40,
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}

function Headline({ children, color }: { children: ReactNode; color: string }) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-archivo), sans-serif",
        fontWeight: 900,
        fontSize: 34,
        lineHeight: 1.05,
        color,
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}

// „Heute nicht" — Leerzustand: kein sonniger Fleck in der Nähe.
export function HeuteNicht() {
  return (
    <Shell background={canvas.paper}>
      <CloudSunGlyph width={64} height={64} color={palette.wackelig.footer} />
      <Headline color="#20180A">Heute nicht.</Headline>
      <p style={{ maxWidth: 320, color: "#5b4d2e", fontSize: 16, margin: 0 }}>
        Gerade findet sich kein sonniger Fleck in der Nähe — die Wolken sitzen
        fest. Lieber ehrlich als ein umsonst gelaufener Weg.
      </p>
    </Shell>
  );
}

// „Kein Standort" — die App braucht den ungefähren Standort (bleibt on-device).
export function KeinStandort() {
  function freigeben() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      // Bei Erfolg zurück in die Liste. Die Position bleibt im Browser.
      () => {
        window.location.href = "/app";
      },
      () => {
        /* Ablehnung: Zustand bleibt stehen */
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }
  return (
    <Shell background={canvas.paper}>
      <PinGlyph width={60} height={60} color={palette.sicher.hero} />
      <Headline color="#20180A">Kein Standort</Headline>
      <p style={{ maxWidth: 320, color: "#5b4d2e", fontSize: 16, margin: 0 }}>
        Sunbreak braucht deinen ungefähren Standort, um Sonne in der Nähe zu
        finden. Er bleibt auf dem Gerät — der Server erfährt ihn nie.
      </p>
      <button
        type="button"
        onClick={freigeben}
        style={{
          marginTop: 6,
          padding: "14px 22px",
          fontSize: 16,
          fontWeight: 700,
          color: palette.sicher.inkMax,
          background: palette.sicher.hero,
          border: `2px solid ${palette.sicher.footer}`,
          borderRadius: 12,
          cursor: "pointer",
          fontFamily: "var(--font-plex), sans-serif",
        }}
      >
        Standort freigeben
      </button>
    </Shell>
  );
}

// „Nacht" — jetzt ist nichts zu holen. Warmer Dämmerungston, aber fette, große
// Schrift (kein „Dark Mode mit dünner Schrift"). Zeigt den nächsten Sonnenaufgang.
export function Nacht({ sunrise }: { sunrise?: string }) {
  return (
    <Shell background="#241d12" light>
      <MoonGlyph width={60} height={60} color={palette.sicher.hero} />
      <Headline color="#F3E8CE">Jetzt ist keine Sonne zu holen.</Headline>
      <p style={{ maxWidth: 320, color: "#C8B489", fontSize: 16, margin: 0 }}>
        Sunbreak meldet sich, wenn’s wieder hell wird. Gute Nacht.
      </p>
      {sunrise && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 9,
            color: palette.sicher.hero,
          }}
        >
          <SunGlyph width={20} height={20} />
          <span
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 800,
              fontSize: 19,
            }}
          >
            Wieder aktiv ab {sunrise} Uhr
          </span>
        </div>
      )}
    </Shell>
  );
}

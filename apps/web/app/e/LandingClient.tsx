"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { palette, radius, canvas, DOMAIN_LABEL } from "@/lib/tokens";
import type { CardData } from "@/lib/card";
import { kicker, ortZeile, footerSubline } from "@/lib/card";
import {
  type Coords,
  directionsUrl,
  estimateWalkMinutes,
} from "@/lib/geo";
import { JA_TEXT, sendReply } from "@/lib/messenger";

// Karte nur im Browser (maplibre kennt kein SSR).
const Map = dynamic(() => import("./Map"), { ssr: false });

export interface LandingProps {
  card: CardData;
  coords: Coords;
  gehzeit?: string;
}

// Parst "15:47" zur heutigen Uhrzeit. Die Landingpage ist die LIVE-Wahrheit —
// hier ist relative Zeit ("noch 41 Min") erlaubt (im Gegensatz zur gecachten Karte).
function endToday(bis: string): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(bis.trim());
  if (!m) return null;
  const d = new Date();
  d.setHours(Number(m[1]), Number(m[2]), 0, 0);
  return d;
}

export default function LandingClient({ card, coords, gehzeit }: LandingProps) {
  const c = palette[card.condition];
  const [now, setNow] = useState<Date | null>(null); // erst clientseitig -> kein Hydration-Mismatch
  const [declined, setDeclined] = useState(false);
  const [walkMin, setWalkMin] = useState<number | null>(null);
  const [locBusy, setLocBusy] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const end = useMemo(() => endToday(card.sonneBisZeit), [card.sonneBisZeit]);
  const remainingMin =
    end && now ? Math.ceil((end.getTime() - now.getTime()) / 60_000) : null;
  const expired = remainingMin !== null && remainingMin <= 0;

  function shareLocation() {
    if (!("geolocation" in navigator)) return;
    setLocBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Berechnung bleibt im Browser; nichts geht an den Server.
        setWalkMin(
          estimateWalkMinutes(
            { lat: pos.coords.latitude, lng: pos.coords.longitude },
            coords,
          ),
        );
        setLocBusy(false);
      },
      () => setLocBusy(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  // --- Zustand: Link abgelaufen (Sonnenfenster vorbei) ---
  if (expired) {
    return (
      <Shell>
        <div style={{ ...cardBox, background: palette.wackelig.hero, padding: 28 }}>
          <p style={kickerStyle(palette.wackelig.inkStrong)}>☁ VORBEI</p>
          <h1 style={{ ...h1Style, color: palette.wackelig.inkMax, fontSize: 30 }}>
            Dieses Sonnenfenster ist vorbei
          </h1>
          <p style={{ color: palette.wackelig.inkStrong, marginTop: 8 }}>
            Am {card.ort} schien die Sonne bis {card.sonneBisZeit}.
          </p>
        </div>
        <DownloadHint />
      </Shell>
    );
  }

  // --- Zustand: Antwort verschickt / abgelehnt ---
  if (declined) {
    return (
      <Shell>
        <div style={{ ...cardBox, background: c.hero, padding: 28 }}>
          <h1 style={{ ...h1Style, color: c.inkMax, fontSize: 26 }}>
            Alles gut ☀
          </h1>
          <p style={{ color: c.inkStrong, marginTop: 8 }}>
            Vielleicht beim nächsten Sonnenfenster.
          </p>
        </div>
        <DownloadHint />
      </Shell>
    );
  }

  const walkLabel = gehzeit
    ? `${gehzeit} zu Fuß`
    : walkMin !== null
      ? `~${walkMin} Min zu Fuß (Luftlinie)`
      : null;

  // --- Hauptzustand: Einladung ---
  return (
    <Shell>
      {/* Hero — Fortsetzung der Vorschaukarte */}
      <div style={{ ...cardBox, background: c.hero, padding: "18px 20px 20px" }}>
        <p style={kickerStyle(c.inkStrong)}>{kicker(card)}</p>
        <div
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 900,
            fontSize: 88,
            lineHeight: 0.9,
            color: c.inkMax,
            marginTop: 4,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {card.sonneBisZeit}
        </div>
        <p
          style={{
            fontFamily: "var(--font-archivo), sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: c.inkStrong,
            marginTop: 10,
          }}
        >
          {ortZeile(card)}
        </p>
        {/* Live-Wahrheit: hier ist relative Zeit erlaubt */}
        {remainingMin !== null && (
          <p style={{ color: c.inkFooter, marginTop: 12, fontWeight: 600 }}>
            Jetzt noch {remainingMin} Min · {footerSubline(card)}
          </p>
        )}
      </div>

      {/* Gehzeit als Text (wichtiger als die Karte) */}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        {walkLabel ? (
          <p style={{ fontSize: 17, fontWeight: 600, color: "#3A2A08", margin: 0 }}>
            {walkLabel}
          </p>
        ) : (
          <button
            type="button"
            onClick={shareLocation}
            disabled={locBusy}
            style={linkButton}
          >
            {locBusy ? "Standort wird ermittelt…" : "Standort freigeben für Gehzeit"}
          </button>
        )}
      </div>

      {/* Karte als Beiwerk */}
      <div style={{ marginTop: 12 }}>
        <Map target={coords} />
      </div>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <a href={directionsUrl(coords)} target="_blank" rel="noreferrer" style={linkStyle}>
          In Karten-App öffnen →
        </a>
      </div>

      {/* Antwort — der eigentliche Zweck */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button
          type="button"
          onClick={() => void sendReply(JA_TEXT)}
          style={{
            ...primaryBtn,
            background: c.hero,
            color: c.inkMax,
            borderColor: c.footer,
          }}
        >
          Ja, komme
        </button>
        <button type="button" onClick={() => setDeclined(true)} style={secondaryBtn}>
          Nein
        </button>
      </div>

      <DownloadHint />
    </Shell>
  );
}

// --- kleine Bausteine & Styles ---

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: canvas.chatBg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440, margin: "0 auto" }}>{children}</div>
    </main>
  );
}

// Weicher Download-Hinweis: bewusst NACH der Antwort und unaufdringlich —
// der Empfänger soll nichts installieren müssen (Wachstumshebel, keine Hürde).
function DownloadHint() {
  return (
    <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, opacity: 0.6 }}>
      Willst du selbst einladen?{" "}
      {/* TODO: auf App-Store/PWA-Install verlinken, sobald verfügbar */}
      <a href="#" style={{ color: "#7a5410", fontWeight: 600 }}>
        Sunbreak holen
      </a>
    </p>
  );
}

const cardBox: React.CSSProperties = {
  borderRadius: radius.card,
  overflow: "hidden",
};

const h1Style: React.CSSProperties = {
  fontFamily: "var(--font-archivo), sans-serif",
  fontWeight: 800,
  margin: 0,
};

function kickerStyle(color: string): React.CSSProperties {
  return {
    fontFamily: "var(--font-archivo), sans-serif",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: 3,
    color,
    margin: 0,
  };
}

const primaryBtn: React.CSSProperties = {
  flex: 2,
  padding: "16px 12px",
  fontSize: 18,
  fontWeight: 700,
  border: "2px solid",
  borderRadius: 12,
  cursor: "pointer",
  fontFamily: "var(--font-plex), sans-serif",
};

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  padding: "16px 12px",
  fontSize: 18,
  fontWeight: 600,
  color: "#4a4230",
  background: "transparent",
  border: "2px solid #C7BEAC",
  borderRadius: 12,
  cursor: "pointer",
  fontFamily: "var(--font-plex), sans-serif",
};

const linkStyle: React.CSSProperties = {
  color: "#7a5410",
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
};

const linkButton: React.CSSProperties = {
  ...linkStyle,
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

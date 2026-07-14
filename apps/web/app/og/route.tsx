import { ImageResponse } from "next/og";
import { palette, DOMAIN_LABEL } from "@/lib/tokens";
import {
  cardFromParams,
  kicker,
  ortZeile,
  footerSubline,
} from "@/lib/card";
import { loadArchivo } from "@/lib/fonts";

// Node-Runtime, weil wir die Font-TTFs vom Dateisystem lesen.
export const runtime = "nodejs";

// Primaeres og:image-Format laut Handoff: 1200x630, Hero ~72 % / Fusszeile ~28 %.
// Die Uhrzeit ist der dominante Bildinhalt. Absolute Zeit, kein Countdown.
const W = 1200;
const H = 630;
const HERO_H = Math.round(H * 0.72); // ~454
const FOOTER_H = H - HERO_H; // ~176
const PAD_X = 56;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const card = cardFromParams(searchParams);
  const c = palette[card.condition];
  const fonts = await loadArchivo();

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Archivo",
        }}
      >
        {/* Block 1 — Hero (Sonnenlicht) */}
        <div
          style={{
            height: HERO_H,
            backgroundColor: c.hero,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: `0 ${PAD_X}px`,
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 7,
              color: c.inkStrong,
            }}
          >
            {kicker(card)}
          </div>
          <div
            style={{
              fontSize: 300,
              fontWeight: 900,
              lineHeight: 0.9,
              color: c.inkMax,
              marginTop: 8,
              // Tabellenziffern: duerfen beim Wechsel 14:47 -> 15:47 nicht springen.
              fontFeatureSettings: '"tnum"',
            }}
          >
            {card.sonneBisZeit}
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: c.inkStrong,
              marginTop: 18,
            }}
          >
            {ortZeile(card)}
          </div>
        </div>

        {/* Block 2 — Fusszeile (Meta / Domain) */}
        <div
          style={{
            height: FOOTER_H,
            backgroundColor: c.footer,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: `0 ${PAD_X}px`,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: c.inkFooter }}>
            {footerSubline(card)}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              color: c.domain,
              marginTop: 12,
            }}
          >
            {DOMAIN_LABEL}
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts,
      emoji: "twemoji",
      headers: {
        // Stabil cachebar: die Bild-URL kodiert Ort + absolute Endzeit + Zustand.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}

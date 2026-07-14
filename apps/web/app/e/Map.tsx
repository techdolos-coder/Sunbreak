"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Coords } from "@/lib/geo";
import { palette, radius } from "@/lib/tokens";

// Karte ist BEIWERK, nicht Hauptdarsteller (Handoff, Entscheidung #5):
// warmer/entsättigter "Papier"-Ton, EIN Bernstein-Pin, kein POI-Rauschen,
// kaum interaktiv (kein Scroll-Zoom, damit sie das Seitenscrollen nicht kapert).
//
// MVP-Notiz: Für den Papierton legen wir einen CSS-Filter über OSM-Raster-Kacheln.
// Produktiv gehört hier ein echter, entsättigter Vektorstil (MapTiler/self-hosted)
// hin — die "MapLibre-Ästhetik" bleibt, nur die Kachelquelle wird getauscht.
const PAPER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap-Mitwirkende",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export default function Map({ target }: { target: Coords }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: PAPER_STYLE,
      center: [target.lng, target.lat],
      zoom: 15,
      attributionControl: { compact: true },
      scrollZoom: false, // Beiwerk: nicht das Seitenscrollen stehlen
      dragRotate: false,
      pitchWithRotate: false,
      keyboard: false,
    });

    // Einziger Bernstein-Pin am Zielort.
    const pin = document.createElement("div");
    pin.style.width = "22px";
    pin.style.height = "22px";
    pin.style.borderRadius = "50% 50% 50% 0";
    pin.style.transform = "rotate(-45deg)";
    pin.style.background = palette.sicher.hero;
    pin.style.border = `3px solid ${palette.sicher.footer}`;
    pin.style.boxShadow = "0 2px 6px rgba(0,0,0,0.35)";
    new maplibregl.Marker({ element: pin, anchor: "bottom" })
      .setLngLat([target.lng, target.lat])
      .addTo(map);

    return () => map.remove();
  }, [target.lat, target.lng]);

  return (
    <div
      ref={containerRef}
      aria-label="Karte mit dem Zielort"
      style={{
        width: "100%",
        height: 200,
        borderRadius: radius.card,
        overflow: "hidden",
        // warmer, entsättigter Papier-Look
        filter: "sepia(0.35) saturate(0.55) brightness(1.05) contrast(0.95)",
      }}
    />
  );
}

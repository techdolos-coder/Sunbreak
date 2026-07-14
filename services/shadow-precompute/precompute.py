#!/usr/bin/env python3
"""Schatten-Precompute (Offline-Pipeline, einmalig/jährlich).

Erzeugt pro POI ein statisches Sichtbarkeitsprofil h(azimut): den Horizont-
Höhenwinkel je Himmelsrichtung (0..359°, 0 = Nord). Zur Laufzeit prüft die
Ranking-Engine dann in O(1): Sonne sichtbar ⟺ Sonnenhöhe > h(azimut).

Eingabe = Gebäude-Footprints mit Höhe (aus Hamburgs bDOM/LoD2). Hier mit einem
synthetischen Beispiel-Satz lauffähig; für echte Daten `--buildings <geojsonish>`
übergeben (Liste von {"height": m, "coords": [[lng,lat], ...]}).

Ausgabe = JSON-Array mit 360 Float-Werten (Grad).
"""
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import numpy as np

OBSERVER_HEIGHT_M = 1.6  # Augenhöhe
OPEN_HORIZON_DEG = 2.0  # freies Feld (Bäume/Gelände) ohne Gebäude
EARTH_R = 6371000.0


def lnglat_to_local_m(lng, lat, poi_lng, poi_lat):
    """Äquirektangulär um den POI: (dx = Ost, dy = Nord) in Metern."""
    dlat = math.radians(lat - poi_lat)
    dlng = math.radians(lng - poi_lng)
    dy = dlat * EARTH_R
    dx = dlng * EARTH_R * math.cos(math.radians(poi_lat))
    return dx, dy


def densify(coords, step_m, poi_lng, poi_lat):
    """Footprint-Umriss in ~step_m-Abständen abtasten (lokale Meter)."""
    pts = [lnglat_to_local_m(lng, lat, poi_lng, poi_lat) for lng, lat in coords]
    out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
        seg = math.hypot(x1 - x0, y1 - y0)
        n = max(1, int(seg / step_m))
        for k in range(n):
            t = k / n
            out.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
    return out


def compute_horizon(buildings, poi_lng, poi_lat, step_m=1.0):
    """Max-Höhenwinkel je Grad-Azimut über alle Gebäude-Silhouetten."""
    horizon = np.full(360, OPEN_HORIZON_DEG, dtype=float)
    for b in buildings:
        h = float(b["height"]) - OBSERVER_HEIGHT_M
        if h <= 0:
            continue
        for x, y in densify(b["coords"], step_m, poi_lng, poi_lat):
            dist = math.hypot(x, y)
            if dist < 1e-6:
                continue
            az = (math.degrees(math.atan2(x, y)) + 360.0) % 360.0  # 0=N,90=O
            elev = math.degrees(math.atan2(h, dist))
            b_idx = int(az) % 360
            if elev > horizon[b_idx]:
                horizon[b_idx] = elev
    return horizon


def synthetic_buildings():
    """Beispiel: eine Häuserzeile westlich des POI (blockt Abendsonne),
    offen nach Norden/Osten. Zeigt den Effekt ohne echte bDOM-Daten."""
    # ~40 m westlich, Blöcke à ~20 m, Höhe 18 m; leicht in lng/lat um Hammer Park.
    base_lng, base_lat = 10.0539, 53.5556
    dlng = -0.0006  # ~40 m West
    blocks = []
    for i in range(-2, 3):
        off = i * 0.00025  # ~28 m Nord-Süd-Versatz
        blocks.append(
            {
                "height": 18.0,
                "coords": [
                    [base_lng + dlng, base_lat + off],
                    [base_lng + dlng - 0.0003, base_lat + off],
                    [base_lng + dlng - 0.0003, base_lat + off + 0.0002],
                    [base_lng + dlng, base_lat + off + 0.0002],
                ],
            }
        )
    return blocks, base_lng, base_lat


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--poi-lat", type=float)
    ap.add_argument("--poi-lng", type=float)
    ap.add_argument("--buildings", type=str, help="JSON mit Footprints (optional)")
    ap.add_argument("--out", type=str, required=True)
    args = ap.parse_args()

    if args.buildings:
        buildings = json.loads(Path(args.buildings).read_text())
        poi_lng, poi_lat = args.poi_lng, args.poi_lat
    else:
        buildings, base_lng, base_lat = synthetic_buildings()
        poi_lng = args.poi_lng if args.poi_lng is not None else base_lng
        poi_lat = args.poi_lat if args.poi_lat is not None else base_lat

    horizon = compute_horizon(buildings, poi_lng, poi_lat)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps([round(float(v), 2) for v in horizon]))
    peak_az = int(np.argmax(horizon))
    print(
        f"{out}: {len(horizon)} Azimute, "
        f"max {horizon[peak_az]:.1f}° bei {peak_az}° "
        f"(0=N,90=O,180=S,270=W)"
    )


if __name__ == "__main__":
    main()

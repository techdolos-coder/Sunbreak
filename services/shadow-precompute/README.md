# Schatten-Precompute (Offline-Pipeline)

Erzeugt pro POI ein **statisches Sichtbarkeitsprofil** `h(azimut)` — den
Horizont-Höhenwinkel je Himmelsrichtung (360 Werte, 0 = Nord). Die teure
3D-Geometrie läuft **einmalig/jährlich offline**; zur Laufzeit prüft die
Ranking-Engine dann in O(1): *Sonne sichtbar ⟺ Sonnenhöhe > h(azimut)*.

## Ausführen

```bash
# Synthetisches Beispiel (Häuserzeile westlich des POI) -> Hammer-Park-Profil
python3 precompute.py --out ../../apps/web/data/horizons/hammerpark.json

# Mit echten Gebäudedaten
python3 precompute.py \
  --poi-lat 53.5556 --poi-lng 10.0539 \
  --buildings buildings.json \
  --out ../../apps/web/data/horizons/hammerpark.json
```

`buildings.json` = Liste von Footprints: `[{ "height": 18.0, "coords": [[lng,lat], ...] }, ...]`.

Ausgabe = JSON-Array mit 360 Float-Werten (Grad), das `data/pois.ts` importiert.

## Nur `numpy` nötig

```bash
pip install numpy
```

## Produktions-Lücke: echte bDOM-/LoD2-Daten

Die Eingabe kommt in Produktion aus **Hamburgs bDOM/LoD2-Gebäudemodell**
(Geoportal Hamburg, kostenlos). Der Weg dorthin ist noch offen:

1. LoD2-Kacheln für Hamburg laden (CityGML/GML).
2. Gebäude-Footprints + Traufhöhen extrahieren (z. B. via `citygml-tools`/GDAL).
3. Pro kuratiertem POI die umliegenden Gebäude (~Radius 800 m) filtern und in das
   `buildings.json`-Format bringen.
4. `precompute.py` je POI laufen lassen; Profile nach `apps/web/data/horizons/`.

Verfeinerung: Ray-Casting mit Geländehöhe (DGM) statt ebener Näherung, und
feinere Abtastung (`--step`) für große Gebäude.

# Datenfundament — Stand & Architektur

Beantwortet die eine Frage: *Scheint an einem POI in den nächsten 60–90 Min die
Sonne — und wie verlässlich?* Aus drei unabhängigen Bausteinen, alle ohne
Nutzerstandort auf dem Server.

## Was gebaut & verifiziert ist (läuft echt)

| Baustein | Ort | Was |
|---|---|---|
| **Sonnenstand** | `apps/web/lib/engine/sun.ts` | SunCalc v2, rein astronomisch (Ort+Zeit). |
| **Horizont-Sichtbarkeit** | `apps/web/lib/engine/horizon.ts` | O(1)-Prüfung Sonnenhöhe vs. `h(azimut)`. |
| **Ranking** | `apps/web/lib/engine/ranking.ts` | kombiniert Sonne + Wolken → `sicher`/`wackelig`/nichts, absolute „Sonne bis", Rule-Score. |
| **Wetter-Ingest** | `apps/web/lib/weather.ts` | echter Open-Meteo-Abruf (ICON, cloud_cover low/mid/high + DNI), TTL-Cache. |
| **Schatten-Precompute** | `services/shadow-precompute/precompute.py` | Ray-Casting `h(azimut)` aus Gebäuden (numpy). |
| **POIs + Bundle** | `apps/web/data/pois.ts`, `app/api/suggestions/route.ts` | kuratierte POIs + `/api/suggestions` (gerankt). |

`/app` konsumiert das live: leere Liste → Zustand „Heute nicht", Ausfall → Mock-Fallback.

**Verifiziert:** `GET /api/engine-check` (8/8 grün: Sonnenstand gegen bekannte
Werte, Horizont, Ranking-Szenarien). End-to-end zeigt `/api/suggestions` mit
echtem Wetter, dass Hamm­er Park abends korrekt herausfällt (westliche Gebäude
blocken die tiefe Sonne), während offene POIs bleiben.

## Datenschutz-Eigenschaft (per Konstruktion)

Ranking hängt nur von POI-Ort, Zeit und stadtweitem Wetter ab — **nicht vom
Nutzerstandort**. Der Server rechnet EINEN Stand für ganz Hamburg und schickt
allen dasselbe. Gehzeit (nutzerspezifisch) wird clientseitig auf der Landingpage
berechnet, verlässt das Gerät nie.

## Produktions-Lücken (bewusst offen)

- **Echte bDOM-/LoD2-Daten:** aktuell ein synthetisches Beispielprofil (Hammer
  Park) + `OPEN_HORIZON` für den Rest. Pipeline für echte Gebäudedaten: siehe
  `services/shadow-precompute/README.md`.
- **Satelliten-Nowcast** (EUMETSAT MSG, 0–90 Min Wolkenzug) fehlt — würde die
  kurzfristige Prognose deutlich schärfen. Aktuell nur ICON-Stundenwerte.
- **Prod-Stack:** Zielarchitektur ist FastAPI + PostGIS (POIs/Profile) +
  TimescaleDB (Prognose-TTL) + Redis (Bundle-Cache/Rate-Limit). Hier als
  Next-Route-Handler + Fetch-/ISR-Cache abgebildet (gleicher Vertrag, kleiner).
- **Report/Aggregator** (Crowd-Korrektur mit Zeit-Jitter + Bayes-Shrinkage) und
  **Pseudonym-Auth** (Device-Token) noch nicht gebaut.
- **Validierungs-Protokoll (Entscheidung 7):** Fehlalarm-Rate über 3 Wochen gegen
  DWD-Messung + naive Persistenz messen; Abbruchkriterium >30 %. Noch offen — die
  entscheidende Zahl kennen wir nicht.
- **Kuratierung der POIs** ist der teuerste, nicht automatisierbare Posten
  (ein schlechter Vorschlag kostet dauerhaft einen Nutzer).

## Schwellen (in `ranking.ts`, kalibrierbar)

`SICHER_MAX = 30 %` effektive Bewölkung (darunter klar), `SONNE_WEG = 55 %`
(darüber Fenster zu). Effektive Bewölkung gewichtet tief/mittel/hoch = 1 / 0,6 /
0,15 (Zirren blocken kaum). Diese Werte gehören gegen echte Messungen kalibriert.

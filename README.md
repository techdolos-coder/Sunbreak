# Sunbreak

Spontan-App für Hamburg. Beantwortet **eine** Frage: *Wo scheint in den nächsten
60–90 Minuten die Sonne, nah genug zum Losgehen — und wie lade ich jemanden dazu
ein?* Kern: App auf → drei Vorschläge → einen teilen, **unter 15 Sekunden**. Der
Eingeladene installiert nichts (Link → Browser-Landingpage).

Privacy-by-design: das Ranking hängt nur von Ort, Zeit und stadtweitem Wetter ab —
nie vom Nutzerstandort. Der Server rechnet einen Stand für ganz Hamburg.

## Monorepo

| Pfad | Was |
|---|---|
| `apps/web` | Next.js: Vorschaukarte als `og:image` (A), Empfänger-Landingpage (B), App-Screen (C), Datenfundament (Engine + Wetter + `/api/suggestions`). |
| `apps/mobile` | Expo: native Absender-App + Homescreen-Widget (D). Braucht Dev-Build, nicht Expo Go. |
| `services/shadow-precompute` | Python/numpy: statische Horizontprofile pro POI (Offline-Pipeline). |
| `docs/` | Architektur- und Stand-Notizen (z. B. `datenfundament.md`). |

## Schnellstart

```bash
# Web (A/B/C + Datenfundament)
cd apps/web && npm install && npm run dev      # http://localhost:3000

# Schatten-Precompute (erzeugt Horizontprofile)
cd services/shadow-precompute && python3 precompute.py --out ../../apps/web/data/horizons/hammerpark.json

# Mobile (D) — siehe apps/mobile/README.md (Dev-Build nötig)
```

Wichtige Routen (Web): `/app` (App-Screen), `/og` (Vorschaukarte), `/e`
(Einladung/Landingpage), `/api/suggestions` (gerankt), `/api/engine-check`
(Engine-Diagnose).

## Artefakte & Stand

A · Vorschaukarte ✅ · B · Landingpage ✅ · C · App-Screen ✅ (inkl. Zustände
„Heute nicht" / „Kein Standort" / „Nacht" / „Link abgelaufen") · D · Widget ✅
(Android voll, iOS als Scaffold). Datenfundament ✅ (Sonne + Horizont + echtes
Open-Meteo-Wetter). Offene Prod-Lücken: echte bDOM-Daten, Satelliten-Nowcast,
Prod-Stack (FastAPI/PostGIS/Timescale/Redis), Validierungs-Protokoll — siehe
`docs/datenfundament.md`.

## Design

Gestalterische Vorgabe: Abfahrtstafel-Ästhetik, die Uhrzeit ist der Held, EINE
Signalfarbe (Sonnenlicht-Bernstein), Zustand über Sättigung (`sicher`/`wackelig`).
Kein Wetter-App-Look, kein Dark Mode mit dünner Schrift.

# Mitmachen bei Sunbreak

Willkommen! Diese Seite bringt dich vom `git clone` bis zum ersten Pull Request.
Lies vorher einmal die [README](README.md) — die erklärt, **was** die App macht und
warum. Hier geht's um das **Wie** der Zusammenarbeit.

## Grundregeln in einem Absatz

Sunbreak beantwortet genau **eine** Frage: *Wo scheint jetzt Sonne, nah genug zum
Losgehen?* Alles, was wir bauen, dient diesem einen Screen. Zwei Dinge sind nicht
verhandelbar: **(1) Privacy** — das Ranking hängt nur von Ort, Zeit und stadtweitem
Wetter ab, nie vom Nutzerstandort. **(2) Die Gestaltung** — Abfahrtstafel-Look, die
Uhrzeit ist der Held, **eine** Signalfarbe (Sonnenlicht-Bernstein), Zustand über
Sättigung (`sicher`/`wackelig`), kein Wetter-App-Look, kein Dark Mode mit dünner
Schrift. Wenn eine Idee gegen eins von beiden verstößt, erst besprechen.

## Voraussetzungen

| Werkzeug | Version | Wofür |
|---|---|---|
| Node.js | 20+ (getestet bis 26) | `apps/web` und `apps/mobile` |
| npm | kommt mit Node | Pakete |
| Python | 3.11+ (mit `numpy`) | `services/shadow-precompute` (nur bei Horizont-Arbeit) |
| Git | beliebig | Versionierung |

Für die **native App** (`apps/mobile`) zusätzlich das Expo-Toolchain — Details in
[`apps/mobile/README.md`](apps/mobile/README.md). Achtung: Das Widget braucht einen
**Dev-Build**, Expo Go reicht nicht.

## Einrichten

```bash
git clone https://github.com/techdolos-coder/Sunbreak.git
cd Sunbreak

# Web (Artefakte A/B/C + Datenfundament) — das ist der Haupteinstieg
cd apps/web
npm install
npm run dev        # http://localhost:3000
```

Wichtige Routen im Web-Teil:

| Route | Was du siehst |
|---|---|
| `/app` | der App-Screen (drei Vorschläge) — das Herzstück |
| `/og` | die Vorschaukarte als Bild (WhatsApp-Linkvorschau) |
| `/e` | die Empfänger-Landingpage (Einladung öffnen) |
| `/api/suggestions` | die gerankten Vorschläge als JSON |
| `/api/engine-check` | Selbsttest der Sonnen-/Horizont-Engine |

Sonderzustände lokal ansehen: `/app?state=heute-nicht`, `?state=kein-standort`,
`?state=nacht`. (Der Nacht-Zustand kommt sonst automatisch, wenn die Sonne unter
dem Horizont steht.)

### Optional: Horizontprofile neu rechnen

```bash
cd services/shadow-precompute
python3 precompute.py --out ../../apps/web/data/horizons/hammerpark.json
```

Nur nötig, wenn du an den Schattenwurf-Daten arbeitest.

## Woran arbeiten? — Aufbau

| Pfad | Zuständig für |
|---|---|
| `apps/web/app/` | Routen & UI (App-Screen, Landingpage, og-Bild) |
| `apps/web/lib/engine/` | Sonne, Horizont, Ranking, Tag/Nacht |
| `apps/web/lib/` | Kartenmodell, Tokens, Wetter, Teilen |
| `apps/web/data/` | POIs + Horizontprofile |
| `apps/mobile/` | native App + Homescreen-Widget |
| `services/shadow-precompute/` | Offline-Horizont-Pipeline (Python) |
| `docs/` | Architektur- & Stand-Notizen |

Offene größere Themen stehen am Ende von [`docs/datenfundament.md`](docs/datenfundament.md)
(echte bDOM-Gebäudedaten, Satelliten-Nowcast, Validierungs-Protokoll, Prod-Stack).

## Workflow: Branch → Commit → Pull Request

Wir committen **nicht direkt auf `main`**. Immer über einen Branch + PR — so sieht
jede/r, was reinkommt, und `main` bleibt jederzeit deploybar (Netlify baut `main`
automatisch live auf https://sunb.netlify.app).

```bash
git checkout main && git pull            # aktuellen Stand holen
git checkout -b feature/kurz-beschrieben # neuer Branch
# ... arbeiten ...
git add -A
git commit -m "Kurz, im Imperativ: was die Änderung tut"
git push -u origin feature/kurz-beschrieben
```

Danach auf GitHub **„Compare & pull request"** klicken, kurz beschreiben *was* und
*warum*, und jemanden aus der Gruppe als Reviewer eintragen.

**Branch-Namen:** `feature/…`, `fix/…`, `docs/…`, `chore/…`.

**Commit-Nachrichten:** eine Zeile, Imperativ, auf Deutsch ist völlig okay (siehe
`git log`). Beispiel: `Nacht-Zustand automatisch + Sonnenaufgangs-Hinweis`.

### Vor dem Push kurz selbst prüfen

```bash
cd apps/web
npm run build        # muss grün durchlaufen (Netlify baucht sonst nicht)
npm run lint         # Stil-/Fehlercheck
```

Für die Mobile-App: `npm run typecheck` in `apps/mobile`.

## Stil

- **TypeScript**, funktionale React-Komponenten, keine neuen Abhängigkeiten ohne
  kurze Absprache (jede Dependency ist Wartungslast).
- Design-Tokens kommen aus `apps/web/lib/tokens.ts` bzw. `apps/mobile/theme.ts` —
  **keine** hartkodierten Farben/Radien in Komponenten. Nie eine zweite Signalfarbe.
- Kommentare erklären das **Warum**, nicht das Was. Schreib so, wie der umgebende
  Code schreibt (Sprache, Dichte, Benennung).
- Uhrzeiten immer als **absolute** Zeit (`bis 15:40`), nie als Countdown — die
  Vorschaukarte ist gecacht, ein Countdown würde lügen.

## Fragen

Kurze Sachen in die WhatsApp-Gruppe, alles Nachvollziehbare als **GitHub Issue**
(dann geht's nicht unter). Viel Freude — und immer dem Licht nach. ☀

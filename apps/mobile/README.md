# Sunbreak — Mobile (Absender-App + Homescreen-Widget)

Native Expo-App für den **Absender**: der Ein-Screen mit drei Vorschlägen
(Artefakt C, hier nativ) und das **Homescreen-Widget** (Artefakt D) — ein
Vorschlag, groß. Erbt die Kartensprache aus dem Handoff (Signalblock,
`sicher`/`wackelig` über Sättigung).

Der **Empfänger** braucht nichts davon — für ihn bleibt es die Web-Landingpage
(`apps/web`, Route `/e`). Der geteilte Link zeigt dorthin.

## Wichtig: braucht einen Dev-Build (nicht Expo Go)

Widgets sind nativer Code (Android `AppWidget`, iOS WidgetKit). Die Libs
`react-native-android-widget` und `@bacons/apple-targets` erzeugen native
Targets — das läuft **nicht in Expo Go**, sondern nur in einem eigenen Dev-Build.

## Voraussetzungen

- Node ≥ 20, `npm install` (einmalig)
- **Android:** Android Studio + SDK, ein Emulator oder Gerät
- **iOS:** macOS + Xcode; in `app.json` `ios.appleTeamId` auf deine Team-ID setzen
- Optional: EAS (`eas build`) statt lokaler Toolchains

## Starten

```bash
npm install

# Android (Widget voll funktionsfähig)
npx expo prebuild -p android
npm run android
# danach: Homescreen lang drücken → Widgets → „Sunbreak" platzieren

# iOS (Widget als Scaffold, siehe unten)
#   vorher app.json: ios.appleTeamId setzen
npx expo prebuild -p ios
npm run ios
```

## Aufbau

| Bereich | Datei(en) |
|---|---|
| App-Screen (Absender) | `App.tsx`, `components/SunMark.tsx` |
| Design-Sprache | `theme.ts`, `lib/card.ts`, `lib/suggestions.ts` |
| Android-Widget UI | `widget/SunbreakWidget.tsx` (JS-Primitive) |
| Android-Widget Handler | `widget/handler.tsx` (headless), registriert in `index.ts` |
| Widget-Datensync | `widget/data.tsx` (`syncTopSuggestion`), `widget/store.ts` |
| iOS-Widget | `targets/widget/SunbreakWidget.swift`, `targets/widget/expo-target.config.js` |

Datenfluss: die App spiegelt beim Start den obersten Vorschlag via
`syncTopSuggestion` → persistiert (AsyncStorage) und ruft `requestWidgetUpdate`
(Android). Der headless Handler liest bei OS-getriebenen Updates den Speicher.

## Offene Punkte / bewusst als Folgeaufgabe

- **iOS JS→App-Group-Brücke fehlt.** Die SwiftUI-Extension liest den Vorschlag
  aus der App-Group-Suite `group.hamburg.sonnenfenster.sunbreak` (Key
  `topSuggestion`, JSON). Der App-seitige Schreibpfad dorthin braucht ein
  gepflegtes natives Modul (bzw. `WidgetCenter.reloadAllTimelines()`). Bis dahin
  zeigt das iOS-Widget den Fallback-Vorschlag. Android ist voll funktionsfähig.
- **`WEB_BASE_URL`** (`theme.ts`) zeigt auf `https://sonnenfenster.hamburg`. Für
  lokales Testen des geteilten Links auf die IP der `apps/web`-Dev-Instanz zeigen.
- **`previewImage`** des Android-Widgets ist ein Platzhalter (`assets/icon.png`).
- **Daten sind Mock** (`MOCK_SUGGESTIONS`); die On-Device-Ranking-Engine folgt.

## Verifikationsstand

`npm run typecheck` (tsc) und `npx expo-doctor` laufen grün. Ein nativer Build
(Xcode/Android Studio/EAS) wurde in der Entwicklungsumgebung **nicht** ausgeführt
— bitte lokal per Dev-Build gegenprüfen.

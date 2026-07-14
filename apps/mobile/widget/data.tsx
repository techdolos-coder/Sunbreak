import { Platform } from "react-native";
import { requestWidgetUpdate } from "react-native-android-widget";
import { SunbreakWidget } from "./SunbreakWidget";
import { saveTopSuggestion, toWidgetSuggestion } from "./store";
import type { Suggestion } from "../lib/suggestions";

// Spiegelt den obersten Vorschlag ins Homescreen-Widget. Wird beim App-Start
// (und später bei jeder Ranking-Aktualisierung) aufgerufen.
export async function syncTopSuggestion(s: Suggestion): Promise<void> {
  const ws = toWidgetSuggestion(s);

  // Persistieren für iOS-Extension + headless Android-Updates.
  await saveTopSuggestion(ws);

  if (Platform.OS === "android") {
    await requestWidgetUpdate({
      widgetName: "Sunbreak",
      renderWidget: () => <SunbreakWidget s={ws} />,
      widgetNotFound: () => {
        // Kein Widget auf dem Homescreen platziert — nichts zu tun.
      },
    });
  }
  // iOS: die WidgetKit-Extension liest den App-Group-Wert beim nächsten Timeline-
  // Refresh. Ein sofortiges WidgetCenter.reloadAllTimelines() bräuchte ein kleines
  // natives Modul — bewusst als Folgeaufgabe dokumentiert (siehe README).
}

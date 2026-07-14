import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { SunbreakWidget } from "./SunbreakWidget";
import { loadTopSuggestion } from "./store";

// Headless-Handler: das OS ruft ihn zum Rendern/Aktualisieren des Widgets auf —
// auch wenn die App nicht läuft. Wir lesen den zuletzt gespeicherten Vorschlag.
export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps,
): Promise<void> {
  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED": {
      const s = await loadTopSuggestion();
      props.renderWidget(<SunbreakWidget s={s} />);
      break;
    }
    case "WIDGET_CLICK":
      // Tap ist als clickAction="OPEN_APP" nativ verdrahtet — nichts zu tun.
      break;
    default:
      break;
  }
}

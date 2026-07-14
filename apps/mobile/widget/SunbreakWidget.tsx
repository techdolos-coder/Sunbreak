import { FlexWidget, TextWidget } from "react-native-android-widget";
import { palette } from "../theme";
import type { WidgetSuggestion } from "./store";

// Artefakt D — das Homescreen-Widget: EIN Vorschlag, groß. Erbt die Kartensprache
// (Signalblock, sicher/wackelig via Sättigung). Tap öffnet die App.
// UI in den JS-Primitiven von react-native-android-widget (rendert nativ).
export function SunbreakWidget({ s }: { s: WidgetSuggestion }) {
  const c = palette[s.condition];
  const kicker = s.condition === "sicher" ? "☀ SONNE BIS" : "⛅ WACKELIG";
  const meta =
    s.condition === "wackelig" && s.wackeligGrund
      ? `${s.gehzeit} zu Fuß · ${s.wackeligGrund}`
      : `${s.gehzeit} zu Fuß`;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        borderRadius: 11,
        backgroundColor: c.footer,
      }}
    >
      {/* Hero — Signalblock */}
      <FlexWidget
        style={{
          flex: 1,
          width: "match_parent",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: c.hero,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TextWidget
          text={kicker}
          style={{ fontSize: 11, fontWeight: "700", color: c.inkStrong }}
        />
        <TextWidget
          text={s.sonneBisZeit}
          style={{ fontSize: 46, fontWeight: "900", color: c.inkMax }}
        />
        <TextWidget
          text={`${s.ort} · ${s.bereich}`}
          style={{ fontSize: 14, fontWeight: "700", color: c.inkStrong }}
        />
        <TextWidget
          text={meta}
          style={{ fontSize: 12, color: c.inkFooter }}
        />
      </FlexWidget>

      {/* Fußzeile */}
      <FlexWidget
        style={{
          width: "match_parent",
          height: 34,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: c.footer,
        }}
      >
        <TextWidget
          text="Öffnen & teilen"
          style={{ fontSize: 13, fontWeight: "700", color: c.inkFooter }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

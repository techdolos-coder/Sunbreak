import { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { palette, canvas, radius } from "./theme";
import {
  type Suggestion,
  MOCK_SUGGESTIONS,
  shareUrl,
} from "./lib/suggestions";
import { kicker, ortZeile, shareText } from "./lib/card";
import { SunMark } from "./components/SunMark";
import { syncTopSuggestion } from "./widget/data";

// Artefakt C/D — der Ein-Screen des Absenders. Drei Vorschläge untereinander,
// erbt die Kartensprache. Ziel: App auf -> einen teilen, unter 15 Sekunden.
export default function App() {
  // Den obersten Vorschlag ans Homescreen-Widget spiegeln (Artefakt D).
  useEffect(() => {
    void syncTopSuggestion(MOCK_SUGGESTIONS[0]);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>Sunbreak</Text>
          <Text style={styles.subline}>Sonne in deiner Nähe · jetzt</Text>
        </View>
        {MOCK_SUGGESTIONS.map((s) => (
          <SuggestionCard key={s.id} s={s} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SuggestionCard({ s }: { s: Suggestion }) {
  const c = palette[s.condition];
  const wackelig = s.condition === "wackelig";

  async function onShare() {
    // WhatsApp & Co. bauen aus dem Link die Vorschaukarte (og:image).
    await Share.share({ message: `${shareText(s)}\n${shareUrl(s)}` });
  }

  return (
    <View style={[styles.card, { backgroundColor: c.footer }]}>
      <View style={[styles.hero, { backgroundColor: c.hero }]}>
        <View style={styles.kickerRow}>
          <SunMark size={16} color={c.inkStrong} wackelig={wackelig} />
          <Text style={[styles.kicker, { color: c.inkStrong }]}>{kicker(s)}</Text>
        </View>
        <Text style={[styles.time, { color: c.inkMax }]}>{s.sonneBisZeit}</Text>
        <Text style={[styles.ort, { color: c.inkStrong }]}>{ortZeile(s)}</Text>
        <Text style={[styles.meta, { color: c.inkFooter }]}>
          {s.gehzeit} zu Fuß
          {wackelig && s.wackeligGrund ? ` · ${s.wackeligGrund}` : ""}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.shareBtn}
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel={`${s.ort} teilen`}
      >
        <Text style={[styles.shareLabel, { color: c.inkFooter }]}>Teilen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: canvas.paper },
  scroll: { padding: 18, paddingBottom: 32, maxWidth: 440, width: "100%", alignSelf: "center" },
  header: { marginBottom: 16 },
  wordmark: { fontSize: 22, fontWeight: "900", color: "#20180A", letterSpacing: 0.5 },
  subline: { marginTop: 2, fontSize: 14, color: "#6b5a34" },
  card: { borderRadius: radius.card, overflow: "hidden", marginBottom: 16 },
  hero: { padding: 16, paddingBottom: 14 },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  kicker: { fontSize: 12, fontWeight: "800", letterSpacing: 3 },
  time: { fontSize: 60, fontWeight: "900", marginTop: 4, fontVariant: ["tabular-nums"] },
  ort: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  meta: { fontSize: 14, marginTop: 4 },
  shareBtn: { paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  shareLabel: { fontSize: 16, fontWeight: "700" },
});

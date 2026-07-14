import { View } from "react-native";

// Eigene, minimale Glyphe statt System-Emoji (Handoff, Entscheidung #4):
// sicher = gefüllte Sonnenscheibe, wackelig = Scheibe mit vorgelagerter Wolke.
// Bewusst aus reinen Views gebaut (keine SVG-Abhängigkeit).
export function SunMark({
  size = 14,
  color,
  wackelig = false,
}: {
  size?: number;
  color: string;
  wackelig?: boolean;
}) {
  return (
    <View style={{ width: size, height: size, justifyContent: "center" }}>
      <View
        style={{
          width: size * 0.72,
          height: size * 0.72,
          borderRadius: size,
          backgroundColor: color,
          alignSelf: wackelig ? "flex-start" : "center",
        }}
      />
      {wackelig && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.8,
            height: size * 0.5,
            borderRadius: size,
            backgroundColor: color,
            opacity: 0.85,
          }}
        />
      )}
    </View>
  );
}

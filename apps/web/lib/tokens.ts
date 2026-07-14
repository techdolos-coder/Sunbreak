// Design-Tokens — 1:1 aus dem Handoff "Sonnenfenster — Richtung 1c Signalblock".
// Genau EINE Signalfarbe (Sonnenlicht-Bernstein). Der Zustand wird ueber
// Saettigung kommuniziert, nicht ueber eine zweite Farbe. Kein Rot/Gruen.

export type Condition = "sicher" | "wackelig";

export const palette = {
  sicher: {
    hero: "#E8A23A", // Sun / Hero
    footer: "#D98F27", // Sun deep / Footer
    inkMax: "#20180A", // Uhrzeit (Held)
    inkStrong: "#3A2A08", // Kicker / Ort
    inkFooter: "#2A1E08", // Fusszeile Unterzeile
    domain: "#7a5410", // Domain
  },
  wackelig: {
    hero: "#C7BEAC", // Desat hero
    footer: "#B4AB98", // Desat footer
    inkMax: "#35301F", // Desat ink (Uhrzeit)
    inkStrong: "#4a4230", // Desat ink 2 (Kicker / Ort)
    inkFooter: "#332e20",
    domain: "#6b6350",
  },
} as const satisfies Record<Condition, Record<string, string>>;

// App-Hintergrund (warm, kein Kaltweiss) und Chat-Referenztoene.
export const canvas = {
  paper: "#DED6C6",
  chatBg: "#E7E0D4",
  chatOutBubble: "#D7F4C0",
} as const;

export const radius = {
  card: 11,
  bubble: 14,
} as const;

// Domain-Label auf der Karte. Zeigt vorerst die Live-Deploy-Adresse; bei eigener
// Domain hier zentral ändern (früherer Platzhalter: SONNENFENSTER.HAMBURG).
export const DOMAIN_LABEL = "SUNB.NETLIFY.APP";

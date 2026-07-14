// Design-Tokens — 1:1 aus dem Handoff (identisch zur Web-Ebene). EINE Signalfarbe
// (Sonnenlicht-Bernstein); Zustand über Sättigung, nicht über eine zweite Farbe.

export type Condition = "sicher" | "wackelig";

export const palette = {
  sicher: {
    hero: "#E8A23A",
    footer: "#D98F27",
    inkMax: "#20180A",
    inkStrong: "#3A2A08",
    inkFooter: "#2A1E08",
    domain: "#7a5410",
  },
  wackelig: {
    hero: "#C7BEAC",
    footer: "#B4AB98",
    inkMax: "#35301F",
    inkStrong: "#4a4230",
    inkFooter: "#332e20",
    domain: "#6b6350",
  },
} as const satisfies Record<Condition, Record<string, string>>;

export const canvas = {
  paper: "#DED6C6",
  chatBg: "#E7E0D4",
} as const;

export const radius = { card: 11 } as const;

export const DOMAIN_LABEL = "SUNB.NETLIFY.APP";

// Basis-URL der Web-Landingpage (Artefakt B). Der geteilte Link zeigt hierauf;
// der Empfänger installiert nichts. Bei eigener Domain hier zentral ändern.
export const WEB_BASE_URL = "https://sunb.netlify.app";

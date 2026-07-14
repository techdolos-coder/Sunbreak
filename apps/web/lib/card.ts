import type { Condition } from "./tokens";

// Datenmodell der Vorschaukarte. sonneBisZeit ist IMMER eine absolute Uhrzeit
// als String ("15:47") — NIEMALS eine relative Zeit/Countdown, weil die Karte
// von WhatsApp als statisches og:image gecacht wird.
export interface CardData {
  condition: Condition;
  ort: string; // "Hammer Park"
  bereich: string; // "Nordwiese"
  sonneBisZeit: string; // "15:47" (absolut)
  wackeligGrund?: string; // nur bei wackelig, z. B. "Wolkenfeld zieht von Westen"
}

const DEFAULTS: CardData = {
  condition: "sicher",
  ort: "Hammer Park",
  bereich: "Nordwiese",
  sonneBisZeit: "15:47",
  wackeligGrund: "Wolkenfeld zieht von Westen",
};

// Normalisiert "1547" | "15:47" | "1547" -> "15:47". Reine String-Arbeit,
// keine Zeitzonen-Logik: der Aufrufer liefert bereits die absolute Uhrzeit.
export function normalizeBis(raw: string | null | undefined): string {
  if (!raw) return DEFAULTS.sonneBisZeit;
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  if (digits.length === 3) return `${digits.slice(0, 1)}:${digits.slice(1)}`;
  return raw.trim();
}

// Baut das Kartenmodell aus URL-Query-Parametern. Bewusst tolerant, damit die
// og:image-URL stabil cachebar bleibt (Ort + absolute Zeit + Zustand).
export function cardFromParams(sp: URLSearchParams): CardData {
  const s = sp.get("s");
  const condition: Condition = s === "wackelig" ? "wackelig" : "sicher";
  return {
    condition,
    ort: sp.get("ort")?.trim() || DEFAULTS.ort,
    bereich: sp.get("bereich")?.trim() || DEFAULTS.bereich,
    sonneBisZeit: normalizeBis(sp.get("bis")),
    wackeligGrund:
      condition === "wackelig"
        ? sp.get("grund")?.trim() || DEFAULTS.wackeligGrund
        : undefined,
  };
}

// --- Sichtbare Texte auf der Karte (woertlich aus dem Handoff) ---

export function kicker(c: CardData): string {
  return c.condition === "sicher" ? "☀ SONNE BIS" : "⛅ WACKELIG";
}

export function ortZeile(c: CardData): string {
  return c.bereich ? `${c.ort} · ${c.bereich}` : c.ort;
}

export function footerSubline(c: CardData): string {
  if (c.condition === "sicher") return "Jetzt öffnen für aktuellen Stand";
  const grund = c.wackeligGrund ?? "Wolkenfeld zieht von Westen";
  return `${grund} · Jetzt öffnen`;
}

// --- Meta-Texte (og:*) und Teilen-Text fuer den Messenger ---

export function ogTitle(c: CardData): string {
  const emoji = c.condition === "sicher" ? "☀" : "⛅";
  return `${emoji} Sonne bis ${c.sonneBisZeit} — ${c.ort}`;
}

// Bewusst unverbindlich: die Vorschau kann veraltet sein, die Landingpage
// ist die Wahrheit. In beiden Zustaenden identisch.
export function ogDescription(_c: CardData): string {
  return "Jetzt öffnen für aktuellen Stand";
}

// Nachrichtentext, den der Absender in den Chat schreibt.
export function shareText(c: CardData): string {
  const base = `Sonne im ${c.ort} bis ${c.sonneBisZeit}. Kommst du?`;
  if (c.condition === "wackelig") {
    const grund = c.wackeligGrund ?? "Wolkenfeld zieht von Westen";
    return `${base}\n⛅ wackelig — ${grund}`;
  }
  return base;
}

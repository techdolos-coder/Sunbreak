import type { Condition } from "../theme";

// Kartendatenmodell (identisch zur Web-Ebene). sonneBisZeit ist IMMER eine
// absolute Uhrzeit als String — nie relativ/Countdown.
export interface CardData {
  condition: Condition;
  ort: string;
  bereich: string;
  sonneBisZeit: string;
  wackeligGrund?: string;
}

// App-intern OHNE Emoji (eigene Glyphen liefert die UI). Die Emoji ☀/⛅ setzen
// wir nur im geteilten Text (Messenger).
export function kicker(c: CardData): string {
  return c.condition === "sicher" ? "SONNE BIS" : "WACKELIG";
}

export function ortZeile(c: CardData): string {
  return c.bereich ? `${c.ort} · ${c.bereich}` : c.ort;
}

export function footerSubline(c: CardData): string {
  if (c.condition === "sicher") return "Jetzt öffnen für aktuellen Stand";
  const grund = c.wackeligGrund ?? "Wolkenfeld zieht von Westen";
  return `${grund} · Jetzt öffnen`;
}

// Nachrichtentext für den Messenger — HIER fahren die Emoji mit.
export function shareText(c: CardData): string {
  const base = `Sonne im ${c.ort} bis ${c.sonneBisZeit}. Kommst du?`;
  if (c.condition === "wackelig") {
    const grund = c.wackeligGrund ?? "Wolkenfeld zieht von Westen";
    return `${base}\n⛅ wackelig — ${grund}`;
  }
  return base;
}

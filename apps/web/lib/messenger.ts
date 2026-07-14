// Der Ja-Klick öffnet den Messenger mit vorgefüllter Antwort — kein Login, keine
// Installation. Der Empfänger antwortet in dem Chat, aus dem er ohnehin kam.

// Vorgefüllte Zusage laut Handoff (das ☀ fährt als natives Emoji mit).
export const JA_TEXT = "Ja — bin in 10 Min da ☀";

// Web Share API (öffnet die native Auswahl → der Nutzer wählt den Chat) mit
// wa.me als Fallback. Gibt true zurück, wenn ein Kanal geöffnet wurde.
export async function sendReply(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // Abbruch durch den Nutzer o. Ä. — auf Fallback ausweichen.
    }
  }
  if (typeof window !== "undefined") {
    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    return true;
  }
  return false;
}

// Teilen einer Einladung: Nachrichtentext + Link zur Landingpage (/e). WhatsApp
// & Co. bauen daraus die Vorschaukarte. Kern-Interaktion des Absenders.
export async function shareInvite(text: string, url: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ text, url });
      return true;
    } catch {
      // Nutzer-Abbruch -> Fallback.
    }
  }
  if (typeof window !== "undefined") {
    window.location.href = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    return true;
  }
  return false;
}

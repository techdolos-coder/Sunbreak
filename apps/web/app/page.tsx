import { canvas } from "@/lib/tokens";

// Dev-Uebersicht: beide Zustaende nebeneinander, gerendert ueber die echte
// /og-Route. Entspricht screenshots/01-uebersicht.png (Karte solo, gross).
// Nicht Teil des Produkts — nur zur Abnahme von Artefakt A.

const EXAMPLES = [
  {
    label: "☀ sicher",
    query: "ort=Hammer+Park&bereich=Nordwiese&bis=1547&s=sicher",
  },
  {
    label: "⛅ wackelig",
    query:
      "ort=Elbwiese&bereich=Övelgönne&bis=1710&s=wackelig&grund=Wolkenfeld+von+Westen",
  },
];

export default function DevIndex() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: canvas.paper,
        padding: 40,
        fontFamily: "system-ui, sans-serif",
        color: "#3A2A08",
      }}
    >
      <h1 style={{ fontSize: 20, letterSpacing: 1 }}>
        Sunbreak · Artefakt A — Vorschaukarte (og:image)
      </h1>
      <p style={{ opacity: 0.7, maxWidth: 640 }}>
        Beide Zustände, gerendert über die produktive <code>/og</code>-Route.
        Format 1200×630. Klick öffnet die Einladungsseite (<code>/e</code>) mit den
        Meta-Tags.
      </p>
      <p style={{ margin: "8px 0 0" }}>
        <a href="/app" style={{ color: "#7a5410", fontWeight: 700 }}>
          → Artefakt C: App-Screen (drei Vorschläge)
        </a>
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 14 }}>
        Zustände:{" "}
        <a href="/app?state=heute-nicht" style={{ color: "#7a5410" }}>
          Heute nicht
        </a>{" "}
        ·{" "}
        <a href="/app?state=kein-standort" style={{ color: "#7a5410" }}>
          Kein Standort
        </a>{" "}
        ·{" "}
        <a href="/app?state=nacht" style={{ color: "#7a5410" }}>
          Nacht
        </a>
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 24 }}>
        {EXAMPLES.map((ex) => (
          <figure key={ex.query} style={{ margin: 0, width: 480 }}>
            <a href={`/e?${ex.query}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/og?${ex.query}`}
                alt={ex.label}
                width={480}
                height={252}
                style={{ borderRadius: 11, display: "block", width: "100%", height: "auto" }}
              />
            </a>
            <figcaption style={{ marginTop: 8, fontSize: 14 }}>
              {ex.label} — <code>/og?{ex.query}</code>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}

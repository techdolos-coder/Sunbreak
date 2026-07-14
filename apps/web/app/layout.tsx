import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Sans } from "next/font/google";

// Typografie laut Handoff: Archivo (Held/Karten-Text), IBM Plex Sans (UI/Fließtext).
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
});
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "Sunbreak",
  description: "Wo scheint jetzt die Sonne — nah genug zum Losgehen.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${archivo.variable} ${plex.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-plex), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

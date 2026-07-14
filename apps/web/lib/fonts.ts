import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Archivo-Gewichte fuer Satori/ImageResponse. Wir liefern statische TTFs mit,
// weil Satori kein woff2 kann und der Kartentext exakt 700/800/900 braucht
// (Uhrzeit ist immer 900). Gelesen vom Dateisystem zur Laufzeit (Node-Runtime).
const FONT_DIR = join(process.cwd(), "assets", "fonts");

export async function loadArchivo() {
  const [w700, w800, w900] = await Promise.all([
    readFile(join(FONT_DIR, "Archivo-700.ttf")),
    readFile(join(FONT_DIR, "Archivo-800.ttf")),
    readFile(join(FONT_DIR, "Archivo-900.ttf")),
  ]);
  return [
    { name: "Archivo", data: w700, weight: 700 as const, style: "normal" as const },
    { name: "Archivo", data: w800, weight: 800 as const, style: "normal" as const },
    { name: "Archivo", data: w900, weight: 900 as const, style: "normal" as const },
  ];
}

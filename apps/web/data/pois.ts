import type { POI } from "../lib/engine/types";
import { OPEN_HORIZON } from "../lib/engine/horizon";
import hammerpark from "./horizons/hammerpark.json";

// Kuratierte Hamburg-POIs. Die Kuratierung (ruhig, aber einsehbar — „ein Platz
// ist frei", kein menschenleeres Gebüsch) ist laut Brief der teuerste, nicht
// automatisierbare Posten; hier eine kleine, handgesetzte Startmenge.
//
// horizon = statisches Sichtbarkeitsprofil aus dem Schatten-Precompute
// (services/shadow-precompute). Wo noch kein echtes bDOM-Profil vorliegt, steht
// OPEN_HORIZON (freies Feld). Hammer Park nutzt bereits ein generiertes Profil.
export const HAMBURG_POIS: POI[] = [
  {
    id: "hammerpark",
    ort: "Hammer Park",
    bereich: "Nordwiese",
    lat: 53.5556,
    lng: 10.0539,
    horizon: hammerpark as number[],
  },
  {
    id: "stadtpark",
    ort: "Stadtpark",
    bereich: "Südwiese",
    lat: 53.5978,
    lng: 10.0182,
    horizon: OPEN_HORIZON,
  },
  {
    id: "elbwiese",
    ort: "Elbwiese",
    bereich: "Övelgönne",
    lat: 53.5443,
    lng: 9.8887,
    horizon: OPEN_HORIZON,
  },
  {
    id: "planten",
    ort: "Planten un Blomen",
    bereich: "Große Wallanlagen",
    lat: 53.5601,
    lng: 9.9825,
    horizon: OPEN_HORIZON,
  },
  {
    id: "schwanenwik",
    ort: "Alster",
    bereich: "Schwanenwik",
    lat: 53.5665,
    lng: 10.0175,
    horizon: OPEN_HORIZON,
  },
  {
    id: "jenischpark",
    ort: "Jenischpark",
    bereich: "Elbhang",
    lat: 53.5599,
    lng: 9.8447,
    horizon: OPEN_HORIZON,
  },
];

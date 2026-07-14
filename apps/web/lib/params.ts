// Next liefert searchParams als aufgeloestes Objekt; wir vereinheitlichen es zu
// URLSearchParams, damit cardFromParams eine Quelle hat.
export type SearchParams = Record<string, string | string[] | undefined>;

export function toSearchParams(sp: SearchParams): URLSearchParams {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    out.set(k, Array.isArray(v) ? (v[0] ?? "") : v);
  }
  return out;
}

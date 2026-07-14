import type { Metadata } from "next";
import { headers } from "next/headers";
import { cardFromParams, ogTitle, ogDescription } from "@/lib/card";
import { coordsFromParams, gehzeitFromParams } from "@/lib/geo";
import { toSearchParams, type SearchParams } from "@/lib/params";
import LandingClient from "./LandingClient";

// /e = die geteilte Einladung. Diese Route traegt die Meta-Tags, die WhatsApp &
// Co. crawlen, um die Rich-Link-Vorschau (Artefakt A) zu rendern. Der eigentliche
// Inhalt (Empfaenger-Landingpage) ist Artefakt B und folgt spaeter.

async function originFromHeaders(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = toSearchParams(await searchParams);
  const card = cardFromParams(sp);
  const origin = await originFromHeaders();

  // og:image kodiert Ort + absolute Endzeit + Zustand -> stabil cachebar.
  const ogImage = `${origin}/og?${sp.toString()}`;
  const pageUrl = `${origin}/e?${sp.toString()}`;

  return {
    metadataBase: new URL(origin),
    title: ogTitle(card),
    description: ogDescription(card),
    openGraph: {
      title: ogTitle(card),
      description: ogDescription(card),
      url: pageUrl,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle(card),
      description: ogDescription(card),
      images: [ogImage],
    },
  };
}

export default async function EinladungPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = toSearchParams(await searchParams);
  return (
    <LandingClient
      card={cardFromParams(sp)}
      coords={coordsFromParams(sp)}
      gehzeit={gehzeitFromParams(sp)}
    />
  );
}

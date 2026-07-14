import type { SVGProps } from "react";

// App-interne Glyphen: monochrom in currentColor (Sonnenlicht-Bernstein-Ink),
// KEINE bunten System-Emoji in der UI (Handoff, Entscheidung #4). Die Emoji
// ☀/⛅ bleiben ausschließlich im geteilten Text & og:title (Messenger).

export function SunGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      <g>
        <line x1="12" y1="2" x2="12" y2="4.5" />
        <line x1="12" y1="19.5" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4.5" y2="12" />
        <line x1="19.5" y1="12" x2="22" y2="12" />
        <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
        <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
        <line x1="19.1" y1="4.9" x2="17.4" y2="6.6" />
        <line x1="6.6" y1="17.4" x2="4.9" y2="19.1" />
      </g>
    </svg>
  );
}

export function CloudSunGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* kleine Sonne oben links */}
      <circle cx="8" cy="7.5" r="3" fill="currentColor" stroke="none" />
      <line x1="8" y1="1.5" x2="8" y2="3" />
      <line x1="2" y1="7.5" x2="3.3" y2="7.5" />
      <line x1="3.8" y1="3.3" x2="4.8" y2="4.3" />
      {/* Wolke davor */}
      <path
        d="M8.5 19h8a3.2 3.2 0 0 0 .3-6.38A4.3 4.3 0 0 0 8.4 13 3 3 0 0 0 8.5 19z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function MoonGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function PinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShareGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <line x1="8.3" y1="10.8" x2="15.7" y2="6.2" />
      <line x1="8.3" y1="13.2" x2="15.7" y2="17.8" />
    </svg>
  );
}

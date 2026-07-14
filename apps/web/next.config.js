/** @type {import('next').NextConfig} */
const nextConfig = {
  // Die /og-Route liest Archivo-TTFs via process.cwd() vom Dateisystem. Dieser
  // dynamische Pfad wird vom File-Tracing nicht automatisch erkannt, daher die
  // Font-Dateien für die /og-Function explizit einbündeln (sonst ENOENT in der
  // Serverless-Function bei Netlify/Vercel).
  outputFileTracingIncludes: {
    "/og": ["./assets/fonts/**"],
  },
};

module.exports = nextConfig;

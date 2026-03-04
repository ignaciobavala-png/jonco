import type { Metadata } from "next";
import "./globals.css";
import { RootShell } from "@/components/shared/RootShell";

export const metadata: Metadata = {
  title: "Jonco | Expediciones en Argentina — Pesca, Kayak y Naturaleza",
  description:
    "Expediciones personalizadas en Argentina: pesca con mosca, kayak, avistamiento de fauna y naturaleza en el Delta del Paraná. Viví la aventura con Jon.",
  keywords: [
    "expediciones argentina",
    "pesca con mosca argentina",
    "kayak delta paraná",
    "turismo naturaleza argentina",
    "aventura delta",
    "jonco expediciones",
    "pesca parana",
    "ecoturismo argentina",
  ],
  authors: [{ name: "Jonco Expediciones" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://jonco.pro",
  },
  openGraph: {
    type: "website",
    url: "https://jonco.pro",
    title: "Jonco | Expediciones en Argentina — Pesca, Kayak y Naturaleza",
    description:
      "Expediciones personalizadas en Argentina: pesca con mosca, kayak, avistamiento de fauna y naturaleza en el Delta del Paraná.",
    locale: "es_AR",
    siteName: "Jonco Expediciones",
    images: [
      {
        url: "https://jonco.pro/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jonco Expediciones — Pesca, Kayak y Naturaleza en Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonco | Expediciones en Argentina — Pesca, Kayak y Naturaleza",
    description:
      "Expediciones personalizadas en Argentina: pesca con mosca, kayak y naturaleza en el Delta del Paraná.",
    images: ["https://jonco.pro/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/branding/jonco-logo.svg", type: "image/svg+xml" }],
    shortcut: "/branding/jonco-logo.svg",
    apple: "/branding/jonco-logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-zinc-950 text-white flex flex-col min-h-screen">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
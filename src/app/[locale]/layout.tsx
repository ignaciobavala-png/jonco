import type { Metadata } from "next";
import "../globals.css";
import { RootShell } from "@/components/shared/RootShell";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediately scroll to top on page load
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  window.scrollTo(0, 0);
                  history.scrollRestoration = 'manual';
                });
                // Prevent scroll restoration on browser back/forward
                history.scrollRestoration = 'manual';
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-zinc-900 text-white flex flex-col min-h-screen">
        <ScrollToTop />
        <NextIntlClientProvider messages={messages}>
          <RootShell>{children}</RootShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { RootShell } from "@/components/shared/RootShell";

export const metadata: Metadata = {
  title: "Jonco | Aventuras en el Delta",
  description: "Experiencias exclusivas y aventura personalizada con Jon en el Delta del Paraná.",
  icons: {
    icon: [
      { url: "/branding/jonco-logo.svg", type: "image/svg+xml" },
    ],
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
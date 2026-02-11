import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Jonco | Aventuras en el Delta",
  description: "Experiencias exclusivas y aventura personalizada con Jon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-zinc-950 text-white flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow" style={{ paddingTop: "var(--jonco-navbar-h)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
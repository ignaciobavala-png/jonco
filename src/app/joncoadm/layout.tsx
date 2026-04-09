import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Jonco ADM",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-zinc-900 text-white flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}

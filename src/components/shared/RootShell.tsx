"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const RootShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/joncoadm");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main
        className="flex-grow"
        style={{ paddingTop: isAdmin ? "0" : "var(--jonco-navbar-h)" }}
      >
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

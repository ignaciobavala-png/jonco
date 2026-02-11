"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? "bg-black/95 backdrop-blur-md py-4" : "bg-transparent py-8"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO: Ahora hace scroll al inicio */}
        <button onClick={scrollToTop} className="text-2xl font-black tracking-tighter text-white group">
          JONCO<span className="text-gold group-hover:animate-pulse">.</span>
        </button>

        <div className="flex items-center gap-10">
          <button 
            onClick={scrollToTop}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold transition-all"
          >
            Inicio
          </button>
          
          <a 
            href="https://wa.me/5491140765354" 
            target="_blank"
            className="hidden md:block bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all"
          >
            Contacto Directo
          </a>
        </div>
      </div>
    </nav>
  );
};
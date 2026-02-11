"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    window.dispatchEvent(new Event("jonco:closeExperienceModal"));
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.dispatchEvent(new Event("jonco:closeExperienceModal"));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-[200] transition-all duration-500 ${
        scrolled ? "bg-black/95 backdrop-blur-md py-3 md:py-4" : "bg-transparent py-6 md:py-8"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* LOGO */}
          <button 
            onClick={scrollToTop} 
            className="text-xl sm:text-2xl font-black tracking-tighter text-white group active:scale-95 transition-transform"
          >
            JONCO<span className="text-gold group-hover:animate-pulse">.</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <button 
              onClick={scrollToTop}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold transition-all active:scale-95"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('historia')}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold transition-all active:scale-95"
            >
              Nuestra Historia
            </button>
            <button 
              onClick={() => scrollToSection('experiencias')}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold transition-all active:scale-95"
            >
              Expediciones
            </button>
            
            <a 
              href="https://wa.me/5491140765354" 
              target="_blank"
              className="bg-white text-black px-4 lg:px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all active:scale-95"
            >
              Contacto Directo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-white active:scale-90 transition-transform"
          >
            <span className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed inset-0 z-[190] md:hidden bg-black/95 backdrop-blur-lg"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <button 
              onClick={scrollToTop}
              className="text-2xl font-black tracking-tighter text-white active:scale-95 transition-transform"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('historia')}
              className="text-xl font-bold text-white/80 hover:text-gold transition-colors active:scale-95"
            >
              Nuestra Historia
            </button>
            <button 
              onClick={() => scrollToSection('experiencias')}
              className="text-xl font-bold text-white/80 hover:text-gold transition-colors active:scale-95"
            >
              Expediciones
            </button>
            <a 
              href="https://wa.me/5491140765354" 
              target="_blank"
              className="bg-gold text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white transition-all active:scale-95"
            >
              Contacto Directo
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
};
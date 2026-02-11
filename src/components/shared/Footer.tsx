"use client";
import { motion } from "framer-motion";
import { JON_CONTACT } from "@/lib/constants";

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-zinc-950 border-t border-white/5 pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 mt-16 sm:mt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-gold font-mono text-[8px] tracking-[0.8em] uppercase rotate-90 hidden lg:block">
          Delta del Paraná // {JON_CONTACT.coordinates}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Branding Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                JONCO<span className="text-gold">.</span>
              </h3>
              <div className="w-12 h-0.5 bg-gold/50" />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
              Curadores de expediciones exclusivas en el Delta del Paraná. Naturaleza indómita y confort absoluto.
            </p>
            <div className="space-y-1 text-zinc-500 text-xs font-mono">
              <p>{JON_CONTACT.location}</p>
              <p>{JON_CONTACT.coordinates}</p>
            </div>
          </motion.div>
          
          {/* Navigation Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-black">Navegación</span>
              <div className="w-8 h-0.5 bg-gold/30" />
            </div>
            <nav className="flex flex-col gap-3">
              <button 
                onClick={scrollToTop}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left active:scale-95"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('historia')}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left active:scale-95"
              >
                Nuestra Historia
              </button>
              <button 
                onClick={() => scrollToSection('experiencias')}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left active:scale-95"
              >
                Expediciones
              </button>
            </nav>
          </motion.div>

          {/* Contact Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-black">Contacto Directo</span>
              <div className="w-8 h-0.5 bg-gold/30" />
            </div>
            <div className="space-y-3">
              <a 
                href={`mailto:${JON_CONTACT.email}`}
                className="text-zinc-400 hover:text-gold transition-colors text-sm font-medium block active:scale-95"
              >
                {JON_CONTACT.email}
              </a>
              <a 
                href={JON_CONTACT.getWhatsAppLink("Hola Jon! Quiero consultar por una expedición.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all active:scale-95"
              >
                WhatsApp Directo
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-white/5"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-medium">
                © {new Date().getFullYear()} Jonco Experience - Expediciones Curadas
              </p>
              <p className="text-zinc-700 text-[8px] uppercase tracking-[0.1em] font-medium mt-1">
                Operando en el Delta del Paraná desde 2024
              </p>
            </div>
            
            <div className="flex gap-6 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
              <a 
                href={`https://instagram.com/${JON_CONTACT.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors active:scale-95"
              >
                Instagram
              </a>
              <a 
                href={JON_CONTACT.getWhatsAppLink("Hola Jon! Quiero información.")} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors active:scale-95"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Signature */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="font-signature text-2xl text-gold/30">
            Capitán Jonco
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
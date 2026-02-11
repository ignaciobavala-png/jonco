"use client";
import { motion } from "framer-motion";
import { JON_CONTACT } from "@/lib/constants";

export const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end justify-start">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover brightness-[0.6]"
          poster="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"
        >
          <source src="https://v.ftcdn.net/05/52/15/28/700_F_552152862_9YI8Mv3m3r3uYy4rN9w6PqE5l6Mv6f0P_ST.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-24 pb-16 sm:pb-20 md:pb-0 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-4 sm:space-y-6"
        >
          <span className="text-gold-light uppercase text-[8px] sm:text-[10px] tracking-[0.5em] font-bold block opacity-90 drop-shadow-gold">
            Jonco Turismo
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter text-white leading-tight uppercase">
            Navegá la <br className="hidden sm:block" />
            <span className="font-black text-gold-bright drop-shadow-lg">Exclusividad</span>
          </h1>

          <p className="text-zinc-200 text-sm sm:text-base md:text-lg max-w-md font-light leading-relaxed border-l border-gold/50 pl-4 sm:pl-6 drop-shadow-md">
            Experiencias privadas diseñadas para quienes buscan descubrir el Delta desde una perspectiva única y sofisticada.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button 
              onClick={() => scrollToSection('experiencias')}
              className="bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gold-light transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-gold/25"
            >
              Expediciones
            </button>
            
            <button 
              onClick={() => scrollToSection('historia')}
              className="border border-white/40 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:border-gold-light hover:text-gold-light transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-gold/20"
            >
              Nuestra Historia
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
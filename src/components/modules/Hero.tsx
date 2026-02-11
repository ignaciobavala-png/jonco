"use client";
import { motion } from "framer-motion";
import { JON_CONTACT } from "@/lib/constants";
import Link from "next/link"; // Importante para el routing

export const Hero = () => {
  // Función para manejar el scroll suave hacia los packs
  const scrollToPacks = () => {
    const section = document.getElementById('experiencias');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end md:items-center justify-start">
      {/* Background Layer: Video e Imagen de Respaldo */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover brightness-[0.6]" // Añadimos brillo reducido para contraste
          poster="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"
        >
          <source src="https://v.ftcdn.net/05/52/15/28/700_F_552152862_9YI8Mv3m3r3uYy4rN9w6PqE5l6Mv6f0P_ST.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradiente para proteger la lectura del texto a la izquierda */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 px-10 md:px-24 pb-20 md:pb-0 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-gold uppercase text-[10px] tracking-[0.5em] font-bold mb-4 block">
            Jonco Turismo
          </span>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white mb-6 leading-tight uppercase">
            Navegá la <br />
            <span className="font-black text-gold">Exclusividad</span>
          </h1>

          <p className="text-zinc-300 text-sm md:text-base max-w-md mb-10 font-light leading-relaxed border-l border-gold/30 pl-6">
            Experiencias privadas diseñadas para quienes buscan descubrir el Delta desde una perspectiva única y sofisticada.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* BOTÓN 1: Scroll interno a los packs */}
            <button 
              onClick={scrollToPacks}
              className="bg-white text-black px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-gold transition-all active:scale-95"
            >
              Packs de Aventuras
            </button>
            
        
          </div>
        </motion.div>
      </div>
    </section>
  );
};
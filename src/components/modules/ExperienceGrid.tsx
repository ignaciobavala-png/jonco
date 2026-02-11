"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXPERIENCIAS } from "@/lib/constants";

export const ExperienceGrid = () => {
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPack) {
      document.body.style.overflow = "hidden";
      setActiveImg(selectedPack.image);
    } else {
      document.body.style.overflow = "unset";
      setActiveImg(null);
    }
  }, [selectedPack]);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="experiencias">
      {/* GRID DE CARDS PRINCIPAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {EXPERIENCIAS.map((tour) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
            onClick={() => setSelectedPack(tour)}
          >
            <img 
              src={tour.image} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
              alt={tour.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            
            <div className="absolute top-6 right-6">
              <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/10 font-bold uppercase tracking-widest">
                U$D 120
              </span>
            </div>

            <div className="absolute bottom-0 p-10 w-full">
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">
                {tour.category}
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6 italic group-hover:not-italic transition-all text-white">
                {tour.title}
              </h3>
              <p className="text-white border-b border-gold/50 inline-block pb-1 text-[10px] uppercase tracking-widest font-bold group-hover:text-gold transition-colors">
                Ver Detalles
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPack && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 md:p-6 lg:p-10"
          >
            {/* FONDO INMERSIVO */}
            <div className="absolute inset-0 z-0">
              {activeImg && (
                <motion.img 
                  key={`bg-${activeImg}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  src={activeImg} 
                  className="w-full h-full object-cover blur-3xl scale-110" 
                />
              )}
              <div className="absolute inset-0 bg-black/80" />
            </div>

            {/* BOTÓN CERRAR SUPERIOR (FLOTANTE) */}
            <button 
              onClick={() => setSelectedPack(null)}
              className="absolute top-6 right-6 z-[120] flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative z-10 w-full h-full lg:max-w-7xl lg:h-[85vh] bg-[#0a0a0a] lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border-white/10 border"
            >
              {/* IZQUIERDA: GALERÍA */}
              <div className="relative w-full lg:w-[55%] h-[40vh] sm:h-[50vh] lg:h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeImg && (
                    <motion.img 
                      key={activeImg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={activeImg} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </AnimatePresence>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 max-w-[90%] overflow-x-auto no-scrollbar">
                  {selectedPack.gallery?.map((img: string, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImg(img)}
                      className={`relative w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        activeImg === img ? 'ring-2 ring-gold scale-105' : 'opacity-40'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              </div>

              {/* DERECHA: INFO COMERCIAL */}
              <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-start lg:justify-center overflow-y-auto bg-[#0a0a0a] scrollbar-hide">
                <div className="max-w-md mx-auto lg:mx-0">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="bg-gold text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      {selectedPack.category}
                    </span>
                    <span className="text-white text-xl font-light tracking-tighter">
                      Desde <span className="font-black text-gold">U$D 120</span> / pax
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none italic">
                    {selectedPack.title}
                  </h2>
                  
                  <p className="text-zinc-500 text-lg font-light leading-relaxed mb-10 italic border-l border-gold/30 pl-6">
                    {selectedPack.description}
                  </p>

                  {/* CUADRO DE SALIDAS */}
                  <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 mb-10">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                      <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Próximas Salidas</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Confirmadas</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs uppercase font-bold tracking-widest text-white/40">
                        <span>Lunes a Domingo</span>
                        <span className="text-gold">10:00 AM // 17:00 PM</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        * Los itinerarios pueden ajustarse según condiciones del río para garantizar la mejor experiencia.
                      </p>
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex flex-col gap-4">
                    <a 
                      href={`https://wa.me/5491140765354?text=Hola! Me interesa el pack: ${selectedPack.title}.`}
                      target="_blank"
                      className="w-full bg-white text-black text-center py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all active:scale-95"
                    >
                      Reservar Expedición
                    </a>
                    
                    {/* SEGUNDO BOTÓN DE SALIDA (UX) */}
                    <button 
                      onClick={() => setSelectedPack(null)}
                      className="w-full text-zinc-500 text-center py-2 text-[10px] uppercase tracking-[0.3em] font-black hover:text-white transition-colors"
                    >
                      [ Volver a la Galería ]
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
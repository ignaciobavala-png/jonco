"use client";
import { Hero } from "@/components/modules/Hero";
import { ExperienceGrid } from "@/components/modules/ExperienceGrid";
import { ClientFeedback } from "@/components/modules/ClientFeedback";
import { CustomExperience } from "@/components/modules/CustomExperience";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative bg-zinc-950 min-h-screen overflow-x-hidden">
      <main>
        <Hero />
        
        {/* SECCIÓN HISTORIA */}
        <section id="historia" className="relative scroll-mt-32 py-20 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 bg-zinc-950">
          {/* Coordenadas en el fondo */}
          <div className="absolute top-10 left-10 text-white/[0.03] font-mono text-[8px] sm:text-[10px] tracking-[0.8em] uppercase vertical-text hidden md:block">
            Exploración Continua // Delta Argentino
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 xl:gap-24 items-center">
              
              {/* MULTIMEDIA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative rounded-sm overflow-hidden group shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070" 
                    alt="Navegación Jonco" 
                    className="w-full aspect-[3/4] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 border-[12px] sm:border-[20px] border-black/10 pointer-events-none" />
                </div>
              </motion.div>

              {/* TEXTO */}
              <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <span className="text-gold-light text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] block opacity-70">
                    — Identidad y Origen
                  </span>

                  {/* TIPOGRAFÍA MANUSCRITA */}
                  <div className="space-y-4">
                    <h2 className="font-signature text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] drop-shadow-lg">
                      "No heredé una empresa, heredé el pulso de este río. Mi firma es el compromiso de mostrarte su alma."
                    </h2>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6 text-zinc-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
                    <p>
                      Soy el Capitán de **Jonco**. Mi historia no se escribe en oficinas, se escribe en el barro de los arroyos y en el reflejo del sol sobre el agua mansa. Aprendí a navegar antes que a caminar, siguiendo el rastro de quienes estuvieron antes que yo.
                    </p>
                    
                    <p>
                      Para mí, cada expedición es un documento de identidad. No busco clientes, busco compañeros de viaje que sepan apreciar la elegancia de lo salvaje y el valor de un horizonte sin edificios.
                    </p>

                    {/* Firma */}
                    <div className="pt-6 sm:pt-8 flex items-end gap-4 sm:gap-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-white text-[8px] sm:text-[10px] uppercase tracking-widest font-black mb-2 opacity-30 italic">Autenticado por</span>
                        <span className="font-signature text-3xl sm:text-4xl lg:text-5xl text-gold-light pb-2 drop-shadow-md">
                          Capitán Jonco
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* SECCIÓN EXPERIENCIAS */}
        <section id="experiencias" className="relative z-10 bg-zinc-950 scroll-mt-32">
          <ExperienceGrid />
          <section id="feedback" className="scroll-mt-32">
            <ClientFeedback />
          </section>
          <CustomExperience />
        </section>
      </main>
    </div>
  );
}
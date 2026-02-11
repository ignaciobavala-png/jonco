"use client";
import { Hero } from "@/components/modules/Hero";
import { ExperienceGrid } from "@/components/modules/ExperienceGrid";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen overflow-x-hidden">
      <Hero />
      
      {/* SECCIÓN QUIÉNES SOMOS: EL MANIFIESTO DEL CAPITÁN */}
      <section id="historia" className="relative py-32 md:py-48 px-6 bg-[#050505]">
        
        {/* Coordenadas en el fondo */}
        <div className="absolute top-10 left-10 text-white/[0.03] font-mono text-[10px] tracking-[0.8em] uppercase vertical-text hidden md:block">
          Exploración Continua // Delta Argentino
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* MULTIMEDIA: El lente del explorador */}
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
                  className="w-full aspect-[3/4] object-cover grayscale brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none" />
              </div>
            </motion.div>

            {/* TEXTO: Relato en Primera Persona */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-10 block opacity-40">
                  — Identidad y Origen
                </span>

                {/* TIPOGRAFÍA MANUSCRITA FIRME (Clase font-signature definida en globals.css) */}
                <div className="mb-12">
                  <h2 className="font-signature text-5xl md:text-7xl text-white leading-[1.1] drop-shadow-md">
                    "No heredé una empresa, heredé el pulso de este río. Mi firma es el compromiso de mostrarte su alma."
                  </h2>
                </div>
                
                <div className="space-y-8 text-zinc-400 text-lg font-light leading-relaxed">
                  <p>
                    Soy el Capitán de **Jonco**. Mi historia no se escribe en oficinas, se escribe en el barro de los arroyos y en el reflejo del sol sobre el agua mansa. Aprendí a navegar antes que a caminar, siguiendo el rastro de quienes estuvieron antes que yo.
                  </p>
                  
                  <p>
                    Para mí, cada expedición es un documento de identidad. No busco clientes, busco compañeros de viaje que sepan apreciar la elegancia de lo salvaje y el valor de un horizonte sin edificios.
                  </p>

                  {/* Cierre y Firma Robusta */}
                  <div className="pt-8 flex items-end gap-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-white text-[10px] uppercase tracking-widest font-black mb-2 opacity-30 italic">Autenticado por</span>
                      <span className="font-signature text-5xl text-gold pb-2">
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
      <section id="experiencias" className="relative z-10 bg-black">
        <ExperienceGrid />
      </section>
    </main>
  );
}
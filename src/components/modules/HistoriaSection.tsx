"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DEFAULTS = {
  historia_imagen: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070",
  historia_cita: '"No heredé una empresa, heredé el pulso de este río. Mi firma es el compromiso de mostrarte su alma."',
  historia_parrafo_1:
    "Soy el Capitán de **Jonco**. Mi historia no se escribe en oficinas, se escribe en el barro de los arroyos y en el reflejo del sol sobre el agua mansa. Aprendí a navegar antes que a caminar, siguiendo el rastro de quienes estuvieron antes que yo.",
  historia_parrafo_2:
    "Para mí, cada expedición es un documento de identidad. No busco clientes, busco compañeros de viaje que sepan apreciar la elegancia de lo salvaje y el valor de un horizonte sin edificios.",
  historia_firma: "Capitán Jonco",
};

type HistoriaData = typeof DEFAULTS;

export const HistoriaSection = () => {
  const [data, setData] = useState<HistoriaData>(DEFAULTS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/configuracion", { cache: "no-store" });
        if (!res.ok) return;
        const config = await res.json();
        if (!Array.isArray(config)) return;

        const get = (clave: keyof HistoriaData) =>
          config.find((c: { clave: string; valor: string }) => c.clave === clave)?.valor || DEFAULTS[clave];

        setData({
          historia_imagen: get("historia_imagen"),
          historia_cita: get("historia_cita"),
          historia_parrafo_1: get("historia_parrafo_1"),
          historia_parrafo_2: get("historia_parrafo_2"),
          historia_firma: get("historia_firma"),
        });
      } catch {
        // keep defaults on error
      }
    };

    fetchData();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
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
                src={data.historia_imagen}
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
                  {data.historia_cita}
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6 text-zinc-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
                <p>{data.historia_parrafo_1}</p>
                <p>{data.historia_parrafo_2}</p>

                {/* Firma */}
                <div className="pt-6 sm:pt-8 flex items-end gap-4 sm:gap-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-white text-[8px] sm:text-[10px] uppercase tracking-widest font-black mb-2 opacity-30 italic">
                      Autenticado por
                    </span>
                    <span className="font-signature text-3xl sm:text-4xl lg:text-5xl text-gold-light pb-2 drop-shadow-md">
                      {data.historia_firma}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

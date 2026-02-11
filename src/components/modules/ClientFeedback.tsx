"use client";

import { motion } from "framer-motion";

type Testimonial = {
  name: string;
  location: string;
  text: string;
  experience: string;
  date: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sofía R.",
    location: "CABA",
    experience: "Delta Premium",
    date: "Diciembre 2024",
    text: "Una experiencia impecable. Todo fue elegante, puntual y con una atención al detalle que no se ve seguido. Volvimos con otra mirada del Delta.",
  },
  {
    name: "Martín L.",
    location: "Tigre",
    experience: "Atardecer en Kayak",
    date: "Noviembre 2024",
    text: "Silencio, agua, cielo naranja. La organización fue simple y perfecta. Se nota cuando alguien conoce el río de verdad.",
  },
  {
    name: "Valentina M.",
    location: "San Isidro",
    experience: "Salida Privada",
    date: "Octubre 2024",
    text: "Lo que más valoro: seguridad, discreción y buen gusto. Fue una salida íntima, sin ruido, con momentos que no se compran.",
  },
];

export const ClientFeedback = () => {
  return (
    <section className="relative z-10 bg-black py-20 sm:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-5 max-w-2xl">
            <span className="text-gold text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] block opacity-60">
              — Confianza verificada
            </span>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none italic">
              Feedback de clientes
            </h3>

            <p className="text-zinc-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed border-l border-white/5 pl-6">
              Testimonios reales. Sin promesas vacías: resultados, atmósfera y ejecución.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-900/40 border border-white/5 rounded-full px-4 py-2">
              <span className="text-white/60 text-[10px] uppercase tracking-widest font-black">
                Atención personalizada
              </span>
            </div>
            <div className="bg-zinc-900/40 border border-white/5 rounded-full px-4 py-2">
              <span className="text-white/60 text-[10px] uppercase tracking-widest font-black">
                Seguridad
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={`${t.name}-${t.experience}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="space-y-2">
                  <span className="text-white text-[10px] uppercase tracking-widest font-black opacity-70">
                    {t.name}
                  </span>
                  <span className="text-white/30 text-[10px] uppercase tracking-widest font-black">
                    {t.location}
                  </span>
                </div>

                <span className="text-gold text-[10px] uppercase tracking-widest font-black whitespace-nowrap">
                  {t.experience}
                </span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed font-light italic border-l border-white/5 pl-5">
                “{t.text}”
              </p>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-black">
                  Experiencia realizada
                </span>
                <span className="text-gold/60 text-[10px] uppercase tracking-[0.35em] font-black">
                  {t.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

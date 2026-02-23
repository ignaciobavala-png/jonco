"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  id?: number;
  name: string;
  location: string;
  text: string;
  experience: string;
  date: string;
};

const FALLBACK: Testimonial[] = [
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

const AUTOPLAY_DELAY = 5000;

export const ClientFeedback = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/testimonios", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
      .catch(() => {});
  }, []);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const goTo = (index: number, dir: 1 | -1) => {
    setDirection(dir);
    setCurrent(index);
  };

  const next = () => goTo((current + 1) % testimonials.length, 1);
  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length, -1);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(next, AUTOPLAY_DELAY);
    return () => clearTimeout(timer);
  }, [current, paused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStartX.current = null;
    setPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    setPaused(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStartX.current = null;
    setPaused(false);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const t = testimonials[current] ?? testimonials[0];

  return (
    <section className="relative z-10 bg-black py-20 sm:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 space-y-4">
          <span className="text-gold text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] block opacity-60">
            — Confianza verificada
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none italic">
            Feedback de clientes
          </h3>
        </div>

        <div
          className="relative cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 sm:p-12"
            >
              <span className="text-gold/20 text-8xl font-black leading-none block -mb-4 select-none">
                &ldquo;
              </span>
              <p className="text-zinc-200 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed italic pl-2 mb-10">
                {t.text}
              </p>
              <div className="flex items-end justify-between border-t border-white/5 pt-6">
                <div className="space-y-1">
                  <p className="text-white text-[11px] uppercase tracking-widest font-black">{t.name}</p>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-black">{t.location}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-gold text-[10px] uppercase tracking-widest font-black">{t.experience}</p>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-black">{t.date}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8 px-2">
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <span className="text-white/20 text-[10px] uppercase tracking-widest font-black">
            {current + 1} / {testimonials.length}
          </span>
        </div>

        {!paused && (
          <div className="mt-4 h-px bg-white/5 rounded-full overflow-hidden">
            <motion.div
              key={current}
              className="h-full bg-gold/40"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTOPLAY_DELAY / 1000, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

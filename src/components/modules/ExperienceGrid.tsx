"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JON_CONTACT, formatReservaMessage } from "@/lib/constants";
import { useTranslations } from "next-intl";

type Experiencia = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  gallery: string[];
};

export const ExperienceGrid = () => {
  const t = useTranslations("experience");
  const [selectedPack, setSelectedPack] = useState<Experiencia | null>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [data, setData] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/expediciones")
      .then((r) => r.json())
      .then((rows) => {
        if (!Array.isArray(rows)) {
          setData([]);
          setLoading(false);
          return;
        }
        const mapped: Experiencia[] = rows.map((e: any) => ({
          id: String(e.id),
          title: String(e.title),
          category: String(e.category),
          description: String(e.description),
          price: e.price && Number(e.price) > 0 ? Number(e.price) : -1,
          image: String(e.image),
          gallery: e.gallery
            ? e.gallery.split(",").map((s: string) => s.trim())
            : [String(e.image)],
        }));
        setData(mapped);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, []);

  const formatPrice = (value: unknown) => {
    if (typeof value !== "number" || !Number.isFinite(value) || value === -1) return null;
    return new Intl.NumberFormat("es-AR").format(value);
  };

  useEffect(() => {
    const handleClose = () => setSelectedPack(null);
    window.addEventListener("jonco:closeExperienceModal", handleClose);
    return () => window.removeEventListener("jonco:closeExperienceModal", handleClose);
  }, []);

  useEffect(() => {
    if (selectedPack) {
      document.body.style.overflow = "hidden";
      setActiveImg(selectedPack.image);
      window.dispatchEvent(new Event("jonco:experienceModalOpen"));
    } else {
      document.body.style.overflow = "unset";
      setActiveImg(null);
      window.dispatchEvent(new Event("jonco:experienceModalClose"));
    }
  }, [selectedPack]);

  if (!mounted) return null;
  if (loading) {
    return (
      <section className="py-24 px-6 w-full">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-zinc-500 text-sm">{t("loading")}</div>
        </div>
      </section>
    );
  }
  if (data.length === 0) {
    return (
      <section className="py-24 px-6 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              {t("coming_soon_title")}
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              {t("coming_soon_text")}
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href={JON_CONTACT.getWhatsAppLink(t("whatsapp_coming"))}
              target="_blank"
              className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gold transition-all active:scale-95"
            >
              {t("consult_news")}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {([t("exclusive_exp"), t("private_nav"), t("nature")] as string[]).map((title, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gold rounded-full" />
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider">{title}</h3>
                <p className="text-zinc-500 text-sm">{t("discover")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 w-full">
      {/* SECTION TITLE */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <span className="text-gold-light text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] block opacity-70">
            {t("exclusive_exp")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-tight">
            Expediciones
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
            {t("discover")}
          </p>
        </motion.div>
      </div>

      {/* GRID DE CARDS PRINCIPAL */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {data.map((tour) => (
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
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              alt={tour.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

            <div className="absolute top-6 right-6">
              <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/10 font-bold uppercase tracking-widest">
                {formatPrice(tour.price) ? `$ ${formatPrice(tour.price)}` : t("consult")}
              </span>
            </div>

            <div className="absolute bottom-0 p-8 sm:p-10 w-full">
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-3 block">
                {tour.category}
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-black uppercase tracking-tighter leading-snug mb-3 italic group-hover:not-italic transition-all text-white break-words pr-2 pb-1">
                {tour.title}
              </h3>
              <p className="text-white border-b border-gold/50 inline-block pb-1 text-[10px] uppercase tracking-widest font-bold group-hover:text-gold transition-colors">
                {t("see_details")}
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
              <span className="text-[10px] font-black uppercase tracking-widest">{t("close")}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative z-10 w-full h-full lg:max-w-7xl lg:h-[85vh] bg-[#0a0a0a] lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border-white/10 border mx-auto"
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
                      alt={selectedPack.title}
                    />
                  )}
                </AnimatePresence>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 max-w-[90%] overflow-x-auto no-scrollbar">
                  {selectedPack.gallery?.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(img)}
                      className={`relative w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        activeImg === img ? "ring-2 ring-gold scale-105" : "opacity-40"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`${selectedPack.title} — foto ${i + 1}`} />
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
                      {t("from")}{" "}
                      <span className="font-black text-gold">
                        {formatPrice(selectedPack.price) ? `$ ${formatPrice(selectedPack.price)}` : t("consult")}
                      </span>{" "}
                      {t("per_pax")}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none italic">
                    {selectedPack.title}
                  </h2>

                  <p className="text-zinc-500 text-lg font-light leading-relaxed mb-10 italic border-l border-gold/30 pl-6">
                    {selectedPack.description}{" "}
                    {formatPrice(selectedPack.price) ? (
                      <span className="text-white/70">($ {formatPrice(selectedPack.price)})</span>
                    ) : null}
                  </p>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex flex-col gap-4">
                    <a
                      href={JON_CONTACT.getWhatsAppLink(formatReservaMessage({
                        title: selectedPack.title,
                        category: selectedPack.category,
                        price: selectedPack.price,
                      }))}
                      target="_blank"
                      className="w-full bg-white text-black text-center py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all active:scale-95"
                    >
                      {t("book")}
                    </a>

                    <button
                      onClick={() => setSelectedPack(null)}
                      className="w-full text-zinc-500 text-center py-2 text-[10px] uppercase tracking-[0.3em] font-black hover:text-white transition-colors"
                    >
                      {t("back_gallery")}
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

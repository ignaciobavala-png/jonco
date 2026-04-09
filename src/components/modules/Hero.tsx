"use client";
import { motion } from "framer-motion";
import { JON_CONTACT } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const POSTER = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070";

const DEFAULTS = {
  hero_label: "",
  hero_titulo: "",
  hero_titulo_accent: "",
  hero_subtitulo: "",
};

type HeroTextData = typeof DEFAULTS;

export const Hero = () => {
  const t = useTranslations("hero");
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null | undefined>(undefined);
  const [videoReady, setVideoReady] = useState(false);
  const [textData, setTextData] = useState<HeroTextData>(DEFAULTS);
  const [textReady, setTextReady] = useState(false);
  const heroVideoUrlRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const fetchHeroVideo = async () => {
      try {
        // Get current locale from URL or default to 'es'
        const locale = window.location.pathname.startsWith('/en') ? 'en' : 
                      window.location.pathname.startsWith('/it') ? 'it' : 'es';
        
        const res = await fetch(`/api/configuracion?locale=${locale}`, { cache: "no-store" });
        if (res.ok) {
          const config = await res.json();
          const heroConfig = config.find((c: any) => c.clave === "hero_video_url");
          const newUrl = heroConfig?.valor || null;
          if (newUrl !== heroVideoUrlRef.current) {
            setVideoReady(false);
            heroVideoUrlRef.current = newUrl;
          }
          setHeroVideoUrl(newUrl);
          const get = (clave: keyof HeroTextData) =>
            config.find((c: any) => c.clave === clave)?.valor || DEFAULTS[clave];
          setTextData({
            hero_label: get("hero_label"),
            hero_titulo: get("hero_titulo"),
            hero_titulo_accent: get("hero_titulo_accent"),
            hero_subtitulo: get("hero_subtitulo"),
          });
          setTextReady(true);
        } else {
          setHeroVideoUrl(null);
        }
      } catch (error) {
        console.error("Failed to fetch hero video URL:", error);
        setHeroVideoUrl(null);
      }
    };

    fetchHeroVideo();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchHeroVideo();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
        className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center bg-zinc-900" 
        style={{ 
          height: 'calc(100vh - var(--jonco-navbar-h, 80px))',
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.04) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 60%)'
        }}
      >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {heroVideoUrl === undefined ? null : heroVideoUrl ? (
          <video
            key={heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoReady(true)}
            className={`h-full w-full object-cover brightness-[0.75] transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={POSTER}
            alt="Paisaje natural del Delta del Paraná — Jonco Expediciones"
            className="h-full w-full object-cover brightness-[0.75]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Contenido principal centrado */}
      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-24 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 30 }}
          transition={{ duration: 1, delay: textReady ? 0.3 : 0 }}
          className="space-y-6 sm:space-y-8"
        >
          {textData.hero_label && (
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 20 }}
              transition={{ duration: 0.8, delay: textReady ? 0.4 : 0 }}
              className="text-gold-light uppercase text-[8px] sm:text-[10px] tracking-[0.5em] font-bold block opacity-90 drop-shadow-gold mx-auto"
            >
              {textData.hero_label}
            </motion.span>
          )}

          {(textData.hero_titulo || textData.hero_titulo_accent) && (
            <motion.h1 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 30, scale: textReady ? 1 : 0.95 }}
              transition={{ duration: 1, delay: textReady ? 0.6 : 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter text-white leading-tight uppercase text-center"
            >
              {textData.hero_titulo && <>{textData.hero_titulo}<br className="hidden sm:block" /></>}
              {textData.hero_titulo_accent && (
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: textReady ? 0.8 : 0 }}
                  className="font-black text-gold-bright drop-shadow-lg block"
                >
                  {textData.hero_titulo_accent}
                </motion.span>
              )}
            </motion.h1>
          )}

          {textData.hero_subtitulo && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 20 }}
              transition={{ duration: 0.8, delay: textReady ? 1.0 : 0 }}
              className="text-zinc-200 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed mx-auto text-center drop-shadow-md"
            >
              {textData.hero_subtitulo}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 30 }}
            transition={{ duration: 0.8, delay: textReady ? 1.2 : 0 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 justify-center"
          >
            <button
              onClick={() => scrollToSection("experiencias")}
              className="bg-white text-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gold-light transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-gold/25"
            >
              {t("expeditions_btn")}
            </button>

            <button
              onClick={() => scrollToSection("historia")}
              className="border border-white/40 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:border-gold-light hover:text-gold-light transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-gold/20"
            >
              {t("history_btn")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

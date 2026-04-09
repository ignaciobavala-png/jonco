"use client";
import { motion } from "framer-motion";
import { JON_CONTACT } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export const Footer = () => {
  const t = useTranslations("footer");
  const [footerConfig, setFooterConfig] = useState({
    tagline: "",
    instagram: "",
    email: "",
    phone: "",
    location: "",
    coordinates: ""
  });

  useEffect(() => {
    const loadFooterConfig = async () => {
      try {
        // Load contact data from contacto table
        const contactoRes = await fetch("/api/contacto");
        const contactoData = contactoRes.ok ? await contactoRes.json() : {};
        
        // Load footer-specific config from configuracion table
        const configRes = await fetch("/api/configuracion");
        const configData = configRes.ok ? await configRes.json() : [];
        const getConfig = (clave: string) => configData.find((c: any) => c.clave === clave)?.valor || "";
        
        setFooterConfig({
          tagline: getConfig("footer_tagline") || "Experiencias únicas en el Delta del Paraná",
          instagram: contactoData.instagram || JON_CONTACT.instagram,
          email: contactoData.email || JON_CONTACT.email,
          phone: contactoData.telefono || JON_CONTACT.phone,
          location: getConfig("footer_location") || JON_CONTACT.location,
          coordinates: getConfig("footer_coordinates") || JON_CONTACT.coordinates
        });
      } catch (error) {
        console.error("Error loading footer config:", error);
      }
    };
    
    loadFooterConfig();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer 
      className="relative bg-zinc-900 border-t border-white/5 pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 mt-16 sm:mt-20 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(212, 175, 55, 0.02) 0%, transparent 40%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-gold font-mono text-[8px] tracking-[0.8em] uppercase rotate-90 hidden lg:block">
          Delta del Paraná // {footerConfig.coordinates}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Branding Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                JONCO<span className="text-gold">.</span>
              </h3>
              <div className="w-12 h-0.5 bg-gold/50" />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
              {footerConfig.tagline}
            </p>
            <div className="space-y-1 text-zinc-500 text-xs font-mono">
              <p>{footerConfig.location}</p>
              <p>{footerConfig.coordinates}</p>
            </div>
          </motion.div>

          {/* Navigation Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-black">{t("navigation")}</span>
              <div className="w-8 h-0.5 bg-gold/30" />
            </div>
            <nav className="flex flex-col gap-3">
              <button
                onClick={scrollToTop}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left active:scale-95"
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("historia")}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left active:scale-95"
              >
                {t("history")}
              </button>
              <button
                onClick={() => scrollToSection("experiencias")}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium text-left active:scale-95"
              >
                {t("expeditions")}
              </button>
            </nav>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-black">{t("contact_title")}</span>
              <div className="w-8 h-0.5 bg-gold/30" />
            </div>
            <div className="space-y-3">
              <a
                href={`mailto:${footerConfig.email}`}
                className="text-zinc-400 hover:text-gold transition-colors text-sm font-medium block active:scale-95"
              >
                {footerConfig.email}
              </a>
              <a
                href={`https://wa.me/${footerConfig.phone}?text=${encodeURIComponent(t("whatsapp_message"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all active:scale-95"
              >
                {t("whatsapp")}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-white/5"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-medium">
                {t("copyright", { year: new Date().getFullYear() })}
              </p>
              <p className="text-zinc-700 text-[8px] uppercase tracking-[0.1em] font-medium mt-1">
                {t("operating")}
              </p>
            </div>

            <div className="flex gap-6 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
              <a
                href={`https://instagram.com/${footerConfig.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors active:scale-95"
              >
                {t("instagram")}
              </a>
              <a
                href={`https://wa.me/${footerConfig.phone}?text=${encodeURIComponent(t("whatsapp_info"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors active:scale-95"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="font-signature text-2xl text-gold/30">
            Capitán Jonco
          </div>
        </motion.div>

        {/* Créditos */}
        <div className="border-t border-white/5 pt-4 mt-4 text-center">
          <p className="text-[10px] text-white/30">
            {t("developed_by")}{" "}
            <a
              href="https://petralabs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/80 transition-colors underline"
            >
              Petralabs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

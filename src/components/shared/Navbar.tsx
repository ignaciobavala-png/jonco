"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JON_CONTACT } from "@/lib/constants";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALES = [
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "es", flag: "🇦🇷", label: "ES" },
  { code: "it", flag: "🇮🇹", label: "IT" },
] as const;

const LanguageSwitcher = ({ mobile = false }: { mobile?: boolean }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  if (mobile) {
    return (
      <div className="flex items-center gap-3 mt-2">
        {LOCALES.map(({ code, flag, label }) => (
          <button
            key={code}
            onClick={() => switchLocale(code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              locale === code
                ? "bg-gold text-black"
                : "bg-white/10 text-white/50 hover:text-white hover:bg-white/20"
            }`}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${
            locale === code
              ? "bg-white/15 text-white"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          <span className="text-[13px] leading-none">{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export const Navbar = () => {
  const t = useTranslations("nav");
  const navRef = useRef<HTMLElement | null>(null);
  const maxNavHRef = useRef<number>(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [immersiveOpen, setImmersiveOpen] = useState(false);

  useEffect(() => {
    const checkInitialScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    checkInitialScroll();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldScroll = scrollY > 20;
      setScrolled(shouldScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      maxNavHRef.current = Math.max(maxNavHRef.current, Math.ceil(h));
      document.documentElement.style.setProperty("--jonco-navbar-h", `${maxNavHRef.current}px`);
    };

    setVar();

    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  const getNavbarOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--jonco-navbar-h").trim();
    const parsed = Number.parseInt(raw.replace("px", ""), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  useEffect(() => {
    const open = () => setImmersiveOpen(true);
    const close = () => setImmersiveOpen(false);
    window.addEventListener("jonco:experienceModalOpen", open);
    window.addEventListener("jonco:experienceModalClose", close);
    return () => {
      window.removeEventListener("jonco:experienceModalOpen", open);
      window.removeEventListener("jonco:experienceModalClose", close);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    window.dispatchEvent(new Event("jonco:closeExperienceModal"));
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = getNavbarOffset();
      const y = section.getBoundingClientRect().top + window.scrollY - offset - 20;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.dispatchEvent(new Event("jonco:closeExperienceModal"));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-[200] transition-all duration-500 ${immersiveOpen ? "opacity-0 pointer-events-none" : "opacity-100"} ${
          scrolled ? "bg-white/5 backdrop-blur-xl border-b border-white/10 py-3 md:py-4" : "!bg-transparent py-4 md:py-6"
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.05)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* LOGO */}
          <button onClick={scrollToTop} className="flex items-center gap-2 group active:scale-95 transition-transform">
            <img
              src="/branding/jonco-logo.svg"
              alt="Jonco logo"
              width={22}
              height={22}
              className="drop-shadow-gold"
            />
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">
              JONCO<span className="text-gold-light group-hover:text-gold-bright">.</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={scrollToTop}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold-light transition-all active:scale-95"
            >
              {t("home")}
            </button>
            <button
              onClick={() => scrollToSection("historia")}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold-light transition-all active:scale-95"
            >
              {t("history")}
            </button>
            <button
              onClick={() => scrollToSection("experiencias")}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold-light transition-all active:scale-95"
            >
              {t("expeditions")}
            </button>
            <button
              onClick={() => scrollToSection("feedback")}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/70 hover:text-gold-light transition-all active:scale-95"
            >
              {t("clients")}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            <a
              href={JON_CONTACT.getWhatsAppLink(t("whatsapp_message"))}
              target="_blank"
              className="bg-white text-black px-4 lg:px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold-light transition-all active:scale-95 shadow-lg hover:shadow-gold/25"
            >
              {t("contact")}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-white active:scale-90 transition-transform"
          >
            <span className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-current transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[190] md:hidden bg-black/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
              <button
                onClick={scrollToTop}
                className="text-2xl font-black tracking-tighter text-white active:scale-95 transition-transform"
              >
                {t("home")}
              </button>
              <button
                onClick={() => scrollToSection("historia")}
                className="text-xl font-bold text-white/80 hover:text-gold-light transition-colors active:scale-95"
              >
                {t("history")}
              </button>
              <button
                onClick={() => scrollToSection("experiencias")}
                className="text-xl font-bold text-white/80 hover:text-gold-light transition-colors active:scale-95"
              >
                {t("expeditions")}
              </button>
              <button
                onClick={() => scrollToSection("feedback")}
                className="text-xl font-bold text-white/80 hover:text-gold-light transition-colors active:scale-95"
              >
                {t("clients")}
              </button>
              <a
                href={JON_CONTACT.getWhatsAppLink(t("whatsapp_message"))}
                target="_blank"
                className="bg-gold-light text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gold-bright transition-all active:scale-95 shadow-lg hover:shadow-gold/30"
              >
                {t("contact")}
              </a>
              {/* Mobile Language Switcher */}
              <LanguageSwitcher mobile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

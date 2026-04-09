"use client";
import { ExpedicionesManager } from "@/components/admin/ExpedicionesManager";
import { ContactoManager } from "@/components/admin/ContactoManager";
import { ConfiguracionManager } from "@/components/admin/ConfiguracionManager";
import { TestimoniosManager } from "@/components/admin/TestimoniosManager";
import { NuestraHistoriaManager } from "@/components/admin/NuestraHistoriaManager";
import { useState } from "react";

type Language = "es" | "en" | "it";

type Tab = "expediciones" | "feedback" | "contacto" | "nuestra-historia" | "configuracion";

const TAB_LABELS: Record<Tab, string> = {
  expediciones: "Expediciones",
  feedback: "Feedback",
  contacto: "Contacto",
  "nuestra-historia": "Nuestra Historia",
  configuracion: "Configuración",
};

const LANGUAGE_LABELS: Record<Language, string> = {
  es: "Español",
  en: "English", 
  it: "Italiano"
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("expediciones");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("es");

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/branding/jonco-logo.svg" alt="Jonco" width={20} height={20} />
          <span className="text-white font-black tracking-tighter text-lg">
            JONCO <span className="text-gold">ADM</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Idioma:</span>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as Language)}
              className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1 text-white text-xs font-light focus:outline-none focus:border-white/30"
            >
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Panel de Control</span>
        </div>
      </header>

      <div className="border-b border-white/5 px-6 flex gap-6 overflow-x-auto">
        {(["expediciones", "feedback", "contacto", "nuestra-historia", "configuracion"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-[10px] uppercase tracking-widest font-black border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? "border-gold text-gold" : "border-transparent text-zinc-500 hover:text-white"}`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6">
        {activeTab === "expediciones" && <ExpedicionesManager />}
        {activeTab === "feedback" && <TestimoniosManager />}
        {activeTab === "contacto" && <ContactoManager />}
        {activeTab === "nuestra-historia" && <NuestraHistoriaManager currentLanguage={currentLanguage} />}
        {activeTab === "configuracion" && <ConfiguracionManager currentLanguage={currentLanguage} />}
      </main>
    </div>
  );
}

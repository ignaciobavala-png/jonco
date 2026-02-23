"use client";
import { ExpedicionesManager } from "@/components/admin/ExpedicionesManager";
import { ContactoManager } from "@/components/admin/ContactoManager";
import { ConfiguracionManager } from "@/components/admin/ConfiguracionManager";
import { TestimoniosManager } from "@/components/admin/TestimoniosManager";
import { useState } from "react";

type Tab = "expediciones" | "feedback" | "contacto" | "configuracion";

const TAB_LABELS: Record<Tab, string> = {
  expediciones: "Expediciones",
  feedback: "Feedback",
  contacto: "Contacto",
  configuracion: "Configuración",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("expediciones");

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/branding/jonco-logo.svg" alt="Jonco" width={20} height={20} />
          <span className="text-white font-black tracking-tighter text-lg">
            JONCO <span className="text-gold">ADM</span>
          </span>
        </div>
        <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">Panel de Control</span>
      </header>

      <div className="border-b border-white/5 px-6 flex gap-6 overflow-x-auto">
        {(["expediciones", "feedback", "contacto", "configuracion"] as Tab[]).map((tab) => (
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
        {activeTab === "configuracion" && <ConfiguracionManager />}
      </main>
    </div>
  );
}

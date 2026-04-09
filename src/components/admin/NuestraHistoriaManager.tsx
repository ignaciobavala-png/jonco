"use client";
import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";

type Configuracion = {
  clave: string;
  valor: string;
  descripcion: string;
  updated_at: string;
};

type Language = "es" | "en" | "it";

interface NuestraHistoriaManagerProps {
  currentLanguage: Language;
}

export const NuestraHistoriaManager = ({ currentLanguage }: NuestraHistoriaManagerProps) => {
  const [config, setConfig] = useState<Configuracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Historia form state
  const [historiaCita, setHistoriaCita] = useState("");
  const [historiaParrafo1, setHistoriaParrafo1] = useState("");
  const [historiaParrafo2, setHistoriaParrafo2] = useState("");
  const [historiaFirma, setHistoriaFirma] = useState("");
  const [historiaImagen, setHistoriaImagen] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/configuracion?locale=${currentLanguage}`);
      if (!res.ok) throw new Error();
      const data: Configuracion[] = await res.json();
      setConfig(Array.isArray(data) ? data : []);

      const get = (clave: string) => data.find(c => c.clave === clave)?.valor ?? "";
      setHistoriaCita(get("historia_cita"));
      setHistoriaParrafo1(get("historia_parrafo_1"));
      setHistoriaParrafo2(get("historia_parrafo_2"));
      setHistoriaFirma(get("historia_firma"));
      setHistoriaImagen(get("historia_imagen"));
    } catch {
      setError("No se pudo cargar la configuración. Verificá la conexión a la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [currentLanguage]);

  const updateConfig = async (clave: string, valor: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        body: JSON.stringify({ clave, valor, locale: currentLanguage }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      alert("Error al guardar configuración. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const saveHistoria = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "historia_imagen", valor: historiaImagen }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "historia_cita", valor: historiaCita, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "historia_parrafo_1", valor: historiaParrafo1, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "historia_parrafo_2", valor: historiaParrafo2, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "historia_firma", valor: historiaFirma, locale: currentLanguage }) }),
      ]);
      await load();
    } catch {
      alert("Error al guardar la sección Historia. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-zinc-500 text-sm text-center py-20">Cargando configuración...</div>;
  if (error) return <div className="text-red-400 text-sm text-center py-20">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter">
          Nuestra Historia
        </h2>
      </div>

      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-white font-black text-lg mb-1">Identidad y Origen</h3>
          <p className="text-zinc-400 text-sm">
            Contenido de la sección "Nuestra Historia" de la landing.
          </p>
        </div>

        {/* Imagen */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-3">
            Foto del Capitán
          </label>
          {historiaImagen && (
            <img
              src={historiaImagen}
              alt="Historia"
              className="w-full max-w-xs aspect-[3/4] object-cover rounded-lg border border-white/10 mb-3 grayscale brightness-75"
            />
          )}
          <ImageUploader
            onUpload={(url) => setHistoriaImagen(url)}
            currentImage={historiaImagen}
            folder="configuracion"
            accept="image/*"
          />
          <p className="text-zinc-600 text-[9px] mt-2">
            Imagen en proporción 3:4. JPG, PNG, WebP hasta 10MB.
          </p>
        </div>

        {/* Cita */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
            Cita principal (tipografía firma)
          </label>
          <textarea
            value={historiaCita}
            onChange={e => setHistoriaCita(e.target.value)}
            rows={3}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light resize-none focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Párrafo 1 */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
            Primer párrafo
          </label>
          <textarea
            value={historiaParrafo1}
            onChange={e => setHistoriaParrafo1(e.target.value)}
            rows={4}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light resize-none focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Párrafo 2 */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
            Segundo párrafo
          </label>
          <textarea
            value={historiaParrafo2}
            onChange={e => setHistoriaParrafo2(e.target.value)}
            rows={4}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light resize-none focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Firma */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
            Firma
          </label>
          <input
            type="text"
            value={historiaFirma}
            onChange={e => setHistoriaFirma(e.target.value)}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
          />
        </div>

        <button
          onClick={saveHistoria}
          disabled={saving}
          className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-40"
        >
          {saving ? "Guardando..." : "Guardar Historia"}
        </button>
      </div>
    </div>
  );
};

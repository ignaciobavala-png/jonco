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

interface ConfiguracionManagerProps {
  currentLanguage: Language;
}

export const ConfiguracionManager = ({ currentLanguage }: ConfiguracionManagerProps) => {
  const [config, setConfig] = useState<Configuracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Hero textos form state
  const [heroLabel, setHeroLabel] = useState("");
  const [heroTitulo, setHeroTitulo] = useState("");
  const [heroTituloAccent, setHeroTituloAccent] = useState("");
  const [heroSubtitulo, setHeroSubtitulo] = useState("");

  
  // Footer form state
  const [footerTagline, setFooterTagline] = useState("");
  const [footerLocation, setFooterLocation] = useState("");
  const [footerCoordinates, setFooterCoordinates] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/configuracion?locale=${currentLanguage}`);
      if (!res.ok) throw new Error();
      const data: Configuracion[] = await res.json();
      setConfig(Array.isArray(data) ? data : []);

      const get = (clave: string) => data.find(c => c.clave === clave)?.valor ?? "";
      setHeroLabel(get("hero_label"));
      setHeroTitulo(get("hero_titulo"));
      setHeroTituloAccent(get("hero_titulo_accent"));
      setHeroSubtitulo(get("hero_subtitulo"));
      setFooterTagline(get("footer_tagline"));
      setFooterLocation(get("footer_location"));
      setFooterCoordinates(get("footer_coordinates"));
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

  const saveHeroTextos = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "hero_label", valor: heroLabel, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "hero_titulo", valor: heroTitulo, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "hero_titulo_accent", valor: heroTituloAccent, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "hero_subtitulo", valor: heroSubtitulo, locale: currentLanguage }) }),
      ]);
      await load();
    } catch {
      alert("Error al guardar los textos del Hero. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  
  const saveFooter = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "footer_tagline", valor: footerTagline, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "footer_location", valor: footerLocation, locale: currentLanguage }) }),
        fetch("/api/configuracion", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave: "footer_coordinates", valor: footerCoordinates, locale: currentLanguage }) }),
      ]);
      await load();
    } catch {
      alert("Error al guardar la configuración del Footer. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-zinc-500 text-sm text-center py-20">Cargando configuración...</div>;
  if (error) return <div className="text-red-400 text-sm text-center py-20">{error}</div>;

  const heroVideoConfig = config.find(c => c.clave === "hero_video_url");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter">
          Configuración
        </h2>
      </div>

      <div className="space-y-6">

        {/* ── SECCIÓN HERO ── */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-black text-lg mb-1">Hero</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Video de fondo de la sección principal del sitio.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-3">
                Video Actual
              </label>
              {heroVideoConfig?.valor ? (
                <video
                  src={heroVideoConfig.valor}
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-white/10"
                  controls
                  muted
                />
              ) : (
                <div className="w-full max-w-md h-48 bg-zinc-800 rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">No hay video configurado</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-3">
                Subir Nuevo Video
              </label>
              <ImageUploader
                onUpload={(url) => updateConfig("hero_video_url", url)}
                currentImage={heroVideoConfig?.valor}
                folder="configuracion"
                accept="video/*"
              />
              <p className="text-zinc-600 text-[9px] mt-2">
                Formatos soportados: MP4, MOV, WebM. Máximo 50MB.
              </p>
            </div>
          </div>

          {/* Textos Hero */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Label Superior
              </label>
              <input type="text" value={heroLabel} onChange={e => setHeroLabel(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Título Línea 1
              </label>
              <input type="text" value={heroTitulo} onChange={e => setHeroTitulo(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Título Destacado (dorado)
              </label>
              <input type="text" value={heroTituloAccent} onChange={e => setHeroTituloAccent(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Subtítulo
              </label>
              <textarea value={heroSubtitulo} onChange={e => setHeroSubtitulo(e.target.value)} rows={3}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light resize-none focus:outline-none focus:border-white/30" />
            </div>
            <button onClick={saveHeroTextos} disabled={saving}
              className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-40">
              {saving ? "Guardando..." : "Guardar Textos Hero"}
            </button>
          </div>
        </div>

        
        {/* ── SECCIÓN FOOTER ── */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-white font-black text-lg mb-1">Footer</h3>
            <p className="text-zinc-400 text-sm">
              Información de contacto y datos mostrados en el pie de página.
            </p>
          </div>

          {/* Tagline */}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
              Tagline (descripción breve)
            </label>
            <textarea
              value={footerTagline}
              onChange={e => setFooterTagline(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light resize-none focus:outline-none focus:border-white/30"
              placeholder="Descripción breve que aparece debajo del logo..."
            />
          </div>

          <p className="text-zinc-500 text-sm mb-4">
              Los datos de contacto (email, teléfono, Instagram) se configuran en la pestaña "Contacto".
            </p>

          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={footerLocation}
                onChange={e => setFooterLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
                placeholder="Tigre, Buenos Aires, Argentina"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Coordenadas
              </label>
              <input
                type="text"
                value={footerCoordinates}
                onChange={e => setFooterCoordinates(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
                placeholder="-34.4267°S, 58.5796°W"
              />
            </div>
          </div>

          <button
            onClick={saveFooter}
            disabled={saving}
            className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-40"
          >
            {saving ? "Guardando..." : "Guardar Footer"}
          </button>
        </div>

      </div>
    </div>
  );
};

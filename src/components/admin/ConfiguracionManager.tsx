"use client";
import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";

type Configuracion = {
  clave: string;
  valor: string;
  descripcion: string;
  updated_at: string;
};

export const ConfiguracionManager = () => {
  const [config, setConfig] = useState<Configuracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/configuracion");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setConfig(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudo cargar la configuración. Verificá la conexión a la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateConfig = async (clave: string, valor: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        body: JSON.stringify({ clave, valor }),
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

  if (loading) return <div className="text-zinc-500 text-sm text-center py-20">Cargando configuración...</div>;
  if (error) return <div className="text-red-400 text-sm text-center py-20">{error}</div>;

  const heroVideoConfig = config.find(c => c.clave === "hero_video_url");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter">
          Configuración <span className="text-zinc-600 font-light">({config.length})</span>
        </h2>
      </div>

      <div className="space-y-6">
        {/* Hero Video Configuration */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-black text-lg mb-4">Video del Hero</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Este video se mostrará como fondo en la sección principal del sitio web.
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
        </div>

        {/* Other Configuration Items */}
        {config.filter(c => c.clave !== "hero_video_url").map((item) => (
          <div key={item.clave} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">{item.clave}</h3>
                <p className="text-zinc-400 text-[10px] mt-1">{item.descripcion}</p>
                <p className="text-zinc-500 text-[9px] mt-2">
                  Última actualización: {new Date(item.updated_at).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-zinc-500 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

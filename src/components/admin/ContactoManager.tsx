"use client";
import { useState, useEffect } from "react";

type ContactoData = {
  telefono: string;
  email: string;
  instagram: string;
  whatsapp_mensaje: string;
};

export const ContactoManager = () => {
  const [data, setData] = useState<ContactoData>({
    telefono: "",
    email: "",
    instagram: "",
    whatsapp_mensaje: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/contacto")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  const submit = async () => {
    setSaving(true);
    try {
      await fetch("/api/contacto", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-zinc-500 text-sm text-center py-20">Cargando datos de contacto...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter">Contacto</h2>
        <p className="text-zinc-500 text-sm font-light">Estos datos se usan en el sitio para los botones de WhatsApp, email e Instagram.</p>
      </div>

      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 space-y-6">
        {[
          { label: "Teléfono / WhatsApp", key: "telefono", placeholder: "+5491140765354" },
          { label: "Email", key: "email", placeholder: "expediciones@jonco.com.ar" },
          { label: "Instagram (sin @)", key: "instagram", placeholder: "joncoadventures" },
          { label: "Mensaje de WhatsApp por defecto", key: "whatsapp_mensaje", placeholder: "Hola Jon! Quiero consultar..." },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-1">{label}</label>
            <input
              value={data[key as keyof ContactoData]}
              onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-zinc-800 border border-white/10 focus:border-gold outline-none rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 transition-colors"
            />
          </div>
        ))}

        <button
          onClick={submit}
          disabled={saving}
          className="w-full bg-gold text-black py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>

        {saved && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <p className="text-green-400 text-[10px] uppercase tracking-widest font-black">Guardado correctamente</p>
          </div>
        )}
      </div>
    </div>
  );
};

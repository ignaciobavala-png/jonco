"use client";
import { useState, useEffect } from "react";

type Testimonio = {
  id: number;
  name: string;
  location: string;
  experience: string;
  date: string;
  country: string;
  text: string;
  created_at: string;
};

const EMPTY_FORM = { name: "", location: "", experience: "", date: "", country: "", text: "" };

const COUNTRIES = [
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "MX", name: "México", flag: "🇲🇽" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "IT", name: "Italia", flag: "🇮🇹" },
  { code: "FR", name: "Francia", flag: "🇫🇷" },
  { code: "DE", name: "Alemania", flag: "🇩🇪" },
  { code: "UK", name: "Reino Unido", flag: "🇬🇧" },
  { code: "CA", name: "Canadá", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "Nueva Zelanda", flag: "🇳🇿" },
  { code: "JP", name: "Japón", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ZA", name: "Sudáfrica", flag: "🇿🇦" },
  { code: "RU", name: "Rusia", flag: "🇷🇺" },
  { code: "KR", name: "Corea del Sur", flag: "🇰🇷" },
  { code: "NL", name: "Países Bajos", flag: "🇳🇱" },
  { code: "SE", name: "Suecia", flag: "🇸🇪" },
  { code: "NO", name: "Noruega", flag: "🇳🇴" },
  { code: "DK", name: "Dinamarca", flag: "🇩🇰" },
  { code: "FI", name: "Finlandia", flag: "🇫🇮" },
  { code: "CH", name: "Suiza", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "BE", name: "Bélgica", flag: "🇧🇪" },
  { code: "IE", name: "Irlanda", flag: "🇮🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", name: "Grecia", flag: "🇬🇷" },
  { code: "TR", name: "Turquía", flag: "🇹🇷" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "TH", name: "Tailandia", flag: "🇹🇭" },
  { code: "SG", name: "Singapur", flag: "🇸🇬" },
  { code: "MY", name: "Malasia", flag: "🇲🇾" },
  { code: "PH", name: "Filipinas", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "EG", name: "Egipto", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenia", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
];

export const TestimoniosManager = () => {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonios");
      if (!res.ok) {
        // Tabla no creada aún u otro error de servidor — no bloquear el form
        setTestimonios([]);
        return;
      }
      const data = await res.json();
      setTestimonios(Array.isArray(data) ? data : []);
    } catch {
      setTestimonios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      alert("Nombre y testimonio son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/testimonios?id=${editingId}` : "/api/testimonios";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      
      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      await load();
    } catch {
      alert("Error al guardar el testimonio.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonio: Testimonio) => {
    setForm({
      name: testimonio.name,
      location: testimonio.location,
      experience: testimonio.experience,
      date: testimonio.date,
      country: testimonio.country,
      text: testimonio.text,
    });
    setEditingId(testimonio.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/testimonios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      alert("Error al eliminar el testimonio.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-zinc-500 text-sm text-center py-20">Cargando testimonios...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter">
          Feedback de Clientes <span className="text-zinc-600 font-light">({testimonios.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-white text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
        >
          {showForm ? "Cancelar" : "+ Nuevo"}
        </button>
      </div>

      {/* Formulario de nuevo testimonio */}
      {showForm && (
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-black text-base mb-2">
            {editingId ? "Editar Testimonio" : "Nuevo Testimonio"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Sofía R."
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Localidad
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="CABA"
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Experiencia
              </label>
              <input
                type="text"
                value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                placeholder="Delta Premium"
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                Fecha
              </label>
              <input
                type="text"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                placeholder="Diciembre 2024"
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
                País
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowCountrySelector(!showCountrySelector)}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30 text-left flex items-center justify-between hover:border-white/20 transition-colors"
                >
                  <span>
                    {form.country ? (
                      (() => {
                        const country = COUNTRIES.find(c => c.code === form.country);
                        return country ? `${country.flag} ${country.name}` : "Seleccionar país";
                      })()
                    ) : (
                      "Seleccionar país"
                    )}
                  </span>
                  <span className="text-white/40">{showCountrySelector ? "▼" : "▶"}</span>
                </button>
                
                {showCountrySelector && (
                  <div className="bg-zinc-800 border border-white/10 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {COUNTRIES.map(country => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setForm(f => ({ ...f, country: country.code }));
                            setShowCountrySelector(false);
                          }}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:border-gold hover:bg-zinc-700 ${
                            form.country === country.code 
                              ? 'border-gold bg-zinc-700' 
                              : 'border-white/10'
                          }`}
                          title={country.name}
                        >
                          <span className="text-2xl mb-1">{country.flag}</span>
                          <span className="text-[9px] text-white/70 text-center leading-tight">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-2">
              Testimonio *
            </label>
            <textarea
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              rows={4}
              placeholder="Una experiencia impecable..."
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-light resize-none focus:outline-none focus:border-white/30"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-40"
          >
            {saving ? "Guardando..." : "Guardar Testimonio"}
          </button>
        </div>
      )}

      {/* Lista de testimonios */}
      <div className="space-y-4">
        {testimonios.length === 0 && (
          <div className="text-zinc-600 text-sm text-center py-16 border border-white/5 rounded-2xl">
            No hay testimonios cargados todavía.
          </div>
        )}
        {testimonios.map((t) => {
          const country = COUNTRIES.find(c => c.code === t.country);
          return (
          <div key={t.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <p className="text-zinc-200 text-sm font-light leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span className="text-white text-[10px] uppercase tracking-widest font-black">{t.name}</span>
                  {country && (
                    <span className="text-[12px]" title={country.name}>{country.flag}</span>
                  )}
                  {t.location && (
                    <span className="text-white/30 text-[10px] uppercase tracking-widest font-black">{t.location}</span>
                  )}
                  {t.experience && (
                    <span className="text-gold text-[10px] uppercase tracking-widest font-black">{t.experience}</span>
                  )}
                  {t.date && (
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-black">{t.date}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-zinc-600 hover:text-gold text-[10px] uppercase tracking-widest font-black transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="text-zinc-600 hover:text-red-400 text-[10px] uppercase tracking-widest font-black transition-colors disabled:opacity-40"
                >
                  {deletingId === t.id ? "..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

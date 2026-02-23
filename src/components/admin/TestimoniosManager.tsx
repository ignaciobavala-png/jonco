"use client";
import { useState, useEffect } from "react";

type Testimonio = {
  id: number;
  name: string;
  location: string;
  experience: string;
  date: string;
  text: string;
  created_at: string;
};

const EMPTY_FORM = { name: "", location: "", experience: "", date: "", text: "" };

export const TestimoniosManager = () => {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

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
      const res = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch {
      alert("Error al guardar el testimonio.");
    } finally {
      setSaving(false);
    }
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
          <h3 className="text-white font-black text-base mb-2">Nuevo Testimonio</h3>

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
        {testimonios.map((t) => (
          <div key={t.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <p className="text-zinc-200 text-sm font-light leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span className="text-white text-[10px] uppercase tracking-widest font-black">{t.name}</span>
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
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                className="text-zinc-600 hover:text-red-400 text-[10px] uppercase tracking-widest font-black transition-colors shrink-0 disabled:opacity-40"
              >
                {deletingId === t.id ? "..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

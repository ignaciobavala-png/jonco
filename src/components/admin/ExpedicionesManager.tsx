"use client";
import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";

type Experiencia = {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number | null;
  image: string;
  gallery: string;
  activo: number;
};

const emptyForm = (): Omit<Experiencia, "id" | "activo"> => ({
  title: "",
  category: "",
  description: "",
  price: null,
  image: "",
  gallery: "",
});

export const ExpedicionesManager = () => {
  const [items, setItems] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Experiencia> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showHorarioForm, setShowHorarioForm] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/expediciones");
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Guard: ensure we always set an array
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar las expediciones. Verificá la conexión a la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => setEditing(emptyForm());
  const openEdit = (item: Experiencia) => setEditing({ ...item });

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar esta expedición?")) return;
    await fetch("/api/expediciones", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const submit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const method = editing.id ? "PUT" : "POST";
      const res = await fetch("/api/expediciones", {
        method,
        body: JSON.stringify(editing),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (editing.id) {
        setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
      } else {
        setItems((prev) => [...prev, saved]);
      }
      setEditing(null);
    } catch {
      alert("Error al guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const loadHorarios = async () => {
    // This function will be used by the sub-components
  };

  // HorariosList component
  const HorariosList = ({ expedicionId, onUpdate }: { expedicionId: number; onUpdate: () => void }) => {
    const [horarios, setHorarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHorarios = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/horarios?expedicion_id=${expedicionId}`);
        if (res.ok) {
          const data = await res.json();
          setHorarios(Array.isArray(data) ? data : []);
        }
      } catch {
        // Silently fail for now
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => { fetchHorarios(); }, [expedicionId]);

    const deleteHorario = async (id: number) => {
      if (!confirm("¿Eliminar este horario?")) return;
      try {
        await fetch("/api/horarios", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
        setHorarios(prev => prev.filter(h => h.id !== id));
        onUpdate();
      } catch {
        alert("Error al eliminar horario");
      }
    };

    if (loading) return <div className="text-zinc-600 text-[10px]">Cargando horarios...</div>;
    if (horarios.length === 0) return <div className="text-zinc-600 text-[10px]">No hay horarios configurados</div>;

    return (
      <div className="space-y-2">
        {horarios.map((horario) => (
          <div key={horario.id} className="bg-zinc-800/50 border border-white/5 rounded-lg p-3 flex items-center justify-between">
            <div className="flex-1">
              <div className="text-white text-[10px] font-medium">{horario.dias}</div>
              <div className="text-zinc-400 text-[9px]">
                {horario.hora_salida} - {horario.hora_regreso} • {horario.cupos} cupos
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-zinc-500 hover:text-white text-[9px] uppercase tracking-widest">Editar</button>
              <button onClick={() => deleteHorario(horario.id)} className="text-zinc-700 hover:text-red-500 text-[9px]">✕</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // HorarioForm component
  const HorarioForm = ({ expedicionId, onSave, onCancel }: { expedicionId: number; onSave: () => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      dias: "",
      hora_salida: "",
      hora_regreso: "",
      cupos: 6
    });
    const [saving, setSaving] = useState(false);

    const submit = async () => {
      if (!formData.dias || !formData.hora_salida || !formData.hora_regreso) {
        alert("Completá todos los campos");
        return;
      }
      setSaving(true);
      try {
        const res = await fetch("/api/horarios", {
          method: "POST",
          body: JSON.stringify({ ...formData, expedicion_id: expedicionId }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error();
        onSave();
      } catch {
        alert("Error al guardar horario");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="bg-zinc-800/30 border border-white/5 rounded-lg p-4 space-y-3">
        <div>
          <label className="text-[9px] uppercase tracking-widest font-black text-white/40 block mb-1">Días</label>
          <input
            value={formData.dias}
            onChange={(e) => setFormData({ ...formData, dias: e.target.value })}
            placeholder="Ej: Lunes a Viernes"
            className="w-full bg-zinc-700 border border-white/10 focus:border-gold outline-none rounded px-3 py-2 text-white text-[10px] placeholder:text-white/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] uppercase tracking-widest font-black text-white/40 block mb-1">Hora Salida</label>
            <input
              type="time"
              value={formData.hora_salida}
              onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
              className="w-full bg-zinc-700 border border-white/10 focus:border-gold outline-none rounded px-3 py-2 text-white text-[10px]"
            />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-widest font-black text-white/40 block mb-1">Hora Regreso</label>
            <input
              type="time"
              value={formData.hora_regreso}
              onChange={(e) => setFormData({ ...formData, hora_regreso: e.target.value })}
              className="w-full bg-zinc-700 border border-white/10 focus:border-gold outline-none rounded px-3 py-2 text-white text-[10px]"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-widest font-black text-white/40 block mb-1">Cupos</label>
          <input
            type="number"
            value={formData.cupos}
            onChange={(e) => setFormData({ ...formData, cupos: parseInt(e.target.value) || 6 })}
            min="1"
            className="w-full bg-zinc-700 border border-white/10 focus:border-gold outline-none rounded px-3 py-2 text-white text-[10px]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 bg-gold text-black py-2 rounded font-black uppercase tracking-widest text-[9px] hover:bg-white transition-all disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-700 text-white py-2 rounded font-black uppercase tracking-widest text-[9px] hover:bg-zinc-600 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-zinc-500 text-sm text-center py-20">Cargando expediciones...</div>;
  if (error) return <div className="text-red-400 text-sm text-center py-20">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-xl uppercase tracking-tighter">
          Expediciones <span className="text-zinc-600 font-light">({items.length})</span>
        </h2>
        <button onClick={openNew} className="bg-gold text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
          + Nueva
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 flex gap-4 items-start">
            {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 opacity-80" />}
            <div className="flex-1 min-w-0">
              <span className="text-gold text-[9px] uppercase tracking-widest font-black">{item.category}</span>
              <h3 className="text-white font-black text-sm truncate">{item.title}</h3>
              <p className="text-zinc-500 text-[10px] mt-1">
                {item.price ? `$ ${Number(item.price).toLocaleString("es-AR")}` : "Consultar"}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="text-zinc-500 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors">Editar</button>
              <button onClick={() => remove(item.id)} className="text-zinc-700 hover:text-red-500 text-[10px] font-black transition-colors">✕</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black uppercase tracking-tighter">
                {editing.id ? "Editar" : "Nueva"} Expedición
              </h3>
              <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white text-xl leading-none">✕</button>
            </div>

            {[
              { label: "Título", key: "title", placeholder: "Ej: Delta Premium" },
              { label: "Categoría", key: "category", placeholder: "Ej: Exclusivo, Aventura..." },
              { label: "Descripción", key: "description", placeholder: "Descripción del paquete" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-1">{label}</label>
                <input
                  value={(editing as any)[key] ?? ""}
                  onChange={(e) => setEditing((ed) => ed ? { ...ed, [key]: e.target.value } : ed)}
                  placeholder={placeholder}
                  className="w-full bg-zinc-800 border border-white/10 focus:border-gold outline-none rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-1">Imagen Principal</label>
              <ImageUploader
                onUpload={(url) => setEditing((ed) => ed ? { ...ed, image: url } : ed)}
                currentImage={editing.image}
                folder="expediciones"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-1">Galería de Imágenes</label>
              <div className="space-y-3">
                <ImageUploader
                  onUpload={(url) => {
                    const currentGallery = editing.gallery ? editing.gallery.split(',').filter(Boolean) : [];
                    const newGallery = [...currentGallery, url].join(', ');
                    setEditing((ed) => ed ? { ...ed, gallery: newGallery } : ed);
                  }}
                  folder="expediciones/galeria"
                  className="border-2 border-dashed border-white/20 rounded-lg p-4"
                />
                {editing.gallery && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-white/40">Imágenes en galería:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {editing.gallery.split(',').filter(Boolean).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url.trim()}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            onClick={() => {
                              const currentGallery = editing.gallery ? editing.gallery.split(',').filter(Boolean) : [];
                              const newGallery = currentGallery.filter((_, i) => i !== index).join(', ');
                              setEditing((ed) => ed ? { ...ed, gallery: newGallery } : ed);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            type="button"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block mb-1">Precio (ARS) — dejar vacío = Consultar</label>
              <input
                value={editing.price ?? ""}
                onChange={(e) => setEditing((ed) => ed ? { ...ed, price: e.target.value === "" ? null : Number(e.target.value) } : ed)}
                placeholder="Ej: 85000"
                type="text"
                inputMode="numeric"
                className="w-full bg-zinc-800 border border-white/10 focus:border-gold outline-none rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 transition-colors"
              />
            </div>

            {/* Horarios de salida */}
            {editing && (
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-black text-white/40">Horarios de salida</span>
                  <button
                    type="button"
                    onClick={() => setShowHorarioForm(!showHorarioForm)}
                    className="text-[9px] uppercase tracking-widest font-black text-gold hover:text-yellow-400 transition-colors"
                  >
                    + Agregar horario
                  </button>
                </div>

                {/* Lista de horarios actuales */}
                <HorariosList expedicionId={editing.id!} onUpdate={loadHorarios} />

                {/* Formulario para nuevo horario */}
                {showHorarioForm && (
                  <HorarioForm 
                    expedicionId={editing.id!} 
                    onSave={() => {
                      setShowHorarioForm(false);
                      loadHorarios();
                    }}
                    onCancel={() => setShowHorarioForm(false)}
                  />
                )}
              </div>
            )}

            <button
              onClick={submit}
              disabled={saving}
              className="w-full bg-gold text-black py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Expedición"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useMemo, useState } from "react";
import { JON_CONTACT, formatExpedicionPersonalizadaMessage } from "@/lib/constants";
import { useTranslations } from "next-intl";

type FormState = {
  destino: string;
  fechas: string;
  pasajeros: number | null;
  presupuesto: number | null;
  notas: string;
};

const initialState: FormState = {
  destino: "",
  fechas: "",
  pasajeros: null,
  presupuesto: null,
  notas: "",
};

export const CustomExperience = () => {
  const t = useTranslations("custom");
  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    destino: false,
    fechas: false,
    pasajeros: false,
    presupuesto: false,
    notas: false,
  });

  const errors = useMemo(() => {
    const requiredText = (v: string) => v.trim().length === 0;
    const requiredNumber = (v: number | null) => typeof v !== "number" || !Number.isFinite(v);

    return {
      destino: requiredText(form.destino),
      fechas: requiredText(form.fechas),
      pasajeros: requiredNumber(form.pasajeros) || (form.pasajeros ?? 0) < 1,
      presupuesto: requiredNumber(form.presupuesto) || (form.presupuesto ?? 0) < 1,
      notas: requiredText(form.notas),
    };
  }, [form]);

  const hasErrors = Object.values(errors).some(Boolean);

  const buildMessage = () => {
    return formatExpedicionPersonalizadaMessage({
      destino: form.destino.trim(),
      fechas: form.fechas.trim(),
      pasajeros: form.pasajeros!,
      presupuesto: form.presupuesto!,
      notas: form.notas.trim(),
    });
  };

  const submit = () => {
    const allTouched: Record<keyof FormState, boolean> = {
      destino: true,
      fechas: true,
      pasajeros: true,
      presupuesto: true,
      notas: true,
    };

    setTouched(allTouched);

    if (hasErrors) return;

    const message = buildMessage();
    const link = JON_CONTACT.getWhatsAppLink(message);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative z-10 bg-zinc-900/30 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-6">
            <span className="text-gold text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] block opacity-60">
              {t("label")}
            </span>

            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none italic">
              {t("title")}
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed border-l border-white/5 pl-6">
              {t("description")}
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/50 block mb-2">
                  {t("destination_label")}
                </label>
                <input
                  value={form.destino}
                  onChange={(e) => setForm((s) => ({ ...s, destino: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, destino: true }))}
                  className="w-full bg-zinc-800/40 text-white placeholder:text-white/20 border border-white/10 focus:border-gold focus:bg-zinc-800/60 outline-none py-3 px-4 rounded-lg transition-all"
                  placeholder={t("destination_placeholder")}
                  type="text"
                />
                {touched.destino && errors.destino ? (
                  <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-red-500/80">
                    {t("error_destination")}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/50 block mb-2">
                  {t("dates_label")}
                </label>
                <input
                  value={form.fechas}
                  onChange={(e) => setForm((s) => ({ ...s, fechas: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, fechas: true }))}
                  className="w-full bg-zinc-800/40 text-white placeholder:text-white/20 border border-white/10 focus:border-gold focus:bg-zinc-800/60 outline-none py-3 px-4 rounded-lg transition-all"
                  placeholder={t("dates_placeholder")}
                  type="text"
                />
                {touched.fechas && errors.fechas ? (
                  <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-red-500/80">
                    {t("error_dates")}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-white/50 block mb-2">
                  {t("passengers_label")}
                </label>
                <input
                  value={form.pasajeros ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setForm((s) => ({ ...s, pasajeros: null }));
                      return;
                    }
                    if (!/^\d+$/.test(raw)) return;
                    setForm((s) => ({ ...s, pasajeros: Number(raw) }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, pasajeros: true }))}
                  className="w-full bg-zinc-800/40 text-white placeholder:text-white/20 border border-white/10 focus:border-gold focus:bg-zinc-800/60 outline-none py-3 px-4 rounded-lg transition-all"
                  placeholder={t("passengers_placeholder")}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                />
                {touched.pasajeros && errors.pasajeros ? (
                  <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-red-500/80">
                    {t("error_passengers")}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-white/50 block mb-2">
                  {t("budget_label")}
                </label>
                <div className="flex items-end gap-3 border border-white/10 focus-within:border-gold bg-zinc-800/40 focus-within:bg-zinc-800/60 rounded-lg transition-all px-4">
                  <span className="pb-3 text-white/40 text-[10px] uppercase tracking-widest font-black">
                    U$D
                  </span>
                  <input
                    value={form.presupuesto ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") {
                        setForm((s) => ({ ...s, presupuesto: null }));
                        return;
                      }
                      if (!/^\d+$/.test(raw)) return;
                      setForm((s) => ({ ...s, presupuesto: Number(raw) }));
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, presupuesto: true }))}
                    className="w-full bg-transparent text-white placeholder:text-white/20 outline-none py-3"
                    placeholder={t("budget_placeholder")}
                    style={{ backgroundColor: "transparent" }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                </div>
                {touched.presupuesto && errors.presupuesto ? (
                  <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-red-500/80">
                    {t("error_budget")}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/50 block mb-2">
                  {t("message_label")}
                </label>
                <textarea
                  value={form.notas}
                  onChange={(e) => setForm((s) => ({ ...s, notas: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, notas: true }))}
                  className="w-full bg-zinc-800/40 text-white placeholder:text-white/20 border border-white/10 focus:border-gold focus:bg-zinc-800/60 outline-none py-3 px-4 rounded-lg transition-all resize-none min-h-[120px]"
                  placeholder={t("message_placeholder")}
                />
                {touched.notas && errors.notas ? (
                  <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-red-500/80">
                    {t("error_message")}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={submit}
                className="w-full bg-white text-black text-center py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all active:scale-95"
              >
                {t("submit")}
              </button>

              {Object.values(touched).some(Boolean) && hasErrors ? (
                <p className="mt-4 text-white/30 text-[10px] uppercase tracking-widest font-black text-center">
                  {t("fill_all")}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, MessageCircle, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { JON_CONTACT } from "@/lib/constants";

export const ItineraryDrawer = () => {
  const { 
    items, 
    isOpen, 
    toggleItinerary, 
    removeExperience, 
    updateQuantity, 
    getTotalPrice 
  } = useCartStore();

  const handleWhatsApp = () => {
    const message = items
      .map((i) => `• *${i.title}* (Cant: ${i.quantity})`)
      .join("%0A");
    const total = getTotalPrice();
    const text = `Hola Jonco! Estuve armando este itinerario en la web:%0A%0A${message}%0A%0A*Total estimado:* ARS ${total.toLocaleString()}%0A%0A¿Podemos coordinar la disponibilidad?`;
    
    window.open(JON_CONTACT.getWhatsAppLink(text), "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro traslúcido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleItinerary(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Panel Lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-white/10 z-[70] p-8 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Tu Itinerario</h2>
              <button 
                onClick={() => toggleItinerary(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-zinc-500 font-light">No has seleccionado experiencias aún.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <img 
                        src={item.image} 
                        className="h-full w-full object-cover rounded-2xl" 
                        alt={item.title} 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm leading-tight">{item.title}</h4>
                        <button 
                          onClick={() => removeExperience(item.id)} 
                          className="text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-gold"><Minus size={14}/></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-gold"><Plus size={14}/></button>
                        </div>
                        <span className="font-bold text-zinc-300">ARS {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-zinc-500 uppercase text-xs tracking-widest font-bold">Total Estimado</span>
                  <span className="text-3xl font-black tracking-tighter text-gold">
                    ARS {getTotalPrice().toLocaleString()}
                  </span>
                </div>
                
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-gold hover:bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-tighter"
                >
                  <MessageCircle size={22} fill="currentColor" />
                  Consultar Disponibilidad
                </button>
                <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-widest">
                  La reserva se coordina vía WhatsApp
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
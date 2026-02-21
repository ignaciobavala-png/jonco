// src/lib/constants.ts

export const JON_CONTACT = {
  phone: "5491140765354",
  email: "expediciones@jonco.com.ar",
  instagram: "joncoexperience",
  location: "Tigre, Buenos Aires, Argentina",
  coordinates: "-34.4267°S, 58.5796°W",
  getWhatsAppLink: (message: string) => 
    `https://wa.me/5491140765354?text=${encodeURIComponent(message)}`,
};

// WhatsApp message formatting functions
export interface ReservaData {
  title: string;
  category: string;
  price: number;
}

export interface ExpedicionPersonalizadaData {
  destino: string;
  fechas: string;
  pasajeros: number;
  presupuesto: number;
  notas: string;
}

export const formatReservaMessage = (data: ReservaData): string => {
  return `*RESERVA DE EXPEDICION*

* *Expedicion:* ${data.title}
* *Categoria:* ${data.category}
* *Precio:* $${data.price.toLocaleString('es-AR')}/pax

-------------------

Hola! Me interesa reservar esta expedicion. Hay disponibilidad para las proximas fechas?`;
};

export const formatExpedicionPersonalizadaMessage = (data: ExpedicionPersonalizadaData): string => {
  return `*EXPEDICION PERSONALIZADA*

* *Destino:* ${data.destino}
* *Fechas:* ${data.fechas}
* *Pasajeros:* ${data.pasajeros} personas
* *Presupuesto:* $${data.presupuesto.toLocaleString('es-AR')}/pax

-------------------

* *Detalles adicionales:*
${data.notas}

Es posible organizar una expedicion con estas caracteristicas?`;
};
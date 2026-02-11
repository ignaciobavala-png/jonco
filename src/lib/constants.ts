// src/lib/constants.ts

export const JON_CONTACT = {
  phone: "5491140765354",
  getWhatsAppLink: (message: string) => 
    `https://wa.me/5491140765354?text=${encodeURIComponent(message)}`,
};

export const EXPERIENCIAS = [
  {
    id: "delta-premium",
    title: "Experiencia Delta Premium",
    category: "Exclusivo",
    description: "Navegación exclusiva por los canales más profundos del Delta. Una ruta que diseñé para quienes buscan entender el río desde la exclusividad absoluta.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200",
    // Galería añadida para la visualización interna
    gallery: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
    ],
    price: 85000
  },
  {
    id: "atardecer-kayak",
    title: "Atardecer en Kayak",
    category: "Aventura",
    description: "Conecta con la naturaleza mientras remas hacia la puesta del sol. Una travesía por los rincones donde el agua y el cielo se vuelven uno solo.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200"
    ],
    price: 32000
  }
];
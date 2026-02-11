import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Experience {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

// Tipo para la entrada desde el catálogo
export type ExperienceInput = Omit<Experience, 'quantity'>;

interface ItineraryStore {
  items: Experience[];
  isOpen: boolean;
  toggleItinerary: (force?: boolean) => void;
  addExperience: (experience: ExperienceInput) => void;
  removeExperience: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggleItinerary: (force) => set((state) => ({ 
        isOpen: force !== undefined ? force : !state.isOpen 
      })),
      addExperience: (experience) => set((state) => {
        const existing = state.items.find((i) => i.id === experience.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === experience.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          };
        }
        return { items: [...state.items, { ...experience, quantity: 1 }], isOpen: true };
      }),
      removeExperience: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      })),
      getTotalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      getItemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: 'jonco-itinerary-storage' }
  )
);
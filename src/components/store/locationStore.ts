// store/locationStore.ts
import { create } from "zustand";

interface LocationStore {
  selectedLocation: any | null;
  setSelectedLocation: (location: any) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) =>
    set({ selectedLocation: location }),
}));
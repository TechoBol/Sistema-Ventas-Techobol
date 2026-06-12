import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Store {
  fullName: string;
  role: string;
  level: number;
  location: any;
  selectedLocationId: number | null; // ← sucursal seleccionada actualmente
  isLoggedIn: boolean;
  token: string;
  employeeId: number;

  setFullName: (fullName: string) => void;
  setRole: (role: string) => void;
  setLevel: (level: number) => void;
  setLocation: (location: any) => void;
  setSelectedLocationId: (id: number | null) => void; // ← nuevo
  changeLogInState: () => void;
  setToken: (token: string) => void;
  setEmployeeId: (id: number) => void;
}

export const useLoginStore = create<Store>()(
  persist(
    (set, get) => ({
      fullName: '',
      role: '',
      level: 0,
      location: '',
      selectedLocationId: null,
      isLoggedIn: false,
      token: '',
      employeeId: 0,
      setFullName: (fullName) => set({ fullName }),
      setRole: (role) => set({ role }),
      setLevel: (level) => set({ level: Number(level) }),
      setLocation: (location) => set({ location }),
      setSelectedLocationId: (id) => set({ selectedLocationId: id }),
      changeLogInState: () => set({ isLoggedIn: !get().isLoggedIn }),
      setToken: (token) => set({ token }),
      setEmployeeId: (id) => set({ employeeId: id }),
    }),
    { name: 'login-storage' }
  )
)
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  username: string | null;
  login: (userId: number, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      username: null,
      login: (userId: number, username: string) => set({ isAuthenticated: true, userId, username }),
      logout: () => set({ isAuthenticated: false, userId: null, username: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export async function checkAuthStatus(): Promise<boolean> {
  // Retrieve from zustand store which is synced with localStorage
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  return isAuthenticated;
} 
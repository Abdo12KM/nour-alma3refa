import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createCookieStorage } from "./cookie-storage";

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  username: string | null;
  login: (userId: number, username: string) => void;
  logout: () => void;
}

// Add a simple check for browser environment
const isBrowser = typeof window !== "undefined";

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      username: null,

      login: (userId: number, username: string) => {
        set({ isAuthenticated: true, userId, username });
      },

      logout: () => {
        set({ isAuthenticated: false, userId: null, username: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => createCookieStorage()),
    }
  )
);

// Helper to check auth status safely in both client and server contexts
export function checkAuthStatus(): boolean {
  if (!isBrowser) return false;

  try {
    return useAuthStore.getState().isAuthenticated;
  } catch (error) {
    return false;
  }
}

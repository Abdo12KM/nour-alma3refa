import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NavigationState {
  twoClickEnabled: boolean;
  toggleTwoClick: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      twoClickEnabled: true, // Default to two-click navigation
      toggleTwoClick: () =>
        set((state) => ({ twoClickEnabled: !state.twoClickEnabled })),
    }),
    {
      name: "navigation-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

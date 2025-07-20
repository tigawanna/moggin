
import { updateWakatimeKey } from "@/lib/datastore/wakatime-widget-key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsStoreType = {
  theme: "dark" | "light" | null;
  localBackupPath: string | null;
  dynamicColors: boolean;
  wakatimeApiKey: string | null;
  lastBackup: Date | null;
  // Actions
  toggleDynamicColors: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light" | null) => void;
  setWakatimeApiKey: (key: string | null) => void;
  setLocalBackupPath: (path: string | null) => void;
  setLastBackup: (date: Date | null) => void;
};

export const useSettingsStore = create<SettingsStoreType>()(
  persist(
    (set, get) => ({
      // State
      theme: null,
      localBackupPath: null,
      dynamicColors: true,
      wakatimeApiKey: null,
      lastBackup: null,
      
      // Actions
      toggleDynamicColors: () => {
        set({ dynamicColors: !get().dynamicColors });
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === "light" ? "dark" : "light" });
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
      
      setWakatimeApiKey: (key) => {
        set({ wakatimeApiKey: key });
        updateWakatimeKey(key);
      },
      
      setLocalBackupPath: (path) => {
        set({ localBackupPath: path });
      },
      
      setLastBackup: (date) => {
        set({ lastBackup: date });
      },
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook for theme-specific functionality
export function useThemeStore() {
  const colorScheme = useColorScheme();
  const { theme, setTheme, toggleTheme } = useSettingsStore();
  
  const resolvedTheme = theme ?? colorScheme;
  const isDarkMode = resolvedTheme === "dark";
  
  return { 
    theme: resolvedTheme, 
    setTheme, 
    toggleTheme, 
    isDarkMode 
  };
}

// Hook for API keys with query invalidation
export function useApiKeysStore() {
  const { wakatimeApiKey, setWakatimeApiKey: setKey } = useSettingsStore();
  const queryClient = useQueryClient();

  const setWakatimeApiKey = (value: string | null) => {
    setKey(value);
    
    // Invalidate all wakatime queries when API key changes
    queryClient.invalidateQueries({
      queryKey: ["wakatime-current-user"],
    });
    queryClient.invalidateQueries({
      queryKey: ["wakatime-leaderboard"],
    });
    queryClient.invalidateQueries({
      queryKey: ["wakatime-duration"],
    });
  };

  return {
    wakatimeApiKey,
    setWakatimeApiKey,
  };
}


// Hook for persistence status (Zustand doesn't have direct equivalent, but this provides compatibility)
export function usePersistenceLoaded() {
  // In Zustand, we can consider persistence loaded when the store has been rehydrated
  // This is a simplified version - you might want to add more sophisticated tracking if needed
  const hasHydrated = useSettingsStore.persist?.hasHydrated?.() ?? true;
  return hasHydrated;
}

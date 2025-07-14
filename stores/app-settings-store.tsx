
import { updateWakatimeKey } from "@/lib/datastore/wakatime-widget";
import { observable, syncState } from "@legendapp/state";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { use$ } from "@legendapp/state/react";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useColorScheme } from "react-native";

type SettingsStoreType = {
  theme: "dark" | "light" | null;
  localBackupPath: string | null;
  dynamicColors: boolean;
  wakatimeApiKey: string | null;
  toggleDynamicColors: () => void;
  toggleTheme: () => void;
  lastBackup: Date | null;
};

// Observables can be primitives or deep objects
export const settings$ = observable<SettingsStoreType>({
  theme: null,
  localBackupPath: null,
  dynamicColors: true,
  wakatimeApiKey: null,
  toggleDynamicColors: () => {
    settings$.dynamicColors.set(!settings$.dynamicColors.get());
  },
  toggleTheme: () => {
    settings$.theme.set(settings$.theme.get() === "light" ? "dark" : "light");
  },
  lastBackup: null,
});

// Configure AsyncStorage persistence
const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage
    })
  }
});

syncObservable(settings$, persistOptions({
  persist: {
    name: "app-settings",
  },
}));

export function useSettingsStore() {
  const settings = use$(() => settings$.get());
  const updateSettings = (value: Partial<SettingsStoreType>) => {
    settings$.set({ ...settings, ...value });
  };
  return { settings, updateSettings };
}

export function useThemeStore() {
  const colorScheme = useColorScheme();
  const theme = use$(() => settings$.theme.get()) ?? colorScheme;
  const setTheme = (value: SettingsStoreType["theme"]) => {
    settings$.theme.set(value);
  };
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const isDarkMode = theme === "dark";
  return { theme, toggleTheme, isDarkMode };
}

export function useApiKeysStore() {
  const wakatimeApiKey = use$(() => settings$.wakatimeApiKey.get());
  const queryClient = useQueryClient();

  const setWakatimeApiKey = (value: string | null) => {
    // const oldKey = wakatimeApiKey;
    settings$.wakatimeApiKey.set(value);
    updateWakatimeKey(value);
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

export function usePersistenceLoaded() {
  const syncState$ = syncState(settings$);
  const isPersistLoaded = use$(() => syncState$.isPersistLoaded.get());
  return isPersistLoaded;
}

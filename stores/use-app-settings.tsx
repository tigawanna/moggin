import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { use$ } from "@legendapp/state/react";
import { syncObservable } from "@legendapp/state/sync";
import { useColorScheme } from "react-native";

type SettingsStoreType = {
  theme: "dark" | "light" | null;
  localBackupPath: string | null;
  dynamicColors: boolean;
  githubApiKey: string | null;
  wakatimeApiKey: string | null;
  spotifyAccessToken: string | null;
  toggleDynamicColors: () => void;
  toggleTheme: () => void;
  lastBackup: Date | null;
};

// Observables can be primitives or deep objects
export const settings$ = observable<SettingsStoreType>({
  theme: null,
  localBackupPath: null,
  dynamicColors: true,
  githubApiKey: null,
  wakatimeApiKey: null,
  spotifyAccessToken: null,
  toggleDynamicColors: () => {
    settings$.dynamicColors.set(!settings$.dynamicColors.get());
  },
  toggleTheme: () => {
    settings$.theme.set(settings$.theme.get() === "light" ? "dark" : "light");
  },
  lastBackup: null,
});

syncObservable(settings$, {
  persist: {
    name: "app-settings",
    plugin: ObservablePersistLocalStorage,
  },
});

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
  const githubApiKey = use$(() => settings$.githubApiKey.get());
  const wakatimeApiKey = use$(() => settings$.wakatimeApiKey.get());
  const spotifyAccessToken = use$(() => settings$.spotifyAccessToken.get());

  const setGithubApiKey = (value: string | null) => {
    settings$.githubApiKey.set(value);
  };

  const setWakatimeApiKey = (value: string | null) => {
    settings$.wakatimeApiKey.set(value);
  };

  const setSpotifyAccessToken = (value: string | null) => {
    settings$.spotifyAccessToken.set(value);
  };

  return {
    githubApiKey,
    wakatimeApiKey,
    spotifyAccessToken,
    setGithubApiKey,
    setWakatimeApiKey,
    setSpotifyAccessToken,
  };
}

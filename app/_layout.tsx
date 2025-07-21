import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GlobalSnackbar } from "@/components/shared/snackbar/GlobalSnackbar";
import { useThemeSetup } from "@/hooks/useThemeSetup";
import { useAppState, useOnlineManager } from "@/lib/tanstack/hooks";
import { useSettingsStore } from "@/stores/app-settings-store";
import { focusManager} from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { asyncStoragePersister, queryClient } from "@/lib/tanstack/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}



export default function RootLayout() {
useOnlineManager();
  useAppState(onAppStateChange);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const dynamicColors = useSettingsStore((state) => state.dynamicColors);
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);


  if (!loaded) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme as any}>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { flex: 1, backgroundColor: "transparent" },
                }}>
                <Stack.Screen name="(provider)" options={{ headerShown: false }} />
              </Stack>
              <GlobalSnackbar />
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

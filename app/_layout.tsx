import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useThemeSetup } from "@/hooks/useThemeSetup";
import { useAppState, useOnlineManager } from "@/lib/tanstack/hooks";
import { useApiKeysStore, useSettingsStore } from "@/stores/use-app-settings";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

import { GlobalSnackbar } from "@/components/shared/snackbar/GlobalSnackbar";
import { getWakatimeCurrrentUser } from "@/utils/api/wakatime";
import { use$ } from "@legendapp/state/react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
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
  
  const { settings } = useSettingsStore();
  const wakatimeApiKey = use$(() => settings?.wakatimeApiKey);
  const { colorScheme, paperTheme } = useThemeSetup(settings.dynamicColors);

  console.log("Wakatime API Key:", wakatimeApiKey);
  if (!loaded) {
    return null;
  }
  const isLoggedIn = !!wakatimeApiKey;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme as any}>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <Stack>
                <Stack.Protected guard={isLoggedIn}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack.Protected>
                <Stack.Protected guard={false}>
                  <Stack.Screen name="/api-keys" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack.Protected>
              </Stack>
              <GlobalSnackbar />
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

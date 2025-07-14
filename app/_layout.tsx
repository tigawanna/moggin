import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GlobalSnackbar } from "@/components/shared/snackbar/GlobalSnackbar";
import { useThemeSetup } from "@/hooks/useThemeSetup";
import { initializeBackgroundTask } from "@/lib/expo-background/tasks";
import { useAppState, useOnlineManager } from "@/lib/tanstack/hooks";
import { useSettingsStore } from "@/stores/app-settings-store";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}
let resolver: (() => void) | null = null;

const promiseResolveWhenAppMounted = new Promise<void>((resolve) => {
  // Resolve the promise when the app is fully mounted
  resolver = resolve;
});

initializeBackgroundTask(promiseResolveWhenAppMounted);

export default function RootLayout() {
  
  useEffect(() => {
    if (resolver) {
      resolver();
      console.log("App mounted, resolver called");
    }
  }, []);


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
  const { colorScheme, paperTheme } = useThemeSetup(settings.dynamicColors);
  // const wakatimeApiKey = use$(() => settings$.wakatimeApiKey.get());

  // if (wakatimeApiKey) {
  //   queryClient.prefetchQuery(wakatimeCurrentUserQueryOptions(wakatimeApiKey));
  // }

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

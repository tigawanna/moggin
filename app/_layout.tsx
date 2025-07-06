import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useSettingsStore } from "@/stores/use-app-settings";
import { useThemeSetup } from "@/hooks/useThemeSetup";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateStatus, Platform } from "react-native";
import { useOnlineManager, useAppState } from "@/lib/tanstack/hooks";

import { getWakatimeCurrrentUser } from "@/utils/api/wakatime";
import { GlobalSnackbar } from "@/components/shared/snackbar/GlobalSnackbar";


const queryClient = new QueryClient();
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function RootLayout() {
  const { settings } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(settings.dynamicColors);
  const wakatimeToken = process.env.EXPO_PUBLIC_WAKATIME_KEY;
  useOnlineManager();
  useAppState(onAppStateChange);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {  
    getWakatimeCurrrentUser({
      token: wakatimeToken  as string,
    }).then((res) => {
      console.log("Wakatime user data:", res.data?.bio);
    }
    ).catch((error) => {
      console.error("Error fetching Wakatime user:", error);
    }
    );
  },[])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme as any}>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <GlobalSnackbar/>
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

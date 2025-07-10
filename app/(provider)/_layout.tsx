import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { wakatimeCurrentUserQueryOptions } from "@/lib/api/wakatime/current-user-hooks";

import { useApiKeysStore, useSettingsStore } from "@/stores/use-app-settings";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function _ProtectedLayout() {
  const {settings} = useSettingsStore();
  // Use the new current user hook
  const { data: currentUserData, isLoading: isCurrentUserLoading,error } = useQuery(
    wakatimeCurrentUserQueryOptions(settings.wakatimeApiKey)
  );

  // Keep splash screen visible while loading user data
  //   useEffect(() => {
  //     if (wakatimeApiKey && !isCurrentUserLoading) {
  //       SplashScreen.hideAsync();
  //     } else if (!wakatimeApiKey) {
  //       SplashScreen.hideAsync();
  //     }
  //   }, [wakatimeApiKey, isCurrentUserLoading]);

  // Show splash screen while loading
    if (settings.wakatimeApiKey && isCurrentUserLoading) {
      return <LoadingFallback/>
    }

  // Determine if user is authenticated
  const isAuthenticated = Boolean(settings.wakatimeApiKey && currentUserData?.data?.data && !error);
  console.log("wakatimeKey,isAuthenticated", settings.wakatimeApiKey,isAuthenticated);
  console.log(" current user.data ==== >> ", currentUserData?.data?.data?.username);
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="/api-keys" options={{ headerShown: false }} />
    </Stack>
  );
}

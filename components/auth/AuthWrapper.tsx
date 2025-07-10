import { useCurrentUser } from "@/lib/api/wakatime/current-user-hooks";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { wakatimeApiKey } = useApiKeysStore();
  const { data: currentUser, isLoading: isCurrentUserLoading, error } = useCurrentUser();

  // Keep splash screen visible while loading user data
  useEffect(() => {
    if (wakatimeApiKey && !isCurrentUserLoading) {
      SplashScreen.hideAsync();
    } else if (!wakatimeApiKey) {
      SplashScreen.hideAsync();
    }
  }, [wakatimeApiKey, isCurrentUserLoading]);

  // Show splash screen while loading
  if (wakatimeApiKey && isCurrentUserLoading) {
    return null; // Keep splash screen visible
  }

  // Determine if user is authenticated
  const isAuthenticated = Boolean(wakatimeApiKey && currentUser?.data && !error);

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={false}>
        <Stack.Screen name="/api-keys" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
    </Stack>
  );
}

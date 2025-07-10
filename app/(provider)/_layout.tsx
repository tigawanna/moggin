import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { useCurrentUser } from "@/lib/api/wakatime/current-user-hooks";

import { useSettingsStore } from "@/stores/use-app-settings";
import { Stack } from "expo-router";

export default function _ProtectedLayout() {
  const {settings} = useSettingsStore();
  // Use the new current user hook
  const { data: currentUserData, isLoading: isCurrentUserLoading, error } = useCurrentUser();

  // Keep splash screen visible while loading user data
  //   useEffect(() => {
  //     if (wakatimeApiKey && !isCurrentUserLoading) {
  //       SplashScreen.hideAsync();
  //     } else if (!wakatimeApiKey) {
  //       SplashScreen.hideAsync();
  //     }
  //   }, [wakatimeApiKey, isCurrentUserLoading]);

  // Show splash screen while loading user data initially
  if (settings.wakatimeApiKey && isCurrentUserLoading && !currentUserData) {
    return <LoadingFallback/>
  }

  // Determine if user is authenticated
  // Only check authentication status when we have data or an error (not during refetch)
  const hasValidUserData = currentUserData?.data?.data?.username;
  const isAuthenticated = Boolean(settings.wakatimeApiKey && hasValidUserData && !error);
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="/api-keys" options={{ headerShown: false }} />
    </Stack>
  );
}

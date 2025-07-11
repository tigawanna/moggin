import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";

import { useSettingsStore } from "@/stores/use-app-settings";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  const { settings } = useSettingsStore();
  const wakatimeKey = settings.wakatimeApiKey;
  const {
    data: currentUserData,
    isLoading: isCurrentUserLoading,
    error,
  } = useCurrentUser(wakatimeKey);

  if (isCurrentUserLoading && !currentUserData) {
    return <LoadingFallback />;
  }

  const hasValidUserData = currentUserData?.data?.data?.username;
  const isAuthenticated = Boolean(hasValidUserData && !error);
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="api-keys" options={{ headerShown: true }} />
    </Stack>
  );
}

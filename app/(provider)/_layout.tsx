import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { useCurrentUser } from "@/lib/api/wakatime/current-user-hooks";

import { useSettingsStore } from "@/stores/use-app-settings";
import { Stack } from "expo-router";

export default function _ProtectedLayout() {
  const { settings } = useSettingsStore();

  const { data: currentUserData, isLoading: isCurrentUserLoading, error } = useCurrentUser();

  if (settings.wakatimeApiKey && isCurrentUserLoading && !currentUserData) {
    return <LoadingFallback />;
  }

  const hasValidUserData = currentUserData?.data?.data?.username;
  const isAuthenticated = Boolean(settings.wakatimeApiKey && hasValidUserData && !error);
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="api-keys" options={{ headerShown: true }} />
    </Stack>
  );
}

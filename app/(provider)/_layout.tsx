import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";

import { useSettingsStore } from "@/stores/app-settings-store";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  const wakatimeApiKey = useSettingsStore((state) => state.wakatimeApiKey);
  const {
    data: currentUserData,
    isLoading: isCurrentUserLoading,
    error,
  } = useCurrentUser(wakatimeApiKey);

  if (isCurrentUserLoading && !currentUserData) {
    return <LoadingFallback initialScreen/>;
  }
  // console.log("Current user data in layout:", currentUserData?.data?.data?.username);

  const hasValidUserData = currentUserData?.data?.data?.username;
  // console.log("Has valid user data:", hasValidUserData);
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

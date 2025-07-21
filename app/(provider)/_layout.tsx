import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";
import { useSettingsStore } from "@/stores/app-settings-store";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import * as Network from "expo-network";
import { useQuery } from "@tanstack/react-query";

export default function ProtectedLayout() {
  const { colors } = useTheme();
  const wakatimeApiKey = useSettingsStore((state) => state.wakatimeApiKey);
  const {
    data: currentUserData,
    isLoading: isCurrentUserLoading,
    error,
  } = useCurrentUser(wakatimeApiKey);

  const { data: isOnline, isPending: isOnlineLoading } = useQuery({
    queryKey: ["network-status"],
    queryFn: () => Network.getNetworkStateAsync().then((state) => state.isConnected),
  });

  if ((isCurrentUserLoading && !currentUserData) || isOnlineLoading) {
    return <LoadingFallback initialScreen />;
  }
  // console.log("Current user data in layout:", currentUserData?.data?.data?.username);

  const hasValidUserData = currentUserData?.data?.data?.username;
  // console.log("Has valid user data:", hasValidUserData);
  const isAuthenticated = Boolean(hasValidUserData && !error);
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="[user]"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: colors.surface,
            },
          }}
        />
      </Stack.Protected>
      <Stack.Screen name="api-keys" options={{ headerShown: true }} />
    </Stack>
  );
}

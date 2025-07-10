import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { useCurrentUser } from "@/lib/api/wakatime/current-user-hooks";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function _ProtectedLayout() {
  const { wakatimeApiKey } = useApiKeysStore();
  const { data: currentUser, isLoading: isCurrentUserLoading, error } = useCurrentUser();

  // Keep splash screen visible while loading user data
//   useEffect(() => {
//     if (wakatimeApiKey && !isCurrentUserLoading) {
//       SplashScreen.hideAsync();
//     } else if (!wakatimeApiKey) {
//       SplashScreen.hideAsync();
//     }
//   }, [wakatimeApiKey, isCurrentUserLoading]);

  // Show splash screen while loading
//   if (wakatimeApiKey && isCurrentUserLoading) {
//     return <LoadingFallback/>
//   }

  // Determine if user is authenticated
  const isAuthenticated = Boolean(wakatimeApiKey && currentUser?.data && !error);
  console.log("wakatimeKey,isAuthenticated", wakatimeApiKey,isAuthenticated);
  console.log(" current user.data ==== >> ", currentUser?.data?.email, currentUser?.data?.id);
  return (
    <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="/api-keys" options={{ headerShown: false }} /> */}
      {/* <Stack.Protected guard={isAuthenticated}>
      </Stack.Protected>
      <Stack.Protected guard={false}>

      </Stack.Protected> */}
    </Stack>
  );
}

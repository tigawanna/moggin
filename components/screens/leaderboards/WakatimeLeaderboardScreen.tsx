import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LeaderBoardList } from "./components/LeaderBoardList";

export function WakatimeLeaderboardScreen() {
  const { wakatimeApiKey } = useApiKeysStore();

  // Get current user data for default country
  const { data: currentUserData } = useCurrentUser(wakatimeApiKey);

  const [selectedCountry] = useState<string | null>(
    currentUserData?.data?.data?.city?.country_code ?? null
  );

  return (
    <View style={styles.container}>
      {/* <CurrentUserLeaderboardStannnding /> */}
      <LeaderBoardList selectedCountry={selectedCountry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, Surface, Text } from "react-native-paper";
import { GithubApiKey } from "./GithubApiKey";
import { SpotifyAccessToken } from "./SpotifyAccessToken";
import { WakatimeApiKey } from "./WakatimeApiKey";

export function ApiKeysSeettings() {
  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text variant="bodyMedium" style={styles.description}>
          Add your API keys to connect to external services. These keys are stored securely on your
          device.
        </Text>

        {/* GitHub API Key Component */}
        <GithubApiKey />

        <Divider style={styles.divider} />

        {/* Wakatime API Key Component */}
        <WakatimeApiKey />

        <Divider style={styles.divider} />

        {/* Spotify Access Token Component */}
        <SpotifyAccessToken />

        {/* Add extra padding at bottom to ensure content remains visible when keyboard is open */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    padding: 16,
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
});

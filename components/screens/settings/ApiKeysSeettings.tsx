import { ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { WakatimeApiKey } from "./WakatimeApiKey";

export function ApiKeysSeettings() {
  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text variant="bodyMedium" style={styles.description}>
          Add your Wakatime API key to track your coding activity and view detailed statistics.
        </Text>

        {/* Wakatime API Key Component */}
        <WakatimeApiKey />

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
});

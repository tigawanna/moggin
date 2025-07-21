import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, Surface, Text } from "react-native-paper";
import { WakatimeApiKey } from "./WakatimeApiKey";

export function ApiKeysSeettings() {
  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Wakatime Section */}
        <Text variant="titleLarge" style={styles.title}>
          WakaTime API Key
        </Text>
        <Divider style={styles.divider} />
        <WakatimeApiKey />
        <Divider style={styles.divider} />
        <Card style={styles.apiCard} mode="contained">
          <Card.Content style={styles.cardContent}>
            <View style={styles.apiHeader}>
              <Text variant="titleLarge" style={styles.apiTitle}>
                🕐 WakaTime Integration
              </Text>
              <Text variant="bodySmall" style={styles.apiSubtitle}>
                Track your coding time and productivity
              </Text>
            </View>

            <View style={styles.featuresList}>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Detailed coding statistics and insights
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Language and project breakdown
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Global leaderboards and rankings
              </Text>
              <Text variant="bodySmall" style={styles.featureItem}>
                • Daily and weekly activity tracking
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Future API Cards Placeholder */}
        {/* <Card style={styles.comingSoonCard} mode="outlined">
          <Card.Content style={styles.cardContent}>
            <View style={styles.comingSoonHeader}>
              <Text variant="titleMedium" style={styles.comingSoonTitle}>
                🚀 More Integrations Coming Soon
              </Text>
              <Text variant="bodySmall" style={styles.comingSoonSubtitle}>
                We're working on adding support for more services
              </Text>
            </View>
            
            <View style={styles.upcomingList}>
              <Text variant="bodySmall" style={styles.upcomingItem}>
                📊 GitHub Statistics
              </Text>
              <Text variant="bodySmall" style={styles.upcomingItem}>
                🎵 Spotify Activity
              </Text>
              <Text variant="bodySmall" style={styles.upcomingItem}>
                💼 LinkedIn Profile
              </Text>
            </View>
          </Card.Content>
        </Card> */}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  headerSection: {
    marginBottom: 4,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
  },
  divider: {
    marginBottom: 24,
    opacity: 0.3,
  },
  apiCard: {
    marginBottom: 16,
    elevation: 2,
  },
  comingSoonCard: {
    marginBottom: 16,
    opacity: 0.8,
  },
  cardContent: {
    padding: 20,
  },
  apiHeader: {
    marginBottom: 16,
  },
  apiTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  apiSubtitle: {
    opacity: 0.7,
    fontStyle: "italic",
  },
  featuresList: {
    marginBottom: 20,
    paddingLeft: 8,
  },
  featureItem: {
    marginBottom: 4,
    opacity: 0.8,
    lineHeight: 18,
  },
  comingSoonHeader: {
    marginBottom: 12,
    alignItems: "center",
  },
  comingSoonTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  comingSoonSubtitle: {
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },
  upcomingList: {
    alignItems: "center",
  },
  upcomingItem: {
    marginBottom: 6,
    opacity: 0.6,
    textAlign: "center",
  },
  bottomSpacing: {
    height: 120,
  },
});

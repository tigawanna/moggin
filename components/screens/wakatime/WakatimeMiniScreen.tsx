import { WakatimeSDK } from "@/lib/api/wakatime/wakatime-sdk";
import { useSettingsStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { useWakatimeDailyDuaration } from "./use-wakatime-mini";
import { WakatimeWeeklyChart } from "./WakatimeWeeklyChart";

// const { width: screenWidth } = Dimensions.get('window');

export function WakatimeMiniScreen() {
  const { settings } = useSettingsStore();
  const { wakatimeApiKey } = settings;
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const router = useRouter();
  const { colors } = useTheme();

  // Get current user data
  const { data: currentUserData } = useQuery({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) return null;
      const sdk = new WakatimeSDK(wakatimeApiKey);
      const result = await sdk.getCurrentUser();
      return result.data?.data;
    },
    enabled: !!wakatimeApiKey,
  });

  // Wakatime query using the durations endpoint
  const { data: wakatimeData, isLoading: wakatimeLoading } = useWakatimeDailyDuaration({
    selectedDate,
    wakatimeApiKey,
  });

  // Prepare chart data for the last 5 days
  // const chartData = lastFiveDays.map((day, index) => {
  //   // For demo purposes, generate some sample data
  //   // In real implementation, you'd get this from your wakatime data
  //   const baseHours = parseFloat(wakatimeData?.todayHours || "2") || 2;
  //   const variance = Math.random() * 2 - 1; // Random variance between -1 and 1
  //   const hours = Math.max(0, baseHours + variance + (index * 0.5));

  //   return {
  //     x: day.label,
  //     y: hours,
  //     date: day.value
  //   };
  // }).reverse(); // Reverse to show chronologically

  // If no API key is configured, show the add API key prompt
  if (!wakatimeApiKey) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              Wakatime Stats
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            Add your Wakatime API key in settings to see stats
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained-tonal" onPress={() => router.push("/api-keys")} icon="key">
            Add API Key
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // If loading, show the loading state
  if (wakatimeLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              Wakatime Stats
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            Loading stats...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // If no data available
  if (!wakatimeData) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              Wakatime Stats
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            No data available for this date
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text" onPress={() => router.push("/wakatime")} icon="arrow-right">
            View Details
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // Show data when everything is available
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text variant="titleMedium" style={{ fontSize: 20, fontWeight: 'bold' }}>
              Wakatime Stats
            </Text>
            {currentUserData?.display_name && (
              <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 2 }}>
                Welcome, {currentUserData.display_name}
              </Text>
            )}
          </View>
        </View>

        {/* Chart showing last 5 days */}
        <WakatimeWeeklyChart selectedDate={selectedDate} wakatimeApiKey={wakatimeApiKey} />

        <View style={styles.statsContainer}>
          <View style={styles.mainStatContainer}>
            <Text variant="headlineMedium" style={styles.hoursValue}>
              {wakatimeData.todayHours}
            </Text>
            <Text variant="bodySmall" style={styles.todayLabel}>
              Today&apos;s coding time
            </Text>
          </View>
          
          <View style={styles.secondaryStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="code-tags" size={16} color={colors.primary} />
              <Text variant="bodySmall" style={styles.statText}>
                {wakatimeData.totalDurations} sessions
              </Text>
            </View>
            {wakatimeData.currentProject && (
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="folder-outline" size={16} color={colors.primary} />
                <Text variant="bodySmall" style={styles.statText}>
                  {wakatimeData.currentProject}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" onPress={() => router.push("/wakatime")} icon="arrow-right">
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 2,
    marginBottom: 2,
    paddingVertical: 12,
    elevation: 4,
  },
  dateSelector: {
    width: "100%",
    marginBottom: 12,
  },
  simpleChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 200,
    paddingHorizontal: 16,
    gap: 4,
    width: "100%",
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  chartBarLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
  },
  chartBarContainer: {
    height: 60,
    width: 16,
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  chartBarProgress: {
    height: "100%",
    width: 16,
    gap: 4,
    margin: 2,
    transform: [{ rotate: "-90deg" }],
    transformOrigin: "center",
  },
  chartBarValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  statsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  mainStatContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  hoursValue: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  todayLabel: {
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
  secondaryStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    opacity: 0.8,
    fontSize: 13,
  },
});

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { useWakatimeDailyDuaration } from "../use-wakatime-mini";
import { useSettingsStore } from "@/stores/use-app-settings";
import { useState } from "react";
import { useRouter } from "expo-router";

interface TodayActivityCardProps {
  date?: string;
}

export function TodayActivityCard({ date }: TodayActivityCardProps) {
  const { settings } = useSettingsStore();
  const { wakatimeApiKey } = settings;
  const [selectedDate] = useState(date || new Date().toISOString().split("T")[0]);

  const router = useRouter();
  const { colors } = useTheme();
  // Wakatime query using the durations endpoint
  const { data: wakatimeData, isLoading: wakatimeLoading } = useWakatimeDailyDuaration({
    selectedDate,
    wakatimeApiKey,
  });

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
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        gap: 8,
        paddingVertical: 16,
        padding: 16,
      }}>
      <Text
        variant="bodyLarge"
        style={{
          width: "100%",
          fontSize: 35,
          fontWeight: "bold",
        }}>
        Today: {wakatimeData.todayHours}
      </Text>
      <Text variant="bodyMedium" style={{ opacity: 0.7, width: "100%" }}>
        {wakatimeData.totalDurations} coding sessions
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontWeight: "bold",
  },
  summaryContainer: {
    alignItems: "center",
    paddingVertical: 24,
    minHeight: 120, // Prevent layout shift
  },
  totalTime: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 48,
  },
  totalLabel: {
    opacity: 0.7,
    marginTop: 8,
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    opacity: 0.6,
    paddingVertical: 16,
  },
  skeleton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
  },
  skeletonTime: {
    width: 200,
    height: 48,
    marginBottom: 8,
  },
  skeletonLabel: {
    width: 150,
    height: 16,
  },
});

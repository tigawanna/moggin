import { useSettingsStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { useWakatimeMiniStats } from "./use-wakatime-mini";

export function WakatimeMiniScreen() {
  const { settings } = useSettingsStore();
  const { wakatimeApiKey } = settings;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const router = useRouter();
  const { colors } = useTheme();
  
  // Get the last five days for the date selector
  const lastFiveDays = Array.from({ length: 5 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const value = date.toISOString().split("T")[0];
    return {
      value,
      label: index === 0 ? "Today" : `${date.getMonth() + 1}/${date.getDate()}`,
    };
  });

  // Wakatime query using the durations endpoint
  const { data: wakatimeData, isLoading: wakatimeLoading } = useWakatimeMiniStats({
    selectedDate,
    wakatimeApiKey
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

  // Show data when everything is available
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={{ marginLeft: 8 }}>
            Wakatime Stats
          </Text>
        </View>
        
        <View style={styles.dateSelector}>
          <SegmentedButtons
            value={selectedDate}
            onValueChange={setSelectedDate}
            buttons={lastFiveDays.map((day) => ({
              value: day.value,
              label: day.label,
            }))}
            style={{ marginBottom: 16 }}
          />
        </View>

        <View style={styles.statsContainer}>
          <Text variant="bodyLarge" style={styles.hoursValue}>
            {wakatimeData.todayHours}
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            {wakatimeData.totalDurations} coding sessions
          </Text>
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
    paddingVertical:12
  },
  dateSelector: {
    width: "100%",
    marginBottom: 12,
  },
  statsContainer: {
    width: "100%", 
    alignItems: "center", 
    gap: 8, 
    paddingVertical: 2
  },
  hoursValue: {
    width: "100%",
    fontSize: 35,
    fontWeight: "bold",
  }
});

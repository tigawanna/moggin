import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { NoDataScreen } from "@/components/shared/state-screens/NoDataScreen";
import { TooManyRequestsScreen } from "@/components/shared/state-screens/TooManyRequestsScreen";
import { UnAuthorizedScreen } from "@/components/shared/state-screens/UnAuthorizedScreen";
import { useRefresh } from "@/hooks/use-refresh";
import { useWakatimeWeeklyStats } from "@/lib/api/wakatime/use-wakatime-durations";
import { useSettingsStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { WakatimeWeeklyChart } from "./components/WakatimeWeeklyChart";

export function WeeklyActivity() {
  const { colors } = useTheme();
  const { settings } = useSettingsStore();
  const { wakatimeApiKey } = settings;
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

  const {
    data: wakatimeData,
    type,
    isLoading,
    message,
  } = useWakatimeWeeklyStats({
    selectedDate,
    wakatimeApiKey,
  });

  const { isRefreshing, refresh } = useRefresh(() => {
    // Add refetch logic here if needed
  });

  if (!wakatimeApiKey) {
    return <Redirect href="/api-keys" />;
  }

  if (isLoading) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <LoadingFallback />
      </ScrollView>
    );
  }

  if (type === "unauthorized") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <UnAuthorizedScreen />
      </ScrollView>
    );
  }

  if (type === "rate_limit_exceeded") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <TooManyRequestsScreen />
      </ScrollView>
    );
  }

  if (!wakatimeData || wakatimeData.length === 0) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <NoDataScreen />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
            <Text variant="titleLarge" style={styles.title}>
              Weekly Coding Activity
            </Text>
          </View>

          <Text variant="bodyMedium" style={styles.subtitle}>
            Your coding hours for the past 5 days
          </Text>
          <WakatimeWeeklyChart wakatimeData={wakatimeData} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    marginLeft: 12,
    fontWeight: "bold",
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 80, // Add padding to account for sticky header
  },
  scrollContent: {
    flex: 1,
  },
  bottomPadding: {
    height: 4,
  },
});

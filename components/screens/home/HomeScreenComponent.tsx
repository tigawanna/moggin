import { useQueryClient } from "@tanstack/react-query";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Surface } from "react-native-paper";

import { TooManyRequestsScreen } from "@/components/shared/TooManyRequestsScreen";
import { useWakatimeDailyDuration } from "@/lib/api/wakatime/use-wakatime-durations";
import { useApiKeysStore, useSettingsStore } from "@/stores/use-app-settings";
import { useState } from "react";
import { TestWidgetUpdate } from "./components/TestWidgetUpdate";
import { Redirect } from "expo-router";
import { UnAuthorizedScreen } from "@/components/shared/UnAuthorizedScreen";
import { NoDataScreen } from "@/components/shared/NoDataScreen";
import { DailyProjects } from "./components/DailyProjects";

export function HomeScreenComponent() {
  const qc = useQueryClient();
  const { wakatimeApiKey } = useApiKeysStore();
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: wakatimeData,refetch } = useWakatimeDailyDuration({
    selectedDate,
    wakatimeApiKey,
  });
  console.log("Wakatime Data:===>", wakatimeData);
  // Simple refresh function - refreshes Wakatime data
  const onRefresh = async () => {
    await refetch();
    qc.invalidateQueries({
      queryKey: ["wakatime-durations"],
    });
    qc.invalidateQueries({
      queryKey: ["wakatime-leaderboard"],
    });
    qc.invalidateQueries({
      queryKey: ["wakatime-current-user"],
    });
  };


  if (!wakatimeApiKey) {
    return <Redirect href="/api-keys" />;
  }

  if (!wakatimeData || wakatimeData.type === "no_data") {
    return <ScrollView
    style={styles.scrollView}
    contentContainerStyle={styles.scrollContent}
    refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
    <NoDataScreen />
  </ScrollView>;
  }
  if (wakatimeData.type === "unauthorized") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        <UnAuthorizedScreen />
      </ScrollView>
    );
  }
  if (wakatimeData.type === "rate_limit_exceeded") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        <TooManyRequestsScreen />
      </ScrollView>
    );
  }

  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        <DailyProjects projects={wakatimeData.allProjects} />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    gap: 4,
  },
  scrollView: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  scrollContent: {
    padding: 4,
  },
  bottomPadding: {
    height: 4,
  },
});

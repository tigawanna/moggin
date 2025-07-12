import { useQueryClient } from "@tanstack/react-query";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Surface } from "react-native-paper";
import { NoDataScreen } from "@/components/shared/state-screens/NoDataScreen";
import { TooManyRequestsScreen } from "@/components/shared/state-screens/TooManyRequestsScreen";
import { UnAuthorizedScreen } from "@/components/shared/state-screens/UnAuthorizedScreen";
import { useWakatimeDailyDuration } from "@/lib/api/wakatime/use-wakatime-durations";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { Redirect, useLocalSearchParams } from "expo-router";
import { DailyProjects } from "./components/DailyProjects";
import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { useRefresh } from "@/hooks/use-refresh";
import { useCurrentWakatimeDate } from "@/hooks/use-current-date";
import { WakatimeDayPicker } from "./components/WakatimeDayPicker";


export function HomeScreenComponent() {
  const { wakatimeApiKey } = useApiKeysStore();
  const { grouped } = useLocalSearchParams<{ grouped: "true" | "false" }>();
  const isGrouped = grouped === "true";
  const {selectedDate} = useCurrentWakatimeDate();

  const {
    data: wakatimeData,
    refetch,
    isLoading,
  } = useWakatimeDailyDuration({
    selectedDate,
    wakatimeApiKey,
  });

  const onRefresh = async () => {
    await refetch();
    // qc.invalidateQueries({
    //   queryKey: ["wakatime-durations"],
    // });
    // qc.invalidateQueries({
    //   queryKey: ["wakatime-leaderboard"],
    // });
    // qc.invalidateQueries({
    //   queryKey: ["wakatime-current-user"],
    // });
  };
  const { isRefreshing, refresh } = useRefresh(onRefresh);

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
  if (!wakatimeApiKey) {
    return <Redirect href="/api-keys" />;
  }

  if (!wakatimeData || wakatimeData.type === "no_data") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <NoDataScreen />
      </ScrollView>
    );
  }
  if (wakatimeData.type === "unauthorized") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <UnAuthorizedScreen />
      </ScrollView>
    );
  }
  if (wakatimeData.type === "rate_limit_exceeded") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <TooManyRequestsScreen />
      </ScrollView>
    );
  }

  // Use the projects based on the grouped state
  const projectsToDisplay = isGrouped ? wakatimeData.groupedProjects : wakatimeData.allProjects;
  return (
    <Surface style={styles.container}>
      <WakatimeDayPicker/>
      <DailyProjects
        projects={projectsToDisplay}
        grouped={isGrouped}
        RefreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      />
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
    flex: 1,
    height: "100%",
    width: "100%",
  },
  bottomPadding: {
    height: 4,
  },
});

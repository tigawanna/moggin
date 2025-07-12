import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { NoDataScreen } from "@/components/shared/state-screens/NoDataScreen";
import { TooManyRequestsScreen } from "@/components/shared/state-screens/TooManyRequestsScreen";
import { UnAuthorizedScreen } from "@/components/shared/state-screens/UnAuthorizedScreen";
import { useCurrentWakatimeDate } from "@/hooks/use-current-date";
import { useRefresh } from "@/hooks/use-refresh";
import { useWakatimeDailyDuration } from "@/lib/api/wakatime/use-wakatime-durations";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { Redirect, useLocalSearchParams } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Surface } from "react-native-paper";
import { DailyProjects } from "./components/DailyProjects";
import { TodayDuration } from "./components/TodayDuration";
import { WakatimeDayPicker } from "./components/WakatimeDayPicker";

export function HomeScreenComponent() {
  const { wakatimeApiKey } = useApiKeysStore();
  const { grouped } = useLocalSearchParams<{ grouped: "true" | "false" }>();
  const isGrouped = grouped === "true";
  const { selectedDate } = useCurrentWakatimeDate();

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
      {/* Sticky Date Picker */}
      <Surface style={styles.stickyHeader} elevation={2}>
        <WakatimeDayPicker />
      </Surface>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <TodayDuration todayHours={wakatimeData} />
        <DailyProjects projects={projectsToDisplay} grouped={isGrouped} />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    position: "absolute",
    maxWidth: "97%",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 80, // Add padding to account for sticky header
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 4,
  },
});

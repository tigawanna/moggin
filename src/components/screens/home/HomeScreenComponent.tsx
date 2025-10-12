import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { NoDataScreen } from "@/components/shared/state-screens/NoDataScreen";
import { TooManyRequestsScreen } from "@/components/shared/state-screens/TooManyRequestsScreen";
import { UnAuthorizedScreen } from "@/components/shared/state-screens/UnAuthorizedScreen";
import { useRefresh } from "@/hooks/use-refresh";
import { useWakatimeDailyDuration } from "@/lib/api/wakatime/use-wakatime-durations";
import { useApiKeysStore } from "@/stores/app-settings-store";
import { getCurrentDateISO } from "@/utils/date";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Surface } from "react-native-paper";
import { CurrentUserLeaderboardStannnding } from "./components/CurrentUserLeaderboardStannnding";
import { DailyProjectsDurations } from "./components/DailyProjectsDurations";
import { TodayDuration } from "./components/TodayDuration";
import { WakatimeDayPicker } from "./components/WakatimeDayPicker";
import { useQueryClient } from "@tanstack/react-query";
import { wakatimeLeaderboardQueryOptions } from "@/lib/api/wakatime/use-leaderboard";
import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";
// import { console } from "inspector";

export function HomeScreenComponent() {
  const qc = useQueryClient();
  const { wakatimeApiKey } = useApiKeysStore();
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useCurrentUser(wakatimeApiKey);
  const { grouped } = useLocalSearchParams<{ grouped: "true" | "false" }>();
  const isGrouped = grouped ? grouped === "true" : true;

  const [selectedDate, setSelected] = useState(getCurrentDateISO());

  qc.prefetchQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: currentUserData?.data?.data?.city?.country_code || undefined,
    })
  );
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
        <WakatimeDayPicker selectedDate={selectedDate} setSelectedDate={setSelected} />
      </Surface>

      {/* Scrollable Content */}
      <ScrollView
        style={[styles.scrollView, { paddingTop: 50 }]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <TodayDuration todayHours={wakatimeData} />
        <CurrentUserLeaderboardStannnding />
        <DailyProjectsDurations projects={projectsToDisplay} grouped={isGrouped} />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  stickyHeader: {
    position: "absolute",
    maxWidth: "95%",
    top: 0,
    left: 15,
    right: 5,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  scrollView: {
    flex: 1,
    // paddingBottom: 20,
    // paddingTop: 80, // Add padding to account for sticky header
  },
  scrollContent: {
    flexGrow: 1,
    // paddingBottom: 20,
  },
  bottomPadding: {
    height: 4,
  },
});

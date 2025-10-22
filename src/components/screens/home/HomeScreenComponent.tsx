import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { NoDataScreen } from "@/components/shared/state-screens/NoDataScreen";
import { TooManyRequestsScreen } from "@/components/shared/state-screens/TooManyRequestsScreen";
import { UnAuthorizedScreen } from "@/components/shared/state-screens/UnAuthorizedScreen";
import { useCurrentUser } from "@/data-access-layer/wakatime/use-current-user";
import { wakatimeLeaderboardQueryOptions } from "@/data-access-layer/wakatime/use-leaderboard";
import { useWakatimeDailyDuration } from "@/data-access-layer/wakatime/use-wakatime-durations";
import { useRefresh } from "@/hooks/use-refresh";
import { useApiKeysStore } from "@/stores/app-settings-store";
import { getCurrentDateISO } from "@/utils/date";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import { Surface } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { CurrentUserLeaderboardStannnding } from "./components/CurrentUserLeaderboardStannnding";
import { DailyProjectsDurations } from "./components/DailyProjectsDurations";
import { TodayDuration } from "./components/TodayDuration";
import { WakatimeDayPicker } from "./components/WakatimeDayPicker";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function HomeScreenComponent() {
  const qc = useQueryClient();
  const [isGrouped, setGrouped] = useState(true);
  const { wakatimeApiKey } = useApiKeysStore();
  const { data: currentUserData } = useCurrentUser(wakatimeApiKey);

  const [selectedDate, setSelected] = useState(getCurrentDateISO());
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const projectsRef = useRef<View>(null);

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

  const listHeight = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  // Calculate approximate height based on item count
  const calculateListHeight = (projects: any[] | undefined) => {
    if (!projects || projects.length === 0) return 0;
    const itemHeight = 150; // Approximate height per project item
    const headerHeight = 50; // Height of the DailyProjectsDurations header
    return projects.length * itemHeight + headerHeight + 20; // +20 for padding
  };

  // Update list height when data changes
  useEffect(() => {
    const projectsToDisplay = isGrouped ? wakatimeData?.groupedProjects : wakatimeData?.allProjects;
    const newHeight = calculateListHeight(projectsToDisplay);

    listHeight.value = withTiming(
      newHeight,
      {
        duration: 400,
        // Only scroll if we're not in the initial load
      },
      (finished) => {
        if (finished) {
          isAnimating.value = false;
        }
      }
    );
  }, [
    isAnimating,
    isGrouped,
    listHeight,
    wakatimeData?.allProjects,
    wakatimeData?.groupedProjects,
  ]);

  const animatedListStyle = useAnimatedStyle(() => ({
    minHeight: listHeight.value,
    opacity: withTiming(isAnimating.value ? 0.7 : 1, { duration: 150 }),
  }));

  const onRefresh = async () => {
    await refetch();
  };

  const scrollToProjects = () => {
    if (projectsRef.current) {
      projectsRef.current.measure((_x, y, _width, height) => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, y - 100),
          animated: true,
        });
      });
    }
  };

  const onToggleGrouped = () => {
    isAnimating.value = true;

    // Use LayoutAnimation for smooth transition
    LayoutAnimation.configureNext({
      duration: 700,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    setGrouped((prev) => !prev);

    // Scroll after a short delay to allow layout to update
    setTimeout(() => {
      scrollToProjects();
    }, 300);
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

  const projectsToDisplay = isGrouped ? wakatimeData.groupedProjects : wakatimeData.allProjects;

  return (
    <Surface style={styles.container}>
      {/* Sticky Date Picker */}
      <View style={styles.stickyHeader}>
        <WakatimeDayPicker selectedDate={selectedDate} setSelectedDate={setSelected} />
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { paddingTop: 50 }]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
        <TodayDuration todayHours={wakatimeData} />
        <CurrentUserLeaderboardStannnding />

        <Animated.View ref={projectsRef} style={animatedListStyle}>
          <DailyProjectsDurations
            projects={projectsToDisplay}
            grouped={isGrouped}
            handleToggleGrouped={onToggleGrouped}
          />
        </Animated.View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomPadding: {
    height: 4,
  },
});

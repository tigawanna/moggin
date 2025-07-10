import { wakatimeLeaderboardQueryOptions } from "@/lib/api/wakatime/leaderboard-hooks";
import { LeaderboardEntry } from "@/lib/api/wakatime/types/leaderboard-types";
import { WakatimeSDK } from "@/lib/api/wakatime/wakatime-sdk";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardItem } from "./LeaderboardItem";
import { getRankColor, getRankIcon } from "./leaderboard-utils";



export function WakatimeLeaderboardScreen() {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user data
  const { data: currentUserData } = useQuery({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) return null;
      const sdk = new WakatimeSDK(wakatimeApiKey);
      const result = await sdk.getCurrentUser();
      return result.data;
    },
    enabled: !!wakatimeApiKey,
  });

  // Get leaderboard data
  const { data: leaderboardData, refetch } = useQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: currentUserData?.data?.location || undefined,
    })
  );

  useEffect(() => {
    if (currentUserData?.data) {
      setCurrentUser(currentUserData.data);
    }
  }, [currentUserData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderLeaderboardItem: ListRenderItem<LeaderboardEntry> = useCallback(({ item: entry, index }) => {
    return (
      <LeaderboardItem
        entry={entry}
        index={index}
        currentUser={currentUser}
        getRankIcon={getRankIcon}
        getRankColor={(rank) => getRankColor(rank, colors.primary)}
      />
    );
  }, [currentUser, colors.primary]);

  const renderHeader = useCallback(() => (
    <LeaderboardHeader
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      currentUser={currentUser}
    />
  ), [selectedPeriod, currentUser]);

  const keyExtractor = useCallback((item: LeaderboardEntry, index: number) => {
    return `${item.user.username}-${item.rank}-${index}`;
  }, []);


  if (!leaderboardData || !leaderboardData.data || leaderboardData.data.length === 0) {
    return (
      <View style={[styles.container, { padding: 16 }]}>
        <Text variant="bodyMedium" style={styles.subtitle}>
          No data available for the selected period.
        </Text>
      </View>
    );
  }


  return (
    <FlatList
      style={styles.container}
      data={leaderboardData?.data}
      renderItem={renderLeaderboardItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.flatListContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
});

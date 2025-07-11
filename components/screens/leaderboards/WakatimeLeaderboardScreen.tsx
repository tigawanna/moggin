
import { LeaderboardEntry } from "@/lib/api/wakatime/types/leaderboard-types";
import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";
import { wakatimeLeaderboardQueryOptions } from "@/lib/api/wakatime/use-leaderboard";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardItem } from "./LeaderboardItem";
import { getRankColor, getRankIcon } from "./leaderboard-utils";



export function WakatimeLeaderboardScreen() {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Use the new current user hook
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useCurrentUser(wakatimeApiKey);

  // Set default country based on current user location
  useEffect(() => {
    if (currentUserData?.data?.status === "success"){
      if (currentUserData?.data.data?.location && !selectedCountry) {
        // Extract country code from location if possible
        const userCountry = extractCountryCode(currentUserData.data.data.location);
        setSelectedCountry(userCountry);
      }
      
    }
  }, [currentUserData, selectedCountry]);

  // Get leaderboard data
  const { data: leaderboardData, refetch } = useQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: selectedCountry || undefined,
    })
  );

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
        currentUser={currentUserData?.data}
        getRankIcon={getRankIcon}
        getRankColor={(rank) => getRankColor(rank, colors.primary)}
      />
    );
  }, [currentUserData?.data, colors.primary]);

  const renderHeader = useCallback(() => (
    <LeaderboardHeader
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
      currentUser={currentUserData?.data}
    />
  ), [selectedPeriod, selectedCountry, currentUserData?.data]);

  const keyExtractor = useCallback((item: LeaderboardEntry, index: number) => {
    return `${item.user.username}-${item.rank}-${index}`;
  }, []);

  // Helper function to extract country code from location string
  const extractCountryCode = (location: string): string | null => {
    // Simple mapping for common countries - you can expand this
    const countryMap: Record<string, string> = {
      'United States': 'US',
      'Canada': 'CA',
      'United Kingdom': 'GB',
      'Germany': 'DE',
      'France': 'FR',
      'Japan': 'JP',
      'Australia': 'AU',
      'Brazil': 'BR',
      'India': 'IN',
      'China': 'CN',
    };
    
    for (const [country, code] of Object.entries(countryMap)) {
      if (location.includes(country)) {
        return code;
      }
    }
    return null;
  };


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

import { LoadingFallback } from '@/components/shared/state-screens/LoadingFallback';
import { NoDataScreen } from '@/components/shared/state-screens/NoDataScreen';
import { TooManyRequestsScreen } from '@/components/shared/state-screens/TooManyRequestsScreen';
import { UnAuthorizedScreen } from '@/components/shared/state-screens/UnAuthorizedScreen';
import { LeaderboardEntry } from '@/lib/api/wakatime/types/leaderboard-types';
import { useCurrentUser } from '@/lib/api/wakatime/use-current-user';
import { wakatimeLeaderboardQueryOptions } from '@/lib/api/wakatime/use-leaderboard';
import { useApiKeysStore } from '@/stores/app-settings-store';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { LeaderboardItem } from './LeaderboardItem';
import { getRankColor, getRankIcon } from './leaderboard-utils';

interface LeaderBoardListProps {
  selectedCountry?: string | null;
}

export function LeaderBoardList({ selectedCountry }: LeaderBoardListProps) {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();
  const [refreshing, setRefreshing] = useState(false);

  // Get current user data (for country fallback and current user info)
  const { 
    data: currentUserData, 
    isLoading: isCurrentUserLoading,
    error: currentUserError 
  } = useCurrentUser(wakatimeApiKey);

  // Use user's default country if no country is provided
  const effectiveCountry = selectedCountry || currentUserData?.data?.data?.city?.country_code || 'KE';

  // Get leaderboard data
  const { 
    data: leaderboardData, 
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
    refetch 
  } = useQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: effectiveCountry,
      page: 1,
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

  const keyExtractor = useCallback((item: LeaderboardEntry, index: number) => {
    return `${item.user.username}-${item.rank}-${index}`;
  }, []);

  // Loading state
  if (isLeaderboardLoading || isCurrentUserLoading) {
    return <LoadingFallback />;
  }

  // Error handling for specific data response types
  if (leaderboardData && 'type' in leaderboardData) {
    if (leaderboardData.type === "unauthorized") {
      return <UnAuthorizedScreen />;
    }
    if (leaderboardData.type === "rate_limit_exceeded") {
      return <TooManyRequestsScreen />;
    }
    if (leaderboardData.type === "no_data") {
      return <NoDataScreen />;
    }
  }

  // Error handling for query errors
  if (leaderboardError || currentUserError) {
    const error = leaderboardError || currentUserError;
    
    // Check for 401 Unauthorized
    if (error && 'status' in error && error.status === 401) {
      return <UnAuthorizedScreen />;
    }
    
    // Check for 429 Rate Limit
    if (error && 'status' in error && error.status === 429) {
      return <TooManyRequestsScreen />;
    }
    
    // Check for string-based error messages
    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message as string;
      if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('401')) {
        return <UnAuthorizedScreen />;
      }
      if (message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('429')) {
        return <TooManyRequestsScreen />;
      }
    }
  }

  // No data state - simplified check
  if (!leaderboardData) {
    return <NoDataScreen />;
  }

  // Extract the actual data - handle both old and new response formats
  let actualData: any = null;
  
  if ('type' in leaderboardData) {
    // New format with error handling
    if (leaderboardData.type === "success" && leaderboardData.data?.data) {
      actualData = leaderboardData.data.data;
    }
  } else {
    // Old format - direct data access
    actualData = (leaderboardData as any)?.data;
  }

  if (!actualData || actualData.length === 0) {
    return <NoDataScreen />;
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        style={styles.container}
        data={actualData}
        renderItem={renderLeaderboardItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </Surface>
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
});

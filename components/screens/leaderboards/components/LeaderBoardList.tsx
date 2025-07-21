import { LoadingFallback } from '@/components/shared/state-screens/LoadingFallback';
import { NoDataScreen } from '@/components/shared/state-screens/NoDataScreen';
import { TooManyRequestsScreen } from '@/components/shared/state-screens/TooManyRequestsScreen';
import { UnAuthorizedScreen } from '@/components/shared/state-screens/UnAuthorizedScreen';
import { LeaderboardEntry } from '@/lib/api/wakatime/types/leaderboard-types';
import { useCurrentUser } from '@/lib/api/wakatime/use-current-user';
import { wakatimeLeaderboardQueryOptions } from '@/lib/api/wakatime/use-leaderboard';
import { useApiKeysStore } from '@/stores/app-settings-store';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import { DataTable, Searchbar, Surface, Text, useTheme } from 'react-native-paper';
import { LeaderboardItem } from './LeaderboardItem';
import { getRankColor, getRankIcon } from './leaderboard-utils';

interface LeaderBoardListProps {
  selectedCountry?: string | null;
}

export function LeaderBoardList({ selectedCountry }: LeaderBoardListProps) {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0); // 0-based for React Native Paper
  const [isPending, startTransition] = useTransition();

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
      page: page + 1, // Convert to 1-based for API
    })
  );

  // Extract the actual data and pagination info - handle both old and new response formats
  const { actualData, totalPages, currentPage } = useMemo(() => {
    if (!leaderboardData) return { actualData: null, totalPages: 0, currentPage: 0 };
    
    if ('type' in leaderboardData) {
      // New format with error handling
      if (leaderboardData.type === "success" && leaderboardData.data?.data) {
        return {
          actualData: leaderboardData.data.data,
          totalPages: leaderboardData.data.total_pages || 0,
          currentPage: (leaderboardData.data.page || 1) - 1, // Convert to 0-based
        };
      }
      return { actualData: null, totalPages: 0, currentPage: 0 };
    } else {
      // Old format - direct data access
      const data = leaderboardData as any;
      return {
        actualData: data?.data || null,
        totalPages: data?.total_pages || 0,
        currentPage: (data?.page || 1) - 1, // Convert to 0-based
      };
    }
  }, [leaderboardData]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!actualData || !searchQuery.trim()) {
      return actualData || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return actualData.filter((entry: LeaderboardEntry) => {
      const user = entry.user;
      
      // Helper function to safely check if a string contains the query
      const containsQuery = (str: string | null | undefined): boolean => {
        return str ? str.toLowerCase().includes(query) : false;
      };
      
      // Search in various fields
      return (
        containsQuery(user.username) ||
        containsQuery(user.display_name) ||
        containsQuery(user.full_name) ||
        (user.is_email_public && containsQuery(user.email)) ||
        containsQuery(user.location)
      );
    });
  }, [actualData, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePageChange = useCallback((newPage: number) => {
    startTransition(() => setPage(newPage));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Reset to first page when search changes
    if (query.trim() !== searchQuery.trim()) {
      setPage(0);
    }
  }, [searchQuery]);

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

  // Reset page when country changes
  useEffect(() => {
    setPage(0);
  }, [effectiveCountry]);

  // All hooks are called above this point - now we can have conditional returns

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
  if (!leaderboardData || !actualData || actualData.length === 0) {
    return <NoDataScreen />;
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="username, name, or email..."
          onChangeText={handleSearchChange}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
        {searchQuery.trim() && (
          <Text variant="bodySmall" style={styles.searchResults}>
            {filteredData.length} of {actualData?.length || 0} results
          </Text>
        )}
      </View>
      {filteredData.length === 0 && searchQuery.trim() ? (
        <View style={styles.noResultsContainer}>
          <Text variant="titleMedium" style={styles.noResultsTitle}>
            No Results Found
          </Text>
          <Text variant="bodyMedium" style={styles.noResultsText}>
            No users match "{searchQuery}". Try a different search term.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          windowSize={5}
          data={filteredData}
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {/* Show pagination only when not searching */}
      {!searchQuery.trim() && totalPages > 1 && (
        <DataTable.Pagination
          page={page}
          numberOfPages={totalPages}
          onPageChange={handlePageChange}
          label={isLeaderboardLoading ? 'Loading...' : `Page ${page + 1} of ${totalPages}`}
          showFastPaginationControls
          style={styles.pagination}
        />
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    fontSize: 16,
  },
  searchResults: {
    marginTop: 4,
    marginLeft: 12,
    opacity: 0.7,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  noResultsTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  flatList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  separator: {
    height: 8,
  },
  pagination: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
});

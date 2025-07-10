
import { useApiKeysStore } from '@/stores/use-app-settings';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

import { formatDuration, useWakatimeStats } from '@/lib/api/wakatime/wakatime-stats-hooks';
import { EditorsAndOSCards } from './EditorsAndOSCards';
import { LanguagesCard } from './LanguagesCard';
import { NoApiKeyCard } from './NoApiKeyCard';
import { ProjectsCard } from './ProjectsCard';
import { TodayActivityCard } from './TodayActivityCard';
import { WeekSummaryCard } from './WeekSummaryCard';

export function WakatimeScreen() {
  const { wakatimeApiKey } = useApiKeysStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    data: stats, 
    isLoading: loading, 
    refetch,
    isError,
    error 
  } = useWakatimeStats();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (!wakatimeApiKey) {
    return <NoApiKeyCard />;
  }

  // Handle error state
  if (isError) {
    console.error('Failed to fetch Wakatime stats:', error);
  }

  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Today's Activity */}
        <TodayActivityCard />

        {/* Week Summary */}
        <WeekSummaryCard 
          stats={stats?.weekStats || null}
          loading={loading}
        />

        {/* Projects Breakdown */}
        <ProjectsCard
          projects={stats?.todayStats?.projects || null}
          loading={loading}
          formatDuration={formatDuration}
        />

        {/* Languages Breakdown */}
        <LanguagesCard
          languages={stats?.todayStats?.languages || null}
          loading={loading}
        />

        {/* Editors & OS */}
        <EditorsAndOSCards
          editors={stats?.todayStats?.editors || null}
          operatingSystems={stats?.todayStats?.operating_systems || null}
          loading={loading}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bottomPadding: {
    height: 24,
  },
});

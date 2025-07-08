import { WakatimeSDK } from '@/lib/api/wakatime/wakatime-sdk';
import { useApiKeysStore } from '@/stores/use-app-settings';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

import { EditorsAndOSCards } from './EditorsAndOSCards';
import { LanguagesCard } from './LanguagesCard';
import { NoApiKeyCard } from './NoApiKeyCard';
import { ProjectsCard } from './ProjectsCard';
import { TodayActivityCard } from './TodayActivityCard';
import { WeekSummaryCard } from './WeekSummaryCard';

type WakatimeDetailStats = {
  todayStats: {
    total_seconds: number;
    human_readable_total: string;
    projects: { name: string; total_seconds: number; percent: number }[];
    languages: { name: string; total_seconds: number; percent: number }[];
    editors: { name: string; total_seconds: number; percent: number }[];
    operating_systems: { name: string; total_seconds: number; percent: number }[];
  } | null;
  weekStats: {
    human_readable_total: string;
    daily_average: string;
  } | null;
};

export function WakatimeScreen() {
  const { wakatimeApiKey } = useApiKeysStore();
  
  const [stats, setStats] = useState<WakatimeDetailStats>({ todayStats: null, weekStats: null });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWakatimeDetails = useCallback(async () => {
    if (!wakatimeApiKey) return;
    
    try {
      const sdk = new WakatimeSDK(wakatimeApiKey);
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [todayResponse, weekResponse] = await Promise.all([
        sdk.getUserStats({ start: today, end: today }),
        sdk.getUserStats({ start: weekAgo, end: today })
      ]);
      
      setStats({
        todayStats: todayResponse.data,
        weekStats: weekResponse.data
      });
    } catch (error) {
      console.error('Failed to fetch Wakatime details:', error);
    }
  }, [wakatimeApiKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWakatimeDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchWakatimeDetails();
      setLoading(false);
    };
    loadData();
  }, [fetchWakatimeDetails]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!wakatimeApiKey) {
    return <NoApiKeyCard />;
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
          stats={stats.weekStats}
          loading={loading}
        />

        {/* Projects Breakdown */}
        <ProjectsCard
          projects={stats.todayStats?.projects || null}
          loading={loading}
          formatDuration={formatDuration}
        />

        {/* Languages Breakdown */}
        <LanguagesCard
          languages={stats.todayStats?.languages || null}
          loading={loading}
        />

        {/* Editors & OS */}
        <EditorsAndOSCards
          editors={stats.todayStats?.editors || null}
          operatingSystems={stats.todayStats?.operating_systems || null}
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

import { useQueryClient } from '@tanstack/react-query';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { WakatimeMiniScreen } from '../wakatime/WakatimeMiniScreen';
import { CurrentUserLeaderboardPosition } from './components/CurrentUserLeaderboardPosition';
import { TooManyRequests } from '@/components/shared/TooManyRequests';
import { useWakatimeDailyDuration } from '@/lib/api/wakatime/use-wakatime-durations';
import { useApiKeysStore, useSettingsStore } from '@/stores/use-app-settings';
import { useState } from 'react';
import { TestWidgetUpdate } from './components/TestWidgetUpdate';

export function HomeScreenComponent() {
  const qc = useQueryClient();
  const { wakatimeApiKey } = useApiKeysStore();
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

 // Simple refresh function - refreshes Wakatime data
  const onRefresh = async () => {
    qc.invalidateQueries({
      queryKey: ['wakatime-durations'],
    });
    qc.invalidateQueries({
      queryKey: ['wakatime-leaderboard'],
    });
    qc.invalidateQueries({
      queryKey: ['wakatime-current-user'],
    });
  };

  const { data: wakatimeData } = useWakatimeDailyDuration({
    selectedDate,
    wakatimeApiKey,
  });

  // if( !wakatimeApiKey) {

  // }

  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <TestWidgetUpdate/>
        <WakatimeMiniScreen />
        <CurrentUserLeaderboardPosition />
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    gap: 4,
  },
  scrollView: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  scrollContent: {
    padding: 4,
  },
  bottomPadding: {
    height: 4,
  },
});

import { useApiKeysStore } from '@/stores/use-app-settings';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { WakatimeMiniScreen } from '../wakatime/WakatimeMiniScreen';
import { CurrentUserLeaderboardPosition } from './CurrentUserLeaderboardPosition';

export function Overview() {
  const qc = useQueryClient();

  const { wakatimeApiKey } = useApiKeysStore();
  const router = useRouter();

  //Redirect to API keys if no Wakatime key is present
  useFocusEffect(() => {
    if (!wakatimeApiKey) {
      router.replace("/api-keys");
    }
  });

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

  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
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

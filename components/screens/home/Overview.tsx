import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { GitHubMiniScreen } from '../github/GitHubMiniScreen';
import { SpotifyMiniScreen } from '../spotify/SpotifyMiniScreen';
import { WakatimeMiniScreen } from '../wakatime/WakatimeMiniScreen';
import { useQueryClient } from '@tanstack/react-query';

export function Overview() {
  const qc = useQueryClient();
  // Simple refresh function - each mini screen handles its own data fetching
  const onRefresh = async () => {
    // Refresh will be handled by individual mini screens
    qc.invalidateQueries({
      queryKey: ['wakatime-stats'],
    })
    qc.invalidateQueries({
      queryKey: ['github-activity'],
    });
    qc.invalidateQueries({
      queryKey: ['spotify-tracks'],
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
        <GitHubMiniScreen />
        <SpotifyMiniScreen />
        
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

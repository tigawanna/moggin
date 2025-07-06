import { useApiKeysStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

export function SpotifyMiniScreen() {
  const { spotifyAccessToken } = useApiKeysStore();
  const router = useRouter();
  const { colors } = useTheme();

  // Spotify query (mock data for now)
  const { data: spotifyData, isLoading: spotifyLoading } = useQuery({
    queryKey: ['spotify-tracks', spotifyAccessToken],
    queryFn: async () => {
      if (!spotifyAccessToken) return null;
      // Mock data - replace with actual Spotify API when implemented
      return {
        tracks: [
          { name: 'Song Title 1', artist: 'Artist 1', album: 'Album 1' },
          { name: 'Song Title 2', artist: 'Artist 2', album: 'Album 2' },
          { name: 'Song Title 3', artist: 'Artist 3', album: 'Album 3' }
        ]
      };
    },
    enabled: !!spotifyAccessToken,
  });

  // If no access token is configured, show the add token prompt
  if (!spotifyAccessToken) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="spotify" size={24} color="#1DB954" />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              Recent Tracks
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            Add your Spotify access token in settings to see tracks
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained-tonal" onPress={() => router.push("/api-keys")} icon="key">
            Add Access Token
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // If loading, show the loading state
  if (spotifyLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="spotify" size={24} color="#1DB954" />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              Recent Tracks
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            Loading tracks...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // If no data available
  if (!spotifyData) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="spotify" size={24} color="#1DB954" />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              Recent Tracks
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            No recent tracks found
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text" onPress={() => router.push("/spotify")} icon="arrow-right">
            View Details
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // Show data when everything is available
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MaterialCommunityIcons name="spotify" size={24} color="#1DB954" />
          <Text variant="titleMedium" style={{ marginLeft: 8 }}>
            Recent Tracks
          </Text>
        </View>

        <View style={styles.statsContainer}>
          {spotifyData.tracks.slice(0, 3).map((track: any, index: number) => (
            <View key={index} style={styles.trackItem}>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "500" }}>{track.name}</Text>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                  {track.artist} • {track.album}
                </Text>
              </View>
              <MaterialCommunityIcons name="music-note" size={20} color={colors.onSurfaceVariant} />
            </View>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" onPress={() => router.push("/spotify")} icon="arrow-right">
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 2,
    marginBottom: 2,
    paddingVertical: 12,
  },
  statsContainer: {
    gap: 8,
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
});

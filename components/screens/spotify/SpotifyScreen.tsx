import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, ProgressBar, Surface, Text, useTheme } from 'react-native-paper';

// Mock types for Spotify data - replace with actual Spotify API types
type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  playedAt: string;
  imageUrl?: string;
};

type SpotifyPlaylist = {
  id: string;
  name: string;
  trackCount: number;
  description?: string;
};

type SpotifyArtist = {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
};

type SpotifyStats = {
  totalMinutesListened: number;
  topGenres: string[];
  totalTracks: number;
  totalPlaylists: number;
};

export function SpotifyScreen() {
  const { colors } = useTheme();
  
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [stats, setStats] = useState<SpotifyStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual Spotify API calls
  const fetchSpotifyData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock recent tracks
    setRecentTracks([
      {
        id: '1',
        name: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: '5:55',
        playedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: '2',
        name: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        album: 'Led Zeppelin IV',
        duration: '8:02',
        playedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: '3',
        name: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        duration: '6:30',
        playedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      },
      {
        id: '4',
        name: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        duration: '3:07',
        playedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      },
      {
        id: '5',
        name: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        album: 'Nevermind',
        duration: '5:01',
        playedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hours ago
      }
    ]);

    // Mock top artists
    setTopArtists([
      {
        id: '1',
        name: 'Queen',
        genres: ['Rock', 'Glam Rock', 'Progressive Rock'],
        popularity: 95
      },
      {
        id: '2',
        name: 'Led Zeppelin',
        genres: ['Rock', 'Hard Rock', 'Blues Rock'],
        popularity: 90
      },
      {
        id: '3',
        name: 'The Beatles',
        genres: ['Rock', 'Pop', 'Psychedelic Rock'],
        popularity: 98
      },
      {
        id: '4',
        name: 'Pink Floyd',
        genres: ['Progressive Rock', 'Psychedelic Rock', 'Art Rock'],
        popularity: 88
      }
    ]);

    // Mock playlists
    setPlaylists([
      {
        id: '1',
        name: 'My Coding Playlist',
        trackCount: 127,
        description: 'Perfect background music for coding sessions'
      },
      {
        id: '2',
        name: 'Classic Rock Hits',
        trackCount: 85,
        description: 'The best classic rock songs of all time'
      },
      {
        id: '3',
        name: 'Chill Vibes',
        trackCount: 43,
        description: 'Relaxing music for unwinding'
      }
    ]);

    // Mock stats
    setStats({
      totalMinutesListened: 2450,
      topGenres: ['Rock', 'Progressive Rock', 'Alternative Rock', 'Indie Rock'],
      totalTracks: 1250,
      totalPlaylists: 12
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSpotifyData();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSpotifyData();
      setLoading(false);
    };
    loadData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatListeningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <Surface style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="spotify" size={48} color="#1DB954" />
          <Text variant="bodyLarge" style={{ marginTop: 16, opacity: 0.7 }}>
            Loading Spotify data...
          </Text>
        </View>
      </Surface>
    );
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
        {/* Connect to Spotify Notice */}
        <Card style={[styles.card, { backgroundColor: colors.primaryContainer }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="information" size={24} color={colors.onPrimaryContainer} />
              <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onPrimaryContainer }]}>
                Spotify Integration
              </Text>
            </View>
            <Text variant="bodyMedium" style={{ color: colors.onPrimaryContainer, opacity: 0.8 }}>
              This is a demo with mock data. To connect your Spotify account and see real data, you&apos;ll need to implement Spotify Web API integration.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained-tonal" 
              icon="spotify"
              buttonColor={colors.onPrimaryContainer}
              textColor={colors.primaryContainer}
            >
              Connect Spotify (Demo)
            </Button>
          </Card.Actions>
        </Card>

        {/* Listening Stats */}
        {stats && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Listening Stats
                </Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Total Listening Time:</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>
                    {formatListeningTime(stats.totalMinutesListened)}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Total Tracks:</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>{stats.totalTracks}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Playlists:</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>{stats.totalPlaylists}</Text>
                </View>
                
                <Text variant="bodyMedium" style={[styles.statLabel, { marginTop: 16, marginBottom: 8 }]}>
                  Top Genres:
                </Text>
                <View style={styles.chipsContainer}>
                  {stats.topGenres.map((genre, index) => (
                    <Chip key={index} mode="outlined" compact style={styles.chip}>
                      {genre}
                    </Chip>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Recent Tracks */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="music-note" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Recently Played
              </Text>
            </View>
            
            <View style={styles.tracksList}>
              {recentTracks.map((track, index) => (
                <View key={track.id}>
                  <View style={styles.trackItem}>
                    <View style={styles.trackInfo}>
                      <Text variant="bodyMedium" style={styles.trackName}>{track.name}</Text>
                      <Text variant="bodySmall" style={styles.trackDetails}>
                        {track.artist} • {track.album}
                      </Text>
                      <Text variant="bodySmall" style={styles.trackMeta}>
                        {track.duration} • {formatTimeAgo(track.playedAt)}
                      </Text>
                    </View>
                    <MaterialCommunityIcons name="play-circle-outline" size={24} color={colors.onSurfaceVariant} />
                  </View>
                  {index < recentTracks.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Top Artists */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="account-music" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Top Artists
              </Text>
            </View>
            
            <View style={styles.artistsList}>
              {topArtists.map((artist, index) => (
                <View key={artist.id}>
                  <View style={styles.artistItem}>
                    <View style={styles.artistInfo}>
                      <Text variant="bodyMedium" style={styles.artistName}>{artist.name}</Text>
                      <View style={styles.chipsContainer}>
                        {artist.genres.slice(0, 2).map((genre, genreIndex) => (
                          <Chip key={genreIndex} mode="outlined" compact style={styles.chip}>
                            {genre}
                          </Chip>
                        ))}
                      </View>
                      <View style={styles.popularityContainer}>
                        <Text variant="bodySmall" style={styles.popularityLabel}>
                          Popularity: {artist.popularity}%
                        </Text>
                        <ProgressBar 
                          progress={artist.popularity / 100} 
                          style={styles.progressBar}
                          color={colors.primary}
                        />
                      </View>
                    </View>
                  </View>
                  {index < topArtists.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Playlists */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="playlist-music" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Your Playlists
              </Text>
            </View>
            
            <View style={styles.playlistsList}>
              {playlists.map((playlist, index) => (
                <View key={playlist.id}>
                  <View style={styles.playlistItem}>
                    <View style={styles.playlistInfo}>
                      <Text variant="bodyMedium" style={styles.playlistName}>{playlist.name}</Text>
                      <Text variant="bodySmall" style={styles.playlistDetails}>
                        {playlist.trackCount} tracks
                      </Text>
                      {playlist.description && (
                        <Text variant="bodySmall" style={styles.playlistDescription}>
                          {playlist.description}
                        </Text>
                      )}
                    </View>
                    <MaterialCommunityIcons name="playlist-play" size={24} color={colors.onSurfaceVariant} />
                  </View>
                  {index < playlists.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    marginRight: 4,
  },
  tracksList: {
    gap: 8,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  trackDetails: {
    opacity: 0.7,
    marginBottom: 2,
  },
  trackMeta: {
    opacity: 0.5,
    fontSize: 12,
  },
  artistsList: {
    gap: 8,
  },
  artistItem: {
    paddingVertical: 8,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontWeight: '500',
    marginBottom: 8,
  },
  popularityContainer: {
    marginTop: 8,
  },
  popularityLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  playlistsList: {
    gap: 8,
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  playlistDetails: {
    opacity: 0.7,
    marginBottom: 2,
  },
  playlistDescription: {
    opacity: 0.5,
    fontSize: 12,
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 8,
  },
  bottomPadding: {
    height: 24,
  },
});

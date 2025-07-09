import { wakatimeLeaderboardQueryOptions } from "@/lib/api/wakatime/leaderboard-hooks";
import { WakatimeSDK } from "@/lib/api/wakatime/wakatime-sdk";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Surface, Text, useTheme } from "react-native-paper";

type LeaderboardEntry = {
  rank: number;
  username: string;
  avatar_url?: string;
  total_seconds: number;
  human_readable_total: string;
  languages: string[];
  country?: string;
  user?: {
    id: string;
    display_name: string;
    photo?: string;
    location?: string;
  };
};

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "codingmaster",
    avatar_url: "https://github.com/codingmaster.png",
    total_seconds: 432000,
    human_readable_total: "120 hrs",
    languages: ["TypeScript", "Python", "Go"],
    country: "USA",
  },
  {
    rank: 2,
    username: "devninja",
    avatar_url: "https://github.com/devninja.png",
    total_seconds: 378000,
    human_readable_total: "105 hrs",
    languages: ["JavaScript", "React", "Node.js"],
    country: "Canada",
  },
  {
    rank: 3,
    username: "pythonista",
    avatar_url: "https://github.com/pythonista.png",
    total_seconds: 324000,
    human_readable_total: "90 hrs",
    languages: ["Python", "Django", "FastAPI"],
    country: "Germany",
  },
  {
    rank: 4,
    username: "rustacean",
    avatar_url: "https://github.com/rustacean.png",
    total_seconds: 270000,
    human_readable_total: "75 hrs",
    languages: ["Rust", "WebAssembly", "C++"],
    country: "Japan",
  },
  {
    rank: 5,
    username: "fullstackdev",
    avatar_url: "https://github.com/fullstackdev.png",
    total_seconds: 216000,
    human_readable_total: "60 hrs",
    languages: ["Vue.js", "PHP", "MySQL"],
    country: "UK",
  },
];

export function WakatimeLeaderboardScreen() {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user data
  const { data: currentUserData } = useQuery({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) return null;
      const sdk = new WakatimeSDK(wakatimeApiKey);
      const result = await sdk.getCurrentUser();
      return result.data;
    },
    enabled: !!wakatimeApiKey,
  });

  // Get leaderboard data
  const { data: leaderboardData, refetch } = useQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: currentUserData?.data?.location || undefined,
    })
  );

  useEffect(() => {
    if (currentUserData?.data) {
      setCurrentUser(currentUserData.data);
    }
  }, [currentUserData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "trophy" as const
      case 2:
        return "medal" as const
      case 3:
        return "medal-outline" as const
      default:
        return "medal" as const;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return colors.primary;
    }
  };

  // If no API key, show message
  if (!wakatimeApiKey) {
    return (
      <ScrollView style={styles.container}>
        <Surface style={styles.header} elevation={0}>
          <Text variant="headlineMedium" style={styles.title}>
            Wakatime Leaderboard
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Please add your Wakatime API key to view the leaderboard
          </Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/api-keys')}
            style={{ marginTop: 16 }}
          >
            Add API Key
          </Button>
        </Surface>
      </ScrollView>
    );
  }

  // Use real data if available, fallback to mock data
  const displayData = leaderboardData?.data || mockLeaderboardData;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>
          Wakatime Leaderboard
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Top coding time this {selectedPeriod}
          {currentUser?.location && ` in ${currentUser.location}`}
        </Text>
      </Surface>

      <Surface style={styles.periodSelector} elevation={0}>
        <View style={styles.periodButtons}>
          <Button
            mode={selectedPeriod === 'week' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('week')}
            style={styles.periodButton}
          >
            This Week
          </Button>
          <Button
            mode={selectedPeriod === 'month' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('month')}
            style={styles.periodButton}
          >
            This Month
          </Button>
          <Button
            mode={selectedPeriod === 'year' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('year')}
            style={styles.periodButton}
          >
            This Year
          </Button>
        </View>
      </Surface>

      {displayData.map((entry: LeaderboardEntry, index: number) => {
        const isCurrentUser = currentUser && (
          entry.user?.id === currentUser.id || 
          entry.username === currentUser.username ||
          entry.user?.display_name === currentUser.display_name
        );
        
        return (
          <Card key={index} style={[
            styles.leaderboardCard,
            isCurrentUser && { borderColor: colors.primary, borderWidth: 2 }
          ]} mode="elevated">
            <Card.Content>
              <View style={styles.entryHeader}>
                <View style={styles.rankContainer}>
                  <MaterialCommunityIcons
                    name={getRankIcon(entry.rank)}
                    size={32}
                    color={getRankColor(entry.rank)}
                  />
                  <Text variant="titleMedium" style={styles.rankText}>
                    #{entry.rank}
                  </Text>
                </View>
                
                <View style={styles.userInfo}>
                  <Avatar.Image
                    size={48}
                    source={{ 
                      uri: entry.user?.photo || entry.avatar_url || "https://github.com/github.png" 
                    }}
                  />
                  <View style={styles.userDetails}>
                    <Text variant="titleMedium" style={styles.username}>
                      {entry.user?.display_name || entry.username}
                      {isCurrentUser && (
                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}> (You)</Text>
                      )}
                    </Text>
                    {(entry.user?.location || entry.country) && (
                      <Text variant="bodySmall" style={styles.country}>
                        {entry.user?.location || entry.country}
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.timeContainer}>
                  <Text variant="headlineSmall" style={styles.timeValue}>
                    {entry.human_readable_total}
                  </Text>
                  <Text variant="bodySmall" style={styles.timeLabel}>
                    Total Time
                  </Text>
                </View>
              </View>

              <View style={styles.languagesContainer}>
                {entry.languages?.map((lang: string, langIndex: number) => (
                  <Chip
                    key={langIndex}
                    mode="outlined"
                    compact
                    style={styles.languageChip}
                  >
                    {lang}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        );
      })}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  periodButton: {
    flex: 1,
  },
  leaderboardCard: {
    marginBottom: 12,
    elevation: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  rankText: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  country: {
    opacity: 0.7,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timeLabel: {
    opacity: 0.7,
    textAlign: 'center',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  languageChip: {
    backgroundColor: 'transparent',
    elevation: 1,
  },
  bottomPadding: {
    height: 24,
  },
});

import { MaterialCommunityIconsName } from "@/utils/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Surface, Text, useTheme } from "react-native-paper";

type GitHubLeaderboardEntry = {
  rank: number;
  username: string;
  avatar_url?: string;
  name?: string;
  followers: number;
  repositories: number;
  stars: number;
  languages: string[];
  contributions: number;
  location?: string;
};

const mockGitHubLeaderboardData: GitHubLeaderboardEntry[] = [
  {
    rank: 1,
    username: "torvalds",
    avatar_url: "https://github.com/torvalds.png",
    name: "Linus Torvalds",
    followers: 180000,
    repositories: 85,
    stars: 250000,
    languages: ["C", "Assembly", "Shell"],
    contributions: 12000,
    location: "Finland",
  },
  {
    rank: 2,
    username: "gaearon",
    avatar_url: "https://github.com/gaearon.png",
    name: "Dan Abramov",
    followers: 120000,
    repositories: 156,
    stars: 180000,
    languages: ["JavaScript", "TypeScript", "Python"],
    contributions: 8500,
    location: "London, UK",
  },
  {
    rank: 3,
    username: "sindresorhus",
    avatar_url: "https://github.com/sindresorhus.png",
    name: "Sindre Sorhus",
    followers: 95000,
    repositories: 1200,
    stars: 160000,
    languages: ["JavaScript", "TypeScript", "Swift"],
    contributions: 15000,
    location: "Norway",
  },
  {
    rank: 4,
    username: "addyosmani",
    avatar_url: "https://github.com/addyosmani.png",
    name: "Addy Osmani",
    followers: 85000,
    repositories: 240,
    stars: 140000,
    languages: ["JavaScript", "HTML", "CSS"],
    contributions: 7800,
    location: "Mountain View, CA",
  },
  {
    rank: 5,
    username: "bradtraversy",
    avatar_url: "https://github.com/bradtraversy.png",
    name: "Brad Traversy",
    followers: 75000,
    repositories: 320,
    stars: 120000,
    languages: ["JavaScript", "PHP", "Python"],
    contributions: 6500,
    location: "Boston, MA",
  },
];

export function GitHubLeaderboardScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'stars' | 'followers' | 'contributions'>('stars');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getRankIcon = (rank: number): MaterialCommunityIconsName => {
    switch (rank) {
      case 1:
        return "trophy";
      case 2:
        return "medal";
      case 3:
        return "medal-outline";
      default:
        return "numeric-1-circle";
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getCategoryValue = (entry: GitHubLeaderboardEntry) => {
    switch (selectedCategory) {
      case 'stars':
        return entry.stars;
      case 'followers':
        return entry.followers;
      case 'contributions':
        return entry.contributions;
      default:
        return entry.stars;
    }
  };

  const getCategoryLabel = () => {
    switch (selectedCategory) {
      case 'stars':
        return 'Total Stars';
      case 'followers':
        return 'Followers';
      case 'contributions':
        return 'Contributions';
      default:
        return 'Total Stars';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>
          GitHub Leaderboard
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Top developers by {getCategoryLabel().toLowerCase()}
        </Text>
      </Surface>

      <Surface style={styles.categorySelector} elevation={0}>
        <View style={styles.categoryButtons}>
          <Button
            mode={selectedCategory === 'stars' ? 'contained' : 'outlined'}
            onPress={() => setSelectedCategory('stars')}
            style={styles.categoryButton}
            icon="star"
          >
            Stars
          </Button>
          <Button
            mode={selectedCategory === 'followers' ? 'contained' : 'outlined'}
            onPress={() => setSelectedCategory('followers')}
            style={styles.categoryButton}
            icon="account-group"
          >
            Followers
          </Button>
          <Button
            mode={selectedCategory === 'contributions' ? 'contained' : 'outlined'}
            onPress={() => setSelectedCategory('contributions')}
            style={styles.categoryButton}
            icon="source-commit"
          >
            Commits
          </Button>
        </View>
      </Surface>

      {mockGitHubLeaderboardData.map((entry, index) => (
        <Card key={index} style={styles.leaderboardCard} mode="elevated">
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
                  source={{ uri: entry.avatar_url || "https://github.com/github.png" }}
                />
                <View style={styles.userDetails}>
                  <Text variant="titleMedium" style={styles.username}>
                    {entry.name || entry.username}
                  </Text>
                  <Text variant="bodySmall" style={styles.handle}>
                    @{entry.username}
                  </Text>
                  {entry.location && (
                    <Text variant="bodySmall" style={styles.location}>
                      📍 {entry.location}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.metricContainer}>
                <Text variant="headlineSmall" style={styles.metricValue}>
                  {formatNumber(getCategoryValue(entry))}
                </Text>
                <Text variant="bodySmall" style={styles.metricLabel}>
                  {getCategoryLabel()}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="source-repository" size={16} color={colors.primary} />
                <Text variant="bodySmall" style={styles.statText}>
                  {entry.repositories} repos
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="account-group" size={16} color={colors.primary} />
                <Text variant="bodySmall" style={styles.statText}>
                  {formatNumber(entry.followers)} followers
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={16} color={colors.primary} />
                <Text variant="bodySmall" style={styles.statText}>
                  {formatNumber(entry.stars)} stars
                </Text>
              </View>
            </View>

            <View style={styles.languagesContainer}>
              {entry.languages.slice(0, 3).map((lang, langIndex) => (
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
      ))}

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
  categorySelector: {
    marginBottom: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryButton: {
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
  handle: {
    opacity: 0.7,
    fontSize: 12,
  },
  location: {
    opacity: 0.6,
    fontSize: 11,
  },
  metricContainer: {
    alignItems: 'center',
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metricLabel: {
    opacity: 0.7,
    textAlign: 'center',
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    opacity: 0.8,
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

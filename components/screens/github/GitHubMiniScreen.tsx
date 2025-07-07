import { GitHubSDK } from "@/lib/api/github/github-sdk";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Text, useTheme } from "react-native-paper";

export function GitHubMiniScreen() {
  const { githubApiKey } = useApiKeysStore();
  const router = useRouter();
  const { colors } = useTheme();

  // GitHub query
  const { data: githubData, isLoading: githubLoading } = useQuery({
    queryKey: ['github-activity', githubApiKey],
    queryFn: async () => {
      if (!githubApiKey) return null;
      const sdk = new GitHubSDK(githubApiKey);
      const [reposResponse, userResponse] = await Promise.all([
        sdk.getRepositories({ sort: 'updated', per_page: 3 }),
        sdk.getCurrentUser()
      ]);
      
      if (reposResponse.data && userResponse.data) {
        return {
          recentRepos: reposResponse.data.map((repo: any) => ({
            name: repo.name,
            updated_at: repo.updated_at,
            language: repo.language
          })),
          totalRepos: userResponse.data.public_repos,
          totalStars: reposResponse.data.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0)
        };
      }
      return null;
    },
    enabled: !!githubApiKey,
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // If no API key is configured, show the add API key prompt
  if (!githubApiKey) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="github" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              GitHub Activity
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            Add your GitHub API key in settings to see activity
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained-tonal" onPress={() => router.push("/api-keys")} icon="key">
            Add API Key
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // If loading, show the loading state
  if (githubLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="github" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              GitHub Activity
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            Loading activity...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // If no data available
  if (!githubData) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="github" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>
              GitHub Activity
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            No data available
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text" onPress={() => router.push("/github")} icon="arrow-right">
            View Details
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // Show data when everything is available
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MaterialCommunityIcons name="github" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={{ marginLeft: 8 }}>
            GitHub Activity
          </Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Avatar.Image 
              size={64} 
              source={{ uri: "https://github.com/tigawanna.png" }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.profileName}>
                Dennis kinuthia
              </Text>
              <Text variant="bodyMedium" style={styles.profileHandle}>
                @tigawanna
              </Text>
            </View>
          </View>
          <Text variant="bodyMedium" style={styles.profileBio}>
            Javascript/Typescript developer, React enthusiast
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="headlineLarge" style={styles.statValue}>
              {githubData.totalRepos}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Repositories
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineLarge" style={styles.statValue}>
              243
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Followers
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="headlineLarge" style={styles.statValue}>
              327
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Following
            </Text>
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.joinedText}>
          Joined GitHub on Sep 29, 2020
        </Text>

        <Text variant="titleSmall" style={styles.sectionTitle}>
          Recent Repositories:
        </Text>
        <View style={styles.reposContainer}>
          {githubData.recentRepos.slice(0, 2).map((repo: any, index: number) => (
            <View key={index} style={styles.repoItem}>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "500" }}>{repo.name}</Text>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                  {formatTimeAgo(repo.updated_at)}
                </Text>
              </View>
              {repo.language && (
                <Chip mode="outlined" compact style={styles.languageChip}>
                  {repo.language}
                </Chip>
              )}
            </View>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" onPress={() => router.push("/github")} icon="arrow-right">
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
    elevation: 4,
  },
  profileSection: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileHandle: {
    opacity: 0.7,
    marginBottom: 0,
  },
  profileBio: {
    opacity: 0.8,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  statLabel: {
    opacity: 0.7,
    fontSize: 12,
    textAlign: 'center',
  },
  joinedText: {
    opacity: 0.6,
    fontSize: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  reposContainer: {
    gap: 4,
  },
  statsContainer: {
    gap: 8,
  },
  repoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  languageChip: {
    backgroundColor: 'transparent',
    elevation: 2,
    height: 28,
  },
});

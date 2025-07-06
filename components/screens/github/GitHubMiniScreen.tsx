import { GitHubSDK } from "@/lib/api/github/github-sdk";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, useTheme } from "react-native-paper";

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
    <Card style={styles.card}>
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MaterialCommunityIcons name="github" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={{ marginLeft: 8 }}>
            GitHub Activity
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="bodyMedium" style={{ flex: 1 }}>Total Repos:</Text>
            <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>{githubData.totalRepos}</Text>
          </View>
          
          <Text variant="bodyMedium" style={{ marginTop: 12, marginBottom: 8, flex: 1 }}>
            Recent Repositories:
          </Text>
          {githubData.recentRepos.slice(0, 2).map((repo: any, index: number) => (
            <View key={index} style={styles.repoItem}>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "500" }}>{repo.name}</Text>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                  {formatTimeAgo(repo.updated_at)}
                </Text>
              </View>
              {repo.language && (
                <Chip mode="outlined" compact>{repo.language}</Chip>
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
});

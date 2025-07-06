import { GitHubSDK } from '@/lib/api/github/github-sdk';
import { useApiKeysStore } from '@/stores/use-app-settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Surface, Text, useTheme } from 'react-native-paper';

type GitHubDetailData = {
  user: {
    login: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
  } | null;
  repositories: {
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    private: boolean;
  }[];
  starredRepos: {
    name: string;
    full_name: string;
    description: string;
    language: string;
    stargazers_count: number;
  }[];
};

export function GitHubScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { githubApiKey } = useApiKeysStore();
  
  const [data, setData] = useState<GitHubDetailData>({ 
    user: null, 
    repositories: [], 
    starredRepos: [] 
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGitHubDetails = useCallback(async () => {
    if (!githubApiKey) return;
    
    try {
      const sdk = new GitHubSDK(githubApiKey);
      
      const [userResponse, reposResponse, starredResponse] = await Promise.all([
        sdk.getCurrentUser(),
        sdk.getRepositories({ sort: 'updated', per_page: 10 }),
        sdk.getStarredRepositories({ per_page: 5 })
      ]);
      
      setData({
        user: userResponse.data,
        repositories: reposResponse.data || [],
        starredRepos: starredResponse.data || []
      });
    } catch (error) {
      console.error('Failed to fetch GitHub details:', error);
    }
  }, [githubApiKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGitHubDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchGitHubDetails();
      setLoading(false);
    };
    loadData();
  }, [fetchGitHubDetails]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  if (!githubApiKey) {
    return (
      <Surface style={styles.container}>
        <View style={styles.noApiContainer}>
          <MaterialCommunityIcons name="github" size={64} color={colors.onSurfaceVariant} />
          <Text variant="headlineSmall" style={styles.noApiTitle}>
            API Key Required
          </Text>
          <Text variant="bodyMedium" style={styles.noApiText}>
            Add your GitHub API key in settings to view your repositories and activity
          </Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/api-keys')}
            style={styles.settingsButton}
          >
            Go to Settings
          </Button>
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
        {/* User Profile */}
        {data.user && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="account-outline" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Profile
                </Text>
              </View>
              
              <Text variant="headlineSmall" style={styles.userName}>
                {data.user.name || data.user.login}
              </Text>
              <Text variant="bodyMedium" style={styles.userLogin}>
                @{data.user.login}
              </Text>
              
              {data.user.bio && (
                <Text variant="bodyMedium" style={styles.userBio}>
                  {data.user.bio}
                </Text>
              )}
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.statNumber}>
                    {data.user.public_repos}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Repositories
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.statNumber}>
                    {data.user.followers}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Followers
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="titleMedium" style={styles.statNumber}>
                    {data.user.following}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Following
                  </Text>
                </View>
              </View>
              
              <Text variant="bodySmall" style={styles.joinDate}>
                Joined GitHub on {formatDate(data.user.created_at)}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Recent Repositories */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="source-repository" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Recent Repositories
              </Text>
            </View>
            
            {data.repositories.length > 0 ? (
              data.repositories.map((repo, index) => (
                <View key={index} style={styles.repoItem}>
                  <View style={styles.repoHeader}>
                    <Text variant="bodyLarge" style={styles.repoName}>
                      {repo.name}
                    </Text>
                    <View style={styles.repoMeta}>
                      {repo.private && (
                        <MaterialCommunityIcons name="lock" size={16} color={colors.onSurfaceVariant} />
                      )}
                      <Text variant="bodySmall" style={styles.repoTime}>
                        {formatTimeAgo(repo.updated_at)}
                      </Text>
                    </View>
                  </View>
                  
                  {repo.description && (
                    <Text variant="bodySmall" style={styles.repoDescription}>
                      {repo.description}
                    </Text>
                  )}
                  
                  <View style={styles.repoStats}>
                    {repo.language && (
                      <Chip mode="outlined" compact style={styles.languageChip}>
                        {repo.language}
                      </Chip>
                    )}
                    <View style={styles.repoCounters}>
                      <View style={styles.counter}>
                        <MaterialCommunityIcons name="star-outline" size={16} color={colors.onSurfaceVariant} />
                        <Text variant="bodySmall" style={styles.counterText}>
                          {repo.stargazers_count}
                        </Text>
                      </View>
                      <View style={styles.counter}>
                        <MaterialCommunityIcons name="source-fork" size={16} color={colors.onSurfaceVariant} />
                        <Text variant="bodySmall" style={styles.counterText}>
                          {repo.forks_count}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text variant="bodyMedium" style={styles.loadingText}>
                {loading ? 'Loading repositories...' : 'No repositories found'}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Starred Repositories */}
        {data.starredRepos.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="star-outline" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Recently Starred
                </Text>
              </View>
              
              {data.starredRepos.map((repo, index) => (
                <View key={index} style={styles.starredItem}>
                  <Text variant="bodyMedium" style={styles.starredName}>
                    {repo.full_name}
                  </Text>
                  {repo.description && (
                    <Text variant="bodySmall" style={styles.starredDescription}>
                      {repo.description}
                    </Text>
                  )}
                  <View style={styles.starredStats}>
                    {repo.language && (
                      <Chip mode="outlined" compact style={styles.languageChip}>
                        {repo.language}
                      </Chip>
                    )}
                    <View style={styles.counter}>
                      <MaterialCommunityIcons name="star" size={16} color={colors.onSurfaceVariant} />
                      <Text variant="bodySmall" style={styles.counterText}>
                        {repo.stargazers_count}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

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
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLogin: {
    opacity: 0.7,
    marginBottom: 8,
  },
  userBio: {
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 2,
  },
  joinDate: {
    opacity: 0.6,
    textAlign: 'center',
  },
  repoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  repoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  repoName: {
    fontWeight: '500',
    flex: 1,
  },
  repoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  repoTime: {
    opacity: 0.6,
  },
  repoDescription: {
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 18,
  },
  repoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageChip: {
    height: 24,
  },
  repoCounters: {
    flexDirection: 'row',
    gap: 12,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  counterText: {
    opacity: 0.7,
  },
  starredItem: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  starredName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  starredDescription: {
    opacity: 0.8,
    marginBottom: 6,
    lineHeight: 18,
  },
  starredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
  noApiContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noApiTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noApiText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  settingsButton: {
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 24,
  },
});

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Avatar, Button, Card, Chip, List, Surface, Text, useTheme } from "react-native-paper";

export default function ExploreScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleWakatimeLeaderboard = () => {
    // Navigate to Wakatime leaderboard browsing
    router.push("/(tabs)/wakatime-leaderboard" as any);
  };

  const handleGitHubLeaderboard = () => {
    // Navigate to GitHub leaderboard browsing
    router.push("/(tabs)/github-leaderboard" as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>
          Explore
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Discover leaderboards and trending content
        </Text>
      </Surface>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Leaderboards
      </Text>

      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <List.Item
            title="Wakatime Leaderboards"
            description="Browse coding time leaderboards and rankings"
            left={(props) => <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={handleWakatimeLeaderboard}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <List.Item
            title="GitHub Leaderboards"
            description="Explore GitHub users, repositories, and trends"
            left={(props) => <MaterialCommunityIcons name="github" size={24} color={theme.colors.primary} />}
            right={(props) => <List.Icon icon="chevron-right" />}
            onPress={handleGitHubLeaderboard}
          />
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Trending Categories
      </Text>

      <Surface style={styles.chipContainer} elevation={0}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}>
          <Chip style={styles.chip} icon="trending-up" onPress={() => {}}>
            Trending
          </Chip>
          <Chip style={styles.chip} icon="star" onPress={() => {}}>
            Most Starred
          </Chip>
          <Chip style={styles.chip} icon="source-fork" onPress={() => {}}>
            Most Forked
          </Chip>
          <Chip style={styles.chip} icon="fire" onPress={() => {}}>
            Hot Repos
          </Chip>
          <Chip style={styles.chip} icon="account-group" onPress={() => {}}>
            Active Users
          </Chip>
        </ScrollView>
      </Surface>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Featured Content
      </Text>

      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="trending-up" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Trending Repositories
          </Text>
          <Text variant="bodyMedium">Discover the most popular repositories this week</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View All</Button>
          <Button mode="contained-tonal" icon="star">
            Star Favorites
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Top Contributors
          </Text>
          <Text variant="bodyMedium">See who&apos;s making the biggest impact in the community</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Rankings</Button>
          <Button mode="contained-tonal" icon="account-plus">
            Follow
          </Button>
        </Card.Actions>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Language Spotlight
      </Text>

      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <Surface style={styles.eventHeader} elevation={0}>
            <Avatar.Icon size={48} icon="language-typescript" />
            <Surface style={styles.eventInfo} elevation={0}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                TypeScript Rising
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                +24% usage this month
              </Text>
            </Surface>
          </Surface>
          <Text variant="bodyMedium">
            TypeScript continues to grow in popularity among developers
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Stats</Button>
          <Button mode="contained" icon="chart-line">
            Explore Trends
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginVertical: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  chipContainer: {
    marginVertical: 16,
  },
  chipScroll: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 4,
  },
  cardContent: {
    gap: 8,
    paddingVertical: 16,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eventInfo: {
    flex: 1,
  },
  dateText: {
    opacity: 0.7,
  },
});

import { LoadingIndicatorDots } from "@/components/shared/state-screens/LoadingIndicatorDots";
import { useCurrentUser } from "@/lib/api/wakatime/use-current-user";
import { wakatimeLeaderboardQueryOptions } from "@/lib/api/wakatime/use-leaderboard";
import { useApiKeysStore } from "@/stores/app-settings-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Surface, Text, useTheme } from "react-native-paper";
import { ExpandableLanguages } from "../../leaderboards/components/ExpandableLanguages";

export function CurrentUserLeaderboardStannnding() {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();

  const { data: currentUserData, isLoading: isCurrentUserLoading } = useCurrentUser(wakatimeApiKey);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    currentUserData?.data?.data?.city?.country_code ?? "KE"
  );

  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: selectedCountry || undefined,
    })
  );

  const currentUserInLeaderboard = (() => {
    if (!leaderboardData) return null;
    
    // Handle new response format with error handling
    if ('type' in leaderboardData) {
      if (leaderboardData.type === "success" && leaderboardData.data?.data) {
        return leaderboardData.data.data.find(
          (entry: any) => entry.user.username === currentUserData?.data?.data?.username
        );
      }
      return null;
    }
    
    // Handle old response format
    const data = (leaderboardData as any)?.data;
    if (data && Array.isArray(data)) {
      return data.find(
        (entry: any) => entry.user.username === currentUserData?.data?.data?.username
      );
    }
    
    return null;
  })();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "trophy";
      case 2:
        return "medal";
      case 3:
        return "medal-outline";
      default:
        return "account";
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return colors.onSurface;
    }
  };

  if (isCurrentUserLoading || isLeaderboardLoading) {
    return (
      <Surface style={styles.container}>
        <LoadingIndicatorDots />
      </Surface>
    );
  }

  if (!currentUserInLeaderboard) {
    return (
      <Surface style={styles.container}>
        <Card style={styles.card} elevation={4}>
          <Card.Content>
            <View style={styles.notFoundContainer}>
              <MaterialCommunityIcons
                name="account-search"
                size={48}
                color={colors.onSurfaceVariant}
              />
              <Text variant="titleMedium" style={styles.notFoundTitle}>
                Not in Leaderboard
              </Text>
              <Text variant="bodyMedium" style={styles.notFoundText}>
                You're not currently ranked in the {selectedCountry ? `${selectedCountry} ` : ""}
                leaderboard. Start coding more to appear here!
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Card style={[styles.card ]} elevation={4}>
        <Card.Title title="# Leaderboard rank this week" />
        <Card.Content>
          <View style={styles.cardContainer}>
            <View style={styles.mainContent}>
              <View style={styles.headerRow}>
                <View style={styles.rankContainer}>
                  <MaterialCommunityIcons
                    name={getRankIcon(currentUserInLeaderboard.rank)}
                    size={32}
                    color={getRankColor(currentUserInLeaderboard.rank)}
                  />
                  <Text variant="titleMedium" style={styles.rankText}>
                    #{currentUserInLeaderboard.rank}
                  </Text>
                </View>

                <Avatar.Image
                  size={48}
                  source={{
                    uri: currentUserInLeaderboard.user?.photo || "https://github.com/github.png",
                  }}
                />

                <View style={styles.userInfo}>
        
                  <Text variant="titleMedium" style={styles.username}>
                    {currentUserInLeaderboard.user?.display_name ||
                      currentUserInLeaderboard.user?.username}
                    <Text style={{ color: colors.primary, fontWeight: "bold" }}> (You)</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.timeRow}>
                <View style={styles.userDetails}>
                  <Text variant="headlineSmall" style={styles.timeValue}>
                    {currentUserInLeaderboard.running_total.human_readable_total}
                  </Text>
                  {(currentUserInLeaderboard.user?.city?.country ||
                    currentUserInLeaderboard.user?.location) && (
                    <Text variant="bodySmall" style={styles.country}>
                      {currentUserInLeaderboard.user?.city?.country ||
                        currentUserInLeaderboard.user?.location}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <ExpandableLanguages languages={currentUserInLeaderboard.running_total.languages || []} />
        </Card.Content>
      </Card>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    padding: 16,
    // marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    width: "100%",
  },
  cardContainer: {
    flexDirection: "column",
    gap: 4,
  },
  mainContent: {
    flex: 1,
    width: "100%",
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  rankText: {
    fontWeight: "bold",
    marginTop: 2,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
  },
  timeRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  timeValue: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  country: {
    opacity: 0.7,
  },
  notFoundContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  notFoundTitle: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  notFoundText: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
});

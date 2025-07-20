import { LeaderboardEntry } from "@/lib/api/wakatime/types/leaderboard-types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";
import { ExpandableLanguages } from "./ExpandableLanguages";

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  index: number;
  currentUser: any;
  getRankIcon: (rank: number) => any;
  getRankColor: (rank: number) => string;
}

export function LeaderboardItem({ entry, index, currentUser, getRankIcon, getRankColor }: LeaderboardItemProps) {
  const { colors } = useTheme();
  
  const isCurrentUser = currentUser && (
    entry.user?.id === currentUser.id || 
    entry.user.username === currentUser.username ||
    entry.user?.display_name === currentUser.display_name
  );

  const handleUserPress = () => {
    if (entry.user?.id) {
      router.push(`/${entry.user.id}`);
    }
  };

  return (
    <Pressable onPress={handleUserPress}>
      <Card
        style={[
          styles.leaderboardCard,
          isCurrentUser && { borderColor: colors.primary, borderWidth: 2 },
        ]}
        elevation={4}>
        <Card.Content>
          <View style={styles.cardContainer}>
            <View style={styles.mainContent}>
              <View style={styles.headerRow}>
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
                <Avatar.Image
                  size={48}
                  source={{
                    uri: entry.user?.photo || "https://github.com/github.png",
                  }}
                />
                <Text variant="titleMedium" style={styles.username}>
                  {entry.user?.display_name || entry.user?.username}
                  {isCurrentUser && (
                    <Text style={{ color: colors.primary, fontWeight: "bold" }}> (You)</Text>
                  )}
                </Text>
              </View>
              <View style={styles.timeRow}>
                <View style={styles.userDetails}>
                  <Text variant="headlineSmall" style={styles.timeValue}>
                    {entry.running_total.human_readable_total}
                  </Text>
                  <View style={{flexDirection: 'row', gap: 4  }}>
                  {(entry.user?.city?.ascii_name) && (
                    <Text variant="bodySmall" style={styles.country}>
                      {entry.user?.city?.ascii_name}
                    </Text>
                  )}
                  {(entry.user?.city?.country || entry.user?.location) && (
                    <Text variant="bodySmall" style={styles.country}>
                      {entry.user?.city?.country || entry.user?.location}
                    </Text>
                  )}

                  </View>
                </View>
              </View>
            </View>
          </View>

          <ExpandableLanguages 
            languages={entry.running_total.languages || []} 
          />
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  leaderboardCard: {
    marginBottom: 12,
    elevation: 4,
  },
  cardContainer: {
    flexDirection: "column",
    gap: 4,
  },
  mainContent: {
    flex: 1,
    width: "100%",
    height: "100%",
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
    fontWeight: 'bold',
    marginTop: 2,
  },
  username: {
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  country: {
    opacity: 0.7,
  },
});

import { LoadingFallback } from "@/components/shared/state-screens/LoadingFallback";
import { NoDataScreen } from "@/components/shared/state-screens/NoDataScreen";
import { TooManyRequestsScreen } from "@/components/shared/state-screens/TooManyRequestsScreen";
import { UnAuthorizedScreen } from "@/components/shared/state-screens/UnAuthorizedScreen";
import { useRandomUser } from "@/lib/api/wakatime/use-current-user";
import { useApiKeysStore } from "@/stores/app-settings-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Chip, Surface, Text, useTheme } from "react-native-paper";

export default function UserDetailsScreen() {
  const { user } = useLocalSearchParams() as { user: string };
  const { wakatimeApiKey } = useApiKeysStore();
  const { colors } = useTheme();

  const {
    data: userDetailsData,
    isLoading,
    error,
  } = useRandomUser({
    wakatimeApiKey,
    username: user,
  });

  // Loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Error handling for specific response types
  if (userDetailsData && "type" in userDetailsData) {
    if (userDetailsData.type === "unauthorized") {
      return <UnAuthorizedScreen />;
    }
    if (userDetailsData.type === "rate_limit_exceeded") {
      return <TooManyRequestsScreen />;
    }
    if (userDetailsData.type === "error") {
      return <NoDataScreen />;
    }
  }

  // Error handling for query errors
  if (error) {
    // Check for 401 Unauthorized
    if (error && "status" in error && error.status === 401) {
      return <UnAuthorizedScreen />;
    }

    // Check for 429 Rate Limit
    if (error && "status" in error && error.status === 429) {
      return <TooManyRequestsScreen />;
    }

    // Check for string-based error messages
    if (error && typeof error === "object" && "message" in error) {
      const message = error.message as string;
      if (message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("401")) {
        return <UnAuthorizedScreen />;
      }
      if (message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("429")) {
        return <TooManyRequestsScreen />;
      }
    }

    return <NoDataScreen />;
  }

  // No data state
  if (!userDetailsData?.data?.data) {
    return <NoDataScreen />;
  }

  const userData = userDetailsData.data.data;

  const openExternalLink = async (url: string, platform: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open ${platform} link`);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open ${platform} link`);
    }
  };

  const getSocialUrl = (platform: string, username: string) => {
    switch (platform) {
      case "github":
        return `https://github.com/${username}`;
      case "twitter":
        return `https://x.com/${username}`;
      case "linkedin":
        return `https://linkedin.com/in/${username}`;
      default:
        return "";
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Stack.Screen
        options={{
          title: userData.display_name || userData.username,
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <Surface style={styles.container}>
        {/* Header Section */}
        <Card style={styles.headerCard} elevation={4}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Image
              size={120}
              source={{
                uri: userData.photo || "https://github.com/github.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text variant="headlineMedium" style={styles.displayName}>
                {userData.display_name || userData.username}
              </Text>
              <Text variant="titleMedium" style={[styles.username, { color: colors.primary }]}>
                @{userData.username}
              </Text>
              {userData.bio && (
                <Text variant="bodyMedium" style={styles.bio}>
                  {userData.bio}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Location & Contact */}
        {(userData.city || userData.website || userData.public_email) && (
          <Card style={styles.infoCard} elevation={2}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Location & Contact
              </Text>
              {userData.city && (
                <View style={styles.infoRow}>
                  <EvilIcons name="external-link" size={20} color={colors.primary} />
                  <Text variant="bodyMedium">
                    {userData.city.name}, {userData.city.state}, {userData.city.country}
                  </Text>
                </View>
              )}
              {userData.website && (
                <Pressable
                  onPress={() => openExternalLink(userData.website, "Website")}
                  style={styles.infoRow}>
                  <MaterialCommunityIcons name="web" size={20} color={colors.primary} />
                  <Text variant="bodyMedium" style={[styles.linkText, { color: colors.primary }]}>
                    {userData.human_readable_website}
                  </Text>
                  <EvilIcons name="external-link" size={20} color={colors.primary} />
                </Pressable>
              )}
              {userData.public_email && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={20} color={colors.primary} />
                  <Text variant="bodyMedium">{userData.public_email}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Social Links */}
        {(userData.github_username || userData.twitter_username || userData.linkedin_username) && (
          <Card style={styles.infoCard} elevation={2}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Social Profiles
              </Text>
              <View style={styles.socialContainer}>
                {userData.github_username && (
                  <Pressable
                    onPress={() =>
                      openExternalLink(getSocialUrl("github", userData.github_username), "GitHub")
                    }
                    style={styles.socialChipContainer}>
                    <Chip icon="github" mode="outlined" style={styles.socialChip}>
                      {userData.github_username}
                    </Chip>
                    <EvilIcons
                      name="external-link"
                      size={20}
                      color={colors.primary}
                      style={styles.externalIcon}
                    />
                  </Pressable>
                )}
                {userData.twitter_username && (
                  <Pressable
                    onPress={() =>
                      openExternalLink(
                        getSocialUrl("twitter", userData.twitter_username),
                        "Twitter"
                      )
                    }
                    style={styles.socialChipContainer}>
                    <Chip icon="twitter" mode="outlined" style={styles.socialChip}>
                      {userData.twitter_username}
                    </Chip>
                    <EvilIcons
                      name="external-link"
                      size={20}
                      color={colors.primary}
                      style={styles.externalIcon}
                    />
                  </Pressable>
                )}
                {userData.linkedin_username && (
                  <Pressable
                    onPress={() =>
                      openExternalLink(
                        getSocialUrl("linkedin", userData.linkedin_username),
                        "LinkedIn"
                      )
                    }
                    style={styles.socialChipContainer}>
                    <Chip icon="linkedin" mode="outlined" style={styles.socialChip}>
                      {userData.linkedin_username}
                    </Chip>
                    <EvilIcons
                      name="external-link"
                      size={20}
                      color={colors.primary}
                      style={styles.externalIcon}
                    />
                  </Pressable>
                )}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Coding Preferences */}

        {/* Account Info */}
        <Card style={styles.infoCard} elevation={2}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account Information
            </Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
              <Text variant="bodyMedium">
                Member since {new Date(userData.created_at).toLocaleDateString()}
              </Text>
            </View>
            {userData.is_hireable && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="briefcase" size={20} color={colors.primary} />
                <Text variant="bodyMedium">Available for hire</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </Surface>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  headerContent: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  userInfo: {
    alignItems: "center",
    width: "100%",
  },
  displayName: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  username: {
    fontWeight: "600",
    marginBottom: 8,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    opacity: 0.8,
  },
  infoCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  socialContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  socialChipContainer: {
    position: "relative",
    marginBottom: 4,
  },
  socialChip: {
    marginBottom: 4,
  },
  externalIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 10,
    padding: 2,
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  preferenceChip: {
    marginBottom: 4,
  },
});

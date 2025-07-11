import { wakatimeLeaderboardQueryOptions } from '@/lib/api/wakatime/use-leaderboard';
import { fetchCurrentUser } from '@/lib/api/wakatime/wakatime-sdk';

import { useApiKeysStore } from '@/stores/use-app-settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

export function CurrentUserLeaderboardPosition() {
  const { colors } = useTheme();
  const { wakatimeApiKey } = useApiKeysStore();
  const router = useRouter();

  // Get current user data
  const { data: currentUserData } = useQuery({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) return null;
      return await fetchCurrentUser(wakatimeApiKey);
    },
    enabled: !!wakatimeApiKey,
  });

  // Get leaderboard data
  const { data: leaderboardData } = useQuery(
    wakatimeLeaderboardQueryOptions({
      wakatimeApiKey,
      country: currentUserData?.data?.location || undefined,
    })
  );
  // console.log("Leaderboard Data:===>", leaderboardData);

  // Find current user position
  const currentUser = currentUserData?.data;
  const leaderboard = leaderboardData?.data || [];
  const currentUserPosition = leaderboard.findIndex((entry: any) => 
    entry.user?.id === currentUser?.id || 
    entry.user?.display_name === currentUser?.display_name ||
    entry.username === currentUser?.username
  );

  const userEntry = currentUserPosition >= 0 ? leaderboard[currentUserPosition] : null;

  if (!wakatimeApiKey || !userEntry) {
    return null;
  }

  const handlePress = () => {
    router.push('/leaderboard#user-position');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons name="trophy" size={20} color={colors.primary} />
            <Text variant="titleSmall" style={styles.title}>
              Your Leaderboard Position
            </Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.position}>
              <Text variant="headlineSmall" style={[styles.rank, { color: colors.primary }]}>
                #{userEntry.rank}
              </Text>
              <Text variant="bodySmall" style={styles.positionLabel}>
                {currentUser?.location ? `in ${currentUser.location}` : 'Global'}
              </Text>
            </View>
            
            <View style={styles.stats}>
              <Text variant="bodyMedium" style={styles.timeValue}>
                {userEntry.running_total.human_readable_total}
              </Text>
              <Text variant="bodySmall" style={styles.timeLabel}>
                This week
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.tapHint}>
              Tap to view full leaderboard
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.onSurfaceVariant} />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  position: {
    alignItems: 'flex-start',
  },
  rank: {
    fontWeight: 'bold',
  },
  positionLabel: {
    opacity: 0.7,
    marginTop: 2,
  },
  stats: {
    alignItems: 'flex-end',
  },
  timeValue: {
    fontWeight: '600',
  },
  timeLabel: {
    opacity: 0.7,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  tapHint: {
    opacity: 0.6,
    fontSize: 12,
  },
});

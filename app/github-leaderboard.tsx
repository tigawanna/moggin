import { GitHubLeaderboardScreen } from '@/components/screens/leaderboards/GitHubLeaderboardScreen';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function GitHubLeaderboard() {
    const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ 
        title: 'GitHub Leaderboard',
        headerBackTitle: 'Explore',
        headerStyle: {
            backgroundColor: colors.surface,
          },
      }} />
      <GitHubLeaderboardScreen />
    </>
  );
}

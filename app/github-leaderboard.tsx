import { GitHubLeaderboardScreen } from '@/components/screens/leaderboards/GitHubLeaderboardScreen';
import { Stack } from 'expo-router';

export default function GitHubLeaderboard() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'GitHub Leaderboard',
        headerBackTitle: 'Explore'
      }} />
      <GitHubLeaderboardScreen />
    </>
  );
}
